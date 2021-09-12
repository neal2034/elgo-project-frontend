import React from "react";
import ReactWEditor from 'wangeditor-for-react';
import {uploadFileToOss} from "../../../utils/fileService";

interface IEffEditorProps{
    onChange?:(value?:string)=>void,
    content?:string,
    height?:string|number
}

export default function EffEditor(props:IEffEditorProps){
    const {onChange, content, height='100%'} = props;
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
        const file = resultFiles[0]
        const size = file.size;
        const exts = file.name.split(".")
        const ext = exts[exts.length - 1];
        if(size/1000 > 1000){
            alert('最大只能上传1M的文件')
            // return false
        }

        const  randomStr = Math.random().toString(36).slice(-8);
        const uploadFileName = (new Date().getTime()) + randomStr +  "." + ext;

        uploadFileToOss(file, uploadFileName).then(result=>{
            insertImgFn(result.url+uploadFileName)
        })
    }



    return (
        <div>
            <ReactWEditor

                config={{
                    menus,
                    height:height as (number|undefined),
                    customUploadImg
                }}
                defaultValue={content}

                onChange={(html) => {
                    if(response.onChange){
                        response.onChange(html)
                    }
                }}

            />
        </div>
    )
}
