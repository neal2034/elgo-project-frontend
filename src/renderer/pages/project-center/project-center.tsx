import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './project-center.less';
import { PlusOutlined } from '@ant-design/icons';
import { Col, Input, Modal, Row } from 'antd';
import { IProject, projectThunks } from '@slice/projectSlice';
import { orgThunks } from '@slice/orgSlice';
import { PROJECT_COLOR, PROJECT_ICON } from '@config/sysConstant';
import EffConfirmDlg from '@components/eff-confirm-dlg/eff-confirm-dlg';
import { effToast } from '@components/common/eff-toast/eff-toast';
import ProjectEditDlg from '@pages/project-center/project-edit-dlg';
import { accountThunks } from '@slice/accountSlice';
import { RootState } from '@store/store';
import EffButton from '../../components/eff-button/eff-button';
import ProjectItem from './project-item';

export default function ProjectCenter() {
    const dispatch = useDispatch();
    const projects = useSelector((state: RootState) => state.project.projects);
    const currentMember: any = useSelector((state: RootState) => state.account.currentMember);
    const [showAddDlg, setShowAddDlg] = useState(false);
    const [showEditDlg, setShowEditDlg] = useState(false);
    const [showNameError, setShowNameError] = useState(false);
    const [willDelProject, setWillDelProject] = useState<IProject>();
    const [willEditProject, setWillEditProject] = useState<IProject>();
    const [confirmDelDlgVisible, setConfirmDelDlgVisible] = useState(false);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const nameInputRef = useRef<Input>(null);

    useEffect(() => {
        dispatch(accountThunks.getCurrentMember());
        dispatch(orgThunks.setLastLoginOrg());
        dispatch(projectThunks.listProject());
    }, []);

    const openAddProjectDlg = () => {
        setShowAddDlg(true);
    };
    const handleFocusInName = () => setShowNameError(false);

    const handleAddProject = async () => {
        const name = nameInputRef.current!.input.value;
        if (!name) {
            setShowNameError(true);
            return;
        }
        const color = PROJECT_COLOR[Math.floor(Math.random() * PROJECT_COLOR.length)];
        const icon = PROJECT_ICON[Math.floor(Math.random() * PROJECT_ICON.length)];
        await dispatch(
            projectThunks.addProject({
                name,
                color,
                icon,
            })
        );
        setShowAddDlg(false);
        await dispatch(projectThunks.listProject());
    };

    const handleCancelAddProject = () => {
        setShowAddDlg(false);
    };

    const response = {
        handleDelProject: (project: IProject) => {
            setWillDelProject(project);
            setConfirmDelDlgVisible(true);
        },
        confirmDelProject: async (project: IProject) => {
            const isOwner = currentMember.boolOwner;
            let isCreator = false;
            project.members.forEach(member => {
                if (member.boolProjectOwner && member.orgMemberId === currentMember.id) {
                    isCreator = true;
                }
            });
            if (isOwner || isCreator) {
                const result: any = await dispatch(projectThunks.delProject({ id: project.id }));
                setConfirmDelDlgVisible(false);
                if (result) {
                    effToast.success_withdraw('????????????????????????', () => response.withdrawDelProject(project));
                    dispatch(projectThunks.listProject());
                }
            } else {
                effToast.error('????????????????????????????????????????????????');
            }
        },
        withdrawDelProject: async (project: IProject) => {
            const result: any = await dispatch(projectThunks.withdrawDelProject({ id: project.id }));
            if (result) {
                effToast.success('????????????');
                dispatch(projectThunks.listProject());
            }
        },
        handleEditProject: (project: IProject) => {
            setWillEditProject(project);
            setShowEditDlg(true);
        },
        confirmEditProject: async (data: { name: string; color: string; icon: string; serial: number }) => {
            const result: any = await dispatch(projectThunks.editProject(data));
            setShowEditDlg(false);
            if (result) {
                dispatch(projectThunks.listProject());
            }
        },
    };

    const uiProjects = projects.map((pro: any) => (
        <ProjectItem onEdit={response.handleEditProject} onDel={response.handleDelProject} project={pro} key={pro.serial} />
    ));

    return (
        <div className="project-center mt40 d-flex flex-wrap">
            <Modal closable={false} footer={false} width={500} title="????????????" open={showAddDlg}>
                <Row>
                    <Col span={4}>????????????</Col>
                    <Col span={20}>
                        <Input ref={nameInputRef} onFocus={handleFocusInName} />
                        {showNameError && <span className="error">?????????????????????</span>}
                    </Col>
                </Row>
                <Row className="mt20 mb10" justify="end">
                    <Col className="d-flex" offset={14}>
                        <EffButton onClick={handleCancelAddProject} className="mr10" round text="??????" key="cancel" />
                        <EffButton onClick={handleAddProject} round type="filled" text="??????" key="ok" />
                    </Col>
                </Row>
            </Modal>
            <ProjectEditDlg onCancel={() => setShowEditDlg(false)} onEdit={response.confirmEditProject} project={willEditProject!} visible={showEditDlg} />
            {uiProjects}
            <div onClick={openAddProjectDlg} className="new-project-btn  d-flex align-center justify-center cursor-pointer">
                <PlusOutlined style={{ fontSize: '60px', color: '#999999' }} />
            </div>
            <EffConfirmDlg visible={confirmDelDlgVisible}>
                <div>
                    <div className="d-flex-column">
                        <span>
                            ??????????????????
                            {willDelProject && willDelProject.name}
                            ??????????????????
                        </span>
                    </div>
                    <div className="mt10 d-flex justify-end">
                        <EffButton onClick={() => setConfirmDelDlgVisible(false)} round key="cancel" text="??????" />
                        <EffButton
                            onClick={() => response.confirmDelProject(willDelProject!)}
                            className="mr20 ml10"
                            type="filled"
                            key="confirm"
                            text="??????"
                            round
                        />
                    </div>
                </div>
            </EffConfirmDlg>
        </div>
    );
}
