import React, {useState} from "react";
import {Col, Modal, Row, Upload} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/store";
import EffUser from "@components/eff-user/eff-user";
import {CloseOutlined} from '@ant-design/icons'
import './profile-dlg.less'
import apiUrl from "@config/apiUrl";
import globalConfig from "@config/global.config";
import umbrella from "umbrella-storage";
import {accountThunks} from "@slice/accountSlice";


interface IProps{
    visible:boolean,
    onClose: ()=>void,
}


export default function ProfileDlg(props: IProps){
    const dispatch = useDispatch();

    const currentUser = useSelector((state:RootState) => state.account.currentUser)

    const token = umbrella.getLocalStorage('token')
    const orgSerial = umbrella.getLocalStorage('oserial')
    const [avatarName, setAvatarName] = useState("avatar.png");

    const response = {
        onUploadChange: (info:any)=>{
            if (info.file.status === 'done') {
                dispatch(accountThunks.getCurrentUser())
            }
        },
        beforeUpload: (info:any)=>{
            setAvatarName(info.name)
        }
    }

    return (
        <Modal style={{ top: '20%' }} visible={props.visible}  width={400} footer={null}    destroyOnClose={true} title={null} closable={false}>
            <div className="profile-dlg mb40">
                <div className="d-flex align-end">
                    <EffUser img={currentUser.avatar} id={currentUser.id} name={currentUser.name} size={50}/>
                    <Upload accept={".png, .jpg, .jpeg"}
                            name={avatarName}
                            beforeUpload={response.beforeUpload}
                            action={` ${globalConfig.baseUrl + apiUrl.user.avatar}`}
                            onChange={response.onUploadChange}
                            headers={{
                                Authorization: "Bearer " + token,
                                oserial: orgSerial,
                            }}
                            showUploadList={false}
                    >
                        <span className="btn-upload">上传头像</span>
                    </Upload>
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
