import React from "react";
import {Modal} from "antd";


interface IConfirmDlgProps{
    visible:boolean,
    children?: React.ReactNode,
    className?: string,
    title?:string
}

export default function EffConfirmDlg(props:IConfirmDlgProps){
    const {children, visible,title='确认删除'} = props
    return (
        <Modal  className={props.className} closable={false} footer={false} width={400} title={title} visible={visible}>
            {children}
        </Modal>
    )
}
