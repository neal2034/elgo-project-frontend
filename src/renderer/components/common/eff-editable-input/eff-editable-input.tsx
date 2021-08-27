import React, {useEffect, useState} from "react";
import {Input} from "antd";
import globalColor from "@config/globalColor";
import './eff-editable-input.less'

interface IEffInputProps{
    value?:string,              //当前值
    placeholder?:string,        //占位符
    fontSize?:string,            //字体大小
    fontWeight?:number,  //字重
    errMsg?:string,
    isRequired?:boolean,         //是否必须
    className?:string,
    onChange:(newValue?:string)=>void, //更新事件

}

export default function EffEditableInput(props:IEffInputProps){
    const {value, placeholder='请输入', fontSize='24px', fontWeight=500, onChange, errMsg='请输入', isRequired=false, className} = props
    const [editValue, setEditValue] = useState(value)
    const [isHover, setIsHover] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [isShowError, setIsShowError] = useState(false)


    useEffect(()=>setEditValue(value), [value])
    const style = {
        input:{fontSize, fontWeight},
        emptyError: {
            fontSize:'14px',
            color:  globalColor.mainRed3
        }
    }

    const response = {
        //输入失焦事件
        handleInputBlur: ()=>{
            let shouldUpdateValue = editValue
            if(isRequired && !editValue){
                //如果值为必须，将重置当前值
                setEditValue(value)
                setIsShowError(false)
                shouldUpdateValue = value
            }
            onChange(shouldUpdateValue)
            setIsEditing(false)
        },
        valueChanged:(value?:string)=>{
            setEditValue(value)
            if(isRequired && !value){
                setIsShowError(true)
            }
            if(value){
                setIsShowError(false)
            }
        },
        handleFocus: ()=>{
            setIsEditing(true)
        }
    }

    return <div style={{height:'45px'}} className={`${isHover||isEditing? 'input-status':'eff-editable-input'} ${className}`} onMouseEnter={()=>setIsHover(true)} onMouseLeave={()=>setIsHover(false)}>
            <Input style={style.input}
                   onFocus={response.handleFocus}
                   onBlur={response.handleInputBlur}
                   placeholder={placeholder}
                   value={editValue}
                   onChange={(e:any)=>response.valueChanged(e.target.value)} />
            {isShowError&&<span style={style.emptyError}>{errMsg}</span>}
    </div>
}
