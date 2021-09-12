import React, {useEffect} from "react";
import './orgHome.less'
import {Divider} from "antd";
import EffOrganization from "../../components/eff-organization/effOrganization";
import EffProject from "../../components/eff-project/effProject";
import {getOrganizationDetail, listProjects, orgThunks} from './orgSlice'
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store/store";


export default function OrganizationHome (){

    //获取数据，组织详情，项目详情
    const dispatch = useDispatch();
    //将当前组织设置为最近登录
    useEffect(()=>{dispatch(orgThunks.setLastLoginOrg())}, [])
    useEffect(()=>{dispatch(getOrganizationDetail())},[dispatch])
    useEffect(()=>{dispatch(listProjects())},[dispatch])

    const departments = useSelector((state:RootState) => state.organization.departments)
    const projects = useSelector((state:RootState)=>state.organization.projects)
    const organization:any = useSelector((state:RootState)=>state.organization.organization)
    const departmentList = departments.map((item:any)=>{
        return   <EffProject key={item.serial} project={item} />
    })
    const projectList = projects.map((item:any)=>{
        return   <EffProject key={item.serial} project={item} />
    })




    return (
        <div className="orgHome padding20 ">
            <Divider className="d-flex align-center justify-center">{organization && organization.name}</Divider>
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
