import React, {useEffect} from "react";
import {Redirect, Route, useHistory} from "react-router";
import {Link, Switch,useParams, useRouteMatch} from "react-router-dom";
import Requirement from "../requirment/requirement";
import Funztion from "../funztion/funztion";
import Task from "../task/task";
import PrivateRoute from "../../routes/privateRoute";
import {setBreadcrumbs} from "../../store/breadcrumbSlice";
import {useDispatch, useSelector} from "react-redux";
import './project-home.less'
import EffMenu, {EffMenuItem} from "../../components/common/eff-menu/eff-menu";
import {menuActions} from "@slice/menuSlice";
import Api from "../api/api";
import umbrella from "umbrella-storage";
import {RootState} from "../../store/store";
import IconMusic from '@imgs/music.png'
import {projectActions, projectThunks} from "@slice/projectSlice";

function ProjectHeader(){
    const projectDetail:any = useSelector((state:RootState)=>state.project.projectDetail)
    return (
        <div className="project-head d-flex ml20">
            <div className="project-icon d-flex align-center justify-center">
                <img src={IconMusic} width={20} />
            </div>
            <div className="ml20 name mt10">{projectDetail.name}</div>
        </div>
    )
}



export default function ProjectHome (props:any){
    //设置项目serial
    const {serial} = useParams()
    if(serial){
        umbrella.setLocalStorage('pserial', serial);
    }

    const dispatch = useDispatch()
    const history = useHistory()
    useEffect(()=>{dispatch(menuActions.setActiveMenu(''))},[dispatch])
    //TODO 对面包屑应该想办法统一处理
    useEffect(()=>{dispatch(setBreadcrumbs([]))}, [dispatch])
    useEffect(()=>{dispatch(projectThunks.getProjectDetail())}, [dispatch])


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
        <div className={'project-home'}>
            <ProjectHeader/>
            <EffMenu defaultKey={proMenuProps[0] && proMenuProps[0].key} onClick={response.menuClick}>
                {ui.menuItems}
            </EffMenu>
            {/*<ProjectTollBar/>*/}

            <Redirect to={`${path.replace(':serial', serial)}/funztion`} />
            <div className={'page-content d-flex-column'}>
                <Switch>
                    <PrivateRoute component={Requirement} path={`${path}/requirement`}/>
                    <PrivateRoute component={Funztion} path={`${path}/funztion`}/>
                    <PrivateRoute component={Task} path={`${path}/task`}/>
                    <PrivateRoute component={Api} path={`${path}/api`}/>
                </Switch>
            </div>

        </div>
    )
}






