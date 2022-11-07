import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@store/store';
import React, { useState } from 'react';
import { reqThunks } from '@slice/reqSlice';
import { funztionActions, funztionThunks } from '@slice/funztionSlice';
import { effToast } from '@components/common/eff-toast/eff-toast';
import RequirementItem from '@pages/requirment/requirement-item';
import { Drawer, Pagination } from 'antd';
import RequirementDetail from '@pages/requirment/requirement-detail';

// 需求页面props
interface IRequirement{
    name:string,
    id:number,
    serial:number,
    status:string,
    version?:{
        id:number,
        name:string
    }
}

interface IRequirementContentProps{
    requirements:IRequirement[], // 当前显示的需求列表
}

// 需求列表内容
export default function ReqContent(props: IRequirementContentProps) {
    const { requirements } = props;
    const dispatch = useDispatch();
    const totalReq = useSelector((state:RootState) => state.requirement.reqTotal);
    const [currentPage, setCurrentPage] = useState(1);
    const [showDetail, setShowDetail] = useState(false); // 显示需求详情

    const response = {
        pageChange: (page:number) => {
            dispatch(reqThunks.listPageRequirement({ page: page - 1 }));
            setCurrentPage(page);
        },
        onReqChosen: (id:number) => {
            dispatch(funztionActions.setReqFunztions([])); // 清空历史需求所对应功能
            dispatch(funztionThunks.listReqFunztions({ reqId: id }));
            dispatch(reqThunks.getReqDetail(id));
            setShowDetail(true);
        },
        onDeleteReq: async (id:number) => {
            const result:any = await dispatch(reqThunks.delRequirement(id));
            if (result) {
                effToast.success_withdraw('需求放入回收站成功', () => response.handleWithdrawDelReq(id));
                setShowDetail(false);
            }
        },
        handleWithdrawDelReq: async (id:number) => {
            const result:any = await dispatch(reqThunks.withdrawDelRequirement(id));
            if (result) {
                effToast.success('撤销成功');
            }
        },

    };

    const ui = {
        reqList: requirements.map((item, index) => (
            <RequirementItem
                onChosen={response.onReqChosen}
                key={item.id}
                version={item.version && item.version.name}
                showBg={index % 2 === 0}
                id={item.id}
                name={item.name}
                status={item.status}
            />
        )),
    };

    return (
        <div className="requirement-content ml20   mr20 d-flex-column">
            {ui.reqList}
            <Pagination
                className="mt20 mr20 align-self-end"
                onChange={response.pageChange}
                current={currentPage}
                defaultCurrent={1}
                total={totalReq}
            />

            <Drawer
                title={null}
                width="60%"
                placement="right"
                closable={false}
                open={showDetail}
                onClose={() => setShowDetail(false)}
            >
                <RequirementDetail onDel={response.onDeleteReq} />
            </Drawer>
        </div>
    );
}
