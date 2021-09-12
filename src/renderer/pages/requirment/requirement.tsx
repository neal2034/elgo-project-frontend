import React, {useEffect, useState} from "react";
import {MoreOutlined, PlusSquareOutlined,FormOutlined,DeleteOutlined,FieldTimeOutlined,UserAddOutlined} from '@ant-design/icons'
import './requirment.less'
import EffButton from "../../components/eff-button/eff-button";
import {Drawer, Pagination, Popover} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {reqThunks} from "@slice/reqSlice";
import {RootState} from "../../store/store";
import {tagThunks} from "@slice/tagSlice";
import AddReqClazzDlg from "./add-req-clazz-dlg";
import DelReqClazzDlg from "./del-req-clazz-dlg";
import AddReqForm from "./add-req-form";
import RequirementItem from "./requirement-item";
import RequirementDetail from "./requirement-detail";
import EffSearchArea from "../../components/business/eff-search-area/eff-search-area";
import ReqAdvanceSearch from "./req-advance-search";
import EffSearchResult from "../../components/business/eff-search-result/eff-search-result";
import {effToast} from "@components/common/eff-toast/eff-toast";

interface IReqClassItemProps{
    id?:number,
    name:string,
    num:number,
    className?:string
}



//需求页面props
interface  IRequirement{
    name:string,
    id:number,
    serial:number,
    status:string,
    version?:{
        id:number,
        name:string
    }
}

interface IRequirementContentProps{
    requirements:IRequirement[], //当前显示的需求列表
}



export default function Requirement(){
    const dispatch = useDispatch()

    const [showAddForm, setShowAddForm] = useState(false);
    const [isAdvanceSearch, setIsAdvanceSearch] = useState(false)
    const [isShowSearchResult, setIsShowSearchResult] = useState(false)

    const data = {
        reqClasses: useSelector((state:RootState)=>state.requirement.reqClasses),
        rqeSources: useSelector( (state:RootState) => state.requirement.reqSources),
        reqVersions: useSelector((state:RootState)=>state.requirement.reqVersions),
        tags: useSelector((state:RootState)=>state.tag.tags),
        requirements: useSelector((state:RootState)=>state.requirement.requirements),
        totalReqNum: useSelector((state:RootState)=>state.requirement.reqTotal),
        searchMenus: [
            {key:'my-create', name:'我创建的需求', icon:<UserAddOutlined />},
            {key:'on-plan', name:'规划中的需求', icon:<FieldTimeOutlined />},

        ]
    }
    useEffect(()=>{
        dispatch(reqThunks.listPageRequirement({page:0}))
        dispatch(reqThunks.listAllReqClasses())
        dispatch(reqThunks.listAllReqSource())
        dispatch(reqThunks.listAllReqVersions())
        dispatch(tagThunks.listTags())
    },[])

    const response = {
        handleAddReqBtn: ()=>{
           setShowAddForm(true)
        },

        cancelAddReq: ()=>{
            setShowAddForm(false)
        },

        handleRequirementAdd:async (requirement:any)=>{
            await dispatch(reqThunks.addRequirement(requirement))
            setShowAddForm(false)
        },

        handleSearchMenu: (key:string)=>{
            switch (key){
                case 'my-create':
                    console.log('搜索我创建的')
                    break
                case 'on-plan':
                    console.log('搜索未完成的')
                    break
                default:
                    setIsAdvanceSearch(true)
            }
        },

        handleAdvanceSearch: async (searchKeys:any)=>{
            const params = Object.assign({page:0}, searchKeys)
            await dispatch(reqThunks.listPageRequirement(params))
            setIsAdvanceSearch(false)
            setIsShowSearchResult(true)
        },
        handleSearch: async (value:string)=>{
            await dispatch(reqThunks.listPageRequirement({page:0, name:value}))
            setIsShowSearchResult(true)
        },
        //取消高级搜索
        handleCancelAdvanceSearch: ()=>{
            setIsAdvanceSearch(false)
        },
        handleCloseSearch:()=>{
            setIsShowSearchResult(false)
            dispatch(reqThunks.listPageRequirement({page:0}))
        }
    }


    return (
        <div className={'d-flex-column'}>
            <div style={{height:'40px'}} className="d-flex justify-end mt20 mb20 align-center">
                {isShowSearchResult && !isAdvanceSearch &&  <EffSearchResult value={data.totalReqNum} onClose={response.handleCloseSearch}/>}
                {isAdvanceSearch? <ReqAdvanceSearch onCancel={response.handleCancelAdvanceSearch} onSearch={response.handleAdvanceSearch} reqClasses={data.reqClasses} reqSources={data.rqeSources} reqVersions={data.reqVersions} tags={data.tags} />:
                <EffSearchArea onSearch={response.handleSearch} menuSelected={response.handleSearchMenu} menus={data.searchMenus}/>}
                <EffButton width={100} onClick={response.handleAddReqBtn} type={"line"}  round={true} className="ml10 mr20" text={'+ 新增需求'} key={'add'}/>
            </div>
            <div className={'d-flex mt10'}>
                <ReqClass reqClasses={data.reqClasses}/>
                <ReqContent requirements={data.requirements}/>
            </div>
            <Drawer
                title={null}
                width={'60%'}
                placement="right"
                closable={false}
                maskClosable={false}
                visible={showAddForm}
            >
                 <AddReqForm reqClasses={data.reqClasses}
                             onConfirm={response.handleRequirementAdd}
                             tags={data.tags}
                             reqSources={data.rqeSources} reqVersions={data.reqVersions} onCancel={response.cancelAddReq}/>
            </Drawer>

        </div>
    )
}


