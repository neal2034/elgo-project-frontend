import React, {useEffect, useState} from "react";
import {MoreOutlined, PlusSquareOutlined,FormOutlined,DeleteOutlined} from '@ant-design/icons'
import './requirment.less'
import {ProjectTollBar} from "../projectHome/projectHome";
import EffButton from "../../components/eff-button/eff-button";
import {Col, Drawer, Pagination, Form, Input, Popover, Row, Tag} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {reqThunks} from "@slice/reqSlice";
import {RootState} from "../../store/store";
import {tagThunks} from "@slice/tagSlice";
import AddReqClazzDlg from "./add-req-clazz-dlg";
import DelReqClazzDlg from "./del-req-clazz-dlg";
import AddReqForm from "./add-req-form";
import RequirementItem from "./requirement-item";
import RequirementDetail from "./requirement-detail";

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
    onSelected: Function, //点击选中事件响应
}



export default function Requirement(){
    const dispatch = useDispatch()

    const [showAddForm, setShowAddForm] = useState(false);

    const data = {
        reqClasses: useSelector((state:RootState)=>state.requirement.reqClasses),
        rqeSources: useSelector( (state:RootState) => state.requirement.reqSources),
        reqVersions: useSelector((state:RootState)=>state.requirement.reqVersions),
        tags: useSelector((state:RootState)=>state.tag.tags),
        requirements: useSelector((state:RootState)=>state.requirement.requirements)
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
        handleRequirementSelected: ()=>{},

        handleRequirementAdd:async (requirement:any)=>{
            await dispatch(reqThunks.addRequirement(requirement))
            setShowAddForm(false)
        }
    }


    return (
        <div className={'d-flex-column'}>
            <ProjectTollBar>
                <EffButton width={100} onClick={response.handleAddReqBtn}  round={true} className="mt10 ml20" text={'+ 新增需求'} key={'add'}/>
            </ProjectTollBar>
            <div className={'d-flex'}>
                <ReqClass reqClasses={data.reqClasses}/>
                <ReqContent requirements={data.requirements} onSelected={response.handleRequirementSelected}/>
            </div>
            <Drawer
                title="新增需求"
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
        <div className={'requirement-class ml20 mt20'}>
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
    // dispatch(reqThunks.getReqDetail(24))
    const response = {
        pageChange:(page:number)=>{
            dispatch(reqThunks.listPageRequirement({page:page-1}))
            setCurrentPage(page)
        },
        onReqChosen:(id:number)=>{
            dispatch(reqThunks.getReqDetail(id))
            setShowDetail(true)
        },

    }

    const ui = {
        reqList: requirements.map((item,index)=><RequirementItem onChosen={response.onReqChosen} key={item.id} version={item.version && item.version.name} showBg={index%2==0} id={item.id} serial={item.serial} name={item.name} status={item.status} />),
    }

    return (
        <div className={'requirement-content ml20 mt20 mr20 d-flex-column'}>
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
                <RequirementDetail/>
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
    console.log('name change to ', name)
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




