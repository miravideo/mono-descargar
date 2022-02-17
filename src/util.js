
export const isActiveWindow = () => {
  return !document.hidden;
}

export const isTopWindow = () => {
  return window.location.href === unsafeWindow.top.location.href;
}

export const filename = (title, ext='mp4') => {
  var name = title.replace(' ', '').replace(/[/\\?%*:|"<>]/g, '-');
  return `${name}.${ext}`;
}

const URL = window.URL || window.webkitURL;
export const flaged = (key) => {
  return hasUrlFlag(key) || GM_getValue(key) || false;
}

export const hasUrlFlag = (flag) => {
  const url = new URL(window.location.href);
  return url.hash.indexOf(`#${flag}`) > -1;
}

export const getFlags = (prefix) => {
  const url = new URL(window.location.href);
  return url.href.split('#').slice(1).filter((flag) => {
    return !prefix || flag.startsWith(prefix)
  })
}

export const toDict = (arr, k, vk) => {
  return Object.assign({}, ...arr.map((x) => ({[x[k]]: vk ? x[vk] : x})));
}

export const getCurrentTime = () => {
  // 改名getTimesMs
  return (new Date()).valueOf()
}

export const mapEntry = (src, func) => {
  return Object.entries(src).reduce((res, entry, i, allEntries) => {
    res[entry[0]] = func(entry, i, allEntries);
    return res;
  }, {});
}

export const deepCopy = (src) => {
  return src && (
    Array.isArray(src) && src.map(deepCopy)
    // Used in safe context
    // eslint-disable-next-line no-restricted-syntax
    || typeof src === 'object' && mapEntry(src, ([, val]) => deepCopy(val))
  ) || src;
}

export const isString = (str) => {
  return typeof str === "string";
}

export const isArray = (arr) => {
  return Array.isArray(arr);
}

const countFunc = function(a, x) {
  const i = isArray(x) ? count(x) : 1;
  return a + i;
}

const sumFunc = function(a, x) {
  let i = x;
  if (isString(i)) i = Number(i);
  else if (isArray(i)) i = sum(i);
  return a + i;
}

export const mean = (list) => {
  return list.reduce(sumFunc)/list.length;
}

export const count = (list) => {
  return list.reduce(countFunc, 0);
}

export const sum = (list) => {
  return list.reduce(sumFunc, 0);
}

