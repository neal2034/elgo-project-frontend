import React, {useEffect, useState} from "react";
import './funztion.less'
import EffEmpty from "../../components/common/eff-empty/eff-empty";
import FunztionItem from "./funztion-item";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store/store";
import {funztionThunks} from "@slice/funztionSlice";
import {Drawer, Pagination} from "antd";
import RequirementDetail from "../requirment/requirement-detail";
import FunztionDetail from "./funztion-detail";
import EffToast from "../../components/eff-toast/eff-toast";
import {reqActions, reqThunks} from "@slice/reqSlice";


interface IProps{
    funztions:any[],
}

export default function FunztionContent(props:IProps){
    const dispatch = useDispatch()
    const {funztions} = props
    const funztionStatus = useSelector((state:RootState)=>state.funztion.funztionStatus)
    const isToastOpen =  useSelector((state:RootState)=>state.funztion.funztionToast)
    const currentPage = useSelector((state:RootState)=>state.funztion.page)
    const totalFunztion = useSelector((state:RootState)=>state.funztion.funzTotal)
    const [showDetail, setShowDetail] = useState(false) //显示功能详情
    const [isToastWithdraw, setIsToastWithdraw] = useState(false)    //toast 是否包含撤销
    const [toastMsg, setToastMsg] = useState<string>()
    const [lastDelFunztionId, setLastDelFunztionId] = useState(-1)
    useEffect(()=>{
        dispatch(funztionThunks.listFunztionStatus())
    },[])

    const response = {
        handleItemChosen: async (id:number)=>{
            await dispatch(funztionThunks.getFunztionDetail(id))
            setShowDetail(true)
        },
        handleDelFunztion: async (id:number)=>{
            setToastMsg('功能放入回收站成功')
            setIsToastWithdraw(true)
            dispatch(funztionThunks.delFunztion(id))
            setLastDelFunztionId(id)
            setShowDetail(false)


        },
        handleWithdrawDelFunztion: ()=>{
            setIsToastWithdraw(false)
            setToastMsg('撤销成功')
           dispatch(funztionThunks.withdrawDelFunztion(lastDelFunztionId))
            setLastDelFunztionId(-1)
        },
        handlePageChange: (page:number)=>{
            dispatch(funztionThunks.listFunztion({page:page-1}))
        }
    }
    const ui = {
        funztionList : funztions.map((item,index)=><FunztionItem key={item.id} showBg={index%2==0} id={item.id} serial={item.serial}
                                                                 name={item.name} statusId={item.statusId} status={funztionStatus} onChosen={response.handleItemChosen}/>)
    }

    return (
        <div className="eff-funztion-content d-flex-column">
            {funztions.length==0? <EffEmpty description={'暂无功能'} />:ui.funztionList}
            {funztions.length>0 && <Pagination className="mt20 mr20 align-self-end" onChange={response.handlePageChange} current={currentPage+1} defaultCurrent={1} total={totalFunztion}/>}
            <Drawer
                title={null}
                width={'60%'}
                placement="right"
                closable={false}
                visible={showDetail}
                onClose={()=>setShowDetail(false)}
            >
                <FunztionDetail onDel={response.handleDelFunztion} />
            </Drawer>
            <EffToast onWithDraw={response.handleWithdrawDelFunztion} open={isToastOpen} message={toastMsg as string} isWithDraw={isToastWithdraw} onClose={()=>dispatch(reqActions.setReqToast(false))}/>
        </div>
    )

}
