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

export function finAllStu() {
  return request({
    url: '/find/allStu',
    method: 'get',
    timeout: 5000,
  })
}

export function findClassAllStu(degree,dep_id,spe_id,class_no) {
  return request({
    url: '/find/classAllStu',
    method: 'get',
    params: {
      degree,dep_id,spe_id,class_no
    },
    timeout: 5000,
  })
}