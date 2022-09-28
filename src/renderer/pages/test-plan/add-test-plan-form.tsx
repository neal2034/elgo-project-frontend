import React, { useEffect, useState } from 'react';
import {
    Checkbox, Form, Input, Pagination, Tag,
} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { UserAddOutlined } from '@ant-design/icons';
import { funztionThunks } from '@slice/funztionSlice';
import EffButton from '../../components/eff-button/eff-button';
import EffSearchArea from '../../components/business/eff-search-area/eff-search-area';
import { RootState } from '../../store/store';
import './test-plan.less';
import EffSearchResult from '../../components/business/eff-search-result/eff-search-result';
import FunztionAdvanceSearch from '../funztion/funztion-advance-search';
import EffLabel from '../../components/business/eff-label/EffLabel';

interface IProps{
    tags:any[],
    onCancel:()=>void,
    onConfirm:(testPlanData:ITestPlanData)=>void
}
interface IFunztionSelectItemProps{
    id:number,
    showBg?:boolean,
    serial:number,
    name:string,
    status:any,
    statusId:number,
    selected?:boolean,
    showCheck?:boolean, // 是否显示checkbox
    onSelected?:(id:number, selected:boolean)=>void,

}

interface ITestPlanData{
    name:string,
    funztionIds?:number[],
}
export function FunztionSelectItem(props:IFunztionSelectItemProps) {
    const {
        id, showBg, serial, name, status, statusId, onSelected, selected = false, showCheck = true,
    } = props;
    const theStatus:{name:string, color:string} = status.filter((item:any) => item.id === statusId)[0];

    const response = {
        handleChange: (event:any) => {
            const isSelected = event.target.checked;
            if (onSelected) {
                onSelected(id, isSelected);
            }
        },
    };

    return (
        <div className={`funztion-select-item d-flex align-center pr20 justify-between pl20 ${showBg ? 'shadowed' : ''}`}>
            <div className="funz-main">
                {showCheck && <Checkbox checked={selected} onChange={response.handleChange} />}
                <span className="ml10">{serial}</span>
                <span className="ml20">{name}</span>
            </div>
            <div>
                <Tag className="ml10" color={theStatus && theStatus.color}>{theStatus && theStatus.name}</Tag>
            </div>
        </div>
    );
}

