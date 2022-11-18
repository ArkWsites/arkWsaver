# FAQ

## Why can't I save some pages?

For security purposes, browsers block web extensions on certain domains. This prevents a malicious extension to remove or change bad reviews.

## Why don't interactive elements like folding titles, dynamic maps or carousels work properly in saved pages?

These elements need JavaScript to work properly. By default, ArkWSaver removes scripts because they can alter the rendering and there is no guarantee they will work offline. However, you can save them by unchecking the option "Network > blocked resources > scripts", unchecking "HTML Content > remove hidden elements" and optionally checking the option "HTML Content > save raw page".

## What are the permissions requested by ArkWsaver for?

The permissions requested by ArkWSaver are defined in the [manifest.json](https://github.com/gildas-lormeau/SingleFile/blob/master/manifest.json) file. Below are the reasons why they are necessary.

- `storage`: allows ArkWsaver to store your settings.
- `menus/contextMenus`: allows ArkWsaver to display an entry in the context menu of web pages.
- `tabs` (all_urls): allows ArkWsaver to inject the code needed to process a page in any tab. This permission is needed for saving several tabs in one click, for example.

## ArkWsaver is slow on my computer, can it run faster?

The default configuration of ArkWsaver is optimized to produce small pages. This can sometimes slow down the save process considerably. Below are the options you can disable to save time and CPU.

- HTML content > remove hidden elements
- Stylesheets > remove unused styles

You can also disable the options below. Some resources (e.g. images, frames) on the page may be missing though.

- HTML content > remove frames
- Images > save deferred images
