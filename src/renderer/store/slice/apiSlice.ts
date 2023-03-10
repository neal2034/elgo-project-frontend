import { createSlice } from '@reduxjs/toolkit';
import { Dispatch } from 'react';
import request from '../../utils/request';
import apiUrl from '../../config/apiUrl';

type ApiMethod = 'GET'|'POST'|'DELETE'|'PUT'
type BodyType = 'NONE' | 'JSON'
type AuthType = 'NONE' | 'INHERIT' | 'BEARER'

export interface ApiEnvItem{
    name:string,
    value:string,
    used:boolean
}

export interface ApiEnv{
    id:number,
    name:string,
    envItems?:ApiEnvItem[]
}

export interface ApiParams{
    paramKey?:string,
    paramValue?:string,
    description?:string,
    selected?:boolean,
    key:number,
}

export interface ApiPathVar{
    varKey?:string,
    varValue?:string,
    description?:string,
    key:number,
}

export interface ApiHeaderItem{
    headerKey?:string,
    headerValue?:string,
    description?:string,
    selected?:boolean,
    key:number,
}

export interface API{
    id?:number,
    name:string,
    serial:number,
    isExample?:boolean, // 是否为用例
    method:ApiMethod, // GET/POST/DELETE/PUT
    params:ApiParams[],
    pathVars?:ApiPathVar[],
    headers:ApiHeaderItem[],
    dirty:boolean,
    url?:string,
    authType?:AuthType,
    authToken?:string,
    bodyType?:BodyType,
    bodyJson?:string,
    testsCode?:string,
    responseBody?:string,
    treeItemId?:number,
    exampleName?:string,
    description?:string,
    examples?:[]
}

interface IPayloadAddApiSet {
    name:string,
    description?:string,
    authToken?:string,
    authType:'NONE'|'INHERIT'|'BEARER',
}

interface IPayloadEditApiSet extends IPayloadAddApiSet{
    id:number
}

interface IPayloadAddApiGroup {
    name:string,
    description?:string,
    authToken?:string,
    authType:'NONE'|'INHERIT'|'BEARER',
    parentId:number,
}

interface IPayloadEditApiGroup{
    name:string,
    description?:string,
    authToken?:string,
    authType:'NONE'|'INHERIT'|'BEARER',
    id:number
}

interface IPayloadAddApiTreeItem {
    name:string,
    description?:string,
    parentId:number
}

interface IPayloadEditApiTreeItem {
    name:string,
    id:number,
    description?:string
}

interface IPayloadDelApiItem{
    id:number
}

interface IPayloadDelApiTreeItem{
    treeItemId:number
}

interface IApiEnv{
    name?:string,
    value?:string,
    used?:boolean
}

const theActiveApis: Array<API> = [];
// 获取可用的api 序列号
const getUsableSerial = (activeApis:API[]) => {
    let serial = new Date().getTime();
    let isSerialExist = activeApis.filter((api) => api.serial === serial).length !== 0;
    while (isSerialExist) {
        serial = new Date().getTime();
        // eslint-disable-next-line no-loop-func
        isSerialExist = activeApis.filter((api) => api.serial === serial).length !== 0;
    }
    return serial;
};

