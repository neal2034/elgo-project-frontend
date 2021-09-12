import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {setBreadcrumbs} from "../../store/breadcrumbSlice";
import EffButton from "@components/eff-button/eff-button";
import {RootState} from "../../store/store";
import {getOrganizationDetail, orgThunks} from "../organizationHome/orgSlice";
import {Input, Modal} from "antd";
import {DeleteOutlined} from '@ant-design/icons'
import './org-members.less'
import globalColor from "@config/globalColor";
import {effToast} from "@components/common/eff-toast/eff-toast";
import EffMemberItem from "@components/business/eff-member-item/eff-member-item";


export default function OrgMembers(){

    const dispatch = useDispatch()
    const organization:any = useSelector((state:RootState)=>state.organization.organization)
    const [newMembers, setNewMembers] = useState([{show:true}])
    const [inputNum, setInputNum] = useState(1)
    const [showInviteDlg, setShowInviteDlg] = useState(false)

    useEffect(()=>{
        dispatch(getOrganizationDetail())
        dispatch(setBreadcrumbs(['组织成员']))
    },[])

    const response = {

        handleRemoveInviteInput: (index:number)=>{
            let tempMembers:any = Object.assign([], newMembers)
            tempMembers[index].show = false
            setNewMembers(tempMembers)

            //获取当前依然显示的邀请输入框
           let num = tempMembers.reduce((cur:any,next:any)=>{
                return next.show? cur + 1:cur
            },0)
            setInputNum(num)
        },
        handleInviteValueChange: (index:number, value?:string)=>{
            let tempMembers:any = Object.assign([], newMembers)
            tempMembers[index].value = value
            tempMembers[index].errMsg = null
            setNewMembers(tempMembers)
        },
        handleAddInviteInput: ()=>{
            let tempMembers:any = Object.assign([], newMembers)
            tempMembers.push({show:true})
            setNewMembers(tempMembers)
            //设置input数量
            let num = inputNum + 1
            setInputNum(num)
        },
        goInviteMember: async ()=>{
            //检查邮箱格式是否有效
            let formatValid = true
            let tempMembers:any = Object.assign([], newMembers)
            let reg=/[A-z0-9_-]*\@[A-z0-9]+\.[A-z]+/;
            tempMembers.forEach((item:any)=>{
                if(item.show && item.value){

                    let result = reg.test(item.value.trim())
                    if(!result){
                        item.errMsg = "邮箱格式不正确"
                        formatValid = false
                    }
                }
            })
            if(!formatValid){
                setNewMembers(tempMembers)
                return
            }

            //检查是否只有唯一输入框，且没有输入
            let emptyValid = true
            if(inputNum == 1){
                tempMembers.forEach((item:any)=>{
                    if(item.show){
                        let value = item.value && item.value.trim()
                        if(!value){
                            emptyValid = false
                            item.errMsg = '请填写邮箱'
                        }
                    }
                })
            }
            if(!emptyValid){
                setNewMembers(tempMembers)
                return
            }

            //添加组织成员
            let orgMembers:any = []
            tempMembers.forEach((item:any)=>{
                if(item.show && item.value && item.value.trim()){
                    orgMembers.push({email:item.value.trim()})
                }
            })
            let result:any = await dispatch(orgThunks.inviteMember({orgMembers}))
            setShowInviteDlg(false)
            if(result as boolean){
                effToast.success('已为邀请成员发送邀请邮件')
                dispatch(orgThunks.getOrganizationDetail())
            }
        },

        removeOrgMember: (member:any)=>{

        }
    }

    return (<div className="pt40 pl40 pr40 d-flex-column">
         <EffButton onClick={()=>setShowInviteDlg(true)} className="align-self-end" text={'+ 邀请成员'} key={'invite'} type={"line"} round={true}/>
        <div className="d-flex justify-start flex-wrap mt20">
            {organization && organization.members && organization.members.map((item:any)=><EffMemberItem onDel={()=>response.removeOrgMember(item)} member={item} key={item.id}/>)}
        </div>

         <Modal visible={showInviteDlg} title={null} footer={null} closable={false}>
             <div className="invite-members-dlg">
                 <div className="title">邀请成员</div>
                 <div className="content d-flex-column pb20">
                     <span className="mb20">通过邮箱邀请组织成员加入，将向被邀请成员邮箱发送激活链接</span>
                     {newMembers.map((item:any,index)=>{
                         return item.show && <InviteInput onChange={(value?:string)=>response.handleInviteValueChange(index, value)}
                                                          errMsg={item.errMsg}
                                                          showDel={inputNum>1} onDel={()=>response.handleRemoveInviteInput(index)}   key={index}/>
                     })}
                     <span onClick={response.handleAddInviteInput} style={{color:globalColor.mainYellowDark}} className="cursor-pointer"> + 新增成员</span>
                 </div>
                 <div className="d-flex justify-end footer">
                     <EffButton onClick={()=>setShowInviteDlg(false)} text={'取消'} key={'cancel'} type={"line"} round={true}/>
                     <EffButton onClick={response.goInviteMember} className="ml20" text={'确定'} key={'save'} type={"filled"} round={true}/>
                 </div>
             </div>
         </Modal>

    </div>)
}





function InviteInput(props:{errMsg?:string, showDel:boolean, onDel:Function, onChange:Function}){

    const response={
        handleDel(){
            props.onDel()
        },
        handleValueChange(e:any){
            props.onChange(e.target.value)
        }
    }

    return (
        <div className="mb20 invite-input">
            <div>
                <Input onChange={response.handleValueChange} placeholder={"请输入邮箱"} style={{width:'400px'}}  size={"large"}/>
                {props.showDel && <DeleteOutlined onClick={response.handleDel} className="ml20 del-btn" style={{fontSize:'16px', color:globalColor.fontWeak}} />}
            </div>
            {props.errMsg && <span style={{fontSize:'12px', color:globalColor.mainRed3}}>{props.errMsg}</span>}
        </div>
    )
}
