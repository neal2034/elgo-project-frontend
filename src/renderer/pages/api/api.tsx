import React, { useEffect } from 'react';
import './api.less';
import { useDispatch, useSelector } from 'react-redux';
import { ApiEnv, apiThunks } from '@slice/apiSlice';
import ApiSideBar from './sub-components/api-sidebar';
import ApiContent from './sub-components/api-content';
import { RootState } from '../../store/store';

export default function Api() {
    const dispatch = useDispatch();
    const currentEnvId = useSelector((state:RootState) => state.api.currentEnvId);
    const currentEnv:ApiEnv = useSelector((state:RootState) => state.api.envs.filter((item:ApiEnv) => item.id === state.api.currentEnvId)[0]);
    useEffect(() => {
        window.elgo = {
            // 设置环境变量
            setEnvironmentVariable(key:string, value:string) {
                // 获取当前环境，如果没有环境则返回
                if (currentEnvId === -1) {
                    return;
                }

                // 在当前环境里找寻所有key,满足条件则设置为value
                const env:any = {
                    id: currentEnv.id,
                    name: currentEnv.name,
                    items: Object.assign([], currentEnv.envItems),
                };

                const item = { name: key, value, used: true };
                if (env.items) {
                    let setted = false;
                    env.items.forEach((envItem:any, index:number) => {
                        if (envItem.name === key) {
                            env.items[index] = item;
                            setted = true;
                        }
                    });
                    if (!setted) {
                        const lastitem = env.items[env.items.length - 1];
                        if (!lastitem.name && !lastitem.value && !lastitem.used) {
                            env.items[env.items.length - 1] = item;
                        } else {
                            env.items.push(item);
                        }
                    }
                } else {
                    env.items = [item];
                }

                dispatch(apiThunks.editApiEnv(env.name, env.items, env.id));
            },
        };
    }, [currentEnvId]);
    return (
        <div className="d-flex-column" style={{ height: '100%' }}>
            <div className="api d-flex flex-grow-1">
                <ApiSideBar />
                <ApiContent />
            </div>
        </div>

    );
}
