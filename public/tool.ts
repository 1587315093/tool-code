interface Scroll {
  top: number;
  left: number;
}
/* 对象转化为formdata */
export function getFormData(fromvalue: any): any {
  const formData = new FormData();
  Object.keys(fromvalue).forEach((key) => {
    const value = fromvalue[key];
    if (Array.isArray(value)) {
      value.forEach((subValue, i) => {
        formData.append(key + `[${i}]`, subValue);
      });
    } else {
      formData.append(key, fromvalue[key]);
    }
  });
  return formData;
}

/* 对象转成urlencode */
export function getParams(url: any): string {
  return Object.keys(url)
    .map((k) => {
      return encodeURIComponent(k) + "=" + encodeURIComponent(url[k]);
    })
    .join("&");
}

/* url编码转成json格式 */
export function getObjUrl(str: string): object {
  return Object.fromEntries(new URLSearchParams(str));
}

/* 下载一个链接 */
export function download(link: string, name?: string) {
  if (!name) {
    name = link.slice(link.lastIndexOf("/") + 1);
  }
  let eleLink = document.createElement("a");
  eleLink.download = name;
  eleLink.style.display = "none";
  eleLink.href = link;
  document.body.appendChild(eleLink);
  eleLink.click();
  document.body.removeChild(eleLink);
}

/* 下载一个文件 */
export function downloadFile(name: string, content: any) {
  if (typeof name === "undefined") {
    throw Error("缺少文件名");
  }
  if (typeof content === "undefined") {
    throw Error("缺少文件内容");
  }
  if (!(content instanceof Blob)) {
    content = new Blob([content]);
  }
  const link = URL.createObjectURL(content);
  download(link, name);
}

/* 随机产生一个min到max之间的随机整数 */
export function rand(min: number, max: number): number {
  return parseInt(String(Math.random() * (max - min + 1))) + min;
}

/* 生成随机颜色 */
export function getColor(): string {
  let color: string = "#";
  for (let i = 0; i < 6; i++) {
    color += rand(0, 15).toString(16);
  }
  return color;
}

/* ID获取DOM元素 */
export function $Id(id: string) {
  return document.getElementById(id);
}

/* 获取页面滚动距离 */
export function getScroll(): Scroll {
  if (window.pageYOffset) {
    return {
      top: window.pageYOffset,
      left: window.pageXOffset,
    };
  } else if (document.documentElement.scrollTop) {
    return {
      top: document.documentElement.scrollTop,
      left: document.documentElement.scrollLeft,
    };
  } else {
    return {
      top: document.body.scrollTop,
      left: document.body.scrollLeft,
    };
  }
}

/* 获取元素样式 */
export function getStyle(dom: any, attr: any): string {
  if (window.getComputedStyle) {
    return window.getComputedStyle(dom, null)[attr];
  } else {
    return dom.currentStyle[attr];
  }
}

/* 随机产生一个包含n个字母或数字的字符串 */
export function randChar(n: number): string {
  let str: string = "";
  for (let i = 0; i < n; i++) {
    let code = rand(48, 122);
    if ((code > 57 && code < 65) || (code > 90 && code < 97)) {
      i--;
    } else {
      let char = String.fromCharCode(code);
      str += char;
    }
  }
  return str;
}

/* 去除字符串所有空格 */
export function trimAll(str: String): String {
  const newStr: String = str.split(" ").join("");
  return newStr;
}

/* BASE64转换Blob */
export function dataURLtopBlob(
  base64: string,
  minmeType: string = "image/png"
): Blob {
  let bytes = window.atob(base64.split(",")[1]);
  let ab = new ArrayBuffer(bytes.length);
  let ia = new Uint8Array(ab);
  for (let i = 0; i < bytes.length; i++) {
    ia[i] = bytes.charCodeAt(i);
  }
  return new Blob([ab], { type: minmeType });
}

interface T {}
/* 网络图片转为Blob */
export function getBlob(url: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "blob";
    xhr.onload = () => {
      if (xhr.status == 200) {
        resolve(xhr.response);
      } else {
        reject();
      }
    };
    xhr.send();
  });
}

/* Base64获取MIME */
export function getBase64Type(base: string): string {
  const index0: number = base.indexOf(":");
  const index1: number = base.indexOf(";");
  let mime: string = "";
  if (index0 !== -1 && index1 !== -1) {
    mime = base.slice(index0 + 1, index1);
  }
  return mime;
}

