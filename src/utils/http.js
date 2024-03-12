// axios基础封装
import axios from 'axios'

const httpInstance = axios.create({
    baseURL: 'http://106.14.72.81:80',
    timeout: 5000
})

// axios请求拦截器
httpInstance.interceptors.request.use(config => {
    return config
}, e => Promise.reject(e))

// axios响应拦截器
httpInstance.interceptors.response.use(res => res.data, e => Promise.reject(e))

export default httpInstance