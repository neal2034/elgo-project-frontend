import React, {useEffect} from "react";
import {useHistory} from "react-router";
import {Switch,useParams} from "react-router-dom";
import PrivateRoute from "@components/common/private-route/private-route";
import {setBreadcrumbs} from "@slice/breadcrumbSlice";
import {useDispatch, useSelector} from "react-redux";
import './project-home.less'
import EffMenu from "../../components/common/eff-menu/eff-menu";
import {menuActions} from "@slice/menuSlice";
import umbrella from "umbrella-storage";
import {RootState} from "../../store/store";
import IconMusic from '@imgs/music.png'
import {projectActions, projectThunks} from "@slice/projectSlice";
import {projectMenuRoutes, IMenuRoute} from "@config/projectMenus";



export default function ProjectHome (){
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


    useEffect(()=>{
        const hrefs = window.location.href
        const menu = projectMenuRoutes.filter(item=>hrefs.indexOf(item.path.replace(':serial',serial))>-1)
        if(menu.length>0){
            dispatch(projectActions.setActiveMenuKey(menu[0].menuKey))
        }else{
            history.push(projectMenuRoutes[0].path.replace(':serial', serial))
            dispatch(projectActions.setActiveMenuKey(projectMenuRoutes[0].menuKey))
        }
    })




    return (
        <div className="d-flex-column flex-grow-1">
            <ProjectHeader/>
            <EffMenu/>
            <div className="d-flex-column flex-grow-1">
                <Switch>
                    {projectMenuRoutes.map((item:IMenuRoute)=><PrivateRoute key={item.path} component={item.component} path={item.path}/>)}
                </Switch>
            </div>

        </div>
    )
}


/**
 * 项目头部图标&名称
 * @constructor
 */
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








