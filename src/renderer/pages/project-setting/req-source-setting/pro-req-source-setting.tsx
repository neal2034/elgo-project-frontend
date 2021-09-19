import React, {useEffect, useState} from "react";
import EffButton from "@components/eff-button/eff-button";
import './pro-req-souce-setting.less'
import {CloseCircleOutlined} from '@ant-design/icons'
import globalColor from "@config/globalColor";
import {PlusCircleOutlined} from '@ant-design/icons'
import {useDispatch, useSelector} from "react-redux";
import AddReqSourceDlg from "./add-req-source-dlg";
import {reqThunks} from "@slice/reqSlice";
import {RootState} from "../../../store/store";
import EffConfirmDlg from "@components/eff-confirm-dlg/eff-confirm-dlg";
import {effToast} from "@components/common/eff-toast/eff-toast";
import ElgoTag from "@components/business/elgo-tag/elgo-tag";

export default function ReqSourceSetting(){
    const dispatch = useDispatch()
    const [showAddDlg, setShowAddDlg] = useState(false)
    const reqSources = useSelector((state:RootState)=>state.requirement.reqSources)
    const [confirmDelDlgVisible, setConfirmDelDlgVisible] = useState(false)
    const [willDelResource, setWillDelResource]= useState<any>()
    const [willEditResource,setWillEditResource] = useState<any>()

    useEffect(()=>{
        dispatch(reqThunks.listAllReqSource())
    },[])

    const response = {
        addReqSource:  async (name:string)=>{
            setShowAddDlg(false)
            await dispatch(reqThunks.addReqSource({name}))
            dispatch(reqThunks.listAllReqSource())
        },
        editReqSource: async (name:string, id:number)=>{
            setWillEditResource(null)
            setShowAddDlg(false)
            await dispatch(reqThunks.editReqSource({id, name}))
            dispatch(reqThunks.listAllReqSource())
        },
        goDelResource: (reqSource:any)=>{
            setWillDelResource(reqSource)
            setConfirmDelDlgVisible(true)

        },
        confirmDelResource: async ()=>{
            const result:any = await dispatch(reqThunks.delReqSource(willDelResource.id))
            setConfirmDelDlgVisible(false)
            if(result){
                dispatch(reqThunks.listAllReqSource())
                effToast.success_withdraw('需求来源放入回收站成功', response.handleWithdrawDel)
            }
        },
        handleWithdrawDel:async ()=>{
            const result:any = await dispatch(reqThunks.withdrawReqSource({id:willDelResource.id}))
            if(result){
                dispatch(reqThunks.listAllReqSource())
                effToast.success("撤销成功")
            }
        },
        goEditResource: async (resource:any)=>{
            setWillEditResource(resource)
            setShowAddDlg(true)
        }
    }

    return (
        <div>
            <div className="d-flex justify-start mt40">
                <h1>需求来源可用于标记需求的提出方</h1>
            </div>
            <div className="d-flex align-center mt20">
                {reqSources.map((source:any)=><ElgoTag className="ml10" onEdit={()=>response.goEditResource(source)} onDel={()=>response.goDelResource(source)} name={source.name} key={source.id} editable={true} delAble={true}/>)}
                <PlusCircleOutlined onClick={()=>setShowAddDlg(true)} className="ml20 cursor-pointer" style={{color:globalColor.fontWeak, fontWeight:200, fontSize:'20px'}} />
            </div>
            <AddReqSourceDlg onEdit={response.editReqSource} reqSource={willEditResource} onAdd={response.addReqSource} visible={showAddDlg} onClose={()=>setShowAddDlg(false)}/>
            <EffConfirmDlg className="mt40"  visible={confirmDelDlgVisible}>
                <div className="d-flex-column">
                    <div className="d-flex-column">
                        <span>确定将需求来源“{willDelResource && willDelResource!.name}”放入回收站</span>
                    </div>
                    <div className="mt10 d-flex justify-end">
                        <EffButton onClick={()=>setConfirmDelDlgVisible(false)}   round={true} key={"cancel"} text={"取消"}/>
                        <EffButton onClick={response.confirmDelResource}   className="mr10 ml10" type={"filled"} key={"confirm"} text={"确定"} round={true}/>
                    </div>
                </div>
            </EffConfirmDlg>
        </div>
    )

}


interface IReqSourceProps{
    onDel:()=>void,
    onEdit:()=>void,
    name:string,
}


function ReqSource(props:IReqSourceProps){
    const response = {
        onDel:(e:any)=>{
            e.stopPropagation()
           props.onDel()
        },
        onEdit: ()=>{
            props.onEdit()
        }
    }

    return (
        <div onClick={response.onEdit} className="cursor-pointer ml20 req-source">
            <CloseCircleOutlined onClick={response.onDel} className="close" style={{fontSize:'20px', fontWeight:500, color:globalColor.mainRed3}} />
            {props.name}
        </div>
    )
}
