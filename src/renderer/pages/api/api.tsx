import React, {useEffect} from "react";
import './api.less'
import {useDispatch, useSelector} from "react-redux";
import {setBreadcrumbs} from '../../store/breadcrumbSlice'
import ApiSideBar from "./sub-components/api-sidebar";
import ApiContent from "./sub-components/api-content";
import {RootState} from "../../store/store";
import {ApiEnv, apiThunks} from "@slice/apiSlice";


export default function Api(){

    const dispatch = useDispatch();
    const currentEnvId = useSelector((state:RootState)=>state.api.currentEnvId)
    const currentEnv:ApiEnv = useSelector((state:RootState)=>state.api.envs.filter((item:ApiEnv)=>item.id === state.api.currentEnvId)[0])
    //设置面包屑
    // useEffect(()=>{dispatch(setBreadcrumbs(['接口管理']))}, [dispatch])
    useEffect(()=>{
        window.effwork = {
            //设置环境变量
            setEnvironmentVariable(key:string, value:string){
                //获取当前环境，如果没有环境则返回
                if(currentEnvId===-1) {
                    return;
                }

                //在当前环境里找寻所有key,满足条件则设置为value
                let  env:any = {
                    id:currentEnv.id,
                    name:currentEnv.name,
                    items:Object.assign([],currentEnv.envItems)
                };

                let item = {name:key,value,used:true};
                if(env.items){
                    let setted = false
                    env.items.forEach((envItem:any)=>{
                        if(envItem.name===key){
                            envItem.value = value;
                            setted = true;
                        }
                    })
                    if(!setted) {
                        let lastitem = env.items[env.items.length-1];
                        if(!lastitem.name && !lastitem.value && !lastitem.used){
                            env.items[env.items.length-1] = item;
                        }else {
                            env.items.push(item);
                        }

                    }
                }else{
                    env.items = [item];
                }

                dispatch(apiThunks.editApiEnv(env.name, env.items, env.id))
            }
        }
    },[currentEnvId])
    return (
        <div className="api d-flex">
            <ApiSideBar/>
            <ApiContent/>
        </div>
    )
}
