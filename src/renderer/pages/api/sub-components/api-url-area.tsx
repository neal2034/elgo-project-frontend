import React, { useState } from 'react';
import { Select, Input, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {
    API, ApiEnv, editApi, ApiParams, ApiPathVar, apiActions,
} from '@slice/apiSlice';
import ApiDialog from '../dialogs/api-dialog';
import { RootState } from '../../../store/store';

const { Option } = Select;

interface IApiProps{
    api: API
}

export default function ApiUrlArea(props:IApiProps) {
    const dispatch = useDispatch();
    const { api } = props;
    const [apiDlgVisible, setApiDlgVisible] = useState(false);
    const [apiCollections, setApiCollections] = useState(); // 当前可以用于保存API的collection
    const apiItems = useSelector((state:RootState) => state.api.apiTreeItems);
    const currentEnv:ApiEnv = useSelector((state:RootState) => state.api.envs.filter((item:ApiEnv) => item.id === state.api.currentEnvId)[0]);

    const response = {
        handleMethodChange: (value:any) => {
            dispatch(apiActions.updateCurrentApi({ method: value }));
        },
    };

    /**
     * 过滤API tree item, 排除API项，仅保留API 集合 和分组
     * @param items
     * @returns {[]}
     */
    const getApiCollections = (items:any) => {
        const result:any = [];
        items.forEach((item:any) => {
            if (item.type !== 'API') {
                const tempItem = { ...item };
                tempItem.children = [];
                if (item.children && item.children.length > 0) {
                    tempItem.children = getApiCollections(item.children);
                }
                result.push(tempItem);
            }
        });
        return result;
    };

    const mapTreeData = (data:any) => data.map((item:any) => ({
        ...item, key: item.id, title: item.name, children: item.children == null || item.children.length <= 0 ? [] : mapTreeData(item.children),
    }));

    // 解析出指定URL里的query  parameters
    const getParams = (url:string) => {
        const params:ApiParams[] = [];
        const index = url ? url.indexOf('?') : -1;
        if (index >= 0) {
            const paramStr = url.substring(index + 1);
            const paramPairs = paramStr.split('&');
            paramPairs.forEach((pair) => {
                const tempParam = pair.split('=');
                params.push({
                    selected: true, paramKey: tempParam[0], paramValue: tempParam[1], key: -1,
                });
            });
        }
        return params;
    };

    const parseParamsFromUrl = (url:string) => {
        const tmpParams:ApiParams[] = Object.assign([], api.params);
        // 从URL 当中解析参数
        const activeParams = getParams(url);
        // 给解析出的参数赋key， description
        let maxKey = -1;
        tmpParams.forEach((item) => {
            if (item.key > maxKey) maxKey = item.key;
        });
        const usedKeys:number[] = [];
        activeParams.forEach((param) => {
            const existParam = tmpParams.filter((item) => item.selected && item.paramKey === param.paramKey && usedKeys.indexOf(item.key) > -1)[0];
            if (existParam) {
                param.description = existParam.description;
                param.key = existParam.key;
                usedKeys.push(existParam.key); // 对已使用过的key 进行记录
            } else {
                param.key = ++maxKey;
            }
        });
        // 过滤出当前params 当中处于未选中的参数并与url计算所得参数进行整合
        const filterParams = tmpParams.filter((item) => item.selected === false);
        const params = [...filterParams, ...activeParams];
        // 按照key进行排序
        params.sort((a, b) => a.key - b.key);
        // 添加空白参数
        params.push({ key: ++maxKey });
        return params;
    };

    // 获取指定URL的path variables
    const getPathVariables = (url:string) => {
        const vars:string[] = [];
        const regex = new RegExp('/:[a-z0-9A-Z]+', 'g');
        const result = url.match(regex);
        if (result) {
            result.forEach((item) => {
                const varName = item.substr(2);
                if (vars.indexOf(varName) === -1) {
                    vars.push(varName);
                }
            });
        }
        return vars;
    };

    /**
     * 将指定的path variables 进行合并
     * @param pathVars  当前api的path variables
     * @param url       当前URL
     */
    const getMergedPathVariables = (pathVars:ApiPathVar[], url:string) => {
        const vars = getPathVariables(url);
        const resultPathVars:any = [];
        let maxKey = -1;
        pathVars.forEach((item) => {
            maxKey = maxKey > item.key ? maxKey : item.key;
        });
        vars.forEach((item) => {
            const foundVars = pathVars.filter((oneVar:any) => oneVar.varKey === item)[0];
            resultPathVars.push(foundVars || { varKey: item, key: ++maxKey });
        });

        return resultPathVars;
    };

    /**
     * 获取指定URL 的location 信息
     * @param url
     * @returns {ActiveX.IXMLDOMElement | HTMLAnchorElement | any | HTMLElement}
     */
    const getLocation = (url:string) => {
        const a = document.createElement('a');
        a.href = url;
        return a;
    };

    // 检查candidate 是否为指定itemId 的父级对象
    const isParent = (candidate:any, itemId:any) => {
        let result = false;

        if (candidate.children && candidate.children.length > 0) {
            const item = candidate.children.filter((treeItem:any) => treeItem.id === itemId);
            if (item.length > 0) {
                result = true;
            }
        }
        return result;
    };

    // 在指定的树形items中获得指定itemId 的父级元素

    const findParent = (treeItems:any, itemId:any):any => {
        if (!itemId) return null;

        let parent = null;

        for (let i = 0; i < treeItems.length; i++) {
            const item = treeItems[i];
            const itemIsParent = isParent(item, itemId);
            const hasChildren = item.children && item.children.length > 0;
            if (itemIsParent) {
                parent = item;
                break;
            } else if (hasChildren) {
                parent = findParent(item.children, itemId);
                if (parent !== null) break;
            }
        }
        return parent;
    };

    const getApiAuthInfo = () => {
        let { authType } = api;
        let token = api.authToken;
        // 若鉴权类型为继承，则向上遍历至需继承的authType
        if (authType === 'INHERIT') {
            let parent = findParent(apiItems, api.id);
            while (parent && parent.authType === 'INHERIT') {
                parent = findParent(apiItems, parent.id);
            }
            authType = parent ? parent.authType : 'NONE';
            token = parent ? parent.authToken : null;
        }
        return [authType, token];
    };

    // 获取指定字符串
    const getRealValue = (oriStr?:string) => {
        // TODO 目前是基于环境变量遍历替换 target, 应该提取target 里的变量并检索环境变量
        let targetStr = oriStr;
        const envItems = currentEnv && currentEnv.envItems ? currentEnv.envItems : [];
        // 替换URL 当中的变量
        envItems!.forEach((envItem) => {
            if (envItem.name && oriStr && oriStr.indexOf(envItem.name) > -1) {
                const target = `{{${envItem.name}}}`;
                const value = envItem.value ? envItem.value : '';
                targetStr = oriStr?.replace(new RegExp(target, 'g'), value);
            }
        });
        return targetStr;
    }

    const handler = {
        handleSaveClick: () => {
            if (api.id) {
                dispatch(editApi());
            } else {
                setApiDlgVisible(true);
                const collections = mapTreeData(getApiCollections(apiItems));
                setApiCollections(collections);
            }
        },
        handleUrlChange: (e:any) => {
            const url = e.target.value;
            const params = parseParamsFromUrl(url);
            const mergedPathVars = getMergedPathVariables(api.pathVars ? api.pathVars : [], url);
            dispatch(apiActions.updateCurrentApi({ url, params, pathVars: mergedPathVars }));
        },

        handleCallApi: () => {
            let { url } = api;
            if (!url) {
                alert('url 不能为空');
                return;
            }

            url = getRealValue(url)
            // 替换URL的path vars
            if (api.pathVars) {
                let pathVarValueSettled = true;
                api.pathVars.forEach((item) => {
                    if (!item.varValue) {
                        pathVarValueSettled = false;
                    } else {
                        const target = `:${item.varKey}`;
                        const value = item.varValue;
                        url = url!.replace(new RegExp(target, 'g'), value!);
                    }
                });
                if (!pathVarValueSettled) {
                    alert('有未设置的Path Variable');
                    return;
                }
            }

            // 不能与当前应用同源
            const { host } = getLocation(url!);
            if (!host) {
                alert('请填写请求地址');
                return;
            }
            // eslint-disable-next-line no-restricted-globals
            if (host === location.host) {
                alert('请求地址与当前应用同源');
                return;
            }

            // headers
            let headers:any = null;
            if (api.headers) {
                headers = {};
                api.headers.forEach((item) => {
                    if (item.selected && item.headerKey) {
                        headers[item.headerKey] = getRealValue(item.headerValue);
                    }
                });
            }

            const authInfo = getApiAuthInfo();
            let token = authInfo[1];
            if (authInfo[0] === 'BEARER' && !!token) {
                if (headers === null) headers = {};
                token = getRealValue(token)

                headers.Authorization = `Bearer ${token}`;
            }

            // body
            const body = api.bodyType === 'JSON' ? api.bodyJson : null;
            const method = api.method.toLocaleLowerCase();
            const { ipcRenderer } = window.require('electron');
            ipcRenderer.invoke('api-call', method, { url, data: body, config: { headers } }).then((data:any) => {
                const { testsCode } = api;
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const responseBody = JSON.stringify(data); // 该变量可被测试使用
                if (testsCode) {
                    try {
                        // eslint-disable-next-line no-eval
                        eval(testsCode);
                    } catch (e) {
                        // TODO 将结果放入测试
                        alert(`测试代码错误 ${e}`);
                    }
                }

                dispatch(apiActions.updateApiQuite({ responseBody: data }));
            }).catch((error:any) => {
                dispatch(apiActions.updateApiQuite({ responseBody: `调用错误: ${error.message}` }));
            });
        },
    };

    return (
        <div className="d-flex">
            <Select style={{ width: 120 }} value={api.method} onChange={response.handleMethodChange}>
                <Option value="get">GET</Option>
                <Option value="post">POST</Option>
                <Option value="put">PUT</Option>
                <Option value="delete">DELETE</Option>
            </Select>
            <Input value={api.url} onChange={handler.handleUrlChange} />
            <Button onClick={handler.handleCallApi}>发送</Button>
            <Button onClick={handler.handleSaveClick}>保存</Button>
            <ApiDialog collections={apiCollections} visible={apiDlgVisible} closeDlg={() => setApiDlgVisible(false)} mode="add-api" parentId={-1} />
        </div>
    );
}