const apiSlice = createSlice({
    name: 'api',
    initialState: {
        activeApis: theActiveApis,
        currentApiSerial: -1,
        apiTreeItems: [],
        envs: [], // 环境变量
        currentEnvId: -1, // 当前环境变量id
        showDescription: false, // 是否显示api 描述

    },
    reducers: {
        setShowDescription: (state, action) => {
            state.showDescription = action.payload;
        },
        addActiveApi: (state) => {
            const serial = getUsableSerial(state.activeApis);
            const newApi = {
                name: '未命名接口',
                serial,
                method: 'GET' as ApiMethod,
                isExample: false,
                dirty: false,
                headers: [{ key: 10 }],
                params: [{ key: 0 }],
            };
            state.activeApis.push(newApi);
            state.currentApiSerial = serial;
        },
        pushActiveApi: (state, action) => {
            state.currentApiSerial = action.payload.serial;
            state.activeApis.push(action.payload);
        },
        // 设置当前激活的API
        setCurrentApiSerial: (state, action) => {
            state.currentApiSerial = action.payload;
        },
        updateCurrentApi: (state, action) => {
            state.activeApis.forEach((item) => {
                if (item.serial === state.currentApiSerial) {
                    Object.assign(item, action.payload, { dirty: true });
                }
            });
        },
        updateApiQuite: (state, action) => {
            state.activeApis.forEach((item) => {
                if (item.serial === state.currentApiSerial) {
                    Object.assign(item, action.payload);
                }
            });
        },
        setApiTreeItems: (state, action) => {
            state.apiTreeItems = action.payload;
        },
        removeActiveApi: (state, action) => {
            const serial = action.payload;
            let removeIndex = -1;
            state.activeApis.forEach((item, index) => {
                if (item.serial === serial) {
                    removeIndex = index;
                }
            });
            state.activeApis.splice(removeIndex, 1);
            // 如果没有可激活的api，则设置当前激活序列号为null
            let activeSerial = state.currentApiSerial;

            if (state.activeApis.length === 0) {
                // 如果工作区API数组为空，则没有可激活API
                activeSerial = -1;
            } else if (serial === activeSerial) {
                if (removeIndex === 0) {
                    // 如果当前删除的API为第一个， 则设置第二个
                    activeSerial = state.activeApis[0].serial;
                } else {
                    activeSerial = state.activeApis[removeIndex - 1].serial;
                }
            }
            state.currentApiSerial = activeSerial;
        },
        setCurrentApiSaved: (state) => {
            state.activeApis.forEach((item) => {
                if (item.serial === state.currentApiSerial) {
                    Object.assign(item, { dirty: false });
                }
            });
        },

        setCurrentApiName: (state, action) => {
            state.activeApis.forEach((item) => {
                if (item.serial === state.currentApiSerial) {
                    Object.assign(item, { name: action.payload });
                }
            });
        },
        setCurrentApiExample: (state, action) => {
            state.activeApis.forEach((item) => {
                if (item.serial === state.currentApiSerial) {
                    Object.assign(item, { examples: action.payload });
                }
            });
        },
        setCurrentApiDes: (state, action) => {
            state.activeApis.forEach((item) => {
                if (item.serial === state.currentApiSerial) {
                    Object.assign(item, { description: action.payload });
                }
            });
        },

        addApiExample: (state) => {
            const serial = getUsableSerial(state.activeApis);
            const currentApi = state.activeApis.filter((item) => item.serial === state.currentApiSerial)[0];
            const {
                url, name, method, params, headers, bodyType, bodyJson, responseBody,
            } = currentApi;
            const examplePart = {
                url, name, method, params, headers, bodyType, bodyJson, responseBody, apiId: currentApi.id, exampleName: currentApi.name, dirty: true,
            };
            const apiExample = { serial, isExample: true, ...examplePart };
            state.activeApis.push(apiExample);
            state.currentApiSerial = serial;
        },

        editApiExample: (state, action) => {
            const serial = getUsableSerial(state.activeApis);
            const example = action.payload;
            const {
                url, id, name, method, bodyType, response,
            } = example;
            const currentApi = state.activeApis.filter((item) => item.serial === state.currentApiSerial)[0];
            const apiExample = {
                url,
                id,
                name,
                method,
                bodyType,
                response,
                serial,
                isExample: true,
                apiId: currentApi.id,
                params: example.params ? JSON.parse(example.params) : [],
                headers: example.headers ? JSON.parse(example.headers) : [],
                bodyJson: example.bodyJson ? example.bodyJson : null,
                responseBody: example.response ? JSON.parse(example.response) : null,
                exampleName: example.name,
                dirty: false,
            };
            state.activeApis.push(apiExample);
            state.currentApiSerial = serial;
        },

        delApiExample: (state, action) => {
            state.activeApis.forEach((item:any) => {
                if (item.serial === state.currentApiSerial) {
                    const id = action.payload;
                    const index = item.examples.findIndex((expItem:any) => expItem.id === id);
                    item.examples.splice(index, 1);
                }
            });
        },

        setEnvs: (state, action) => {
            state.envs = action.payload;
        },
        setCurrentEnv: (state, action) => {
            state.currentEnvId = action.payload;
        },
    },
});
const apiActions = apiSlice.actions;

