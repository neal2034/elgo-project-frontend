/**
 * 组件： api 名称
 */
import React, { useRef, useState } from 'react';
import { API, apiActions, apiThunks } from '@slice/apiSlice';
import { CaretRightOutlined, CaretDownOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import ImgEdit from '@imgs/pen-edit.png';
import { Input } from 'antd';
import { RootState } from '../../../store/store';

interface ApiProps{
    api: API
}

export default function ApiName(props:ApiProps) {
    const { api } = props;
    const { name, id } = api;
    const dispatch = useDispatch();
    const [hoverOnName, setHoverOnName] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const isShowDescription = useSelector((state:RootState) => state.api.showDescription);
    const savedApi = !!id;
    const [apiName, setApiName] = useState<string>();
    const inputRef = useRef<Input>(null);

    const handler = {
        showDescription: () => {
            dispatch(apiActions.setShowDescription(true));
        },

        hideDescription: () => {
            dispatch(apiActions.setShowDescription(false));
        },

        nameChanged: (e:any) => {
            setApiName(e.target.value);
        },

        handleEditClick: () => {
            setIsEdit(true);
            setApiName(name);
            setTimeout(() => inputRef.current!.focus(), 100);
        },

        nameInputOnBlur: () => {
            if (apiName) {
                if (apiName !== name) {
                    dispatch(apiThunks.editApiName(apiName));
                }
            }
            setIsEdit(false);
        },
    };
    return (
        <div className="d-flex" onMouseEnter={() => setHoverOnName(true)} onMouseLeave={() => setHoverOnName(false)}>
            {(savedApi && !isEdit) ? (isShowDescription
                ? <CaretDownOutlined onClick={handler.hideDescription} /> : <CaretRightOutlined onClick={handler.showDescription} />) : null}
            {isEdit ? null : name}
            {(savedApi && hoverOnName && !isEdit)
                ? (
                    <div onClick={handler.handleEditClick}>
                        <img alt="edit" src={ImgEdit} width={14} className="ml5 cursor-pointer" />
                    </div>
                ) : null}
            {isEdit
                ? <Input ref={inputRef} value={apiName} onChange={handler.nameChanged} className="mr20" onBlur={handler.nameInputOnBlur} /> : null}
        </div>
    );
}
