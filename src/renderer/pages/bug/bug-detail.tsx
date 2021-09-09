import React, {useEffect, useState} from "react";
import EffEditableInput from "@components/common/eff-editable-input/eff-editable-input";
import EffActions from "@components/business/eff-actions/eff-actions";
import EffItemInfo from "@components/business/eff-item-info/eff-item-info";
import EffInfoSep from "@components/business/eff-info-sep/eff-info-sep";
import EffLabel from "@components/business/eff-label/EffLabel";
import EffEditableSelector from "@components/common/eff-editable-selector/eff-editable-selector";
import EffTagArea from "@components/common/eff-tag-area/eff-tag-area";
import EffTagSelector from "@components/common/eff-tag-selector/eff-tag-selector";
import EffEditableDoc from "@components/common/eff-editable-doc/eff-editable-doc";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store/store";
import {DeleteOutlined} from '@ant-design/icons'
import {BUG_SEVERITY, BUG_STATUS} from "@config/sysConstant";
import {bugThunks} from "@slice/bugSlice";

interface IProps{
    onDel:(id:number)=>void
}


export default function BugDetail(props:IProps){
    const dispatch = useDispatch()
    const currentBug = useSelector((state:RootState)=>state.bug.currentBug)
    const menuItems = [{key:'delete', name:'删除Bug', icon:<DeleteOutlined style={{fontSize:'14px'}}/>}]
    const [memberOptions, setMemberOptions] = useState<any[]>([])
    const [selectedTags, setSelectedTags] = useState<any[]>([])
    const members = useSelector((state:RootState)=>state.project.projectDetail.members)
    const projectMembers = useSelector((state:RootState)=>state.project.projectMembers)

    const allTags = useSelector((state:RootState)=>state.tag.tags)
    const page = useSelector((state:RootState)=>state.bug.page)
    const severityOptions = Object.keys(BUG_SEVERITY).map((item:any)=>{
        return {id:BUG_SEVERITY[item].key, name:BUG_SEVERITY[item].name}
    })
    const bugStatusOptions = Object.keys(BUG_STATUS).map((item:any)=>{
        return {id:BUG_STATUS[item].key, name:BUG_STATUS[item].name}
    })

    useEffect(()=>{
        let tagIds = currentBug.tagIds? currentBug.tagIds:[]
        let selectTags = allTags.filter((item:any)=>tagIds.indexOf(item.id)>-1)
        setSelectedTags(selectTags)
    }, [currentBug.tagIds])

    const response = {
        editName: async (name?:string)=>{
            await dispatch(bugThunks.editName({id:currentBug.id, name:name as string}))
            dispatch(bugThunks.listBugs({page}))
        },
        editQa: async (testerId:any)=>{
            dispatch(bugThunks.editQa({id:currentBug.id, testerId}))
        },
        editHandler: async (handlerId:any)=>{
            await dispatch(bugThunks.editHandler({id:currentBug.id, handlerId}))
            dispatch(bugThunks.listBugs({page:page}))
        },
        editStatus: async (status:any)=>{
            await  dispatch(bugThunks.editStatus({id:currentBug.id, status}))
            dispatch(bugThunks.listBugs({page}))
        },
        editSeverity: async (severity:any)=>{
            await dispatch(bugThunks.editSeverity({id:currentBug.id, severity}))
            dispatch(bugThunks.listBugs())
        },
        //tags area 标签删除响应
        delTag: (id:number)=>{
            let currentIds = Object.assign([], currentBug.tagIds)
            let index = currentIds.indexOf(id)
            currentIds.splice(index, 1)
            response.onTagsChanged(currentIds)
        },
        onTagsChanged: async (ids:any)=>{
            await dispatch(bugThunks.editTags({id:currentBug.id, tagIds:ids}))
            dispatch(bugThunks.getBugDetail(currentBug.id))
        },
        editDescription: async (description?:string)=>{
            await dispatch(bugThunks.editDescription({id:currentBug.id, description}))
            dispatch(bugThunks.getBugDetail(currentBug.id))
        },
        //菜单选择响应
        menuSelected:(key:string)=>{
            if(key=='delete'){
                props.onDel(currentBug.id as number)
            }
        }
    }


    useEffect(()=>{
        let availableMembers = []
        if(projectMembers.length>0){
            availableMembers = projectMembers
        }else{
            availableMembers =  members? members:[]
        }

        let options:any[] = []
        availableMembers.forEach(item=>{
            options.push({
                id:item.orgMemberId,
                name:item.name
            })
        })
        setMemberOptions(options)
    },[members, projectMembers])

    return (  <div className="pt40 pl40 pr40 pb40">
        <div className="d-flex justify-between align-center">
            <EffEditableInput errMsg={'请输入Bug名称'} className="flex-grow-1" isRequired={true} onChange={response.editName} value={currentBug.name} placeholder={'请输入Bug名称'} />
            <EffActions onSelect={response.menuSelected} menus={menuItems} className="ml40"  width={'30px'}/>
        </div>
        <EffItemInfo className="ml10" serial={currentBug.serial} creator={currentBug.creator}/>
        <EffInfoSep className="mt20 ml10" name={'基础信息'} />
        <div style={{marginLeft:'60px'}}>

            <div className="d-flex align-center mt20">
                <EffLabel name={'QA'}/>
                <EffEditableSelector id={currentBug.testerId} options={memberOptions} onChange={response.editQa}/>
            </div>

            <div className="d-flex align-center mt20">
                <EffLabel name={'负责人'}/>
                <EffEditableSelector id={currentBug.handlerId} options={memberOptions} onChange={response.editHandler}/>
            </div>

            <div className="d-flex align-center mt20">
                <EffLabel name={'严重程度'}/>
                <EffEditableSelector clear={false} id={currentBug.severity} options={severityOptions} onChange={response.editSeverity}/>
            </div>

            <div className="d-flex align-center mt20">
                <EffLabel name={'Bug状态'}/>
                <EffEditableSelector clear={false} id={currentBug.status} options={bugStatusOptions} onChange={response.editStatus}/>
            </div>

            <div className="d-flex align-center mt20">
                <EffLabel name={'标签'}/>
                <div className="d-flex ml10">
                    <EffTagArea onDel={response.delTag} tags={selectedTags}/>
                    <EffTagSelector onChange={response.onTagsChanged}
                                    chosen={currentBug.tagIds? currentBug.tagIds:[]}
                                    tags={allTags}/>
                </div>
            </div>


        </div>

        <EffInfoSep className="mt40 ml10" name={'任务描述'} />
        <div className="ml20 mt20 pr40" >
            <EffEditableDoc onSave={response.editDescription} height={'400px'} className="ml40 mt20" content={currentBug.description}/>
        </div>
    </div>)
}
