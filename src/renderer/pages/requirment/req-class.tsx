import { useDispatch } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { reqThunks } from '@slice/reqSlice';
import { PlusSquareOutlined } from '@ant-design/icons'
import ReqClassItem from '@pages/requirment/req-class-item';
import { Popover } from 'antd';
import AddReqClazzDlg from '@pages/requirment/add-req-clazz-dlg';

// 需求分类对话框
export default function ReqClass(props:any) {
    const dispatch = useDispatch();
    const { reqClasses } = props;
    const [showReqClazzDlg, setShowReqClazzDlg] = useState(false);
    const [activeClassId, setActiveClassId] = useState(-2);
    const [totalNum, setTotalNum] = useState(0);

    useEffect(() => {
        let num = 0;
        reqClasses.forEach((item:any) => {
            num += item.requirementNum;
        });
        setTotalNum(num);
    }, [reqClasses]);

    const response = {
        handleAddReqClazz: async (name:string) => {
            await dispatch(reqThunks.addReqClazz(name));
            setShowReqClazzDlg(false);
        },
        reqClazzSelected: async (classId:number) => {
            setActiveClassId(classId);

            dispatch(reqThunks.listPageRequirement({ page: 0, clazzId: classId }));
        },
        allReqClassSelected: async () => {
            setActiveClassId(-2);
            dispatch(reqThunks.listPageRequirement({ page: 0 }));
        },
    };

    const ui = {
        reqClassItems: reqClasses.map((item:any) => (
            <ReqClassItem
                isActive={activeClassId === item.id}
                onClick={() => response.reqClazzSelected(item.id)}
                id={item.id}
                key={item.id}
                className="pl10 mt10"
                name={item.name}
                num={item.requirementNum}
            />
        )),
    };

    return (
        <div className="requirement-class ml20">
            <div className="ml20 mt20 d-flex justify-between">
                <span className="title">需求分类</span>
                <Popover
                    visible={showReqClazzDlg}
                    content={(
                        <AddReqClazzDlg
                            onConfirm={response.handleAddReqClazz}
                            onCancel={() => setShowReqClazzDlg(false)}
                            isAdd
                        />
                    )}
                    trigger="click"
                    placement="bottom"
                >
                    <PlusSquareOutlined onClick={() => setShowReqClazzDlg(true)} className="mr20 cursor-pointer" style={{ fontSize: '16px' }} />
                </Popover>

            </div>
            <div className="clazz-content">
                <ReqClassItem
                    hasMenu={false}
                    isActive={activeClassId === -2}
                    onClick={response.allReqClassSelected}
                    className="mt20"
                    name="所有的"
                    num={totalNum}
                />
                {ui.reqClassItems}
            </div>

        </div>
    );
}
