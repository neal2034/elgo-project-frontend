import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import EffButton from '@components/eff-button/eff-button';
import EffMemberItem from '@components/business/eff-member-item/eff-member-item';
import { effToast } from '@components/common/eff-toast/eff-toast';
import EffConfirmDlg from '@components/eff-confirm-dlg/eff-confirm-dlg';
import globalColor from '@config/globalColor';
import { projectThunks } from '@slice/projectSlice';
import { Empty, Modal } from 'antd';
import { RootState } from '@store/store';
import './member-setting.less';

export default function MemberSetting() {
    const dispatch = useDispatch();
    const project = useSelector((state: RootState) => state.project.projectDetail);
    const [showConfirmDlg, setShowConfirmDlg] = useState(false);
    const [willDelMember, setWillDelMember] = useState<any>();
    const [showAddDlg, setShowAddDlg] = useState(false);
    const [noAvailableMembers, setNoAvailableMembers] = useState(false);
    const availableOrgMembers = useSelector((state: RootState) => state.project.availableOrgMembers);
    const availableInvitations = useSelector((state: RootState) => state.project.availableInvitations);
    const selectedMembers: number[] = [];
    const selectInvitationIds: number[] = [];

    useEffect(() => {
        const noAvailable = availableOrgMembers.length === 0 && availableInvitations.length === 0;
        setNoAvailableMembers(noAvailable);
    }, [availableOrgMembers, availableInvitations]);

    const response = {
        handleRemoveMember: (member: any) => {
            if (member.boolProjectOwner) {
                effToast.error('不能移除项目拥有者');
                return;
            }
            setWillDelMember(member);
            setShowConfirmDlg(true);
        },
        handleConfirmDelMember: async () => {
            const result: any = await dispatch(projectThunks.removeMember({ projectMemberId: willDelMember.id }));
            setShowConfirmDlg(false);
            if (result) {
                effToast.success('移除项目成员成功');
                dispatch(projectThunks.getProjectDetail());
            }
        },
        goAddProjectMember: () => {
            dispatch(projectThunks.listAvailableCandidates());
            setShowAddDlg(true);
        },
        confirmAddProjectMember: async () => {
            if (selectedMembers.length === 0 && selectInvitationIds.length === 0) {
                effToast.warning('请至少选择一个项目成员');
                return;
            }
            const result: any = await dispatch(projectThunks.addMember({ orgMemberIds: selectedMembers, invitationIds: selectInvitationIds }));
            setShowAddDlg(false);
            if (result as boolean) {
                dispatch(projectThunks.getProjectDetail());
            }
        },
        onMemberSelected: (checked: boolean, id: number) => {
            if (checked) {
                selectedMembers.push(id);
            } else {
                const index = selectedMembers.indexOf(id);
                selectedMembers.splice(index, 1);
            }
        },
        onInvitationSelected: (checked: boolean, id: number) => {
            if (checked) {
                selectInvitationIds.push(id);
            } else {
                selectInvitationIds.splice(selectInvitationIds.indexOf(id), 1);
            }
        },
    };

    return (
        <div className="d-flex-column">
            <div className="d-flex justify-start mt40">
                <h1>管理可对当前项目访问的组织成员</h1>
            </div>
            <EffButton onClick={response.goAddProjectMember} round className="align-self-end" text="+ 添加成员" key="add" type="line" />
            <div className="mt20 d-flex flex-wrap align-center">
                {project.members && project.members.map(item => <EffMemberItem onDel={() => response.handleRemoveMember(item)} member={item} key={item.id} />)}
            </div>
            <EffConfirmDlg title="确认移除" visible={showConfirmDlg}>
                <div>
                    <div className="d-flex-column" style={{ color: globalColor.fontWeak, fontSize: '14px' }}>
                        <span>
                            确定将成员“
                            {willDelMember && willDelMember!.name}
                            ”移除项目？
                        </span>
                    </div>
                    <div className="mt20 d-flex justify-end">
                        <EffButton type="line" onClick={() => setShowConfirmDlg(false)} round key="cancel" text="取消" />
                        <EffButton onClick={response.handleConfirmDelMember} className="mr20 ml10" type="filled" key="confirm" text="确定" round />
                    </div>
                </div>
            </EffConfirmDlg>
            <Modal width={900} open={showAddDlg} title={null} footer={null} closable={false}>
                <div className="add-members-dlg">
                    <div className="title">添加项目成员</div>
                    <div className={`content flex-wrap   d-flex pb20 ${noAvailableMembers ? 'justify-center' : 'align-start'}`}>
                        {noAvailableMembers && <Empty description="无可添加成员" image={Empty.PRESENTED_IMAGE_SIMPLE} />}
                        {availableOrgMembers.map((item: any) => (
                            <EffMemberItem
                                onSelect={(checked: boolean) => response.onMemberSelected(checked, item.id)}
                                className="ml20"
                                select
                                key={item.id}
                                member={item}
                            />
                        ))}
                        {availableInvitations.map((item: any) => (
                            <EffMemberItem
                                onSelect={(checked: boolean) => response.onInvitationSelected(checked, item.id)}
                                className="ml20"
                                select
                                key={item.id}
                                member={item}
                            />
                        ))}
                    </div>
                    <div className="d-flex justify-end footer">
                        <EffButton onClick={() => setShowAddDlg(false)} text="取消" key="cancel" type="line" round />
                        <EffButton onClick={response.confirmAddProjectMember} className="ml20" text="确定" key="save" type="filled" round />
                    </div>
                </div>
            </Modal>
        </div>
    );
}
