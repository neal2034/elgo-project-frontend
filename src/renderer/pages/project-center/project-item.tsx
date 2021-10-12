import React, {useState} from "react";
import {useHistory} from "react-router";
import {useDispatch} from "react-redux";
import {taskThunks} from "@slice/taskSlice";
import getProjectImgByKey from "@pages/project-center/project-img";
import {IProject} from "@slice/projectSlice";
import {PROJECT_COLOR} from "@config/sysConstant";
import {EllipsisOutlined} from '@ant-design/icons'
import './project-item.less'
import {Dropdown, Menu} from "antd";
import {FormOutlined, DeleteOutlined} from '@ant-design/icons'

interface IProps{
    project:IProject,
    onDel: (project:IProject)=>void,
    onEdit: (project:IProject)=>void,
}

export default function ProjectItem(props: IProps){
    const dispatch = useDispatch()
    const {project} = props
    const bgColor = project.color? project.color : PROJECT_COLOR[0]
    const [showProjectMenu, setShowProjectMenu] = useState(false)
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
        },
        menuChosen: ({key,domEvent}:{key:any,domEvent:any})=>{
            domEvent.stopPropagation()
            setShowProjectMenu(false)
            switch (key){
                case 'delete':
                    response.delProject()
                    break
                case 'edit':
                    response.editProject()
                    break
            }

        },
        delProject: ()=>{
            props.onDel(props.project)
        },
        editProject: ()=>{
            props.onEdit(props.project)
        }

    }

    const menu = (
        <Menu  onClick={response.menuChosen}>
            <Menu.Item className="menu-item" key={"edit"}>
                <span><FormOutlined className="mr5"/>编辑项目</span>
            </Menu.Item>
            <Menu.Item className="menu-item" key={"delete"}>
                <span><DeleteOutlined className="mr5"/> 删除项目</span>
            </Menu.Item>
        </Menu>
    );




    return (
        <div onMouseLeave={()=>setShowProjectMenu(false)} onMouseEnter={()=>setShowProjectMenu(true)} onClick={response.goToProject} style={{width}} className="project-item d-flex-column align-center cursor-pointer mr40 mb40">
            <div style={{backgroundColor: bgColor, width, height, borderRadius}} className="icon d-flex justify-center align-center">
                {showProjectMenu &&  <Dropdown   overlay={menu} trigger={['click']}  placement="bottomLeft" >
                    <EllipsisOutlined onClick={e => e.stopPropagation()} className="action" />
                </Dropdown>}
                <img src={getProjectImgByKey(project.icon)} width={imgWidth}/>
            </div>
            <span style={{fontSize:'14px', fontWeight:'bold'}} className="mt10">{project.name}</span>
        </div>
    )
}
