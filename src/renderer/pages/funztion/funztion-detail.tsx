import React, {useEffect, useState} from "react";
import EffEditableInput from "../../components/common/eff-editable-input/eff-editable-input";
import EffActions from "../../components/business/eff-actions/eff-actions";
import {DeleteOutlined} from '@ant-design/icons'
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store/store";
import EffItemInfo from "../../components/business/eff-item-info/eff-item-info";
import EffInfoSep from "../../components/business/eff-info-sep/eff-info-sep";
import EffLabel from "../../components/business/eff-label/EffLabel";
import EffTagArea from "../../components/common/eff-tag-area/eff-tag-area";
import EffTagSelector from "../../components/common/eff-tag-selector/eff-tag-selector";
import {tagThunks} from "@slice/tagSlice";
import {reqActions, reqThunks} from "@slice/reqSlice";
import {funztionThunks} from "@slice/funztionSlice";
import EffEditableSelector from "../../components/common/eff-editable-selector/eff-editable-selector";
import {Select} from "antd";
import EffEditableDoc from "../../components/common/eff-editable-doc/eff-editable-doc";


interface IProps{
    onDel:(id:number)=>void
}


export default function FunztionDetail(props:IProps){
    const {onDel} = props
    const dispatch = useDispatch()
    const [selectedTags, setSelectedTags] = useState<any[]>([])


    const data = {
        currentFunztion: useSelector((state:RootState)=>state.funztion.currentFunztion),
        allTags: useSelector((state:RootState)=>state.tag.tags),
        funztionStatus: useSelector((state:RootState)=>state.funztion.funztionStatus),
        filteredReqs: useSelector((state:RootState)=>state.requirement.requirements),
        page: useSelector((state:RootState)=>state.funztion.page),
        menuItems:[
            {key:'delete', name:'删除功能', icon:<DeleteOutlined style={{fontSize:'14px'}}/>},
        ]
    }

    useEffect(()=>{
        //如果有所属需求，列出对应需求
        if(data.currentFunztion.reqId){
            dispatch(reqThunks.listPageRequirement({page:0, id:data.currentFunztion.reqId}))
        }

        dispatch(tagThunks.listTags())
    },[])

    useEffect(()=>{
        let tagIds = data.currentFunztion.tagIds? data.currentFunztion.tagIds:[]
        let selectTags = data.allTags.filter((item:any)=>tagIds.indexOf(item.id)>-1)
        setSelectedTags(selectTags)
    }, [data.currentFunztion.tagIds])



    const response = {
        occupy: ()=>{},
        onTagsChanged: async (ids:any)=>{
           await dispatch(funztionThunks.editFunztionTags(data.currentFunztion.id, ids))
            dispatch(funztionThunks.getFunztionDetail(data.currentFunztion.id))
        },
        //tags area 标签删除响应
        delTag: (id:number)=>{
            let currentIds = Object.assign([], data.currentFunztion.tagIds)
            let index = currentIds.indexOf(id)
            currentIds.splice(index, 1)
            response.onTagsChanged(currentIds)
        },
        handleSearchRequirement: async (value:string)=>{
            if(value){
                await dispatch(reqThunks.listPageRequirement({page:0, name:value}))

            }else{
                dispatch(reqActions.setRequirements([]))

            }

        },

        handleRequirementChange: async (reqId?:string|number)=>{
            await dispatch(funztionThunks.editFunztionRequirement(data.currentFunztion.id, reqId as (number|undefined)))
            dispatch(funztionThunks.getFunztionDetail(data.currentFunztion.id))
        },

        handleStatusChange: async (statusId?:string|number)=>{
            await dispatch(funztionThunks.editFunztionStatus(data.currentFunztion.id, statusId as number))
            dispatch(funztionThunks.getFunztionDetail(data.currentFunztion.id))
            dispatch(funztionThunks.listFunztion({page:0}))
        },
        handleDesChange: async (description?:string)=>{
            await  dispatch(funztionThunks.editFunztionDes(data.currentFunztion.id, description))
            dispatch(funztionThunks.getFunztionDetail(data.currentFunztion.id))
        },
        //菜单选择响应
        menuSelected:(key:string)=>{
            if(key=='delete'){
                onDel(data.currentFunztion.id as number)
            }
        }
    }

    return (
        <div className="pt40 pl40 pr40 pb40">
            <div className="d-flex justify-between align-center">
                <EffEditableInput errMsg={'请输入功能名称'} className="flex-grow-1" isRequired={true} onChange={response.occupy} value={data.currentFunztion.name} placeholder={'请输入功能名称'} />
                <EffActions onSelect={response.menuSelected} menus={data.menuItems} className="ml40"  width={'30px'}/>
            </div>
            <EffItemInfo className="ml10" serial={data.currentFunztion.serial!} creator={data.currentFunztion.creator && data.currentFunztion.creator.name}/>
            <EffInfoSep className="mt20 ml10" name={'基础信息'} />

            <div style={{marginLeft:'60px'}}>
                <div className="d-flex align-center mt20">
                    <EffLabel name={'所属需求'}/>
                    <EffEditableSelector id={data.currentFunztion.reqId}  onSearch={response.handleSearchRequirement} searchAble={true} options={data.filteredReqs} onChange={response.handleRequirementChange}/>

                </div>

                <div className="d-flex align-center mt20">
                    <EffLabel name={'状态'}/>
                    <EffEditableSelector id={data.currentFunztion.statusId} options={data.funztionStatus} onChange={response.handleStatusChange}/>

                </div>

                <div className="d-flex align-center mt20">
                    <EffLabel name={'标签'}/>
                    <div className="d-flex ml10">
                        <EffTagArea onDel={response.delTag} tags={selectedTags}/>
                        <EffTagSelector onChange={response.onTagsChanged}
                                        chosen={data.currentFunztion.tagIds? data.currentFunztion.tagIds:[]}
                                        tags={data.allTags}/>


                    </div>
                </div>
            </div>

            <EffInfoSep className="mt40 ml10" name={'功能描述'} />
            <div className="ml20 mt20 pr40" >
                <EffEditableDoc onSave={response.handleDesChange} height={'400px'} className="ml40 mt20" content={data.currentFunztion.description}/>
            </div>



        </div>
    )

}
