import { request } from "../request";

export function importSingleClass(message) {
  return request({
    url: '/import/class',
    method: 'post',
    data: message,
    timeout: 5000,
  })
}

export function importMultiClass(message) {
  return request({
    url: '/import/addClass',
    method: 'post',
    data: message,
    timeout: 10000,
  })
}