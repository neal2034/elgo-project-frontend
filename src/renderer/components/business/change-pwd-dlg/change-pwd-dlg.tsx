import React from "react";
import {Modal} from "antd";

interface IProps{
    visible:boolean
}

export default function ChangePwdDlg(props:IProps){

    return (
         <Modal visible={props.visible}>
                <h1>修改密码</h1>
         </Modal>
    )

}
