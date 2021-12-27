import axios from "axios";

export function request(config) {
  // axios实例
  const instance = axios.create({
    // baseURL: 'localhost:8080',
    baseURL:"/api",
    timeout:5000,
  })
  // 拦截器
  // 发送请求前,请求拦截
  instance.interceptors.request.use(config => {
    return config;
  },err => {
    console.log(err);
  })
  // 响应数据后，响应拦截
  instance.interceptors.response.use(res => {
    return res
  },err => {
    console.log(err);
  })
  // 发送真正的网络请求
  return instance(config);
}

