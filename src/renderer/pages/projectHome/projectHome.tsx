import React, {useEffect} from "react";
import {Route, useHistory} from "react-router";
import {Link, Switch,useParams, useRouteMatch} from "react-router-dom";
import Requirement from "../requirment/requirement";
import Funztion from "../funztion/Funztion";
import Task from "../task/task";
import PrivateRoute from "../../routes/privateRoute";
import {setBreadcrumbs} from "../../store/breadcrumbSlice";
import {useDispatch} from "react-redux";
import './project-home.less'
import EffMenu, {EffMenuItem} from "../../components/common/eff-menu/eff-menu";
import {menuActions} from "@slice/menuSlice";
import Api from "../api/api";

export default function ProjectHome (props:any){
    const dispatch = useDispatch()
    const history = useHistory()
    useEffect(()=>{dispatch(menuActions.setActiveMenu(''))},[dispatch])
    //TODO 对面包屑应该想办法统一处理
    useEffect(()=>{dispatch(setBreadcrumbs([]))}, [dispatch])
    const {serial} = useParams()
    const {url, path} = useRouteMatch()

    //项目菜单属性集
    const proMenuProps = [
        {key:'requirement', path:`${url}/requirement`, name:'需求'},
        {key:'funztion',path:`${url}/funztion`,name:'功能'},
        {key:'task', path:`${url}/task`, name:'任务'},
        {key:'api', path:`${url}/api`, name:'API'},
    ]

    const response = {
        menuClick: (e:any)=>{
            let key = e.key
            proMenuProps.forEach(menu=>{
                if(menu.key==key){
                    history.push(menu.path)
                }
            })

        }
    }

    const ui = {
        menuItems : proMenuProps.map(menu=><EffMenuItem key={menu.key} value={menu.key}>{menu.name}</EffMenuItem>)
    }



    return (
        <div>
            <EffMenu defaultKey={proMenuProps[0] && proMenuProps[0].key} onClick={response.menuClick}>
                {ui.menuItems}
            </EffMenu>

            <Switch>
                <PrivateRoute component={Requirement} path={`${path}/requirement`}/>
                <PrivateRoute component={Funztion} path={`${path}/funztion`}/>
                <PrivateRoute component={Task} path={`${path}/task`}/>
                <PrivateRoute component={Api} path={`${path}/api`}/>
            </Switch>
        </div>
    )
}
