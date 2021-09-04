import React from "react";
import EffEditableInput from "../../components/common/eff-editable-input/eff-editable-input";
import EffActions from "../../components/business/eff-actions/eff-actions";
import EffItemInfo from "../../components/business/eff-item-info/eff-item-info";
import EffInfoSep from "../../components/business/eff-info-sep/eff-info-sep";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store/store";
import {DeleteOutlined} from '@ant-design/icons'


interface IProps{
    onDel:(id:number)=>void
}


export default function TestPlanDetail(props:IProps){

    const dispatch = useDispatch()

    const currentTestPlan = useSelector((state:RootState)=>state.testPlan.currentTestPlan)
    const menuItems = [{key:'delete', name:'删除计划', icon:<DeleteOutlined style={{fontSize:'14px'}}/>},]


    const response = {
        occupy: ()=>{},
        handleMenuSelected:async ()=>{

            props.onDel(currentTestPlan.id)

        },
    }
    return (
        <div className="pt40 pl40 pr40 pb40">
            <div className="d-flex justify-between align-center">
                <EffEditableInput errMsg={'请输入计划名称'} className="flex-grow-1" isRequired={true} onChange={response.occupy} value={currentTestPlan.name} placeholder={'请输入计划名称'} />
                <EffActions onSelect={response.handleMenuSelected} menus={menuItems} className="ml40"  width={'30px'}/>
            </div>
            <EffItemInfo className="ml10" serial={ currentTestPlan.serial!} creator={currentTestPlan.creator}/>
            <EffInfoSep className="mt20 ml10" name={'基础信息'} />
        </div>
    )
}