//需求分类对话框
function ReqClass(props:any){
    const dispatch = useDispatch()
    const {reqClasses} = props
    const [showReqClazzDlg, setShowReqClazzDlg] = useState(false)
    let totalNum = 0
    reqClasses.forEach((item:any)=>{
        totalNum = totalNum + item.requirementNum
    })

    const ui = {
        reqClassItems: reqClasses.map((item:any)=><ReqClassItem id={item.id} key={item.id} className="pl40 mt10" name={item.name} num={item.requirementNum}/>)
    }

    const response = {
        handleAddReqClazz: async (name:string)=>{
             await  dispatch(reqThunks.addReqClazz(name))
            setShowReqClazzDlg(false)
        }
    }

    return (
        <div className={'requirement-class ml20'}>
            <div className="ml20 mt20 d-flex justify-between">
                <span className="title">需求分类</span>
                <Popover visible={showReqClazzDlg} content={<AddReqClazzDlg onConfirm={response.handleAddReqClazz} onCancel={()=>setShowReqClazzDlg(false)} isAdd={true}/>} trigger={'click'} placement={"bottom"}>
                    <PlusSquareOutlined onClick={()=>setShowReqClazzDlg(true)} className="mr20 cursor-pointer" style={{ fontSize:'16px'}} />
                </Popover>

            </div>
            <ReqClassItem className="mt20" name={'所有的'} num={totalNum}  />
            {ui.reqClassItems}
        </div>
    )
}


