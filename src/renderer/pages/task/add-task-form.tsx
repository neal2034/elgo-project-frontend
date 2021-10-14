import React, {useEffect, useState} from "react";
import './eff-tasks.less'
import {DatePicker, Form, Input, Select} from "antd";
import EffTagArea from "../../components/common/eff-tag-area/eff-tag-area";
import EffTagSelector from "../../components/common/eff-tag-selector/eff-tag-selector";
import EffButton from "../../components/eff-button/eff-button";
import {CaretDownOutlined} from '@ant-design/icons'
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store/store";
import {PRIORITY} from "@config/sysConstant";
import {taskThunks} from "@slice/taskSlice";
import ReactElgoEditor from "@components/common/react-elgo-editor/react-elgo-editor";


interface ITask{
    name:string
}

interface IProps{
    tags:any[],
    funztion?:any,
    onCancel:()=>void,
    onConfirm:(task:ITask)=>void
}

interface ITaskData{
    name:string,
    handlerId?:number,
    tagIds?:number[],
    description?:string,
    deadline?:Date,
    priority:string,
    taskListId?:number
}


export default function AddTaskForm(props:IProps){
    const dispatch = useDispatch()
    const {tags, onConfirm, onCancel,funztion} = props
    const [taskForm] = Form.useForm()
    const [selectedTagIds, setSelectedTagIds] = useState<number[]>([])
    const [selectedTags, setSelectedTags] = useState<any[]>([])
    const taskGroups = useSelector((state:RootState)=>state.task.groups)
    const members = useSelector((state:RootState)=>state.project.projectDetail.members?state.project.projectDetail.members:[])


    useEffect(()=>{
        if(funztion){
            dispatch(taskThunks.listTaskGroup())
            taskForm.setFieldsValue({
                'name': '完成功能:' + funztion.name
            })
        }
    },[])

    const ui = {
        memberOptions: members.map((item:any)=><Select.Option key={item.orgMemberId} value={item.orgMemberId}>{item.name}</Select.Option>),
        priorityOptions: [] as any[],
    }
    for(const item in PRIORITY){
        ui.priorityOptions.push(<Select.Option key={PRIORITY[item].key} value={PRIORITY[item].key}>{PRIORITY[item].name}</Select.Option>)
    }

    useEffect(()=>{
        if(taskGroups && taskGroups.length>0){
            //更新任务分组
            taskForm.setFieldsValue({
                'taskListId':taskGroups[0].id
            })
        }
    },[taskGroups])




    const response = {
        handleAddTask: async ()=>{
            const values = await taskForm.validateFields()
            const taskData:ITaskData = Object.assign({},values)
            taskData.tagIds = selectedTagIds
            onConfirm(taskData)
            taskForm.resetFields();

        },
        handleTagsChanged: (tagIds:number[])=>{
            setSelectedTagIds(tagIds)
            const selectTags = tags.filter(item=>tagIds.indexOf(item.id)>-1)
            setSelectedTags(selectTags)
        },
        //响应标签删除
        onDelTag: (id:number)=>{
            const currentIds = Object.assign([], selectedTagIds)
            const index = currentIds.indexOf(id)
            currentIds.splice(index, 1)
            response.handleTagsChanged(currentIds)

        },
        handleCancelAdd: ()=>{
            onCancel()
        }
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
                    <Form.Item  name="priority" style={{width:'50%'}}  label={'优先级'}>
                        <Select  className="ml10" size={"large"}  suffixIcon={<CaretDownOutlined />}>
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



                {funztion &&  <div className="d-flex justify-between mt20">
                    <Form.Item  name="taskListId" style={{width:'50%'}}  label={'任务分组'}>
                        <Select size={"large"}  suffixIcon={<CaretDownOutlined />}>
                            {taskGroups.map((item:any)=><Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>)}
                        </Select>
                    </Form.Item>

                    <Form.Item  style={{width:'50%', marginLeft:'30px'}}>
                    {/*仅用来layout 占位*/}
                    </Form.Item>
                </div>}


                <Form.Item  name="description" className="mt20 d-flex align-start" label={'任务描述'}>
                    <ReactElgoEditor height={360}/>
                </Form.Item>
            </Form>

            <div className="btn-group d-flex mt40">
                <EffButton type={"line"} round={true} className="mr20" onClick={response.handleCancelAdd} text={'取消'} key={'cancel'}/>
                <EffButton type={'filled'} round={true} onClick={response.handleAddTask} text={'保存'} key={'confirm'}/>
            </div>
        </div>
    )

}
