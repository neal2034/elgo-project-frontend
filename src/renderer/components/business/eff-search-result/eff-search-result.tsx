import React from "react";
import './eff-search-result.less'
import {CloseOutlined} from '@ant-design/icons'

/**
 * 该组件用于表达搜索结果
 */
interface IProps{
    value:number,
    onClose:()=>void
}
export default function EffSearchResult(props:IProps){
    const {value, onClose} = props

    return <div className="eff-search-result">
        共<span className="search-num">{value}</span>条记录 <CloseOutlined onClick={()=>onClose()} className="close" />
    </div>
}
