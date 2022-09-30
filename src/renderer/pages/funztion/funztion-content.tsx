import React, { useEffect, useState } from 'react';
import './funztion.less';
import { useDispatch, useSelector } from 'react-redux';
import { funztionThunks } from '@slice/funztionSlice';
import { Drawer, Pagination } from 'antd';
import { effToast } from '@components/common/eff-toast/eff-toast';
import EffEmpty from '../../components/common/eff-empty/eff-empty';
import FunztionItem from './funztion-item';
import { RootState } from '../../store/store';
import FunztionDetail from './funztion-detail';

interface IProps{
    funztions:any[],
}

export default function FunztionContent(props:IProps) {
    const dispatch = useDispatch();
    const { funztions } = props;
    const currentPage = useSelector((state:RootState) => state.funztion.page);
    const totalFunztion = useSelector((state:RootState) => state.funztion.funzTotal);
    const [showDetail, setShowDetail] = useState(false); // 显示功能详情

    const response = {
        handleItemChosen: async (id:number) => {
            await dispatch(funztionThunks.getFunztionDetail(id));
            setShowDetail(true);
        },
        handleDelFunztion: async (id:number) => {
            const result:any = await dispatch(funztionThunks.delFunztion(id));
            if (result) {
                setShowDetail(false);
                effToast.success_withdraw('功能放入回收站成功', () => response.handleWithdrawDelFunztion(id));
            }
        },
        handleWithdrawDelFunztion: async (id:number) => {
            const result:any = await dispatch(funztionThunks.withdrawDelFunztion(id));
            if (result) {
                effToast.success('撤销成功');
            }
        },
        handlePageChange: (page:number) => {
            dispatch(funztionThunks.listFunztion({ page: page - 1 }));
        },
    };
    const ui = {
        funztionList: funztions.map((item, index) => (
            <FunztionItem
                key={item.id}
                showBg={index % 2 === 0}
                id={item.id}
                name={item.name}
                status={item.status}
                onChosen={response.handleItemChosen}
            />
        )),
    };

    return (
        <div className="eff-funztion-content d-flex-column">
            {funztions.length === 0 ? <EffEmpty description="暂无功能" /> : ui.funztionList}
            {funztions.length > 0 && (
                <Pagination
                    className="mt20 mr20 align-self-end"
                    onChange={response.handlePageChange}
                    current={currentPage + 1}
                    defaultCurrent={1}
                    total={totalFunztion}
                />
            )}
            <Drawer
                title={null}
                width="60%"
                placement="right"
                closable={false}
                visible={showDetail}
                onClose={() => setShowDetail(false)}
            >
                <FunztionDetail onDel={response.handleDelFunztion} />
            </Drawer>
        </div>
    );
}
