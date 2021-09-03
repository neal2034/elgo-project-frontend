import React, {useEffect, useState} from "react";
import {Checkbox, Form, Input, Pagination, Select, Tag} from "antd";
import EffTagArea from "../../components/common/eff-tag-area/eff-tag-area";
import EffTagSelector from "../../components/common/eff-tag-selector/eff-tag-selector";
import EffEditor from "../../components/common/eff-editor/eff-editor";
import EffButton from "../../components/eff-button/eff-button";
import {useDispatch, useSelector} from "react-redux";
import EffSearchArea from "../../components/business/eff-search-area/eff-search-area";
import {UserAddOutlined} from '@ant-design/icons'
import {RootState} from "../../store/store";
import {funztionThunks} from "@slice/funztionSlice";
import FunztionItem from "../funztion/funztion-item";
import './test-plan.less'
import {testPlanThunks} from "@slice/testPlanSlice";
import {testCaseThunks} from "@slice/testCaseSlice";
import EffSearchResult from "../../components/business/eff-search-result/eff-search-result";
import FunztionAdvanceSearch from "../funztion/funztion-advance-search";
import EffLabel from "../../components/business/eff-label/EffLabel";


interface IProps{
    tags:any[],
    onCancel:Function,
    onConfirm:(testPlanData:ITestPlanData)=>void
}

interface ITestPlanData{
    name:string,
    funztionIds?:number[],
}


