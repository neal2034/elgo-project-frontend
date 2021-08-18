import React, {useEffect} from "react";
import {Route, useHistory} from "react-router";
import {Link, Switch,useParams, useRouteMatch} from "react-router-dom";
import Requirement from "../requirment/requirement";
import Funztion from "../funztion/Funztion";
import Task from "../task/task";
import PrivateRoute from "../../routes/privateRoute";
import {setBreadcrumbs} from "../../store/breadcrumbSlice";
import {useDispatch} from "react-redux";
import {Menu} from "antd";
import './project-home.less'
import EffMenu, {EffMenuItem} from "../../components/common/eff-menu/eff-menu";

export default function ProjectHome (props:any){
    const dispatch = useDispatch()
    const history = useHistory()
    //TODO 对面包屑应该想办法统一处理
    useEffect(()=>{dispatch(setBreadcrumbs([]))}, [dispatch])
    const {serial} = useParams()
    const {url, path} = useRouteMatch()
    const menuKeys = {
        requirement:{key:'requirement', path:`${url}/requirement`},
        funztion:{key:'funztion',path:`${url}/funztion` },
        task:{key:'task', path:`${url}/task`}
    }

    const response = {
        menuClick: (e:any)=>{
            let key = e.key
            switch (key){
                case menuKeys.requirement.key:
                    history.push(menuKeys.requirement.path)
                    break
                case menuKeys.funztion.key:
                    history.push(menuKeys.funztion.path)
                    break
                case menuKeys.task.key:
                    history.push(menuKeys.task.path)
                    break
            }
        }
    }



    return (
        <div>
            <EffMenu defaultKey={menuKeys.requirement.key} onClick={response.menuClick}>
                <EffMenuItem value={menuKeys.requirement.key}>需求</EffMenuItem>
                <EffMenuItem value={menuKeys.funztion.key}>功能</EffMenuItem>
                <EffMenuItem value={menuKeys.task.key}>任务</EffMenuItem>
            </EffMenu>

            <Switch>
                <PrivateRoute component={Requirement} path={`${path}/requirement`}/>
                <PrivateRoute component={Funztion} path={`${path}/funztion`}/>
                <PrivateRoute component={Task} path={`${path}/task`}/>
            </Switch>
        </div>
    )
}
