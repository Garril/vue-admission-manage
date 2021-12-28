import { request } from "../request";

// 修改学号
export function reviseStuBySno(sno,id) {
  return request({
    url: '/revise/sno',
    method: 'put',
    data: {
      sno,id
    },
    timeout: 5000,
  })
}
// 修改班级代号
export function reviseClassById(class_name,id) {
  return request({
    url: '/revise/class',
    method: 'put',
    data: {
      class_name,id
    },
    timeout: 5000,
  })
}

