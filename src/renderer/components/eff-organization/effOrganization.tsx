import React from "react";
import EffUser from "../eff-user/effUser";
import './effOrganization.less'
import {useSelector} from "react-redux";
import {RootState} from "../../store/store";


export default function EffOrganization(){


    const members = useSelector((state:RootState) => state.organization.organization && state.organization.organization.members)
    const users = members? members as any:[]
    const userItems = users.map((user:any, index:number)=>{
        if(index<6){
            return <EffUser id={user.id}  style={{marginRight:'5px'}} key={user.id} name={user.name} size={24}/>
        }else if(index===6){
            return <EffUser id={user.id}  style={{marginRight:'5px'}} key={user.id} name={users.length} size={24}/>
        }
        else{
            return null
        }

    })
    return (
        <div className="organization">
            <div className="mt10 ml10 font-title">总部</div>
            <span className="desc ml10">组织级别的通知,待办和需要所有人协同的事务</span>
            <div className="mb10 ml10">{userItems}</div>
        </div>
    )
}
