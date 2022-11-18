/*
 * Copyright 2010-2020 Gildas Lormeau
 * contact : gildas.lormeau <at> gmail.com
 *
 * This file is part of SingleFile.
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

/* global browser, infobar, document, URL, Blob, MouseEvent, setTimeout, open */

export { downloadPage };

async function downloadPage(pageData, options) {
  let blobURL;
  try {
    if (options.includeBOM) {
      pageData.content = "\ufeff" + pageData.content;
    }
    if (options.includeInfobar) {
      await infobar.includeScript(pageData);
    }
    if (
      options.backgroundSave ||
      options.openEditor ||
      options.saveToArkWsites
    ) {
      blobURL = getContentBlobURL(pageData);
      const message = {
        method: "downloads.download",
        taskId: options.taskId,
        confirmFilename: options.confirmFilename,
        filenameConflictAction: options.filenameConflictAction,
        filename: pageData.filename,
        saveToArkWsites: options.saveToArkWsites,
        ArkWsitesToken: options.ArkWsitesToken,
        forceWebAuthFlow: options.forceWebAuthFlow,
        filenameReplacementCharacter: options.filenameReplacementCharacter,
        openEditor: options.openEditor,
        openSavedPage: options.openSavedPage,
        compressHTML: options.compressHTML,
        backgroundSave: options.backgroundSave,
        bookmarkId: options.bookmarkId,
        replaceBookmarkURL: options.replaceBookmarkURL,
        applySystemTheme: options.applySystemTheme,
        defaultEditorMode: options.defaultEditorMode,
        includeInfobar: options.includeInfobar,
        warnUnsavedPage: options.warnUnsavedPage,
        content: blobURL,
      };
      await browser.runtime.sendMessage(message);
    } else {
      blobURL = getContentBlobURL(pageData);
      await downloadPageForeground(pageData, blobURL);

      if (options.openSavedPage) {
        open(getContentBlobURL(pageData));
      }
      browser.runtime.sendMessage({ method: "ui.processEnd" });
    }
    await browser.runtime.sendMessage({
      method: "downloads.end",
      taskId: options.taskId,
      hash: pageData.hash,
      woleetKey: options.woleetKey,
    });
  } finally {
    if (blobURL) {
      URL.revokeObjectURL(blobURL);
    }
  }
}

async function downloadPageForeground(pageData, blobURL) {
  if (pageData.filename && pageData.filename.length) {
    const link = document.createElement("a");
    link.download = pageData.filename;
    link.href = blobURL;
    link.dispatchEvent(new MouseEvent("click"));
  }
  return new Promise((resolve) => setTimeout(resolve, 1));
}

function getContentBlobURL(pageData) {
  return URL.createObjectURL(
    new Blob([pageData.content], { type: "text/html" })
  );
}
