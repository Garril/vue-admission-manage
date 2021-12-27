import { request } from "../request";

export function findDepSpe() {
  return request({
    url: '/find/allSpe',
    method: 'get',
    timeout: 5000,
  })
}
