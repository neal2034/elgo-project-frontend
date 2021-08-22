import React, {useState} from "react";
import {Input} from "antd";
import globalColor from "@config/globalColor";

interface IEffInputProps{
    value?:string,
    placeholder?:string,
    fontSize?:string
    fontWeight?:number,
    errMsg?:string,
    isRequired?:boolean
    onChange:(newValue?:string)=>void
}

export default function EffEditableInput(props:IEffInputProps){
    const {value, placeholder='请输入', fontSize='24px', fontWeight=500, onChange, errMsg='请输入', isRequired=false} = props
    const [editValue, setEditValue] = useState(value)
    const [isHover, setIsHover] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [isShowError, setIsShowError] = useState(false)
    const fontStyle = {fontSize, fontWeight}
    const stylePlaceholder = {
        color:globalColor.fontWeak,
        fontSize
    }
    const styleError = {
        fontSize:'14px',
        color:  globalColor.mainRed3
    }

    const response = {
        handleInputBlur: ()=>{
            if(isRequired && !editValue){
                setEditValue(value)
                setIsShowError(false)
            }
            onChange(editValue)
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
        }
    }

    return <div className="eff-editable-input" onMouseEnter={()=>setIsHover(true)} onMouseLeave={()=>setIsHover(false)}>
        {isHover||isEditing?
            <div>
                <Input style={fontStyle} onFocus={()=>setIsEditing(true)} onBlur={response.handleInputBlur}
                       placeholder={placeholder} value={editValue} onChange={(e:any)=>response.valueChanged(e.target.value)} />
                {isShowError&&<span style={styleError}>{errMsg}</span>}
            </div>
            :editValue? <span style={fontStyle}>{editValue}</span>:<span style={stylePlaceholder} className="placeholder">{placeholder}</span>}
    </div>
}
