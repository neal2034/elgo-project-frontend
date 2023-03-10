import React, { useEffect, useState } from 'react';
import { DeleteOutlined, PlusSquareOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { tagThunks } from '@slice/tagSlice';
import { reqActions, reqThunks } from '@slice/reqSlice';
import { funztionThunks } from '@slice/funztionSlice';
import globalColor from '@config/globalColor';
import { Drawer } from 'antd';
import { taskThunks } from '@slice/taskSlice';
import { testCaseThunks } from '@slice/testCaseSlice';
import { RootState } from '@store/store';
import {FUNZTION_STATUS} from "@config/sysConstant";
import EffTaskStatus from '@components/business/eff-task-status/eff-task-status';
import EffEditableInput from '../../components/common/eff-editable-input/eff-editable-input';
import EffActions from '../../components/business/eff-actions/eff-actions';
import EffItemInfo from '../../components/business/eff-item-info/eff-item-info';
import EffInfoSep from '../../components/business/eff-info-sep/eff-info-sep';
import EffLabel from '../../components/business/eff-label/EffLabel';
import EffTagArea from '../../components/common/eff-tag-area/eff-tag-area';
import EffTagSelector from '../../components/common/eff-tag-selector/eff-tag-selector';
import EffEditableSelector from '../../components/common/eff-editable-selector/eff-editable-selector';
import EffEditableDoc from '../../components/common/eff-editable-doc/eff-editable-doc';
import AddTaskForm from '../task/add-task-form';
import './funztion.less';
import AddTestCaseForm from '../case/add-test-case-form';


interface IProps{
    onDel:(id:number)=>void
}

interface IFunztionTaskProps{
    name:string,
    status:string,
    handlerName?:string
}

interface IFunztionCaseProps{
    name:string,
}

function FunztionTask(props:IFunztionTaskProps) {
    const { name, status, handlerName } = props;
    return (
        <div className="d-flex mt10 justify-between funztion-task" style={{ maxWidth: '500px' }}>
            <div>{name}</div>
            <div className="d-flex">
                <span>{handlerName}</span>
                <EffTaskStatus value={status} className="ml10" />
            </div>
        </div>
    );
}

function FunztionCase(props:IFunztionCaseProps) {
    const { name } = props;
    return (
        <div className="d-flex mt10 justify-between funztion-task" style={{ maxWidth: '500px' }}>
            <div>{name}</div>
        </div>
    );
}

export default function FunztionDetail(props:IProps) {
    const { onDel } = props;
    const dispatch = useDispatch();
    const [selectedTags, setSelectedTags] = useState<any[]>([]);
    const [showAddTaskForm, setShowAddTaskForm] = useState(false);
    const [showAddCaseForm, setShowAddCaseForm] = useState(false);
    // ????????????options
    const funztionStatusOptions = Object.keys(FUNZTION_STATUS).map((opt:any) => (
        { id: FUNZTION_STATUS[opt].key, name: FUNZTION_STATUS[opt].name }));

    const data = {
        currentFunztion: useSelector((state:RootState) => state.funztion.currentFunztion),
        funztionCases: useSelector((state:RootState) => state.testCase.funztionCases),
        allTags: useSelector((state:RootState) => state.tag.tags),
        reqOptions: useSelector((state:RootState) => state.requirement.reqOptions),
        page: useSelector((state:RootState) => state.funztion.page),
        menuItems: [
            { key: 'delete', name: '????????????', icon: <DeleteOutlined style={{ fontSize: '14px' }} /> },
        ],
    };

    useEffect(() => {
        dispatch(tagThunks.listTags());
    }, []);

    useEffect(() => {
        const tagIds = data.currentFunztion.tagIds ? data.currentFunztion.tagIds : [];
        const selectTags = data.allTags.filter((item:any) => tagIds.indexOf(item.id) > -1);
        setSelectedTags(selectTags);
    }, [data.currentFunztion.tagIds]);

    useEffect(() => {
        dispatch(testCaseThunks.listFunztionCases({ page: 0, funztionId: data.currentFunztion.id }));
    }, [data.currentFunztion.id]);

    const response = {

        onFunztionNameChanged:async(name?:string)=>{
                const funztion = {id:data.currentFunztion.id, name}
                await dispatch(funztionThunks.editFunztion(funztion))
                dispatch(funztionThunks.getFunztionDetail(data.currentFunztion.id));
                dispatch(funztionThunks.listFunztion({ page: 0 }));
        },
        onTagsChanged: async (ids:any) => {
            await dispatch(funztionThunks.editFunztionTags(data.currentFunztion.id, ids));
            dispatch(funztionThunks.getFunztionDetail(data.currentFunztion.id));

        },
        // tags area ??????????????????
        delTag: (id:number) => {
            const currentIds = Object.assign([], data.currentFunztion.tagIds);
            const index = currentIds.indexOf(id);
            currentIds.splice(index, 1);
            response.onTagsChanged(currentIds);
        },
        handleSearchRequirement: async (value:string) => {
            if (value) {
                await dispatch(reqThunks.listPageRequirement({ page: 0, name: value }));
            } else {
                dispatch(reqActions.setRequirements([]));
            }
        },

        handleRequirementChange: async (reqId?:string|number) => {
            await dispatch(funztionThunks.editFunztion({id:data.currentFunztion.id, reqId: reqId as number}))
            dispatch(funztionThunks.getFunztionDetail(data.currentFunztion.id));
        },

        handleStatusChange: async (status?:string|number) => {
            await dispatch(funztionThunks.editFunztion({id: data.currentFunztion.id, status: status as string}));
            dispatch(funztionThunks.getFunztionDetail(data.currentFunztion.id));
            dispatch(funztionThunks.listFunztion({ page: 0 }));
        },
        handleDesChange: async (description?:string) => {
            await dispatch(funztionThunks.editFunztion({id:data.currentFunztion.id, description}))
            dispatch(funztionThunks.getFunztionDetail(data.currentFunztion.id));
        },
        // ??????????????????
        menuSelected: (key:string) => {
            if (key === 'delete') {
                onDel(data.currentFunztion.id as number);
            }
        },
        addTaskOfFunztion: async (task:any) => {
            const deadline = task.deadline ? task.deadline.format('YYYY-MM-DD 00:00:00') : undefined;
            const payload = { ...task, deadline, funztionId: data.currentFunztion.id };
            await dispatch(taskThunks.addTask(payload));
            dispatch(funztionThunks.getFunztionDetail(data.currentFunztion.id));
            setShowAddTaskForm(false);
        },
        cancelAddTask: () => {
            setShowAddTaskForm(false);
        },
        addCaseOfFunztion: async (testcase:any) => {
            await dispatch(testCaseThunks.addTestCase(testcase));
            dispatch(testCaseThunks.listFunztionCases({ page: 0, funztionId: data.currentFunztion.id }));
            setShowAddCaseForm(false);
        },
    };

    return (
        <div className="pt40 pl40 pr40 pb40">
            <div className="d-flex justify-between align-center">
                <EffEditableInput
                    errMsg="?????????????????????"
                    className="flex-grow-1"
                    isRequired
                    onChange={response.onFunztionNameChanged}
                    value={data.currentFunztion.name}
                    placeholder="?????????????????????"
                />
                <EffActions onSelect={response.menuSelected} menus={data.menuItems} className="ml40" width="30px" />
            </div>
            <EffItemInfo
                className="ml10"
                serial={data.currentFunztion.serial!}
                creator={data.currentFunztion.creator && data.currentFunztion.creator.name}
            />
            <EffInfoSep className="mt20 ml10" name="????????????" />

            <div style={{ marginLeft: '60px' }}>
                <div className="d-flex align-center mt20">
                    <EffLabel name="????????????" />
                    <EffEditableSelector
                        id={data.currentFunztion.reqId}
                        onSearch={response.handleSearchRequirement}
                        searchAble
                        options={data.reqOptions}
                        onChange={response.handleRequirementChange}
                    />

                </div>

                <div className="d-flex align-center mt20">
                    <EffLabel name="??????" />
                    <EffEditableSelector id={data.currentFunztion.status} options={funztionStatusOptions} onChange={response.handleStatusChange} />

                </div>

                {false && (
                    <div className="d-flex align-center mt20">
                        <EffLabel name="??????" />
                        <div className="d-flex ml10">
                            <EffTagArea onDel={response.delTag} tags={selectedTags} />
                            <EffTagSelector
                                onChange={response.onTagsChanged}
                                chosen={data.currentFunztion.tagIds ? data.currentFunztion.tagIds : []}
                                tags={data.allTags}
                            />
                        </div>
                    </div>
                )}
            </div>

            <div className="d-flex align-end">
                <EffInfoSep className="mt40 ml10" name="????????????" />
                <PlusSquareOutlined
                    onClick={() => setShowAddTaskForm(true)}
                    className="cursor-pointer ml10"
                    style={{
                        color: globalColor.mainYellowDark,
                        fontSize: '20px',
                    }}
                />
            </div>
            <div className="ml20 mt20 pr40" style={{ marginLeft: '60px' }}>
                {data.currentFunztion && data.currentFunztion.tasks && data.currentFunztion.tasks.map((item:any) => (
                    <FunztionTask
                        key={item.id}
                        handlerName={item.handlerName}
                        status={item.status}
                        name={item.name}
                    />
                ))}
            </div>

            <div className="d-flex align-end">
                <EffInfoSep className="mt40 ml10" name="????????????" />
                <PlusSquareOutlined
                    onClick={() => setShowAddCaseForm(true)}
                    className="cursor-pointer ml10"
                    style={{
                        color: globalColor.mainYellowDark,
                        fontSize: '20px',
                    }}
                />
            </div>
            <div className="ml20 mt20 pr40" style={{ marginLeft: '60px' }}>
                {data.funztionCases.map((item:any) => <FunztionCase key={item.id} name={item.name} />)}
            </div>

            <EffInfoSep className="mt40 ml10" name="????????????" />
            <div className="ml20 mt20 pr40">
                <EffEditableDoc onSave={response.handleDesChange} height="400px" className="ml40 mt20" content={data.currentFunztion.description} />
            </div>

            <Drawer
                title={null}
                width="60%"
                placement="right"
                closable={false}
                visible={showAddTaskForm}
                onClose={() => setShowAddTaskForm(false)}
            >
                <AddTaskForm
                    tags={data.allTags}
                    onCancel={response.cancelAddTask}
                    funztion={data.currentFunztion}
                    onConfirm={response.addTaskOfFunztion}
                />
            </Drawer>

            <Drawer
                title={null}
                width="60%"
                placement="right"
                closable={false}
                visible={showAddCaseForm}
                onClose={() => setShowAddCaseForm(false)}
            >
                <AddTestCaseForm
                    funztionId={data.currentFunztion && data.currentFunztion.id}
                    tags={data.allTags}
                    onCancel={() => setShowAddCaseForm(false)}
                    onConfirm={response.addCaseOfFunztion}
                />
            </Drawer>

        </div>
    );
}
