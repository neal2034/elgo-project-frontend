import React, { useEffect, useRef, useState } from 'react';
import { PlusOutlined, MoreOutlined } from '@ant-design/icons';
import './eff-tasks.less';
import { Input } from 'antd';

interface IProps{
    name?:string,
    editing?:boolean, // 是否应该处于编辑状态
    editName:(name?:string)=>void, // 名称发生修改
    onAdd:()=>void,

}

export default function EffTaskGroupHeader(props:IProps) {
    const {
        name, editing = false, editName, onAdd,
    } = props;
    const [isEdit, setIsEdit] = useState(false);
    const inputRef = useRef<Input>(null);
    const [groupName, setGroupName] = useState(name);

    useEffect(() => {
        if (editing) {
            setIsEdit(true);
            setTimeout(() => inputRef.current!.focus());
        }
    }, []);

    useEffect(() => {
        setGroupName(name);
    }, [name]);

    const response = {
        goEdit: () => {
            setIsEdit(true);
            setTimeout(() => inputRef.current!.focus());
        },
        onNameChange: (e:any) => {
            setGroupName(e.target.value);
        },
        confirmEdit: () => {
            // if(groupName){
            //
            // }else{
            //     setGroupName('未命名分组')
            // }
            editName(groupName);
            setIsEdit(false);
        },
    };

    return (
        <div className="eff-task-group-header">
            <div className="name-group">
                {isEdit ? (
                    <Input
                        placeholder="输入分组名称"
                        onChange={response.onNameChange}
                        value={groupName}
                        ref={inputRef}
                        onBlur={response.confirmEdit}
                        style={{ width: '200px' }}
                        size="large"
                    />
                )
                    : <span onClick={response.goEdit} className="name">{groupName}</span>}
                <PlusOutlined onClick={() => onAdd()} className="ml10 add" />
                <MoreOutlined className="ml10 more" />
            </div>

        </div>
    );
}
