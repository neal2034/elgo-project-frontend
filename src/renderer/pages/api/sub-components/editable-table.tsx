import React, { useState, useRef, useEffect } from 'react';
import { Table, Input, Checkbox } from 'antd';

import './editable-table.less';
import ImgClose from '@imgs/close.png';

const EditableCell = (props:any) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef<Input>(null);
    const {
        children, record, editable, dataIndex, handleSave, handleDel, selectable, delAction, hoverRowKey, ...restProps
    } = props;

    useEffect(() => {
        if (editing) {
            inputRef.current!.focus();
        }
    }, [editing]);

    const toggleEdit = () => {
        setEditing(!editing);
    };

    const valueChanged = (e:any) => {
        handleSave(props.record, props.dataIndex, e.target.value);
    };

    const selectChanged = (e:any) => {
        handleSave(props.record, props.dataIndex, e.target.checked);
    };

    const delParams = (e:any) => {
        e.stopPropagation();
        handleDel(props.record);
    };

    let childNode = children;
    if (editable) {
        childNode = editing ? (
            <div>
                <Input onChange={valueChanged} value={props.record[dataIndex]} ref={inputRef} onPressEnter={toggleEdit} onBlur={toggleEdit} />
            </div>
        ) : (
            <div className="editable-cell-value-wrap" onClick={toggleEdit}>
                {children}
                {delAction && hoverRowKey === props.record.key && hoverRowKey !== props.lastkey && (
                    <div className="action-area" onClick={delParams}>
                        <img alt="删除" width={14} src={ImgClose} />
                    </div>
                )}
            </div>

        );
    }
    if (selectable && record.selected !== undefined) {
        childNode = <div><Checkbox onChange={selectChanged} checked={props.record[dataIndex]} /></div>;
    }

    return <td {...restProps}>{childNode}</td>;
};

export default function EditableTable(props:any) {
    const {
        columns, dataSource, valueChange, valueDel,
    } = props;
    const lastkey = dataSource[dataSource.length - 1].key; // 未进行编辑的内容的key

    const [hoverRowKey, setHoverRowKey] = useState(-1);
    const tableCols = columns.map((col:any) => {
        if (!col.editable && !col.selectable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: any) => ({
                record,
                lastkey,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                selectable: col.selectable,
                delAction: col.delAction,
                hoverRowKey,
                handleSave: valueChange,
                handleDel: valueDel,

            }),
        };
    });
    const components = {
        body: {
            cell: EditableCell,
        },
    };
    return (
        <Table
            bordered
            onRow={(record) => ({
                onMouseEnter: () => { setHoverRowKey(record.key); },
                onMouseLeave: () => { setHoverRowKey(-1); },
            })}
            components={components}
            dataSource={dataSource}
            columns={tableCols}
            pagination={false}
        />
    );
}
