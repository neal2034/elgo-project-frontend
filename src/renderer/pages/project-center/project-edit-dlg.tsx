import React, {useEffect, useState} from "react";
import {Form, Input, Modal} from "antd";
import './project-edit-dlg.less'
import {PROJECT_COLOR, PROJECT_ICON} from "@config/sysConstant";
import {CheckOutlined} from '@ant-design/icons'
import getProjectImgByKey from "@pages/project-center/project-img";
import EffButton from "@components/eff-button/eff-button";
import {IProject} from "@slice/projectSlice";

export default function ProjectEditDlg(props:{
    project:IProject,
    visible:boolean,
    onCancel:()=>void,
    onEdit: (data:{name:string, color:string, icon:string,serial:number})=>void
}){
    const [projectColor, setProjectColor] = useState<string>()
    const [projectIcon, setProjectIcon] = useState<string>()
    const [editForm] = Form.useForm();

    useEffect(()=>{
        if(props.project && props.project.color){
            setProjectColor(props.project.color)
        }

        if(props.project && props.project.icon){
            setProjectIcon(props.project.icon)
        }

    }, [props.project])

    const response = {
        handleEdit: async ()=>{
            const values = await editForm.validateFields()
            props.onEdit({
                serial: props.project.serial,
                name: values.name,
                color: projectColor!,
                icon: 'w' + projectIcon!
            })
        }
    }


    return (
        <Modal width={600} className="project-edit-dlg"  closable={false} footer={false} title={null} visible={props.visible}>
            <div className="title">编辑项目</div>
            <Form initialValues={{name: props.project && props.project.name}} form={editForm} colon={false} className="mt20">
                <Form.Item name={'name'} label={'项目名称'} rules={[{ required: true, message: '请项目名称' }]}>
                    <Input />
                </Form.Item>
                <Form.Item label={'设置颜色'}>
                    <div className="ml10 d-flex">
                        {PROJECT_COLOR.map(color => <div onClick={()=>setProjectColor(color)} className="color-item mr20 d-flex align-center justify-center cursor-pointer" key={color} style={{backgroundColor:color}}>
                            { color == projectColor  &&   <CheckOutlined style={{color:'white', fontWeight:'bold'}} /> }
                        </div>)}
                    </div>

                </Form.Item>

                <Form.Item label={'选择图标'}>
                    <div className="d-flex">
                        {PROJECT_ICON.map(icon => <div key={icon} onClick={()=>setProjectIcon(icon)} className="project-item mr20 d-flex align-center justify-center cursor-pointer" style={{backgroundColor: projectIcon==icon? projectColor:''}}>
                            {projectIcon==icon?  <img width={20} src={getProjectImgByKey('w'+icon)} /> : <img src={getProjectImgByKey(icon)} />}
                        </div>)}
                    </div>

                </Form.Item>

            </Form>

            <div className="btn-group mt10 d-flex justify-end">
                <EffButton onClick={props.onCancel}  round={true} key={"cancel"} text={"取消"}/>
                <EffButton onClick={response.handleEdit}  className="mr20 ml10" type={"filled"} key={"confirm"} text={"确定"} round={true}/>
            </div>

        </Modal>
    )
}
