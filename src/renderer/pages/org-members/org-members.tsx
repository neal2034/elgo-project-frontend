import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import EffButton from '@components/eff-button/eff-button';
import { getOrganizationDetail, orgThunks } from '@slice/orgSlice';
import { Input, Modal } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import './org-members.less';
import globalColor from '@config/globalColor';
import { effToast } from '@components/common/eff-toast/eff-toast';
import EffMemberItem from '@components/business/eff-member-item/eff-member-item';
import EffConfirmDlg from '@components/eff-confirm-dlg/eff-confirm-dlg';
import { accountThunks } from '@slice/accountSlice';
import { RootState } from '@store/store';

function InviteInput(props: { errMsg?: string; showDel: boolean; onDel: () => void; onChange: (value: string) => void }) {
    const { showDel, errMsg, onChange, onDel } = props;
    const response = {
        handleDel() {
            onDel();
        },
        handleValueChange(e: any) {
            onChange(e.target.value);
        },
    };

    return (
        <div className="mb20 invite-input">
            <div>
                <Input onChange={response.handleValueChange} placeholder="请输入邮箱" style={{ width: '400px' }} size="large" />
                {showDel && <DeleteOutlined onClick={response.handleDel} className="ml20 del-btn" style={{ fontSize: '16px', color: globalColor.fontWeak }} />}
            </div>
            {errMsg && <span style={{ fontSize: '12px', color: globalColor.mainRed3 }}>{errMsg}</span>}
        </div>
    );
}

