//进行 axios  封装
import axios from "axios"


export function axiospost(config) {
  const instance = axios.create({
    //baseURL: 'http://172.16.138.65:1111/',
    baseURL: 'http://192.168.0.166:8000/',

    method: 'post',
    timeout: 50000
  });
  return instance(config)

}


