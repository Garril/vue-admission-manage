import { request } from "../request";

export function importSingleStu(message) {
  return request({
    url: '/import/stu',
    method: 'post',
    data: message,
    timeout: 5000,
  })
}

export function importMultiStu(message) {
  return request({
    url: '/import/addStudent',
    method: 'post',
    data: message,
    timeout: 30000,
  })
}

export function importStuAvatar(message) {
  return request({
    url: '/import/avatar',
    method: 'post',
    data: message,
    timeout: 5000,
  })
}