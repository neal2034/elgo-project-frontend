import React, {useEffect} from "react";
import './orgHome.less'
import {Divider} from "antd";
import EffOrganization from "../../components/eff-organization/effOrganization";
import EffProject from "../../components/eff-project/effProject";
import {getOrganizationDetail, listProjects} from './orgSlice'
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store/store";


export default function OrganizationHome (){

    //获取数据，组织详情，项目详情
    const dispatch = useDispatch();
    useEffect(()=>{
        dispatch(getOrganizationDetail())

    },[dispatch])
    useEffect(()=>{
        dispatch(listProjects())
    },[dispatch])

    console.log("render or")
    let departments = useSelector((state:RootState) => state.organization.departments)
    let projects = useSelector((state:RootState)=>state.organization.projects)
    const departmentList = departments.map((item:any)=>{
        return   <EffProject key={item.serial} project={item} />
    })
    const projectList = projects.map((item:any)=>{
        return   <EffProject key={item.serial} project={item} />
    })




    return (
        <div className="orgHome padding20 ">
            <Divider className="d-flex align-center justify-center">EffWork</Divider>
            <div className="area">
                <EffOrganization/>
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
