import React from "react";
import {Input, Popover} from "antd";
import {SearchOutlined} from '@ant-design/icons'
import IconTagCheck from '@imgs/tag-check.png'

import EffButton from "../../eff-button/eff-button";
import './eff-tag-selector.less'

interface IEffTagSelectorProps{
    tags: any[],
    chosen: number[],   //选中的tag id 数组
    onChange:Function,  //选择改变响应
    [x:string]:any
}

export default function EffTagSelector(props:IEffTagSelectorProps){

    const {tags,chosen, onChange, ...rest} = props

    return (
        <Popover {...rest} placement="bottomLeft" content={<TagSelectDlg onChange={onChange} chosen={chosen} tags={tags}/>} trigger={'click'}>
            <div className="btn-tag-selector">添加标签</div>
        </Popover>
    )
}



function TagSelectDlg(props: IEffTagSelectorProps){
    const {tags, chosen, onChange} = props
    const response = {
        handleTagStatusChange: (id:number, isSelected:boolean)=>{
            let tempChosen = Object.assign([], chosen)
            if(isSelected){
                tempChosen.push(id)
            }else{
                const index = tempChosen.indexOf(id)
                tempChosen.splice(index, 1)
            }
            onChange(tempChosen)
        }
    }

    const ui = {
        uiTags : tags.map(item=><Tag key={item.id} onChange={response.handleTagStatusChange} selected={chosen.includes(item.id)} name={item.name} id={item.id} color={item.color} />)
    }

    return (
        <div className="eff-tag-selector">
            <div>
                <span>选择标签</span>
            </div>

            <Input placeholder={'搜索标签'} prefix={<SearchOutlined style={{color:'#999999'}} />} className="mt10 mb20"/>
            {ui.uiTags}
        </div>
    )
}


function Tag(props:any){
    const {name, id, color, selected, onChange} = props

    const response = {
        handleTagClicked: ()=>{
            onChange(id, !selected)
        }
    }

    return (
        <div className="eff-tag" onClick={response.handleTagClicked}>
            <div className="tag-name">
                <div className="tag-cycle" style={{borderColor:color, backgroundColor:color}}/>
                <span className="ml5">{name}</span>
            </div>
            {selected && <img src={IconTagCheck} width={14}/>}
        </div>
    )
}