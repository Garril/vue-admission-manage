import { request } from "./request";

export function postLogin(message) {
  return request({
    url: '/login',
    method: 'post',
    data: message,
    timeout: 5000,
  })
}
