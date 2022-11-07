import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { UserAddOutlined } from '@ant-design/icons';
import { Drawer, Pagination } from 'antd';
import { testCaseThunks } from '@slice/testCaseSlice';
import { tagThunks } from '@slice/tagSlice';
import { effToast } from '@components/common/eff-toast/eff-toast';
import EffSearchResult from '../../components/business/eff-search-result/eff-search-result';
import EffSearchArea from '../../components/business/eff-search-area/eff-search-area';
import EffButton from '../../components/eff-button/eff-button';
import { RootState } from '../../store/store';
import AddTestCaseForm from './add-test-case-form';
import EffEmpty from '../../components/common/eff-empty/eff-empty';
import TestCaseItem from './test-case-item';
import TestCaseDetail from './test-case-detail';
import TestCaseAdvanceSearch from './test-case-advance-search';

export default function TestCase() {
    const dispatch = useDispatch();
    const [isAdvanceSearch, setIsAdvanceSearch] = useState(false);
    const [isShowSearchResult, setIsShowSearchResult] = useState(false);
    const [showAddTestCaseForm, setShowAddTestCaseForm] = useState(false);
    const [showTestCaseDetail, setShowTestCaseDetail] = useState(false);
    const page = useSelector((state:RootState) => state.testCase.page);
    const testCases = useSelector((state:RootState) => state.testCase.testCases);
    const totalCaseNum = useSelector((state:RootState) => state.testCase.total);

    const data = {
        tags: useSelector((state:RootState) => state.tag.tags),
        searchMenus: [
            { key: 'my-create', name: '我创建的', icon: <UserAddOutlined /> },
        ],
    };

    useEffect(() => {
        dispatch(testCaseThunks.listTestCase({ page: 0 }));
        dispatch(tagThunks.listTags());
    }, []);
    const response = {
        handleItemChosen: async (id:number) => {
            await dispatch(testCaseThunks.getTestCaseDetail(id));
            setShowTestCaseDetail(true);
        },
        handleCancelAdd: () => {
            setShowAddTestCaseForm(false);
        },
        handleGoAdd: () => {
            setShowAddTestCaseForm(true);
        },
        handleAddTestCase: async (testcase:any) => {
            await dispatch(testCaseThunks.addTestCase(testcase));
            dispatch(testCaseThunks.listTestCase({ page }));
            setShowAddTestCaseForm(false);
        },
        handlePageChange: (pageId:number) => {
            dispatch(testCaseThunks.listTestCase({ page: pageId - 1 }));
        },
        handleClose: () => {
            setShowTestCaseDetail(false);
            setShowAddTestCaseForm(false);
        },
        handleDelCase: async (id:number) => {
            const result:any = await dispatch(testCaseThunks.deleteTestCase(id));
            if (result) {
                setShowTestCaseDetail(false);
                effToast.success_withdraw('测试用例放入回收站成功', () => response.handleWithdrawDelTestCase(id));
                dispatch(testCaseThunks.listTestCase({ page }));
            }
        },
        handleWithdrawDelTestCase: async (id:number) => {
            const result:any = await dispatch(testCaseThunks.withdrawDelTestCase(id));
            if (result) {
                effToast.success('撤销成功');
                dispatch(testCaseThunks.listTestCase({ page }));
            }
        },
        handleAdvanceSearch: async (searchKeys:any) => {
            const params:any = {
                page: 0, searchKey: searchKeys.name, funztionId: searchKeys.funztionId, tagIds: searchKeys.tagIds,
            };
            if (searchKeys.priority) {
                params.priorities = [searchKeys.priority];
            }
            await dispatch(testCaseThunks.listTestCase(params));
            setIsAdvanceSearch(false);
            setIsShowSearchResult(true);
        },
        handleCloseSearch: () => {
            setIsShowSearchResult(false);
            dispatch(testCaseThunks.listTestCase({ page: 0 }));
        },
        // 取消高级搜索
        handleCancelAdvanceSearch: () => {
            setIsAdvanceSearch(false);
        },
        handleSearchMenu: (key:string) => {
            switch (key) {
            case 'my-create':
                // TODO : 搜索我创建的
                break;
            default:
                setIsAdvanceSearch(true);
            }
        },
        handleSearch: async (value:string) => {
            await dispatch(testCaseThunks.listTestCase({ page: 0, searchKey: value }));
            setIsShowSearchResult(true);
        },
    };

    const ui = {
        testCaseList: testCases.map((item:any, index) => (
            <TestCaseItem
                key={item.id}
                showBg={index % 2 === 0}
                testCase={item}
                onChosen={response.handleItemChosen}
            />
        )),
    };

    return (
        <div className="flex-grow-1 d-flex-column">
            <div style={{ height: '40px' }} className="d-flex justify-end mt20 mb20 align-center">
                {isShowSearchResult && !isAdvanceSearch && <EffSearchResult value={totalCaseNum} onClose={response.handleCloseSearch} />}
                {isAdvanceSearch ? (
                    <TestCaseAdvanceSearch
                        onSearch={response.handleAdvanceSearch}
                        onCancel={response.handleCancelAdvanceSearch}
                        tags={data.tags}
                    />
                )
                    : <EffSearchArea onSearch={response.handleSearch} menuSelected={response.handleSearchMenu} menus={data.searchMenus} />}
                <EffButton width={100} onClick={response.handleGoAdd} type="line" round className="ml10 mr20" text="+ 新增用例" key="add" />
            </div>
            <div className="eff-test-case-content d-flex-column">

                {testCases.length === 0 ? <EffEmpty description="暂无用例" /> : ui.testCaseList}
                {testCases.length > 0 && (
                    <Pagination
                        className="mt20 mr20 align-self-end"
                        onChange={response.handlePageChange}
                        current={page + 1}
                        defaultCurrent={1}
                        total={totalCaseNum}
                    />
                )}

                <Drawer
                    title={null}
                    width="60%"
                    placement="right"
                    closable={false}
                    onClose={response.handleClose}
                    maskClosable
                    open={showAddTestCaseForm || showTestCaseDetail}
                >
                    {showAddTestCaseForm && (
                        <AddTestCaseForm
                            onConfirm={response.handleAddTestCase}
                            onCancel={response.handleCancelAdd}
                            tags={data.tags}
                        />
                    )}
                    {showTestCaseDetail && <TestCaseDetail onDel={response.handleDelCase} />}
                </Drawer>

            </div>
        </div>
    );
}
