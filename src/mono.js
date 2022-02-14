'use strict';
import Vue from 'vue';
const $ = require('jquery');
const defaultParser = require('./parser');
const { getCurrentTime, deepCopy, isActiveWindow, safePath } = require('./util.js');
const { enableDrag } = require('./drag.js');
const md5 = require('blueimp-md5');
const FAIL_TO_DEFAULT = 999;
const DEFAULT_INTER = 50;

class DownloadManager {
  constructor({ parser, interval }) {
    this.items = {};
    this.setParser(parser);
    this.start(interval);
  }

  start(interval) {
    this.interval = Number(interval) || DEFAULT_INTER;
    $(document).ready(() => {
      enableDrag('mono-dsg-btn');
      this.updateItems();
    });
  }

  setParser(parser) {
    if (parser && typeof parser === 'function') this.parser = parser;
    if (!this.parser) this.parser = defaultParser;
  }

  async updateItems() {
    // 如果不是当前tab且不是自动下载的状态，就降频刷新
    if (!isActiveWindow()) { //  && !settings.useAuto
      return setTimeout(() => this.updateItems(), this.interval * 100);
    }

    let items;
    try {
      items = await this.parser();
    } catch (error) {
      // failover to defaultParser
      if (error === FAIL_TO_DEFAULT && this.parser != defaultParser) {
        items = await defaultParser();
      } else {
        console.log("parser error", error)
      }
    }
    if (items) this.renderItems(items);
    // autoDownload();
    setTimeout(() => this.updateItems(), this.interval);
  }

  renderItems(newItems) {
    for (var i in newItems) {
      var item = newItems[i];
      var oldItem = this.items[item.id];
      if (oldItem && oldItem.$vm) {
        // 找到id，就不做任何操作了
        if ($(`#${oldItem.$vm.id}`).length > 0) continue;
        if (oldItem.meta != item.meta && oldItem.$vm) oldItem.$vm.remove();
      } else {
        this.items[item.id] = item;
      }
      this.renderItem(item);
    }
  }

  renderItem(item) {
    if (!item.container) return;
    const key = 'data-mono-descargar';
    const children = $(item.container).find(`[${key}]`);
    // 如果container下已经有按钮了，需要检查，避免重复添加
    if (children.length > 0) {
      for (let i = 0; i < children.length; i++) {
        if (item.id == children[i].id) return;
        $(children[i]).remove();
      }
    }

    const btnView = require("./button.vue").default;
    const vm = new Vue({ render: h => h(btnView, { props: { item } }) }).$mount();
    item.container.appendChild(vm.$el);
    item.$vm = vm.$children[0];
    item.$vm.$on('download', this.download);
  }

  download(item) {
    const name = safePath(item.meta?.name || ('mono-' + md5(item.url) + '.mp4'));
    const headers = { referer: window.location.href, ...(item.meta?.headers || {}) };
    const opts = {
      url: item.url, name, headers, meta: item.meta,
      onprogress: res => {
        let progress = 0;
        if (typeof res === 'object' && res.loaded > 0 && res.total > 0) {
          progress = Number(res.loaded / res.total);
        }
        if (!isNaN(progress) && progress > 0) item.progress = progress;
      },
      onerror: res => {
        console.log('onerror', res);
        setTimeout(() => item.status = 'init', 500);
      },
      onload: res => {
        console.log('onload', res);
        item.status = 'done';
      }
    }

    // download handler
    if (item.meta?.m3u8Data) {
      opts.data = item.meta.m3u8Data;
      opts.type = 'm3u8';
    } else if (item.meta?.audio) {
      opts.data = item.meta.audio;
      opts.type = 'merge';
    } else if (!opts.type) {
      opts.type = 'download';
    }

    console.log('on download', opts);
    GM_download(opts);
  }
}

let instance;
export default {
  FAIL_TO_DEFAULT,
  jQuery: $,
  md5,
  init: (options) => {
    if (!instance) instance = new DownloadManager(options || {});
    return instance;
  }
}