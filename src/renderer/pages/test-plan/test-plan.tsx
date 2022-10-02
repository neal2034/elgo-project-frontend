import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { UserAddOutlined } from '@ant-design/icons';
import { testPlanThunks } from '@slice/testPlanSlice';
import { Drawer, Pagination } from 'antd';
import { effToast } from '@components/common/eff-toast/eff-toast';
import EffSearchResult from '../../components/business/eff-search-result/eff-search-result';
import EffSearchArea from '../../components/business/eff-search-area/eff-search-area';
import EffButton from '../../components/eff-button/eff-button';
import { RootState } from '../../store/store';
import './test-plan.less';
import EffEmpty from '../../components/common/eff-empty/eff-empty';
import AddTestPlanForm from './add-test-plan-form';
import TestPlanItem from './test-plan-item';
import TestPlanDetail from './test-plan-detail';
import AdvanceTestPlanSearch from './advance-test-plan-search';

export default function TestPlan() {
    const dispatch = useDispatch();
    const [isAdvanceSearch, setIsAdvanceSearch] = useState(false);
    const [isShowSearchResult, setIsShowSearchResult] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showDetail, setShowDetail] = useState(false);
    const tags = useSelector((state:RootState) => state.tag.tags);
    const testPlans = useSelector((state:RootState) => state.testPlan.testPlans);
    const searchMenus = [{ key: 'my-create', name: '我创建的', icon: <UserAddOutlined /> }];
    const page = useSelector((state:RootState) => state.testPlan.page);
    const totalPlanNum = useSelector((state:RootState) => state.testPlan.total);


    useEffect(() => {
        dispatch(testPlanThunks.listTestPlan({ page: 0 }));
    }, []);

    const response = {
        handleGoAddTestPlan: () => {
            setShowAddForm(true);
        },
        handleCancelAdd: () => {
            setShowAddForm(false);
        },
        handleAddTestPlan: async (data:{name:string, funztionIds?:number[]}) => {
            await dispatch(testPlanThunks.addTestPlan(data));
            dispatch(testPlanThunks.listTestPlan({ page: 0 }));
            setShowAddForm(false);
        },
        handlePageChange: (thePage:number) => {
            dispatch(testPlanThunks.listTestPlan({ page: thePage - 1 }));
        },
        handleTestPlanClick: async (id:number) => {
            await dispatch(testPlanThunks.getTestPlanDetail({ id }));
            setShowDetail(true);
        },
        handleDelTestPlan: async (id:number) => {
            const result:any = await dispatch(testPlanThunks.delTestPlan(id));
            if (result as boolean) {
                dispatch(testPlanThunks.listTestPlan({ page }));
                effToast.success_withdraw('计划放入回收站成功', () => response.handleWithdraw(id));
                setShowDetail(false);
            }
        },
        handleWithdraw: async (id:number) => {
            const result:any = await dispatch(testPlanThunks.withdrawDelTestPlan({ id }));
            if (result) {
                dispatch(testPlanThunks.listTestPlan({ page }));
                effToast.success('撤销成功');
            }
        },
        handleClose: () => {
            setShowDetail(false);
            setShowAddForm(false);
        },
        handleCloseAdvanceSearch: () => {
            setIsAdvanceSearch(false);
        },
        handleSearchMenu: (key:string) => {
            switch (key) {
            case 'my-create':
                break;
            default:
                setIsAdvanceSearch(true);
            }
        },
        handleAdvanceSearch: (params:{name?:string, status?:string}) => {
            dispatch(testPlanThunks.listTestPlan({ page: 0, key: params.name, status: params.status }));
            setIsAdvanceSearch(false);
            setIsShowSearchResult(true);
        },
        handleCloseSearchResult: () => {
            dispatch(testPlanThunks.listTestPlan());
            setIsShowSearchResult(false);
        },
        handleSearch: (value:string) => {
            dispatch(testPlanThunks.listTestPlan({ key: value }));
            setIsShowSearchResult(true);
        },
    };
    const ui = {
        testPlanList: testPlans.map((item:any, index) => (
            <TestPlanItem onClick={() => response.handleTestPlanClick(item.id)} key={item.id} showBg={index % 2 === 0} testPlan={item} />)),
    };
    return (
        <div className="flex-grow-1 d-flex-column eff-test-plan">
            <div style={{ height: '40px' }} className="d-flex justify-end mt20 mb20 align-center">
                {isShowSearchResult && !isAdvanceSearch && <EffSearchResult value={totalPlanNum} onClose={response.handleCloseSearchResult} />}
                {isAdvanceSearch ? <AdvanceTestPlanSearch onSearch={response.handleAdvanceSearch} onCancel={response.handleCloseAdvanceSearch} />
                    : <EffSearchArea onSearch={response.handleSearch} menuSelected={response.handleSearchMenu} menus={searchMenus} />}
                <EffButton width={100} onClick={response.handleGoAddTestPlan} type="line" round className="ml10 mr20" text="+ 新增计划" key="add" />
            </div>
            <div className="eff-test-case-content d-flex-column">

                {testPlans.length === 0 ? <EffEmpty description="暂无计划" /> : ui.testPlanList}
                {testPlans.length > 0
                && (
                    <Pagination
                        className="mt20 mr20 align-self-end"
                        onChange={response.handlePageChange}
                        current={page + 1}
                        defaultCurrent={1}
                        total={totalPlanNum}
                    />
                )}

                <Drawer
                    title={null}
                    width="60%"
                    placement="right"
                    closable={false}
                    onClose={response.handleClose}
                    maskClosable
                    visible={showAddForm || showDetail}
                >
                    {showAddForm && <AddTestPlanForm onConfirm={response.handleAddTestPlan} onCancel={response.handleCancelAdd} tags={tags} />}
                    {showDetail && <TestPlanDetail onDel={response.handleDelTestPlan} />}
                </Drawer>

            </div>
        </div>
    );
}
