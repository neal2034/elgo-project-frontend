import React, { useEffect, useState } from 'react';
import { UserAddOutlined, FieldTimeOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { tagThunks } from '@slice/tagSlice';
import { reqThunks } from '@slice/reqSlice';
import { Drawer } from 'antd';
import { funztionThunks } from '@slice/funztionSlice';
import FunztionContent from './funztion-content';
import EffSearchResult from '../../components/business/eff-search-result/eff-search-result';
import EffSearchArea from '../../components/business/eff-search-area/eff-search-area';
import EffButton from '../../components/eff-button/eff-button';
import FunztionAdvanceSearch from './funztion-advance-search';
import './funztion.less';
import FunztionForm from './funztion-form';
import { RootState } from '../../store/store';

export default function Funztion() {
    const dispatch = useDispatch();
    const [isAdvanceSearch, setIsAdvanceSearch] = useState(false);
    const [isShowSearchResult, setIsShowSearchResult] = useState(false);
    const [isOpenAddForm, setIsOpenAddForm] = useState(false);

    const data = {
        tags: useSelector((state:RootState) => state.tag.tags),
        funztions: useSelector((state:RootState) => state.funztion.funztions),
        funzTotal: useSelector((state:RootState) => state.funztion.funzTotal),
        searchMenus: [
            { key: 'my-create', name: '我创建的功能', icon: <UserAddOutlined /> },
            { key: 'unstart', name: '未开始的功能', icon: <FieldTimeOutlined /> },

        ],
    };

    useEffect(() => {
        dispatch(funztionThunks.listFunztion({ page: 0 }));
        dispatch(reqThunks.listReqOptions());
        dispatch(tagThunks.listTags());
    }, []);

    const response = {
        handleAddFunztion: async (funztion:any) => {
            await dispatch(funztionThunks.addFunztion(funztion));
            setIsOpenAddForm(false);
        },
        handleCancelAdd: () => {
            setIsOpenAddForm(false);
        },
        handleSearch: async (value:string) => {
            await dispatch(funztionThunks.listFunztion({ page: 0, name: value }));
            setIsShowSearchResult(true);
        },
        // 取消高级搜索
        handleCancelAdvanceSearch: () => {
            setIsAdvanceSearch(false);
        },
        handleAdvanceSearch: async (searchKeys:any) => {
            const params = { page: 0, ...searchKeys };
            await dispatch(funztionThunks.listFunztion(params));
            setIsAdvanceSearch(false);
            setIsShowSearchResult(true);
        },
        handleCloseSearch: () => {
            setIsShowSearchResult(false);
            dispatch(funztionThunks.listFunztion({ page: 0 }));
        },
        handleSearchMenu: (key:string) => {
            switch (key) {
            case 'my-create':
                break;
            case 'unstart':
                break;
            default:
                setIsAdvanceSearch(true);
            }
        },

    };

    return (
        <div className="flex-grow-1 d-flex-column eff-funztions">
            <div style={{ height: '40px' }} className="d-flex justify-end mt20 mb20 align-center">
                {isShowSearchResult && !isAdvanceSearch && <EffSearchResult value={data.funzTotal} onClose={response.handleCloseSearch} />}
                {isAdvanceSearch ? (
                    <FunztionAdvanceSearch
                        onSearch={response.handleAdvanceSearch}
                        onCancel={response.handleCancelAdvanceSearch}
                        tags={data.tags}
                    />
                )
                    : <EffSearchArea onSearch={response.handleSearch} menuSelected={response.handleSearchMenu} menus={data.searchMenus} />}
                <EffButton width={100} onClick={() => setIsOpenAddForm(true)} type="line" round className="ml10 mr20" text="+ 新增功能" key="add" />
            </div>
            <FunztionContent funztions={data.funztions} />
            <Drawer
                title={null}
                width="60%"
                placement="right"
                closable={false}
                maskClosable={false}
                visible={isOpenAddForm}
            >
                <FunztionForm tags={data.tags} onCancel={response.handleCancelAdd} onConfirm={response.handleAddFunztion} />
            </Drawer>

        </div>
    );
}
