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

/* global fetch, btoa, AbortController */

export { pushArkWsites };

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