export default function AddTestPlanForm(props:IProps){
    const dispatch = useDispatch()
    const {tags, onCancel, onConfirm} = props
    const [testPlanForm] = Form.useForm()
    const searchMenus = [{key:'done', name:'已完成的', icon:<UserAddOutlined />}]
    const [isAdvanceSearch, setIsAdvanceSearch] = useState(false)
    const [isShowSearchResult, setIsShowSearchResult] = useState(false)
    const funztionStatus = useSelector((state:RootState)=>state.funztion.funztionStatus)
    const funztions = useSelector((state:RootState)=>state.funztion.funztions)
    const page = useSelector((state:RootState)=>state.funztion.page)
    const totalFunztionNum = useSelector((state:RootState)=>state.funztion.funzTotal)
    const [selectedFunztionIds, setSelectedFunztionIds] = useState<number[]>([])
    const [isSelectAll, setIsSelectAll] = useState(false)


    useEffect(()=>{
        dispatch(funztionThunks.listFunztionStatus())
        dispatch(funztionThunks.listFunztion({page:0}))
    },[])
    useEffect(()=>{
            let selectAll = true
            for(let funztion of funztions){
                if(selectedFunztionIds.indexOf(funztion.id)===-1){
                    selectAll = false
                }
            }
            setIsSelectAll(selectAll)
        },
        [funztions, selectedFunztionIds])
    const response = {
        handleFunztionSelected:(id:number, selected:boolean)=>{
            let tempIds = Object.assign([], selectedFunztionIds)
            if(selected){
                tempIds.push(id)
            }else {
                let index = tempIds.indexOf(id)
                tempIds.splice(index, 1)
            }
            setSelectedFunztionIds(tempIds)
        },
        handleSave: async ()=>{
            let values = await testPlanForm.validateFields()
            let data = {name:values.name, functionIds:selectedFunztionIds}
            onConfirm(data)
        },
        handlePageChange:async (pageId:number)=>{
            await dispatch(funztionThunks.listFunztion({page:pageId-1}))

        },
        handleSearchFunztion: async (value:string)=>{
            await dispatch(funztionThunks.listFunztion({page:0, name:value}))
            setIsShowSearchResult(true)
        },
        handleCloseSearch:  ()=>{
            dispatch(funztionThunks.listFunztion({page:0}))
            setIsShowSearchResult(false)
        },
        handleSearchMenu: (key:string)=>{
            switch (key){
                case 'done':
                    console.log('搜索我创建的')
                    break
                default:
                    setIsAdvanceSearch(true)
            }
        },
        handleCancelAdvanceSearch: ()=>{
            setIsAdvanceSearch(false)
        },
        handleAdvanceSearch: async (searchKeys:any)=>{
            let params = Object.assign({page:0}, searchKeys)
            await dispatch(funztionThunks.listFunztion(params))
            setIsAdvanceSearch(false)
            setIsShowSearchResult(true)
        },
        handleSelectAll: (e:any)=>{
            let selected = e.target.checked
            setIsSelectAll(selected)
            if(selected){
                let notSelectIds = []
                for(let funztion of funztions){
                    if(selectedFunztionIds.indexOf(funztion.id)===-1){
                        notSelectIds.push(funztion.id)
                    }
                }
                let tempIds = notSelectIds.concat(selectedFunztionIds)
                setSelectedFunztionIds(tempIds)
            }else{
                let tempIds = Object.assign([], selectedFunztionIds)
                for(let funztion of funztions){
                    let index = tempIds.indexOf(funztion.id)
                    if(index>-1){
                        tempIds.splice(index, 1)
                    }
                }
                setSelectedFunztionIds(tempIds)
            }
        }
    }
    const ui = {
        funztionList: funztions.map((item:any,index)=><FunztionSelectItem key={item.id}
                                                                          id={item.id}
                                                                          selected={selectedFunztionIds.indexOf(item.id)>-1}
                                                                          status={funztionStatus}
                                                                          showBg={index%2==0}
                                                                          statusId={item.statusId}
                                                                          onSelected={response.handleFunztionSelected}
                                                                          name={item.name} serial={item.serial}/>)
    }

    return (<div className="eff-add-test-case-form">
        <div className="title  pb10 mb20">
            <span>新增计划</span>
        </div>
        <Form initialValues={{priority:'NONE'}} colon={false}  form={testPlanForm}  requiredMark={false} >
            <Form.Item name="name"  label={'计划名称'} rules={[{ required: true, message: '请输入计划名称' }]}>
                <Input size={"large"}/>
            </Form.Item>


        </Form>
        <div className="d-flex-column">
            <div className="d-flex justify-between align-center">
                <EffLabel name={'添加测试'}/>
                <div style={{height:'40px'}}  className="d-flex justify-end mt20 mb20 align-center">
                    {isShowSearchResult && !isAdvanceSearch &&  <EffSearchResult value={totalFunztionNum} onClose={response.handleCloseSearch}/>}
                    {isAdvanceSearch? <FunztionAdvanceSearch onSearch={response.handleAdvanceSearch} onCancel={response.handleCancelAdvanceSearch} tags={tags}/> :
                        <EffSearchArea onSearch={response.handleSearchFunztion} menuSelected={response.handleSearchMenu} menus={searchMenus}/>}
                </div>
            </div>
            <div className="mt10 ml40">
                {ui.funztionList}
                <div className="d-flex justify-between align-center">
                    <Checkbox checked={isSelectAll} onChange={response.handleSelectAll} className="ml20">当页全选</Checkbox>
                    <Pagination className="mt20 mr20 align-self-end" onChange={response.handlePageChange} current={page+1} defaultCurrent={1} total={totalFunztionNum}/>
                </div>
            </div>

        </div>

        <div className="btn-group d-flex mt40">
            <EffButton type={"line"} round={true} className="mr20" onClick={()=>onCancel()} text={'取消'} key={'cancel'}/>
            <EffButton type={'filled'} round={true} onClick={response.handleSave} text={'保存'} key={'confirm'}/>
        </div>
    </div>)

}


interface IFunztionSelectItemProps{
    id:number,
    showBg?:boolean,
    serial:number,
    name:string,
    status:any,
    statusId:number,
    selected:boolean,
    onSelected:(id:number, selected:boolean)=>void,

}

function FunztionSelectItem(props:IFunztionSelectItemProps){
    const {id,showBg,serial,name,status,statusId,onSelected,selected} = props
    let theStatus:{name:string, color:string} = status.filter((item:any)=>item.id === statusId)[0]

    const response = {
        handleChange:(event:any)=>{
            const selected = event.target.checked
            onSelected(id, selected)
        }
    }

    return (
        <div  className={`funztion-select-item d-flex align-center pr20 justify-between pl20 ${showBg?'shadowed':''}`}  >
            <div className="funz-main">
                <Checkbox checked={selected} onChange={response.handleChange} />
                <span className="ml10">{serial}</span>
                <span className="ml20">{name}</span>
            </div>
            <div>
                <Tag className="ml10" color={theStatus.color}>{theStatus.name}</Tag>
            </div>
        </div>
    )
}
