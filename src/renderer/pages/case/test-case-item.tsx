import React from "react";
import {Tag} from "antd";
import EffPriority from "../../components/business/eff-priority/eff-priority";
import './test-case.less'



interface ITestCase{
    id:number,
    serial:number,
    name:string,
    priority:string,
    [x:string]:any
}

interface IProps{
    showBg:boolean,     //是否显示background color
    testCase:ITestCase
    onChosen:(id:number)=>void
}

export default function TestCaseItem(props:IProps){
    const {testCase, onChosen,showBg} = props


    return (
        <div onClick={()=>onChosen(testCase.id)} className={`one-test-case d-flex align-center pr20 justify-between pl20 ${showBg?'shadowed':''}`} key={testCase.id}>
            <div className="test-case-main">
                <span>{testCase.serial}</span>
                <span className="ml20">{testCase.name}</span>
            </div>
            <div>
                <EffPriority value={testCase.priority}/>
            </div>
        </div>
    )

}
