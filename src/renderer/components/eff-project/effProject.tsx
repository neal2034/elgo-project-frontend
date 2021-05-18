import React from "react";
import './effProject.less'
import EffUser from "../eff-user/effUser";

interface ProjectProps{
    project:any,
}

export default function EffProject(props:ProjectProps){
    const {project} = props
    const members = project.members.map((member:any, index:number)=>{
        if(index<6){
            return <EffUser id={member.id}  style={{marginRight:'5px'}} key={member.id} name={member.name} size={24}/>
        }else if(index===6){
            return <EffUser id={member.id}  style={{marginRight:'5px'}} key={member.id} name={project.members.length} size={24}/>
        }
        else{
            return null
        }

    })

    return (
        <div className="eff-project mr20 d-flex-column justify-between">
             <div className="font-title mt10 ml10">{project.name}</div>
             <div className="ml10 mb10">{members}</div>
        </div>
    )
}