export default function AddTestPlanForm(props:IProps) {
    const dispatch = useDispatch();
    const { tags, onCancel, onConfirm } = props;
    const [testPlanForm] = Form.useForm();
    const searchMenus = [{ key: 'done', name: '已完成的', icon: <UserAddOutlined /> }];
    const [isAdvanceSearch, setIsAdvanceSearch] = useState(false);
    const [isShowSearchResult, setIsShowSearchResult] = useState(false);
    const funztionStatus = useSelector((state:RootState) => state.funztion.funztionStatus);
    const funztions = useSelector((state:RootState) => state.funztion.funztions);
    const page = useSelector((state:RootState) => state.funztion.page);
    const totalFunztionNum = useSelector((state:RootState) => state.funztion.funzTotal);
    const [selectedFunztionIds, setSelectedFunztionIds] = useState<number[]>([]);
    const [isSelectAll, setIsSelectAll] = useState(false);

    useEffect(() => {
        dispatch(funztionThunks.listFunztion({ page: 0 }));
    }, []);
    useEffect(() => {
        let selectAll = true;
        funztions.forEach((funztion) => {
            if (selectedFunztionIds.indexOf(funztion.id) === -1) {
                selectAll = false;
            }
        });
        setIsSelectAll(selectAll);
    },
    [funztions, selectedFunztionIds]);
    const response = {
        handleFunztionSelected: (id:number, selected:boolean) => {
            const tempIds = Object.assign([], selectedFunztionIds);
            if (selected) {
                tempIds.push(id);
            } else {
                const index = tempIds.indexOf(id);
                tempIds.splice(index, 1);
            }
            setSelectedFunztionIds(tempIds);
        },
        handleSave: async () => {
            const values = await testPlanForm.validateFields();
            const data = { name: values.name, functionIds: selectedFunztionIds };
            onConfirm(data);
        },
        handlePageChange: async (pageId:number) => {
            await dispatch(funztionThunks.listFunztion({ page: pageId - 1 }));
        },
        handleSearchFunztion: async (value:string) => {
            await dispatch(funztionThunks.listFunztion({ page: 0, name: value }));
            setIsShowSearchResult(true);
        },
        handleCloseSearch: () => {
            dispatch(funztionThunks.listFunztion({ page: 0 }));
            setIsShowSearchResult(false);
        },
        handleSearchMenu: (key:string) => {
            switch (key) {
            case 'done':
                break;
            default:
                setIsAdvanceSearch(true);
            }
        },
        handleCancelAdvanceSearch: () => {
            setIsAdvanceSearch(false);
        },
        handleAdvanceSearch: async (searchKeys:any) => {
            const params = { page: 0, ...searchKeys };
            await dispatch(funztionThunks.listFunztion(params));
            setIsAdvanceSearch(false);
            setIsShowSearchResult(true);
        },
        handleSelectAll: (e:any) => {
            const selected = e.target.checked;
            setIsSelectAll(selected);
            if (selected) {
                const notSelectIds:any = [];
                funztions.forEach((funztion:any) => {
                    if (selectedFunztionIds.indexOf(funztion.id) === -1) {
                        notSelectIds.push(funztion.id);
                    }
                });
                const tempIds = notSelectIds.concat(selectedFunztionIds);
                setSelectedFunztionIds(tempIds);
            } else {
                const tempIds = Object.assign([], selectedFunztionIds);
                funztions.forEach((funztion:any) => {
                    const index = tempIds.indexOf(funztion.id);
                    if (index > -1) {
                        tempIds.splice(index, 1);
                    }
                });
                setSelectedFunztionIds(tempIds);
            }
        },
    };
    const ui = {
        funztionList: funztions.map((item:any, index) => (
            <FunztionSelectItem
                key={item.id}
                id={item.id}
                selected={selectedFunztionIds.indexOf(item.id) > -1}
                status={funztionStatus}
                showBg={index % 2 === 0}
                statusId={item.statusId}
                onSelected={response.handleFunztionSelected}
                name={item.name}
                serial={item.serial}
            />
        )),
    };

    return (
        <div className="eff-add-test-case-form">
            <div className="title  pb10 mb20">
                <span>新增计划</span>
            </div>
            <Form initialValues={{ priority: 'NONE' }} colon={false} form={testPlanForm} requiredMark={false}>
                <Form.Item name="name" label="计划名称" rules={[{ required: true, message: '请输入计划名称' }]}>
                    <Input size="large" />
                </Form.Item>

            </Form>
            <div className="d-flex-column">
                <div className="d-flex justify-between align-center">
                    <EffLabel name="添加测试" />
                    <div style={{ height: '40px' }} className="d-flex justify-end mt20 mb20 align-center">
                        {isShowSearchResult && !isAdvanceSearch && <EffSearchResult value={totalFunztionNum} onClose={response.handleCloseSearch} />}
                        {isAdvanceSearch ? (
                            <FunztionAdvanceSearch
                                onSearch={response.handleAdvanceSearch}
                                onCancel={response.handleCancelAdvanceSearch}
                                tags={tags}
                            />
                        )
                            : <EffSearchArea onSearch={response.handleSearchFunztion} menuSelected={response.handleSearchMenu} menus={searchMenus} />}
                    </div>
                </div>
                <div className="mt10 ml40">
                    {ui.funztionList}
                    <div className="d-flex justify-between align-center">
                        <Checkbox checked={isSelectAll} onChange={response.handleSelectAll} className="ml20">当页全选</Checkbox>
                        <Pagination
                            className="mt20 mr20 align-self-end"
                            onChange={response.handlePageChange}
                            current={page + 1}
                            defaultCurrent={1}
                            total={totalFunztionNum}
                        />
                    </div>
                </div>

            </div>

            <div className="btn-group d-flex mt40">
                <EffButton type="line" round className="mr20" onClick={() => onCancel()} text="取消" key="cancel" />
                <EffButton type="filled" round onClick={response.handleSave} text="保存" key="confirm" />
            </div>
        </div>
    );
}
