(function () {
  "use strict";

  /*
   * Copyright 2010-2022 Gildas Lormeau
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

  /* global globalThis */

  const browser$1 = globalThis.browser;
  const document = globalThis.document;
  const Document = globalThis.Document;

  if (
    document instanceof Document &&
    browser$1 &&
    browser$1.runtime &&
    browser$1.runtime.getURL
  ) {
    const scriptElement = document.createElement("script");
    scriptElement.src = browser$1.runtime.getURL(
      "/lib/single-file-hooks-frames.js"
    );
    scriptElement.async = false;
    (document.documentElement || document).appendChild(scriptElement);
    scriptElement.remove();
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

  /* global browser, window */

  const fetch = (url, options) => window.fetch(url, options);

  let pendingResponses = new Map();

  browser.runtime.onMessage.addListener((message) => {
    if (
      message.method == "arkWsaver.fetchFrame" &&
      window.frameId &&
      window.frameId == message.frameId
    ) {
      return onFetchFrame(message);
    }
    if (message.method == "arkWsaver.fetchResponse") {
      return onFetchResponse(message);
    }
  });

  async function onFetchFrame(message) {
    try {
      const response = await fetch(message.url, {
        cache: "force-cache",
        headers: message.headers,
      });
      return {
        status: response.status,
        headers: [...response.headers],
        array: Array.from(new Uint8Array(await response.arrayBuffer())),
      };
    } catch (error) {
      return {
        error: error && error.toString(),
      };
    }
  }

  async function onFetchResponse(message) {
    const pendingResponse = pendingResponses.get(message.requestId);
    if (pendingResponse) {
      if (message.error) {
        pendingResponse.reject(new Error(message.error));
        pendingResponses.delete(message.requestId);
      } else {
        if (message.truncated) {
          if (pendingResponse.array) {
            pendingResponse.array = pendingResponse.array.concat(message.array);
          } else {
            pendingResponse.array = message.array;
            pendingResponses.set(message.requestId, pendingResponse);
          }
          if (message.finished) {
            message.array = pendingResponse.array;
          }
        }
        if (!message.truncated || message.finished) {
          pendingResponse.resolve({
            status: message.status,
            headers: {
              get: (headerName) =>
                message.headers && message.headers[headerName],
            },
            arrayBuffer: async () => new Uint8Array(message.array).buffer,
          });
          pendingResponses.delete(message.requestId);
        }
      }
    }
    return {};
  }
})();
