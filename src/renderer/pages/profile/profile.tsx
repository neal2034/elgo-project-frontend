import React, { useEffect, useState } from 'react';
import ProfileDlg from '@components/business/profile-dlg/profile-dlg';
import ChangePwdDlg from '@components/business/change-pwd-dlg/change-pwd-dlg';
import ChangeEmailDlg from '@components/business/change-email-dlg/change-email-dlg';

interface IProps{
    visible:boolean,
    onClose: ()=>void,
}
export default function ElgoProfile(props:IProps) {
    const { visible, onClose } = props;
    const [showChangePwdDlg, setShowChangePwdDlg] = useState(false);
    const [showProfileDlg, setShowProfileDlg] = useState(false);
    const [showChangeEmailDlg, setShowChangeEmailDlg] = useState(false);

    useEffect(() => {
        setShowProfileDlg(visible);
    }, [visible]);

    const response = {
        // 个人设置对话框里的操作响应
        onOperation: (key:string) => {
            switch (key) {
            case 'email':
                response.goEditEmail();
                break;
            case 'password':
                response.goEditPwd();
                break;
            default:
                break;
            }
        },
        goEditEmail: () => {
            setShowProfileDlg(false);
            setShowChangeEmailDlg(true);
        },
        goEditPwd: () => {
            setShowProfileDlg(false);
            setShowChangePwdDlg(true);
        },
        closePasswordDlg: () => {
            setShowChangePwdDlg(false);
            setShowProfileDlg(true);
        },
        closeEmailDlg: () => {
            setShowChangeEmailDlg(false);
            setShowProfileDlg(true);
        },
    };

    return (
        <div>
            <ProfileDlg onOperation={response.onOperation} onClose={onClose} visible={showProfileDlg} />
            <ChangePwdDlg onClose={response.closePasswordDlg} visible={showChangePwdDlg} />
            <ChangeEmailDlg onClose={response.closeEmailDlg} visible={showChangeEmailDlg} />
        </div>
    );
}
