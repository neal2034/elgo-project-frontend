import React from 'react';
import { API, apiActions } from '@slice/apiSlice';
import { useDispatch } from 'react-redux';
import EffCodeEditor from '../../../components/eff-code-editor/effCodeEditor';

interface IApiProps{
    api: API
}

export default function ConfigTest(props:IApiProps) {
    const { api } = props;
    const { testsCode } = api;
    const dispatch = useDispatch();
    const handler = {
        onValueChange: (value:string) => {
            dispatch(apiActions.updateCurrentApi({ testsCode: value }));
        },
    };
    return (
        <div className="config-test">
            <EffCodeEditor value={testsCode} onChange={handler.onValueChange} />
        </div>

    );
}
