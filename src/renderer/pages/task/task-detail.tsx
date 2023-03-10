import React, { useEffect, useState } from 'react';
import { DeleteOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { taskThunks } from '@slice/taskSlice';
import { PRIORITY, TASK_STATUS } from '@config/sysConstant';
import { tagThunks } from '@slice/tagSlice';
import { Drawer } from 'antd';
import { funztionThunks } from '@slice/funztionSlice';
import { IProjectMember } from '@slice/projectSlice';
import { RootState } from '@store/store';
import EffEditableInput from '../../components/common/eff-editable-input/eff-editable-input';
import EffActions from '../../components/business/eff-actions/eff-actions';
import EffItemInfo from '../../components/business/eff-item-info/eff-item-info';
import EffInfoSep from '../../components/business/eff-info-sep/eff-info-sep';
import EffLabel from '../../components/business/eff-label/EffLabel';
import EffEditableSelector from '../../components/common/eff-editable-selector/eff-editable-selector';
import EffEditableDatePicker from '../../components/common/eff-editable-date-picker/eff-editable-date-picker';
import EffTagArea from '../../components/common/eff-tag-area/eff-tag-area';
import EffTagSelector from '../../components/common/eff-tag-selector/eff-tag-selector';
import EffEditableDoc from '../../components/common/eff-editable-doc/eff-editable-doc';
import './eff-tasks.less';
import FunztionDetail from '../funztion/funztion-detail';

interface IProps {
    onDel: (id: number, taskGroupId: number) => void;
    onChange?: (id: number, taskGroupId: number) => void;
}

export default function TaskDetail(props: IProps) {
    const { onDel, onChange } = props;
    const dispatch = useDispatch();
    const [memberOptions, setMemberOptions] = useState<any[]>([]);
    const [selectedTags, setSelectedTags] = useState<any[]>([]);
    const [showFunztionDetail, setShowFunztionDetail] = useState(false);

    const data = {
        menuItems: [{ key: 'delete', name: '删除任务', icon: <DeleteOutlined style={{ fontSize: '14px' }} /> }],
        allTags: useSelector((state: RootState) => state.tag.tags),
        members: useSelector((state: RootState) => state.project.projectDetail.members),
        projectMembers: useSelector((state: RootState) => state.project.projectMembers),
        currentTask: useSelector((state: RootState) => state.task.currentTask),
    };

    const priorityOptions = Object.keys(PRIORITY).map((item: any) => ({ id: PRIORITY[item].key, name: PRIORITY[item].name }));
    const taskStatusOptions = Object.keys(TASK_STATUS).map((item: any) => ({ id: TASK_STATUS[item].key, name: TASK_STATUS[item].name }));

    useEffect(() => {
        let members: IProjectMember[] = [];
        if (data.projectMembers && data.projectMembers.length > 0) {
            members = data.projectMembers;
        } else {
            members = data.members ? data.members : [];
        }

        const options: any[] = [];
        members.forEach(item => {
            options.push({
                id: item.orgMemberId,
                name: item.name,
            });
        });
        setMemberOptions(options);
    }, [data.members, data.projectMembers]);

    useEffect(() => {
        dispatch(tagThunks.listTags());
    }, []);

    useEffect(() => {
        const tagIds = data.currentTask.tagIds ? data.currentTask.tagIds : [];
        const selectTags = data.allTags.filter((item: any) => tagIds.indexOf(item.id) > -1);
        setSelectedTags(selectTags);
    }, [data.currentTask.tagIds]);

    const response = {
        occupy: () => {
            // TODO
        },
        detailTaskChanged: () => {
            if (onChange) {
                onChange(data.currentTask.id, data.currentTask.taskListId);
            }
        },
        handleHandlerChange: async (handlerId?: number | string) => {
            await dispatch(taskThunks.editTask({ id: data.currentTask.id, handlerId: handlerId as number }));
            response.detailTaskChanged();
        },
        handleEditTaskName: async (name?: string) => {
            await dispatch(taskThunks.editTask({ id: data.currentTask.id, name }));
            response.detailTaskChanged();
        },
        handleEditTaskPriority: async (priority?: number | string) => {
            await dispatch(taskThunks.editTask({ id: data.currentTask.id, priority: priority as string }));
            response.detailTaskChanged();
        },

        handleEditTaskStatus: async (status: string) => {
            await dispatch(taskThunks.editTask({ id: data.currentTask.id, status }));
            response.detailTaskChanged();
        },

        handleEditDeadline: async (deadline?: any) => {
            const value = deadline ? deadline.format('YYYY-MM-DD 00:00:00') : undefined;
            await dispatch(taskThunks.editTask({ id: data.currentTask.id, deadline: value }));
            dispatch(taskThunks.getTaskDetail(data.currentTask.id));
            response.detailTaskChanged();
        },
        onTagsChanged: async (ids: any) => {
            await dispatch(taskThunks.editTask({ id: data.currentTask.id, tagIds: ids }));
            dispatch(taskThunks.getTaskDetail(data.currentTask.id));
        },
        // tags area 标签删除响应
        delTag: (id: number) => {
            const currentIds = Object.assign([], data.currentTask.tagIds);
            const index = currentIds.indexOf(id);
            currentIds.splice(index, 1);
            response.onTagsChanged(currentIds);
        },
        handleDesChange: async (description?: string) => {
            await dispatch(taskThunks.editTask({ id: data.currentTask.id, description }));
            // await dispatch(taskThunks.editTaskDes(data.currentTask.id, description));
            dispatch(taskThunks.getTaskDetail(data.currentTask.id));
        },
        // 菜单选择响应
        menuSelected: (key: string) => {
            if (key === 'delete') {
                onDel(data.currentTask.id, data.currentTask.taskListId);
            }
        },
        showTaskFunztion: async () => {
            await dispatch(funztionThunks.getFunztionDetail(data.currentTask.funztion!.id));
            setShowFunztionDetail(true);
        },
    };

    return (
        <div className="pt40 pl40 pr40 pb40 task-detail">
            <div className="d-flex justify-between align-center">
                <EffEditableInput
                    errMsg="请输入任务名称"
                    className="flex-grow-1"
                    isRequired
                    onChange={response.handleEditTaskName}
                    value={data.currentTask.name}
                    placeholder="请输入任务名称"
                />
                <EffActions onSelect={response.menuSelected} menus={data.menuItems} className="ml40" width="30px" />
            </div>
            <EffItemInfo className="ml10" serial={data.currentTask.serial} creator={data.currentTask.creatorDto && data.currentTask.creatorDto.name} />
            <EffInfoSep className="mt20 ml10" name="基础信息" />
            <div style={{ marginLeft: '60px' }}>
                <div className="d-flex align-center mt20">
                    <EffLabel name="负责人" />
                    <EffEditableSelector
                        id={data.currentTask.handlerDto && data.currentTask.handlerDto.id}
                        options={memberOptions}
                        onChange={response.handleHandlerChange}
                    />
                </div>

                <div className="d-flex align-center mt20">
                    <EffLabel name="优先级" />
                    <EffEditableSelector clear id={data.currentTask.priority} options={priorityOptions} onChange={response.handleEditTaskPriority} />
                </div>

                <div className="d-flex align-center mt20">
                    <EffLabel name="截至日期" />
                    <EffEditableDatePicker onChange={response.handleEditDeadline} value={data.currentTask.deadline} />
                </div>

                <div className="d-flex align-center mt20">
                    <EffLabel name="任务状态" />
                    <EffEditableSelector
                        clear={false}
                        id={data.currentTask.status}
                        options={taskStatusOptions}
                        onChange={status => response.handleEditTaskStatus(status as string)}
                    />
                </div>

                <div className="d-flex align-center mt20">
                    <EffLabel name="标签" />
                    <div className="d-flex ml10">
                        <EffTagArea onDel={response.delTag} tags={selectedTags} />
                        <EffTagSelector onChange={response.onTagsChanged} chosen={data.currentTask.tagIds ? data.currentTask.tagIds : []} tags={data.allTags} />
                    </div>
                </div>
            </div>

            <EffInfoSep className="mt20 ml10" name="关联功能" />
            <div className="ml20 mt20 pr40" style={{ marginLeft: '60px' }}>
                <span className="funztion-name" onClick={response.showTaskFunztion}>
                    {data.currentTask.funztion && data.currentTask.funztion.name}
                </span>
            </div>

            <EffInfoSep className="mt40 ml10" name="任务描述" />
            <div className="ml20 mt20 pr40">
                <EffEditableDoc onSave={response.handleDesChange} height="400px" className="ml40 mt20" content={data.currentTask.description} />
            </div>

            <Drawer title={null} width="60%" placement="right" closable={false} visible={showFunztionDetail} onClose={() => setShowFunztionDetail(false)}>
                <FunztionDetail onDel={response.occupy} />
            </Drawer>
        </div>
    );
}
