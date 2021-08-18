import React from "react";
import './project-item.less'
import IconMusic from '@imgs/music.png'

interface IProjectItemProps{
    name:string,
}

export default function ProjectItem(props: IProjectItemProps){
    const {name} = props

    return (
        <div className='project-item d-flex-column align-center cursor-pointer mr40 mb40'>
            <div className="item-pic d-flex justify-center align-center">
                <img src={IconMusic} width="50px"/>
            </div>
            <span className="project-name mt10">{name}</span>
        </div>
    )
}
