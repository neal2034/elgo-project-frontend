import React, {useEffect, useState} from "react";
import EffSearchResult from "@components/business/eff-search-result/eff-search-result";
import TestCaseAdvanceSearch from "../case/test-case-advance-search";
import EffSearchArea from "@components/business/eff-search-area/eff-search-area";
import EffButton from "@components/eff-button/eff-button";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store/store";
import {tagThunks} from "@slice/tagSlice";
import {bugThunks, IAddBugDto} from "@slice/bugSlice";
import {UserAddOutlined} from '@ant-design/icons'
import EffEmpty from "@components/common/eff-empty/eff-empty";
import {Drawer, Pagination} from "antd";
import TestCaseDetail from "../case/test-case-detail";
import AddBugForm from "./add-bug-form";
import BugItem from "./bug-item";
import {testCaseThunks} from "@slice/testCaseSlice";
import BugDetail from "./bug-detail";
import {effToast} from "@components/common/eff-toast/eff-toast";


export default function Bug(){

    const dispatch = useDispatch()
    const [isAdvanceSearch, setIsAdvanceSearch] = useState(false)
    const [isShowSearchResult, setIsShowSearchResult] = useState(false)
    const [showAddForm, setShowAddForm] = useState(false)
    const [showDetail, setShowDetail] = useState(false)
    const bugs = useSelector((state:RootState)=>state.bug.bugs)
    const totalNum = useSelector((state:RootState)=>state.bug.total)
    const page = useSelector((state:RootState)=>state.bug.page)
    const tags = useSelector((state:RootState)=>state.tag.tags)
    const searchMenus = [{key:'my-create', name:'我创建的', icon:<UserAddOutlined />}]

    useEffect(()=>{
        dispatch(tagThunks.listTags())
        dispatch(bugThunks.listBugs())
    }, [])

    const response = {
        occupy: ()=>{},
        handleCancelAdd: ()=>{
            setShowAddForm(false)
        },
        handleGoAdd: ()=>{
            setShowAddForm(true)
        },
        handleClose: ()=>{
            setShowDetail(false)
            setShowAddForm(false)
        },
        handleAddBug: async (bug:IAddBugDto)=>{
            let result:any = await dispatch(bugThunks.addBug(bug))
            if(result){
                dispatch(bugThunks.listBugs())
                setShowAddForm(false)
            }
        },
        handlePageChange:(pageId:number)=>{
            dispatch(bugThunks.listBugs({page:pageId-1}))
        },
        handleChosenBugItem: async (id:number)=>{
            await dispatch(bugThunks.getBugDetail(id))
            setShowDetail(true)
        },
        handleDelBug: async (id:number)=>{
            let result:any = await dispatch(bugThunks.deleteBug({id}))
            if(result){
                effToast.success_withdraw('Bug成功放入回收站', ()=>response.withdrawDelBug(id))
                dispatch(bugThunks.listBugs({page}))
                setShowDetail(false)
            }
        },
        withdrawDelBug: async (id:number)=>{
            let result:any = await dispatch(bugThunks.withdrawDelBug({id}))
            if(result){
                effToast.success('撤销成功');
                dispatch(bugThunks.listBugs({page}))
            }
        }
    }

    const bugList = bugs.map((item:any, index)=><BugItem showBg={index%2==0} bug={item} onChosen={response.handleChosenBugItem} key={item.id}/>)

    return (
        <div className="flex-grow-1 d-flex-column">
            <div style={{height:'40px'}} className="d-flex justify-end mt20 mb20 align-center">
                {isShowSearchResult && !isAdvanceSearch &&  <EffSearchResult value={totalNum} onClose={response.occupy}/>}
                {isAdvanceSearch? <TestCaseAdvanceSearch onSearch={response.occupy} onCancel={response.occupy} tags={tags}/> :
                    <EffSearchArea onSearch={response.occupy} menuSelected={response.occupy} menus={searchMenus}/>}
                <EffButton width={100} onClick={response.handleGoAdd} type={"line"}  round={true} className="ml10 mr20" text={'+ 新增Bug'} key={'add'}/>
            </div>

            <div style={{height:'100%'}} className="d-flex-column">

                {totalNum==0? <EffEmpty description={'暂无用例'} />:bugList}
                {totalNum>0 && <Pagination className="mt20 mr20 align-self-end" onChange={response.handlePageChange} current={page+1} defaultCurrent={1} total={totalNum}/>}


                <Drawer
                    title={null}
                    width={'60%'}
                    placement="right"
                    closable={false}
                    onClose={response.handleClose}
                    maskClosable={true}
                    visible={showAddForm||showDetail}
                >
                    {showAddForm && <AddBugForm onConfirm={response.handleAddBug} onCancel={response.handleCancelAdd} tags={tags}/>}
                    {showDetail && <BugDetail onDel={response.handleDelBug}/>}
                </Drawer>



            </div>
        </div>
    )
}
