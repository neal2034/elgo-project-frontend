import React from "react";
import {API, ApiHeaderItem, apiActions} from "@slice/apiSlice";
import EditableTable from "./editable-table";
import {useDispatch} from "react-redux";


interface IApiProps{
    api: API
}

const headerTableColumns = [
    {
        title:'',
        dataIndex: 'selected',
        selectable:true,
    },
    {
        title:'KEY',
        dataIndex: 'headerKey',
        editable:true,
    },
    {
        title:'VALUE',
        dataIndex: 'headerValue',
        editable:true,
    },
    {
        title:'描述',
        dataIndex: 'description',
        editable:true,
        delAction:true,         //该列显示删除操作
    },
]





export default function ConfigHeader(props:IApiProps){
    const {api} = props
    const dispatch = useDispatch()

    const handler = {
        valueChanged:(record:any, dataIndex:string, value:string|boolean)=>{
            const index = api.headers.findIndex((item:ApiHeaderItem)=>item.key === record.key)
            const tmpHeaders = Object.assign([], api.headers)
            const item = api.headers[index]
            if(dataIndex!=='selected' && item.selected===undefined){
                tmpHeaders.splice(index, 1, {...item, ...{[dataIndex]:value, selected:true}})
            }else{
                tmpHeaders.splice(index, 1, {...item, ...{[dataIndex]:value}})
            }
            //如果编辑的是最后一行，则添加新的空白行
            if(index === api.headers.length-1){
                const lastKey = api.headers[api.headers.length-1].key
                tmpHeaders.push({key:lastKey+1})
            }

            dispatch(apiActions.updateCurrentApi({headers:tmpHeaders}))
        },
        headerDel:(record:any) =>{
            const index = api.headers.findIndex((item:ApiHeaderItem)=>item.key === record.key)
            const tmpHeaders = Object.assign([], api.headers)
            tmpHeaders.splice(index, 1)
            dispatch(apiActions.updateCurrentApi({headers:tmpHeaders}))
        }
    }


    return  (
        <div>
            <div>
                <EditableTable valueChange={handler.valueChanged} valueDel={handler.headerDel}  columns={headerTableColumns} dataSource={api.headers}/>
            </div>
        </div>
    )
}
