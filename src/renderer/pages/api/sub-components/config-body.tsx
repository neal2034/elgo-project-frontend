import React from "react";
import {API,apiActions} from "@slice/apiSlice";
import {Radio} from "antd";
import './api-wrapper.less'
import EffCodeEditor from "../../../components/eff-code-editor/effCodeEditor";
import {useDispatch} from "react-redux";

interface ApiProps{
    api: API
}

export default function ConfigBody(props:ApiProps){
    const {bodyType="NONE", bodyJson=''} = props.api
    const dispatch = useDispatch()
    const handler = {
        onValueChange:(value:string)=>{
            dispatch(apiActions.updateCurrentApi({bodyJson:value}))
        },

        onBodyTypeChanged: (e:any)=>{
            dispatch(apiActions.updateCurrentApi({bodyType:e.target.value}))
        }
    }

    return (
        <div className="config-body">
            <Radio.Group    onChange={handler.onBodyTypeChanged} value={bodyType}>
                <Radio value={"NONE"}>无</Radio>
                <Radio value={"JSON"}>JSON</Radio>
            </Radio.Group>
            {bodyType==='JSON'? <EffCodeEditor mode={"json"} value={bodyJson} onChange={handler.onValueChange}/>:null}
        </div>
    )
}


