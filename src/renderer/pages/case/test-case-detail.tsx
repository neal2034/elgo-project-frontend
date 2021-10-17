import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DeleteOutlined } from '@ant-design/icons';
import { testCaseThunks } from '@slice/testCaseSlice';
import { PRIORITY } from '@config/sysConstant';
import { funztionActions, funztionThunks } from '@slice/funztionSlice';
import { tagThunks } from '@slice/tagSlice';
import EffEditableInput from '../../components/common/eff-editable-input/eff-editable-input';
import EffActions from '../../components/business/eff-actions/eff-actions';
import EffItemInfo from '../../components/business/eff-item-info/eff-item-info';
import EffInfoSep from '../../components/business/eff-info-sep/eff-info-sep';
import EffEditableDoc from '../../components/common/eff-editable-doc/eff-editable-doc';
import { RootState } from '../../store/store';
import EffLabel from '../../components/business/eff-label/EffLabel';
import EffEditableSelector from '../../components/common/eff-editable-selector/eff-editable-selector';
import EffTagArea from '../../components/common/eff-tag-area/eff-tag-area';
import EffTagSelector from '../../components/common/eff-tag-selector/eff-tag-selector';

interface IProps{
    onDel:(id:number)=>void
}

export default function TestCaseDetail(props:IProps) {
    const { onDel } = props;
    const dispatch = useDispatch();
    const currentTestCase = useSelector((state:RootState) => state.testCase.currentTestCase);
    const page = useSelector((state:RootState) => state.testCase.page);
    const filterFunztion = useSelector((state:RootState) => state.funztion.funztions);
    const tags = useSelector((state:RootState) => state.tag.tags);
    const [selectedTags, setSelectedTags] = useState<any>([]);
    const menuItems = [
        { key: 'delete', name: '删除测试用例', icon: <DeleteOutlined style={{ fontSize: '14px' }} /> },
    ];
    const priorityOptions = Object.keys(PRIORITY).map((item:any) => ({ id: PRIORITY[item].key, name: PRIORITY[item].name }));
    useEffect(() => {
        // 如果有所属功能，列出对应功能
        if (currentTestCase.funztionId) {
            dispatch(funztionThunks.listFunztion({ page: 0, id: currentTestCase.funztionId }));
        }

        dispatch(tagThunks.listTags());
    }, []);

    useEffect(() => {
        const tagIds = currentTestCase.tagIds ? currentTestCase.tagIds : [];
        const selectTags = tags.filter((item:any) => tagIds.indexOf(item.id) > -1);
        setSelectedTags(selectTags);
    }, [currentTestCase.tagIds]);

    const response = {
        handleEditName: async (name?:string) => {
            await dispatch(testCaseThunks.editTestCaseName({ id: currentTestCase.id, name: name as string }));
            dispatch(testCaseThunks.getTestCaseDetail(currentTestCase.id));
            dispatch(testCaseThunks.listTestCase({ page }));
        },
        handleEditDes: async (description?:string) => {
            await dispatch(testCaseThunks.editTestCaseDes({ id: currentTestCase.id, description }));
            dispatch(testCaseThunks.getTestCaseDetail(currentTestCase.id));
        },
        handleSearchFunztion: async (value?:string) => {
            if (value) {
                await dispatch(funztionThunks.listFunztion({ page: 0, name: value }));
            } else {
                dispatch(funztionActions.setFunztions([]));
            }
        },
        handleFunztionChange: async (funztionId?:number|string) => {
            await dispatch(testCaseThunks.editFunztion({ id: currentTestCase.id, funztionId: funztionId as (number|undefined) }));
            dispatch(testCaseThunks.getTestCaseDetail(currentTestCase.id));
        },

        handleEditPriority: async (priority?:string|number) => {
            await dispatch(testCaseThunks.editPriority({ id: currentTestCase.id, priority: priority as string }));
            dispatch(testCaseThunks.getTestCaseDetail(currentTestCase.id));
            dispatch(testCaseThunks.listTestCase({ page }));
        },
        // tags area 标签删除响应
        delTag: (id:number) => {
            const currentIds = Object.assign([], currentTestCase.tagIds);
            const index = currentIds.indexOf(id);
            currentIds.splice(index, 1);
            response.onTagsChanged(currentIds);
        },
        onTagsChanged: async (ids:any) => {
            await dispatch(testCaseThunks.editTags({ id: currentTestCase.id, tagIds: ids }));
            dispatch(testCaseThunks.getTestCaseDetail(currentTestCase.id));
        },
        // 菜单选择响应
        menuSelected: (key:string) => {
            if (key === 'delete') {
                onDel(currentTestCase.id as number);
            }
        },
    };

    return (
        <div className="pt40 pl40 pr40 pb40">
            <div className="d-flex justify-between align-center">
                <EffEditableInput
                    errMsg="请输入用例名称"
                    className="flex-grow-1"
                    isRequired
                    onChange={response.handleEditName}
                    value={currentTestCase.name}
                    placeholder="请输入用例名称"
                />
                <EffActions onSelect={response.menuSelected} menus={menuItems} className="ml40" width="30px" />
            </div>
            <EffItemInfo className="ml10" serial={currentTestCase.serial!} creator={currentTestCase.creator && currentTestCase.creator.name} />
            <EffInfoSep className="mt20 ml10" name="基础信息" />

            <div style={{ marginLeft: '60px' }}>
                <div className="d-flex align-center mt20">
                    <EffLabel name="所属功能" />
                    <EffEditableSelector
                        id={currentTestCase.funztionId}
                        onSearch={response.handleSearchFunztion}
                        searchAble
                        options={filterFunztion}
                        onChange={response.handleFunztionChange}
                    />

                </div>

                <div className="d-flex align-center mt20">
                    <EffLabel name="优先级" />
                    <EffEditableSelector id={currentTestCase.priority} options={priorityOptions} onChange={response.handleEditPriority} />

                </div>

                <div className="d-flex align-center mt20">
                    <EffLabel name="标签" />
                    <div className="d-flex ml10">
                        <EffTagArea onDel={response.delTag} tags={selectedTags} />
                        <EffTagSelector
                            onChange={response.onTagsChanged}
                            chosen={currentTestCase.tagIds ? currentTestCase.tagIds : []}
                            tags={tags}
                        />

                    </div>
                </div>
            </div>

            <EffInfoSep className="mt40 ml10" name="用例描述" />
            <div className="ml20 mt20 pr40">
                <EffEditableDoc onSave={response.handleEditDes} height="400px" className="ml40 mt20" content={currentTestCase.description} />
            </div>

        </div>
    );
}
