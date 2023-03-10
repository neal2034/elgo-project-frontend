import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { reqThunks } from '@slice/reqSlice';
import { tagThunks } from '@slice/tagSlice';
import {FUNZTION_STATUS, REQUIREMENT_STATUS} from '@config/sysConstant';
import { DeleteOutlined, PlusSquareOutlined } from '@ant-design/icons';
import globalColor from '@config/globalColor';
import { Drawer, Tag } from 'antd';
import { funztionThunks } from '@slice/funztionSlice';
import EffEditableInput from '../../components/common/eff-editable-input/eff-editable-input';
import EffEditableSelector from '../../components/common/eff-editable-selector/eff-editable-selector';
import { RootState } from '../../store/store';

import EffTagArea from '../../components/common/eff-tag-area/eff-tag-area';
import EffTagSelector from '../../components/common/eff-tag-selector/eff-tag-selector';
import EffEditableDoc from '../../components/common/eff-editable-doc/eff-editable-doc';
import EffActions from '../../components/business/eff-actions/eff-actions';
import EffItemInfo from '../../components/business/eff-item-info/eff-item-info';
import EffInfoSep from '../../components/business/eff-info-sep/eff-info-sep';
import EffLabel from '../../components/business/eff-label/EffLabel';
import FunztionForm from '../funztion/funztion-form';

interface IProps{
    onDel:(id:number)=>void
}

interface IFunztionProps{
    name:string,
    status?:{
        name:string,
        color:string,
    }

}

function ReqFunztion(props:IFunztionProps) {
    const { name, status } = props;
    return (
        <div className="d-flex mt10 justify-between funztion-task" style={{ maxWidth: '500px' }}>
            <div>{name}</div>
            <div className="d-flex">
                <Tag className="ml10" color={status && status.color}>{status && status.name}</Tag>
            </div>
        </div>
    );
}

