/*
 * Copyright 2010-2020 Gildas Lormeau
 * contact : gildas.lormeau <at> gmail.com
 *
 * This file is part of ArkWsaver.
 *
 *   The code in this file is free software: you can redistribute it and/or
 *   modify it under the terms of the GNU Affero General Public License
 *   (GNU AGPL) as published by the Free Software Foundation, either version 3
 *   of the License, or (at your option) any later version.
 *
 *   The code in this file is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero
 *   General Public License for more details.
 *
 *   As additional permission under GNU AGPL version 3 section 7, you may
 *   distribute UNMODIFIED VERSIONS OF THIS file without the copy of the GNU
 *   AGPL normally required by section 4, provided you include this license
 *   notice and a URL through which recipients can access the Corresponding
 *   Source.
 */

/* global browser, fetch, btoa, AbortController */

import * as config from "./config.js";
import * as bookmarks from "./bookmarks.js";
import * as business from "./business.js";
import * as editor from "./editor.js";
import { launchWebAuthFlow, extractAuthCode } from "./tabs-util.js";
import * as ui from "./../../ui/bg/index.js";
import * as woleet from "./../../lib/woleet/woleet.js";
import { pushArkWsites } from "../../lib/arkwsites/arkwsites.js";
import { download } from "./download-util.js";

const CONFLICT_ACTION_SKIP = "skip";
const CONFLICT_ACTION_UNIQUIFY = "uniquify";
const REGEXP_ESCAPE = /([{}()^$&.*?/+|[\\\\]|\]|-)/g;

export { onMessage, downloadPage, saveToArkWsites, encodeSharpCharacter };

async function onMessage(message, sender) {
  if (message.method.endsWith(".download")) {
    return downloadTabPage(message, sender.tab);
  }
  if (message.method.endsWith(".end")) {
    if (message.hash) {
      try {
        await woleet.anchor(message.hash, message.woleetKey);
      } catch (error) {
        ui.onError(sender.tab.id, error.message, error.link);
      }
    }
    business.onSaveEnd(message.taskId);
    return {};
  }
  if (message.method.endsWith(".getInfo")) {
    return business.getTasksInfo();
  }
  if (message.method.endsWith(".cancel")) {
    business.cancelTask(message.taskId);
    return {};
  }
  if (message.method.endsWith(".cancelAll")) {
    business.cancelAllTasks();
    return {};
  }
  if (message.method.endsWith(".saveUrls")) {
    business.saveUrls(message.urls);
    return {};
  }
}

async function downloadTabPage(message, tab) {
  if (message.openEditor) {
    ui.onEdit(tab.id);
    await editor.open({
      tabIndex: tab.index + 1,
      filename: message.filename,
      content: await (await fetch(message.content)).text(),
    });
  } else {
    await downloadContent(tab, tab.incognito, message);
  }
  return {};
}

async function downloadContent(tab, incognito, message) {
  try {
    if (message.saveToArkWsites) {
      const pageContent = await (await fetch(message.content)).text();
      await (
        await saveToArkWsites(
          message.taskId,
          encodeSharpCharacter(message.filename),
          [pageContent],
          message.ArkWsitesToken
        )
      ).pushPromise;
    } else {
      message.url = message.content;
      await downloadPage(message, {
        confirmFilename: message.confirmFilename,
        incognito,
        filenameConflictAction: message.filenameConflictAction,
        filenameReplacementCharacter: message.filenameReplacementCharacter,
        includeInfobar: message.includeInfobar,
      });
    }
    ui.onEnd(tab.id);
    if (message.openSavedPage) {
      const createTabProperties = { active: true, url: message.content };
      if (tab.index != null) {
        createTabProperties.index = tab.index + 1;
      }
      browser.tabs.create(createTabProperties);
    }
  } catch (error) {
    if (!error.message || error.message != "upload_cancelled") {
      console.error(error); // eslint-disable-line no-console
      ui.onError(tab.id, error.message, error.link);
    }
  }
}

function encodeSharpCharacter(path) {
  return path.replace(/#/g, "%23");
}

function getRegExp(string) {
  return string.replace(REGEXP_ESCAPE, "\\$1");
}

async function saveToArkWsites(taskId, filename, content, ArkWsitesToken) {
  const taskInfo = business.getTaskInfo(taskId);
  if (!taskInfo || !taskInfo.cancelled) {
    const pushInfo = pushArkWsites(ArkWsitesToken, filename, content);
    business.setCancelCallback(taskId, pushInfo.cancelPush);
    try {
      await (
        await pushInfo
      ).pushPromise;
      return pushInfo;
    } catch (error) {
      throw new Error(error.message + " (ArkWsites)");
    }
  }
}

async function downloadPage(pageData, options) {
  const filenameConflictAction = options.filenameConflictAction;
  let skipped;
  if (filenameConflictAction == CONFLICT_ACTION_SKIP) {
    const downloadItems = await browser.downloads.search({
      filenameRegex: "(\\\\|/)" + getRegExp(pageData.filename) + "$",
      exists: true,
    });
    if (downloadItems.length) {
      skipped = true;
    } else {
      options.filenameConflictAction = CONFLICT_ACTION_UNIQUIFY;
    }
  }
  if (!skipped) {
    const downloadInfo = {
      url: pageData.url,
      saveAs: options.confirmFilename,
      filename: pageData.filename,
      conflictAction: options.filenameConflictAction,
    };
    if (options.incognito) {
      downloadInfo.incognito = true;
    }
    const downloadData = await download(
      downloadInfo,
      options.filenameReplacementCharacter
    );
    if (
      downloadData.filename &&
      pageData.bookmarkId &&
      pageData.replaceBookmarkURL
    ) {
      if (!downloadData.filename.startsWith("file:")) {
        if (downloadData.filename.startsWith("/")) {
          downloadData.filename = downloadData.filename.substring(1);
        }
        downloadData.filename =
          "file:///" + encodeSharpCharacter(downloadData.filename);
      }
      await bookmarks.update(pageData.bookmarkId, {
        url: downloadData.filename,
      });
    }
  }
}
