import React, {useEffect, useState} from "react";
import {Form, Input, Select} from "antd";
import EffTagArea from "../../components/common/eff-tag-area/eff-tag-area";
import EffTagSelector from "../../components/common/eff-tag-selector/eff-tag-selector";
import EffButton from "../../components/eff-button/eff-button";
import './test-case.less'
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store/store";
import {funztionActions, funztionThunks} from "@slice/funztionSlice";
import {CaretDownOutlined} from '@ant-design/icons'
import {PRIORITY} from "@config/sysConstant";
import ReactElgoEditor from "@components/common/react-elgo-editor/react-elgo-editor";



interface IProps{
    tags:any[],
    funztionId?:number,         // 对应功能ID
    onCancel:()=>void,
    onConfirm:(testCaseData:ITestCaseData)=>void
}

interface ITestCaseData{
    name:string,
    priority?:string,
    description?:string,
    funztionId?:number,
    tagIds?:number[],
}


export default function AddTestCaseForm(props:IProps){
    const {tags, onConfirm, onCancel, funztionId} = props
    const dispatch = useDispatch()
    const [testCaseForm] = Form.useForm()
    const [funztionOptions, setFunztionOptions] = useState<any>();
    const [selectedTagIds, setSelectedTagIds] = useState<number[]>([])
    const [selectedTags, setSelectedTags] = useState<any[]>([])
    const funztions = useSelector((state:RootState)=>state.funztion.funztions)

    useEffect(()=>{
        const options = funztions.map((d:any) => <Select.Option key={d.id} value={d.id}>{d.name}</Select.Option>);
        setFunztionOptions(options)
    }, [funztions])

    const response = {
        handleAddTask: async ()=>{
            const values = await testCaseForm.validateFields()
            const testCaseData:ITestCaseData = Object.assign({}, {funztionId}, values)
            testCaseData.tagIds = selectedTagIds
            onConfirm(testCaseData)

        },
        searchFunztions: async (value:string)=>{
            if(value){
                await dispatch(funztionThunks.listFunztion({page:0, name:value}))

            }else{
                dispatch(funztionActions.setFunztions([]))

            }

        },
        handleTagsChanged: (tagIds:number[])=>{
            setSelectedTagIds(tagIds)
            const selectTags = tags.filter(item=>tagIds.indexOf(item.id)>-1)
            setSelectedTags(selectTags)
        },
        //响应标签删除
        onDelTag: (id:number)=>{
            const currentIds = Object.assign([], selectedTagIds)
            const index = currentIds.indexOf(id)
            currentIds.splice(index, 1)
            response.handleTagsChanged(currentIds)

        },
        handleCancelAdd: ()=>{
            onCancel()
        }
    }

    const ui = {
        priorityOptions: [] as any[]
    }
    for(const item in PRIORITY){
        ui.priorityOptions.push(<Select.Option key={PRIORITY[item].key} value={PRIORITY[item].key}>{PRIORITY[item].name}</Select.Option>)
    }


    return (<div className="eff-add-test-case-form">
        <div className="title  pb10 mb20">
            <span>新增用例</span>
        </div>
        <Form initialValues={{priority:'NONE'}} colon={false}  form={testCaseForm}  requiredMark={false} >
            <Form.Item name="name"  label={'用例名称'} rules={[{ required: true, message: '请输入用例名称' }]}>
                <Input size={"large"}/>
            </Form.Item>


            {!funztionId &&  <Form.Item name="funztionId"  label={'所属功能'} >
                <Select showSearch
                        allowClear
                        onSearch={response.searchFunztions}
                        defaultActiveFirstOption={false}
                        showArrow={false}
                        filterOption={false}
                        notFoundContent={null}
                        size={"large"}
                >
                    {funztionOptions}
                </Select>
            </Form.Item>}

            <div className="d-flex justify-between mt20">
                <Form.Item  name="priority" style={{width:'50%'}}  label={'优先级'}>
                    <Select  className="ml10" size={"large"}  suffixIcon={<CaretDownOutlined />}>
                        {ui.priorityOptions}
                    </Select>
                </Form.Item>

                <Form.Item name="tagIds"  style={{width:'50%', marginLeft:'60px'}} label={'标签'}>
                    <div className="d-flex ml40">
                        <EffTagArea onDel={response.onDelTag} tags={selectedTags}/>
                        <EffTagSelector onChange={response.handleTagsChanged} chosen={selectedTagIds}  tags={tags}/>
                    </div>
                </Form.Item>

            </div>

            <Form.Item  name="description" className="mt20 d-flex align-start" label={'用例描述'}>
                <ReactElgoEditor height={360}/>
            </Form.Item>
        </Form>

        <div className="btn-group d-flex mt40">
            <EffButton type={"line"} round={true} className="mr20" onClick={response.handleCancelAdd} text={'取消'} key={'cancel'}/>
            <EffButton type={'filled'} round={true} onClick={response.handleAddTask} text={'保存'} key={'confirm'}/>
        </div>
    </div>)

}
