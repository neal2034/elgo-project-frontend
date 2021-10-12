import React, {useEffect, useState} from "react";
import ElgoTag from "@components/business/elgo-tag/elgo-tag";
import globalColor from "@config/globalColor";
import {useDispatch, useSelector} from "react-redux";
import {PlusCircleOutlined} from '@ant-design/icons'
import {versionThunks} from "@slice/versionSlice";
import {RootState} from "../../../store/store";
import AddReqSourceDlg from "../req-source-setting/add-req-source-dlg";
import AddVersionDlg from "./add-version-dlg";
import EffConfirmDlg from "@components/eff-confirm-dlg/eff-confirm-dlg";
import EffButton from "@components/eff-button/eff-button";
import {effToast} from "@components/common/eff-toast/eff-toast";


export default function VersionSetting(){
    const dispatch = useDispatch()
    const [showVersionDlg, setShowVersionDlg] = useState(false)
    const [willEditVersion, setWillEditVersion] = useState()
    const [willDelVersion, setWillDelVersion] = useState<{id:number, name:string}>()
    const [confirmDelDlgVisible, setConfirmDelDlgVisible] = useState(false)
    const versions = useSelector((state:RootState)=>state.version.versions)

    useEffect(()=>{
        dispatch(versionThunks.listVersions())
    },[])

    const response = {
        goDelVersion: (version:any)=>{
            setWillDelVersion(version)
            setConfirmDelDlgVisible(true)
        },
        goEditVersion: (version:any)=>{
            setWillEditVersion(version)
            setShowVersionDlg(true)
        },
        addVersion: async (name:string)=>{
            await dispatch(versionThunks.addVersion({name}))
            setShowVersionDlg(false)
            dispatch(versionThunks.listVersions())
        },
        editVersion: async (name:string, id:number)=>{
            await dispatch(versionThunks.editVersion({name,id}))
            setShowVersionDlg(false)
            dispatch(versionThunks.listVersions())
        },
        confirmDelVersion: async()=>{
            setConfirmDelDlgVisible(false)
            const result:any = await dispatch(versionThunks.delVersion(willDelVersion!.id))
            if(result){
                dispatch(versionThunks.listVersions())
                effToast.success_withdraw('版本放入回收站成功', response.handleWithdrawDel)
            }

        },
        handleWithdrawDel: async ()=>{
            const result:any = await dispatch(versionThunks.withdrawDel({id:willDelVersion!.id}))
            if(result){
                dispatch(versionThunks.listVersions())
                effToast.success('撤销成功');
            }
        }
    }

    return (
        <div>
            <div className="d-flex justify-start mt40">
                <h1>用于管理不同的版本号</h1>
            </div>
            <div className="d-flex align-center mt20">
                {versions.map((item:any)=><ElgoTag onDel={()=>response.goDelVersion(item)} onEdit={()=>response.goEditVersion(item)} className="mr10" editable={true} delAble={true} key={item.id} name={item.name} />)}
                <PlusCircleOutlined onClick={()=>setShowVersionDlg(true)} className="ml20 cursor-pointer" style={{color:globalColor.fontWeak, fontWeight:200, fontSize:'20px'}} />
            </div>
            <AddVersionDlg onEdit={response.editVersion} version={willEditVersion} onAdd={response.addVersion} visible={showVersionDlg} onClose={()=>setShowVersionDlg(false)}/>
            <EffConfirmDlg className="mt40"  visible={confirmDelDlgVisible}>
                <div className="d-flex-column">
                    <div className="d-flex-column">
                        <span>确定将版本“{willDelVersion && willDelVersion!.name}”放入回收站</span>
                    </div>
                    <div className="mt10 d-flex justify-end">
                        <EffButton onClick={()=>setConfirmDelDlgVisible(false)}   round={true} key={"cancel"} text={"取消"}/>
                        <EffButton onClick={response.confirmDelVersion}   className="mr10 ml10" type={"filled"} key={"confirm"} text={"确定"} round={true}/>
                    </div>
                </div>
            </EffConfirmDlg>

        </div>
    )

}