export default function RequirementDetail(props:IProps) {
    const { onDel } = props;
    const dispatch = useDispatch();
    const [selectedTags, setSelectedTags] = useState<any[]>([]);
    const [showAddFunztionForm, setShowAddFunztionForm] = useState(false);
    // const funztionStatus = useSelector((state:RootState) => state.funztion.funztionStatus);

    // ????????????options
    const reqStatusOptions = Object.keys(REQUIREMENT_STATUS).map((opt:any) => (
        { id: REQUIREMENT_STATUS[opt].key, name: REQUIREMENT_STATUS[opt].name }));
    const data = {
        reqClasses: useSelector((state:RootState) => state.requirement.reqClasses),
        rqeSources: useSelector((state:RootState) => state.requirement.reqSources),
        reqVersions: useSelector((state:RootState) => state.requirement.reqVersions),
        reqFunztions: useSelector((state:RootState) => state.funztion.reqFunztions),
        allTags: useSelector((state:RootState) => state.tag.tags),
        currentReqPage: useSelector((state:RootState) => state.requirement.page),
        currentRequirement: useSelector((state:RootState) => state.requirement.currentReq),
        menuItems: [
            { key: 'delete', name: '????????????', icon: <DeleteOutlined style={{ fontSize: '14px' }} /> },
        ],
    };
    const response = {
        handleAddFunztion: async (funztion:any) => {
            await dispatch(funztionThunks.addFunztion(funztion));
            dispatch(funztionThunks.listReqFunztions({ reqId: data.currentRequirement.id! }));
            setShowAddFunztionForm(false);
        },
        onNameChange: async (name?:string) => {
            await dispatch(reqThunks.editRequirement({
                id: data.currentRequirement.id!,
                field: 'NAME',
                name,
            }));
            response.refreshPage();
        },
        onReqClazzChange: async (id?:number|string) => {
            const updateId = id || -1;
            await dispatch(reqThunks.editRequirement({
                id: data.currentRequirement.id!,
                field: 'CLAZZ',
                classId: updateId as number,
            }));
            dispatch(reqThunks.listAllReqClasses());
        },
        onReqVersionChange: async (id?:number|string) => {
            const versionId = id || -1;
            await dispatch(reqThunks.editRequirement({
                id: data.currentRequirement.id!,
                field: 'VERSION',
                versionId: versionId as number,
            }));
            response.refreshPage();
        },
        onReqSourceChange: async (sourceId?:number|string) => {
            const sId = sourceId || -1;
            await dispatch(reqThunks.editRequirement({
                id: data.currentRequirement.id!,
                field: 'SOURCE',
                sourceId: sId as number,
            }));
        },
        onStatusChange: async (status?:string|number) => {
            await dispatch(reqThunks.editRequirement({
                id: data.currentRequirement.id!,
                field: 'STATUS',
                status: status as string,
            }));
            response.refreshPage();
        },
        onTagsChanged: async (ids:any) => {
            await dispatch(reqThunks.editRequirement({
                id: data.currentRequirement.id!,
                field: 'TAG',
                tagIds: ids,
            }));
        },

        onDescriptionChanged: async (value?:string) => {
            await dispatch(reqThunks.editRequirement({
                id: data.currentRequirement.id!,
                field: 'DESCRIPTION',
                description: value,

            }));
        },
        refreshPage: () => {
            dispatch(reqThunks.listPageRequirement({ page: data.currentReqPage }));
        },
        // tags area ??????????????????
        delTag: (id:number) => {
            const currentIds = Object.assign([], data.currentRequirement.tagIds);
            const index = currentIds.indexOf(id);
            currentIds.splice(index, 1);
            response.onTagsChanged(currentIds);
        },
        // ??????????????????
        menuSelected: (key:string) => {
            if (key === 'delete') {
                onDel(data.currentRequirement.id as number);
            }
        },
        // getFunztionStatus: (statusId:number) => {
        //     const status:{name:string, color:string} = funztionStatus.filter((item:any) => item.id === statusId)[0];
        //     return status;
        // },
    };

    // ???????????????
    useEffect(() => {
        dispatch(reqThunks.listAllReqClasses());
        dispatch(reqThunks.listAllReqSource());
        dispatch(reqThunks.listAllReqVersions());
        dispatch(tagThunks.listTags());
    }, []);

    useEffect(() => {
        const tagIds = data.currentRequirement.tagIds ? data.currentRequirement.tagIds : [];
        const selectTags = data.allTags.filter((item:any) => tagIds.indexOf(item.id) > -1);
        setSelectedTags(selectTags);
    }, [data.currentRequirement.tagIds]);

    return (
        <div className="pt40 pl40 pr40 pb40">
            <div className="d-flex justify-between align-center">
                <EffEditableInput
                    errMsg="?????????????????????"
                    className="flex-grow-1"
                    isRequired
                    onChange={response.onNameChange}
                    value={data.currentRequirement.name}
                    placeholder="?????????????????????"
                />
                <EffActions onSelect={response.menuSelected} menus={data.menuItems} className="ml40" width="30px" />
            </div>
            <EffItemInfo
                className="ml10"
                serial={data.currentRequirement.serial!}
                creator={data.currentRequirement.creator && data.currentRequirement.creator.name}
            />
            <EffInfoSep className="mt20 ml10" name="????????????" />

            <div className="content mt20 ml40">
                <div className="d-flex ml20">
                    <div className="d-flex align-center">
                        <EffLabel name="????????????" />
                        <EffEditableSelector
                            onChange={response.onReqClazzChange}
                            id={data.currentRequirement.classId}
                            placeholder="?????????"
                            options={data.reqClasses}
                        />
                    </div>

                    <div className="d-flex align-center  ml20">
                        <EffLabel name="??????" />
                        <EffEditableSelector
                            options={data.reqVersions}
                            id={data.currentRequirement.versionId}
                            placeholder="?????????"
                            onChange={response.onReqVersionChange}
                        />
                    </div>
                </div>

                <div className="d-flex mt10 ml20">
                    <div className="d-flex align-center">
                        <EffLabel name="??????" />
                        <EffEditableSelector
                            options={reqStatusOptions}
                            clear={false}
                            id={data.currentRequirement.status}
                            onChange={response.onStatusChange}
                        />
                    </div>

                    <div className="d-flex align-center ml20">
                        <EffLabel name="????????????" />
                        <EffEditableSelector
                            options={data.rqeSources}
                            id={data.currentRequirement.sourceId}
                            onChange={response.onReqSourceChange}
                            placeholder="?????????"
                        />
                    </div>
                </div>

                <div className="d-flex align-center ml20 mt20">
                    <EffLabel name="??????" />
                    <div className="d-flex ml10">
                        <EffTagArea onDel={response.delTag} tags={selectedTags} />
                        <EffTagSelector
                            onChange={response.onTagsChanged}
                            chosen={data.currentRequirement.tagIds ? data.currentRequirement.tagIds : []}
                            tags={data.allTags}
                        />

                    </div>
                </div>
            </div>

            <div className="d-flex align-end">
                <EffInfoSep className="mt40 ml10" name="????????????" />
                <PlusSquareOutlined
                    onClick={() => setShowAddFunztionForm(true)}
                    className="cursor-pointer ml10"
                    style={{
                        color: globalColor.mainYellowDark,
                        fontSize: '20px',
                    }}
                />
            </div>
            <div className="ml20 mt20 pr40" style={{ marginLeft: '60px' }}>
                {data.reqFunztions.map((item:any) => (
                    <ReqFunztion
                        key={item.id}
                        name={item.name}
                        status={FUNZTION_STATUS[item.status].name}
                    />
                ))}
            </div>

            <EffInfoSep className="mt40 ml10" name="????????????" />
            <div className="ml20 mt20 pr40">
                <EffEditableDoc
                    onSave={response.onDescriptionChanged}
                    height="400px"
                    className="ml40 mt20"
                    content={data.currentRequirement.description}
                />
            </div>

            <Drawer
                title={null}
                width="60%"
                placement="right"
                closable={false}
                open={showAddFunztionForm}
                onClose={() => setShowAddFunztionForm(false)}
            >
                <FunztionForm
                    reqId={data.currentRequirement.id}
                    tags={data.allTags}
                    onCancel={() => setShowAddFunztionForm(false)}
                    onConfirm={response.handleAddFunztion}
                />
            </Drawer>

        </div>
    );
}
