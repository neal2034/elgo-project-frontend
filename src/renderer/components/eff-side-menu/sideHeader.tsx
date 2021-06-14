import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store/store";
import {orgThunks} from "../../pages/organizationHome/orgSlice";
import {accountThunks} from "../../pages/account/accountSlice";
import {useHistory} from "react-router";


export default function SideHeader(){
    const dispatch = useDispatch()
    const history = useHistory()
    const orgName = useSelector((state:RootState) => state.organization.name)
    const memberName = useSelector((state:RootState)=>state.account.memberName)
    const memberEmail = useSelector((state:RootState)=>state.account.memberEmail)
    useEffect(()=>{
        dispatch(orgThunks.getOrganizationDetail())
        dispatch(accountThunks.getCurrentMember())
    },[])

    const handler = {
        goHome:()=>{
            history.push("/app/organization")
        }
    }
    return (
        <div className="d-flex-column align-start ml20 ">
            <span onClick={handler.goHome} className="font-title cursor-pointer">{orgName}</span>
            <span className="font-weak mt10"><span>{memberName}</span><span className="ml5">{memberEmail}</span></span>
        </div>
    )
}
