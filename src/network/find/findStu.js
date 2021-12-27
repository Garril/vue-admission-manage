import { request } from "../request";

export function findStu(sno,type) {
  return request({
    url: '/find/stu',
    method: 'get',
    params: {
      sno,type
    },
    timeout: 5000,
  })
}
