import React, {useEffect, useState} from "react";
import EffEditableInput from "../../components/common/eff-editable-input/eff-editable-input";
import EffActions from "../../components/business/eff-actions/eff-actions";
import EffItemInfo from "../../components/business/eff-item-info/eff-item-info";
import EffInfoSep from "../../components/business/eff-info-sep/eff-info-sep";
import {DeleteOutlined} from '@ant-design/icons'
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store/store";
import EffLabel from "../../components/business/eff-label/EffLabel";
import EffEditableSelector from "../../components/common/eff-editable-selector/eff-editable-selector";
import {taskThunks} from "@slice/taskSlice";
import {PRIORITY, TASK_STATUS} from "@config/sysConstant";
import EffEditableDatePicker from "../../components/common/eff-editable-date-picker/eff-editable-date-picker";
import EffTagArea from "../../components/common/eff-tag-area/eff-tag-area";
import EffTagSelector from "../../components/common/eff-tag-selector/eff-tag-selector";
import {tagThunks} from "@slice/tagSlice";
import EffEditableDoc from "../../components/common/eff-editable-doc/eff-editable-doc";


interface IProps{
    onDel:(id:number, taskGroupId:number)=>void,
    projectMembers?:any,
}


export default function TaskDetail(props:IProps){
    const {onDel} = props
    const dispatch = useDispatch()
    const [memberOptions, setMemberOptions] = useState<any[]>([])
    const [selectedTags, setSelectedTags] = useState<any[]>([])

    const data = {
        menuItems:[{key:'delete', name:'删除任务', icon:<DeleteOutlined style={{fontSize:'14px'}}/>}],
        allTags: useSelector((state:RootState)=>state.tag.tags),
        members: useSelector((state:RootState)=>state.project.projectDetail.members),
        projectMembers: useSelector((state:RootState)=>state.project.projectMembers),
        currentTask: useSelector((state:RootState)=>state.task.currentTask)
    }



    const priorityOptions = []
    for(const item in PRIORITY){
        priorityOptions.push({id:PRIORITY[item].key, name:PRIORITY[item].name})
    }
    const taskStatusOptions = []
    for(const item in TASK_STATUS){
        taskStatusOptions.push({id:TASK_STATUS[item].key, name:TASK_STATUS[item].name})
    }

    useEffect(()=>{
        let members = []
        if( data.projectMembers && data.projectMembers.length>0){
            members = data.projectMembers
        }else{
            members = data.members? data.members:[]
        }

        const options:any[] = []
        members.forEach(item=>{
            options.push({
                id:item.orgMemberId,
                name:item.name
            })
        })
        setMemberOptions(options)
    },[data.members,data.projectMembers])


    useEffect(()=>{
        dispatch(tagThunks.listTags())
    },[])


    useEffect(()=>{
        const tagIds = data.currentTask.tagIds? data.currentTask.tagIds:[]
        const selectTags = data.allTags.filter((item:any)=>tagIds.indexOf(item.id)>-1)
        setSelectedTags(selectTags)
    }, [data.currentTask.tagIds])


    const response = {
        handleHandlerChange:(handlerId?:number|string)=>{
            dispatch(taskThunks.editTaskHandler(data.currentTask.id, handlerId as (number|undefined)))
            dispatch(taskThunks.listTask(data.currentTask.taskListId))
        },
        handleEditTaskName: async (name?:string)=>{
            await dispatch(taskThunks.editTaskName(data.currentTask.id, name!))
            dispatch(taskThunks.listTask(data.currentTask.taskListId))
        },
        handleEditTaskPriority: async (priority?: number|string)=>{
            await dispatch(taskThunks.editTaskPriority(data.currentTask.id, priority as string))
            dispatch(taskThunks.listTask(data.currentTask.taskListId))
        },

        handleEditTaskStatus: async (status?:number|string)=>{
            await dispatch(taskThunks.editTaskStatus(data.currentTask.id, status as string))
            dispatch(taskThunks.listTask(data.currentTask.taskListId))
        },

        handleEditDeadline: async (deadline?:any)=>{
            const value = deadline? deadline.format('YYYY-MM-DD 00:00:00'):undefined
            await  dispatch(taskThunks.editTaskDeadline(data.currentTask.id, value))
            dispatch(taskThunks.getTaskDetail(data.currentTask.id))
            dispatch(taskThunks.listTask(data.currentTask.taskListId))

        },
        onTagsChanged: async (ids:any)=>{
            await dispatch(taskThunks.editTaskTags(data.currentTask.id, ids))
            dispatch(taskThunks.getTaskDetail(data.currentTask.id))
        },
        //tags area 标签删除响应
        delTag: (id:number)=>{
            const currentIds = Object.assign([], data.currentTask.tagIds)
            const index = currentIds.indexOf(id)
            currentIds.splice(index, 1)
            response.onTagsChanged(currentIds)
        },
        handleDesChange: async (description?:string)=>{
            await  dispatch(taskThunks.editTaskDes(data.currentTask.id, description))
            dispatch(taskThunks.getTaskDetail(data.currentTask.id))
        },
        //菜单选择响应
        menuSelected:(key:string)=>{
            if(key=='delete'){
                onDel(data.currentTask.id, data.currentTask.taskListId)
            }
        }


    }


    return (
        <div className="pt40 pl40 pr40 pb40">
            <div className="d-flex justify-between align-center">
                <EffEditableInput errMsg={'请输入任务名称'} className="flex-grow-1" isRequired={true} onChange={response.handleEditTaskName} value={data.currentTask.name} placeholder={'请输入任务名称'} />
                <EffActions onSelect={response.menuSelected} menus={data.menuItems} className="ml40"  width={'30px'}/>
            </div>
            <EffItemInfo className="ml10" serial={data.currentTask.serial} creator={data.currentTask.creatorDto && data.currentTask.creatorDto.name}/>
            <EffInfoSep className="mt20 ml10" name={'基础信息'} />
            <div style={{marginLeft:'60px'}}>
                <div className="d-flex align-center mt20">
                    <EffLabel name={'负责人'}/>
                    <EffEditableSelector id={data.currentTask.handlerDto && data.currentTask.handlerDto.id} options={memberOptions} onChange={response.handleHandlerChange}/>
                </div>

                <div className="d-flex align-center mt20">
                    <EffLabel name={'优先级'}/>
                    <EffEditableSelector clear={false} id={data.currentTask.priority} options={priorityOptions} onChange={response.handleEditTaskPriority}/>
                </div>

                <div className="d-flex align-center mt20">
                    <EffLabel name={'截至日期'}/>
                    <EffEditableDatePicker onChange={response.handleEditDeadline} value={data.currentTask.deadline} />
                 </div>

                <div className="d-flex align-center mt20">
                    <EffLabel name={'任务状态'}/>
                    <EffEditableSelector clear={false} id={data.currentTask.status} options={taskStatusOptions} onChange={response.handleEditTaskStatus}/>
                </div>

                <div className="d-flex align-center mt20">
                    <EffLabel name={'标签'}/>
                    <div className="d-flex ml10">
                        <EffTagArea onDel={response.delTag} tags={selectedTags}/>
                        <EffTagSelector onChange={response.onTagsChanged}
                                        chosen={data.currentTask.tagIds? data.currentTask.tagIds:[]}
                                        tags={data.allTags}/>


                    </div>
                </div>


            </div>

            <EffInfoSep className="mt40 ml10" name={'任务描述'} />
            <div className="ml20 mt20 pr40" >
                <EffEditableDoc onSave={response.handleDesChange} height={'400px'} className="ml40 mt20" content={data.currentTask.description}/>
            </div>
        </div>
    )

}