//需求列表内容
function ReqContent(props: IRequirementContentProps){
    const {requirements} = props
    const dispatch = useDispatch()
    const totalReq = useSelector((state:RootState)=>state.requirement.reqTotal)
    const [currentPage, setCurrentPage] = useState(1)
    const [showDetail, setShowDetail] = useState(false) //显示需求详情



    const response = {
        pageChange:(page:number)=>{
            dispatch(reqThunks.listPageRequirement({page:page-1}))
            setCurrentPage(page)
        },
        onReqChosen:(id:number)=>{
            dispatch(reqThunks.getReqDetail(id))
            setShowDetail(true)
        },
        onDeleteReq: async (id:number)=>{

          const result:any =  await dispatch(reqThunks.delRequirement(id))
            if(result){
                effToast.success_withdraw('需求放入回收站成功',()=>response.handleWithdrawDelReq(id))
                setShowDetail(false)
            }
        },
        handleWithdrawDelReq: async (id:number)=>{
            const result:any = await dispatch(reqThunks.withdrawDelRequirement(id))
            if(result ){
                effToast.success('撤销成功')
            }

        }

    }

    const ui = {
        reqList: requirements.map((item,index)=><RequirementItem onChosen={response.onReqChosen} key={item.id} version={item.version && item.version.name} showBg={index%2==0} id={item.id} serial={item.serial} name={item.name} status={item.status} />),
    }

    return (
        <div className={'requirement-content ml20   mr20 d-flex-column'}>
            {ui.reqList}
            <Pagination className="mt20 mr20 align-self-end" onChange={response.pageChange} current={currentPage} defaultCurrent={1} total={totalReq}/>

            <Drawer
                title={null}
                width={'60%'}
                placement="right"
                closable={false}
                visible={showDetail}
                onClose={()=>setShowDetail(false)}
            >
                <RequirementDetail onDel={response.onDeleteReq}/>
            </Drawer>
        </div>
    )
}



function ReqClassItem(props:IReqClassItemProps){
    const {name, num, className, id} = props
    const [showMenuTrigger,setShowMenuTrigger] = useState(false) //控制是否显示菜单触发器
    const [menuVisible, setMenuVisible] = useState(false) //控制是否显示菜单
    const response = {
        handleMenuLave : ()=>{
            setShowMenuTrigger(false)
            setMenuVisible(false)
        }
    }

    return (
        <div onMouseEnter={()=>setShowMenuTrigger(true)} onMouseLeave={response.handleMenuLave} className={`req-class-item pr20 align-center d-flex justify-between ${className}`}>
            <div className="pr40 flex-grow-1 d-flex justify-between">
                <span>{name}</span>
                <span>{num}</span>
            </div>
            <Popover visible={menuVisible} className={`${showMenuTrigger && id && id!==-1? 'show-menu':'hide-menu'}`} content={<ReqClassMenu id={id} name={name} onMouseLeave={response.handleMenuLave} />} placement={'bottom'} trigger={'click'}>
                <span > <MoreOutlined   onClick={()=>setMenuVisible(true)} style={{fontSize:'14px', fontWeight:'bold'}} /></span>
            </Popover>
        </div>
    )
}

function ReqClassMenu(props:any){
    const {name, id} = props
    const dispatch = useDispatch()
    const [showDelDlg, setShowDelDlg] = useState(false)
    const [showEditDlg, setShowEditDlg] = useState(false)

    const response = {
        confirmDelReqClazz: async()=>{
            await dispatch(reqThunks.delReqClazz(id))
            setShowDelDlg(false)
        },
        cancelDelReqClass:(e:any)=>{
            e.stopPropagation()
            setShowDelDlg(false)
        },
        cancelEditReqClazz: (e:any)=>{
            e.stopPropagation()
            setShowEditDlg(false)
        },
        confirmEditReqClazz: async (name:string)=>{
            await dispatch(reqThunks.editReqClazz(id,name))
            setShowEditDlg(false)
        }
    }

    return (
        <div {...props} className="req-clazz-menu">
            <div className="menu" onClick={()=>setShowEditDlg(true)}>
                <Popover visible={showEditDlg} placement={'bottom'} trigger={'click'}
                         content={<AddReqClazzDlg name={name} isAdd={false} onCancel={response.cancelEditReqClazz} onConfirm={(name)=>response.confirmEditReqClazz(name)}/>}>
                    <FormOutlined className="mr10"/> 编辑
                </Popover>

            </div>
            <div className="menu" onClick={()=>setShowDelDlg(true)}>
                <Popover visible={showDelDlg} placement={'bottom'} trigger={'click'} content={<DelReqClazzDlg
                    onCancel={response.cancelDelReqClass}
                    onConfirm={response.confirmDelReqClazz}
                    name={name} />}>
                    <DeleteOutlined  className="mr10" /> 删除
                </Popover>

            </div>

        </div>
    )
}




