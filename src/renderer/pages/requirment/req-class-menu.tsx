import { useDispatch } from 'react-redux';
import React, { useState } from 'react';
import { reqThunks } from '@slice/reqSlice';
import { Popover } from 'antd';
import { FormOutlined, DeleteOutlined } from '@ant-design/icons';
import AddReqClazzDlg from '@pages/requirment/add-req-clazz-dlg';
import DelReqClazzDlg from '@pages/requirment/del-req-clazz-dlg';

export default function ReqClassMenu(props:any) {
    const { name, id } = props;
    const dispatch = useDispatch();
    const [showDelDlg, setShowDelDlg] = useState(false);
    const [showEditDlg, setShowEditDlg] = useState(false);

    const response = {
        confirmDelReqClazz: async () => {
            await dispatch(reqThunks.delReqClazz(id));
            setShowDelDlg(false);
        },
        cancelDelReqClass: (e:any) => {
            e.stopPropagation();
            setShowDelDlg(false);
        },
        cancelEditReqClazz: (e:any) => {
            e.stopPropagation();
            setShowEditDlg(false);
        },
        confirmEditReqClazz: async (reqClassName:string) => {
            await dispatch(reqThunks.editReqClazz(id, reqClassName));
            setShowEditDlg(false);
        },
    };

    return (
        <div className="req-clazz-menu">
            <div className="menu" onClick={() => setShowEditDlg(true)}>
                <Popover
                    open={showEditDlg}
                    placement="bottom"
                    trigger="click"
                    content={(
                        <AddReqClazzDlg
                            name={name}
                            isAdd={false}
                            onCancel={response.cancelEditReqClazz}
                            onConfirm={(reqClazzName) => response.confirmEditReqClazz(reqClazzName)}
                        />
                    )}
                >
                    <FormOutlined className="mr10" />
                    {' '}
                    编辑
                </Popover>

            </div>
            <div className="menu" onClick={() => setShowDelDlg(true)}>
                <Popover
                    open={showDelDlg}
                    placement="bottom"
                    trigger="click"
                    content={(
                        <DelReqClazzDlg
                            onCancel={response.cancelDelReqClass}
                            onConfirm={response.confirmDelReqClazz}
                            name={name}
                        />
                    )}
                >
                    <DeleteOutlined className="mr10" />
                    {' '}
                    删除
                </Popover>

            </div>

        </div>
    );
}
