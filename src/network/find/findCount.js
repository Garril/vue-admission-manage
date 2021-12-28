import { request } from '../request'

export function GetCountInfo(dep_id,degree,spe_id) {
  return request({
    url: '/find/countByDepSpe',
    method: 'get',
    params: {
      dep_id,degree,spe_id
    },
    timeout: 5000,
  })
}