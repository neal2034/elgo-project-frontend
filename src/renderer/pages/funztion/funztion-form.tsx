import React, {useEffect, useState} from "react";
import {Select, Form, Input} from "antd";
import EffTagArea from "../../components/common/eff-tag-area/eff-tag-area";
import EffTagSelector from "../../components/common/eff-tag-selector/eff-tag-selector";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store/store";
import {reqActions, reqThunks} from "@slice/reqSlice";
import EffButton from "../../components/eff-button/eff-button";
import EffEditor from "../../components/common/eff-editor/eff-editor";



interface IProps{
    tags:any[],
    onCancel:()=>void,
    onConfirm:(funztionData:IFunztionData)=>void
}

interface IFunztionData{
    name:string,
    requirementId?:number,
    tagIds?:number[],
    description?:string

}


export default function FunztionForm(props:IProps){

    const {tags, onCancel, onConfirm} = props

    const dispatch = useDispatch()
    const [funztionForm] = Form.useForm()
    const [reqOptions, setReqOptions] = useState<any>([])
    const [selectedTagIds, setSelectedTagIds] = useState<number[]>([])
    const [selectedTags, setSelectedTags] = useState<any[]>([])


    const data = {
        filteredReqs: useSelector((state:RootState)=>state.requirement.requirements)
    }
    useEffect(()=>{
        const options = data.filteredReqs.map((d:any) => <Select.Option key={d.id} value={d.id}>{d.name}</Select.Option>);
        setReqOptions(options)
    }, [data.filteredReqs])

    const response = {
        occupy: ()=>{
            //TODO 替换函数
        },
        searchReqs: async (value:string)=>{
            if(value){
                await dispatch(reqThunks.listPageRequirement({page:0, name:value}))

            }else{
                dispatch(reqActions.setRequirements([]))

            }

        },
        handleConfirmAdd: ()=>{
            funztionForm.validateFields().then(values=>{
                const funztionData:IFunztionData = Object.assign({},values)
                funztionData.tagIds = selectedTagIds
                onConfirm(funztionData)
            })
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
        handleCancelBtn: ()=>{
            onCancel()
        }

    }




    return (
        <div className="eff-funztion-form">
            <div className="title  pb10 mb20">
                <span>新增功能</span>
            </div>
            <Form colon={false}  form={funztionForm}  requiredMark={false} >
                <Form.Item name="name"  label={'功能名称'} rules={[{ required: true, message: '请输入功能名称' }]}>
                    <Input size={"large"}/>
                </Form.Item>


                <Form.Item name="req"  label={'所属需求'} >
                    <Select showSearch
                            allowClear
                            onSearch={response.searchReqs}
                            defaultActiveFirstOption={false}
                            showArrow={false}
                            filterOption={false}
                            notFoundContent={null}
                            size={"large"}
                    >
                        {reqOptions}
                    </Select>
                </Form.Item>

                <Form.Item className="mt20"   label={'标签'}>
                    <div className="d-flex ml40">
                        <EffTagArea onDel={response.onDelTag} tags={selectedTags}/>
                        <EffTagSelector onChange={response.handleTagsChanged} chosen={selectedTagIds}  tags={tags}/>
                    </div>
                </Form.Item>

                <Form.Item  name="description" className="mt20 d-flex align-start" label={'功能描述'}>
                    <EffEditor height={360} onChange={response.occupy}/>
                </Form.Item>
            </Form>

            <div className="btn-group d-flex mt40">
                <EffButton type={"line"} round={true} className="mr20" onClick={response.handleCancelBtn} text={'取消'} key={'cancel'}/>
                <EffButton type={'filled'} round={true} onClick={response.handleConfirmAdd} text={'保存'} key={'confirm'}/>
            </div>
        </div>
    )
}
