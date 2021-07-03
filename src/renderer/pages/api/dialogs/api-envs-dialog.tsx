import React, {useState} from "react";
import {Input, Modal, Form} from "antd";
import EffButton from "../../../components/eff-button/eff-button";
import './api-envs-dialog.less'
import EditableTable from "../sub-components/editable-table";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/store";
import {CloseOutlined} from '@ant-design/icons'
import {apiThunks} from "@slice/apiSlice";
import IconEdit from '@imgs/gray-edit.png'
import IconDel from '@imgs/delete.png'
import EffConfirmDlg from "../../../components/eff-confirm-dlg/eff-confirm-dlg";

interface IApiEnvsProps{
    visible:boolean,
    onClose: ()=>void
}

type DlgContent = 'list' | 'edit' | 'add'; //对话框类型

export default function ApiEnvsDlg(props:IApiEnvsProps){
    const {visible, onClose} = props
    const dispatch = useDispatch()
    const [title, setTitle] = useState<string>("环境管理")
    const [contentType, setContentType] = useState<DlgContent>("list")
    const [confirmDelDlgVisible, setConfirmDelDlgVisible] = useState(false)
    const [envsData, setEnvsData] = useState<any>([{key:0}])
    const [willDelEnv, setWillDelEnv] = useState<any>()
    const [willEditEnv, setWillEditEnv] = useState<any>() //记录将要删除的变量
    const envs:any  = useSelector((state:RootState)=>state.api.envs)
    const isEmpty = !envs || envs.length === 0

    const titleArea = <div  className="dlg-head font-title d-flex justify-between">
        {title}
        <CloseOutlined className="cursor-pointer" onClick={onClose} />
    </div>

    const varColumns = [
        {
            title:'',
            dataIndex: 'selected',
            selectable:true,
            width:'50px',
        },
        {
            title:'变量名',
            dataIndex: 'varName',
            editable:true,
            width: 200,
            ellipsis:true,
        },
        {
            title:'变量值',
            dataIndex: 'varValue',
            editable:true,
            delAction:true,         //该列显示删除操作
            width:400,
            ellipsis:true,
        }

    ]

    const [form] = Form.useForm();

    const valueChanged = (record:any, dataIndex:string, value:string|boolean)=>{
        const index = envsData.findIndex((item:any)=>item.key === record.key)
        const tmpEnvsData = Object.assign([], envsData)
        const item = envsData[index]
        if(dataIndex!=='selected' && item.selected===undefined){
            //若当前行未曾选中过， 且当前修改列不是选中列，则除了将值并入外，再将当且列置为选中
            tmpEnvsData.splice(index, 1, {...item, ...{[dataIndex]:value, selected:true}})
        }else {
            tmpEnvsData.splice(index, 1, {...item, ...{[dataIndex]:value}})
        }
        //如果编辑的是最后一行，则添加新的空白行
        if(index === tmpEnvsData.length-1){
            let lastKey = tmpEnvsData[tmpEnvsData.length-1].key
            tmpEnvsData.push({key:lastKey+1})
        }

        setEnvsData(tmpEnvsData)


    }
    const paramsDel = (record:any) =>{}


    const handler = {
        handleAddEnv : ()=>{
            setTitle("新增环境")
            setContentType('add')
        },
        cancelAddEnv: ()=>{
            setContentType('list')
        },
        confirmAddEnv: ()=>{
            form.validateFields().then(values => {
                let items:any = []
                envsData.map((env:any)=>{
                    if(env.selected!==undefined){
                        items.push({name:env.varName, value:env.varValue, used:env.selected})
                    }
                })
                if(contentType==='add'){
                    dispatch(apiThunks.addApiEnv(values.name, items))
                }else{
                    dispatch(apiThunks.editApiEnv(values.name, items, willEditEnv!.id))
                }

                setContentType('list')
            })

        },
        delEnv: (item:any)=>{
            setWillDelEnv(item)
            setConfirmDelDlgVisible(true)
        },
        confirmDelEnv:  ()=>{
            dispatch(apiThunks.delApiEnv(willDelEnv.id))
            setConfirmDelDlgVisible(false)
        },
        goEditEnv: (env:any)=>{
            setTitle('编辑环境')
            setWillEditEnv(env)
            setContentType('edit')
            form.setFieldsValue({name:env.name})
            let tmpEnvDatas:any = []
            env.envItems.map((item:any, index:number)=>{
                tmpEnvDatas.push({
                    key:index,
                    varName:item.name,
                    varValue:item.value,
                    selected:item.used
                })
            })
            tmpEnvDatas.push({key:env.envItems.length})
            setEnvsData(tmpEnvDatas)
        }
    }


    const ui = {
        //添加或者编辑环境表格内容
        envContentForm:(
            <div className="d-flex-column">
                <Form form={form}>
                    <Form.Item name="name" rules={[{ required: true, message: '请输入环境名称' }]}>
                        <Input placeholder={"环境名称"} className="mb10"/>
                    </Form.Item>
                </Form>
                <EditableTable valueChange={valueChanged} valueDel={paramsDel}  columns={varColumns} dataSource={envsData} />
                <div className="mt20 self-flex-end">
                    <EffButton onClick={handler.cancelAddEnv}  round={true} key={"cancel"} text={"取消"}/>
                    <EffButton onClick={handler.confirmAddEnv} className="ml10" round={true} type={"filled"}  key={"ok"} text={"确定"}/>
                </div>
            </div>
        ),

        envListContent: <div className="d-flex-column">
            {envs.map((item:any)=>
                <div key={item.id} className="d-flex mb10 justify-between env-item">
                    <span>{item.name}</span>
                    <div className="d-flex">
                        <div onClick={()=>handler.goEditEnv(item)} className="cursor-pointer">
                            <img src={IconEdit} width={14} />
                            <span className="ml5">编辑</span>
                        </div>
                        <div onClick={()=>handler.delEnv(item)} className="ml10 cursor-pointer">
                            <img src={IconDel} width={14} />
                            <span className="ml5">删除</span>
                        </div>
                    </div>
                </div>
            )}
            <EffButton onClick={handler.handleAddEnv} className="btn-add self-flex-end mr40" round={true} type={"filled"}  key={"add"} text={"添加"}/>
        </div>,

        noEnvContent:  (<div className="no-env">
            <div>环境是一组变量的集合，可以在定义API的过程中引用，方便在不同的开发或者域名环境下进行切换</div>
            <div className="mt10">点击下方“<span className="add-text">添加</span>”按钮创建环境</div>
            <EffButton onClick={handler.handleAddEnv} className="btn-add" round={true} type={"filled"}  key={"add"} text={"添加"}/>
        </div>)
    }

    return ( <Modal width={700} className="api-envs-dialog" title={titleArea} footer={null}   destroyOnClose={true} closable = {false} visible={visible}>
        {contentType==='list' ? (isEmpty? ui.noEnvContent: ui.envListContent) : ui.envContentForm}
        <EffConfirmDlg className="mt40"  visible={confirmDelDlgVisible}>
            <div className="d-flex-column">
                <div className="d-flex-column">
                    <span>确定将环境“{willDelEnv && willDelEnv.name}”放入回收站</span>
                </div>
                <div className="mt10 d-flex justify-end">
                    <EffButton onClick={()=>setConfirmDelDlgVisible(false)}   round={true} key={"cancel"} text={"取消"}/>
                    <EffButton onClick={handler.confirmDelEnv}   className="mr10 ml10" type={"filled"} key={"confirm"} text={"确定"} round={true}/>
                </div>
            </div>
        </EffConfirmDlg>
    </Modal>)

}
