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
import {testCaseThunks} from "@slice/testCaseSlice";
import EffEmpty from "../../components/common/eff-empty/eff-empty";
import {tagThunks} from "@slice/tagSlice";
import TestCaseItem from "./test-case-item";
import {funztionThunks} from "@slice/funztionSlice";
import TestCaseDetail from "./test-case-detail";



export default function TestCase(){
    const dispatch = useDispatch()
    const [isAdvanceSearch, setIsAdvanceSearch] = useState(false)
    const [isShowSearchResult, setIsShowSearchResult] = useState(false)
    const [showAddTestCaseForm, setShowAddTestCaseForm] = useState(false)
    const [showTestCaseDetail, setShowTestCaseDetail] = useState(false)
    const page = useSelector((state:RootState)=>state.testCase.page)
    const testCases = useSelector((state:RootState)=>state.testCase.testCases)
    const totalCaseNum = useSelector((state:RootState)=>state.testCase.total)


    const data = {
        tags: useSelector((state:RootState)=>state.tag.tags),
        searchMenus: [
            {key:'my-task', name:'我的任务', icon:<UserAddOutlined />},
            {key:'unstart', name:'未开始的任务', icon:<FieldTimeOutlined />},

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
        occupy: ()=>{},
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
        }
    }

    const ui = {
        testCaseList : testCases.map((item:any,index)=><TestCaseItem key={item.id} showBg={index%2==0} testCase={item} onChosen={response.handleItemChosen}/>)
    }


    return (
        <div className="flex-grow-1 d-flex-column eff-tasks">
            <div style={{height:'40px'}} className="d-flex justify-end mt20 mb20 align-center">
                {isShowSearchResult && !isAdvanceSearch &&  <EffSearchResult value={22} onClose={response.occupy}/>}
                {isAdvanceSearch? <TaskAdvanceSearch onSearch={response.occupy} onCancel={response.occupy} tags={data.tags}/> :
                    <EffSearchArea onSearch={response.occupy} menuSelected={response.occupy} menus={data.searchMenus}/>}
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
                    {showTestCaseDetail && <TestCaseDetail/>}
                </Drawer>



            </div>
        </div>
    )
}