/* 图标Src下载图片 */
export async function downImg(url: string, fileNmae: string = "down") {
  try {
    let blob: any = null;
    if (url.startsWith("http")) {
      blob = await getBlob(url);
    } else if (url.startsWith("data:image")) {
      let mime = getBase64Type(url);
      blob = mime ? dataURLtopBlob(url, mime) : dataURLtopBlob(url);
    } else if (url.startsWith("/")) {
      blob = await getBlob(window.origin + url);
    } else {
      return;
    }
    let domA = document.createElement("a");
    domA.download = fileNmae;
    domA.href = window.URL.createObjectURL(blob);
    document.body.appendChild(domA);
    domA.click();
    document.body.removeChild(domA);
  } catch (error) {
    console.log(error);
  }
}

/* 字符长度过滤器 */
export function filterStrLenght(val: string, lenght: number): string {
  if (val.length > lenght) {
    return val.substr(0, lenght) + "...";
  }
  return val;
}

/* 操作cookie */
// 设置
export function setCookie(name: string, value: any, time: number) {
  let exp: any = new Date();
  exp.setTime(time);
  document.cookie =
    name + "=" + escape(value) + ";expires=" + exp.toGMTString() + ";path=/";
}
// 获取
export function getCookie(name: string) {
  let arrStr = document.cookie.split("; ");
  for (let i = 0; i < arrStr.length; i++) {
    let temp = arrStr[i].split("=");
    if (temp[0] === name) {
      return unescape(temp[1]);
    }
  }
}
// 删除
export function delCookie(name: string) {
  let exp: any = new Date();
  exp.setTime(exp.getTime() - 100);
  let cval = getCookie(name);
  if (cval === null)
    document.cookie =
      name + "=" + cval + ";expires=" + exp.toGMTString() + ";path=/";
}

/* 一键复制 */
export function copyText(dom: any) {
  let copyDom: Element = document.getElementsByClassName(dom)[0];
  let range = document.createRange();
  window.getSelection()!.removeAllRanges();
  range.selectNode(copyDom);
  window.getSelection()!.addRange(range);
  let successful = document.execCommand("copy");
  if (successful) {
    alert("复制成功");
  } else {
    alert("复制失败");
  }
}
export const timeDifference = (timeStart: any, timeEnd: any) => {
  let str = "";
  let timeStarts = timeStart.getTime(); //开始时间,转换成时间戳
  let timeEnds = timeEnd.getTime(); //结束时间,转换成时间戳
  let timer: number = timeEnds - timeStarts; //将时间戳进行相减

  let day = parseInt((timer / 1000 / 60 / 60 / 24).toString()); //日
  let hours = parseInt(((timer / 1000 / 60 / 60) % 24).toString()); //时
  let minutes = parseInt(((timer / 1000 / 60) % 60).toString()); //分
  let seconds = parseInt(((timer / 1000) % 60).toString()); //秒

  if (day > 0) {
    str = str + day + "天";
  }
  if (hours) {
    str = str + (hours < 10 ? "0" + hours : hours) + "小时";
  }
  str =
    str +
    (minutes < 10 ? "0" + minutes : minutes) +
    "分" +
    (seconds < 10 ? "0" + seconds : seconds) +
    "秒";
  return str;
};
export const formatTime = (timer: number) => {
  let str = "";
  let day = parseInt((timer / 1000 / 60 / 60 / 24).toString()); //日
  let hours = parseInt(((timer / 1000 / 60 / 60) % 24).toString()); //时
  let minutes = parseInt(((timer / 1000 / 60) % 60).toString()); //分
  let seconds = parseInt(((timer / 1000) % 60).toString()); //秒
  if (day > 0) {
    str = str + day + "天";
  }
  if (hours) {
    str = str + (hours < 10 ? "0" + hours : hours) + "小时";
  }
  str =
    str +
    (minutes < 10 ? "0" + minutes : minutes) +
    "分" +
    (seconds < 10 ? "0" + seconds : seconds) +
    "秒";
  return str;
};

function isJson(obj: any) {
  var isjson =
    typeof obj === "object" &&
    Object.prototype.toString.call(obj).toLowerCase() === "[object object]" &&
    !obj.length;
  return isjson;
}

// 判断数据类型 返回布尔值
export const isBoolan = (val) =>
  Object.prototype.toString.call(val) === "[object Boolean]";

export const isArray = (val) =>
  Object.prototype.toString.call(val) === "[object Array]";

export const isObject = (val) =>
  Object.prototype.toString.call(val) === "[object Object]";

export const isString = (val) =>
  Object.prototype.toString.call(val) === "[object String]";
