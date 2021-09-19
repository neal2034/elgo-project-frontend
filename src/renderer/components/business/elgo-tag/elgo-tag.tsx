import React from "react";
import globalColor from "@config/globalColor";
import {CloseCircleOutlined,FormOutlined} from '@ant-design/icons'
import './elgo-tag.less'

interface IProps{
    name:string,
    color?:string,
    editable?:boolean,
    className?:string,
    onEdit?:()=>void,
    delAble?:boolean,
    onDel?:()=>void
}
export default function ElgoTag(props:IProps){
    const {className, name, color='#6F7782', editable=false, delAble=false} = props
    const  response = {
        onEdit: ()=>{
            if(props.onEdit){
                props.onEdit()
            }
        },
        onDel: ()=>{
            if(props.onDel){
                props.onDel()
            }
        }
    }

    return (
        <div style={{
            border: '1px solid ' + color,
            borderRadius:'5px',
            padding: '15px',
            fontSize:'12px',
            height: '20px',
            color: color,
        }} className={`d-flex elgo-tag justify-center align-center ${editable? 'cursor-pointer':''} ${className}`}>
            {name}
            {editable &&  <FormOutlined onClick={response.onEdit} className="close ml10" style={{fontSize:'15px', fontWeight:500, color:globalColor.mainRed3}} />}
            {delAble &&  <CloseCircleOutlined onClick={response.onDel} className="close ml10" style={{fontSize:'15px', fontWeight:500, color:globalColor.mainRed3}} />}
        </div>
    )
}
