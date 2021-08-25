import React, {useEffect, useState} from "react";
import {Select} from "antd";
import {CaretDownOutlined} from '@ant-design/icons'
import './eff-editable-selector.less'


type SelectOption = {
    id: number|string,
    name: string,
    [x:string]:any
}

interface IEffEditableSelectorProps{
    id?:string|number,                     //选中item 的id
    options:SelectOption[],                //选项列表
    placeholder?:string,                   //选择器placeholder
    onChange:(id?:string|number)=>void,    //更新事件
    clear?:boolean,                        //是否允许删除
}

export default function EffEditableSelector(props:IEffEditableSelectorProps){
    const {id, options, placeholder="请选择", onChange, clear=true} = props
    const [isHover, setIsHover] = useState(false);
    const [isEditing, setIsEditing] = useState(false)
    const [chosenId, setChosenId] = useState<string|number|undefined>(id)        //选中时显示的key

    useEffect(()=>setChosenId(id), [id])

    const ui = {
        optionsList: options.map(item=><Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>)
    }

    const response = {
        handleSelectBlur: ()=>{
            setIsEditing(false)
            onChange(chosenId)
        },

        //选择器change响应
        handleSelectChange:(theKey:any)=>{
            setChosenId(theKey)
        },

        handlerClearSelection: ()=>{
            setChosenId(undefined)
        }
    }


    return (
        <div   className={`${isHover||isEditing? 'show-status':'eff-editable-selector'}`}
               onMouseEnter={()=>setIsHover(true)}
               onMouseLeave={()=>setIsHover(false)}>

            <Select onClear={response.handlerClearSelection}
                    allowClear={clear}
                    placeholder={placeholder}
                    value={chosenId} onBlur={response.handleSelectBlur}
                    onChange={response.handleSelectChange}
                    style={{ minWidth: 200 }}
                    onFocus={()=>setIsEditing(true)}
                    suffixIcon={<CaretDownOutlined/>}>
                {ui.optionsList}
            </Select>


        </div>
    )
}
