import React from "react";
import './orgHome.less'
import {Divider} from "antd";
import EffOrganization from "../../components/eff-organization/effOrganization";
import EffProject from "../../components/eff-project/effProject";


export default function OrganizationHome (){
    let users = [
        {id:1, name:'neal'},
        {id:2, name:'aneal'},
        {id:3, name:'bneal'},
        {id:4, name:'cneal'},
        {id:11, name:'neal'},
        {id:21, name:'aneal'},
        {id:31, name:'bneal'},
        {id:41, name:'cneal'},
        {id:12, name:'neal'},
        {id:22, name:'aneal'},
        {id:32, name:'bneal'},
        {id:42, name:'cneal'},
    ]
    let projects = [{id:1, name:'财务', members:users},{id:3, name:'财务',members:users},{id:2, name:'财务2',members:users}]
    const departmentList = projects.map((item)=>{
        return   <EffProject key={item.id} project={item} />
    })
    const projectList = projects.map((item)=>{
        return   <EffProject key={item.id} project={item} />
    })
    return (
        <div className="orgHome padding20 ">
            <Divider className="d-flex align-center justify-center">EffWork</Divider>
            <div className="area">
                <EffOrganization users={users}/>
            </div>
            <Divider >部门</Divider>
            <div className="area d-flex">
                {departmentList}
            </div>
            <Divider>项目</Divider>
            <div className="area d-flex">
                {projectList}
            </div>

        </div>

    );
}
