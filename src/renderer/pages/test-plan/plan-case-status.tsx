import React from 'react';
import { PLAN_CASE_STATUS } from '@config/sysConstant';

interface IProps{

    value:string,
    className?:string,
}
export default function PlanCaseStatus(props:IProps) {
    const { value, className } = props;
    const { color, name } = PLAN_CASE_STATUS[value];
    return (
        <div
            style={{
                border: `1px solid ${color}`,
                padding: '3px',
                fontSize: '12px',
                height: '20px',
                color,
            }}
            className={`d-flex justify-center align-center ${className}`}
        >
            {name}
        </div>
    );
}
