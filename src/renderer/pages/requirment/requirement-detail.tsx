import React, {useEffect, useState} from "react";

import EffEditableInput from "../../components/common/eff-editable-input/eff-editable-input";
import EffEditableSelector from "../../components/common/eff-editable-selector/eff-editable-selector";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store/store";
import {reqThunks} from "@slice/reqSlice";
import globalColor from "@config/globalColor";

import EffTagArea from "../../components/common/eff-tag-area/eff-tag-area";
import EffTagSelector from "../../components/common/eff-tag-selector/eff-tag-selector";
import {tagThunks} from "@slice/tagSlice";
import {REQUIREMENT_STATUS} from "@config/sysConstant";
import EffEditableDoc from "../../components/common/eff-editable-doc/eff-editable-doc";
import EffActions from "../../components/business/eff-actions/eff-actions";
import {DeleteOutlined} from '@ant-design/icons'
import EffItemInfo from "../../components/business/eff-item-info/eff-item-info";
import EffInfoSep from "../../components/business/eff-info-sep/eff-info-sep";
import EffLabel from "../../components/business/eff-label/EffLabel";


export default function RequirementDetail(){
    const dispatch = useDispatch()
    const [selectedTags, setSelectedTags] = useState<any[]>([])

    //需求状态options
    const reqStatusOptions = []
    for(let opt in REQUIREMENT_STATUS){
        reqStatusOptions.push({
            id: REQUIREMENT_STATUS[opt].key,
            name: REQUIREMENT_STATUS[opt].name,
        })
    }

    const data = {
        reqClasses: useSelector((state:RootState)=>state.requirement.reqClasses),
        rqeSources: useSelector( (state:RootState) => state.requirement.reqSources),
        reqVersions: useSelector((state:RootState)=>state.requirement.reqVersions),
        allTags: useSelector((state:RootState)=>state.tag.tags),
        currentReqPage: useSelector((state:RootState)=>state.requirement.page),
        currentRequirement : useSelector((state:RootState)=>state.requirement.currentReq),
        menuItems:[
            {key:'delete', name:'删除需求', icon:<DeleteOutlined style={{fontSize:'14px'}}/>},
        ]
    }
    const response = {
        onNameChange: async (name?:string)=>{
           await dispatch(reqThunks.editRequirement({
                id:data.currentRequirement.id!,
                field:'NAME',
                name,
            }))
             response.refreshPage();

        },
        onReqClazzChange: async (id?:number|string)=>{
            let updateId = id ? id: -1
             await dispatch(reqThunks.editRequirement({
                 id:data.currentRequirement.id!,
                 field: 'CLAZZ',
                 classId: updateId as number,
             }))
            dispatch(reqThunks.listAllReqClasses())
        },
        onReqVersionChange: async (id?:number|string)=>{
            await dispatch(reqThunks.editRequirement({
                id:data.currentRequirement.id!,
                field:  "VERSION",
                versionId: id as (number|undefined),
            }))
            response.refreshPage();
        },
        onReqSourceChange: async (sourceId?:number|string)=>{
            await dispatch(reqThunks.editRequirement({
                id:data.currentRequirement.id!,
                field: "SOURCE",
                sourceId: sourceId as (number|undefined),
            }))
        },
        onStatusChange: async (status?:string|number)=>{
            await dispatch(reqThunks.editRequirement({
                id: data.currentRequirement.id!,
                field: "STATUS",
                status:status as string,
            }))
            response.refreshPage();
        },
        onTagsChanged: async (ids:any)=>{
            await dispatch(reqThunks.editRequirement({
                id:data.currentRequirement.id!,
                field: "TAG",
                tagIds: ids
            }))
        },
        refreshPage:()=>{
            dispatch(reqThunks.listPageRequirement({page: data.currentReqPage}))
        },
        //tags area 标签删除响应
        delTag: (id:number)=>{
            let currentIds = Object.assign([], data.currentRequirement.tagIds)
            let index = currentIds.indexOf(id)
            currentIds.splice(index, 1)
            response.onTagsChanged(currentIds)
        }
    }





    //系统初始化
    useEffect(()=>{
        dispatch(reqThunks.listAllReqClasses())
        dispatch(reqThunks.listAllReqSource())
        dispatch(reqThunks.listAllReqVersions())
        dispatch(tagThunks.listTags())
    },[])

    useEffect(()=>{
        let tagIds = data.currentRequirement.tagIds? data.currentRequirement.tagIds:[]
        let selectTags = data.allTags.filter((item:any)=>tagIds.indexOf(item.id)>-1)
        setSelectedTags(selectTags)
    }, [data.currentRequirement.tagIds])





    return (
        <div className="pt40 pl40 pr40 pb40" >
            <div className="d-flex justify-between align-center">
                <EffEditableInput errMsg={'请输入需求名称'} className="flex-grow-1" isRequired={true} onChange={response.onNameChange} value={data.currentRequirement.name} placeholder={'请输入需求名称'} />
                <EffActions onSelect={()=>{}} menus={data.menuItems} className="ml40"  width={'30px'}/>
            </div>
            <EffItemInfo className="ml10" serial={data.currentRequirement.serial!} creator={data.currentRequirement.creator && data.currentRequirement.creator.name}/>
            <EffInfoSep className="mt20 ml10" name={'基础信息'} />


            <div className="content mt20 ml40">
                <div className="d-flex ml20">
                    <div  className="d-flex align-center">
                        <EffLabel name={'需求分类'}/>
                        <EffEditableSelector onChange={response.onReqClazzChange}
                                             id={data.currentRequirement.classId}
                                             placeholder={'未分类'} options={data.reqClasses}/>
                    </div>

                    <div className="d-flex align-center  ml20">
                        <EffLabel name={'版本'}/>
                        <EffEditableSelector options={data.reqVersions} id={data.currentRequirement.versionId} placeholder={'未指定'}
                                             onChange={response.onReqVersionChange}/>
                    </div>
                </div>

                <div className="d-flex mt10 ml20">
                    <div className="d-flex align-center">
                        <EffLabel name={'状态'}/>
                        <EffEditableSelector options={reqStatusOptions}
                                             clear={false}
                                             id = {data.currentRequirement.status}
                                             onChange={response.onStatusChange}/>
                    </div>

                    <div className="d-flex align-center ml20">
                        <EffLabel name={'需求来源'}/>
                        <EffEditableSelector options={data.rqeSources}
                                             id = {data.currentRequirement.sourceId}
                                             onChange={response.onReqSourceChange}
                                             placeholder={'未指定'}/>
                    </div>
                </div>

                <div className="d-flex align-center ml20 mt20">
                    <EffLabel name={'标签'}/>
                    <div className="d-flex ml10">
                        <EffTagArea onDel={response.delTag} tags={selectedTags}/>
                        <EffTagSelector onChange={response.onTagsChanged}
                                        chosen={data.currentRequirement.tagIds? data.currentRequirement.tagIds:[]}
                                        tags={data.allTags}/>


                    </div>
                </div>
            </div>

            <EffInfoSep className="mt40 ml10" name={'需求描述'} />
            <div className="ml20 mt20 pr40" >
                <EffEditableDoc height={'400px'} className="ml40 mt20" content={data.currentRequirement.description}/>
            </div>

        </div>
    )
}





