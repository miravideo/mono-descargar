// ==UserScript==
// @name         mono-sample
// @namespace    http://tampermonkey.net/
// @version      0.4.0
// @description  a video downloader for afu
// @author       milkliker
// @license      MIT License
// @run-at       document-start
// @grant        GM_download
// @include      *://*/*
// @inject-into  page
// @require      https://raw.githubusercontent.com/miravideo/mono-descargar/v0.4.0/dist/mono.min.js
// @downloadURL  https://raw.githubusercontent.com/miravideo/mono-descargar/master/sample.user.js
// ==/UserScript==

(function () {
  const mono = window['mono-descargar'];
  const useDefaultErr = mono.FAIL_TO_DEFAULT; // specific error code
  const $             = mono.jQuery; // mono-descargar has jQuery 3.6.0 included.
  const md5           = mono.md5;    // mono-descargar has md5 included.
  
  const parser = async function () {
    // fail over to default parser if needed
    // if (window.location.href === '...') throw useDefaultErr;

    const items = [];
    $('video').each(function (i) {
      let url;
      try {
        url = this.src || ($(this).find('source').length > 0 ? $(this).find('source')[0].src : '');
      } catch (error) {
        return console.error(error);
      }
      if (!url) return;

      const meta = {
        name: 'filename.mp4',
        headers: [], // custom headers if needed
        title: '...',
      };
      const id = md5(url);                  // unique id 
      const container = this.parentElement; // to put download button in
      const position = { x: -10, y: 10 };   // button position offset
      const item = {id, url, meta, container, position };
      // console.log(item);
      items.push(item);
    })
    return items;
  }

  if (mono?.init) mono.init({ 
    parser, // custom parser returns items with aync call
    interval: 100, // update every 100ms
  });
})()