import axios from 'axios';
import umbrella from 'umbrella-storage';
import globalConfig from '../config/global.config';

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

export interface ApiResult {
    status:number,
    isSuccess:boolean,
    data?:any
}

const request = ({
    url, data, params, method, config,
}:IFRequestConfig) => new Promise<ApiResult>((resolve, reject) => {
    // eslint-disable-next-line no-underscore-dangle
    let _option = {
        baseURL: globalConfig.baseUrl,
        timeout: 30000,
        method,
        url,
        params,
        data,
        headers: {
            'Content-Type': 'application/json',
        },
        ...config,
    };
    if (config) {
        _option = { ..._option, ...config };
    }

    axios.request<ApiResult>(_option).then((res) => {
        resolve(typeof res === 'object' ? res : JSON.parse(res));
    }, (error) => {
        reject(error);
    });
});

const post = ({
    url, data, params, config,
}:IFRequestParam) => request({
    method: 'post', url, data, params, config,
});

const doPost = (url:string, data?: {[x:string]:any}, params?:Map, config?: {[x:string]:any}) => request({
    method: 'post', url, data, params, config,
});

const get = ({ url, params, config }:IFRequestParam) => {
    // 将get 参数当中的数组转成字符串拼接
    // eslint-disable-next-line no-restricted-syntax
    for (const x in params) {
        if (Object.prototype.hasOwnProperty.call(params, x) && Array.isArray(params[x])) {
            params[x] = params[x].join(',');
        }
    }
    return request({
        method: 'get', url, params, config,
    });
};

const doGet = (url:string, params?:Map, config?: {[x:string]:any}) => {
    // 将get 参数当中的数组转成字符串拼接
    // eslint-disable-next-line no-restricted-syntax
    for (const x in params) {
        if (Object.prototype.hasOwnProperty.call(params, x) && Array.isArray(params[x])) {
            params[x] = params[x].join(',');
        }
    }
    return request({
        method: 'get', url, params, config,
    });
};

const del = ({ url, params, config }:IFRequestParam) => request({
    method: 'delete', url, params, config,
});

const doDel = (url:string, params?:Map, config?:{[x:string]:any}) => request({
    method: 'delete', url, params, config,
});

const doPut = (url:string, data?: {[x:string]:any}, params?:Map, config?: {[x:string]:any}) => request({
    method: 'put', url, data, params, config,
});

const put = ({
    url, data, params, config,
}: IFRequestParam) => request({
    method: 'put', url, data, params, config,
});

const responseErrorHandler = (error:any) => {
    if (error.response.status === 401) {
        const loginPath = window.location.href.replace(window.location.hash, '#/login');
        window.location.href = loginPath;
    }
};

/** 添加请求拦截器 * */
axios.interceptors.request.use((config) => {
    const token = umbrella.getLocalStorage('token');
    const orgSerial = umbrella.getLocalStorage('oserial');
    const projectSerial = umbrella.getLocalStorage('pserial');
    config.headers.oserial = orgSerial;
    config.headers.pserial = projectSerial;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

let isRefreshing = false;
let requests:any = [];

axios.interceptors.response.use((response) => {
    if (response.data.status === 402) {
        if (!isRefreshing) {
            isRefreshing = true;
            const refreshToken = umbrella.getLocalStorage('refreshToken');
            const token = umbrella.getLocalStorage('token');
            doPost('/user-token/public/refresh', { refreshToken, token }).then((result) => {
                umbrella.setLocalStorage('token', result.data.token);
                umbrella.setLocalStorage('refreshToken', result.data.refreshToken);
                response.headers.Authorization = `Bearer ${result.data.token}`;
                requests.forEach((cb:any) => cb(result.data.token));
                requests = [];
                return axios(response.config);
            }).catch((err) => {
                // 跳转到登录页
                umbrella.setLocalStorage('token', null);
                umbrella.setLocalStorage('refreshToken', null);
                const loginPath = window.location.href.replace(window.location.hash, '#/login');
                window.location.href = loginPath;
                return Promise.reject(err);
            }).finally(() => {
                isRefreshing = false;
            });
        } else {
            return new Promise((resolve) => {
                requests.push((token:any) => {
                    response.headers.Authorization = `Bearer ${token}`;
                    resolve(axios(response.config));
                });
            });
        }
    }

    if (response.data.status !== 0) {
        // TODO add message
    }
    const result = response.data;
    result.isSuccess = result.status === 0;
    return result;
}, responseErrorHandler);

export default {
    post,
    delete: del,
    put,
    get,
    doGet,
    doDel,
    doPut,
    doPost,
    request,
};
