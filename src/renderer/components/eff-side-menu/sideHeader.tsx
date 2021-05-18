import React from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../store/store";


export default function SideHeader(){
    const orgName = useSelector((state:RootState) => state.organization.name)
    return (
        <div className="d-flex-column align-start ml20 ">
            <span className="font-title">EffWork</span>
            <span className="font-weak mt10">史俊辉 neal@qingxiangteam.com</span>
        </div>
    )
}
