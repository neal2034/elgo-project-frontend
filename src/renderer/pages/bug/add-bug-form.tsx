import React, { useState } from 'react';
import {
    Col, Form, Input, Row, Select,
} from 'antd';
import EffTagArea from '@components/common/eff-tag-area/eff-tag-area';
import EffTagSelector from '@components/common/eff-tag-selector/eff-tag-selector';
import EffButton from '@components/eff-button/eff-button';
import './bug.less';
import { CaretDownOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { BUG_SEVERITY } from '@config/sysConstant';
import ReactElgoEditor from '@components/common/react-elgo-editor/react-elgo-editor';
import { RootState } from '../../store/store';

interface IProps{
    tags:any[],
    onCancel:()=>void,
    onConfirm:(bugData:any)=>void
}

interface IBugData{
    name:string,
    testerId?: number,
    handlerId? :number,
    description? :string,
    severity: string,
    tagIds?: number[],
}

export default function AddBugForm(props:IProps) {
    const { tags, onCancel, onConfirm } = props;
    const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
    const [selectedTags, setSelectedTags] = useState<any>([]);
    const members = useSelector((state:RootState) => (state.project.projectDetail.members ? state.project.projectDetail.members : []));
    const [addForm] = Form.useForm();
    const response = {
        handleAddBug: async () => {
            const values = await addForm.validateFields();
            const bugData:IBugData = { ...values };
            bugData.tagIds = selectedTagIds;
            onConfirm(bugData);
        },
        handleTagsChanged: (tagIds:number[]) => {
            setSelectedTagIds(tagIds);
            const selectTags = tags.filter((item) => tagIds.indexOf(item.id) > -1);
            setSelectedTags(selectTags);
        },
        // 响应标签删除
        onDelTag: (id:number) => {
            const currentIds = Object.assign([], selectedTagIds);
            const index = currentIds.indexOf(id);
            currentIds.splice(index, 1);
            response.handleTagsChanged(currentIds);
        },
        handleCancelAdd: () => {
            onCancel();
        },
    };

    return (
        <div className="eff-add-bug-form">
            <div className="title  pb10 mb20">
                <span>新增Bug</span>
            </div>
            <Form labelAlign="right" initialValues={{ severity: 'NORMAL' }} colon={false} form={addForm} requiredMark={false}>
                <Row>
                    <Col span={24}>
                        <Form.Item labelCol={{ span: 2 }} name="name" label="Bug名称" rules={[{ required: true, message: '请输入Bug名称' }]}>
                            <Input size="large" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row className="mt20" gutter={48}>
                    <Col span={12}>
                        <Form.Item labelCol={{ span: 4 }} name="testerId" label="QA">
                            <Select className="ml10" size="large" suffixIcon={<CaretDownOutlined />}>
                                {members.map((item:any) => (
                                    <Select.Option
                                        key={item.orgMemberId}
                                        value={item.orgMemberId}
                                    >
                                        {item.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="handlerId" label="负责人">
                            <Select className="ml10" size="large" suffixIcon={<CaretDownOutlined />}>
                                {members.map((item:any) => (
                                    <Select.Option
                                        key={item.orgMemberId}
                                        value={item.orgMemberId}
                                    >
                                        {item.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row className="mt20" gutter={48}>
                    <Col span={12}>
                        <Form.Item labelCol={{ span: 4 }} name="severity" label="严重程度">
                            <Select className="ml10" size="large" suffixIcon={<CaretDownOutlined />}>
                                {Object.keys(BUG_SEVERITY).map((item:any) => (
                                    <Select.Option
                                        key={BUG_SEVERITY[item].key}
                                        value={BUG_SEVERITY[item].key}
                                    >
                                        {BUG_SEVERITY[item].name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        {false && (
                            <Form.Item name="tagIds" label="标签">
                                <div className="d-flex ml40">
                                    <EffTagArea onDel={response.onDelTag} tags={selectedTags} />
                                    <EffTagSelector onChange={response.handleTagsChanged} chosen={selectedTagIds} tags={tags} />
                                </div>
                            </Form.Item>
                        )}
                    </Col>
                </Row>
                <Form.Item labelCol={{ span: 2 }} name="description" className="d-flex align-start" label="Bug描述">
                    <ReactElgoEditor   />
                </Form.Item>


            </Form>

            <div className="btn-group d-flex mt40">
                <EffButton type="line" round className="mr20" onClick={response.handleCancelAdd} text="取消" key="cancel" />
                <EffButton type="filled" round onClick={response.handleAddBug} text="保存" key="confirm" />
            </div>
        </div>
    );
}