const listApiTreeItems = () => async (dispatch:Dispatch<any>) => {
    const result = await request.get({ url: apiUrl.api.treeItemRes });
    if (result.isSuccess) {
        dispatch(apiActions.setApiTreeItems(result.data));
    }
    return result.isSuccess;
};

const addApiSet = (data:IPayloadAddApiSet) => async (dispatch:Dispatch<any>) => {
    const result = await request.post({ url: apiUrl.api.setRes, data });
    if (result.isSuccess) {
        dispatch(listApiTreeItems());
    }
};

const editApiSet = (data:IPayloadEditApiSet) => async (dispatch:Dispatch<any>) => {
    const result = await request.put({ url: apiUrl.api.setRes, data });
    if (result.isSuccess) {
        dispatch(listApiTreeItems());
    }
};

const deleteApiSet = (params:IPayloadDelApiItem) => async (dispatch:Dispatch<any>) => {
    const result = await request.delete({ url: apiUrl.api.setRes, params });
    if (result.isSuccess) {
        dispatch(listApiTreeItems());
    }
    return result.isSuccess;
};

const withdrawDelApiTreeItem = (params:IPayloadDelApiItem) => async (dispatch:Dispatch<any>) => {
    const result = await request.get({ url: apiUrl.api.withdraw, params });
    if (result.isSuccess) {
        dispatch(listApiTreeItems());
    }
    return result.isSuccess;
};

const addApiGroup = (data:IPayloadAddApiGroup) => async (dispatch:Dispatch<any>) => {
    const result = await request.post({ url: apiUrl.api.groupRes, data });
    if (result.isSuccess) {
        dispatch((listApiTreeItems()));
    }
};

const editApiGroup = (data:IPayloadEditApiGroup) => async (dispatch:Dispatch<any>) => {
    const result = await request.put({ url: apiUrl.api.groupRes, data });
    if (result.isSuccess) {
        dispatch(listApiTreeItems());
    }
};

const deleteApiGroup = (params:IPayloadDelApiItem) => async (dispatch:Dispatch<any>) => {
    const result = await request.delete({ url: apiUrl.api.groupRes, params });
    if (result.isSuccess) {
        dispatch(listApiTreeItems());
    }
    return result.isSuccess;
};

const addApiTreeItem = (data:IPayloadAddApiTreeItem) => async (dispatch:Dispatch<any>) => {
    const result = await request.post({ url: apiUrl.api.apiTreeItemRes, data });
    if (result.isSuccess) {
        dispatch(listApiTreeItems());
    }
};

/// 删除API
const delApiTreeItem = (params:IPayloadDelApiTreeItem) => async (dispatch: Dispatch<any>) => {
    const result = await request.delete({ url: apiUrl.api.apiTreeItemRes, params });
    if (result.isSuccess) {
        dispatch(listApiTreeItems());
    }
    return result.isSuccess;
};

const editApiTreeItem = (data:IPayloadEditApiTreeItem) => async (dispatch: Dispatch<any>) => {
    const result = await request.put({ url: apiUrl.api.apiTreeItemRes, data });
    if (result.isSuccess) {
        dispatch(listApiTreeItems());
    }
};

const addApi:(apiItem:{parentId:number, name:string, description?:string})=>void = (apiItem) => async (dispatch:Dispatch<any>, getState:any) => {
    const { currentApiSerial } = getState().api;
    const currentApi = getState().api.activeApis.filter((item:API) => item.serial === currentApiSerial)[0];
    const params = currentApi.params ? JSON.stringify(currentApi.params) : undefined;
    const headers = currentApi.headers ? JSON.stringify(currentApi.headers) : undefined;
    const pathVars = currentApi.pathVars ? JSON.stringify(currentApi.pathVars) : undefined;
    const payload = {
        parentId: apiItem.parentId,
        name: apiItem.name,
        method: currentApi.method.toUpperCase(),
        url: currentApi.url,
        description: apiItem.description,
        authType: currentApi.authType,
        authToken: currentApi.authToken,
        bodyType: currentApi.bodyType,
        bodyJson: currentApi.bodyJson,
        testsCode: currentApi.testsCode,
        params,
        headers,
        pathVars,
    };
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const result = await _addApi(payload);
    if (result.isSuccess) {
        dispatch(listApiTreeItems());
        dispatch(apiActions.updateCurrentApi({ name: apiItem.name, id: result.data.id, treeItemId: result.data.treeItemId }));
        dispatch(apiActions.setCurrentApiSaved());
    }
};

