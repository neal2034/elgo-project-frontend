import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {orgThunks} from "../organizationHome/orgSlice";
import {RootState} from "../../store/store";
import './orgSwitch.less'
import umbrella from 'umbrella-storage';
import {useHistory} from "react-router";
import {setBreadcrumbs} from '../../store/breadcrumbSlice'

export default function OrgSwitch(){

    const dispatch = useDispatch()
    const history = useHistory()
    useEffect(()=>{dispatch(setBreadcrumbs([]))}, [dispatch])
    const orgList = useSelector((state:RootState)=>state.organization.orgList);

    useEffect(()=>{
        dispatch(orgThunks.listOrganizations())
    },[])

    const response = {
        switchOrg: (serial:string)=>{
            umbrella.setLocalStorage("oserial", serial);
            history.push("/app/project-center")
        }
    }

    const organizations = orgList.map((org:any)=>{
        return <div key={org.serial} onClick={()=>response.switchOrg(org.serial)} className="one-org">
            <span className="name">{org.name}</span>
            <span className="join-date ml20">加入日期: {org.joinDate.substr(0, 10)}</span>
        </div>
    })
    return (
        <div className="organization-selector">
            <span className="title">请选择需要进入的组织</span>
            <div>
                {organizations}
            </div>
        </div>
    )
}
