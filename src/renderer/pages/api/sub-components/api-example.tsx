import React from "react";
import {CaretDownOutlined} from '@ant-design/icons'
import {API} from "@slice/apiSlice";
import {Popover} from "antd";
import './api-example.less'
import {apiActions} from "@slice/apiSlice";
import IconEdit from '@imgs/pen-edit.png'
import IconRemove from '@imgs/remove.png'
import {useDispatch} from "react-redux";


interface IApiProps{
    api: API
}


export default function ApiExample(props:IApiProps){
    const {examples=[]} = props.api
    const dispatch = useDispatch()
    const apiNum = examples.length
    const handler = {
        editExample: (example:any)=>{
            dispatch(apiActions.editApiExample(example))
        }
    }
    const content = examples.map((example:any)=>{
      return (<div className="api-example cursor-pointer d-flex justify-between" key={example.id}>
            <span className="ml10">{example.name}</span>
            <div className="d-flex actions">
                <img onClick={()=>handler.editExample(example)} src={IconEdit} width={14} />
                <img src={IconRemove} className="ml5 mr10" width={14} />
            </div>
        </div>)
    })
    return (
        <div className="api-examples">
            示例({apiNum})
            <Popover content={content} placement="bottomLeft" trigger={"click"}>
                <CaretDownOutlined />
            </Popover>

        </div>
    )
}
