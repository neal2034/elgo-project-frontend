import React, {useEffect, useState} from "react";
import HomeLogo from '@imgs/elgo-logo.png'
import Process from '@imgs/home-page/process.png'
import Statistics from '@imgs/home-page/statistics.png'
import TeamWork from '@imgs/home-page/team-work.png'
import SingleCommunication from  '@imgs/home-page/single-comunication.png'
import './home-page.less'
import {Route, useHistory} from "react-router";
import {Switch, useRouteMatch} from "react-router-dom";
import HomeContent from "./home-conetnt/home-content";
import AppDownload from "./app-download/app-download";


export default function HomePage(){
    const history = useHistory()
    const {path} = useRouteMatch()
    const [homeKey, setHomeKey] = useState('home')
    const menus = [
        {menuKey:'help', path:'/home/help', name:'帮助'},
        {menuKey:'blog', path:'/home/blog', name:'社区'},
        {menuKey:'download', path:'/home/download', name:'下载'},
        {menuKey:'about', path:'/home/about', name:'关于'},
    ]
    const response = {
        goLogin: ()=>{
            history.push("/login")
        },
        goSignup: ()=>{
            history.push("/signup")
        },
        menuClick: (menu:any)=>{
            history.push(menu.path)
            setHomeKey(menu.menuKey)
        },
        goHome: ()=>{
            history.push('/')
        }
    }

    useEffect(()=>{
        const defaultPath = `${path}/content`
        history.push(defaultPath)
    },[])



    return (
        <div className="elgo-home d-flex-column">
            <div className="header d-flex justify-between align-center">
                <div className="d-flex align-center">
                    <img className="cursor-pointer" onClick={response.goHome} style={{height:'36px'}} src={HomeLogo}/>
                    <div className="d-flex align-center menus">
                        {menus.map(item=> <span onClick={()=>response.menuClick(item)} className={`menu-item ${homeKey==item.menuKey?'active':''}`}>{item.name}</span>)}
                    </div>
                </div>
                <div className="btn-group d-flex align-center">
                    <div onClick={response.goLogin} className="login btn">登录</div>
                    <div onClick={response.goSignup} className="btn signup ml20">注册</div>
                </div>
            </div>

            <Switch>
                <Route path="/home/content" component={HomeContent} />
                <Route path={'/home/download'} component={AppDownload} />
            </Switch>
            <div className="copyright justify-center align-center d-flex">Copyright ©1998-2021 Elgo All Rights Reserved   陕ICP备17005318号-2</div>

        </div>
    )

}
