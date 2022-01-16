import React, { useEffect, useState } from 'react';
import { FieldTimeOutlined, UserAddOutlined } from '@ant-design/icons';
import './requirment.less';
import { Drawer } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { reqThunks } from '@slice/reqSlice';
import { tagThunks } from '@slice/tagSlice';
import ReqContent from '@pages/requirment/req-content';
import ReqClass from '@pages/requirment/req-class';
import EffButton from '../../components/eff-button/eff-button';
import { RootState, useAppDispatch, useAppSelector } from '../../store/store';
import AddReqForm from './add-req-form';
import EffSearchArea from '../../components/business/eff-search-area/eff-search-area';
import ReqAdvanceSearch from './req-advance-search';
import EffSearchResult from '../../components/business/eff-search-result/eff-search-result';

export default function Requirement() {
    const dispatch = useAppDispatch();

    const [showAddForm, setShowAddForm] = useState(false);
    const [isAdvanceSearch, setIsAdvanceSearch] = useState(false);
    const [isShowSearchResult, setIsShowSearchResult] = useState(false)
    const activeReqClassId = useAppSelector(state => state.requirement.activeReqClassId)
    console.log('activeReqClassId is ', activeReqClassId)

    const data = {
        reqClasses: useSelector((state:RootState) => state.requirement.reqClasses),
        rqeSources: useSelector((state:RootState) => state.requirement.reqSources),
        reqVersions: useSelector((state:RootState) => state.requirement.reqVersions),
        tags: useSelector((state:RootState) => state.tag.tags),
        requirements: useSelector((state:RootState) => state.requirement.requirements),
        totalReqNum: useSelector((state:RootState) => state.requirement.reqTotal),
        searchMenus: [
            { key: 'my-create', name: '我创建的需求', icon: <UserAddOutlined /> },
            { key: 'on-plan', name: '规划中的需求', icon: <FieldTimeOutlined /> },

        ],
    };

    useEffect(() => {
        dispatch(reqThunks.listPageRequirement({ page: 0 }));
        dispatch(reqThunks.listAllReqClasses());
        dispatch(reqThunks.listAllReqSource());
        dispatch(reqThunks.listAllReqVersions());
        dispatch(tagThunks.listTags());
    }, []);

    const response = {
        handleAddReqBtn: () => {
            setShowAddForm(true);
        },

        cancelAddReq: () => {
            setShowAddForm(false);
        },

        handleRequirementAdd: async (requirement:any) => {
            setShowAddForm(false);
            requirement.classId = requirement.classId === -1 ? undefined : requirement.classId
            const result = await dispatch(reqThunks.addRequirement(requirement));
            if (result) {
                dispatch(reqThunks.listPageRequirement({ page: 0, clazzId: activeReqClassId === -2 ? undefined : activeReqClassId }));
            }
        },

        handleSearchMenu: (key:string) => {
            switch (key) {
            case 'my-create':
                // TODO fulfill this
                break;
            case 'on-plan':
                // TODO fulfill this
                break;
            default:
                setIsAdvanceSearch(true);
            }
        },

        handleAdvanceSearch: async (searchKeys:any) => {
            const params = { page: 0, ...searchKeys };
            await dispatch(reqThunks.listPageRequirement(params));
            setIsAdvanceSearch(false);
            setIsShowSearchResult(true);
        },
        handleSearch: async (value:string) => {
            await dispatch(reqThunks.listPageRequirement({ page: 0, name: value }));
            setIsShowSearchResult(true);
        },
        // 取消高级搜索
        handleCancelAdvanceSearch: () => {
            setIsAdvanceSearch(false);
        },
        handleCloseSearch: () => {
            setIsShowSearchResult(false);
            dispatch(reqThunks.listPageRequirement({ page: 0 }));
        },
    };

    return (
        <div className="d-flex-column">
            <div style={{ height: '40px' }} className="d-flex justify-end mt20 mb20 align-center">
                {isShowSearchResult && !isAdvanceSearch && <EffSearchResult value={data.totalReqNum} onClose={response.handleCloseSearch} />}
                {isAdvanceSearch ? (
                    <ReqAdvanceSearch
                        onCancel={response.handleCancelAdvanceSearch}
                        onSearch={response.handleAdvanceSearch}
                        reqClasses={data.reqClasses}
                        reqSources={data.rqeSources}
                        reqVersions={data.reqVersions}
                        tags={data.tags}
                    />
                )
                    : <EffSearchArea onSearch={response.handleSearch} menuSelected={response.handleSearchMenu} menus={data.searchMenus} />}
                <EffButton width={100} onClick={response.handleAddReqBtn} type="line" round className="ml10 mr20" text="+ 新增需求" key="add" />
            </div>
            <div className="d-flex mt10">
                <ReqClass reqClasses={data.reqClasses} />
                <ReqContent requirements={data.requirements} />
            </div>
            <Drawer
                title={null}
                width="60%"
                placement="right"
                closable={false}
                maskClosable={false}
                visible={showAddForm}
            >
                <AddReqForm
                    reqClasses={data.reqClasses}
                    onConfirm={response.handleRequirementAdd}
                    reqClassId={activeReqClassId}
                    tags={data.tags}
                    reqSources={data.rqeSources}
                    reqVersions={data.reqVersions}
                    onCancel={response.cancelAddReq}
                />
            </Drawer>

        </div>
    );
}