const editApi:()=>void = () => async (dispatch:Dispatch<any>, getState:any) => {
    const { currentApiSerial } = getState().api;
    const currentApi = getState().api.activeApis.filter((item:API) => item.serial === currentApiSerial)[0];
    const {
        id, url, name, bodyJson, bodyType, testsCode, authType, authToken, description,
    } = currentApi;
    let {
        params, headers, pathVars, method,
    } = currentApi;
    params = params ? JSON.stringify(params) : params;
    headers = headers ? JSON.stringify(headers) : headers;
    pathVars = pathVars ? JSON.stringify(pathVars) : pathVars;
    method = method.toUpperCase();
    const payload = {
        id, url, method, name, params, headers, bodyJson, bodyType, testsCode, pathVars, authType, authToken, description,
    };
    if (payload.pathVars && payload.pathVars.length === 0) {
        delete payload.pathVars;
    }

    const result = await request.put({ url: apiUrl.api.apiRes, data: payload });
    if (result.isSuccess) {
        dispatch(apiActions.setCurrentApiSaved());
        dispatch(listApiTreeItems());
    }
    return result;
};

// eslint-disable-next-line no-underscore-dangle
const _addApi:(apiItem:{parentId:number,
    name:string,
    method:ApiMethod,
    url?:string,
    params?:string,
    headers?:string,
    bodyJson?:string,
    bodyType?:BodyType,
    testsCode?:string,
    authType?:AuthType,
    authToken?:string,
    pathVars?:string,
    description?:string,
})=>any = async (apiItem) => {
    const result = await request.post({ url: apiUrl.api.apiRes, data: apiItem });
    return result;
};

const apiSelected = (id:number) => async (dispatch:Dispatch<any>, getState:any) => {
    const { activeApis } = getState().api;
    const activeApi = activeApis.filter((item:API) => item.treeItemId === id)[0];
    if (activeApi) {
        // 如果当前tree item id在激活API内，则直接激活
        dispatch(apiActions.setCurrentApiSerial(activeApi.serial));
    } else {
        // 如果指定 tree item id不在激活API内， 则获取API详情，并激活

        const result = await request.get({ url: apiUrl.api.apiViaTreeItem, params: { treeItemId: id } });
        if (result.isSuccess) {
            const apiData = result.data;
            const serial = getUsableSerial(activeApis);
            const theApi = { ...apiData, serial, dirty: false };
            theApi.params = theApi.params ? JSON.parse(theApi.params) : [{ key: 0 }];
            theApi.headers = theApi.headers ? JSON.parse(theApi.headers) : [{ key: 0 }];
            if (theApi.pathVars) {
                theApi.pathVars = JSON.parse(theApi.pathVars);
            }
            dispatch(apiActions.pushActiveApi(theApi));
        }
    }
};

