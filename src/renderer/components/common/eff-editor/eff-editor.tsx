import React from "react";
import ReactWEditor from 'wangeditor-for-react';
import {uploadFileToOss} from "../../../utils/fileService";

interface IEffEditorProps{
    onChange:Function,
    content?:string,
}

export default function EffEditor(props:IEffEditorProps){
    const {onChange, content} = props;
    const menus =[
        'head',
        'bold',
        'fontSize',
        'italic',
        'underline',
        'strikeThrough',
        'foreColor',
        'link',
        'list',
        'justify',
        'table',
        'splitLine',
        'image',
        'undo',
        'redo',
    ]

    const response={
        onChange,
    }

    const customUploadImg = (resultFiles:any, insertImgFn:any)=>{
        let file = resultFiles[0]
        let size = file.size;
        let exts = file.name.split(".")
        let ext = exts[exts.length - 1];
        if(size/1000 > 1000){
            alert('最大只能上传1M的文件')
            // return false
        }

        let  randomStr = Math.random().toString(36).slice(-8);
        let uploadFileName = (new Date().getTime()) + randomStr +  "." + ext;

        uploadFileToOss(file, uploadFileName).then(result=>{
            insertImgFn(result.url+uploadFileName)
        })
    }


    return (
        <div>
            <ReactWEditor
                // @ts-ignore
                config={{
                    menus,
                    customUploadImg
                }}
                defaultValue={content}

                onChange={(html) => {
                    response.onChange(html)
                }}

            />
        </div>
    )
}
