// ==UserScript==
// @name         mono-descargar
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  a video downloader for afu
// @author       milkliker
// @license      MIT License
// @run-at       document-start
// @grant        GM_download
// @include      *://*/*
// @inject-into  page
// @require      https://raw.githubusercontent.com/miravideo/mono-descargar/master/dist/mono.min.js
// @downloadURL  https://raw.githubusercontent.com/miravideo/mono-descargar/master/sample.user.js
// ==/UserScript==

(function () {
    const $ = window.jQuery;
    const mono = window['mono-descargar'];
    if (mono?.init) mono.init({});
  })()
  
  