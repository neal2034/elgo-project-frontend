import React, { useRef, useState } from 'react';
import {
    Col, Input, Modal, Row, Upload,
} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import EffUser from '@components/eff-user/eff-user';
import { CloseOutlined } from '@ant-design/icons';
import './profile-dlg.less';
import apiUrl from '@config/apiUrl';
import globalConfig from '@config/global.config';
import umbrella from 'umbrella-storage';
import { accountThunks } from '@slice/accountSlice';
import { userThunks } from '@slice/userSlice';
import { getOrganizationDetail } from '@slice/orgSlice';
import { RootState } from '../../../store/store';

interface IProps{
    visible:boolean,
    onClose: ()=>void,
    onOperation: (key:string) => void
}

export default function ProfileDlg(props: IProps) {
    const dispatch = useDispatch();
    const { visible, onClose, onOperation } = props;

    const currentUser = useSelector((state:RootState) => state.account.currentUser);
    const [isEditingName, setIsEditingName] = useState(false);
    const [userName, setUserName] = useState<string>();
    const userNameInputRef = useRef<Input>(null);

    const token = umbrella.getLocalStorage('token');
    const orgSerial = umbrella.getLocalStorage('oserial');
    const [avatarName, setAvatarName] = useState('avatar.png');

    const response = {
        onUploadChange: (info:any) => {
            if (info.file.status === 'done') {
                dispatch(accountThunks.getCurrentUser());
            }
        },
        beforeUpload: (info:any) => {
            setAvatarName(info.name);
        },
        goEditName: () => {
            setUserName(currentUser.name);
            setIsEditingName(true);
            setTimeout(() => userNameInputRef.current!.focus(), 100);
        },
        userNameChange: (e:any) => {
            setUserName(e.target.value);
        },
        editUserName: async () => {
            if (userName) {
                await dispatch(userThunks.editUserName({ name: userName }));
                dispatch(accountThunks.getCurrentUser());
                dispatch(getOrganizationDetail());
            }

            setIsEditingName(false);
        },
        goEditEmail: () => {
            onOperation('email');
        },
        goEditPwd: () => {
            onOperation('password');
        },
    };

    return (
        <Modal style={{ top: '20%' }} visible={visible} width={400} footer={null} destroyOnClose title={null} closable={false}>
            <div className="profile-dlg mb40">
                <div className="d-flex align-end">
                    <EffUser img={currentUser.avatar} id={currentUser.id} name={currentUser.name} size={50} />
                    <Upload
                        accept=".png, .jpg, .jpeg"
                        name={avatarName}
                        beforeUpload={response.beforeUpload}
                        action={` ${globalConfig.baseUrl + apiUrl.user.avatar}`}
                        onChange={response.onUploadChange}
                        headers={{
                            Authorization: `Bearer ${token}`,
                            oserial: orgSerial,
                        }}
                        showUploadList={false}
                    >
                        <span className="btn-upload">上传头像</span>
                    </Upload>
                </div>

                <CloseOutlined onClick={onClose} className="close" />
                <Row className="profile-item">
                    <Col span={4}>
                        <span>称呼</span>
                    </Col>
                    <Col span={14}>
                        {isEditingName ? (
                            <Input
                                ref={userNameInputRef}
                                onBlur={response.editUserName}
                                onChange={response.userNameChange}
                                value={userName}
                            />
                        )
                            : <span>{currentUser.name}</span> }
                    </Col>
                    <Col span={4}>
                        {!isEditingName && <span onClick={response.goEditName} className="modify">修改</span>}
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
                        <span onClick={response.goEditEmail} className="modify">修改</span>
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
                        <span onClick={response.goEditPwd} className="modify">修改</span>
                    </Col>
                </Row>
            </div>
        </Modal>

    );
}
