import { useDispatch } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { reqActions, reqThunks } from '@slice/reqSlice';
import { PlusSquareOutlined } from '@ant-design/icons'
import ReqClassItem from '@pages/requirment/req-class-item';
import { Popover } from 'antd';
import AddReqClazzDlg from '@pages/requirment/add-req-clazz-dlg';
import { useAppSelector } from '@store/store';

interface IReqClassProps{
    reqClasses:any,
}

// 需求分类对话框
export default function ReqClass(props:IReqClassProps) {
    const dispatch = useDispatch();
    const { reqClasses } = props;
    const [showReqClazzDlg, setShowReqClazzDlg] = useState(false);
    const [totalNum, setTotalNum] = useState(0);
    const activeReqClassId = useAppSelector(state => state.requirement.activeReqClassId)

    // 获取需求总数
    useEffect(() => {
        let num = 0;
        reqClasses.forEach(item => {
            num += item.requirementNum;
        });
        setTotalNum(num);
    }, [reqClasses]);

    const response = {
        handleAddReqClazz: async (name:string) => {
            await dispatch(reqThunks.addReqClazz(name));
            setShowReqClazzDlg(false);
        },
        // 响应需求分类被选中
        reqClazzSelected: async (reqClassId?: number) => {
            const classId = reqClassId || -2
            dispatch(reqActions.setActiveReqClassId(classId))
            dispatch(reqThunks.listPageRequirement({ page: 0, clazzId: reqClassId }));
        },
    };

    const ui = {
        reqClassItems: reqClasses.map((item:any) => (
            <ReqClassItem
                isActive={activeReqClassId === item.id}
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
                    isActive={activeReqClassId === -2}
                    onClick={() => response.reqClazzSelected()}
                    className="mt20"
                    name="所有的"
                    num={totalNum}
                />
                {ui.reqClassItems}
            </div>

        </div>
    );
}
