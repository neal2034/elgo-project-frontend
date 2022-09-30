import React, { useEffect, useState } from 'react';
import {
    Form, Input, Select, Tag,
} from 'antd';
import { RootState } from '@store/store';
import { CaretDownOutlined } from '@ant-design/icons';
import { reqActions, reqThunks } from '@slice/reqSlice';
import { useDispatch, useSelector } from 'react-redux';
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

export default function FunztionAdvanceSearch(props:IProps) {
    const dispatch = useDispatch();
    const { onCancel, onSearch, tags } = props;
    const [reqOptions, setReqOptions] = useState<any>([]);
    const [searchForm] = Form.useForm();

    const data = {
        filteredReqs: useSelector((state:RootState) => state.requirement.requirements),
    };

    useEffect(() => {
        const options = data.filteredReqs.map((d:any) => <Select.Option key={d.id} value={d.id}>{d.name}</Select.Option>);
        setReqOptions(options);
    }, [data.filteredReqs]);

    const response = {
        searchReqs: async (value:string) => {
            if (value) {
                await dispatch(reqThunks.listPageRequirement({ page: 0, name: value }));
            } else {
                dispatch(reqActions.setRequirements([]));
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
                reqId: values.reqId,
                tagIds: tagIds ? tagIds.join(',') : undefined,
            };

            onSearch(params);
        },
    };

    const tagOptions:any = [];
    tags.forEach((item) => {
        tagOptions.push({ value: [item.color, item.id], label: item.name, color: item.color });
    });

    return (
        <div className="funztion-advance-search">
            <div className="title">
                高级搜索
            </div>
            <Form form={searchForm} onFinish={response.handleSearch} className="pl20 pr20 pt20" colon={false} layout="vertical">
                <Form.Item name="name" label="功能名称">
                    <Input size="large" />
                </Form.Item>

                <Form.Item name="reqId" label="所属需求">
                    <Select
                        showSearch
                        allowClear
                        onSearch={response.searchReqs}
                        defaultActiveFirstOption={false}
                        showArrow={false}
                        filterOption={false}
                        notFoundContent={null}
                        size="large"
                    >
                        {reqOptions}
                    </Select>
                </Form.Item>

                <Form.Item name="tags" label="功能标签">
                    <Select suffixIcon={<CaretDownOutlined />} tagRender={tagRender} mode="multiple" size="large" showArrow options={tagOptions} />
                </Form.Item>

                <div className="d-flex justify-end">
                    <EffButton onClick={() => onCancel()} text="取消" key="cancel" round width={80} type="line" />
                    <EffButton htmlType="submit" className="ml10" text="搜索" key="search" round width={80} type="filled" />
                </div>
            </Form>
        </div>
    );
}
