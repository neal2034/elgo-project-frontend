import React from "react";
import EffCodeEditor from "../../../components/eff-code-editor/effCodeEditor";
import {API} from "@slice/apiSlice";
import {useDispatch} from "react-redux";
import {apiActions} from '@slice/apiSlice'


interface IApiProps{
    api: API
}


export default function ConfigTest(props:IApiProps){
    const {testsCode} = props.api
    const dispatch = useDispatch()
    const handler = {
        onValueChange:(value:string)=>{
            dispatch(apiActions.updateCurrentApi({testsCode:value}))
        }
    }
    return (
        <div className="config-test">
            <EffCodeEditor value={testsCode} onChange={handler.onValueChange}/>
        </div>

    )
}
