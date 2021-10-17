import React, { useState } from 'react';
import { Tag } from 'antd';

interface IEffTagAreaProps{
    tags:any[],
    onDel:(id:number)=>void
}

export default function EffTagArea(props:IEffTagAreaProps) {
    const { tags, onDel } = props;
    const [hoverId, setHoverId] = useState<number>();

    const response = {
        onTagDel: (id:number) => {
            onDel(id);
        },
    };

    const ui = {
        uiTags: tags.map((item) => (
            <Tag
                onClose={() => response.onTagDel(item.id)}
                closable={item.id === hoverId}
                onMouseEnter={() => setHoverId(item.id)}
                onMouseLeave={() => setHoverId(-1)}
                className="mr5 ml5 cursor-pointer"
                key={item.id}
                color={item.color}
            >
                {item.name}
            </Tag>
        )),
    };

    return (
        <>
            {ui.uiTags}
        </>
    );
}
