//网络请求放置在这里
import { axiospost } from "./request"






//用户验证接口
export function loginAxios(config) {
  return axiospost({
    url: "/cmslogs/user",
    data: config

  })
}


//查询页面获取当前用户的所有数据
export function cmslogsAxios(config) {
  return axiospost({
    url: "/cmslogs",
    data: config

  })
}

//按条件查询数据
export function querycmslogsAxios(config) {
  return axiospost({
    url: "cmslogs/query",
    data: config

  })
}



//添加日志
export function addcmslogAxios(config) {
  return axiospost({
    url: "/cmslogs/add",
    data: config

  })
}

//修改日志前根据id获取待修改的记录
export function getOnecmslogAxios(config) {
  return axiospost({
    url: "/cmslogs/getonecmslog",
    data: config

  })
}

//添加日志
export function updatecmslogAxios(config) {
  return axiospost({
    url: "/cmslogs/update",
    data: config

  })
}


//添加一条日志
export function deletecmslogAxios(config) {
  return axiospost({
    url: "/cmslog/delete",
    data: config

  })
}

//添加一条日志
export function deletecmslogsAxios(config) {
  return axiospost({
    url: "/cmslogs/delete",
    data: config

  })
}



//用户修改密码
export function modpsAxios(config) {
  return axiospost({
    url: "/cmslogs/modpwuser",
    data: config
  })
}

//导出日志excel
export function exportAxios(config) {
  return axiospost({
    url: "cmslogs/export",
    data: config
  })
}

//近7天日志量到个人统计
export function info1Axios(config) {
  return axiospost({
    url: "cmslogs/info_a",
    data: config
  })
}


//近7天日志量统计
export function info3Axios(config) {
  return axiospost({
    url: "cmslogs/info_c",
    data: config
  })
}


//近7天来源系统 日志情况
export function info2Axios(config) {
  return axiospost({
    url: "cmslogs/info_b",
    data: config
  })
}

//所有日志公司分布情况
export function info4Axios(config) {
  return axiospost({
    url: "cmslogs/info_d",
    data: config
  })
}



// 需求 人为原因 系统原因 占比
export function info5Axios(config) {
  return axiospost({
    url: "cmslogs/info_e",
    data: config
  })
}







