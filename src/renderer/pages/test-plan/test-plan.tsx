import React, {useEffect, useState} from "react";
import EffSearchResult from "../../components/business/eff-search-result/eff-search-result";
import TestCaseAdvanceSearch from "../case/test-case-advance-search";
import EffSearchArea from "../../components/business/eff-search-area/eff-search-area";
import EffButton from "../../components/eff-button/eff-button";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store/store";
import {UserAddOutlined} from '@ant-design/icons'
import './test-plan.less'
import EffEmpty from "../../components/common/eff-empty/eff-empty";
import {Drawer, Pagination} from "antd";
import AddTestCaseForm from "../case/add-test-case-form";
import TestCaseDetail from "../case/test-case-detail";
import AddTestPlanForm from "./add-test-plan-form";
import {testPlanThunks} from "@slice/testPlanSlice";
import TestPlanItem from "./test-plan-item";
import {funztionThunks} from "@slice/funztionSlice";
import TestPlanDetail from "./test-plan-detail";
import EffToast from "../../components/common/eff-toast/eff-toast";


export default function TestPlan(){
    const dispatch = useDispatch()
    const [isAdvanceSearch, setIsAdvanceSearch] = useState(false)
    const [isShowSearchResult, setIsShowSearchResult] = useState(false)
    const [showAddForm, setShowAddForm] = useState(false)
    const [showDetail, setShowDetail] = useState(false)
    const tags =  useSelector((state:RootState)=>state.tag.tags)
    const testPlans = useSelector((state:RootState)=>state.testPlan.testPlans)
    const searchMenus = [{key:'my-create', name:'我创建的', icon:<UserAddOutlined />}]
    const page = useSelector((state:RootState)=>state.testPlan.page)
    const totalPlanNum = useSelector((state:RootState)=>state.testPlan.total)

    useEffect(()=>{
        dispatch(testPlanThunks.listTestPlan({page:0}))
    },[])

    const response = {
        occupy: ()=>{},
        handleGoAddTestPlan: ()=>{
            setShowAddForm(true)
        },
        handleCancelAdd: ()=>{
            setShowAddForm(false)
        },
        handleAddTestPlan: async (data:{name:string, functionIds?:number[]})=>{
            await dispatch(testPlanThunks.addTestPlan(data))
            dispatch(testPlanThunks.listTestPlan({page:0}))
            setShowAddForm(false)
        },
        handlePageChange: (page:number)=>{
            dispatch(testPlanThunks.listTestPlan({page:page-1}))
        },
        handleTestPlanClick: async (id:number)=>{
            await dispatch(testPlanThunks.getTestPlanDetail({id}))
            setShowDetail(true)
        },
        handleDelTestPlan: async (id:number)=>{
            let result = await dispatch(testPlanThunks.delTestPlan(id))
            dispatch(testPlanThunks.listTestPlan({page}))
            console.log('here is result ', result)
            EffToast.success_withdraw('计划放入回收站成功', ()=>response.handleWithdraw(id))
            setShowDetail(false)
        },
        handleWithdraw: async (id:number)=>{
            await dispatch(testPlanThunks.withdrawDelTestPlan({id}))
            dispatch(testPlanThunks.listTestPlan({page}))
            EffToast.success("撤销成功")
        }
    }
    const ui = {
        testPlanList: testPlans.map((item:any, index)=><TestPlanItem onClick={()=>response.handleTestPlanClick(item.id)} key={item.id} showBg={index%2==0} testPlan={item}/>)
    }
    return (
        <div className="flex-grow-1 d-flex-column eff-test-plan">
            <div style={{height:'40px'}} className="d-flex justify-end mt20 mb20 align-center">
                {isShowSearchResult && !isAdvanceSearch &&  <EffSearchResult value={22} onClose={response.occupy}/>}
                {isAdvanceSearch? <TestCaseAdvanceSearch onSearch={response.occupy} onCancel={response.occupy} tags={tags}/> :
                    <EffSearchArea onSearch={response.occupy} menuSelected={response.occupy} menus={searchMenus}/>}
                <EffButton width={100} onClick={response.handleGoAddTestPlan} type={"line"}  round={true} className="ml10 mr20" text={'+ 新增计划'} key={'add'}/>
            </div>
            <div className="eff-test-case-content d-flex-column">

                {testPlans.length==0? <EffEmpty description={'暂无计划'} />:ui.testPlanList}
                {testPlans.length>0 && <Pagination className="mt20 mr20 align-self-end" onChange={response.handlePageChange} current={page+1} defaultCurrent={1} total={totalPlanNum}/>}


                <Drawer
                    title={null}
                    width={'60%'}
                    placement="right"
                    closable={false}
                    onClose={response.occupy}
                    maskClosable={true}
                    visible={showAddForm||showDetail}
                >
                    {showAddForm && <AddTestPlanForm onConfirm={response.handleAddTestPlan} onCancel={response.handleCancelAdd} tags={tags}/>}
                    {showDetail && <TestPlanDetail onDel={response.handleDelTestPlan}/>}
                </Drawer>



            </div>
        </div>
    )
}
