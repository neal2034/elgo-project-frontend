import React, { useEffect, useState } from 'react';
import ElgoTag from '@components/business/elgo-tag/elgo-tag';
import globalColor from '@config/globalColor';
import { useDispatch, useSelector } from 'react-redux';
import { PlusCircleOutlined } from '@ant-design/icons';
import { versionThunks } from '@slice/versionSlice';
import EffConfirmDlg from '@components/eff-confirm-dlg/eff-confirm-dlg';
import EffButton from '@components/eff-button/eff-button';
import { effToast } from '@components/common/eff-toast/eff-toast';
import { RootState } from '../../../store/store';
import AddVersionDlg from './add-version-dlg';

export default function VersionSetting() {
    const dispatch = useDispatch();
    const [showVersionDlg, setShowVersionDlg] = useState(false);
    const [willEditVersion, setWillEditVersion] = useState();
    const [willDelVersion, setWillDelVersion] = useState<{id:number, name:string}>();
    const [confirmDelDlgVisible, setConfirmDelDlgVisible] = useState(false);
    const versions = useSelector((state:RootState) => state.version.versions);

    useEffect(() => {
        dispatch(versionThunks.listVersions());
    }, []);

    const response = {
        goDelVersion: (version:any) => {
            setWillDelVersion(version);
            setConfirmDelDlgVisible(true);
        },
        goEditVersion: (version:any) => {
            setWillEditVersion(version);
            setShowVersionDlg(true);
        },
        addVersion: async (name:string) => {
            await dispatch(versionThunks.addVersion({ name }));
            setShowVersionDlg(false);
            dispatch(versionThunks.listVersions());
        },
        editVersion: async (name:string, id:number) => {
            await dispatch(versionThunks.editVersion({ name, id }));
            setShowVersionDlg(false);
            dispatch(versionThunks.listVersions());
        },
        confirmDelVersion: async () => {
            setConfirmDelDlgVisible(false);
            const result:any = await dispatch(versionThunks.delVersion(willDelVersion!.id));
            if (result) {
                dispatch(versionThunks.listVersions());
                effToast.success_withdraw('???????????????????????????', response.handleWithdrawDel);
            }
        },
        handleWithdrawDel: async () => {
            const result:any = await dispatch(versionThunks.withdrawDel({ id: willDelVersion!.id }));
            if (result) {
                dispatch(versionThunks.listVersions());
                effToast.success('????????????');
            }
        },
    };

    return (
        <div>
            <div className="d-flex justify-start mt40">
                <h1>??????????????????????????????</h1>
            </div>
            <div className="d-flex align-center mt20">
                {versions.map((item:any) => (
                    <ElgoTag
                        onDel={() => response.goDelVersion(item)}
                        onEdit={() => response.goEditVersion(item)}
                        className="mr10"
                        editable
                        delAble
                        key={item.id}
                        name={item.name}
                    />
                ))}
                <PlusCircleOutlined
                    onClick={() => setShowVersionDlg(true)}
                    className="ml20 cursor-pointer"
                    style={{ color: globalColor.fontWeak, fontWeight: 200, fontSize: '20px' }}
                />
            </div>
            <AddVersionDlg
                onEdit={response.editVersion}
                version={willEditVersion}
                onAdd={response.addVersion}
                visible={showVersionDlg}
                onClose={() => setShowVersionDlg(false)}
            />
            <EffConfirmDlg className="mt40" visible={confirmDelDlgVisible}>
                <div className="d-flex-column">
                    <div className="d-flex-column">
                        <span>
                            ??????????????????
                            {willDelVersion && willDelVersion!.name}
                            ??????????????????
                        </span>
                    </div>
                    <div className="mt10 d-flex justify-end">
                        <EffButton onClick={() => setConfirmDelDlgVisible(false)} round key="cancel" text="??????" />
                        <EffButton onClick={response.confirmDelVersion} className="mr10 ml10" type="filled" key="confirm" text="??????" round />
                    </div>
                </div>
            </EffConfirmDlg>

        </div>
    );
}
