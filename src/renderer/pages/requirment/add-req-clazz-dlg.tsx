import React, {useState} from "react";
import './requirment.less'
import {Input} from "antd";
import EffButton from "../../components/eff-button/eff-button";


interface IReqClazzDlgProps{
    isAdd:boolean,  //是否为添加对话框 true 添加  false 修改
    name?:string,
    onCancel:()=>void,
    onConfirm:(name:string)=>void


}


export default function AddReqClazzDlg(props:IReqClazzDlgProps){
    const {isAdd, name, onCancel, onConfirm} = props
    const [clazzName, setClazzName] = useState<string>(name!)
    const data = {
        title: isAdd? '新增需求分类':'修改需求分类'
    }
    const response = {
        confirmAdd: (name:string)=>{
            onConfirm(name)
            setClazzName('')
        }
    }
    return (
        <div className="add-req-clazz-dlg d-flex-column">
            <div className="title pb10">
                <span>{data.title}</span>
            </div>
            <Input value={clazzName} onChange={(e:any)=>setClazzName(e.target.value.trim())}  className="mt20" placeholder={'分类名称'} />
            <div className="mt20 d-flex justify-end">
                <EffButton onClick={onCancel} width={80} round={true} text={'取消'} key={'cancel'} type={"line"}/>
                <EffButton onClick={()=>response.confirmAdd(clazzName)} disabled={!clazzName} className="ml10" width={80} round={true} text={'保存'} key={'save'} type={'filled'}/>
            </div>
        </div>
    )
}
