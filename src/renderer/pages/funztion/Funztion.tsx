import React, {useEffect, useState} from "react";
import FunztionContent from "./funztion-content";
import EffSearchResult from "../../components/business/eff-search-result/eff-search-result";
import ReqAdvanceSearch from "../requirment/req-advance-search";
import EffSearchArea from "../../components/business/eff-search-area/eff-search-area";
import EffButton from "../../components/eff-button/eff-button";
import FunztionAdvanceSearch from "./funztion-advance-search";
import {UserAddOutlined, FieldTimeOutlined} from '@ant-design/icons'
import './funztion.less'
import {Drawer} from "antd";
import FunztionForm from "./funztion-form";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store/store";
import {tagThunks} from "@slice/tagSlice";
import {funztionThunks} from "@slice/funztionSlice";


export default function Funztion(){
    const dispatch = useDispatch()
    const [isAdvanceSearch, setIsAdvanceSearch] = useState(false)
    const [isShowSearchResult, setIsShowSearchResult] = useState(false)
    const [isOpenAddForm, setIsOpenAddForm] = useState(false)

    const data = {
        tags: useSelector((state:RootState)=>state.tag.tags),
        funztions: useSelector((state:RootState)=>state.funztion.funztions),
        searchMenus: [
            {key:'my-create', name:'我创建的需求', icon:<UserAddOutlined />},
            {key:'on-plan', name:'规划中的需求', icon:<FieldTimeOutlined />},

        ]
    }

    useEffect(()=>{
        dispatch(funztionThunks.listFunztion({page:0}))
        dispatch(tagThunks.listTags())
    },[])

    const response = {
        occupy: ()=>{},
        handleAddFunztion: async (funztion:any)=>{
            await dispatch(funztionThunks.addFunztion(funztion))
            setIsOpenAddForm(false)
        },
        handleCancelAdd: ()=>{
            setIsOpenAddForm(false)
        }

    }

    return (
        <div className="flex-grow-1 d-flex-column eff-funztions">
            <div className="d-flex justify-end mt20 mb20 align-center">
                {isShowSearchResult && !isAdvanceSearch &&  <EffSearchResult value={22} onClose={response.occupy}/>}
                {isAdvanceSearch? <FunztionAdvanceSearch/> :
                    <EffSearchArea onSearch={response.occupy} menuSelected={response.occupy} menus={data.searchMenus}/>}
                <EffButton width={100} onClick={()=>setIsOpenAddForm(true)} type={"line"}  round={true} className="ml10 mr20" text={'+ 新增功能'} key={'add'}/>
            </div>
            <FunztionContent funztions={data.funztions}/>
            <Drawer
                title={null}
                width={'60%'}
                placement="right"
                closable={false}
                maskClosable={false}
                visible={isOpenAddForm}
            >
                <FunztionForm tags={data.tags} onCancel={response.handleCancelAdd} onConfirm={response.handleAddFunztion}/>
            </Drawer>
        </div>
    )
}
