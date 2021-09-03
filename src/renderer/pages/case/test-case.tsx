import React, {useEffect, useState} from "react";
import EffSearchResult from "../../components/business/eff-search-result/eff-search-result";
import TaskAdvanceSearch from "../task/task-advance-search";
import EffSearchArea from "../../components/business/eff-search-area/eff-search-area";
import EffButton from "../../components/eff-button/eff-button";
import EffTaskContent from "../task/eff-task-content";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store/store";
import {UserAddOutlined, FieldTimeOutlined} from '@ant-design/icons'
import {Drawer, Pagination} from "antd";
import AddTaskForm from "../task/add-task-form";
import AddTestCaseForm from "./add-test-case-form";
import {taskThunks} from "@slice/taskSlice";
import {testCaseActions, testCaseThunks} from "@slice/testCaseSlice";
import EffEmpty from "../../components/common/eff-empty/eff-empty";
import {tagThunks} from "@slice/tagSlice";
import TestCaseItem from "./test-case-item";
import {funztionThunks} from "@slice/funztionSlice";
import TestCaseDetail from "./test-case-detail";
import EffToast from "../../components/eff-toast/eff-toast";
import {reqActions} from "@slice/reqSlice";
import TestCaseAdvanceSearch from "./test-case-advance-search";



export default function TestCase(){
    const dispatch = useDispatch()
    const [isAdvanceSearch, setIsAdvanceSearch] = useState(false)
    const [isShowSearchResult, setIsShowSearchResult] = useState(false)
    const [showAddTestCaseForm, setShowAddTestCaseForm] = useState(false)
    const [showTestCaseDetail, setShowTestCaseDetail] = useState(false)
    const isToastOpen =  useSelector((state:RootState)=>state.testCase.isToastOpen)
    const page = useSelector((state:RootState)=>state.testCase.page)
    const testCases = useSelector((state:RootState)=>state.testCase.testCases)
    const totalCaseNum = useSelector((state:RootState)=>state.testCase.total)
    const [isToastWithdraw, setIsToastWithdraw] = useState(false)    //toast 是否包含撤销
    const [toastMsg, setToastMsg] = useState<string>()
    const [lastDelCaseId, setLastDelCaseId] = useState(-1)

    const data = {
        tags: useSelector((state:RootState)=>state.tag.tags),
        searchMenus: [
            {key:'my-create', name:'我创建的', icon:<UserAddOutlined />},
            // {key:'unstart', name:'未开始的任务', icon:<FieldTimeOutlined />},

        ],
    }

    useEffect(()=>{
        dispatch(testCaseThunks.listTestCase({page:0}))
        dispatch(tagThunks.listTags())
    },[])
    const response = {
        handleItemChosen: async (id:number)=>{
            await dispatch(testCaseThunks.getTestCaseDetail(id))
            setShowTestCaseDetail(true)
        },
        handleCancelAdd: ()=>{
            setShowAddTestCaseForm(false)
        },
        handleGoAdd: ()=>{
            setShowAddTestCaseForm(true)
        },
        handleAddTestCase: async (testcase:any)=>{
            await dispatch(testCaseThunks.addTestCase(testcase))
            dispatch(testCaseThunks.listTestCase({page}))
            setShowAddTestCaseForm(false)

        },
        handlePageChange:(pageId:number)=>{
            dispatch(testCaseThunks.listTestCase({page:pageId-1}))
        },
        handleClose: ()=>{
            setShowTestCaseDetail(false)
            setShowAddTestCaseForm(false)
        },
        handleDelCase: async (id:number)=>{
            setToastMsg('测试用例放入回收站成功')
            setIsToastWithdraw(true)
            await dispatch(testCaseThunks.deleteTestCase(id))
            dispatch(testCaseThunks.listTestCase({page}))
            setLastDelCaseId(id)
            setShowTestCaseDetail(false)
        },
        handleWithdrawDelFunztion: async ()=>{
            setIsToastWithdraw(false)
            setToastMsg('撤销成功')
            await dispatch(testCaseThunks.withdrawDelTestCase(lastDelCaseId))
            dispatch(testCaseThunks.listTestCase({page}))
            setLastDelCaseId(-1)

        },
        handleAdvanceSearch: async (searchKeys:any)=>{
            let params:any = {page:0, searchKey:searchKeys.name, funztionId:searchKeys.funztionId, tagIds:searchKeys.tagIds}
            if(searchKeys.priority){
                params.priorities = [searchKeys.priority]
            }
            await dispatch(testCaseThunks.listTestCase(params))
            setIsAdvanceSearch(false)
            setIsShowSearchResult(true)
        },
        handleCloseSearch:()=>{
            setIsShowSearchResult(false)
            dispatch(testCaseThunks.listTestCase({page:0}))
        },
        //取消高级搜索
        handleCancelAdvanceSearch: ()=>{
            setIsAdvanceSearch(false)
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
        handleSearch: async (value:string)=>{
            await dispatch(testCaseThunks.listTestCase({page:0, searchKey:value}))
            setIsShowSearchResult(true)
        },
    }

    const ui = {
        testCaseList : testCases.map((item:any,index)=><TestCaseItem key={item.id} showBg={index%2==0} testCase={item} onChosen={response.handleItemChosen}/>)
    }


    return (
        <div className="flex-grow-1 d-flex-column">
            <div style={{height:'40px'}} className="d-flex justify-end mt20 mb20 align-center">
                {isShowSearchResult && !isAdvanceSearch &&  <EffSearchResult value={totalCaseNum} onClose={response.handleCloseSearch}/>}
                {isAdvanceSearch? <TestCaseAdvanceSearch onSearch={response.handleAdvanceSearch} onCancel={response.handleCancelAdvanceSearch} tags={data.tags}/> :
                    <EffSearchArea onSearch={response.handleSearch} menuSelected={response.handleSearchMenu} menus={data.searchMenus}/>}
                <EffButton width={100} onClick={response.handleGoAdd} type={"line"}  round={true} className="ml10 mr20" text={'+ 新增用例'} key={'add'}/>
            </div>
            <div className="eff-test-case-content d-flex-column">

                {testCases.length==0? <EffEmpty description={'暂无用例'} />:ui.testCaseList}
                {testCases.length>0 && <Pagination className="mt20 mr20 align-self-end" onChange={response.handlePageChange} current={page+1} defaultCurrent={1} total={totalCaseNum}/>}


                <Drawer
                    title={null}
                    width={'60%'}
                    placement="right"
                    closable={false}
                    onClose={response.handleClose}
                    maskClosable={true}
                    visible={showAddTestCaseForm||showTestCaseDetail}
                >
                    {showAddTestCaseForm && <AddTestCaseForm onConfirm={response.handleAddTestCase} onCancel={response.handleCancelAdd} tags={data.tags}/>}
                    {showTestCaseDetail && <TestCaseDetail onDel={response.handleDelCase}/>}
                </Drawer>



            </div>
            <EffToast onWithDraw={response.handleWithdrawDelFunztion} open={isToastOpen} message={toastMsg as string} isWithDraw={isToastWithdraw} onClose={()=>dispatch(testCaseActions.setIsToastOpen(false))}/>
        </div>
    )
}
