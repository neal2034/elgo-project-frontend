import React, {useEffect, useState} from "react";
import ProfileDlg from "@components/business/profile-dlg/profile-dlg";
import ChangePwdDlg from "@components/business/change-pwd-dlg/change-pwd-dlg";
import ChangeEmailDlg from "@components/business/change-email-dlg/change-email-dlg";
import {accountThunks} from "@slice/accountSlice";
import {orgThunks} from "@slice/orgSlice";
import {useDispatch} from "react-redux";
interface IProps{
    visible:boolean,
    onClose: ()=>void,
}
export default function ElgoProfile(props:IProps){
    const dispatch = useDispatch()
    const [showChangePwdDlg, setShowChangePwdDlg] = useState(false);
    const [showProfileDlg, setShowProfileDlg] = useState(false)
    const [showChangeEmailDlg, setShowChangeEmailDlg] = useState(false)

    useEffect(()=>{
        setShowProfileDlg(props.visible)
    }, [props.visible])

    const response = {
        //个人设置对话框里的操作响应
        onOperation: (key:string)=>{
            switch (key){
                case 'email':
                    response.goEditEmail()
                    break
                case 'password':
                    response.goEditPwd()
                    break
            }
        },
        goEditEmail: ()=>{
            setShowProfileDlg(false)
            setShowChangeEmailDlg(true)
        },
        goEditPwd: ()=>{
            setShowProfileDlg(false)
            setShowChangePwdDlg(true)
        },
        closePasswordDlg: ()=>{
            setShowChangePwdDlg(false)
            setShowProfileDlg(true)
        },
        closeEmailDlg: ()=>{
            setShowChangeEmailDlg(false)
            setShowProfileDlg(true)
        }
    }

    return (
        <div>
            <ProfileDlg onOperation={response.onOperation} onClose={props.onClose} visible={showProfileDlg}/>
            <ChangePwdDlg onClose={response.closePasswordDlg} visible={showChangePwdDlg}/>
            <ChangeEmailDlg onClose={response.closeEmailDlg} visible={showChangeEmailDlg}/>
        </div>
    )

}
