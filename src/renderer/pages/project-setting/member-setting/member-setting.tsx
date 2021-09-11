import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/store";
import EffButton from "@components/eff-button/eff-button";
import EffMemberItem from "@components/business/eff-member-item/eff-member-item";
import {effToast} from "@components/common/eff-toast/eff-toast";
import EffConfirmDlg from "@components/eff-confirm-dlg/eff-confirm-dlg";
import globalColor from "@config/globalColor";
import {projectThunks} from "@slice/projectSlice";


export default function MemberSetting(){
    const dispatch = useDispatch()
    const project = useSelector((state:RootState)=>state.project.projectDetail)
    const [showConfirmDlg, setShowConfirmDlg] = useState(false)
    const [willDelMember, setWillDelMember] = useState<any>()

    const members = []
    for(let i=0; i<10; i++){
        if(project.members){
            members.push(project.members[0])
        }
    }
    const response = {
        handleRemoveMember:(member:any)=>{
            if(member.boolProjectOwner){
                effToast.error('不能移除项目拥有者')
                return
            }
            setWillDelMember(member)
            setShowConfirmDlg(true)
        },
        handleConfirmDelMember: async ()=>{
            let result:any = await dispatch(projectThunks.removeMember({projectMemberId:willDelMember.id}))
            setShowConfirmDlg(false)
            if(result){
               effToast.success('移除项目成员成功');
               dispatch(projectThunks.getProjectDetail())
            }
        }
    }
    return (
        <div className="d-flex-column">
            <EffButton round={true} className="align-self-end" text={'+ 添加成员'} key={'add'} type={"line"} />
            <div className="mt20 d-flex flex-wrap align-center">
                {project.members &&  project.members.map(item=><EffMemberItem onDel={()=>response.handleRemoveMember(item)} member={item} key={item.id}/>)}
            </div>
            <EffConfirmDlg  title={'确认移除'} visible={showConfirmDlg}>
                <div>
                    <div className="d-flex-column" style={{color:globalColor.fontWeak,fontSize:'14px'}}>
                        <span>确定将成员“{willDelMember && willDelMember!.name}”移除项目？</span>
                    </div>
                    <div className="mt20 d-flex justify-end">
                        <EffButton type={"line"} onClick={()=>setShowConfirmDlg(false)} round={true} key={"cancel"} text={"取消"}/>
                        <EffButton onClick={response.handleConfirmDelMember} className="mr20 ml10" type={"filled"} key={"confirm"} text={"确定"} round={true}/>
                    </div>
                </div>

            </EffConfirmDlg>

        </div>
    )
}
