import React, {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import ProjectItem from "./project-item";
import './project-center.less'
import {PlusOutlined} from '@ant-design/icons'
import {Col, Input, Modal, Row} from "antd";
import EffButton from "../../components/eff-button/eff-button";
import {projectThunks} from "@slice/projectSlice";
import {RootState} from "../../store/store";
import {orgThunks} from "@slice/orgSlice";


export default function ProjectCenter(){
    const dispatch = useDispatch()
    const projects = useSelector((state:RootState)=> state.project.projects)
    const [showAddDlg, setShowAddDlg] = useState(false)
    const [showNameError, setShowNameError] = useState(false)
    const nameInputRef = useRef<Input>(null)
    useEffect(()=>{
        dispatch(orgThunks.setLastLoginOrg())
        dispatch(projectThunks.listProject())
    },[])

    const openAddProjectDlg = function (){
        setShowAddDlg(true)
    }
    const handleFocusInName = ()=>setShowNameError(false)

    const handleAddProject = async ()=>{
        const name = nameInputRef.current!.input.value
        if(!name){
            setShowNameError(true)
            return
        }
        await dispatch(projectThunks.addProject(name))
        setShowAddDlg(false)
        await dispatch(projectThunks.listProject());
    }

    const handleCancelAddProject = ()=>{
        setShowAddDlg(false)
    }


    const uiProjects = projects.filter((pro:any)=>pro.type==='PROJECT').map((pro:any)=><ProjectItem serial={pro.serial}  key={pro.serial} name={pro.name}/>)


    return (
        <div className='project-center mt40 d-flex flex-wrap'>
            <Modal  closable={false} footer={false} width={500} title={"新建项目"} visible={showAddDlg}>
                <Row>
                    <Col  span={4}>项目名称</Col>
                    <Col span={20}>
                        <Input  ref={nameInputRef}  onFocus={handleFocusInName}/>
                        {showNameError && <span className="error">请输入项目名称</span>}
                    </Col>
                </Row>
                <Row className="mt20 mb10" justify="end">
                    <Col className="d-flex" offset={14}>
                        <EffButton onClick={handleCancelAddProject} className='mr10' round={true} text={'取消'} key={'cancel'}/>
                        <EffButton onClick={handleAddProject} round={true} type={'filled'} text={'确定'} key={'ok'}/>
                    </Col>
                </Row>



            </Modal>
            {uiProjects}
            <div onClick={openAddProjectDlg} className='new-project-btn  d-flex align-center justify-center cursor-pointer'>
                <PlusOutlined style={{fontSize:'60px', color:'#999999'}}/>
            </div>
        </div>
    )
}
