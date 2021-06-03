import React from "react";
import {Modal, Input, Tabs, Select, Button} from "antd";


interface IApiGroupDlgProps{
    visible:boolean,
    closeDlg:()=>void,
    title:string,
    apiGroup:any,
}


export default function ApiGroupDlg(props:IApiGroupDlgProps){
    const {title,visible,apiGroup,closeDlg} = props

    const ui = {
        titleArea: <div  className="dlg-head font-title">{title}</div>
    }

    return (
        <Modal title={ui.titleArea} closable={false} footer={null} visible={visible}>

        </Modal>
    )
}
