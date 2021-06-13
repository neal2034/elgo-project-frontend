/**
 * 组件： 用于描述内容区Tab 区域
 */
import React, {useEffect, useRef, useState} from "react";
import "./api-wrapper.less"
import {PlusOutlined} from '@ant-design/icons'
import {useSelector} from "react-redux";
import {RootState} from "../../../store/store";
import {Select} from "antd";
import {useDispatch} from "react-redux";
import {API, apiActions, apiThunks} from '@slice/apiSlice'
import ApiTab from "./api-tab";
import IconSetting from '@imgs/setting.png'
import ApiEnvsDlg from "../dialogs/api-envs-dialog";
const { Option } = Select;


interface IApiTabsProps{
    maxContentWidth:number
}

export default function ApiTabs(props:IApiTabsProps){
    const {maxContentWidth} = props;
    const dispatch = useDispatch()
    const [apiEnvDlgVisible, setApiEnvDlgVisible] = useState(false)
    let activeApis = useSelector((state:RootState) => state.api.activeApis)
    const activeTabs = activeApis.map(item=>{
        return <ApiTab api={item} key={item.serial}/>
    })

    const handleAddActiveApi = ()=>{
        dispatch(apiActions.addActiveApi())
    }

    useEffect(()=>{
        dispatch(apiThunks.listApiEnvs())
    }, [dispatch])

    const handler = {
        closeEnvDlg: ()=>{
            setApiEnvDlgVisible(false)
        }
    }

    return (
        <div className="d-flex justify-between">
            <div   className="tabs d-flex" style={{maxWidth:maxContentWidth+'px'}}>
                <div className="tab-wrapper">
                    {activeTabs}
                </div>
                <div onClick={handleAddActiveApi} className="btn-add d-flex justify-center align-center cursor-pointer">
                    <PlusOutlined />
                </div>
            </div>
            <div className="d-flex align-center env-selector mb5">
                <Select placeholder={"未指定环境"} style={{width:'200px'}}/>
                <img onClick={()=>setApiEnvDlgVisible(true)} src={IconSetting} className="ml5 cursor-pointer" width={14} height={14} />
            </div>
             <ApiEnvsDlg visible={apiEnvDlgVisible} onClose={handler.closeEnvDlg}/>
        </div>

    )
}
