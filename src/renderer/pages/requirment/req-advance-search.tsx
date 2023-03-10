import React from 'react';
import './requirment.less';
import {
    Form, Input, Select, Tag,
} from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';
import EffButton from '../../components/eff-button/eff-button';

interface IProps{
    reqClasses: any[],
    reqSources: any[],
    reqVersions: any[],
    tags:any[],
    onCancel:()=>void,
    onSearch:(params:any)=>void,
}

function tagRender(props:any) {
    const {
        label, value, closable, onClose,
    } = props;
    const onPreventMouseDown = (event:any) => {
        event.preventDefault();
        event.stopPropagation();
    };
    return (
        <Tag
            color={value[0]}
            onMouseDown={onPreventMouseDown}
            closable={closable}
            onClose={onClose}
            style={{ marginRight: 3 }}
        >
            {label}
        </Tag>
    );
}

export default function ReqAdvanceSearch(props: IProps) {
    const {
        onCancel, onSearch, reqClasses, reqSources, reqVersions, tags,
    } = props;
    const [searchForm] = Form.useForm();
    const response = {
        handleCancel: () => {
            if (onCancel) {
                onCancel();
            }
        },
        handleSearch: (values:any) => {
            let tagIds:any;
            if (values.tags) {
                tagIds = [];
                values.tags.forEach((item:any) => {
                    tagIds.push(item[1]);
                });
            }
            const params = {
                name: values.name,
                clazzId: values.clazzId,
                sourceId: values.sourceId,
                versionId: values.versionId,
                tagIds: tagIds ? tagIds.join(',') : undefined,
            };

            onSearch(params);
        },
    };
    const ui = {
        uiReqClassOptions: reqClasses.map((item) => <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>),
        uiReqResourceOptions: reqSources.map((item) => <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>),
        uiReqVersionOptions: reqVersions.map((item) => <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>),
    };
    const tagOptions:any = [];
    tags.forEach((item) => {
        tagOptions.push({ value: [item.color, item.id], label: item.name, color: item.color });
    });

    return (
        <div className="req-advance-search">
            <div className="title">
                ????????????
            </div>
            <Form form={searchForm} onFinish={response.handleSearch} className="search-form" colon={false} layout="vertical">
                <div className="d-flex justify-between">
                    <Form.Item name="name" style={{ width: '50%' }} label="????????????">
                        <Input size="large" />
                    </Form.Item>

                    <Form.Item name="clazzId" style={{ width: '50%' }} className="ml20" label="????????????">
                        <Select size="large" placeholder="?????????????????????" suffixIcon={<CaretDownOutlined />}>
                            {ui.uiReqClassOptions}
                        </Select>
                    </Form.Item>
                </div>

                <div className="d-flex justify-between">
                    <Form.Item name="sourceId" style={{ width: '50%' }} className="flex-grow-1" label="????????????">
                        <Select size="large" placeholder="?????????????????????" suffixIcon={<CaretDownOutlined />}>
                            {ui.uiReqResourceOptions}
                        </Select>
                    </Form.Item>

                    <Form.Item name="versionId" style={{ width: '50%' }} className="flex-grow-1 ml20" label="??????">
                        <Select size="large" placeholder="?????????????????????" suffixIcon={<CaretDownOutlined />}>
                            {ui.uiReqVersionOptions}
                        </Select>
                    </Form.Item>
                </div>

                <Form.Item name="tags" label="??????">
                    <Select suffixIcon={<CaretDownOutlined />} tagRender={tagRender} mode="multiple" size="large" showArrow options={tagOptions} />
                </Form.Item>

                <div className="d-flex justify-end">
                    <EffButton onClick={response.handleCancel} text="??????" key="cancel" round width={80} type="line" />
                    <EffButton htmlType="submit" className="ml10" text="??????" key="search" round width={80} type="filled" />
                </div>

            </Form>

        </div>
    );
}
