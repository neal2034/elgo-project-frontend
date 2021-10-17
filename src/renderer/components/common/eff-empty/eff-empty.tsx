import React from 'react';
import IconEmpty from '@imgs/empty.png';
import globalColor from '@config/globalColor';

interface IProps{
    description:string,
}

export default function EffEmpty(props:IProps) {
    const { description } = props;

    const style = {
        description: {
            fontSize: '24px',
            fontWeight: 500,
            color: globalColor.fontWeak,
        },
    };

    return (
        <div style={{ height: '100%' }} className="d-flex-column d-flex align-center justify-center">
            <img alt="empty" src={IconEmpty} width={140} />
            <span className="mt20" style={style.description}>{description}</span>
        </div>
    );
}
