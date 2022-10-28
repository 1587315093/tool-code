# 微信小程序 API 封装

```ts
import { uploadFile } from "./uploadFile";
// 网络图片转本地 - 返回一个Promise
export function networkImgToLocalImg(url) {
  return new Promise((resolve, reject) => {
    wx.getImageInfo({
      src: url,
      success(res) {
        resolve(res.path);
      },
      fail(err) {
        reject(err + url);
      },
    });
  });
}

// 像素适配 - 闭包缓存 windowWidth
export function createRpx2px() {
  const { windowWidth } = wx.getSystemInfoSync();
  return function (rpx) {
    return (windowWidth / 750) * rpx;
  };
}
// canvas转图片 传canvasId - 返回一个Promise
export function canvasToImg(canvasId) {
  return new Promise((resolve, reject) => {
    wx.canvasToTempFilePath({
      canvasId,
      success: (res) => {
        resolve(res.tempFilePath);
      },
      fail: (err) => {
        reject(err);
      },
    });
  });
}
// canvas 2d转图片  传canvas实例 - 返回一个Promise
export function canvas2dToImg(canvas) {
  return new Promise((resolve, reject) => {
    wx.canvasToTempFilePath({
      canvas,
      success: (res) => {
        resolve(res.tempFilePath);
      },
      fail: (err) => {
        reject(err);
      },
    });
  });
}
// 保存图片 - 返回Promise
export function saveImage(url) {
  return new Promise((resolve, reject) => {
    wx.saveImageToPhotosAlbum({
      filePath: url,
      success(res) {
        resolve(res);
      },
      fail(err) {
        reject(err);
      },
    });
  });
}
// 上传单个图片 - 返回Promise
export function uploadSingleImage() {
  return new Promise((reslove, reject) => {
    wx.chooseMedia({
      count: 1,
      mediaType: ["image"],
      sourceType: ["album", "camera"],
      camera: "back",
      success(res) {
        uploadFile(res.tempFiles[0].tempFilePath)
          .then((res) => {
            reslove(res.result);
          })
          .catch(({ errMsg }) => reject("微信chooseMedia调用失败，" + errMsg));
      },
      fail(error) {
        reject("微信chooseMedia调用失败，" + error);
      },
    });
  });
}

// 获取经纬度 - 返回Promise
export function getLocation() {
  return new Promise((reslove, reject) => {
    wx.getLocation({
      type: "wgs84",
      success: (res) => {
        reslove(res);
      },
      fail(err) {
        reslove(err);
      },
    });
  });
}
```
