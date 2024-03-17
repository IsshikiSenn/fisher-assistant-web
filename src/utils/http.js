// axios基础封装
import axios from 'axios'

// 后端接口地址
const serverInstance = axios.create({
    baseURL: 'http://106.14.72.81:6615',
    timeout: 5000,
})

// axios请求拦截器
serverInstance.interceptors.request.use(config => {
    return config
}, e => Promise.reject(e))

// axios响应拦截器
serverInstance.interceptors.response.use(res => {
    console.log(res.data);
    return res.data
}, e => Promise.reject(e))

const ossInstance = axios.create({
    baseURL: 'http://106.14.72.81:81',
    timeout: 5000
})

// axios请求拦截器
ossInstance.interceptors.request.use(config => {
    return config
}, e => Promise.reject(e))

// axios响应拦截器
ossInstance.interceptors.response.use(res => res.data, e => Promise.reject(e))

export { serverInstance, ossInstance }