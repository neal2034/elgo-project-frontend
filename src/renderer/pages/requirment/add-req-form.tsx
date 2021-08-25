import React, {useState} from "react";
import './requirment.less'
import {Col, Form, Input, Row, Select} from "antd";
import EffTagArea from "../../components/common/eff-tag-area/eff-tag-area";
import EffTagSelector from "../../components/common/eff-tag-selector/eff-tag-selector";
import EffEditor from "../../components/common/eff-editor/eff-editor";
import EffButton from "../../components/eff-button/eff-button";
import requirement from "./requirement";
import {CaretDownOutlined} from '@ant-design/icons'



type Requirement = {
    name:string|null,
    description:string|null,
    classId:number|null,
    versionId:number|null,
    sourceId: number|null,
    tagIds: number[],

}


interface IAddReqFormProps{
    reqClasses: any[],
    reqSources: any[],
    reqVersions: any[],
    tags:any[],
    onCancel:Function,
    onConfirm:(requirement:Requirement)=>void
}

//新增需求表单
export  default  function AddReqForm(props:IAddReqFormProps){
    const data:{requirement:Requirement, [x:string]:any} = {
        requirement:{
            name:null,
            description:null,
            classId: null,
            versionId: null,
            sourceId:  null,
            tagIds: [],

        },
    }
    const {reqClasses, reqSources,reqVersions, tags, onConfirm} = props
    const [selectedTagIds, setSelectedTagIds] = useState<number[]>([])
    const [selectedTags, setSelectedTags] = useState<any[]>([])



    const [reqForm] = Form.useForm()
    const response = {
        handleCancelBtn: ()=>{
            props.onCancel()
        },
        handleDescriptionChange: (html:string)=>{
            data.requirement.description = html
        },

        //新增需求响应
        handleConfirmAdd: ()=>{
            reqForm.validateFields().then(values=>{
                Object.assign(data.requirement, values)
                data.requirement.tagIds = selectedTagIds
                onConfirm(data.requirement)

            })
        },
        handleTagsChanged: (tagIds:number[])=>{
            setSelectedTagIds(tagIds)
            data.requirement.tagIds = tagIds
            let selectTags = tags.filter(item=>tagIds.indexOf(item.id)>-1)
            setSelectedTags(selectTags)
        }
    }

    const ui = {
        uiReqClassOptions: reqClasses.map(item=> <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>),
        uiReqResourceOptions: reqSources.map(item => <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>),
        uiReqResourceVersions: reqVersions.map(item => <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>)
    }



    return (
        <div className="add-req-form">
            <Form form={reqForm} requiredMark={false} >
                <Form.Item name="name"  label={'需求名称'} rules={[{ required: true, message: '请输入需求名称' }]}>
                    <Input/>
                </Form.Item>

                <Row  gutter={40}>
                    <Col  span={12}>
                        <Form.Item name="classId"  className="mt20"  label={'需求分类'}>
                            <Select placeholder="请选择需求分类" suffixIcon={<CaretDownOutlined />}>
                                {ui.uiReqClassOptions}
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col  span={12}>
                        <Form.Item  name="sourceId"   className="mt20"   label={'需求来源'}>
                            <Select placeholder="请选择需求来源" suffixIcon={<CaretDownOutlined />}>
                                {ui.uiReqResourceOptions}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={40}>
                    <Col span={12}>
                        <Form.Item  name="versionId" className="mt20"   label={'版本规划'}>
                            <Select placeholder="请选择需求版本" suffixIcon={<CaretDownOutlined />}>
                                {ui.uiReqResourceVersions}
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item className="mt20"   label={'标签'}>
                            <div className="d-flex ml40">
                                <EffTagArea tags={selectedTags}/>
                                <EffTagSelector onChange={response.handleTagsChanged} chosen={selectedTagIds} className="ml404" tags={tags}/>
                            </div>
                        </Form.Item>
                    </Col>

                </Row>
                <Form.Item name="description" className="mt20" label={'需求描述'}>
                    <EffEditor onChange={response.handleDescriptionChange}/>
                </Form.Item>
            </Form>

            <div className="btn-group d-flex mt40">
                <EffButton type={"line"} round={true} className="mr20" onClick={response.handleCancelBtn} text={'取消'} key={'cancel'}/>
                <EffButton type={'filled'} round={true} onClick={response.handleConfirmAdd} text={'保存'} key={'confirm'}/>
            </div>

        </div>
    )
}
