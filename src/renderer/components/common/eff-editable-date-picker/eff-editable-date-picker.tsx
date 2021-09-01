import React, {useState} from "react";
import {DatePicker, Form} from "antd";
import moment from "moment";
import './eff-editable-date-picker.less'

interface IProps{
    value?:string,
    placeholder?:string
    onChange:(value?:object)=>void
}

export default function EffEditableDatePicker(props:IProps){
    const {value, placeholder='未指定', onChange} = props

    console.log(value, " is the value")

    const [isHover, setIsHover] = useState(false);
    const [isEditing, setIsEditing] = useState(false)

    const response = {
        handleDateChange: (value:any)=>{
            onChange(value)
        }
    }

    return (
        <div   className={`${isHover||isEditing? 'show-status':'eff-editable-date-picker'}`}
               onMouseEnter={()=>setIsHover(true)}
               onMouseLeave={()=>setIsHover(false)}>
            <DatePicker value={value? moment(value):undefined}

                        onChange={response.handleDateChange}  allowClear={true} style={{width:'100%', height:'40px', minWidth:'200px'}}   size={"large"} placeholder={placeholder}  />
        </div>
    )
}
