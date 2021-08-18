import React from "react";
import './project-item.less'
import IconMusic from '@imgs/music.png'
import {useHistory} from "react-router";

interface IProjectItemProps{
    name:string,
    serial:string,
}

export default function ProjectItem(props: IProjectItemProps){
    const {name, serial} = props
    const history = useHistory()

    const response = {
        goToProject:()=>{
            history.push({pathname:`/app/project/${serial}`})
        }
    }

    return (
        <div onClick={response.goToProject} className='project-item d-flex-column align-center cursor-pointer mr40 mb40'>
            <div className="item-pic d-flex justify-center align-center">
                <img src={IconMusic} width="50px"/>
            </div>
            <span className="project-name mt10">{name}</span>
        </div>
    )
}
