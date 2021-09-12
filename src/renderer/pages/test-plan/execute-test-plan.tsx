import React, {useEffect, useState} from "react";
import EffInfoSep from "@components/business/eff-info-sep/eff-info-sep";
import {LeftCircleOutlined,UserAddOutlined} from '@ant-design/icons'
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store/store";
import './test-plan.less'
import EffSearchResult from "@components/business/eff-search-result/eff-search-result";
import EffSearchArea from "@components/business/eff-search-area/eff-search-area";
import {testPlanThunks} from "@slice/testPlanSlice";
import PlanCaseItem from "./plan-case-item";
import {Pagination} from "antd";
import PlanCaseAdvanceSearch from "./plan-case-advance-search";


export default function ExecuteTestPlan(){
    const dispatch  = useDispatch()
    const currentTestPlan = useSelector((state:RootState)=>state.testPlan.currentTestPlan)
    const [isAdvanceSearch, setIsAdvanceSearch] = useState(false)
    const [isShowSearchResult, setIsShowSearchResult] = useState(false)
    const searchMenus = [{key:'my-create', name:'我创建的', icon:<UserAddOutlined />}]
    const planCases = useSelector((state:RootState)=>state.testPlan.planCases)
    const casePage = useSelector((state:RootState)=>state.testPlan.casePage)
    const totalCaseNum = useSelector((state:RootState)=>state.testPlan.totalCaseNum)


    useEffect(()=>{
        if(currentTestPlan.id){
            dispatch(testPlanThunks.listPlanCase({planId:currentTestPlan.id}))
        }
    },[currentTestPlan])

    const response = {
        occupy: ()=>{
            console.log('will uses this latter')
        },
        goBackTestPlan: ()=>{
            history.back()
        },
        handlePageChange: (page:number)=>{
            dispatch(testPlanThunks.listPlanCase({page:page-1, planId:currentTestPlan.id}))
        },
        handleSearchMenu: (key:string)=>{
            switch (key){
                case 'my-create':
                    console.log('搜索我创建的')
                    break
                default:
                    setIsAdvanceSearch(true)
            }
        },
        cancelAdvanceSearch: ()=>{
            setIsAdvanceSearch(false)
        },
        handleAdvanceSearch: (params:{name?:string, status?:string, funztionId?:number})=>{
            dispatch(testPlanThunks.listPlanCase({page:0, planId:currentTestPlan.id,  caseName:params.name, status:params.status, funztionId:params.funztionId}))
            setIsAdvanceSearch(false)
            setIsShowSearchResult(true)
        },
        closeSearchResult: ()=>{
            dispatch(testPlanThunks.listPlanCase({planId:currentTestPlan.id}))
            setIsShowSearchResult(false)
        },
        searchWithCaseName: (caseName:string)=>{
            dispatch(testPlanThunks.listPlanCase({page:0, planId:currentTestPlan.id,  caseName}))
            setIsShowSearchResult(true)

        }
    }

    const testCases = planCases.map((item:any,index)=><PlanCaseItem showBg={index%2==0} planCase={item} onChosen={response.occupy} key={item.id}/>)


    return (
        <div className="flex-grow-1 d-flex-column pt20 pl20 pr20 execute-test-plan">
            <div   className="d-flex justify-between align-center">
                <div className="d-flex header">
                    <EffInfoSep name={'执行计划'}/><span className="ml10 name"> {currentTestPlan.name}  <LeftCircleOutlined onClick={response.goBackTestPlan} className="ml5 back" /></span>
                </div>
                <div style={{height:'40px'}} className="d-flex justify-end   align-center">
                    {isShowSearchResult && !isAdvanceSearch &&  <EffSearchResult value={totalCaseNum} onClose={response.closeSearchResult}/>}
                    {isAdvanceSearch? <PlanCaseAdvanceSearch onSearch={response.handleAdvanceSearch} onCancel={response.cancelAdvanceSearch}/> :
                        <EffSearchArea onSearch={response.searchWithCaseName} menuSelected={response.handleSearchMenu} menus={searchMenus}/>}
                </div>
            </div>
            <div className="mt40 d-flex-column ">
                {testCases}
               <Pagination className="mt20 mr20 align-self-end" onChange={response.handlePageChange} current={casePage+1} defaultCurrent={1} total={totalCaseNum}/>

            </div>

        </div>
    )
}