export const apiThunks = {
    saveApiExample: () => async (dispatch:Dispatch<any>, getState:any) => {
        const { currentApiSerial } = getState().api;
        const currentApi = getState().api.activeApis.filter((item:API) => item.serial === currentApiSerial)[0];
        const {
            url, bodyType, bodyJson, method,
        } = currentApi;
        const apiExample = {
            url,
            bodyType,
            bodyJson,
            method,
            name: currentApi.exampleName,
            response: currentApi.responseBody ? JSON.stringify(currentApi.responseBody) : null,
            params: currentApi.params ? JSON.stringify(currentApi.params) : null,
            headers: currentApi.headers ? JSON.stringify(currentApi.headers) : null,
            pathVars: currentApi.pathVars ? JSON.stringify(currentApi.pathVars) : null,
            id: undefined,
            apiId: undefined,
        };
        const isSaved = !!currentApi.id;
        let result;
        if (isSaved) {
            apiExample.id = currentApi.id;
            result = await request.put({ url: apiUrl.apiExample.apiExampleRes, data: apiExample });
        } else {
            apiExample.apiId = currentApi.apiId;
            result = await request.post({ url: apiUrl.apiExample.apiExampleRes, data: apiExample });
        }
        if (result.isSuccess) {
            dispatch(apiActions.setCurrentApiSaved());
        }
    },
    editApiName: (name:string) => async (dispatch:Dispatch<any>, getState:any) => {
        const { currentApiSerial } = getState().api;
        const currentApi = getState().api.activeApis.filter((item:API) => item.serial === currentApiSerial)[0];
        const payload = {
            id: currentApi.id,
            name,
        };
        const result = await request.put({ url: apiUrl.api.apiRes, data: payload });
        if (result.isSuccess) {
            dispatch(listApiTreeItems());
            dispatch(apiSlice.actions.setCurrentApiName(name));
        }
    },
    editApiDescription: (description:string|undefined) => async (dispatch:Dispatch<any>, getState:any) => {
        const { currentApiSerial } = getState().api;
        const currentApi = getState().api.activeApis.filter((item:API) => item.serial === currentApiSerial)[0];
        const payload = {
            id: currentApi.id,
            description,
        };
        const result = await request.put({ url: apiUrl.api.apiDescription, data: payload });
        if (result.isSuccess) {
            dispatch(listApiTreeItems());
            dispatch(apiSlice.actions.setCurrentApiDes(description));
        }
    },
    delApiExample: (id:number) => async (dispatch:Dispatch<any>) => {
        const result = await request.delete({ url: apiUrl.apiExample.apiExampleRes, params: { id } });
        if (result.isSuccess) {
            dispatch(apiActions.delApiExample(id));
        }
        return result.isSuccess;
    },
    withdrawDelApiExample: (id:number) => async (dispatch:Dispatch<any>, getState:any) => {
        const result = await request.get({ url: apiUrl.apiExample.withdrawDel, params: { id } });
        const { currentApiSerial } = getState().api;
        const currentApi = getState().api.activeApis.filter((item:API) => item.serial === currentApiSerial)[0];
        if (result.isSuccess) {
            const exampleResult = await request.get({ url: apiUrl.apiExample.apiExampleRes, params: { apiId: currentApi.id } });
            if (exampleResult.isSuccess) {
                dispatch(apiActions.setCurrentApiExample(exampleResult.data));
            }
        }
    },
    listApiEnvs: () => async (dispatch:Dispatch<any>) => {
        const result = await request.get({ url: apiUrl.apiEnv.apiEnvRes });
        if (result.isSuccess) {
            dispatch(apiActions.setEnvs(result.data));
        }
    },
    addApiEnv: (name:string, items:IApiEnv[]) => async (dispatch:Dispatch<any>) => {
        const result = await request.post({ url: apiUrl.apiEnv.apiEnvRes, data: { name, items } });
        if (result.isSuccess) {
            dispatch(apiThunks.listApiEnvs());
        }
    },
    editApiEnv: (name:string, items:IApiEnv[], id:number) => async (dispatch:Dispatch<any>) => {
        const result = await request.put({ url: apiUrl.apiEnv.apiEnvRes, data: { name, items, id } });
        if (result.isSuccess) {
            dispatch(apiThunks.listApiEnvs());
        }
    },
    delApiEnv: (id:number) => async (dispatch:Dispatch<any>) => {
        const result = await request.delete({ url: apiUrl.apiEnv.apiEnvRes, params: { id } });
        if (result.isSuccess) {
            dispatch(apiThunks.listApiEnvs());
        }
    },
};

export { apiActions };

export {
    editApiTreeItem, editApi, apiSelected, addApi, addApiSet, editApiSet, delApiTreeItem,
    editApiGroup, deleteApiSet, listApiTreeItems, addApiGroup, deleteApiGroup, withdrawDelApiTreeItem, addApiTreeItem,
};

export default apiSlice.reducer;
