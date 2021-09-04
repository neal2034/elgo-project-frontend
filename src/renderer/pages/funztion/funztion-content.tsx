import React, {useEffect, useState} from "react";
import './funztion.less'
import EffEmpty from "../../components/common/eff-empty/eff-empty";
import FunztionItem from "./funztion-item";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store/store";
import {funztionThunks} from "@slice/funztionSlice";
import {Drawer, Pagination} from "antd";
import FunztionDetail from "./funztion-detail";
import EffToast from "../../components/eff-toast/eff-toast";
import {reqActions} from "@slice/reqSlice";
import {effToast} from "@components/common/eff-toast/eff-toast";


interface IProps{
    funztions:any[],
}

export default function FunztionContent(props:IProps){
    const dispatch = useDispatch()
    const {funztions} = props
    const funztionStatus = useSelector((state:RootState)=>state.funztion.funztionStatus)
    const currentPage = useSelector((state:RootState)=>state.funztion.page)
    const totalFunztion = useSelector((state:RootState)=>state.funztion.funzTotal)
    const [showDetail, setShowDetail] = useState(false) //显示功能详情
    useEffect(()=>{
        dispatch(funztionThunks.listFunztionStatus())
    },[])

    const response = {
        handleItemChosen: async (id:number)=>{
            await dispatch(funztionThunks.getFunztionDetail(id))
            setShowDetail(true)
        },
        handleDelFunztion: async (id:number)=>{
            let result:any = await dispatch(funztionThunks.delFunztion(id))
            if(result){
                setShowDetail(false)
                effToast.success_withdraw('功能放入回收站成功', ()=>response.handleWithdrawDelFunztion(id))
            }
        },
        handleWithdrawDelFunztion: async (id:number)=>{
           let result:any = await dispatch(funztionThunks.withdrawDelFunztion(id))
            if(result){
                effToast.success('撤销成功')
            }
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
         </div>
    )

}
