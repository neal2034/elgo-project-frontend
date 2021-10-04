import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/store";
import {tagThunks} from "@slice/tagSlice";
import globalColor from "@config/globalColor";
import {PlusCircleOutlined} from '@ant-design/icons'
import TagDialog from "./tag-dialog";
import EffButton from "@components/eff-button/eff-button";
import EffConfirmDlg from "@components/eff-confirm-dlg/eff-confirm-dlg";
import {effToast} from "@components/common/eff-toast/eff-toast";
import ElgoTag from "@components/business/elgo-tag/elgo-tag";


export default function TagSetting(){
    const dispatch = useDispatch()
    const tags = useSelector((state:RootState)=>state.tag.tags)
    const [showTagDlg, setShowTagDlg] = useState(false)
    const [editTag, setEditTag] = useState()
    const [confirmDelDlgVisible, setConfirmDelDlgVisible] = useState(false)
    const [willDelTag, setWillDelTag] = useState<any>();

    useEffect(()=>{
        dispatch(tagThunks.listTags())
    },[])

    const response = {
        occupy: ()=>{},
        onAddTag: async (name:string, color:string)=>{
                await dispatch(tagThunks.addTag({name,color}))
                dispatch(tagThunks.listTags())
                setShowTagDlg(false)
        },
        goEditTag: (tag:any)=>{
            setEditTag(tag);
            setShowTagDlg(true)
        },
        onEditTag: async(name:string, color:string, id:number)=>{
            await dispatch(tagThunks.editTag({id,name,color}))
            dispatch(tagThunks.listTags())
            setShowTagDlg(false)

        },
        goDelTag: (tag:any)=>{
            setWillDelTag(tag)
            setConfirmDelDlgVisible(true)
        },
        confirmDelTag: async()=>{
            const result:any = await dispatch(tagThunks.delTag({id:willDelTag.id}))
            setConfirmDelDlgVisible(false)
            if(result){
                dispatch(tagThunks.listTags())
                effToast.success_withdraw(`成功将标签${willDelTag.name}放入回收站`, response.withdrawDelTag)
            }
            console.log()
        },
        withdrawDelTag: async()=>{
            const result: any = await dispatch(tagThunks.withdrawTag({id:willDelTag.id}))
            if(result){
                dispatch(tagThunks.listTags())
                effToast.success('撤销成功')
            }
        }
    }
    return (
        <div>
            <div className="d-flex justify-start mt40">
                <h1>标签可用于为需求，功能，任务，测试用例等条目自定义标记</h1>
            </div>
            <div className="d-flex align-center mt20">
                {tags.map((item:any)=><ElgoTag onDel={()=>response.goDelTag(item)} onEdit={()=>response.goEditTag(item)} className="mr10" editable={true} delAble={true} key={item.id} name={item.name} color={item.color}/>)}
                 <PlusCircleOutlined onClick={()=>setShowTagDlg(true)} className="ml20 cursor-pointer" style={{color:globalColor.fontWeak, fontWeight:200, fontSize:'20px'}} />
            </div>
            <TagDialog tag={editTag} visible={showTagDlg} onClose={()=>setShowTagDlg(false)} onAdd={response.onAddTag} onEdit={response.onEditTag}/>
            <EffConfirmDlg className="mt40"  visible={confirmDelDlgVisible}>
                <div className="d-flex-column">
                    <div className="d-flex-column">
                        <span>确定将标签“{willDelTag && willDelTag!.name}”放入回收站</span>
                    </div>
                    <div className="mt10 d-flex justify-end">
                        <EffButton onClick={()=>setConfirmDelDlgVisible(false)}   round={true} key={"cancel"} text={"取消"}/>
                        <EffButton onClick={response.confirmDelTag}   className="mr10 ml10" type={"filled"} key={"confirm"} text={"确定"} round={true}/>
                    </div>
                </div>
            </EffConfirmDlg>
        </div>
    )
}
