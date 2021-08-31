import React, {useState} from "react";
import './eff-tasks.less'
import {Col, DatePicker, Form, Input, Row, Select, Space} from "antd";
import EffTagArea from "../../components/common/eff-tag-area/eff-tag-area";
import EffTagSelector from "../../components/common/eff-tag-selector/eff-tag-selector";
import EffEditor from "../../components/common/eff-editor/eff-editor";
import EffButton from "../../components/eff-button/eff-button";
import {CaretDownOutlined} from '@ant-design/icons'
import {useSelector} from "react-redux";
import {RootState} from "../../store/store";
import {PRIORITY} from "@config/sysConstant";


interface ITask{
    name:string
}

interface IProps{
    tags:any[],
    onCancel:Function,
    onConfirm:(task:ITask)=>void
}

interface ITaskData{
    name:string,
    handlerId?:number,
    tagIds?:number[],
    description?:string,
    deadline?:Date,
    priority:string,
}


export default function AddTaskForm(props:IProps){
    const {tags, onConfirm, onCancel } = props

    const [taskForm] = Form.useForm()
    const [selectedTagIds, setSelectedTagIds] = useState<number[]>([])
    const [selectedTags, setSelectedTags] = useState<any[]>([])
    const data = {
        members: useSelector((state:RootState)=>state.project.projectDetail.members?state.project.projectDetail.members:[])
    }

    const ui = {
        memberOptions: data.members.map((item:any)=><Select.Option key={item.orgMemberId} value={item.orgMemberId}>{item.name}</Select.Option>),
        priorityOptions: [] as any[]
    }
    for(let item in PRIORITY){
        ui.priorityOptions.push(<Select.Option key={PRIORITY[item].key} value={PRIORITY[item].key}>{PRIORITY[item].name}</Select.Option>)
    }


    const response = {
        occupy: ()=>{},

        handleAddTask: async ()=>{
            let values = await taskForm.validateFields()
            let taskData:ITaskData = Object.assign({},values)
            taskData.tagIds = selectedTagIds
            onConfirm(taskData)
            console.log(taskData, " are values")
        },
        handleTagsChanged: (tagIds:number[])=>{
            setSelectedTagIds(tagIds)
            let selectTags = tags.filter(item=>tagIds.indexOf(item.id)>-1)
            setSelectedTags(selectTags)
        },
        //响应标签删除
        onDelTag: (id:number)=>{
            let currentIds = Object.assign([], selectedTagIds)
            let index = currentIds.indexOf(id)
            currentIds.splice(index, 1)
            response.handleTagsChanged(currentIds)

        },
    }

    return (
        <div className="eff-add-task-form">
            <div className="title  pb10 mb20">
                <span>新增任务</span>
            </div>
            <Form colon={false}  form={taskForm}  requiredMark={false} >
                <Form.Item name="name"  label={'任务名称'} rules={[{ required: true, message: '请输入任务名称' }]}>
                    <Input size={"large"}/>
                </Form.Item>

                <div className="d-flex justify-between mt20">
                    <Form.Item name="handlerId" style={{width:'50%'}}  label={'负责人'}>
                        <Select className="ml10" size={"large"}  suffixIcon={<CaretDownOutlined />}>
                            {ui.memberOptions}
                        </Select>
                    </Form.Item>

                    <Form.Item name="deadline"  style={{width:'50%', marginLeft:'60px'}} label={'截至日期'}>
                        <DatePicker allowClear={true} style={{width:'100%'}}   size={"large"} placeholder={''}  />
                    </Form.Item>

                </div>

                <div className="d-flex justify-between mt20">
                    <Form.Item name="priority" style={{width:'50%'}}  label={'优先级'}>
                        <Select defaultValue={'NONE'} className="ml10" size={"large"}  suffixIcon={<CaretDownOutlined />}>
                            {ui.priorityOptions}
                        </Select>
                    </Form.Item>

                    <Form.Item name="tagIds"  style={{width:'50%', marginLeft:'60px'}} label={'标签'}>
                        <div className="d-flex ml40">
                            <EffTagArea onDel={response.onDelTag} tags={selectedTags}/>
                            <EffTagSelector onChange={response.handleTagsChanged} chosen={selectedTagIds}  tags={tags}/>
                        </div>
                    </Form.Item>

                </div>


                <Form.Item  name="description" className="mt20 d-flex align-start" label={'任务描述'}>
                    <EffEditor height={360}/>
                </Form.Item>
            </Form>

            <div className="btn-group d-flex mt40">
                <EffButton type={"line"} round={true} className="mr20" onClick={response.occupy} text={'取消'} key={'cancel'}/>
                <EffButton type={'filled'} round={true} onClick={response.handleAddTask} text={'保存'} key={'confirm'}/>
            </div>
        </div>
    )

}
