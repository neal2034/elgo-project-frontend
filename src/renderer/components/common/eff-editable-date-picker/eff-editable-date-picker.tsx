import React, { useState } from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';
import './eff-editable-date-picker.less';

interface IProps{
    value?:string,
    placeholder?:string
    onChange:(value?:any)=>void
}

export default function EffEditableDatePicker(props:IProps) {
    const { value, placeholder = '未指定', onChange } = props;

    const [isHover, setIsHover] = useState(false);

    const response = {
        handleDateChange: (data:any) => {
            onChange(data);
        },
    };

    return (
        <div
            className={`${isHover ? 'show-status' : 'eff-editable-date-picker'}`}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
        >
            <DatePicker
                value={value ? moment(value) : undefined}
                onChange={response.handleDateChange}
                allowClear
                style={{ width: '100%', height: '40px', minWidth: '200px' }}
                size="large"
                placeholder={placeholder}
            />
        </div>
    );
}
