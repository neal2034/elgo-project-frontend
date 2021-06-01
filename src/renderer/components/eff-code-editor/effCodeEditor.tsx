import React from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-github";


interface CodeEditorProps{
    mode?:string
}


export default function EffCodeEditor(props:CodeEditorProps){
    const {mode="javascript"} = props
    return <AceEditor
        mode={mode}
        theme="github"
        showPrintMargin={false}
        width={"100%"}
        className="eff-code-editor"
        // onChange={onChange}
        name="UNIQUE_ID_OF_DIV"
        editorProps={{ $blockScrolling: true }}
    />
}
