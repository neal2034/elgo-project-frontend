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
import EffTaskStatus from '@components/business/eff-task-status/eff-task-status';
import EffEditableInput from '../../components/common/eff-editable-input/eff-editable-input';
import EffActions from '../../components/business/eff-actions/eff-actions';
import { RootState } from '../../store/store';
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

    const data = {
        currentFunztion: useSelector((state:RootState) => state.funztion.currentFunztion),
        funztionCases: useSelector((state:RootState) => state.testCase.funztionCases),
        allTags: useSelector((state:RootState) => state.tag.tags),
        funztionStatus: useSelector((state:RootState) => state.funztion.funztionStatus),
        filteredReqs: useSelector((state:RootState) => state.requirement.requirements),
        page: useSelector((state:RootState) => state.funztion.page),
        menuItems: [
            { key: 'delete', name: '删除功能', icon: <DeleteOutlined style={{ fontSize: '14px' }} /> },
        ],
    };

    useEffect(() => {
        // 如果有所属需求，列出对应需求
        if (data.currentFunztion.reqId) {
            dispatch(reqThunks.listPageRequirement({ page: 0, id: data.currentFunztion.reqId }));
        }

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

    console.log('case are ', data.funztionCases);

    const response = {
        occupy: () => {
            // TODO 替换该函数
        },
        onTagsChanged: async (ids:any) => {
            await dispatch(funztionThunks.editFunztionTags(data.currentFunztion.id, ids));
            dispatch(funztionThunks.getFunztionDetail(data.currentFunztion.id));
        },
        // tags area 标签删除响应
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
            await dispatch(funztionThunks.editFunztionRequirement(data.currentFunztion.id, reqId as (number|undefined)));
            dispatch(funztionThunks.getFunztionDetail(data.currentFunztion.id));
        },

        handleStatusChange: async (statusId?:string|number) => {
            await dispatch(funztionThunks.editFunztionStatus(data.currentFunztion.id, statusId as number));
            dispatch(funztionThunks.getFunztionDetail(data.currentFunztion.id));
            dispatch(funztionThunks.listFunztion({ page: 0 }));
        },
        handleDesChange: async (description?:string) => {
            await dispatch(funztionThunks.editFunztionDes(data.currentFunztion.id, description));
            dispatch(funztionThunks.getFunztionDetail(data.currentFunztion.id));
        },
        // 菜单选择响应
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
            console.log('will add tstca se to ', testcase);
            await dispatch(testCaseThunks.addTestCase(testcase));
            dispatch(testCaseThunks.listFunztionCases({ page: 0, funztionId: data.currentFunztion.id }));
            setShowAddCaseForm(false);
        },
    };

    return (
        <div className="pt40 pl40 pr40 pb40">
            <div className="d-flex justify-between align-center">
                <EffEditableInput
                    errMsg="请输入功能名称"
                    className="flex-grow-1"
                    isRequired
                    onChange={response.occupy}
                    value={data.currentFunztion.name}
                    placeholder="请输入功能名称"
                />
                <EffActions onSelect={response.menuSelected} menus={data.menuItems} className="ml40" width="30px" />
            </div>
            <EffItemInfo
                className="ml10"
                serial={data.currentFunztion.serial!}
                creator={data.currentFunztion.creator && data.currentFunztion.creator.name}
            />
            <EffInfoSep className="mt20 ml10" name="基础信息" />

            <div style={{ marginLeft: '60px' }}>
                <div className="d-flex align-center mt20">
                    <EffLabel name="所属需求" />
                    <EffEditableSelector
                        id={data.currentFunztion.reqId}
                        onSearch={response.handleSearchRequirement}
                        searchAble
                        options={data.filteredReqs}
                        onChange={response.handleRequirementChange}
                    />

                </div>

                <div className="d-flex align-center mt20">
                    <EffLabel name="状态" />
                    <EffEditableSelector id={data.currentFunztion.statusId} options={data.funztionStatus} onChange={response.handleStatusChange} />

                </div>

                {false && (
                    <div className="d-flex align-center mt20">
                        <EffLabel name="标签" />
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
                <EffInfoSep className="mt40 ml10" name="对应任务" />
                <PlusSquareOutlined
                    onClick={() => setShowAddTaskForm(true)}
                    className="cursor-pointer ml10"
                    style={{ color: globalColor.mainYellowDark, fontSize: '20px' }}
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
                <EffInfoSep className="mt40 ml10" name="对应用例" />
                <PlusSquareOutlined
                    onClick={() => setShowAddCaseForm(true)}
                    className="cursor-pointer ml10"
                    style={{ color: globalColor.mainYellowDark, fontSize: '20px' }}
                />
            </div>
            <div className="ml20 mt20 pr40" style={{ marginLeft: '60px' }}>
                {data.funztionCases.map((item:any) => <FunztionCase key={item.id} name={item.name} />)}
            </div>

            <EffInfoSep className="mt40 ml10" name="功能描述" />
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
