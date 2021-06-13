import React from "react";
import {Modal} from "antd";


interface IConfirmDlgProps{
    visible:boolean,
    children?: React.ReactNode,
    className?: string
}

export default function EffConfirmDlg(props:IConfirmDlgProps){
    const {children, visible} = props
    return (
        <Modal  className={props.className} closable={false} footer={false} width={400} title={"确认删除"} visible={visible}>
            {children}
        </Modal>
    )
}
