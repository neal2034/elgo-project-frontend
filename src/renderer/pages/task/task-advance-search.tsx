import React from 'react';
import {
    Form, Input, Select, Tag,
} from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { PRIORITY } from '@config/sysConstant';
import { RootState } from '../../store/store';
import EffButton from '../../components/eff-button/eff-button';

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

export default function TaskAdvanceSearch(props:IProps) {
    const { onCancel, onSearch, tags } = props;
    const [searchForm] = Form.useForm();

    const data = {
        members: useSelector((state:RootState) => (state.project.projectDetail.members ? state.project.projectDetail.members : [])),
    };

    const ui = {
        memberOptions: data.members.map((item:any) => <Select.Option key={item.orgMemberId} value={item.orgMemberId}>{item.name}</Select.Option>),
        priorityOptions: Object.keys(PRIORITY).map((item:any) => (
            <Select.Option key={PRIORITY[item].key} value={PRIORITY[item].key}>{PRIORITY[item].name}</Select.Option>)),
    };
    const tagOptions:any = [];
    tags.forEach((item) => {
        tagOptions.push({ value: [item.color, item.id], label: item.name, color: item.color });
    });

    const response = {
        handleSearch: async (values:any) => {
            let tagIds:any;
            if (values.tags) {
                tagIds = [];
                values.tags.forEach((item:any) => {
                    tagIds.push(item[1]);
                });
            }
            const params = {
                name: values.name,
                handlerId: values.handlerId,
                priority: values.priority,
                tagIds: tagIds ? tagIds.join(',') : undefined,
            };
            onSearch(params);
        },
        handleCancelSearch: () => {
            onCancel();
        },
    };
    return (
        <div className="task-advance-search">
            <div className="title">
                高级搜索
            </div>
            <Form form={searchForm} onFinish={response.handleSearch} className="pl20 pr20 pt20" colon={false} layout="vertical">
                <Form.Item name="name" label="任务名称">
                    <Input size="large" />
                </Form.Item>

                <div className="d-flex justify-between">
                    <Form.Item name="handlerId" style={{ width: '50%' }} className="flex-grow-1" label="负责人">
                        <Select size="large" placeholder="请选择负责人" suffixIcon={<CaretDownOutlined />}>
                            {ui.memberOptions}
                        </Select>
                    </Form.Item>

                    <Form.Item name="priority" style={{ width: '50%' }} className="flex-grow-1 ml20" label="优先级">
                        <Select size="large" placeholder="请选择优先级" suffixIcon={<CaretDownOutlined />}>
                            {ui.priorityOptions}
                        </Select>
                    </Form.Item>
                </div>

                <Form.Item style={{ width: '50%' }} name="tags" label="标签">
                    <Select suffixIcon={<CaretDownOutlined />} tagRender={tagRender} mode="multiple" size="large" showArrow options={tagOptions} />
                </Form.Item>

                <div className="d-flex justify-end">
                    <EffButton onClick={response.handleCancelSearch} text="取消" key="cancel" round width={80} type="line" />
                    <EffButton htmlType="submit" className="ml10" text="搜索" key="search" round width={80} type="filled" />
                </div>

            </Form>
        </div>
    );
}
