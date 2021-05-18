import React from "react";
import {Layout} from "antd";
import './effSideMenu.less'
import SideHeader from "./sideHeader";
const {Sider} = Layout



export default function EffSideMenu(){
    return (
        <Sider width="240" className="side-menu">
            <SideHeader />
        </Sider>
    )
}
