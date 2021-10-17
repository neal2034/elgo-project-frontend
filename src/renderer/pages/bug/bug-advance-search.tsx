import React from 'react';
import {
    Form, Input, Select, Tag,
} from 'antd';
import EffButton from '@components/eff-button/eff-button';
import { useSelector } from 'react-redux';
import { CaretDownOutlined } from '@ant-design/icons';
import { BUG_SEVERITY, BUG_STATUS } from '@config/sysConstant';
import { RootState } from '../../store/store';
import './bug.less';

interface IProps{
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

export default function BugAdvanceSearch(props:IProps) {
    const { tags } = props;
    const [searchForm] = Form.useForm();
    const members = useSelector((state:RootState) => (state.project.projectDetail.members ? state.project.projectDetail.members : []));
    const memberOptions = members.map((item:any) => <Select.Option key={item.orgMemberId} value={item.orgMemberId}>{item.name}</Select.Option>);

    const tagOptions:any = [];
    tags.forEach((item) => {
        tagOptions.push({ value: [item.color, item.id], label: item.name, color: item.color });
    });

    const response = {
        handleSearch: (values:any) => {
            let tagIds:any;
            if (values.tags) {
                tagIds = [];
                values.tags.forEach((item:any) => {
                    tagIds.push(item[1]);
                });
            }
            const params = { ...values };
            delete params.tags;
            params.tagIds = tagIds;
            props.onSearch(params);
        },
    };

    return (
        <div className="bug-advance-search">
            <div className="title">
                高级搜索
            </div>
            <Form form={searchForm} onFinish={response.handleSearch} className="pl20 pr20 pt20" colon={false} layout="vertical">
                <Form.Item name="searchKey" label="Bug名称">
                    <Input size="large" />
                </Form.Item>

                <div className="d-flex justify-between">

                    <Form.Item name="testerIds" style={{ width: '50%' }} className="flex-grow-1" label="QA">
                        <Select size="large" mode="multiple" suffixIcon={<CaretDownOutlined />}>
                            {memberOptions}
                        </Select>
                    </Form.Item>

                    <Form.Item name="handlerIds" style={{ width: '50%' }} className="flex-grow-1 ml20" label="负责人">
                        <Select size="large" mode="multiple" suffixIcon={<CaretDownOutlined />}>
                            {memberOptions}
                        </Select>
                    </Form.Item>

                </div>

                <div className="d-flex justify-between">

                    <Form.Item name="severities" style={{ width: '50%' }} className="flex-grow-1" label="严重程度">
                        <Select size="large" mode="multiple" placeholder="" suffixIcon={<CaretDownOutlined />}>
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

                    <Form.Item name="statusList" style={{ width: '50%' }} className="flex-grow-1 ml20" label="状态">
                        <Select size="large" mode="multiple" suffixIcon={<CaretDownOutlined />}>
                            {Object.keys(BUG_STATUS).map((item:any) => (
                                <Select.Option
                                    key={BUG_STATUS[item].key}
                                    value={BUG_STATUS[item].key}
                                >
                                    {BUG_STATUS[item].name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                </div>

                {false && (
                    <div className="d-flex" style={{ width: '50%' }}>
                        <Form.Item name="tags" className="flex-grow-1" label="标签">
                            <Select
                                suffixIcon={<CaretDownOutlined />}
                                tagRender={tagRender}
                                mode="multiple"
                                size="large"
                                showArrow
                                options={tagOptions}
                            />
                        </Form.Item>
                    </div>
                )}

                <div className="d-flex justify-end">
                    <EffButton onClick={() => props.onCancel()} text="取消" key="cancel" round width={80} type="line" />
                    <EffButton htmlType="submit" className="ml10" text="搜索" key="search" round width={80} type="filled" />
                </div>
            </Form>
        </div>
    );
}
