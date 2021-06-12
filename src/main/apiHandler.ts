import {ipcMain} from 'electron';
import axios from "axios";
import globalConfig from "@config/global.config";


ipcMain.handle('api-call', async(event,method, {url, data, params, config})=>{
    let result =  await request({method, url, data, params, config})
    return  result.data
})




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

interface ApiResult {
    status:number,
    isSuccess:boolean,
    data?:any
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
