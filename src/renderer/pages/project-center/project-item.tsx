import React from "react";
import {useHistory} from "react-router";
import {useDispatch} from "react-redux";
import {taskThunks} from "@slice/taskSlice";
import getProjectImgByKey from "@pages/project-center/project-img";
import {IProject} from "@slice/projectSlice";
import {PROJECT_COLOR} from "@config/sysConstant";

interface IProps{
    project:IProject,
}

export default function ProjectItem(props: IProps){
    const dispatch = useDispatch()
    const {project} = props
    const bgColor = project.color? project.color : PROJECT_COLOR[0]
    const history = useHistory()
    //设置图标样式
    const width = '120px'
    const height =  '120px'
    const imgWidth = '50px'
    const borderRadius = '10px'

    const response = {
        goToProject:()=>{
            dispatch(taskThunks.resetStore())
            history.push({pathname:`/app/project/${project.serial}`})
        }
    }

    return (
        <div onClick={response.goToProject} style={{width}} className="d-flex-column align-center cursor-pointer mr40 mb40">
            <div style={{backgroundColor: bgColor, width, height, borderRadius}} className="d-flex justify-center align-center">
                <img src={getProjectImgByKey(project.icon)} width={imgWidth}/>
            </div>
            <span style={{fontSize:'14px', fontWeight:'bold'}} className="mt10">{project.name}</span>
        </div>
    )
}
