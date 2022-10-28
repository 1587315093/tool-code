# axios 的二次封装

> 添加了 react loading

```ts
import axios, { AxiosResponse } from "axios";
import qs from "qs";
import { message, Spin } from "antd";
import { getCookie } from "@/utils/cookie";
import ReactDOM from "react-dom/client";

const service: any = axios.create({
  baseURL: "", // api 的 base_url
  timeout: 1000 * 600, // 请求超时时间
});

function showLoading() {
  const loading: HTMLElement = document.createElement("div");
  const connect: HTMLElement = document.querySelector(
    ".ant-layout-content"
  ) as HTMLElement;
  loading.setAttribute("id", "loading");
  connect.appendChild(loading);
  ReactDOM.createRoot(loading).render(<Spin size="large" />);
}

function hideLoading() {
  const loading: HTMLElement = document.getElementById(
    "loading"
  ) as HTMLElement;
  const connect: HTMLElement = document.querySelector(
    ".ant-layout-content"
  ) as HTMLElement;
  connect.removeChild(loading as Node);
}

// request拦截器
service.interceptors.request.use(
  (config: any) => {
    showLoading();
    if (getCookie("token")) {
      config.headers["token"] = getCookie("token"); // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return config;
  },
  (error: any) => {
    Promise.reject(error);
  }
);

// response 拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    hideLoading();
    const res: any = response.data;
    if (res.ok) {
      return Promise.resolve(res);
    } else {
      message.error(res?.result?.errorMsg, 3);
      return res;
    }
  },
  (error: any) => {
    hideLoading();
    // 根据业务逻辑做 catch
    return Promise.reject(error);
  }
);
export default service;
```

使用：

```ts
import request from "./request";

export const httpGetList = (params: any): Promise<any> =>
  request({
    url: `/****`,
    method: "GET",
    params,
  });
export const httpPost = (data: any): Promise<any> =>
  request({
    url: `/****`,
    method: "POST",
    data,
  });
```
