'use strict';

const $ = require('jquery');
const md5 = require('blueimp-md5');

module.exports = async function () {
  const baseItems = [];
  $('video').each(function (i) {
    let url;
    try {
      url = this.src || ($(this).find('source').length > 0 ? $(this).find('source')[0].src : '');
    } catch (error) {
      return console.error(error);
    }
    if (!url) return;

    const meta = {};
    // use HLS data instead
    if (url.startsWith('blob:')) {
      if (m3u8.url && m3u8.data) {
        url = m3u8.url;
        meta.m3u8Data = m3u8.data;
      } else {
        return;
      }
    }

    const id = `mono-${md5(url)}`
    const container = this.parentElement;
    const position = { x: -10, y: 10 };
    baseItems.push({id, url, meta, container, position});
  })

  return baseItems;
}