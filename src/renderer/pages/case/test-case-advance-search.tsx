import React, { useEffect, useState } from 'react';
import {
    Form, Input, Select, Tag,
} from 'antd';

import './test-case.less';
import { CaretDownOutlined } from '@ant-design/icons';
import { PRIORITY } from '@config/sysConstant';
import { useDispatch, useSelector } from 'react-redux';
import { funztionActions, funztionThunks } from '@slice/funztionSlice';
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

export default function TestCaseAdvanceSearch(props:IProps) {
    const { tags, onCancel, onSearch } = props;
    const dispatch = useDispatch();
    const [funztionOptions, setFunztionOptions] = useState<any>([]);
    const filterFunztions = useSelector((state:RootState) => state.funztion.funztions);

    const [searchForm] = Form.useForm();
    const ui = {
        priorityOptions: PRIORITY.map((item:any) => (
            <Select.Option key={PRIORITY[item].key} value={PRIORITY[item].key}>{PRIORITY[item].name}</Select.Option>)),

    };

    const tagOptions:any = [];
    tags.forEach((item) => {
        tagOptions.push({ value: [item.color, item.id], label: item.name, color: item.color });
    });

    useEffect(() => {
        const options = filterFunztions.map((d:any) => <Select.Option key={d.id} value={d.id}>{d.name}</Select.Option>);
        setFunztionOptions(options);
    }, [filterFunztions]);

    const response = {
        handleSearchFunztion: async (value:any) => {
            if (value) {
                await dispatch(funztionThunks.listFunztion({ page: 0, name: value }));
            } else {
                dispatch(funztionActions.setFunztions([]));
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
                funztionId: values.funztionId,
                priority: values.priority,
                tagIds,
            };

            onSearch(params);
        },
    };

    return (
        <div className="test-case-advance-search">
            <div className="title">
                高级搜索
            </div>
            <Form form={searchForm} onFinish={response.handleSearch} className="pl20 pr20 pt20" colon={false} layout="vertical">
                <Form.Item name="name" label="用例名称">
                    <Input size="large" />
                </Form.Item>

                <Form.Item name="funztionId" label="所属功能">
                    <Select
                        showSearch
                        allowClear
                        onSearch={response.handleSearchFunztion}
                        defaultActiveFirstOption={false}
                        showArrow={false}
                        filterOption={false}
                        notFoundContent={null}
                        size="large"
                    >
                        {funztionOptions}
                    </Select>
                </Form.Item>

                <div className="d-flex justify-between">

                    <Form.Item name="priority" style={{ width: '50%' }} className="flex-grow-1" label="优先级">
                        <Select size="large" placeholder="请选择优先级" suffixIcon={<CaretDownOutlined />}>
                            {ui.priorityOptions}
                        </Select>
                    </Form.Item>

                    <Form.Item style={{ width: '50%' }} name="tags" className="flex-grow-1 ml20" label="标签">
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

                <div className="d-flex justify-end">
                    <EffButton onClick={() => onCancel()} text="取消" key="cancel" round width={80} type="line" />
                    <EffButton htmlType="submit" className="ml10" text="搜索" key="search" round width={80} type="filled" />
                </div>
            </Form>
        </div>
    );
}
