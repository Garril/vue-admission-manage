import { request } from "../request";

// 3.3.1 拿到所有的专业和对应的学院id和名字 ---联级选择
export function findDepSpe() {
  return request({
    url: '/find/allSpe',
    method: 'get',
    timeout: 5000,
  })
}