import React from "react";
import {Form, Input, Select} from "antd";
import EffButton from "@components/eff-button/eff-button";
import {CaretDownOutlined} from '@ant-design/icons'
import {TEST_PLAN_STATUS} from "@config/sysConstant";


interface IProps{
    onCancel:()=>void,
    onSearch:(params:any)=>void,
}

export default function AdvanceTestPlanSearch(props:IProps){
    const [searchForm] = Form.useForm()
    const response = {
        handleSearch: (values:any)=>{
            props.onSearch(values)
        }
    }

    const ui = {
        testPlanStatusOptions: [] as any,

    }
    for(let item in TEST_PLAN_STATUS){
        ui.testPlanStatusOptions.push(<Select.Option key={TEST_PLAN_STATUS[item].key} value={TEST_PLAN_STATUS[item].key}>{TEST_PLAN_STATUS[item].name}</Select.Option>)
    }

    return (
        <div className="test-plan-advance-search">
            <div className="title">
                高级搜索
            </div>
            <Form form={searchForm} onFinish={response.handleSearch} className="pl20 pr20 pt20" colon={false} layout={"vertical"}>
                <Form.Item name={'name'}   label={'计划名称'} >
                    <Input size={"large"}/>
                </Form.Item>

                <Form.Item name={'status'}   className="flex-grow-1" label={'计划状态'} >
                    <Select size={"large"}   placeholder="请选择计划状态" suffixIcon={<CaretDownOutlined />}>
                        {ui.testPlanStatusOptions}
                    </Select>
                </Form.Item>

                <div className="d-flex justify-end mb20">
                    <EffButton onClick={()=>props.onCancel()} text={'取消'} key={'cancel'} round={true} width={80} type={"line"}/>
                    <EffButton htmlType={'submit'}  className="ml10" text={'搜索'} key={'search'} round={true} width={80} type={"filled"}/>
                </div>
            </Form>
        </div>
    )
}
