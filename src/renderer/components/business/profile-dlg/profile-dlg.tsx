import React from "react";
import {Col, Modal, Row} from "antd";
import {useSelector} from "react-redux";
import {RootState} from "../../../store/store";
import EffUser from "@components/eff-user/eff-user";
import {CloseOutlined} from '@ant-design/icons'
import './profile-dlg.less'

interface IProps{
    visible:boolean,
    onClose: ()=>void,
}


export default function ProfileDlg(props: IProps){

    const currentUser = useSelector((state:RootState) => state.account.currentUser)
    return (
        <Modal style={{ top: '20%' }} visible={props.visible}  width={400} footer={null}    destroyOnClose={true} title={null} closable={false}>
            <div className="profile-dlg mb40">
                <div className="d-flex align-end">
                    <EffUser id={currentUser.id} name={currentUser.name} size={50}/>
                    <span className="btn-upload">上传头像</span>
                </div>

                <CloseOutlined onClick={props.onClose} className="close" />
                <Row className="profile-item">
                    <Col span={4}>
                        <span>称呼</span>
                    </Col>
                    <Col span={14}>
                        <span>{currentUser.name}</span>
                    </Col>
                    <Col span={4}>
                        <span className="modify">修改</span>
                    </Col>
                </Row>

                <Row className="profile-item">
                    <Col span={4}>
                        <span>邮箱</span>
                    </Col>
                    <Col span={14}>
                        <span>{currentUser.username}</span>
                    </Col>
                    <Col span={4}>
                        <span className="modify">修改</span>
                    </Col>
                </Row>

                <Row className="profile-item">
                    <Col span={4}>
                        <span>密码</span>
                    </Col>
                    <Col span={14}>
                        <span className="password">******</span>
                    </Col>
                    <Col span={4}>
                        <span className="modify">修改</span>
                    </Col>
                </Row>
            </div>
        </Modal>

    )
}
