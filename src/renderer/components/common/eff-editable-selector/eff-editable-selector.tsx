import React, {useEffect, useState} from "react";
import {Form, Select} from "antd";
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
    onSearch?:(value:string)=>void,        //搜索事件
    clear?:boolean,                        //是否允许删除
    searchAble?:boolean,                 //是否允许单选模式搜索
    size?:'large'|'small'|'middle'
}

export default function EffEditableSelector(props:IEffEditableSelectorProps){
    const {id, options, placeholder="请选择", onChange, clear=true, searchAble=false, onSearch, size='middle'} = props
    const [isHover, setIsHover] = useState(false);
    const [isEditing, setIsEditing] = useState(false)
    const [chosenId, setChosenId] = useState<string|number|undefined>(id)        //选中时显示的key
    const [optionsList, setOptionList] = useState<any>([])


    useEffect(()=>setChosenId(id), [id])
    useEffect(()=>{
        let opList = options.map(item=><Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>)
        setOptionList(opList)
    },[options])



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
            onChange(undefined)
        },

        handleSearch:(value:string)=>{
            if(onSearch){
                onSearch(value)
            }
        }
    }


    return (
        <div   className={`${isHover||isEditing? 'show-status':'eff-editable-selector'}`}
               onMouseEnter={()=>setIsHover(true)}
               onMouseLeave={()=>setIsHover(false)}>

            <Select onClear={response.handlerClearSelection}
                    showSearch={searchAble}
                    defaultActiveFirstOption={false}
                    allowClear={clear}
                    placeholder={placeholder}
                    value={chosenId} onBlur={response.handleSelectBlur}
                    onSearch={searchAble? response.handleSearch:undefined}
                    onChange={response.handleSelectChange}
                    style={{ minWidth: 200 }}
                    onFocus={()=>setIsEditing(true)}
                    filterOption={false}
                    notFoundContent={null}
                    suffixIcon={<CaretDownOutlined/>}>
                {optionsList}
            </Select>

        </div>
    )
}
