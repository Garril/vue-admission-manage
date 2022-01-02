import { request } from "../request";

// 3.2.2 按学院查询分班
export function findClassByDep(dep_id,degree) {
  return request({
    url: '/find/classByDep',
    method: 'get',
    params: {
      dep_id,degree
    },
    timeout: 5000,
  })
}

// 3.3.2 根据学院号和年级还有专业号找到班级
export function findClassBySpe(dep_id,degree,spe_id) {
  return request({
    url: '/find/classBySpe',
    method: 'get',
    params: {
      dep_id,degree,spe_id
    },
    timeout: 5000,
  })
}

// 3.4 根据学号找到班级
export function findClassBySno(sno) {
  return request({
    url: '/find/classBySno',
    method: 'get',
    params: {
      sno
    },
    timeout: 5000,
  })
}
