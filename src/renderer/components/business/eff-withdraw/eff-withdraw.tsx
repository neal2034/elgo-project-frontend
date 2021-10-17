import React from 'react';

/**
 * 该组件用于在 snackbar toast 里表达撤销
 * @param props
 * @constructor
 */
export default function EffWithdraw(props:{onWithDraw:()=>void}) {
    const { onWithDraw } = props;
    return (
        <span
            style={{
                borderBottom: '1px solid white',
            }}
            onClick={onWithDraw}
            className="ml10 cursor-pointer mr20"
        >
            撤销
        </span>
    );
}
