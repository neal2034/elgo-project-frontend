import React from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/webpack-resolver";


interface CodeEditorProps{
    mode?:string
    value?:string
    onChange:(value:string)=>void
}


export default function EffCodeEditor(props:CodeEditorProps){
    const {mode="javascript", onChange, value=''} = props


    const handler = {
        valueChanged:(value:any)=>{
            onChange(value as string)
        }
    }

    return <AceEditor
        mode={mode}
        theme="github"
        value={value}
        showPrintMargin={false}
        width={"100%"}
        className="eff-code-editor"
        onChange={handler.valueChanged}
        name="UNIQUE_ID_OF_DIV"
        editorProps={{ $blockScrolling: true }}
    />
}
