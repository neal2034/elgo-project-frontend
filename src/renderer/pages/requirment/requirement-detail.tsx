import React, {useState} from "react";
import {Form} from "antd";
import EffEditableInput from "../../components/common/eff-editable-input/eff-editable-input";


export default function RequirementDetail(){

    const [name, setName] = useState<string|undefined>('abc');
    const response = {
        onNameChange: (name?:string)=>{
            console.log('name changed to ', name)
            setName(name)
        }
    }

    return (
        <div className="border-red1">
            <div>
                 <EffEditableInput isRequired={true} onChange={response.onNameChange} value={name} placeholder={'请输入需求名称'} />
            </div>
            <div>

            </div>
        </div>
    )
}




function EditableInput(props:any){
    const {name} = props
    return (<div>

    </div>)
}
