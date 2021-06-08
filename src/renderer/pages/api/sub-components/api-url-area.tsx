import React, {useState} from "react";
import {Select,Input,Button} from "antd";
import ApiDialog from "../dialogs/api-dialog";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/store";
import {API, ApiParams, ApiPathVar, updateCurrentApi} from "@slice/apiSlice";


const {Option}  = Select


interface IApiProps{
    api: API
}

export default function ApiUrlArea(props:IApiProps){
    const dispatch = useDispatch();
    const {api} = props
    const [apiDlgVisible, setApiDlgVisible] = useState(false)
    const [apiCollections, setApiCollections] = useState(); //当前可以用于保存API的collection
    const apiItems = useSelector((state:RootState)=>state.api.apiTreeItems)
    const response = {
        handleMethodChange:(value:any)=>{
            dispatch(updateCurrentApi({method:value}))
        }
    }

    /**
     * 过滤API tree item, 排除API项，仅保留API 集合 和分组
     * @param items
     * @returns {[]}
     */
    const getApiCollections = (items:any)=>{
        let result:any = [];
        items.forEach((item:any)=>{
            if(item.type!=='API'){
                let tempItem = {...item};
                tempItem.children = [];
                if(item.children && item.children.length>0){
                    tempItem.children = getApiCollections(item.children);
                }
                result.push(tempItem);

            }
        })
        return result;
    }

    const mapTreeData = (data:any) =>{
        return  data.map((item:any)=>{
            return {...item,   key:item.id, title:item.name, children: item.children == null || item.children.length <= 0 ? [] : mapTreeData(item.children)}
        })
    }

    //解析出指定URL里的query  parameters
    const getParams = (url:string)=>{
        let params:ApiParams[] = [];
        let index = url? url.indexOf("?"):-1;
        if(index>=0){
            let paramStr = url.substring(index+1);
            let paramPairs = paramStr.split("&");
            paramPairs.forEach((pair,index)=>{
                let tempParam = pair.split("=")
                params.push({selected:true, paramKey:tempParam[0],paramValue:tempParam[1], key:-1});
            })
        }
        return params;
    }

    const parseParamsFromUrl = (url:string)=>{
        let tmpParams:ApiParams[] = Object.assign([], api.params)
        //从URL 当中解析参数
        let activeParams  = getParams(url)
        //给解析出的参数赋key， description
        let maxKey = -1
        tmpParams.map(item=>{
            if(item.key>maxKey) maxKey=item.key
        })
        let usedKeys:number[] = []
        activeParams.forEach(param=>{
            let existParam = tmpParams.filter(item=>item.selected && item.paramKey===param.paramKey && usedKeys.indexOf(item.key)>-1)[0]
            if(existParam) {
                param.description = existParam.description
                param.key = existParam.key
                usedKeys.push(existParam.key) //对已使用过的key 进行记录
            }else{
                param.key = ++maxKey
            }
        })
        //过滤出当前params 当中处于未选中的参数并与url计算所得参数进行整合
        let filterParams = tmpParams.filter(item=>item.selected===false)
        let params = [...filterParams, ...activeParams]
        //按照key进行排序
        params.sort((a,b)=>a.key - b.key)
        //添加空白参数
        params.push({key:++maxKey})
        return params
    }


    //获取指定URL的path variables
    const getPathVariables = (url:string)=>{
        let vars:string[] = [];
        let regex = new RegExp("/:[a-z0-9A-Z]+","g");
        let result = url.match(regex);
        if(result){
            result.forEach(item=>{
                let varName = item.substr(2);
                if(vars.indexOf(varName) === -1){
                    vars.push(varName);
                }
            })
        }
        return vars;
    }

    /**
     * 将指定的path variables 进行合并
     * @param pathVars  当前api的path variables
     * @param url       当前URL
     */
    const getMergedPathVariables = (pathVars:ApiPathVar[], url:string) =>{
        let vars = getPathVariables(url);
        let resultPathVars:any = [];
        let maxKey = -1
        pathVars.map(item=>maxKey=maxKey>item.key?maxKey:item.key)
        vars.forEach(item=>{
            let foundVars = pathVars.filter((oneVar:any)=>oneVar.varKey === item)[0];
            resultPathVars.push(foundVars? foundVars: {varKey:item, key:++maxKey});
        })

        return resultPathVars;

    }

    const handler = {
        handleSaveClick:()=>{
            setApiDlgVisible(true)
            let collections = mapTreeData(getApiCollections(apiItems));
            setApiCollections(collections)
        },
        handleUrlChange:(e:any)=>{
            let url = e.target.value
            let params = parseParamsFromUrl(url)
            let mergedPathVars = getMergedPathVariables(api.pathVars? api.pathVars:[], url);
            dispatch(updateCurrentApi({url, params, pathVars:mergedPathVars}))
        },
        handleCallApi:()=>{
            // let url =  api.url
            // let method = api.method
            // let sbody = {
            //     "username":"admin@effwork.net",
            //     "password":"pass1234"
            // }
            // let body = JSON.stringify(sbody)
            // let prams = {method, body}
            // // @ts-ignore
            // fetch(url!, prams).then(result=>{
            //     result.json().then(data=>{
            //         let responseBody =  JSON.stringify(data);  //该变量可被测试使用
            //         console.log("hte response body is ", responseBody)
            //     })
            //     console.log("here is result", result)
            // })
            console.log("here is the api ", api)
        }
    }

    return (
        <div className="d-flex">
            <Select style={{ width: 120 }} value={api.method} onChange={response.handleMethodChange}>
                <Option value="get">Get</Option>
                <Option value="post">Post</Option>
                <Option value="put">Put</Option>
                <Option value="delete">Delete</Option>
            </Select>
            <Input value={api.url} onChange={handler.handleUrlChange}/>
            <Button onClick={handler.handleCallApi}>发送</Button>
            <Button onClick={handler.handleSaveClick}>保存</Button>
            <ApiDialog collections={apiCollections} visible={apiDlgVisible} closeDlg={()=>setApiDlgVisible(false)} mode={'add-api'} parentId={-1}/>
        </div>
    )
}
