import React, {useEffect, useState} from "react";
import ProfileDlg from "@components/business/profile-dlg/profile-dlg";
import ChangePwdDlg from "@components/business/change-pwd-dlg/change-pwd-dlg";
interface IProps{
    visible:boolean,
    onClose: ()=>void,
}
export default function ElgoProfile(props:IProps){

    const [showChangePwdDlg, setShowChangePwdDlg] = useState(false);
    const [showProfileDlg, setShowProfileDlg] = useState(false)

    useEffect(()=>{
        setShowProfileDlg(props.visible)
    }, [props.visible])

    const response = {
        //个人设置对话框里的操作响应
        onOperation: (key:string)=>{
            switch (key){
                case 'email':
                    break
                case 'password':
                    response.goEditPwd()
                    break
            }
        },
        goEditPwd: ()=>{
            setShowProfileDlg(false)
            setShowChangePwdDlg(true)
        },
        closePasswordDlg: ()=>{
            setShowChangePwdDlg(false)
            setShowProfileDlg(true)
        }
    }

    return (
        <div>
            <ProfileDlg onOperation={response.onOperation} onClose={props.onClose} visible={showProfileDlg}/>
            <ChangePwdDlg onClose={response.closePasswordDlg} visible={showChangePwdDlg}/>
        </div>
    )

}
