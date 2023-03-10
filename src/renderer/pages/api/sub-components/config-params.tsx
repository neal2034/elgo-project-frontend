import React from 'react';
import {
    API, ApiParams, ApiPathVar, apiActions,
} from '@slice/apiSlice';
import { useDispatch } from 'react-redux';
import EditableTable from './editable-table';

interface ApiProps{
    api: API
}

export default function ConfigParams(props:ApiProps) {
    const dispatch = useDispatch();
    const { api } = props;
    const columns = [
        {
            title: '',
            dataIndex: 'selected',
            selectable: true,
        },
        {
            title: 'KEY',
            dataIndex: 'paramKey',
            editable: true,
        },
        {
            title: 'VALUE',
            dataIndex: 'paramValue',
            editable: true,
        },
        {
            title: '描述',
            dataIndex: 'description',
            editable: true,
            delAction: true, // 该列显示删除操作
        },
    ];
    const pathVarColumns = [
        {
            title: '',
            dataIndex: 'selected',
        },
        {
            title: 'KEY',
            dataIndex: 'varKey',
            editable: false,
        },
        {
            title: 'VALUE',
            dataIndex: 'varValue',
            editable: true,
        },
        {
            title: '描述',
            dataIndex: 'description',
            editable: true,
        },
    ];

    // 解析参数，获取实际调用URL
    const getQueryUrl = (params:any) => {
        let query = '';
        params.forEach((param:any) => {
            if (param.selected) {
                query = query === '' ? query : `${query}&`;
                const key = param.paramKey ? param.paramKey : '';
                const value = param.paramValue ? param.paramValue : '';
                query += `${key}=${value}`;
            }
        });
        const url = api.url ? api.url : '';
        const index = url.indexOf('?');
        let queryUrl = index > -1 ? url.substring(0, index) : url;
        if (query) {
            queryUrl += `?${query}`;
        }
        return queryUrl;
    };
    const valueChanged = (record:any, dataIndex:string, value:string|boolean) => {
        const index = api.params.findIndex((item:ApiParams) => item.key === record.key);
        const tmpParams = Object.assign([], api.params);
        const item = api.params[index];
        if (dataIndex !== 'selected' && item.selected === undefined) {
            // 若当前行未曾选中过， 且当前修改列不是选中列，则除了将值并入外，再将当且列置为选中
            tmpParams.splice(index, 1, { ...item, ...{ [dataIndex]: value, selected: true } });
        } else {
            tmpParams.splice(index, 1, { ...item, ...{ [dataIndex]: value } });
        }
        // 如果编辑的是最后一行，则添加新的空白行
        if (index === api.params.length - 1) {
            const lastKey = api.params[api.params.length - 1].key;
            tmpParams.push({ key: lastKey + 1 });
        }

        const url = getQueryUrl(tmpParams);

        dispatch(apiActions.updateCurrentApi({ params: tmpParams, url }));
    };

    const pathVarValueChanged = (record:any, dataIndex:string, value:string) => {
        const tmpPathVars = Object.assign([], api.pathVars);
        const index = tmpPathVars.findIndex((item:ApiPathVar) => item.key === record.key);
        const item = api.pathVars![index];
        tmpPathVars.splice(index, 1, { ...item, ...{ [dataIndex]: value } });
        dispatch(apiActions.updateCurrentApi({ pathVars: tmpPathVars }));
    };

    const paramsDel = (record:any) => {
        const index = api.params.findIndex((item:ApiParams) => item.key === record.key);
        const tmpParams = Object.assign([], api.params);
        tmpParams.splice(index, 1);
        const url = getQueryUrl(tmpParams);
        dispatch(apiActions.updateCurrentApi({ params: tmpParams, url }));
    };

    return (
        <div>
            <div className="params-title">Query Params</div>
            <EditableTable valueChange={valueChanged} valueDel={paramsDel} columns={columns} dataSource={api.params} />
            {api.pathVars && api.pathVars.length > 0 ? (
                <div>
                    <div>PathVariable</div>
                    {' '}
                    <EditableTable valueChange={pathVarValueChanged} columns={pathVarColumns} dataSource={api.pathVars} />
                </div>
            ) : null}
        </div>
    );
}
