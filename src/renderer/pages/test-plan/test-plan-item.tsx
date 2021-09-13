import React from "react";
import './test-plan.less'
import {RightOutlined} from '@ant-design/icons'
import TestPlanStatus from "./TestPlanStatus";
import {useHistory, useRouteMatch} from "react-router";


interface ITestPlan{
    id:number,
    serial:number,
    name:string,
    status:string,
    [x:string]:any
}

interface IProps{
    showBg:boolean,     //是否显示background color
    testPlan:ITestPlan
    [x:string]:any
}

export default function TestPlanItem(props:IProps){


    const {testPlan, showBg, ...rest} = props
    const history = useHistory()
    const {url} = useRouteMatch()
    const response = {
        handleExecute:(e:any)=>{
            e.stopPropagation()
            history.push(`${url.replace('test-plan','test-plan-execute')}/${testPlan.id}`)
        }
    }


    return (
        <div  {...rest} className={`one-test-plan d-flex align-center pr20 justify-between pl20 ${showBg?'shadowed':''}`} key={testPlan.id}>
            <div className="test-plan-main">
                <span>{testPlan.serial}</span>
                <span className="ml20">{testPlan.name}</span>
            </div>
            <div className="d-flex align-center">
                <span onClick={response.handleExecute} className="execute mr20" >执行计划 <RightOutlined /></span>
                <TestPlanStatus value={testPlan.status}/>
            </div>
        </div>
    )

}
