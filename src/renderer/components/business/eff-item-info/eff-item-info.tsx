import React from 'react';
import globalColor from '@config/globalColor';

/**
 * 该组件用于表达需求，功能，bug 等ITEM 的基础信息，包括创建人，创建时间，以及编号
 * @constructor
 */

interface IProps{
    serial:string|number,
    creator:string,
    createDate?:string,
    className?:string
}
export default function EffItemInfo(props:IProps) {
    const {
        serial, creator, createDate, className,
    } = props;
    const style = {
        item: {
            fontSize: '12px',
            color: globalColor.fontWeak,
        },
    };

    return (
        <div className={className} style={style.item}>
            编号
            {serial}
            ,
            {creator}
            {' '}
            {createDate}
            {' '}
            创建
        </div>
    );
}