export default function OrgMembers() {
    const dispatch = useDispatch();
    const organization: any = useSelector((state: RootState) => state.organization.organization);
    const currentMember: any = useSelector((state: RootState) => state.account.currentMember);
    const [newMembers, setNewMembers] = useState([{ show: true, key: 0 }]);
    const [inputNum, setInputNum] = useState(1);
    const [showInviteDlg, setShowInviteDlg] = useState(false);
    const [showConfirmDlg, setShowConfirmDlg] = useState(false);
    const [willDelMember, setWillDelMember] = useState<any>();
    const [willCancelInvitation, setWillCancelInvitation] = useState<any>();

    useEffect(() => {
        dispatch(accountThunks.getCurrentMember());
        dispatch(getOrganizationDetail());
    }, []);

    const response = {
        handleRemoveInviteInput: (index: number) => {
            const tempMembers: any = Object.assign([], newMembers);
            tempMembers[index].show = false;
            setNewMembers(tempMembers);

            // 获取当前依然显示的邀请输入框
            const num = tempMembers.reduce((cur: any, next: any) => (next.show ? cur + 1 : cur), 0);
            setInputNum(num);
        },
        handleInviteValueChange: (index: number, value?: string) => {
            const tempMembers: any = Object.assign([], newMembers);
            tempMembers[index].value = value;
            tempMembers[index].errMsg = null;
            setNewMembers(tempMembers);
        },
        handleAddInviteInput: () => {
            const tempMembers: any = Object.assign([], newMembers);
            tempMembers.push({ show: true, key: new Date().getTime() });
            setNewMembers(tempMembers);
            // 设置input数量
            const num = inputNum + 1;
            setInputNum(num);
        },
        goInviteMember: async () => {
            // 检查邮箱格式是否有效
            let formatValid = true;
            const tempMembers: any = Object.assign([], newMembers);
            const reg = /[A-z0-9_-]*@[A-z0-9]+\.[A-z]+/;
            tempMembers.forEach((item: any) => {
                if (item.show && item.value) {
                    const result = reg.test(item.value.trim());
                    if (!result) {
                        item.errMsg = '邮箱格式不正确';
                        formatValid = false;
                    }
                }
            });
            if (!formatValid) {
                setNewMembers(tempMembers);
                return;
            }

            // 检查是否只有唯一输入框，且没有输入
            let emptyValid = true;
            if (inputNum === 1) {
                tempMembers.forEach((item: any) => {
                    if (item.show) {
                        const value = item.value && item.value.trim();
                        if (!value) {
                            emptyValid = false;
                            item.errMsg = '请填写邮箱';
                        }
                    }
                });
            }
            if (!emptyValid) {
                setNewMembers(tempMembers);
                return;
            }

            // 添加组织成员
            const members = tempMembers
                .filter(item => item.show && item.value)
                .map(item => ({
                    email: item.value.trim(),
                }));
            const result: any = await dispatch(orgThunks.inviteMember({ members }));
            setShowInviteDlg(false);
            if (result as boolean) {
                effToast.success('已为邀请成员发送邀请邮件');
                dispatch(orgThunks.getOrganizationDetail());
            }
        },

        removeOrgMember: (member: any) => {
            if (!currentMember.boolOwner) {
                effToast.error('没有权限，仅超级管理员可操作');
                return;
            }
            if (member.boolOwner) {
                effToast.error('不可以移除超级管理员');
                return;
            }
            setWillDelMember(member);
            setWillCancelInvitation(null);
            setShowConfirmDlg(true);
        },

        cancelInvitation: (invitation: any) => {
            setWillDelMember(null);
            setWillCancelInvitation(invitation);
            setShowConfirmDlg(true);
        },

        handleConfirmDelMember: async () => {
            const result: any = willDelMember
                ? await dispatch(orgThunks.removeOrgMember({ id: willDelMember.id }))
                : await dispatch(orgThunks.cancelInvitation({ id: willCancelInvitation.id }));
            setShowConfirmDlg(false);
            if (result) {
                effToast.success('移除组织成员成功');
                dispatch(orgThunks.getOrganizationDetail());
            }
        },
        openInviteDlg: () => {
            if (!currentMember.boolOwner) {
                effToast.error('没有权限，仅超级管理员可操作');
                return;
            }
            setShowInviteDlg(true);
        },
    };

    return (
        <div className="pt40 pl40 pr40 d-flex-column">
            <EffButton onClick={response.openInviteDlg} className="align-self-end" text="+ 邀请成员" key="invite" type="line" round />
            <div className="d-flex justify-start flex-wrap mt20">
                {organization &&
                    organization.members &&
                    organization.members.map((item: any) => (
                        <EffMemberItem onDel={() => response.removeOrgMember(item)} member={item} key={item.id} />
                    ))}
                {organization &&
                    organization.invitations &&
                    organization.invitations.map((item: any) => <EffMemberItem onDel={() => response.cancelInvitation(item)} member={item} key={item.id} />)}
            </div>

            <Modal open={showInviteDlg} title={null} footer={null} closable={false}>
                <div className="invite-members-dlg">
                    <div className="title">邀请成员</div>
                    <div className="content d-flex-column pb20">
                        <span className="mb20">通过邮箱邀请组织成员加入，将向被邀请成员邮箱发送激活链接</span>
                        {newMembers.map(
                            (item: any, index) =>
                                item.show && (
                                    <InviteInput
                                        onChange={(value?: string) => response.handleInviteValueChange(index, value)}
                                        errMsg={item.errMsg}
                                        showDel={inputNum > 1}
                                        onDel={() => response.handleRemoveInviteInput(index)}
                                        key={item.key}
                                    />
                                )
                        )}
                        <span onClick={response.handleAddInviteInput} style={{ color: globalColor.mainYellowDark }} className="cursor-pointer">
                            {' '}
                            + 新增成员
                        </span>
                    </div>
                    <div className="d-flex justify-end footer">
                        <EffButton onClick={() => setShowInviteDlg(false)} text="取消" key="cancel" type="line" round />
                        <EffButton onClick={response.goInviteMember} className="ml20" text="确定" key="save" type="filled" round />
                    </div>
                </div>
            </Modal>

            <EffConfirmDlg title="确认移除" visible={showConfirmDlg}>
                <div>
                    <div className="d-flex-column" style={{ color: globalColor.fontWeak, fontSize: '14px' }}>
                        <span>
                            确定将成员“
                            {willDelMember && willDelMember!.name}
                            ”从组织中移除？
                        </span>
                    </div>
                    <div className="mt20 d-flex justify-end">
                        <EffButton type="line" onClick={() => setShowConfirmDlg(false)} round key="cancel" text="取消" />
                        <EffButton onClick={response.handleConfirmDelMember} className="mr20 ml10" type="filled" key="confirm" text="确定" round />
                    </div>
                </div>
            </EffConfirmDlg>
        </div>
    );
}
