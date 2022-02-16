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
    const id = `mono-${md5(url)}`
    const container = this.parentElement;
    const position = { x: -10, y: 10 };
    baseItems.push({id, url, meta, container, position });
  })

  return baseItems;
}