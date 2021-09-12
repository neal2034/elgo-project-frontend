import React, {useEffect, useState} from "react";
import {useHistory} from "react-router";
import {Switch,useParams, useRouteMatch} from "react-router-dom";
import PrivateRoute from "../../routes/privateRoute";
import {setBreadcrumbs} from "../../store/breadcrumbSlice";
import {useDispatch, useSelector} from "react-redux";
import './project-home.less'
import EffMenu from "../../components/common/eff-menu/eff-menu";
import {menuActions} from "@slice/menuSlice";
import umbrella from "umbrella-storage";
import {RootState} from "../../store/store";
import IconMusic from '@imgs/music.png'
import {projectThunks} from "@slice/projectSlice";
import {projectMenus} from "@config/projectMenus";



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
    const [menuKey, setMenuKey] = useState<string>()
    const {path} = useRouteMatch()

    /**
     * 根据当前URL， 获取末尾 hash key, 设置当前激活的菜单
     */
    useEffect(()=>{
        let hrefs = window.location.href.split('/')
        let activeKey = hrefs[hrefs.length -1]
        let menu = projectMenus.filter((item:any)=>item.key==activeKey)
        if(menu.length == 0){
            //默认进入第一个项目菜单
            history.push(`${path.replace(':serial', serial)}/${projectMenus[0].key}`)
        }
        //设置当前激活menu
        setMenuKey(activeKey)
    },[])




    return (
        <div className="d-flex-column flex-grow-1">
            <ProjectHeader/>
            <EffMenu defaultSelectedKey={menuKey}/>
            <div className="d-flex-column flex-grow-1">
                <Switch>
                    {projectMenus.map((item:any)=><PrivateRoute key={item.key} component={item.component} path={`${path}/${item.key}`}/>)}
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








