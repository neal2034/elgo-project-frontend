import React, {useEffect, useMemo, useState} from "react";
import {Form} from "antd";
import EffEditableInput from "../../components/common/eff-editable-input/eff-editable-input";
import EffEditableSelector from "../../components/common/eff-editable-selector/eff-editable-selector";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store/store";
import {reqThunks} from "@slice/reqSlice";
import globalColor from "@config/globalColor";
import EffUser from "../../components/eff-user/effUser";
import EffTagArea from "../../components/common/eff-tag-area/eff-tag-area";
import EffTagSelector from "../../components/common/eff-tag-selector/eff-tag-selector";
import {tagThunks} from "@slice/tagSlice";
import {REQUIREMENT_STATUS} from "@config/sysConstant";
import EffEditableDoc from "../../components/common/eff-editable-doc/eff-editable-doc";


export default function RequirementDetail(){
    const dispatch = useDispatch()
    const currentRequirement = useSelector((state:RootState)=>state.requirement.currentReq)
    const currentReqPage = useSelector((state:RootState)=>state.requirement.page)
    const [selectedTags, setSelectedTags] = useState<any[]>([])

    //需求状态options
    const reqStatusOptions = []
    for(let opt in REQUIREMENT_STATUS){
        reqStatusOptions.push({
            id: REQUIREMENT_STATUS[opt].key,
            name: REQUIREMENT_STATUS[opt].name,
        })
    }


    const response = {
        onNameChange: async (name?:string)=>{
           await dispatch(reqThunks.editRequirement({
                id:currentRequirement.id!,
                field:'NAME',
                name,
            }))
             response.refreshPage();

        },
        onReqClazzChange: async (id?:number|string)=>{
            let updateId = id ? id: -1
             await dispatch(reqThunks.editRequirement({
                 id:currentRequirement.id!,
                 field: 'CLAZZ',
                 classId: updateId as number,
             }))
            dispatch(reqThunks.listAllReqClasses())
        },
        onReqVersionChange: async (id?:number|string)=>{
            await dispatch(reqThunks.editRequirement({
                id:currentRequirement.id!,
                field:  "VERSION",
                versionId: id as (number|undefined),
            }))
            response.refreshPage();
        },
        onReqSourceChange: async (sourceId?:number|string)=>{
            await dispatch(reqThunks.editRequirement({
                id:currentRequirement.id!,
                field: "SOURCE",
                sourceId: sourceId as (number|undefined),
            }))
        },
        onStatusChange: async (status?:string|number)=>{
            await dispatch(reqThunks.editRequirement({
                id:currentRequirement.id!,
                field: "STATUS",
                status:status as string,
            }))
            response.refreshPage();
        },
        onTagsChanged: async (ids:any)=>{
            await dispatch(reqThunks.editRequirement({
                id:currentRequirement.id!,
                field: "TAG",
                tagIds: ids
            }))
        },
        refreshPage:()=>{
            dispatch(reqThunks.listPageRequirement({page:currentReqPage}))
        }
    }


    const data = {
        reqClasses: useSelector((state:RootState)=>state.requirement.reqClasses),
        rqeSources: useSelector( (state:RootState) => state.requirement.reqSources),
        reqVersions: useSelector((state:RootState)=>state.requirement.reqVersions),
        allTags: useSelector((state:RootState)=>state.tag.tags),
    }


    useEffect(()=>{
        dispatch(reqThunks.listAllReqClasses())
        dispatch(reqThunks.listAllReqSource())
        dispatch(reqThunks.listAllReqVersions())
        dispatch(tagThunks.listTags())


    },[])

    useEffect(()=>{
        let tagIds = currentRequirement.tagIds? currentRequirement.tagIds:[]
        let selectTags = data.allTags.filter((item:any)=>tagIds.indexOf(item.id)>-1)
        setSelectedTags(selectTags)
    }, [currentRequirement.tagIds])

    const style = {
        label:{
            color:globalColor.fontWeak,
            fontSize: '14px'
        }
    }

    return (
        <div className="pt40 pl40">

            <EffEditableInput isRequired={false} onChange={response.onNameChange} value={currentRequirement.name} placeholder={'请输入需求名称'} />
            <div className="content mt20 ml30">

                <ReqItem>
                    <Label label={'创建人'}/>
                    <EffUser id={1} name={'史俊辉'} size={20} />
                    <span className="ml10">史俊辉</span>
                </ReqItem>

                <ReqItem>
                    <Label label={'需求编号'}/>
                    <span>{currentRequirement.serial}</span>
                </ReqItem>

                <ReqItem>
                    <Label label={'需求分类'}/>
                    <EffEditableSelector onChange={response.onReqClazzChange}
                                         id={currentRequirement.classId}
                                         placeholder={'未分类'} options={data.reqClasses}/>
                </ReqItem>

                <ReqItem>
                    <Label label={'版本'}/>
                    <EffEditableSelector options={data.reqVersions} id={currentRequirement.versionId} placeholder={'未指定'}
                                         onChange={response.onReqVersionChange}/>
                </ReqItem>

                <ReqItem>
                    <Label label={'状态'}/>
                    <EffEditableSelector options={reqStatusOptions}
                                         clear={false}
                                         id = {currentRequirement.status}
                                         onChange={response.onStatusChange}/>
                </ReqItem>

                <ReqItem>
                    <Label label={'需求来源'}/>
                    <EffEditableSelector options={data.rqeSources}
                                         id = {currentRequirement.sourceId}
                                         onChange={response.onReqSourceChange}
                                         placeholder={'未指定'}/>
                </ReqItem>

                <ReqItem>
                    <Label label={'标签'}/>
                    <div className="d-flex ml40">
                        <EffTagArea tags={selectedTags}/>
                        <EffTagSelector onChange={response.onTagsChanged}
                                        chosen={currentRequirement.tagIds?currentRequirement.tagIds:[]}
                                        tags={data.allTags}/>
                    </div>
                </ReqItem>

                <div className="d-flex align-start mt20">
                    <Label label={'需求描述'}/>
                    <EffEditableDoc content={currentRequirement.description}/>
                </div>
            </div>
        </div>
    )
}


function Label(props: { label:string }){
    const {label} = props
    const style = {
        label:{
            color:globalColor.fontWeak,
            fontSize: '14px',
            width: '60px',
            whiteSpace: 'nowrap'
        }
    }
    // @ts-ignore
    return  <span className="mr40" style={style.label}>{label}</span>
}

function ReqItem(props:{children:any}){
    return <div className="d-flex align-center mt20">
        {props.children}
    </div>
}




