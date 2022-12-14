(function () {
  "use strict";

  /*
   * Copyright 2010-2020 Gildas Lormeau
   * contact : gildas.lormeau <at> gmail.com
   *
   * This file is part of arkWsaver.
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

  /* global globalThis, window */

  if (typeof globalThis == "undefined") {
    window.globalThis = window;
  }

  (() => {
    if (!globalThis.browser && globalThis.chrome) {
      const nativeAPI = globalThis.chrome;
      globalThis.__defineGetter__("browser", () => ({
        action: {
          onClicked: {
            addListener: (listener) =>
              nativeAPI.action.onClicked.addListener(listener),
          },
          setBadgeText: (options) => nativeAPI.action.setBadgeText(options),
          setBadgeBackgroundColor: (options) =>
            nativeAPI.action.setBadgeBackgroundColor(options),
          setTitle: (options) => nativeAPI.action.setTitle(options),
          setIcon: (options) => nativeAPI.action.setIcon(options),
        },
        bookmarks: {
          get: (id) => nativeAPI.bookmarks.get(id),
          onCreated: {
            addListener: (listener) =>
              nativeAPI.bookmarks.onCreated.addListener(listener),
            removeListener: (listener) =>
              nativeAPI.bookmarks.onCreated.removeListener(listener),
          },
          onChanged: {
            addListener: (listener) =>
              nativeAPI.bookmarks.onChanged.addListener(listener),
            removeListener: (listener) =>
              nativeAPI.bookmarks.onChanged.removeListener(listener),
          },
          onMoved: {
            addListener: (listener) =>
              nativeAPI.bookmarks.onMoved.addListener(listener),
            removeListener: (listener) =>
              nativeAPI.bookmarks.onMoved.removeListener(listener),
          },
          update: (id, changes) => nativeAPI.bookmarks.update(id, changes),
        },
        commands: {
          onCommand: {
            addListener: (listener) =>
              nativeAPI.commands.onCommand.addListener(listener),
          },
        },
        downloads: {
          download: (options) => nativeAPI.downloads.download(options),
          onChanged: {
            addListener: (listener) =>
              nativeAPI.downloads.onChanged.addListener(listener),
            removeListener: (listener) =>
              nativeAPI.downloads.onChanged.removeListener(listener),
          },
          search: (query) => nativeAPI.downloads.search(query),
        },
        i18n: {
          getMessage: (messageName, substitutions) =>
            nativeAPI.i18n.getMessage(messageName, substitutions),
        },
        identity: {
          getRedirectURL() {
            return nativeAPI.identity.getRedirectURL();
          },
          get getAuthToken() {
            return (
              nativeAPI.identity &&
              nativeAPI.identity.getAuthToken &&
              ((details) =>
                new Promise((resolve, reject) =>
                  nativeAPI.identity.getAuthToken(details, (token) => {
                    if (nativeAPI.runtime.lastError) {
                      reject(nativeAPI.runtime.lastError);
                    } else {
                      resolve(token);
                    }
                  })
                ))
            );
          },
          get launchWebAuthFlow() {
            return (
              nativeAPI.identity &&
              nativeAPI.identity.launchWebAuthFlow &&
              ((options) =>
                new Promise((resolve, reject) => {
                  nativeAPI.identity.launchWebAuthFlow(
                    options,
                    (responseUrl) => {
                      if (nativeAPI.runtime.lastError) {
                        reject(nativeAPI.runtime.lastError);
                      } else {
                        resolve(responseUrl);
                      }
                    }
                  );
                }))
            );
          },
          get removeCachedAuthToken() {
            return (
              nativeAPI.identity &&
              nativeAPI.identity.removeCachedAuthToken &&
              ((details) =>
                new Promise((resolve, reject) =>
                  nativeAPI.identity.removeCachedAuthToken(details, () => {
                    if (nativeAPI.runtime.lastError) {
                      reject(nativeAPI.runtime.lastError);
                    } else {
                      resolve();
                    }
                  })
                ))
            );
          },
        },
        contextMenus: {
          onClicked: {
            addListener: (listener) =>
              nativeAPI.contextMenus.onClicked.addListener(listener),
          },
          create: (options) => nativeAPI.contextMenus.create(options),
          update: (menuItemId, options) =>
            new Promise((resolve, reject) => {
              nativeAPI.contextMenus.update(menuItemId, options, () => {
                if (nativeAPI.runtime.lastError) {
                  reject(nativeAPI.runtime.lastError);
                } else {
                  resolve();
                }
              });
            }),
          removeAll: () =>
            new Promise((resolve, reject) => {
              nativeAPI.contextMenus.removeAll(() => {
                if (nativeAPI.runtime.lastError) {
                  reject(nativeAPI.runtime.lastError);
                } else {
                  resolve();
                }
              });
            }),
        },
        permissions: {
          request: (permissions) => nativeAPI.permissions.request(permissions),
          remove: (permissions) => nativeAPI.permissions.remove(permissions),
        },
        runtime: {
          sendNativeMessage: (application, message) =>
            new Promise((resolve, reject) => {
              nativeAPI.runtime.sendNativeMessage(
                application,
                message,
                (result) => {
                  if (nativeAPI.runtime.lastError) {
                    reject(nativeAPI.runtime.lastError);
                  } else {
                    resolve(result);
                  }
                }
              );
            }),
          getManifest: () => nativeAPI.runtime.getManifest(),
          onMessage: {
            addListener: (listener) =>
              nativeAPI.runtime.onMessage.addListener(
                (message, sender, sendResponse) => {
                  const response = listener(message, sender);
                  if (response && typeof response.then == "function") {
                    response.then((response) => {
                      if (response !== undefined) {
                        try {
                          sendResponse(response);
                        } catch (error) {
                          // ignored
                        }
                      }
                    });
                    return true;
                  }
                }
              ),
            removeListener: (listener) =>
              nativeAPI.runtime.onMessage.removeListener(listener),
          },
          onMessageExternal: {
            addListener: (listener) =>
              nativeAPI.runtime.onMessageExternal.addListener(
                (message, sender, sendResponse) => {
                  const response = listener(message, sender);
                  if (response && typeof response.then == "function") {
                    response.then((response) => {
                      if (response !== undefined) {
                        try {
                          sendResponse(response);
                        } catch (error) {
                          // ignored
                        }
                      }
                    });
                    return true;
                  }
                }
              ),
          },
          sendMessage: (message) => nativeAPI.runtime.sendMessage(message),
          getURL: (path) => nativeAPI.runtime.getURL(path),
          get lastError() {
            return nativeAPI.runtime.lastError;
          },
        },
        scripting: {
          executeScript: (injection) =>
            nativeAPI.scripting.executeScript(injection),
        },
        storage: {
          local: {
            set: (value) =>
              new Promise((resolve, reject) => {
                nativeAPI.storage.local.set(value, () => {
                  if (nativeAPI.runtime.lastError) {
                    reject(nativeAPI.runtime.lastError);
                  } else {
                    resolve();
                  }
                });
              }),
            get: () =>
              new Promise((resolve, reject) => {
                nativeAPI.storage.local.get(null, (value) => {
                  if (nativeAPI.runtime.lastError) {
                    reject(nativeAPI.runtime.lastError);
                  } else {
                    resolve(value);
                  }
                });
              }),
            clear: () =>
              new Promise((resolve, reject) => {
                nativeAPI.storage.local.clear(() => {
                  if (nativeAPI.runtime.lastError) {
                    reject(nativeAPI.runtime.lastError);
                  } else {
                    resolve();
                  }
                });
              }),
            remove: (keys) =>
              new Promise((resolve, reject) => {
                nativeAPI.storage.local.remove(keys, () => {
                  if (nativeAPI.runtime.lastError) {
                    reject(nativeAPI.runtime.lastError);
                  } else {
                    resolve();
                  }
                });
              }),
          },
          sync: {
            set: (value) =>
              new Promise((resolve, reject) => {
                nativeAPI.storage.sync.set(value, () => {
                  if (nativeAPI.runtime.lastError) {
                    reject(nativeAPI.runtime.lastError);
                  } else {
                    resolve();
                  }
                });
              }),
            get: () =>
              new Promise((resolve, reject) => {
                nativeAPI.storage.sync.get(null, (value) => {
                  if (nativeAPI.runtime.lastError) {
                    reject(nativeAPI.runtime.lastError);
                  } else {
                    resolve(value);
                  }
                });
              }),
            clear: () =>
              new Promise((resolve, reject) => {
                nativeAPI.storage.sync.clear(() => {
                  if (nativeAPI.runtime.lastError) {
                    reject(nativeAPI.runtime.lastError);
                  } else {
                    resolve();
                  }
                });
              }),
            remove: (keys) =>
              new Promise((resolve, reject) => {
                nativeAPI.storage.sync.remove(keys, () => {
                  if (nativeAPI.runtime.lastError) {
                    reject(nativeAPI.runtime.lastError);
                  } else {
                    resolve();
                  }
                });
              }),
          },
        },
        tabs: {
          onCreated: {
            addListener: (listener) =>
              nativeAPI.tabs.onCreated.addListener(listener),
          },
          onActivated: {
            addListener: (listener) =>
              nativeAPI.tabs.onActivated.addListener(listener),
          },
          onUpdated: {
            addListener: (listener) =>
              nativeAPI.tabs.onUpdated.addListener(listener),
            removeListener: (listener) =>
              nativeAPI.tabs.onUpdated.removeListener(listener),
          },
          onRemoved: {
            addListener: (listener) =>
              nativeAPI.tabs.onRemoved.addListener(listener),
            removeListener: (listener) =>
              nativeAPI.tabs.onRemoved.removeListener(listener),
          },
          onReplaced: {
            addListener: (listener) =>
              nativeAPI.tabs.onReplaced.addListener(listener),
            removeListener: (listener) =>
              nativeAPI.tabs.onReplaced.removeListener(listener),
          },
          sendMessage: (tabId, message, options = {}) =>
            nativeAPI.tabs.sendMessage(tabId, message, options),
          query: (options) => nativeAPI.tabs.query(options),
          create: (createProperties) => nativeAPI.tabs.create(createProperties),
          get: (options) => nativeAPI.tabs.get(options),
          remove: (tabId) => nativeAPI.tabs.remove(tabId),
          update: (tabId, updateProperties) =>
            nativeAPI.tabs.update(tabId, updateProperties),
        },
        devtools: nativeAPI.devtools && {
          inspectedWindow: nativeAPI.devtools.inspectedWindow && {
            onResourceContentCommitted: nativeAPI.devtools.inspectedWindow
              .onResourceContentCommitted && {
              addListener: (listener) =>
                nativeAPI.devtools.inspectedWindow.onResourceContentCommitted.addListener(
                  listener
                ),
            },
            get tabId() {
              return nativeAPI.devtools.inspectedWindow.tabId;
            },
          },
        },
        offscreen: nativeAPI.offscreen && {
          createDocument: (parameters) =>
            nativeAPI.offscreen.createDocument(parameters),
          hasDocument: () => nativeAPI.offscreen.hasDocument(),
        },
      }));
    }
  })();

  /*
   * Copyright 2010-2020 Gildas Lormeau
   * contact : gildas.lormeau <at> gmail.com
   *
   * This file is part of arkWsaver.
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

  /* global browser, fetch */

  const MAX_CONTENT_SIZE$1 = 8 * (1024 * 1024);

  browser.runtime.onMessage.addListener((message, sender) => {
    if (message.method && message.method.startsWith("arkWsaver.fetch")) {
      return new Promise((resolve) => {
        onRequest(message, sender)
          .then(resolve)
          .catch((error) => resolve({ error: error && error.toString() }));
      });
    }
  });

  async function onRequest(message, sender) {
    if (message.method == "arkWsaver.fetch") {
      try {
        const response = await fetchResource(message.url, {
          headers: message.headers,
        });
        return sendResponse(sender.tab.id, message.requestId, response);
      } catch (error) {
        return sendResponse(sender.tab.id, message.requestId, {
          error: error.message,
          arrray: [],
        });
      }
    } else if (message.method == "arkWsaver.fetchFrame") {
      return browser.tabs.sendMessage(sender.tab.id, message);
    }
  }

  async function sendResponse(tabId, requestId, response) {
    for (
      let blockIndex = 0;
      blockIndex * MAX_CONTENT_SIZE$1 <= response.array.length;
      blockIndex++
    ) {
      const message = {
        method: "arkWsaver.fetchResponse",
        requestId,
        headers: response.headers,
        status: response.status,
        error: response.error,
      };
      message.truncated = response.array.length > MAX_CONTENT_SIZE$1;
      if (message.truncated) {
        message.finished =
          (blockIndex + 1) * MAX_CONTENT_SIZE$1 > response.array.length;
        message.array = response.array.slice(
          blockIndex * MAX_CONTENT_SIZE$1,
          (blockIndex + 1) * MAX_CONTENT_SIZE$1
        );
      } else {
        message.array = response.array;
      }
      await browser.tabs.sendMessage(tabId, message);
    }
    return {};
  }

  async function fetchResource(url, options = {}) {
    const response = await fetch(url, options);
    const array = Array.from(new Uint8Array(await response.arrayBuffer()));
    const headers = { "content-type": response.headers.get("content-type") };
    const status = response.status;
    return {
      array,
      headers,
      status,
    };
  }

  /*
   * Copyright 2010-2020 Gildas Lormeau
   * contact : gildas.lormeau <at> gmail.com
   *
   * This file is part of arkWsaver.
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

  /* global browser */

  browser.runtime.onMessage.addListener((message, sender) => {
    if (
      message.method == "arkWsaver.frameTree.initResponse" ||
      message.method == "arkWsaver.frameTree.ackInitRequest"
    ) {
      browser.tabs.sendMessage(sender.tab.id, message, { frameId: 0 });
      return Promise.resolve({});
    }
  });

  /*
   * Copyright 2010-2020 Gildas Lormeau
   * contact : gildas.lormeau <at> gmail.com
   *
   * This file is part of arkWsaver.
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

  /* global browser, setTimeout, clearTimeout */

  const timeouts = new Map();

  browser.runtime.onMessage.addListener((message, sender) => {
    if (message.method == "arkWsaver.lazyTimeout.setTimeout") {
      let tabTimeouts = timeouts.get(sender.tab.id);
      let frameTimeouts;
      if (tabTimeouts) {
        frameTimeouts = tabTimeouts.get(sender.frameId);
        if (frameTimeouts) {
          const previousTimeoutId = frameTimeouts.get(message.type);
          if (previousTimeoutId) {
            clearTimeout(previousTimeoutId);
          }
        } else {
          frameTimeouts = new Map();
        }
      }
      const timeoutId = setTimeout(async () => {
        try {
          const tabTimeouts = timeouts.get(sender.tab.id);
          const frameTimeouts = tabTimeouts.get(sender.frameId);
          if (tabTimeouts && frameTimeouts) {
            deleteTimeout(frameTimeouts, message.type);
          }
          await browser.tabs.sendMessage(sender.tab.id, {
            method: "arkWsaver.lazyTimeout.onTimeout",
            type: message.type,
          });
        } catch (error) {
          // ignored
        }
      }, message.delay);
      if (!tabTimeouts) {
        tabTimeouts = new Map();
        frameTimeouts = new Map();
        tabTimeouts.set(sender.frameId, frameTimeouts);
        timeouts.set(sender.tab.id, tabTimeouts);
      }
      frameTimeouts.set(message.type, timeoutId);
      return Promise.resolve({});
    }
    if (message.method == "arkWsaver.lazyTimeout.clearTimeout") {
      let tabTimeouts = timeouts.get(sender.tab.id);
      if (tabTimeouts) {
        const frameTimeouts = tabTimeouts.get(sender.frameId);
        if (frameTimeouts) {
          const timeoutId = frameTimeouts.get(message.type);
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
          deleteTimeout(frameTimeouts, message.type);
        }
      }
      return Promise.resolve({});
    }
  });

  browser.tabs.onRemoved.addListener((tabId) => timeouts.delete(tabId));

  function deleteTimeout(framesTimeouts, type) {
    framesTimeouts.delete(type);
  }

  /*
   * Copyright 2010-2020 Gildas Lormeau
   * contact : gildas.lormeau <at> gmail.com
   *
   * This file is part of arkWsaver.
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

  /* global browser */

  const STATE_DOWNLOAD_COMPLETE = "complete";
  const STATE_DOWNLOAD_INTERRUPTED = "interrupted";
  const STATE_ERROR_CANCELED_CHROMIUM = "USER_CANCELED";
  const ERROR_DOWNLOAD_CANCELED_GECKO = "canceled";
  const ERROR_CONFLICT_ACTION_GECKO =
    "conflictaction prompt not yet implemented";
  const ERROR_INCOGNITO_GECKO = "'incognito'";
  const ERROR_INCOGNITO_GECKO_ALT = '"incognito"';
  const ERROR_INVALID_FILENAME_GECKO = "illegal characters";
  const ERROR_INVALID_FILENAME_CHROMIUM = "invalid filename";

  async function download(downloadInfo, replacementCharacter) {
    let downloadId;
    try {
      downloadId = await browser.downloads.download(downloadInfo);
    } catch (error) {
      if (error.message) {
        const errorMessage = error.message.toLowerCase();
        const invalidFilename =
          errorMessage.includes(ERROR_INVALID_FILENAME_GECKO) ||
          errorMessage.includes(ERROR_INVALID_FILENAME_CHROMIUM);
        if (invalidFilename && downloadInfo.filename.startsWith(".")) {
          downloadInfo.filename = replacementCharacter + downloadInfo.filename;
          return download(downloadInfo, replacementCharacter);
        } else if (invalidFilename && downloadInfo.filename.includes(",")) {
          downloadInfo.filename = downloadInfo.filename.replace(
            /,/g,
            replacementCharacter
          );
          return download(downloadInfo, replacementCharacter);
        } else if (
          invalidFilename &&
          !downloadInfo.filename.match(/^[\x00-\x7F]+$/)
        ) {
          // eslint-disable-line  no-control-regex
          downloadInfo.filename = downloadInfo.filename.replace(
            /[^\x00-\x7F]+/g,
            replacementCharacter
          ); // eslint-disable-line  no-control-regex
          return download(downloadInfo, replacementCharacter);
        } else if (
          (errorMessage.includes(ERROR_INCOGNITO_GECKO) ||
            errorMessage.includes(ERROR_INCOGNITO_GECKO_ALT)) &&
          downloadInfo.incognito
        ) {
          delete downloadInfo.incognito;
          return download(downloadInfo, replacementCharacter);
        } else if (
          errorMessage == ERROR_CONFLICT_ACTION_GECKO &&
          downloadInfo.conflictAction
        ) {
          delete downloadInfo.conflictAction;
          return download(downloadInfo, replacementCharacter);
        } else if (errorMessage.includes(ERROR_DOWNLOAD_CANCELED_GECKO)) {
          return {};
        } else {
          throw error;
        }
      } else {
        throw error;
      }
    }
    return new Promise((resolve, reject) => {
      browser.downloads.onChanged.addListener(onChanged);

      function onChanged(event) {
        if (event.id == downloadId && event.state) {
          if (event.state.current == STATE_DOWNLOAD_COMPLETE) {
            browser.downloads
              .search({ id: downloadId })
              .then((downloadItems) =>
                resolve({
                  filename: downloadItems[0] && downloadItems[0].filename,
                })
              )
              .catch(() => resolve({}));
            browser.downloads.onChanged.removeListener(onChanged);
          }
          if (event.state.current == STATE_DOWNLOAD_INTERRUPTED) {
            if (
              event.error &&
              event.error.current == STATE_ERROR_CANCELED_CHROMIUM
            ) {
              resolve({});
            } else {
              reject(new Error(event.state.current));
            }
            browser.downloads.onChanged.removeListener(onChanged);
          }
        }
      }
    });
  }

  /*
   * Copyright 2010-2020 Gildas Lormeau
   * contact : gildas.lormeau <at> gmail.com
   *
   * This file is part of arkWsaver.
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

  /* global browser, setTimeout */

  let persistentData, temporaryData, cleanedUp;
  setTimeout(
    () => getPersistent().then((tabsData) => (persistentData = tabsData)),
    0
  );

  function onMessage$c(message) {
    if (message.method.endsWith(".get")) {
      return getPersistent();
    }
    if (message.method.endsWith(".set")) {
      return setPersistent(message.tabsData);
    }
  }

  async function onTabReplaced$3(addedTabId, removedTabId) {
    let tabsData = await getPersistent();
    await updateTabsData(tabsData, addedTabId, removedTabId);
    setPersistent(tabsData);
    await updateTabsData(temporaryData, addedTabId, removedTabId);
  }

  async function updateTabsData(tabsData, addedTabId, removedTabId) {
    if (tabsData[removedTabId] && !tabsData[addedTabId]) {
      tabsData[addedTabId] = tabsData[removedTabId];
      delete tabsData[removedTabId];
    }
  }

  async function remove(tabId) {
    if (temporaryData) {
      delete temporaryData[tabId];
    }
    const tabsData = await getPersistent();
    if (tabsData[tabId]) {
      const autoSave = tabsData[tabId].autoSave;
      tabsData[tabId] = { autoSave };
      await setPersistent(tabsData);
    }
  }

  function getTemporary(desiredTabId) {
    if (!temporaryData) {
      temporaryData = {};
    }
    if (desiredTabId !== undefined && !temporaryData[desiredTabId]) {
      temporaryData[desiredTabId] = {};
    }
    return temporaryData;
  }

  async function getPersistent(desiredTabId) {
    if (!persistentData) {
      const config = await browser.storage.local.get();
      persistentData = config.tabsData || {};
    }
    cleanup();
    if (desiredTabId !== undefined && !persistentData[desiredTabId]) {
      persistentData[desiredTabId] = {};
    }
    return persistentData;
  }

  async function setPersistent(tabsData) {
    persistentData = tabsData;
    await browser.storage.local.set({ tabsData });
  }

  async function cleanup() {
    if (!cleanedUp) {
      cleanedUp = true;
      const tabs = await browser.tabs.query({
        currentWindow: true,
        highlighted: true,
      });
      Object.keys(persistentData)
        .filter((key) => {
          if (
            key != "autoSaveAll" &&
            key != "autoSaveUnpinned" &&
            key != "profileName"
          ) {
            return !tabs.find((tab) => tab.id == key);
          }
        })
        .forEach((tabId) => delete persistentData[tabId]);
      await browser.storage.local.set({ tabsData: persistentData });
    }
  }

  /*
   * Copyright 2010-2020 Gildas Lormeau
   * contact : gildas.lormeau <at> gmail.com
   *
   * This file is part of arkWsaver.
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

  const CURRENT_PROFILE_NAME = "-";
  const DEFAULT_PROFILE_NAME = "__Default_Settings__";
  const DISABLED_PROFILE_NAME = "__Disabled_Settings__";
  const REGEXP_RULE_PREFIX = "regexp:";
  const BACKGROUND_SAVE_DEFAULT = !/Mobile.*Firefox/.test(navigator.userAgent);

  const DEFAULT_CONFIG = {
    removeHiddenElements: true,
    removeUnusedStyles: true,
    removeUnusedFonts: true,
    removeFrames: false,
    compressHTML: true,
    compressCSS: false,
    loadDeferredImages: true,
    loadDeferredImagesMaxIdleTime: 1500,
    loadDeferredImagesBlockCookies: false,
    loadDeferredImagesBlockStorage: false,
    loadDeferredImagesKeepZoomLevel: false,
    loadDeferredImagesDispatchScrollEvent: false,
    filenameTemplate: "{page-title}",
    infobarTemplate: "",
    includeInfobar: false,
    confirmInfobarContent: false,
    autoClose: false,
    confirmFilename: false,
    filenameConflictAction: "uniquify",
    filenameMaxLength: 192,
    filenameMaxLengthUnit: "bytes",
    filenameReplacedCharacters: [
      "~",
      "+",
      "\\\\",
      "?",
      "%",
      "*",
      ":",
      "|",
      '"',
      "<",
      ">",
      "\x00-\x1f",
      "\x7F",
    ],
    filenameReplacementCharacter: "_",
    contextMenuEnabled: true,
    tabMenuEnabled: true,
    browserActionMenuEnabled: true,
    shadowEnabled: true,
    logsEnabled: true,
    progressBarEnabled: true,
    maxResourceSizeEnabled: false,
    maxResourceSize: 10,
    displayInfobar: true,
    displayStats: false,
    backgroundSave: BACKGROUND_SAVE_DEFAULT,
    defaultEditorMode: "normal",
    applySystemTheme: true,
    autoSaveDelay: 1,
    autoSaveLoad: false,
    autoSaveUnload: false,
    autoSaveLoadOrUnload: true,
    autoSaveDiscard: false,
    autoSaveRemove: false,
    autoSaveRepeat: false,
    autoSaveRepeatDelay: 10,
    removeAlternativeFonts: true,
    removeAlternativeMedias: true,
    removeAlternativeImages: true,
    groupDuplicateImages: true,
    maxSizeDuplicateImages: 512 * 1024,
    saveRawPage: false,
    addProof: false,
    saveToArkWsites: true,
    ArkWsitesToken: "",
    forceWebAuthFlow: false,
    resolveFragmentIdentifierURLs: false,
    userScriptEnabled: false,
    openEditor: false,
    openSavedPage: false,
    autoOpenEditor: false,
    saveCreatedBookmarks: false,
    allowedBookmarkFolders: [],
    ignoredBookmarkFolders: [],
    replaceBookmarkURL: true,
    saveFavicon: true,
    includeBOM: false,
    warnUnsavedPage: true,
    autoSaveExternalSave: false,
    insertMetaNoIndex: false,
    insertMetaCSP: true,
    insertarkWsaverComment: true,
    blockMixedContent: false,
    saveOriginalURLs: false,
    acceptHeaders: {
      font: "application/font-woff2;q=1.0,application/font-woff;q=0.9,*/*;q=0.8",
      image: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
      stylesheet: "text/css,*/*;q=0.1",
      script: "*/*",
      document:
        "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      video:
        "video/webm,video/ogg,video/*;q=0.9,application/ogg;q=0.7,audio/*;q=0.6,*/*;q=0.5",
      audio:
        "audio/webm,audio/ogg,audio/wav,audio/*;q=0.9,application/ogg;q=0.7,video/*;q=0.6,*/*;q=0.5",
    },
    moveStylesInHead: false,
    networkTimeout: 0,
    woleetKey: "",
    blockImages: false,
    blockStylesheets: false,
    blockFonts: false,
    blockScripts: true,
    blockVideos: true,
    blockAudios: true,
  };

  const DEFAULT_RULES = [
    {
      url: "file:",
      profile: "__Default_Settings__",
      autoSaveProfile: "__Disabled_Settings__",
    },
  ];

  let configStorage;
  let pendingUpgradePromise = upgrade();

  async function upgrade() {
    const { sync } = await browser.storage.local.get();
    if (sync) {
      configStorage = browser.storage.sync;
    } else {
      configStorage = browser.storage.local;
    }
    const config = await configStorage.get();
    if (!config.profiles) {
      const defaultConfig = config;
      delete defaultConfig.tabsData;
      applyUpgrade(defaultConfig);
      const newConfig = { profiles: {}, rules: DEFAULT_RULES };
      newConfig.profiles[DEFAULT_PROFILE_NAME] = defaultConfig;
      configStorage.remove(Object.keys(DEFAULT_CONFIG));
      await configStorage.set(newConfig);
    } else {
      if (!config.rules) {
        config.rules = DEFAULT_RULES;
      }
      Object.keys(config.profiles).forEach((profileName) =>
        applyUpgrade(config.profiles[profileName])
      );
      await configStorage.remove(["profiles", "rules"]);
      await configStorage.set({
        profiles: config.profiles,
        rules: config.rules,
      });
    }
    if (!config.maxParallelWorkers) {
      await configStorage.set({
        maxParallelWorkers: navigator.hardwareConcurrency || 4,
      });
    }
  }

  function applyUpgrade(config) {
    upgradeOldConfig(config, "blockScripts", "removeScripts");
    upgradeOldConfig(config, "blockVideos", "removeVideoSrc");
    upgradeOldConfig(config, "blockAudios", "removeAudioSrc");
    Object.keys(DEFAULT_CONFIG).forEach((configKey) =>
      upgradeConfig(config, configKey)
    );
  }

  function upgradeOldConfig(config, newKey, oldKey) {
    // eslint-disable-line no-unused-vars
    if (config[newKey] === undefined && config[oldKey] !== undefined) {
      config[newKey] = config[oldKey];
      delete config[oldKey];
    }
  }

  function upgradeConfig(config, key) {
    if (config[key] === undefined) {
      config[key] = DEFAULT_CONFIG[key];
    }
  }

  async function getRule(url, ignoreWildcard) {
    const config = await getConfig();
    const regExpRules = config.rules.filter((rule) => testRegExpRule(rule));
    let rule = regExpRules
      .sort(sortRules)
      .find(
        (rule) =>
          url && url.match(new RegExp(rule.url.split(REGEXP_RULE_PREFIX)[1]))
      );
    if (!rule) {
      const normalRules = config.rules.filter((rule) => !testRegExpRule(rule));
      rule = normalRules
        .sort(sortRules)
        .find(
          (rule) =>
            (!ignoreWildcard && rule.url == "*") ||
            (url && url.includes(rule.url))
        );
    }
    return rule;
  }

  async function getConfig() {
    await pendingUpgradePromise;
    return configStorage.get(["profiles", "rules", "maxParallelWorkers"]);
  }

  function sortRules(ruleLeft, ruleRight) {
    return ruleRight.url.length - ruleLeft.url.length;
  }

  function testRegExpRule(rule) {
    return rule.url.toLowerCase().startsWith(REGEXP_RULE_PREFIX);
  }

  async function onMessage$b(message) {
    if (message.method.endsWith(".deleteRules")) {
      await deleteRules(message.profileName);
    }
    if (message.method.endsWith(".deleteRule")) {
      await deleteRule(message.url);
    }
    if (message.method.endsWith(".addRule")) {
      await addRule(
        message.url,
        message.profileName,
        message.autoSaveProfileName
      );
    }
    if (message.method.endsWith(".createProfile")) {
      await createProfile(
        message.profileName,
        message.fromProfileName || DEFAULT_PROFILE_NAME
      );
    }
    if (message.method.endsWith(".renameProfile")) {
      await renameProfile(message.profileName, message.newProfileName);
    }
    if (message.method.endsWith(".deleteProfile")) {
      await deleteProfile(message.profileName);
    }
    if (message.method.endsWith(".resetProfiles")) {
      await resetProfiles();
    }
    if (message.method.endsWith(".resetProfile")) {
      await resetProfile(message.profileName);
    }
    if (message.method.endsWith(".importConfig")) {
      await importConfig(message.config);
    }
    if (message.method.endsWith(".updateProfile")) {
      await updateProfile(message.profileName, message.profile);
    }
    if (message.method.endsWith(".updateRule")) {
      await updateRule(
        message.url,
        message.newUrl,
        message.profileName,
        message.autoSaveProfileName
      );
    }
    if (message.method.endsWith(".getConstants")) {
      return {
        DISABLED_PROFILE_NAME,
        DEFAULT_PROFILE_NAME,
        CURRENT_PROFILE_NAME,
      };
    }
    if (message.method.endsWith(".getRules")) {
      return getRules();
    }
    if (message.method.endsWith(".getProfiles")) {
      return getProfiles();
    }
    if (message.method.endsWith(".exportConfig")) {
      return exportConfig();
    }
    if (message.method.endsWith(".enableSync")) {
      await browser.storage.local.set({ sync: true });
      const syncConfig = await browser.storage.sync.get();
      if (!syncConfig || !syncConfig.profiles) {
        const localConfig = await browser.storage.local.get();
        await browser.storage.sync.set({
          profiles: localConfig.profiles,
          rules: localConfig.rules,
          maxParallelWorkers: localConfig.maxParallelWorkers,
        });
      }
      configStorage = browser.storage.sync;
      return {};
    }
    if (message.method.endsWith(".disableSync")) {
      await browser.storage.local.set({ sync: false });
      const syncConfig = await browser.storage.sync.get();
      if (syncConfig && syncConfig.profiles) {
        await browser.storage.local.set({
          profiles: syncConfig.profiles,
          rules: syncConfig.rules,
          maxParallelWorkers: syncConfig.maxParallelWorkers,
        });
      }
      configStorage = browser.storage.local;
    }
    if (message.method.endsWith(".isSync")) {
      return { sync: (await browser.storage.local.get()).sync };
    }
    return {};
  }

  async function createProfile(profileName, fromProfileName) {
    const config = await getConfig();
    if (Object.keys(config.profiles).includes(profileName)) {
      throw new Error("Duplicate profile name");
    }
    config.profiles[profileName] = JSON.parse(
      JSON.stringify(config.profiles[fromProfileName])
    );
    await configStorage.set({ profiles: config.profiles });
  }

  async function getProfiles() {
    const config = await getConfig();
    return config.profiles;
  }

  async function getOptions(url, autoSave) {
    const [config, rule, allTabsData] = await Promise.all([
      getConfig(),
      getRule(url),
      getPersistent(),
    ]);
    const tabProfileName = allTabsData.profileName || DEFAULT_PROFILE_NAME;
    let selectedProfileName;
    if (rule) {
      const profileName = rule[autoSave ? "autoSaveProfile" : "profile"];
      selectedProfileName =
        profileName == CURRENT_PROFILE_NAME ? tabProfileName : profileName;
    } else {
      selectedProfileName = tabProfileName;
    }
    return Object.assign(
      { profileName: selectedProfileName },
      config.profiles[selectedProfileName]
    );
  }

  async function updateProfile(profileName, profile) {
    const config = await getConfig();
    if (!Object.keys(config.profiles).includes(profileName)) {
      throw new Error("Profile not found");
    }
    Object.keys(profile).forEach(
      (key) => (config.profiles[profileName][key] = profile[key])
    );
    await configStorage.set({ profiles: config.profiles });
  }

  async function renameProfile(oldProfileName, profileName) {
    const [config, allTabsData] = await Promise.all([
      getConfig(),
      getPersistent(),
    ]);
    if (!Object.keys(config.profiles).includes(oldProfileName)) {
      throw new Error("Profile not found");
    }
    if (Object.keys(config.profiles).includes(profileName)) {
      throw new Error("Duplicate profile name");
    }
    if (oldProfileName == DEFAULT_PROFILE_NAME) {
      throw new Error("Default settings cannot be renamed");
    }
    if (allTabsData.profileName == oldProfileName) {
      allTabsData.profileName = profileName;
      await setPersistent(allTabsData);
    }
    config.profiles[profileName] = config.profiles[oldProfileName];
    config.rules.forEach((rule) => {
      if (rule.profile == oldProfileName) {
        rule.profile = profileName;
      }
      if (rule.autoSaveProfile == oldProfileName) {
        rule.autoSaveProfile = profileName;
      }
    });
    delete config.profiles[oldProfileName];
    await configStorage.set({ profiles: config.profiles, rules: config.rules });
  }

  async function deleteProfile(profileName) {
    const [config, allTabsData] = await Promise.all([
      getConfig(),
      getPersistent(),
    ]);
    if (!Object.keys(config.profiles).includes(profileName)) {
      throw new Error("Profile not found");
    }
    if (profileName == DEFAULT_PROFILE_NAME) {
      throw new Error("Default settings cannot be deleted");
    }
    if (allTabsData.profileName == profileName) {
      delete allTabsData.profileName;
      await setPersistent(allTabsData);
    }
    config.rules.forEach((rule) => {
      if (rule.profile == profileName) {
        rule.profile = DEFAULT_PROFILE_NAME;
      }
      if (rule.autoSaveProfile == profileName) {
        rule.autoSaveProfile = DEFAULT_PROFILE_NAME;
      }
    });
    delete config.profiles[profileName];
    await configStorage.set({ profiles: config.profiles, rules: config.rules });
  }

  async function getRules() {
    const config = await getConfig();
    return config.rules;
  }

  async function addRule(url, profile, autoSaveProfile) {
    if (!url) {
      throw new Error("URL is empty");
    }
    const config = await getConfig();
    if (config.rules.find((rule) => rule.url == url)) {
      throw new Error("URL already exists");
    }
    config.rules.push({
      url,
      profile,
      autoSaveProfile,
    });
    await configStorage.set({ rules: config.rules });
  }

  async function deleteRule(url) {
    if (!url) {
      throw new Error("URL is empty");
    }
    const config = await getConfig();
    config.rules = config.rules.filter((rule) => rule.url != url);
    await configStorage.set({ rules: config.rules });
  }

  async function deleteRules(profileName) {
    const config = await getConfig();
    config.rules = config.rules = profileName
      ? config.rules.filter(
          (rule) =>
            rule.autoSaveProfile != profileName && rule.profile != profileName
        )
      : [];
    await configStorage.set({ rules: config.rules });
  }

  async function updateRule(url, newURL, profile, autoSaveProfile) {
    if (!url || !newURL) {
      throw new Error("URL is empty");
    }
    const config = await getConfig();
    const urlConfig = config.rules.find((rule) => rule.url == url);
    if (!urlConfig) {
      throw new Error("URL not found");
    }
    if (config.rules.find((rule) => rule.url == newURL && rule.url != url)) {
      throw new Error("New URL already exists");
    }
    urlConfig.url = newURL;
    urlConfig.profile = profile;
    urlConfig.autoSaveProfile = autoSaveProfile;
    await configStorage.set({ rules: config.rules });
  }

  async function getAuthInfo$1() {
    return (await configStorage.get()).authInfo;
  }

  async function setAuthInfo(authInfo) {
    await configStorage.set({ authInfo });
  }

  async function removeAuthInfo() {
    let authInfo = getAuthInfo$1();
    if (authInfo.revokableAccessToken) {
      setAuthInfo({ revokableAccessToken: authInfo.revokableAccessToken });
    } else {
      await configStorage.remove(["authInfo"]);
    }
  }

  async function resetProfiles() {
    await pendingUpgradePromise;
    const allTabsData = await getPersistent();
    delete allTabsData.profileName;
    await setPersistent(allTabsData);
    await configStorage.remove(["profiles", "rules", "maxParallelWorkers"]);
    await browser.storage.local.set({ sync: false });
    configStorage = browser.storage.local;
    await upgrade();
  }

  async function resetProfile(profileName) {
    const config = await getConfig();
    if (!Object.keys(config.profiles).includes(profileName)) {
      throw new Error("Profile not found");
    }
    config.profiles[profileName] = DEFAULT_CONFIG;
    await configStorage.set({ profiles: config.profiles });
  }

  async function exportConfig() {
    const config = await getConfig();
    const url =
      "data:text/json," +
      JSON.stringify(
        {
          profiles: config.profiles,
          rules: config.rules,
          maxParallelWorkers: config.maxParallelWorkers,
        },
        null,
        2
      );
    const downloadInfo = {
      url,
      filename: `arkWsaver-settings-${new Date()
        .toISOString()
        .replace(/:/g, "_")}.json`,
      saveAs: true,
    };
    await download(downloadInfo, "_");
  }

  async function importConfig(config) {
    await configStorage.remove(["profiles", "rules", "maxParallelWorkers"]);
    await configStorage.set({
      profiles: config.profiles,
      rules: config.rules,
      maxParallelWorkers: config.maxParallelWorkers,
    });
    await upgrade();
  }

  /*
   * Copyright 2010-2020 Gildas Lormeau
   * contact : gildas.lormeau <at> gmail.com
   *
   * This file is part of arkWsaver.
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

  async function autoSaveIsEnabled(tab) {
    if (tab) {
      const [allTabsData, rule] = await Promise.all([
        getPersistent(),
        getRule(tab.url),
      ]);
      return (
        Boolean(
          allTabsData.autoSaveAll ||
            (allTabsData.autoSaveUnpinned && !tab.pinned) ||
            (allTabsData[tab.id] && allTabsData[tab.id].autoSave)
        ) &&
        (!rule || rule.autoSaveProfile != DISABLED_PROFILE_NAME)
      );
    }
  }

  async function refreshAutoSaveTabs() {
    const tabs = await browser.tabs.query({});
    return Promise.all(
      tabs.map(async (tab) => {
        const [options, autoSaveEnabled] = await Promise.all([
          getOptions(tab.url, true),
          autoSaveIsEnabled(tab),
        ]);
        try {
          await browser.tabs.sendMessage(tab.id, {
            method: "content.init",
            autoSaveEnabled,
            options,
          });
        } catch (error) {
          // ignored
        }
      })
    );
  }

  /*
   * Copyright 2010-2020 Gildas Lormeau
   * contact : gildas.lormeau <at> gmail.com
   *
   * This file is part of arkWsaver.
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

  async function onMessage$a(message, sender) {
    if (message.method.endsWith(".init")) {
      const [optionsAutoSave, options, autoSaveEnabled] = await Promise.all([
        getOptions(sender.tab.url, true),
        getOptions(sender.tab.url),
        autoSaveIsEnabled(sender.tab),
      ]);
      return {
        optionsAutoSave,
        options,
        autoSaveEnabled,
        tabId: sender.tab.id,
        tabIndex: sender.tab.index,
      };
    }
  }

  /*
   * Copyright 2010-2020 Gildas Lormeau
   * contact : gildas.lormeau <at> gmail.com
   *
   * This file is part of arkWsaver.
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

  const MAX_CONTENT_SIZE = 32 * (1024 * 1024);
  const EDITOR_PAGE_URL = "/src/ui/pages/editor.html";
  const tabsData = new Map();
  const partialContents = new Map();
  const EDITOR_URL = browser.runtime.getURL(EDITOR_PAGE_URL);

  async function open({ tabIndex, content, filename }) {
    const createTabProperties = { active: true, url: EDITOR_PAGE_URL };
    if (tabIndex != null) {
      createTabProperties.index = tabIndex;
    }
    const tab = await browser.tabs.create(createTabProperties);
    tabsData.set(tab.id, { content, filename });
  }

  function onTabRemoved$2(tabId) {
    tabsData.delete(tabId);
  }

  function isEditor(tab) {
    return tab.url == EDITOR_URL;
  }

  async function onMessage$9(message, sender) {
    if (message.method.endsWith(".getTabData")) {
      const tab = sender.tab;
      const tabData = tabsData.get(tab.id);
      if (tabData) {
        const options = await getOptions(tabData.url);
        const content = JSON.stringify(tabData);
        for (
          let blockIndex = 0;
          blockIndex * MAX_CONTENT_SIZE < content.length;
          blockIndex++
        ) {
          const message = {
            method: "editor.setTabData",
            tabId: tab.id,
          };
          message.truncated = content.length > MAX_CONTENT_SIZE;
          message.url = tabData.url;
          if (message.truncated) {
            message.finished =
              (blockIndex + 1) * MAX_CONTENT_SIZE > content.length;
            message.content = content.substring(
              blockIndex * MAX_CONTENT_SIZE,
              (blockIndex + 1) * MAX_CONTENT_SIZE
            );
            if (message.finished) {
              message.options = options;
            }
          } else {
            message.content = content;
            message.options = options;
          }
          await browser.tabs.sendMessage(tab.id, message);
        }
      } else {
        const message = {
          method: "editor.setTabData",
          tabId: tab.id,
        };
        await browser.tabs.sendMessage(tab.id, message);
      }
      return {};
    }
    if (message.method.endsWith(".open")) {
      let contents;
      const tab = sender.tab;
      if (message.truncated) {
        contents = partialContents.get(tab.id);
        if (!contents) {
          contents = [];
          partialContents.set(tab.id, contents);
        }
        contents.push(message.content);
        if (message.finished) {
          partialContents.delete(tab.id);
        }
      } else if (message.content) {
        contents = [message.content];
      }
      if (!message.truncated || message.finished) {
        const updateTabProperties = { url: EDITOR_PAGE_URL };
        await browser.tabs.update(tab.id, updateTabProperties);
        tabsData.set(tab.id, {
          url: tab.url,
          content: contents.join(""),
          filename: message.filename,
        });
      }
      return {};
    }
  }

  /*
   * Copyright 2010-2020 Gildas Lormeau
   * contact : gildas.lormeau <at> gmail.com
   *
   * This file is part of arkWsaver.
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

  async function queryTabs(options) {
    const tabs = await browser.tabs.query(options);
    return tabs.sort((tab1, tab2) => tab1.index - tab2.index);
  }

  function extractAuthCode(authURL) {
    return new Promise((resolve, reject) => {
      browser.tabs.onUpdated.addListener(onTabUpdated);

      function onTabUpdated(tabId, changeInfo) {
        if (changeInfo && changeInfo.url.startsWith(authURL)) {
          browser.tabs.onUpdated.removeListener(onTabUpdated);
          const code = new URLSearchParams(new URL(changeInfo.url).search).get(
            "code"
          );
          if (code) {
            browser.tabs.remove(tabId);
            resolve(code);
          } else {
            reject();
          }
        }
      }
    });
  }

  async function launchWebAuthFlow(options) {
    const tab = await browser.tabs.create({ url: options.url, active: true });
    return new Promise((resolve, reject) => {
      browser.tabs.onRemoved.addListener(onTabRemoved);
      function onTabRemoved(tabId) {
        if (tabId == tab.id) {
          browser.tabs.onRemoved.removeListener(onTabRemoved);
          reject(new Error("code_required"));
        }
      }
    });
  }

  /*
   * Copyright 2010-2020 Gildas Lormeau
   * contact : gildas.lormeau <at> gmail.com
   *
   * This file is part of arkWsaver.
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

  const DEFAULT_ICON_PATH = "/src/ui/resources/icon_128.png";
  const WAIT_ICON_PATH_PREFIX = "/src/ui/resources/icon_128";
  const BUTTON_DEFAULT_TOOLTIP_MESSAGE = browser.i18n.getMessage(
    "buttonDefaultTooltip"
  );
  const BUTTON_BLOCKED_TOOLTIP_MESSAGE = browser.i18n.getMessage(
    "buttonBlockedTooltip"
  );
  const BUTTON_DEFAULT_BADGE_MESSAGE = "";
  const BUTTON_INITIALIZING_BADGE_MESSAGE = browser.i18n.getMessage(
    "buttonInitializingBadge"
  );
  const BUTTON_INITIALIZING_TOOLTIP_MESSAGE = browser.i18n.getMessage(
    "buttonInitializingTooltip"
  );
  const BUTTON_ERROR_BADGE_MESSAGE =
    browser.i18n.getMessage("buttonErrorBadge");
  const BUTTON_BLOCKED_BADGE_MESSAGE =
    browser.i18n.getMessage("buttonBlockedBadge");
  const BUTTON_OK_BADGE_MESSAGE = browser.i18n.getMessage("buttonOKBadge");
  const BUTTON_SAVE_PROGRESS_TOOLTIP_MESSAGE = browser.i18n.getMessage(
    "buttonSaveProgressTooltip"
  );
  const BUTTON_UPLOAD_PROGRESS_TOOLTIP_MESSAGE = browser.i18n.getMessage(
    "buttonUploadProgressTooltip"
  );
  const BUTTON_AUTOSAVE_ACTIVE_BADGE_MESSAGE = browser.i18n.getMessage(
    "buttonAutoSaveActiveBadge"
  );
  const BUTTON_AUTOSAVE_ACTIVE_TOOLTIP_MESSAGE = browser.i18n.getMessage(
    "buttonAutoSaveActiveTooltip"
  );
  const DEFAULT_COLOR = [2, 147, 20, 192];
  const ACTIVE_COLOR = [4, 229, 36, 192];
  const FORBIDDEN_COLOR = [255, 255, 255, 1];
  const ERROR_COLOR = [229, 4, 12, 192];
  const AUTOSAVE_DEFAULT_COLOR = [208, 208, 208, 192];
  const AUTOSAVE_INITIALIZING_COLOR = [64, 64, 64, 192];
  const INJECT_SCRIPTS_STEP$1 = 1;

  const BUTTON_STATES = {
    default: {
      setBadgeBackgroundColor: { color: DEFAULT_COLOR },
      setBadgeText: { text: BUTTON_DEFAULT_BADGE_MESSAGE },
      setTitle: { title: BUTTON_DEFAULT_TOOLTIP_MESSAGE },
      setIcon: { path: DEFAULT_ICON_PATH },
    },
    inject: {
      setBadgeBackgroundColor: { color: DEFAULT_COLOR },
      setBadgeText: { text: BUTTON_INITIALIZING_BADGE_MESSAGE },
      setTitle: { title: BUTTON_INITIALIZING_TOOLTIP_MESSAGE },
    },
    execute: {
      setBadgeBackgroundColor: { color: ACTIVE_COLOR },
      setBadgeText: { text: BUTTON_INITIALIZING_BADGE_MESSAGE },
    },
    progress: {
      setBadgeBackgroundColor: { color: ACTIVE_COLOR },
      setBadgeText: { text: BUTTON_DEFAULT_BADGE_MESSAGE },
    },
    edit: {
      setBadgeBackgroundColor: { color: DEFAULT_COLOR },
      setBadgeText: { text: BUTTON_DEFAULT_BADGE_MESSAGE },
      setTitle: { title: BUTTON_DEFAULT_TOOLTIP_MESSAGE },
      setIcon: { path: DEFAULT_ICON_PATH },
    },
    end: {
      setBadgeBackgroundColor: { color: ACTIVE_COLOR },
      setBadgeText: { text: BUTTON_OK_BADGE_MESSAGE },
      setTitle: { title: BUTTON_DEFAULT_TOOLTIP_MESSAGE },
      setIcon: { path: DEFAULT_ICON_PATH },
    },
    error: {
      setBadgeBackgroundColor: { color: ERROR_COLOR },
      setBadgeText: { text: BUTTON_ERROR_BADGE_MESSAGE },
      setTitle: { title: BUTTON_DEFAULT_BADGE_MESSAGE },
      setIcon: { path: DEFAULT_ICON_PATH },
    },
    forbidden: {
      setBadgeBackgroundColor: { color: FORBIDDEN_COLOR },
      setBadgeText: { text: BUTTON_BLOCKED_BADGE_MESSAGE },
      setTitle: { title: BUTTON_BLOCKED_TOOLTIP_MESSAGE },
      setIcon: { path: DEFAULT_ICON_PATH },
    },
    autosave: {
      inject: {
        setBadgeBackgroundColor: { color: AUTOSAVE_INITIALIZING_COLOR },
        setBadgeText: { text: BUTTON_AUTOSAVE_ACTIVE_BADGE_MESSAGE },
        setTitle: { title: BUTTON_AUTOSAVE_ACTIVE_TOOLTIP_MESSAGE },
        setIcon: { path: DEFAULT_ICON_PATH },
      },
      default: {
        setBadgeBackgroundColor: { color: AUTOSAVE_DEFAULT_COLOR },
        setBadgeText: { text: BUTTON_AUTOSAVE_ACTIVE_BADGE_MESSAGE },
        setTitle: { title: BUTTON_AUTOSAVE_ACTIVE_TOOLTIP_MESSAGE },
        setIcon: { path: DEFAULT_ICON_PATH },
      },
    },
  };

  let business$2;

  browser.action.onClicked.addListener(async (tab) => {
    const highlightedTabs = await queryTabs({
      currentWindow: true,
      highlighted: true,
    });
    if (highlightedTabs.length <= 1) {
      toggleSaveTab(tab);
    } else {
      business$2.saveTabs(highlightedTabs);
    }

    function toggleSaveTab(tab) {
      if (business$2.isSavingTab(tab)) {
        business$2.cancelTab(tab.id);
      } else {
        business$2.saveTabs([tab]);
      }
    }
  });

  function init$3(businessApi) {
    business$2 = businessApi;
  }

  function onMessage$8(message, sender) {
    if (message.method.endsWith(".processInit")) {
      const allTabsData = getTemporary(sender.tab.id);
      delete allTabsData[sender.tab.id].button;
      refreshTab$2(sender.tab);
    }
    if (message.method.endsWith(".processProgress")) {
      if (message.maxIndex) {
        onSaveProgress(sender.tab.id, message.index, message.maxIndex);
      }
    }
    if (message.method.endsWith(".processEnd")) {
      onEnd$1(sender.tab.id);
    }
    if (message.method.endsWith(".processError")) {
      if (message.error) {
        console.error("Initialization error", message.error); // eslint-disable-line no-console
      }
      onError$1(sender.tab.id);
    }
    if (message.method.endsWith(".processCancelled")) {
      onCancelled$1(sender.tab);
    }
    return Promise.resolve({});
  }

  function onStart$1(tabId, step, autoSave) {
    let state;
    if (autoSave) {
      state = getButtonState("inject", true);
    } else {
      state =
        step == INJECT_SCRIPTS_STEP$1
          ? getButtonState("inject")
          : getButtonState("execute");
      state.setTitle = {
        title: BUTTON_INITIALIZING_TOOLTIP_MESSAGE + " (" + step + "/2)",
      };
      state.setIcon = { path: WAIT_ICON_PATH_PREFIX + ".png" };
    }
    refresh(tabId, state);
  }

  function onError$1(tabId) {
    refresh(tabId, getButtonState("error"));
  }

  function onEdit$1(tabId) {
    refresh(tabId, getButtonState("edit"));
  }

  function onEnd$1(tabId, autoSave) {
    refresh(
      tabId,
      autoSave ? getButtonState("default", true) : getButtonState("end")
    );
  }

  function onForbiddenDomain$1(tab) {
    refresh(tab.id, getButtonState("forbidden"));
  }

  function onCancelled$1(tab) {
    refreshTab$2(tab);
  }

  function onSaveProgress(tabId, index, maxIndex) {
    onProgress(tabId, index, maxIndex, BUTTON_SAVE_PROGRESS_TOOLTIP_MESSAGE);
  }

  function onUploadProgress$1(tabId, index, maxIndex) {
    onProgress(tabId, index, maxIndex, BUTTON_UPLOAD_PROGRESS_TOOLTIP_MESSAGE);
  }

  function onProgress(tabId, index, maxIndex, tooltipMessage) {
    const progress = Math.max(
      Math.min(20, Math.floor((index / maxIndex) * 20)),
      0
    );
    const barProgress = Math.min(Math.floor((index / maxIndex) * 8), 8);
    const path = WAIT_ICON_PATH_PREFIX + ".png";
    const state = getButtonState("progress");
    state.setTitle = { title: tooltipMessage + progress * 5 + "%" };
    state.setIcon = { path };
    refresh(tabId, state);
  }

  async function refreshTab$2(tab) {
    const autoSave = await autoSaveIsEnabled(tab);
    const state = getButtonState("default", autoSave);
    await refresh(tab.id, state);
  }

  async function refresh(tabId, state) {
    try {
      const allTabsData = getTemporary(tabId);
      if (state) {
        if (!allTabsData[tabId].button) {
          allTabsData[tabId].button = { lastState: null };
        }
        const lastState = allTabsData[tabId].button.lastState || {};
        const newState = {};
        Object.keys(state).forEach((property) => {
          if (
            state[property] !== undefined &&
            JSON.stringify(lastState[property]) !=
              JSON.stringify(state[property])
          ) {
            newState[property] = state[property];
          }
        });
        if (Object.keys(newState).length) {
          allTabsData[tabId].button.lastState = state;
          await refreshAsync(tabId, newState);
        }
      }
    } catch (error) {
      // ignored
    }
  }

  async function refreshAsync(tabId, state) {
    for (const browserActionMethod of Object.keys(state)) {
      await refreshProperty(
        tabId,
        browserActionMethod,
        state[browserActionMethod]
      );
    }
  }

  async function refreshProperty(
    tabId,
    browserActionMethod,
    browserActionParameter
  ) {
    if (browser.action[browserActionMethod]) {
      const parameter = JSON.parse(JSON.stringify(browserActionParameter));
      parameter.tabId = tabId;
      await browser.action[browserActionMethod](parameter);
    }
  }

  function getButtonState(name, autoSave) {
    return JSON.parse(
      JSON.stringify(
        autoSave ? BUTTON_STATES.autosave[name] : BUTTON_STATES[name]
      )
    );
  }

  /*
   * Copyright 2010-2020 Gildas Lormeau
   * contact : gildas.lormeau <at> gmail.com
   *
   * This file is part of arkWsaver.
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

  const menus = browser.contextMenus;
  const BROWSER_MENUS_API_SUPPORTED =
    menus && menus.onClicked && menus.create && menus.update && menus.removeAll;
  const MENU_ID_SAVE_PAGE = "save-page";
  const MENU_ID_EDIT_AND_SAVE_PAGE = "edit-and-save-page";
  const MENU_ID_SAVE_WITH_PROFILE = "save-with-profile";
  const MENU_ID_SAVE_SELECTED_LINKS = "save-selected-links";
  const MENU_ID_VIEW_PENDINGS = "view-pendings";
  const MENU_ID_SELECT_PROFILE = "select-profile";
  const MENU_ID_SAVE_WITH_PROFILE_PREFIX = "wasve-with-profile-";
  const MENU_ID_SELECT_PROFILE_PREFIX = "select-profile-";
  const MENU_ID_ASSOCIATE_WITH_PROFILE = "associate-with-profile";
  const MENU_ID_ASSOCIATE_WITH_PROFILE_PREFIX = "associate-with-profile-";
  const MENU_ID_SAVE_SELECTED = "save-selected";
  const MENU_ID_SAVE_FRAME = "save-frame";
  const MENU_ID_SAVE_TABS = "save-tabs";
  const MENU_ID_SAVE_SELECTED_TABS = "save-selected-tabs";
  const MENU_ID_SAVE_UNPINNED_TABS = "save-unpinned-tabs";
  const MENU_ID_SAVE_ALL_TABS = "save-all-tabs";
  const MENU_ID_BATCH_SAVE_URLS = "batch-save-urls";
  const MENU_ID_BUTTON_SAVE_SELECTED_TABS =
    "button-" + MENU_ID_SAVE_SELECTED_TABS;
  const MENU_ID_BUTTON_SAVE_UNPINNED_TABS =
    "button-" + MENU_ID_SAVE_UNPINNED_TABS;
  const MENU_ID_BUTTON_SAVE_ALL_TABS = "button-" + MENU_ID_SAVE_ALL_TABS;
  const MENU_ID_AUTO_SAVE = "auto-save";
  const MENU_ID_AUTO_SAVE_DISABLED = "auto-save-disabled";
  const MENU_ID_AUTO_SAVE_TAB = "auto-save-tab";
  const MENU_ID_AUTO_SAVE_UNPINNED = "auto-save-unpinned";
  const MENU_ID_AUTO_SAVE_ALL = "auto-save-all";
  const MENU_CREATE_DOMAIN_RULE_MESSAGE = browser.i18n.getMessage(
    "menuCreateDomainRule"
  );
  const MENU_UPDATE_RULE_MESSAGE = browser.i18n.getMessage("menuUpdateRule");
  const MENU_SAVE_PAGE_MESSAGE = browser.i18n.getMessage("menuSavePage");
  const MENU_SAVE_WITH_PROFILE = browser.i18n.getMessage("menuSaveWithProfile");
  const MENU_SAVE_SELECTED_LINKS = browser.i18n.getMessage(
    "menuSaveSelectedLinks"
  );
  const MENU_EDIT_PAGE_MESSAGE = browser.i18n.getMessage("menuEditPage");
  const MENU_EDIT_AND_SAVE_PAGE_MESSAGE = browser.i18n.getMessage(
    "menuEditAndSavePage"
  );
  const MENU_VIEW_PENDINGS_MESSAGE = browser.i18n.getMessage(
    "menuViewPendingSaves"
  );
  const MENU_SAVE_SELECTION_MESSAGE =
    browser.i18n.getMessage("menuSaveSelection");
  const MENU_SAVE_FRAME_MESSAGE = browser.i18n.getMessage("menuSaveFrame");
  const MENU_SAVE_TABS_MESSAGE = browser.i18n.getMessage("menuSaveTabs");
  const MENU_SAVE_SELECTED_TABS_MESSAGE = browser.i18n.getMessage(
    "menuSaveSelectedTabs"
  );
  const MENU_SAVE_UNPINNED_TABS_MESSAGE = browser.i18n.getMessage(
    "menuSaveUnpinnedTabs"
  );
  const MENU_SAVE_ALL_TABS_MESSAGE = browser.i18n.getMessage("menuSaveAllTabs");
  const MENU_BATCH_SAVE_URLS_MESSAGE =
    browser.i18n.getMessage("menuBatchSaveUrls");
  const MENU_SELECT_PROFILE_MESSAGE =
    browser.i18n.getMessage("menuSelectProfile");
  const PROFILE_DEFAULT_SETTINGS_MESSAGE = browser.i18n.getMessage(
    "profileDefaultSettings"
  );
  const MENU_AUTOSAVE_MESSAGE = browser.i18n.getMessage("menuAutoSave");
  const MENU_AUTOSAVE_DISABLED_MESSAGE = browser.i18n.getMessage(
    "menuAutoSaveDisabled"
  );
  const MENU_AUTOSAVE_TAB_MESSAGE = browser.i18n.getMessage("menuAutoSaveTab");
  const MENU_AUTOSAVE_UNPINNED_TABS_MESSAGE = browser.i18n.getMessage(
    "menuAutoSaveUnpinnedTabs"
  );
  const MENU_AUTOSAVE_ALL_TABS_MESSAGE = browser.i18n.getMessage(
    "menuAutoSaveAllTabs"
  );
  const MENU_TOP_VISIBLE_ENTRIES = [
    MENU_ID_EDIT_AND_SAVE_PAGE,
    MENU_ID_SAVE_SELECTED_LINKS,
    MENU_ID_SAVE_SELECTED,
    MENU_ID_SAVE_FRAME,
    MENU_ID_AUTO_SAVE,
    MENU_ID_ASSOCIATE_WITH_PROFILE,
  ];

  const menusCheckedState = new Map();
  const menusTitleState = new Map();
  let contextMenuVisibleState = true;
  let allMenuVisibleState = true;
  let profileIndexes = new Map();
  let menusCreated, pendingRefresh, business$1;
  Promise.resolve().then(initialize);

  function init$2(businessApi) {
    business$1 = businessApi;
  }

  function onMessage$7(message) {
    if (message.method.endsWith("refreshMenu")) {
      createMenus();
      return Promise.resolve({});
    }
  }

  async function createMenus(tab) {
    const [profiles, allTabsData] = await Promise.all([
      getProfiles(),
      getPersistent(),
    ]);
    const options = await getOptions(tab && tab.url);
    if (BROWSER_MENUS_API_SUPPORTED && options) {
      const pageContextsEnabled = [
        "page",
        "frame",
        "image",
        "link",
        "video",
        "audio",
        "selection",
      ];
      const defaultContextsDisabled = [];
      if (options.browserActionMenuEnabled) {
        defaultContextsDisabled.push("browser_action");
      }
      if (options.tabMenuEnabled) {
        try {
          menus.create({
            id: "temporary-id",
            contexts: ["tab"],
            title: "title",
          });
          defaultContextsDisabled.push("tab");
        } catch (error) {
          options.tabMenuEnabled = false;
        }
      }
      await menus.removeAll();
      const defaultContextsEnabled = defaultContextsDisabled.concat(
        ...pageContextsEnabled
      );
      const defaultContexts = options.contextMenuEnabled
        ? defaultContextsEnabled
        : defaultContextsDisabled;
      menus.create({
        id: MENU_ID_SAVE_PAGE,
        contexts: defaultContexts,
        title: MENU_SAVE_PAGE_MESSAGE,
      });
      menus.create({
        id: MENU_ID_EDIT_AND_SAVE_PAGE,
        contexts: defaultContexts,
        title: MENU_EDIT_AND_SAVE_PAGE_MESSAGE,
      });
      menus.create({
        id: MENU_ID_SAVE_SELECTED_LINKS,
        contexts: options.contextMenuEnabled
          ? defaultContextsDisabled.concat(["selection"])
          : defaultContextsDisabled,
        title: MENU_SAVE_SELECTED_LINKS,
      });
      if (Object.keys(profiles).length > 1) {
        menus.create({
          id: MENU_ID_SAVE_WITH_PROFILE,
          contexts: defaultContexts,
          title: MENU_SAVE_WITH_PROFILE,
        });
      }
      if (options.contextMenuEnabled) {
        menus.create({
          id: "separator-1",
          contexts: pageContextsEnabled,
          type: "separator",
        });
      }
      menus.create({
        id: MENU_ID_SAVE_SELECTED,
        contexts: defaultContexts,
        title: MENU_SAVE_SELECTION_MESSAGE,
      });
      if (options.contextMenuEnabled) {
        menus.create({
          id: MENU_ID_SAVE_FRAME,
          contexts: ["frame"],
          title: MENU_SAVE_FRAME_MESSAGE,
        });
      }
      menus.create({
        id: MENU_ID_SAVE_TABS,
        contexts: defaultContextsDisabled,
        title: MENU_SAVE_TABS_MESSAGE,
      });
      menus.create({
        id: MENU_ID_BUTTON_SAVE_SELECTED_TABS,
        contexts: defaultContextsDisabled,
        title: MENU_SAVE_SELECTED_TABS_MESSAGE,
        parentId: MENU_ID_SAVE_TABS,
      });
      menus.create({
        id: MENU_ID_BUTTON_SAVE_UNPINNED_TABS,
        contexts: defaultContextsDisabled,
        title: MENU_SAVE_UNPINNED_TABS_MESSAGE,
        parentId: MENU_ID_SAVE_TABS,
      });
      menus.create({
        id: MENU_ID_BUTTON_SAVE_ALL_TABS,
        contexts: defaultContextsDisabled,
        title: MENU_SAVE_ALL_TABS_MESSAGE,
        parentId: MENU_ID_SAVE_TABS,
      });
      if (options.contextMenuEnabled) {
        menus.create({
          id: MENU_ID_SAVE_SELECTED_TABS,
          contexts: pageContextsEnabled,
          title: MENU_SAVE_SELECTED_TABS_MESSAGE,
        });
        menus.create({
          id: MENU_ID_SAVE_UNPINNED_TABS,
          contexts: pageContextsEnabled,
          title: MENU_SAVE_UNPINNED_TABS_MESSAGE,
        });
        menus.create({
          id: MENU_ID_SAVE_ALL_TABS,
          contexts: pageContextsEnabled,
          title: MENU_SAVE_ALL_TABS_MESSAGE,
        });
        menus.create({
          id: "separator-2",
          contexts: pageContextsEnabled,
          type: "separator",
        });
      }
      if (Object.keys(profiles).length > 1) {
        menus.create({
          id: MENU_ID_SELECT_PROFILE,
          title: MENU_SELECT_PROFILE_MESSAGE,
          contexts: defaultContexts,
        });
        menus.create({
          id: MENU_ID_SAVE_WITH_PROFILE_PREFIX + "default",
          contexts: defaultContexts,
          title: PROFILE_DEFAULT_SETTINGS_MESSAGE,
          parentId: MENU_ID_SAVE_WITH_PROFILE,
        });
        const defaultProfileId = MENU_ID_SELECT_PROFILE_PREFIX + "default";
        const defaultProfileChecked =
          !allTabsData.profileName ||
          allTabsData.profileName == DEFAULT_PROFILE_NAME;
        menus.create({
          id: defaultProfileId,
          type: "radio",
          contexts: defaultContexts,
          title: PROFILE_DEFAULT_SETTINGS_MESSAGE,
          checked: defaultProfileChecked,
          parentId: MENU_ID_SELECT_PROFILE,
        });
        menusCheckedState.set(defaultProfileId, defaultProfileChecked);
        menus.create({
          id: MENU_ID_ASSOCIATE_WITH_PROFILE,
          title: MENU_CREATE_DOMAIN_RULE_MESSAGE,
          contexts: defaultContexts,
        });
        menusTitleState.set(
          MENU_ID_ASSOCIATE_WITH_PROFILE,
          MENU_CREATE_DOMAIN_RULE_MESSAGE
        );
        let rule;
        if (tab && tab.url) {
          rule = await getRule(tab.url, true);
        }
        const currentProfileId =
          MENU_ID_ASSOCIATE_WITH_PROFILE_PREFIX + "current";
        const currentProfileChecked =
          !rule || rule.profile == CURRENT_PROFILE_NAME;
        menus.create({
          id: currentProfileId,
          type: "radio",
          contexts: defaultContexts,
          title: CURRENT_PROFILE_NAME,
          checked: currentProfileChecked,
          parentId: MENU_ID_ASSOCIATE_WITH_PROFILE,
        });
        menusCheckedState.set(currentProfileId, currentProfileChecked);

        const associatedDefaultProfileId =
          MENU_ID_ASSOCIATE_WITH_PROFILE_PREFIX + "default";
        const associatedDefaultProfileChecked =
          Boolean(rule) && rule.profile == DEFAULT_PROFILE_NAME;
        menus.create({
          id: associatedDefaultProfileId,
          type: "radio",
          contexts: defaultContexts,
          title: PROFILE_DEFAULT_SETTINGS_MESSAGE,
          checked: associatedDefaultProfileChecked,
          parentId: MENU_ID_ASSOCIATE_WITH_PROFILE,
        });
        menusCheckedState.set(
          associatedDefaultProfileId,
          associatedDefaultProfileChecked
        );
        profileIndexes = new Map();
        Object.keys(profiles).forEach((profileName, profileIndex) => {
          if (profileName != DEFAULT_PROFILE_NAME) {
            let profileId = MENU_ID_SAVE_WITH_PROFILE_PREFIX + profileIndex;
            menus.create({
              id: profileId,
              contexts: defaultContexts,
              title: profileName,
              parentId: MENU_ID_SAVE_WITH_PROFILE,
            });
            profileId = MENU_ID_SELECT_PROFILE_PREFIX + profileIndex;
            let profileChecked = allTabsData.profileName == profileName;
            menus.create({
              id: profileId,
              type: "radio",
              contexts: defaultContexts,
              title: profileName,
              checked: profileChecked,
              parentId: MENU_ID_SELECT_PROFILE,
            });
            menusCheckedState.set(profileId, profileChecked);
            profileId = MENU_ID_ASSOCIATE_WITH_PROFILE_PREFIX + profileIndex;
            profileChecked = Boolean(rule) && rule.profile == profileName;
            menus.create({
              id: profileId,
              type: "radio",
              contexts: defaultContexts,
              title: profileName,
              checked: profileChecked,
              parentId: MENU_ID_ASSOCIATE_WITH_PROFILE,
            });
            menusCheckedState.set(profileId, profileChecked);
            profileIndexes.set(profileName, profileIndex);
          }
        });
        if (options.contextMenuEnabled) {
          menus.create({
            id: "separator-3",
            contexts: pageContextsEnabled,
            type: "separator",
          });
        }
      }
      menus.create({
        id: MENU_ID_AUTO_SAVE,
        contexts: defaultContexts,
        title: MENU_AUTOSAVE_MESSAGE,
      });
      menus.create({
        id: MENU_ID_AUTO_SAVE_DISABLED,
        type: "radio",
        title: MENU_AUTOSAVE_DISABLED_MESSAGE,
        contexts: defaultContexts,
        checked: true,
        parentId: MENU_ID_AUTO_SAVE,
      });
      menusCheckedState.set(MENU_ID_AUTO_SAVE_DISABLED, true);
      menus.create({
        id: MENU_ID_AUTO_SAVE_TAB,
        type: "radio",
        title: MENU_AUTOSAVE_TAB_MESSAGE,
        contexts: defaultContexts,
        checked: false,
        parentId: MENU_ID_AUTO_SAVE,
      });
      menusCheckedState.set(MENU_ID_AUTO_SAVE_TAB, false);
      menus.create({
        id: MENU_ID_AUTO_SAVE_UNPINNED,
        type: "radio",
        title: MENU_AUTOSAVE_UNPINNED_TABS_MESSAGE,
        contexts: defaultContexts,
        checked: false,
        parentId: MENU_ID_AUTO_SAVE,
      });
      menusCheckedState.set(MENU_ID_AUTO_SAVE_UNPINNED, false);
      menus.create({
        id: MENU_ID_AUTO_SAVE_ALL,
        type: "radio",
        title: MENU_AUTOSAVE_ALL_TABS_MESSAGE,
        contexts: defaultContexts,
        checked: false,
        parentId: MENU_ID_AUTO_SAVE,
      });
      menusCheckedState.set(MENU_ID_AUTO_SAVE_ALL, false);
      menus.create({
        id: "separator-4",
        contexts: defaultContexts,
        type: "separator",
      });
      menus.create({
        id: MENU_ID_BATCH_SAVE_URLS,
        contexts: defaultContexts,
        title: MENU_BATCH_SAVE_URLS_MESSAGE,
      });
      menus.create({
        id: MENU_ID_VIEW_PENDINGS,
        contexts: defaultContexts,
        title: MENU_VIEW_PENDINGS_MESSAGE,
      });
    }
    menusCreated = true;
    if (pendingRefresh) {
      pendingRefresh = false;
      (await browser.tabs.query({})).forEach(
        async (tab) => await refreshTab$1(tab)
      );
    }
  }

  async function initialize() {
    if (BROWSER_MENUS_API_SUPPORTED) {
      createMenus();
      menus.onClicked.addListener(async (event, tab) => {
        if (event.menuItemId == MENU_ID_SAVE_PAGE) {
          if (event.linkUrl) {
            business$1.saveUrls([event.linkUrl]);
          } else {
            business$1.saveTabs([tab]);
          }
        }
        if (event.menuItemId == MENU_ID_EDIT_AND_SAVE_PAGE) {
          const allTabsData = await getPersistent(tab.id);
          if (allTabsData[tab.id].savedPageDetected) {
            business$1.openEditor(tab);
          } else {
            if (event.linkUrl) {
              business$1.saveUrls([event.linkUrl], { openEditor: true });
            } else {
              business$1.saveTabs([tab], { openEditor: true });
            }
          }
        }
        if (event.menuItemId == MENU_ID_SAVE_SELECTED_LINKS) {
          business$1.saveSelectedLinks(tab);
        }
        if (event.menuItemId == MENU_ID_VIEW_PENDINGS) {
          await browser.tabs.create({
            active: true,
            url: "/src/ui/pages/pendings.html",
          });
        }
        if (event.menuItemId == MENU_ID_SAVE_SELECTED) {
          business$1.saveTabs([tab], { selected: true });
        }
        if (event.menuItemId == MENU_ID_SAVE_FRAME) {
          business$1.saveTabs([tab], { frameId: event.frameId });
        }
        if (
          event.menuItemId == MENU_ID_SAVE_SELECTED_TABS ||
          event.menuItemId == MENU_ID_BUTTON_SAVE_SELECTED_TABS
        ) {
          const tabs = await queryTabs({
            currentWindow: true,
            highlighted: true,
          });
          business$1.saveTabs(tabs);
        }
        if (
          event.menuItemId == MENU_ID_SAVE_UNPINNED_TABS ||
          event.menuItemId == MENU_ID_BUTTON_SAVE_UNPINNED_TABS
        ) {
          const tabs = await queryTabs({ currentWindow: true, pinned: false });
          business$1.saveTabs(tabs);
        }
        if (
          event.menuItemId == MENU_ID_SAVE_ALL_TABS ||
          event.menuItemId == MENU_ID_BUTTON_SAVE_ALL_TABS
        ) {
          const tabs = await queryTabs({ currentWindow: true });
          business$1.saveTabs(tabs);
        }
        if (event.menuItemId == MENU_ID_BATCH_SAVE_URLS) {
          business$1.batchSaveUrls();
        }
        if (event.menuItemId == MENU_ID_AUTO_SAVE_TAB) {
          const allTabsData = await getPersistent(tab.id);
          allTabsData[tab.id].autoSave = true;
          await setPersistent(allTabsData);
          refreshExternalComponents(tab);
        }
        if (event.menuItemId == MENU_ID_AUTO_SAVE_DISABLED) {
          const allTabsData = await getPersistent();
          Object.keys(allTabsData).forEach((tabId) => {
            if (
              typeof allTabsData[tabId] == "object" &&
              allTabsData[tabId].autoSave
            ) {
              allTabsData[tabId].autoSave = false;
            }
          });
          allTabsData.autoSaveUnpinned = allTabsData.autoSaveAll = false;
          await setPersistent(allTabsData);
          refreshExternalComponents(tab);
        }
        if (event.menuItemId == MENU_ID_AUTO_SAVE_ALL) {
          const allTabsData = await getPersistent();
          allTabsData.autoSaveAll = event.checked;
          await setPersistent(allTabsData);
          refreshExternalComponents(tab);
        }
        if (event.menuItemId == MENU_ID_AUTO_SAVE_UNPINNED) {
          const allTabsData = await getPersistent();
          allTabsData.autoSaveUnpinned = event.checked;
          await setPersistent(allTabsData);
          refreshExternalComponents(tab);
        }
        if (event.menuItemId.startsWith(MENU_ID_SAVE_WITH_PROFILE_PREFIX)) {
          const profiles = await getProfiles();
          const profileId = event.menuItemId.split(
            MENU_ID_SAVE_WITH_PROFILE_PREFIX
          )[1];
          let profileName;
          if (profileId == "default") {
            profileName = DEFAULT_PROFILE_NAME;
          } else {
            const profileIndex = Number(profileId);
            profileName = Object.keys(profiles)[profileIndex];
          }
          profiles[profileName].profileName = profileName;
          business$1.saveTabs([tab], profiles[profileName]);
        }
        if (event.menuItemId.startsWith(MENU_ID_SELECT_PROFILE_PREFIX)) {
          const [profiles, allTabsData] = await Promise.all([
            getProfiles(),
            getPersistent(),
          ]);
          const profileId = event.menuItemId.split(
            MENU_ID_SELECT_PROFILE_PREFIX
          )[1];
          if (profileId == "default") {
            allTabsData.profileName = DEFAULT_PROFILE_NAME;
          } else {
            const profileIndex = Number(profileId);
            allTabsData.profileName = Object.keys(profiles)[profileIndex];
          }
          await setPersistent(allTabsData);
          refreshExternalComponents(tab);
        }
        if (
          event.menuItemId.startsWith(MENU_ID_ASSOCIATE_WITH_PROFILE_PREFIX)
        ) {
          const [profiles, rule] = await Promise.all([
            getProfiles(),
            getRule(tab.url, true),
          ]);
          const profileId = event.menuItemId.split(
            MENU_ID_ASSOCIATE_WITH_PROFILE_PREFIX
          )[1];
          let profileName;
          if (profileId == "default") {
            profileName = DEFAULT_PROFILE_NAME;
          } else if (profileId == "current") {
            profileName = CURRENT_PROFILE_NAME;
          } else {
            const profileIndex = Number(profileId);
            profileName = Object.keys(profiles)[profileIndex];
          }
          if (rule) {
            await updateRule(rule.url, rule.url, profileName, profileName);
          } else {
            await updateTitleValue(
              MENU_ID_ASSOCIATE_WITH_PROFILE,
              MENU_UPDATE_RULE_MESSAGE
            );
            await addRule(new URL(tab.url).hostname, profileName, profileName);
          }
        }
      });
      if (menusCreated) {
        pendingRefresh = true;
      } else {
        (await browser.tabs.query({})).forEach(
          async (tab) => await refreshTab$1(tab)
        );
      }
    }
  }

  async function refreshExternalComponents(tab) {
    const allTabsData = await getPersistent(tab.id);
    await refreshAutoSaveTabs();
    await refreshTab$2(tab);
    try {
      await browser.runtime.sendMessage({
        method: "options.refresh",
        profileName: allTabsData.profileName,
      });
    } catch (error) {
      // ignored
    }
  }

  async function refreshTab$1(tab) {
    if (BROWSER_MENUS_API_SUPPORTED && menusCreated) {
      const promises = [];
      const allTabsData = await getPersistent(tab.id);
      if (allTabsData[tab.id].editorDetected) {
        updateAllVisibleValues(false);
      } else {
        updateAllVisibleValues(true);
        promises.push(
          updateCheckedValue(
            MENU_ID_AUTO_SAVE_DISABLED,
            !allTabsData[tab.id].autoSave
          )
        );
        promises.push(
          updateCheckedValue(
            MENU_ID_AUTO_SAVE_TAB,
            allTabsData[tab.id].autoSave
          )
        );
        promises.push(
          updateCheckedValue(
            MENU_ID_AUTO_SAVE_UNPINNED,
            Boolean(allTabsData.autoSaveUnpinned)
          )
        );
        promises.push(
          updateCheckedValue(
            MENU_ID_AUTO_SAVE_ALL,
            Boolean(allTabsData.autoSaveAll)
          )
        );
        if (tab && tab.url) {
          const options = await getOptions(tab.url);
          promises.push(updateVisibleValue(tab, options.contextMenuEnabled));
          promises.push(
            updateTitleValue(
              MENU_ID_EDIT_AND_SAVE_PAGE,
              allTabsData[tab.id].savedPageDetected
                ? MENU_EDIT_PAGE_MESSAGE
                : MENU_EDIT_AND_SAVE_PAGE_MESSAGE
            )
          );
          promises.push(
            menus.update(MENU_ID_SAVE_SELECTED, {
              visible: !options.saveRawPage,
            })
          );
          promises.push(
            menus.update(MENU_ID_EDIT_AND_SAVE_PAGE, {
              visible:
                !options.openEditor || allTabsData[tab.id].savedPageDetected,
            })
          );
          let selectedEntryId =
            MENU_ID_ASSOCIATE_WITH_PROFILE_PREFIX + "default";
          let title = MENU_CREATE_DOMAIN_RULE_MESSAGE;
          const [profiles, rule] = await Promise.all([
            getProfiles(),
            getRule(tab.url),
          ]);
          if (rule) {
            const profileIndex = profileIndexes.get(rule.profile);
            if (profileIndex) {
              selectedEntryId =
                MENU_ID_ASSOCIATE_WITH_PROFILE_PREFIX + profileIndex;
              title = MENU_UPDATE_RULE_MESSAGE;
            }
          }
          if (Object.keys(profiles).length > 1) {
            Object.keys(profiles).forEach((profileName, profileIndex) => {
              if (profileName == DEFAULT_PROFILE_NAME) {
                promises.push(
                  updateCheckedValue(
                    MENU_ID_ASSOCIATE_WITH_PROFILE_PREFIX + "default",
                    selectedEntryId ==
                      MENU_ID_ASSOCIATE_WITH_PROFILE_PREFIX + "default"
                  )
                );
              } else {
                promises.push(
                  updateCheckedValue(
                    MENU_ID_ASSOCIATE_WITH_PROFILE_PREFIX + profileIndex,
                    selectedEntryId ==
                      MENU_ID_ASSOCIATE_WITH_PROFILE_PREFIX + profileIndex
                  )
                );
              }
            });
            promises.push(
              updateTitleValue(MENU_ID_ASSOCIATE_WITH_PROFILE, title)
            );
          }
        }
      }
      await Promise.all(promises);
    }
  }

  async function updateAllVisibleValues(visible) {
    const lastVisibleState = allMenuVisibleState;
    allMenuVisibleState = visible;
    if (lastVisibleState === undefined || lastVisibleState != visible) {
      const promises = [];
      try {
        MENU_TOP_VISIBLE_ENTRIES.forEach((id) =>
          promises.push(menus.update(id, { visible }))
        );
        await Promise.all(promises);
      } catch (error) {
        // ignored
      }
    }
  }

  async function updateVisibleValue(tab, visible) {
    const lastVisibleState = contextMenuVisibleState;
    contextMenuVisibleState = visible;
    if (lastVisibleState === undefined || lastVisibleState != visible) {
      await createMenus(tab);
    }
  }

  function updateTitleValue(id, title) {
    const lastTitleValue = menusTitleState.get(id);
    menusTitleState.set(id, title);
    if (lastTitleValue === undefined) {
      return menus.update(id, { title });
    } else if (lastTitleValue != title) {
      return menus.update(id, { title });
    }
  }

  async function updateCheckedValue(id, checked) {
    checked = Boolean(checked);
    menusCheckedState.set(id, checked);
    await menus.update(id, { checked });
  }

  /*
   * Copyright 2010-2020 Gildas Lormeau
   * contact : gildas.lormeau <at> gmail.com
   *
   * This file is part of arkWsaver.
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

  const commands = browser.commands;
  const BROWSER_COMMANDS_API_SUPPORTED =
    commands && commands.onCommand && commands.onCommand.addListener;

  let business;

  function init$1(businessApi) {
    business = businessApi;
  }

  if (BROWSER_COMMANDS_API_SUPPORTED) {
    commands.onCommand.addListener(async (command) => {
      if (command == "save-selected-tabs") {
        const highlightedTabs = await queryTabs({
          currentWindow: true,
          highlighted: true,
        });
        business.saveTabs(highlightedTabs, { optionallySelected: true });
      }
      if (command == "save-all-tabs") {
        const tabs = await queryTabs({ currentWindow: true });
        business.saveTabs(tabs);
      }
    });
  }

  /*
   * Copyright 2010-2020 Gildas Lormeau
   * contact : gildas.lormeau <at> gmail.com
   *
   * This file is part of arkWsaver.
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

  function init(businessApi) {
    init$2(businessApi);
    init$3(businessApi);
    init$1(businessApi);
  }

  function onMessage$6(message, sender) {
    if (message.method.endsWith(".refreshMenu")) {
      return onMessage$7(message);
    } else {
      return onMessage$8(message, sender);
    }
  }

  async function refreshTab(tab) {
    return Promise.all([createMenus(tab), refreshTab$2(tab)]);
  }

  function onForbiddenDomain(tab) {
    onForbiddenDomain$1(tab);
  }

  function onStart(tabId, step, autoSave) {
    onStart$1(tabId, step, autoSave);
  }

  async function onError(tabId, message, link) {
    onError$1(tabId);
    try {
      if (message) {
        await browser.tabs.sendMessage(tabId, {
          method: "content.error",
          error: message.toString(),
          link,
        });
      }
    } catch (error) {
      // ignored
    }
  }

  function onEdit(tabId) {
    onEdit$1(tabId);
  }

  function onEnd(tabId, autoSave) {
    onEnd$1(tabId, autoSave);
  }

  function onCancelled(tabId) {
    onCancelled$1(tabId);
  }

  function onUploadProgress(tabId, index, maxIndex) {
    onUploadProgress$1(tabId, index, maxIndex);
  }

  function onTabCreated$1(tab) {
    refreshTab$1(tab);
  }

  function onTabActivated$1(tab) {
    if (tab) {
      refreshTab$1(tab);
    }
  }

  function onInit$3(tab) {
    refreshTab$1(tab);
  }

  /*
   * Copyright 2010-2020 Gildas Lormeau
   * contact : gildas.lormeau <at> gmail.com
   *
   * This file is part of arkWsaver.
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

  const ERROR_CONNECTION_ERROR_CHROMIUM =
    "Could not establish connection. Receiving end does not exist.";
  const ERROR_CONNECTION_LOST_CHROMIUM =
    "The message port closed before a response was received.";
  const ERROR_CONNECTION_LOST_GECKO = "Message manager disconnected";
  const ERROR_EDITOR_PAGE_CHROMIUM = "Cannot access contents of url ";
  const INJECT_SCRIPTS_STEP = 1;
  const EXECUTE_SCRIPTS_STEP = 2;
  const TASK_PENDING_STATE = "pending";
  const TASK_PROCESSING_STATE = "processing";
  const CONTENT_SCRIPTS = [
    "lib/single-file.js",
    "lib/single-file-extension-infobar.js",
    "lib/single-file-extension.js",
  ];

  const tasks = [];
  let currentTaskId = 0,
    maxParallelWorkers;
  init({
    isSavingTab,
    saveTabs,
    saveUrls,
    cancelTab,
    openEditor,
    saveSelectedLinks,
    batchSaveUrls,
  });

  async function saveSelectedLinks(tab) {
    const scriptsInjected = await injectScript(tab.id);
    if (scriptsInjected) {
      const response = await browser.tabs.sendMessage(tab.id, {
        method: "content.getSelectedLinks",
      });
      if (response.urls && response.urls.length) {
        const tab = await batchSaveUrls();
        const onTabUpdated = (tabId, changeInfo) => {
          if (changeInfo.status == "complete" && tabId == tab.id) {
            browser.tabs.onUpdated.removeListener(onTabUpdated);
            browser.tabs.sendMessage(tab.id, {
              method: "newUrls.addURLs",
              urls: response.urls,
            });
          }
        };
        browser.tabs.onUpdated.addListener(onTabUpdated);
      }
    } else {
      onForbiddenDomain(tab);
    }
  }

  async function batchSaveUrls() {
    return browser.tabs.create({
      active: true,
      url: "/src/ui/pages/batch-save-urls.html",
    });
  }

  async function saveUrls(urls, options = {}) {
    await initMaxParallelWorkers();
    await Promise.all(
      urls.map(async (url) => {
        const tabOptions = await getOptions(url);
        Object.keys(options).forEach((key) => (tabOptions[key] = options[key]));
        tabOptions.autoClose = true;
        addTask({
          tab: { url },
          status: TASK_PENDING_STATE,
          options: tabOptions,
          method: "content.save",
        });
      })
    );
    runTasks();
  }

  async function saveTabs(tabs, options = {}) {
    await initMaxParallelWorkers();
    await Promise.all(
      tabs.map(async (tab) => {
        const tabId = tab.id;
        const tabOptions = await getOptions(tab.url);
        Object.keys(options).forEach((key) => (tabOptions[key] = options[key]));
        tabOptions.tabId = tabId;
        tabOptions.tabIndex = tab.index;
        const tabData = {
          id: tab.id,
          index: tab.index,
          url: tab.url,
          title: tab.title,
        };
        if (options.autoSave) {
          if (autoSaveIsEnabled(tab)) {
            const taskInfo = addTask({
              status: TASK_PROCESSING_STATE,
              tab: tabData,
              options: tabOptions,
              method: "content.autosave",
            });
            runTask(taskInfo);
          }
        } else {
          onStart(tabId, INJECT_SCRIPTS_STEP);
          const scriptsInjected = await injectScript(tabId, tabOptions);
          if (scriptsInjected || isEditor(tab)) {
            onStart(tabId, EXECUTE_SCRIPTS_STEP);
            addTask({
              status: TASK_PENDING_STATE,
              tab: tabData,
              options: tabOptions,
              method: "content.save",
            });
          } else {
            onForbiddenDomain(tab);
          }
        }
      })
    );
    runTasks();
  }

  function addTask(info) {
    const taskInfo = {
      id: currentTaskId,
      status: info.status,
      tab: info.tab,
      options: info.options,
      method: info.method,
      done: function () {
        tasks.splice(
          tasks.findIndex((taskInfo) => taskInfo.id == this.id),
          1
        );
        runTasks();
      },
    };
    tasks.push(taskInfo);
    currentTaskId++;
    return taskInfo;
  }

  function openEditor(tab) {
    browser.tabs.sendMessage(tab.id, { method: "content.openEditor" });
  }

  async function initMaxParallelWorkers() {
    if (!maxParallelWorkers) {
      maxParallelWorkers = (await getConfig()).maxParallelWorkers;
    }
  }

  function runTasks() {
    const processingCount = tasks.filter(
      (taskInfo) => taskInfo.status == TASK_PROCESSING_STATE
    ).length;
    for (
      let index = 0;
      index <
      Math.min(
        tasks.length - processingCount,
        maxParallelWorkers - processingCount
      );
      index++
    ) {
      const taskInfo = tasks.find(
        (taskInfo) => taskInfo.status == TASK_PENDING_STATE
      );
      if (taskInfo) {
        runTask(taskInfo);
      }
    }
  }

  async function runTask(taskInfo) {
    const taskId = taskInfo.id;
    taskInfo.status = TASK_PROCESSING_STATE;
    if (!taskInfo.tab.id) {
      let scriptsInjected;
      try {
        const tab = await createTabAndWaitUntilComplete({
          url: taskInfo.tab.url,
          active: false,
        });
        taskInfo.tab.id = taskInfo.options.tabId = tab.id;
        taskInfo.tab.index = taskInfo.options.tabIndex = tab.index;
        onStart(taskInfo.tab.id, INJECT_SCRIPTS_STEP);
        scriptsInjected = await injectScript(taskInfo.tab.id, taskInfo.options);
      } catch (tabId) {
        taskInfo.tab.id = tabId;
      }
      if (scriptsInjected) {
        onStart(taskInfo.tab.id, EXECUTE_SCRIPTS_STEP);
      } else {
        taskInfo.done();
        return;
      }
    }
    taskInfo.options.taskId = taskId;
    try {
      await browser.tabs.sendMessage(taskInfo.tab.id, {
        method: taskInfo.method,
        options: taskInfo.options,
      });
    } catch (error) {
      if (error && (!error.message || !isIgnoredError(error))) {
        console.log(error.message ? error.message : error); // eslint-disable-line no-console
        onError(taskInfo.tab.id, error.message, error.link);
        taskInfo.done();
      }
    }
  }

  function isIgnoredError(error) {
    return (
      error.message == ERROR_CONNECTION_LOST_CHROMIUM ||
      error.message == ERROR_CONNECTION_ERROR_CHROMIUM ||
      error.message == ERROR_CONNECTION_LOST_GECKO ||
      error.message.startsWith(
        ERROR_EDITOR_PAGE_CHROMIUM + JSON.stringify(EDITOR_URL)
      )
    );
  }

  function isSavingTab(tab) {
    return Boolean(tasks.find((taskInfo) => taskInfo.tab.id == tab.id));
  }

  function onInit$2(tab) {
    cancelTab(tab.id);
  }

  function onTabReplaced$2(addedTabId, removedTabId) {
    tasks.forEach((taskInfo) => {
      if (taskInfo.tab.id == removedTabId) {
        taskInfo.tab.id = addedTabId;
      }
    });
  }

  function onSaveEnd(taskId) {
    const taskInfo = tasks.find((taskInfo) => taskInfo.id == taskId);
    if (taskInfo) {
      if (taskInfo.options.autoClose && !taskInfo.cancelled) {
        browser.tabs.remove(taskInfo.tab.id);
      }
      taskInfo.done();
    }
  }

  async function injectScript(tabId, options = {}) {
    let scriptsInjected;
    const resultData = (
      await browser.scripting.executeScript({
        target: { tabId },
        func: () => Boolean(window.arkWsaver),
      })
    )[0];
    scriptsInjected = resultData && resultData.result;
    if (scriptsInjected) {
      try {
        await browser.scripting.executeScript({
          target: { tabId },
          files: CONTENT_SCRIPTS,
        });
        scriptsInjected = true;
      } catch (error) {
        // ignored
      }
    }
    if (scriptsInjected && options.frameId) {
      await browser.scripting.executeScript({
        target: {
          tabId,
          frameIds: [options.frameId],
        },
        func: () => (document.documentElement.dataset.requestedFrameId = true),
      });
    }
    return scriptsInjected;
  }

  async function createTabAndWaitUntilComplete(createProperties) {
    const tab = await browser.tabs.create(createProperties);
    return new Promise((resolve, reject) => {
      browser.tabs.onUpdated.addListener(onTabUpdated);
      browser.tabs.onRemoved.addListener(onTabRemoved);
      function onTabUpdated(tabId, changeInfo) {
        if (tabId == tab.id && changeInfo.status == "complete") {
          resolve(tab);
          browser.tabs.onUpdated.removeListener(onTabUpdated);
          browser.tabs.onRemoved.removeListener(onTabRemoved);
        }
      }
      function onTabRemoved(tabId) {
        if (tabId == tab.id) {
          reject(tabId);
          browser.tabs.onRemoved.removeListener(onTabRemoved);
        }
      }
    });
  }

  function setCancelCallback(taskId, cancelCallback) {
    const taskInfo = tasks.find((taskInfo) => taskInfo.id == taskId);
    if (taskInfo) {
      taskInfo.cancel = cancelCallback;
    }
  }

  function cancelTab(tabId) {
    Array.from(tasks)
      .filter(
        (taskInfo) => taskInfo.tab.id == tabId && !taskInfo.options.autoSave
      )
      .forEach(cancel);
  }

  function cancelTask(taskId) {
    cancel(tasks.find((taskInfo) => taskInfo.id == taskId));
  }

  function cancelAllTasks() {
    Array.from(tasks).forEach(cancel);
  }

  function getTasksInfo() {
    return tasks.map(mapTaskInfo);
  }

  function getTaskInfo(taskId) {
    return tasks.find((taskInfo) => taskInfo.id == taskId);
  }

  function cancel(taskInfo) {
    const tabId = taskInfo.tab.id;
    taskInfo.cancelled = true;
    browser.tabs.sendMessage(tabId, {
      method: "content.cancelSave",
      options: {
        loadDeferredImages: taskInfo.options.loadDeferredImages,
        loadDeferredImagesKeepZoomLevel:
          taskInfo.options.loadDeferredImagesKeepZoomLevel,
      },
    });
    if (taskInfo.cancel) {
      taskInfo.cancel();
    }
    if (taskInfo.method == "content.autosave") {
      onEnd(tabId, true);
    }
    onCancelled(taskInfo.tab);
    taskInfo.done();
  }

  function mapTaskInfo(taskInfo) {
    return {
      id: taskInfo.id,
      tabId: taskInfo.tab.id,
      index: taskInfo.tab.index,
      url: taskInfo.tab.url,
      title: taskInfo.tab.title,
      cancelled: taskInfo.cancelled,
      status: taskInfo.status,
    };
  }

  /*
   * Copyright 2010-2020 Gildas Lormeau
   * contact : gildas.lormeau <at> gmail.com
   *
   * This file is part of arkWsaver.
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

  /* global browser */

  let enabled = true;

  async function onMessage$5(message) {
    if (message.method.endsWith(".state")) {
      return { enabled };
    }
  }

  async function externalSave(pageData) {}

  async function save(pageData) {}

  /*
   * Copyright 2010-2020 Gildas Lormeau
   * contact : gildas.lormeau <at> gmail.com
   *
   * This file is part of arkWsaver.
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

  const pendingSaves = new Set();

  Promise.resolve().then(enable);

  async function onMessage$4(message) {
    if (message.method.endsWith(".saveCreatedBookmarks")) {
      enable();
      return {};
    }
    if (message.method.endsWith(".disable")) {
      disable();
      return {};
    }
  }

  async function enable() {
    try {
      browser.bookmarks.onCreated.removeListener(onCreated);
      browser.bookmarks.onMoved.removeListener(onMoved);
    } catch (error) {
      // ignored
    }
    let enabled;
    const profiles = await getProfiles();
    Object.keys(profiles).forEach((profileName) => {
      if (profiles[profileName].saveCreatedBookmarks) {
        enabled = true;
      }
    });
    if (enabled) {
      browser.bookmarks.onCreated.addListener(onCreated);
      browser.bookmarks.onMoved.addListener(onMoved);
    }
  }

  async function disable() {
    let disabled;
    const profiles = await getProfiles();
    Object.keys(profiles).forEach(
      (profileName) =>
        (disabled = disabled || !profiles[profileName].saveCreatedBookmarks)
    );
    if (disabled) {
      browser.bookmarks.onCreated.removeListener(onCreated);
      browser.bookmarks.onMoved.removeListener(onMoved);
    }
  }

  async function update(id, changes) {
    try {
      await browser.bookmarks.update(id, changes);
    } catch (error) {
      // ignored
    }
  }

  async function onCreated(bookmarkId, bookmarkInfo) {
    pendingSaves.add(bookmarkId);
    await saveBookmark(bookmarkId, bookmarkInfo.url, bookmarkInfo);
  }

  async function onMoved(bookmarkId, bookmarkInfo) {
    if (pendingSaves.has(bookmarkId)) {
      const bookmarks = await browser.bookmarks.get(bookmarkId);
      if (bookmarks[0]) {
        await saveBookmark(bookmarkId, bookmarks[0].url, bookmarkInfo);
      }
    }
  }

  async function saveBookmark(bookmarkId, url, bookmarkInfo) {
    const activeTabs = await browser.tabs.query({
      lastFocusedWindow: true,
      active: true,
    });
    const options = await getOptions(url);
    if (options.saveCreatedBookmarks) {
      const bookmarkFolders = await getParentFolders(bookmarkInfo.parentId);
      const allowedBookmarkSet = options.allowedBookmarkFolders.toString();
      const allowedBookmark = bookmarkFolders.find((folder) =>
        options.allowedBookmarkFolders.includes(folder)
      );
      const ignoredBookmarkSet = options.ignoredBookmarkFolders.toString();
      const ignoredBookmark = bookmarkFolders.find((folder) =>
        options.ignoredBookmarkFolders.includes(folder)
      );
      if (
        ((allowedBookmarkSet && allowedBookmark) || !allowedBookmarkSet) &&
        ((ignoredBookmarkSet && !ignoredBookmark) || !ignoredBookmarkSet)
      ) {
        if (activeTabs.length && activeTabs[0].url == url) {
          pendingSaves.delete(bookmarkId);
          saveTabs(activeTabs, { bookmarkId, bookmarkFolders });
        } else {
          const tabs = await browser.tabs.query({});
          if (tabs.length) {
            const tab = tabs.find((tab) => tab.url == url);
            if (tab) {
              pendingSaves.delete(bookmarkId);
              saveTabs([tab], { bookmarkId, bookmarkFolders });
            } else {
              if (url) {
                if (url == "about:blank") {
                  browser.bookmarks.onChanged.addListener(onChanged);
                } else {
                  saveUrl(url);
                }
              }
            }
          }
        }
      }
    }

    async function getParentFolders(id, folderNames = []) {
      if (id) {
        const bookmarkNode = (await browser.bookmarks.get(id))[0];
        if (bookmarkNode && bookmarkNode.title) {
          folderNames.unshift(bookmarkNode.title);
          await getParentFolders(bookmarkNode.parentId, folderNames);
        }
      }
      return folderNames;
    }

    function onChanged(id, changeInfo) {
      if (id == bookmarkId && changeInfo.url) {
        browser.bookmarks.onChanged.removeListener(onChanged);
        saveUrl(changeInfo.url);
      }
    }

    function saveUrl(url) {
      pendingSaves.delete(bookmarkId);
      saveUrls([url], { bookmarkId });
    }
  }

  /*
   * Copyright 2010-2020 Gildas Lormeau
   * contact : gildas.lormeau <at> gmail.com
   *
   * This file is part of arkWsaver.
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
  /* global fetch */
  const urlService = "https://api.woleet.io/v1/anchor";
  const apiKey = "";
  async function anchor(hash, userKey) {
    let bearer = userKey || apiKey;
    const response = await fetch(urlService, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + bearer,
      },
      body: JSON.stringify({
        name: hash,
        hash: hash,
        public: true,
      }),
    });
    if (response.status == 401) {
      const error = new Error(
        "Your access token on Woleet is invalid. Go to __DOC_LINK__ to create your account."
      );
      error.link = "https://app.woleet.io/";
      throw error;
    } else if (response.status == 402) {
      const error = new Error(
        "You have no more credits on Woleet. Go to __DOC_LINK__ to recharge them."
      );
      error.link = "https://app.woleet.io/";
      throw error;
    } else if (response.status >= 400) {
      throw new Error(
        (response.statusText || "Error " + response.status) + " (Woleet)"
      );
    }
    return response.json();
  }

  async function sendFile(mediaUploader) {
    let content = mediaUploader.file,
      end = mediaUploader.file.size;
    if (mediaUploader.offset || mediaUploader.chunkSize) {
      if (mediaUploader.chunkSize) {
        end = Math.min(
          mediaUploader.offset + mediaUploader.chunkSize,
          mediaUploader.file.size
        );
      }
      content = content.slice(mediaUploader.offset, end);
    }
    const httpResponse = await fetch(mediaUploader.url, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + mediaUploader.token,
        "Content-Type": mediaUploader.contentType,
        "Content-Range":
          "bytes " +
          mediaUploader.offset +
          "-" +
          (end - 1) +
          "/" +
          mediaUploader.file.size,
        "X-Upload-Content-Type": mediaUploader.contentType,
      },
      body: content,
    });
    if (mediaUploader.onProgress && !mediaUploader.cancelled) {
      mediaUploader.onProgress(
        mediaUploader.offset + mediaUploader.chunkSize,
        mediaUploader.file.size
      );
    }
    if (httpResponse.status == 200 || httpResponse.status == 201) {
      return httpResponse.json();
    } else if (httpResponse.status == 308) {
      const range = httpResponse.headers.get("Range");
      if (range) {
        mediaUploader.offset = parseInt(range.match(/\d+/g).pop(), 10) + 1;
      }
      if (mediaUploader.cancelled) {
        throw new Error("upload_cancelled");
      } else {
        return sendFile(mediaUploader);
      }
    } else {
      getResponse(httpResponse);
    }
  }

  async function getJSON(httpResponse) {
    httpResponse = getResponse(httpResponse);
    const response = await httpResponse.json();
    if (response.error) {
      throw new Error(response.error);
    } else {
      return response;
    }
  }

  function getResponse(httpResponse) {
    if (httpResponse.status == 200) {
      return httpResponse;
    } else if (httpResponse.status == 404) {
      throw new Error("path_not_found");
    } else if (httpResponse.status == 401) {
      throw new Error("invalid_token");
    } else {
      throw new Error("unknown_error (" + httpResponse.status + ")");
    }
  }

  /*
   * Copyright 2010-2020 Gildas Lormeau
   * contact : gildas.lormeau <at> gmail.com
   *
   * This file is part of arkWsaver.
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

  let pendingPush;

  async function pushArkWsites(token, path, content) {
    while (pendingPush) {
      await pendingPush;
    }

    const controller = new AbortController();
    pendingPush = (async () => {
      try {
        await createContent({ path, content }, controller.signal);
      } finally {
        pendingPush = null;
      }
    })();
    return {
      cancelPush: () => controller.abort(),
      pushPromise: pendingPush,
    };

    async function createContent({ path, content, message = "" }, signal) {
      const contentus = content[0];
      const regex = /url: (https?:\/\/[^ ]*)/;
      const url = contentus.substring(0, 350).match(regex)[1];

      try {
        let web = {
          title: path,
          url: url,
          content: content[0],
          token: token,
        };

        const response = await fetch(`http://arkwsites.com/api/v1/sfile`, {
          method: "POST",
          body: JSON.stringify(web),
          headers: {
            "Content-Type": "application/json",
            Authorization: `token ${token}`,
          },
          signal,
        });

        const responseData = await response.json();
        if (response.status < 400) {
          return responseData;
        } else {
          throw new Error(responseData.message);
        }
      } catch (error) {
        if (error.name != "AbortError") {
          throw error;
        }
      }
    }
  }

  /*
   * Copyright 2010-2020 Gildas Lormeau
   * contact : gildas.lormeau <at> gmail.com
   *
   * This file is part of arkWsaver.
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

  const CONFLICT_ACTION_SKIP = "skip";
  const CONFLICT_ACTION_UNIQUIFY = "uniquify";
  const REGEXP_ESCAPE = /([{}()^$&.*?/+|[\\\\]|\]|-)/g;

  async function onMessage$3(message, sender) {
    if (message.method.endsWith(".download")) {
      return downloadTabPage(message, sender.tab);
    }
    if (message.method.endsWith(".end")) {
      if (message.hash) {
        try {
          await anchor(message.hash, message.woleetKey);
        } catch (error) {
          onError(sender.tab.id, error.message, error.link);
        }
      }
      onSaveEnd(message.taskId);
      return {};
    }
    if (message.method.endsWith(".getInfo")) {
      return getTasksInfo();
    }
    if (message.method.endsWith(".cancel")) {
      cancelTask(message.taskId);
      return {};
    }
    if (message.method.endsWith(".cancelAll")) {
      cancelAllTasks();
      return {};
    }
    if (message.method.endsWith(".saveUrls")) {
      saveUrls(message.urls);
      return {};
    }
  }

  async function downloadTabPage(message, tab) {
    if (message.openEditor) {
      onEdit(tab.id);
      await open({
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

        if (tab.url.endsWith("pages/editor.html")) {
          chrome.tabs.remove(tab.id, function () {});
        }
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
      onEnd(tab.id);
      if (message.openSavedPage) {
        const createTabProperties = { active: true, url: message.content };
        if (tab.index != null) {
          createTabProperties.index = tab.index + 1;
        }
        browser.tabs.create(createTabProperties);
      }
    } catch (error) {
      if (!error.message || error.message != "upload_cancelled") {
        onError(tab.id, error.message, error.link);
      }
    }
  }

  function encodeSharpCharacter(path) {
    return path.replace(/#/g, "%23");
  }

  function getRegExp(string) {
    return string.replace(REGEXP_ESCAPE, "\\$1");
  }

  async function getAuthInfo(authOptions, force) {}

  async function saveToArkWsites(taskId, filename, content, ArkWsitesToken) {
    const taskInfo = getTaskInfo(taskId);
    if (!taskInfo || !taskInfo.cancelled) {
      if (
        !ArkWsitesToken ||
        ArkWsitesToken === "undefined" ||
        ArkWsitesToken === "null" ||
        ArkWsitesToken === ""
      ) {
        throw new Error(
          "Please setup your token --> https://arkwsites.com/plugin-configuration"
        );
      }

      const pushInfo = pushArkWsites(ArkWsitesToken, filename, content);
      setCancelCallback(taskId, pushInfo.cancelPush);
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
        await update(pageData.bookmarkId, { url: downloadData.filename });
      }
    }
  }

  /*
   * Copyright 2010-2020 Gildas Lormeau
   * contact : gildas.lormeau <at> gmail.com
   *
   * This file is part of arkWsaver.
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

  /* global browser, fetch, Blob */

  const OFFSCREEN_DOCUMENT_URL = "/src/ui/pages/offscreen-document.html";

  const pendingMessages = {};
  const replacedTabIds = {};

  async function onMessage$2(message, sender) {
    if (message.method.endsWith(".save")) {
      if (message.autoSaveDiscard || message.autoSaveRemove) {
        if (sender.tab) {
          message.tab = sender.tab;
          pendingMessages[sender.tab.id] = message;
        } else if (
          pendingMessages[message.tabId] &&
          ((pendingMessages[message.tabId].removed && message.autoSaveRemove) ||
            (pendingMessages[message.tabId].discarded &&
              message.autoSaveDiscard))
        ) {
          delete pendingMessages[message.tabId];
          await saveContent(message, {
            id: message.tabId,
            index: message.tabIndex,
            url: sender.url,
          });
        }
        if (message.autoSaveUnload) {
          delete pendingMessages[message.tabId];
          await saveContent(message, sender.tab);
        }
      } else {
        delete pendingMessages[message.tabId];
        await saveContent(message, sender.tab);
      }
      return {};
    }
  }

  function onTabUpdated$1(tabId) {
    delete pendingMessages[tabId];
  }

  async function onTabRemoved$1(tabId) {
    const message = pendingMessages[tabId];
    if (message) {
      if (message.autoSaveRemove) {
        delete pendingMessages[tabId];
        await saveContent(message, message.tab);
      }
    } else {
      pendingMessages[tabId] = { removed: true };
    }
  }

  async function onTabDiscarded(tabId) {
    const message = pendingMessages[tabId];
    if (message) {
      delete pendingMessages[tabId];
      await saveContent(message, message.tab);
    } else {
      pendingMessages[tabId] = { discarded: true };
    }
  }

  async function onTabReplaced$1(addedTabId, removedTabId) {
    if (pendingMessages[removedTabId] && !pendingMessages[addedTabId]) {
      pendingMessages[addedTabId] = pendingMessages[removedTabId];
      delete pendingMessages[removedTabId];
      replacedTabIds[removedTabId] = addedTabId;
    }
  }

  async function onMessageExternal(message, currentTab) {
    if (message.method == "enableAutoSave") {
      const allTabsData = await getPersistent(currentTab.id);
      allTabsData[currentTab.id].autoSave = message.enabled;
      await setPersistent(allTabsData);
      refreshTab(currentTab);
    }
    if (message.method == "isAutoSaveEnabled") {
      return autoSaveIsEnabled(currentTab);
    }
  }

  async function onInit$1(tab) {
    const [options, autoSaveEnabled] = await Promise.all([
      getOptions(tab.url, true),
      autoSaveIsEnabled(tab),
    ]);
    if (
      options &&
      (options.autoSaveLoad || options.autoSaveLoadOrUnload) &&
      autoSaveEnabled
    ) {
      saveTabs([tab], { autoSave: true });
    }
  }

  async function saveContent(message, tab) {
    const tabId = tab.id;
    const options = await getOptions(tab.url, true);
    if (options) {
      onStart(tabId, 1, true);
      options.content = message.content;
      options.url = message.url;
      options.frames = message.frames;
      options.canvases = message.canvases;
      options.fonts = message.fonts;
      options.stylesheets = message.stylesheets;
      options.images = message.images;
      options.posters = message.posters;
      options.videos = message.videos;
      options.usedFonts = message.usedFonts;
      options.shadowRoots = message.shadowRoots;
      options.referrer = message.referrer;
      options.updatedResources = message.updatedResources;
      options.visitDate = new Date(message.visitDate);
      options.backgroundTab = true;
      options.autoSave = true;
      options.incognito = tab.incognito;
      options.tabId = tabId;
      options.tabIndex = tab.index;
      options.keepFilename = options.saveToArkWsites;
      let pageData;
      try {
        if (options.autoSaveExternalSave) {
          await externalSave(options);
        } else {
          pageData = await getPageData(options);
          pageData.url = pageData.content;
          pageData.content = await (await fetch(pageData.content)).text();
          if (options.saveToArkWsites) {
            await (
              await saveToArkWsites(
                message.taskId,
                encodeSharpCharacter(pageData.filename),
                pageData.content,
                options.ArkWsitesToken
              )
            ).pushPromise;
          } else {
            await downloadPage(pageData, options);
            if (options.openSavedPage) {
              const createTabProperties = {
                active: true,
                url: pageData.url,
                windowId: tab.windowId,
              };
              const index = tab.index;
              try {
                await browser.tabs.get(tabId);
                createTabProperties.index = index + 1;
              } catch (error) {
                createTabProperties.index = index;
              }
              browser.tabs.create(createTabProperties);
            }
          }
          if (pageData.hash) {
            await anchor(pageData.hash, options.woleetKey);
          }
        }
      } finally {
        if (message.taskId) {
          onSaveEnd(message.taskId);
        } else if (options.autoClose) {
          browser.tabs.remove(replacedTabIds[tabId] || tabId);
          delete replacedTabIds[tabId];
        }
        if (pageData && pageData.url) {
          revokeObjectURL(pageData.url);
        }
        onEnd(tabId, true);
      }
    }
  }

  async function getPageData(options) {
    await createOffscreenDocument();
    return browser.runtime.sendMessage({ method: "offscreen.save", options });
  }

  async function revokeObjectURL(url) {
    await createOffscreenDocument();
    return browser.runtime.sendMessage({
      method: "offscreen.revokeObjectURL",
      url,
    });
  }

  async function createOffscreenDocument() {
    if (!(await browser.offscreen.hasDocument())) {
      await browser.offscreen.createDocument({
        url: OFFSCREEN_DOCUMENT_URL,
        justification: "Auto-save feature",
        reasons: ["DOM_PARSER"],
      });
    }
  }

  /*
   * Copyright 2010-2020 Gildas Lormeau
   * contact : gildas.lormeau <at> gmail.com
   *
   * This file is part of arkWsaver.
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

  async function onMessage$1(message) {
    if (message.method.endsWith(".resourceCommitted")) {
      if (
        message.tabId &&
        message.url &&
        (message.type == "stylesheet" || message.type == "script")
      ) {
        await browser.tabs.sendMessage(message.tabId, message);
      }
    }
  }

  /*
   * Copyright 2010-2020 Gildas Lormeau
   * contact : gildas.lormeau <at> gmail.com
   *
   * This file is part of arkWsaver.
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

  const DELAY_MAYBE_INIT = 1500;

  browser.tabs.onCreated.addListener((tab) => onTabCreated(tab));
  browser.tabs.onActivated.addListener((activeInfo) =>
    onTabActivated(activeInfo)
  );
  browser.tabs.onRemoved.addListener((tabId) => onTabRemoved(tabId));
  browser.tabs.onUpdated.addListener((tabId, changeInfo) =>
    onTabUpdated(tabId, changeInfo)
  );
  browser.tabs.onReplaced.addListener((addedTabId, removedTabId) =>
    onTabReplaced(addedTabId, removedTabId)
  );

  async function onMessage(message, sender) {
    if (message.method.endsWith(".init")) {
      await onInit(sender.tab, message);
      onInit$3(sender.tab);
      onInit$2(sender.tab);
      onInit$1(sender.tab);
    }
    if (message.method.endsWith(".getOptions")) {
      return getOptions(message.url);
    }
    if (message.method.endsWith(".activate")) {
      await browser.tabs.update(message.tabId, { active: true });
    }
  }

  async function onInit(tab, options) {
    await remove(tab.id);
    const allTabsData = await getPersistent(tab.id);
    allTabsData[tab.id].savedPageDetected = options.savedPageDetected;
    await setPersistent(allTabsData);
  }

  async function onTabUpdated(tabId, changeInfo) {
    if (changeInfo.status == "complete") {
      setTimeout(async () => {
        try {
          await browser.tabs.sendMessage(tabId, {
            method: "content.maybeInit",
          });
        } catch (error) {
          // ignored
        }
      }, DELAY_MAYBE_INIT);
      onTabUpdated$1(tabId);
      const tab = await browser.tabs.get(tabId);
      if (isEditor(tab)) {
        const allTabsData = await getPersistent(tab.id);
        allTabsData[tab.id].editorDetected = true;
        await setPersistent(allTabsData);
        onTabActivated$1(tab);
      }
    }
    if (changeInfo.discarded) {
      onTabDiscarded(tabId);
    }
  }

  function onTabReplaced(addedTabId, removedTabId) {
    onTabReplaced$3(addedTabId, removedTabId);
    onTabReplaced$1(addedTabId, removedTabId);
    onTabReplaced$2(addedTabId, removedTabId);
  }

  function onTabCreated(tab) {
    onTabCreated$1(tab);
  }

  async function onTabActivated(activeInfo) {
    const tab = await browser.tabs.get(activeInfo.tabId);
    onTabActivated$1(tab);
  }

  function onTabRemoved(tabId) {
    remove(tabId);
    onTabRemoved$2(tabId);
    cancelTab(tabId);
    onTabRemoved$1(tabId);
  }

  /*
   * Copyright 2010-2020 Gildas Lormeau
   * contact : gildas.lormeau <at> gmail.com
   *
   * This file is part of arkWsaver.
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

  browser.runtime.onMessage.addListener((message, sender) => {
    if (message.method.startsWith("tabs.")) {
      return onMessage(message, sender);
    }
    if (message.method.startsWith("downloads.")) {
      return onMessage$3(message, sender);
    }
    if (message.method.startsWith("autosave.")) {
      return onMessage$2(message, sender);
    }
    if (message.method.startsWith("ui.")) {
      return onMessage$6(message, sender);
    }
    if (message.method.startsWith("config.")) {
      return onMessage$b(message);
    }
    if (message.method.startsWith("tabsData.")) {
      return onMessage$c(message);
    }
    if (message.method.startsWith("devtools.")) {
      return onMessage$1(message);
    }
    if (message.method.startsWith("editor.")) {
      return onMessage$9(message, sender);
    }
    if (message.method.startsWith("bookmarks.")) {
      return onMessage$4(message);
    }
    if (message.method.startsWith("bootstrap.")) {
      return onMessage$a(message, sender);
    }
  });
  if (browser.runtime.onMessageExternal) {
    browser.runtime.onMessageExternal.addListener(async (message, sender) => {
      const tabs = await browser.tabs.query({
        currentWindow: true,
        active: true,
      });
      const currentTab = tabs[0];
      if (currentTab) {
        return onMessageExternal(message, currentTab);
      } else {
        return false;
      }
    });
  }
})();
