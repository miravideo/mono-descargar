'use strict';
import Vue from 'vue';
const $ = require('jquery');
const defaultParser = require('./parser');
const { getCurrentTime, deepCopy, isActiveWindow, filename } = require('./util.js');
const { enableDrag } = require('./drag.js');
const md5 = require('blueimp-md5');
const FAIL_TO_DEFAULT = 999;
const DEFAULT_INTER = 100;

const win = unsafeWindow || window;
if (!win['mono-pionero']) {
  let listener;

  const origOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url, ...rest) {
    this.addEventListener('load', function() {
      if (this.responseType && this.responseType !== "text") return;
      try {
        const data = {method, url, resp: this.responseText};
        if (listener) listener(data);
      } catch (e) {}
    });
    origOpen.call(this, method, url, ...rest);
  };

  const originFetch = fetch;
  unsafeWindow.fetch = async (url, request) => {
    const response = await originFetch(url, request);
    try {
      const resp = response.clone();
      const data = {method: 'fetch', url, resp: await resp.text()};
      if (listener) listener(data);
    } catch (e) {}
    return response;
  }

  win['mono-pionero'] = {
    onRequest: (func) => {
      listener = func
    }
  }
} else {
  // console.log('use window pionero!');
}

class DownloadManager {
  constructor({ parser, interval }) {
    this.items = {};
    this.setParser(parser);
    this.start(interval);
  }

  start(interval) {
    this.interval = Number(interval) || DEFAULT_INTER;
    if (document && document.body) {
      enableDrag('mono-dsg-btn');
      this.updateItems();
    } else {
      setTimeout(() => this.start(interval), interval);
    }
  }

  setParser(parser) {
    if (parser && typeof parser === 'function') this.parser = parser;
    if (!this.parser) this.parser = defaultParser;
  }

  async updateItems() {
    // 如果不是当前tab且不是自动下载的状态，就降频刷新
    if (!isActiveWindow()) { //  && !settings.useAuto
      return setTimeout(() => this.updateItems(), this.interval * 10);
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
    const key = 'mono-dsg-id';
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
    const meta = item.meta || {};
    meta.pageUrl = window.top?.location?.href || window?.location?.href;
    meta.pageTitle = window.top?.document?.title || document?.title;
    const name = meta.name || filename(meta.pageTitle);
    const headers = { referer: meta.pageUrl, ...(meta.headers || {}) };
    const opts = {
      url: item.url, name, headers, meta,
      onprogress: res => {
        let progress = 0;
        if (typeof res === 'object' && res.loaded > 0 && res.total > 0) {
          progress = Number(res.loaded / res.total);
        }
        if (!isNaN(progress) && progress > 0) item.progress = progress;
      },
      onerror: res => {
        // console.log('onerror', res);
        setTimeout(() => item.status = 'failed', 500);
      },
      onabort: () => {
        setTimeout(() => item.status = 'failed', 500);
      },
      onload: res => {
        // console.log('onload', res);
        item.status = 'done';
      }
    }

    // download handler
    if (meta.m3u8Data) {
      opts.data = meta.m3u8Data;
      opts.type = 'm3u8';
    } else if (meta.audio) {
      opts.data = meta.audio;
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
  filename,
  onRequest: win['mono-pionero'].onRequest,
  init: (options) => {
    if (!instance) instance = new DownloadManager(options || {});
    return instance;
  }
}