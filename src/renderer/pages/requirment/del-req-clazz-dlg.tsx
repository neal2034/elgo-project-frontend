import React from "react";
import EffButton from "../../components/eff-button/eff-button";
import './requirment.less'

interface IDelReqClazzDlgProps{
    name:string,
    onCancel:()=>void,
    onConfirm:()=>void
}

export default function DelReqClazzDlg(props:IDelReqClazzDlgProps){
    const {name, onCancel, onConfirm} = props
    return (
        <div className="del-req-clazz-dlg d-flex-column">
           <div className="title">
               删除需求分类
           </div>
            <span className="mt20 message">
                确定删除需求分类&quot{name}&ldquo?<br/>
                删除后对应需求将被标记为未分类.
            </span>
            <div className="mt20 d-flex justify-end">
                <EffButton onClick={onCancel} width={80} text={'取消'} key={'cancel'} round={true} type={'line'} />
                <EffButton onClick={onConfirm} width={80} className="ml10" text={'删除'}  key={'delete'} round={true} type={'filled'} />
            </div>
        </div>
    )
}
