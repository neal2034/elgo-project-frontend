import React from "react";
import ProfileDlg from "@components/business/profile-dlg/profile-dlg";
interface IProps{
    visible:boolean,
    onClose: ()=>void,
}
export default function ElgoProfile(props:IProps){

    return (
        <div>
            <ProfileDlg onClose={props.onClose} visible={props.visible}/>
        </div>
    )

}
