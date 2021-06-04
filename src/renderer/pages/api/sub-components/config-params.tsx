import React, {useState} from "react";
import EditableTable from "./editable-table";
import {API, ApiParams, updateCurrentApi} from "@slice//apiSlice";
import {useDispatch} from "react-redux";

interface ApiProps{
    api: API
}

export default function ConfigParams(props:ApiProps){
    const dispatch = useDispatch();
    let {api} = props
    const columns = [
        {
            title:'',
            dataIndex: 'selected',
            selectable:true,
        },
        {
            title:'KEY',
            dataIndex: 'paramKey',
            editable:true,
        },
        {
            title:'VALUE',
            dataIndex: 'paramValue',
            editable:true,
        },
        {
            title:'描述',
            dataIndex: 'description',
            editable:true,
            delAction:true,         //该列显示删除操作
        },
    ]
    const valueChanged = (record:any, dataIndex:string, value:string|boolean)=>{
        const index = api.params.findIndex((item:ApiParams)=>item.key === record.key)
        const tmpParams = Object.assign([], api.params)
        const item = api.params[index]
        if(dataIndex!=='selected' && item.selected===undefined){
            tmpParams.splice(index, 1, {...item, ...{[dataIndex]:value, selected:true}})
        }else{
            tmpParams.splice(index, 1, {...item, ...{[dataIndex]:value}})
        }
        //如果编辑的是最后一行，则添加新的空白行
        if(index === api.params.length-1){
            let lastKey = api.params[api.params.length-1].key
            tmpParams.push({key:lastKey+1})
        }

        dispatch(updateCurrentApi({params:tmpParams}))
    }


    const paramsDel = (record:any) =>{
        const index = api.params.findIndex((item:ApiParams)=>item.key === record.key)
        const tmpParams = Object.assign([], api.params)
        tmpParams.splice(index, 1)
        dispatch(updateCurrentApi({params:tmpParams}))
    }

    return (
        <div>
            <EditableTable valueChange={valueChanged} valueDel={paramsDel}  columns={columns} dataSource={api.params}/>
        </div>
    )
}
