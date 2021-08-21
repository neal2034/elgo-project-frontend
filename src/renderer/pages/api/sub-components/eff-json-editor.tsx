import React, {useEffect, useState} from "react";
import JSONEditor, {JSONEditorOptions} from "jsoneditor";
import 'jsoneditor/dist/jsoneditor.css';
import './eff-json-editor.less'



export default function EffJsonEditor(){

    let container:any = null;
    let jsoneditor:any = null;
    let json =  {
        'array': [1, 2, 3],
            'boolean': true,
            'null': null,
            'number': 123,
            'object': {'a': 'b', 'c': 'd'},
        'string': 'Hello World'
    }

    let [json1, setJson1] = useState({
        'array': [1, 2, 3],
        'boolean': true,
        'null': null,
        'number': 123,
        'object': {'a': 'b', 'c': 'd'},
        'string': 'Hello World'
    })

    useEffect(()=>{
        if(!jsoneditor){
            console.log("will create")
            const options:JSONEditorOptions = {
                mode: 'code',
            };
            jsoneditor = new JSONEditor(container, options)
            jsoneditor.set(json1)
        }else{
            console.log("will update")
            // jsoneditor.update("this.props.json");
        }

        return ()=>{

            if (jsoneditor) {
                jsoneditor.destroy();
            }
        }

    })

    return (
        <div className="jsoneditor-react-container" ref={elem => container = elem} />
    )
}
