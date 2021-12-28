import { request } from "../request";

// 删除学生
export function deleteStuBySno(sno) {
  return request({
    url: '/delete/stu',
    method: 'delete',
    data: {
      sno
    },
    timeout: 5000,
  })
}


