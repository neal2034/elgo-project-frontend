import React, {useState} from "react";
import {API} from "../apiSlice";
import {Radio} from "antd";
import './api-wrapper.less'
import EffJsonEditor from "./eff-json-editor";
interface ApiProps{
    api: API
}

export default function ConfigBody(props:ApiProps){

    const [bodyType, setBodyType] = useState("JSON");

    const bodyTypeChanged = (e:any)=>{
        setBodyType(e.target.value)
    }

    return (
        <div className="config-body">
            <Radio.Group  onChange={bodyTypeChanged} value={bodyType}>
                <Radio value={"NONE"}>无</Radio>
                <Radio value={"JSON"}>JSON</Radio>
            </Radio.Group>
            {bodyType==='JSON'?<EffJsonEditor/>:null}
        </div>
    )
}


