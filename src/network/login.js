import { request } from "./request";

export function postLogin(message) {
  return request({
    url: '/login',
    method: 'post',
    data: message,
    timeout: 5000,
  })
}

// import {request} from "./request";

// export function getHomeMultidata() {
//   return request({
//     url:'/home',
//     methods: 'get',
// params: {
//   type,
//   page
// }
//   })
// }

// export function testPost(body,token) {
//   return request({
//     url:'/test',
//     method:'post',
//     data:body,
//     timeout:1000,
//   })
// }