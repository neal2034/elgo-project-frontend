import axios from "axios";
import globalConfig from "../config/global.config"
import umbrella from 'umbrella-storage';

interface Map {
    [key: string]: any;
    [index: number]: any;
}

type METHODS = 'get' | 'post' | 'put' | 'delete';

interface IFRequestParam {
    url: string;
    params?:Map;
    data?: {[x:string]:any};
    config?: {[x:string]:any};
}

interface IFRequestConfig extends IFRequestParam{
    method?:METHODS;

}


const responseErrorHandler = (error:any)=>{

    if(error.response.status === 401){
        const loginPath = window.location.href.replace(window.location.hash, "#/login")
        window.location.href = loginPath
    }
}


/** 添加请求拦截器 **/
axios.interceptors.request.use(config => {
    const token = umbrella.getLocalStorage('token')
    const orgSerial = umbrella.getLocalStorage('oserial')
    const projectSerial = umbrella.getLocalStorage('pserial')
    config.headers['oserial'] = orgSerial;
    config.headers['pserial'] = projectSerial;
    if(token){
        config.headers[ 'Authorization' ] = "Bearer " + token;
    }
    return config
}, error => {

    // 对请求错误做些什么
    return Promise.reject(error)
})


axios.interceptors.response.use(response =>{
    if(response.data.status !== 0 ){
        //TODO add message
        console.log("error is ", response.data.message)
    }
    const result = response.data

    result.isSuccess = result.status === 0
    return result;
}, responseErrorHandler)


export interface ApiResult {
    status:number,
    isSuccess:boolean,
    data?:any
}

const post =   ({url, data, params, config}:IFRequestParam)=>{
    return    request({method:'post', url, data, params, config})
}

const doPost = (url:string,  data?: {[x:string]:any}, params?:Map, config?: {[x:string]:any}) => {
    return    request({method:'post', url, data, params, config})
}


const get = ({url, params, config}:IFRequestParam) => {
    //将get 参数当中的数组转成字符串拼接
    for(const x in params){
        if(Object.prototype.hasOwnProperty.call(params,x)&& Array.isArray(params[x])){
            params[x] = params[x].join(',')
        }
    }
    return request({method:'get', url, params, config})
}


const doGet = (url:string, params?:Map, config?: {[x:string]:any}) =>{
    //将get 参数当中的数组转成字符串拼接
    for(const x in params){
        if(Object.prototype.hasOwnProperty.call(params,x)&& Array.isArray(params[x])){
            params[x] = params[x].join(',')
        }
    }
    return request({method:'get', url, params, config})
}

const del = ({url, params, config}:IFRequestParam)=>{
    return request({method:'delete', url, params,config})
}

const doDel = (url:string, params?:Map, config?:{[x:string]:any})=>{
    return request({method:'delete', url, params,config})
}

const doPut = (url:string,  data?: {[x:string]:any}, params?:Map, config?: {[x:string]:any}) => {
    return request({method: 'put', url, data, params, config})
}

const put = ({url, data, params, config}: IFRequestParam) => {
    return request({method: 'put', url, data, params, config})
}



const request = ({url, data, params, method,config}:IFRequestConfig)=>{
    return new Promise<ApiResult>((resolve, reject)=> {
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

        axios.request<ApiResult>(_option).then(res => {
            resolve(typeof res === 'object' ? res : JSON.parse(res))
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
    doGet,
    doDel,
    doPut,
    doPost,
    request,
};
