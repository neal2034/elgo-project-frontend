/* eslint import/no-extraneous-dependencies: 0 */
import React from 'react';
import 'ace-builds';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/webpack-resolver';
import AceEditor from 'react-ace';

interface CodeEditorProps{
    mode?:string
    value?:string
    readonly?:boolean
    onChange:(value:string)=>void
}

export default function EffCodeEditor(props:CodeEditorProps) {
    const {
        mode = 'javascript', onChange, value = '', readonly = false,
    } = props;

    const handler = {
        valueChanged: (content:any) => {
            onChange(content as string);
        },
    };

    return (
        <AceEditor
            mode={mode}
            theme="github"
            value={value}
            readOnly={readonly}
            showPrintMargin={false}
            width="100%"
            className="eff-code-editor"
            onChange={handler.valueChanged}
            name="UNIQUE_ID_OF_DIV"
            editorProps={{ $blockScrolling: true }}
        />
    );
}
