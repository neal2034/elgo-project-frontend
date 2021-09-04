import React, {useEffect, useState} from "react";
import EffEditableInput from "../../components/common/eff-editable-input/eff-editable-input";
import EffActions from "../../components/business/eff-actions/eff-actions";
import EffItemInfo from "../../components/business/eff-item-info/eff-item-info";
import EffInfoSep from "../../components/business/eff-info-sep/eff-info-sep";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store/store";
import {DeleteOutlined} from '@ant-design/icons'
import EffLabel from "@components/business/eff-label/EffLabel";
import EffEditableSelector from "@components/common/eff-editable-selector/eff-editable-selector";
import {TEST_PLAN_STATUS} from "@config/sysConstant";
import {testPlanThunks} from "@slice/testPlanSlice";
import {FunztionSelectItem} from "./add-test-plan-form";
import {funztionActions, funztionThunks} from "@slice/funztionSlice";
import {Checkbox, Pagination} from "antd";
import './test-plan.less'
import EffButton from "@components/eff-button/eff-button";


interface IProps{
    onDel:(id:number)=>void
}


export default function TestPlanDetail(props:IProps){

    const dispatch = useDispatch()

    const currentTestPlan = useSelector((state:RootState)=>state.testPlan.currentTestPlan)
    const menuItems = [{key:'delete', name:'删除计划', icon:<DeleteOutlined style={{fontSize:'14px'}}/>},]
    const funztions = useSelector((state:RootState)=>state.funztion.funztions)
    const funztionStatus = useSelector((state:RootState)=>state.funztion.funztionStatus)
    const currentPage = useSelector((state:RootState)=>state.funztion.page)
    const totalFunztionNum = useSelector((state:RootState)=>state.funztion.funzTotal)
    const [isEditing, setIsEditing] = useState(false)
    const [selectedFunztionIds, setSelectedFunztionIds] = useState<number[]>([])
    const [isSelectAll, setIsSelectAll] = useState(false)


    useEffect(()=>{
        if(currentTestPlan.functionIds){
            let ids = currentTestPlan.functionIds.slice(0,10)
            dispatch(funztionThunks.listWithIds({ids}))
            dispatch(funztionActions.setFunzTotal(currentTestPlan.functionIds.length))
        }
        dispatch(funztionActions.setPage(0))
        dispatch(funztionThunks.listFunztionStatus())
    },[])


    useEffect(()=>{
            let selectAll = funztions.length > 0
            for(let funztion of funztions){
                if(selectedFunztionIds.indexOf(funztion.id)===-1){
                    selectAll = false
                }
            }
            console.log('will set to ', selectAll)
            setIsSelectAll(selectAll)
        },
        [funztions, selectedFunztionIds])

    useEffect(()=>{
        if(isEditing){
            setSelectedFunztionIds(currentTestPlan.functionIds? currentTestPlan.functionIds:[])
            dispatch(funztionThunks.listFunztion({page:0}))
            console.log(' will editing')
        }else{
            if(currentTestPlan.functionIds){
                let ids = currentTestPlan.functionIds.slice(0,10)
                console.log('here is the dis ', ids)
                dispatch(funztionThunks.listWithIds({ids}))
                dispatch(funztionActions.setFunzTotal(currentTestPlan.functionIds.length))
            }
        }
    },[isEditing])

    const planStatusOptions = []
    for(let item in TEST_PLAN_STATUS){
        planStatusOptions.push({id:TEST_PLAN_STATUS[item].key, name:TEST_PLAN_STATUS[item].name})
    }

    const response = {
        occupy: ()=>{},
        handleMenuSelected:async ()=>{
            props.onDel(currentTestPlan.id)
        },
        handleEditStatus: (status?:string|number)=>{
            dispatch(testPlanThunks.editStatus({id:currentTestPlan.id, status:status as string}))
        },
        handlePageChange: (page:number)=>{
            console.log('page is ',page)
            if(isEditing){
                dispatch(funztionThunks.listFunztion({page:page-1}))
            }else{
                let ids = currentTestPlan.functionIds!.slice(page*10-10,  page*10)
                dispatch(funztionThunks.listWithIds({ids}))
                dispatch(funztionActions.setPage(page-1))
            }

        },
        handleFunztionSelected:(id:number, selected:boolean)=>{
            let tempIds = Object.assign([], selectedFunztionIds)
            if(selected){
                tempIds.push(id)
            }else {
                let index = tempIds.indexOf(id)
                tempIds.splice(index, 1)
            }
            setSelectedFunztionIds(tempIds)
        },
        handleSelectAll: (e:any)=>{
            let selected = e.target.checked
            setIsSelectAll(selected)
            if(selected){
                let notSelectIds = []
                for(let funztion of funztions){
                    if(selectedFunztionIds.indexOf(funztion.id)===-1){
                        notSelectIds.push(funztion.id)
                    }
                }
                let tempIds = notSelectIds.concat(selectedFunztionIds)
                setSelectedFunztionIds(tempIds)
            }else{
                let tempIds = Object.assign([], selectedFunztionIds)
                for(let funztion of funztions){
                    let index = tempIds.indexOf(funztion.id)
                    if(index>-1){
                        tempIds.splice(index, 1)
                    }
                }
                setSelectedFunztionIds(tempIds)
            }
        },
        handleCancelEdit: ()=>{
            setIsEditing(false)
            if(currentTestPlan.functionIds){
                let ids = currentTestPlan.functionIds.slice(0,10)
                dispatch(funztionThunks.listWithIds({ids}))
                dispatch(funztionActions.setFunzTotal(currentTestPlan.functionIds.length))
            }
            dispatch(funztionActions.setPage(0))
        },
        handleSaveEdit: async ()=>{
            await dispatch(testPlanThunks.editFunztions({id:currentTestPlan.id, funztionIds:selectedFunztionIds}))
            await dispatch(testPlanThunks.getTestPlanDetail({id:currentTestPlan.id}))
            setIsEditing(false)
        },
        handleEditName: async (value:string)=>{
            await dispatch(testPlanThunks.editName({id:currentTestPlan.id, name:value}))
            dispatch(testPlanThunks.getTestPlanDetail({id:currentTestPlan.id}))
            dispatch(testPlanThunks.listTestPlan({page:currentPage}))
        }
    }

    const ui = {
        funztionList: funztions.map((item:any,index)=><FunztionSelectItem key={item.id}
                                                                          id={item.id}
                                                                          selected={selectedFunztionIds.indexOf(item.id)>-1}
                                                                          onSelected={response.handleFunztionSelected}
                                                                          showCheck={isEditing}
                                                                          status={funztionStatus}
                                                                          showBg={index%2==0}
                                                                          statusId={item.statusId}
                                                                          name={item.name} serial={item.serial}/>)
    }



    return (
        <div className="pt40 pl40 pr40 pb40">
            <div className="d-flex justify-between align-center">
                <EffEditableInput errMsg={'请输入计划名称'} className="flex-grow-1" isRequired={true} onChange={response.handleEditName} value={currentTestPlan.name} placeholder={'请输入计划名称'} />
                <EffActions onSelect={response.handleMenuSelected} menus={menuItems} className="ml40"  width={'30px'}/>
            </div>
            <EffItemInfo className="ml10" serial={ currentTestPlan.serial!} creator={currentTestPlan.creator}/>
            <EffInfoSep className="mt20 ml10" name={'基础信息'} />
            <div style={{marginLeft:'60px'}}>
                <div className="d-flex align-center mt20">
                    <EffLabel name={'计划状态'}/>
                    <EffEditableSelector id={currentTestPlan.status} options={planStatusOptions} onChange={response.handleEditStatus}/>
                </div>
            </div>
            <EffInfoSep className="mt20 ml10" name={'测试项'} />
            <div onClick={()=>setIsEditing(true)} className="funztion-list mt20" style={{marginLeft:'60px', minHeight:'200px'}}>
                {ui.funztionList}
            </div>
            <div style={{marginLeft:'60px'}} className={`d-flex align-center ${isEditing?'justify-between':'justify-end'}`}>
                {isEditing && <Checkbox checked={isSelectAll} onChange={response.handleSelectAll} className="ml20">当页全选</Checkbox>}
                <Pagination className="mt20 mr20 align-self-end" onChange={response.handlePageChange} current={currentPage+1} defaultCurrent={1} total={totalFunztionNum}/>
            </div>
            { isEditing && <div style={{marginLeft:'60px'}} className="btn-group d-flex">
                <EffButton type={"line"} round={true} className="mr20" onClick={response.handleCancelEdit} text={'取消'} key={'cancel'}/>
                <EffButton type={'filled'} round={true} onClick={response.handleSaveEdit} text={'保存'} key={'confirm'}/>
            </div>}

        </div>
    )
}
