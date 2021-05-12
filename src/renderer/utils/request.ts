import axios from "axios";
import globalConfig from '../config/global.config'


type METHODS = 'get' | 'post' | 'put' | 'delete';

interface IFRequestParam {
    url: string;
    params?:object;
    data?: object;
    config?: object;
}

interface IFRequestConfig extends IFRequestParam{
    method?:METHODS;

}


/** 添加请求拦截器 **/
axios.interceptors.request.use(config => {
    config.headers['token'] = sessionStorage.getItem('token') || ''

    // if (config.url.includes('pur/contract/export')) {
    //     config.headers['responseType'] = 'blob'
    // }
    // // 我这里是文件上传，发送的是二进制流，所以需要设置请求头的'Content-Type'
    // if (config.url.includes('pur/contract/upload')) {
    //     config.headers['Content-Type'] = 'multipart/form-data'
    // }
    return config
}, error => {
    // 对请求错误做些什么
    return Promise.reject(error)
})

const post = ({url, data, params, config}:IFRequestParam)=>{
    return  request({method:'post', url, data, params, config})
}

const get = ({url, params, config}:IFRequestParam) => {
    return request({method:'get', url, params, config})
}

const del = ({url, params, config}:IFRequestParam)=>{
    return request({method:'delete', url, params,config})
}

const put = ({url, data, params, config}: IFRequestParam) => {
    return request({method: 'put', url, data, params, config})
}


const request = ({url, data, params, method,config}:IFRequestConfig)=>{
    return new Promise((resolve, reject) => {
        let _option = {
            baseURL: globalConfig.baseUrl,
            timeout: 30000,
            method,
            url,
            params,
            data,
            headers: {
                'Content-Type': 'application/json'
            },
            ...config
        }
        if(config){
            _option = {..._option, ...config}
        }
        console.log("here is ", _option.baseURL)
        axios.request(_option).then(res => {
            resolve(typeof res.data === 'object' ? res.data : JSON.parse(res.data))
        },error => {
            reject(error)
        })
    })
}


export default {
    post,
    delete:del,
    put,
    get,
    request
};
