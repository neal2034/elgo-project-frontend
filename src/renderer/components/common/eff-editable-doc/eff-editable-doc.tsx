import React, {useState} from "react";
import EffEditor from "../eff-editor/eff-editor";
import './eff-editable-doc.less'


interface IProps{
    content?:string,
}

export default function EffEditableDoc(props:IProps){
    const {content=''} = props
    const [isEditing, setIsEditing] = useState(false)

    const style = {
        content:{
            border: '1px solid red'
        }
    }

    return <div>
        {/*<EffEditor onChange={()=>{}}/>*/}
        {isEditing? <EffEditor content={content} onChange={()=>{}}/>: <div onClick={()=>setIsEditing(true)} className="doc-content cursor-pointer" dangerouslySetInnerHTML={{__html: content}}/>}

        {/*<div>{content}</div>*/}
    </div>

}
