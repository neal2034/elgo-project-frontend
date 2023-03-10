import React, { useEffect, useState } from 'react';
import { Form, Input, Select } from 'antd';
import EffButton from '@components/eff-button/eff-button';
import { useDispatch, useSelector } from 'react-redux';
import { funztionActions, funztionThunks } from '@slice/funztionSlice';
import { CaretDownOutlined } from '@ant-design/icons';
import { PLAN_CASE_STATUS } from '@config/sysConstant';
import { RootState } from '../../store/store';

interface IProps{
    onCancel:()=>void,
    onSearch:(params:any)=>void,
}

export default function PlanCaseAdvanceSearch(props:IProps) {
    const dispatch = useDispatch();
    const { onSearch, onCancel } = props
    const [searchForm] = Form.useForm();
    const [funztionOptions, setFunztionOptions] = useState<any>([]);
    const filterFunztions = useSelector((state:RootState) => state.funztion.funztions);
    const response = {
        handleSearchFunztion: async (value:any) => {
            if (value) {
                await dispatch(funztionThunks.listFunztion({ page: 0, name: value }));
            } else {
                dispatch(funztionActions.setFunztions([]));
            }
        },
        handleSearch: (values:any) => {
            onSearch(values);
        },
    };
    const statusOptions = PLAN_CASE_STATUS.map((item:any) => (
        <Select.Option key={PLAN_CASE_STATUS[item].key} value={PLAN_CASE_STATUS[item].key}>{PLAN_CASE_STATUS[item].name}</Select.Option>));

    useEffect(() => {
        const options = filterFunztions.map((d:any) => <Select.Option key={d.id} value={d.id}>{d.name}</Select.Option>);
        setFunztionOptions(options);
    }, [filterFunztions]);

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

                    <Form.Item name="status" style={{ width: '50%' }} className="flex-grow-1" label="用例状态">
                        <Select size="large" placeholder="请选择用例状态" suffixIcon={<CaretDownOutlined />}>
                            {statusOptions}
                        </Select>
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
