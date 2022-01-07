import React from 'react';
import './test-plan.less';
import PlanCaseStatus from './plan-case-status';

interface IPlanCase{
    id:number,
    serial:number,
    caseName:string,
    [x:string]:any
}

interface IProps{
    showBg:boolean, // 是否显示background color
    planCase:IPlanCase
    onChosen:(id:number)=>void
}

export default function PlanCaseItem(props:IProps) {
    const { planCase, showBg, onChosen } = props;
    return (
        <div
            onClick={() => onChosen(planCase.id)}
            className={`one-plan-case d-flex align-center pr20 justify-between pl20 ${showBg ? 'shadowed' : ''}`}
        >
            <div className="test-case-main">
                <span>{planCase.serial}</span>
                <span className="ml20">{planCase.caseName}</span>
            </div>
            <div>
                <PlanCaseStatus value={planCase.status} />
            </div>
        </div>

    );
}
