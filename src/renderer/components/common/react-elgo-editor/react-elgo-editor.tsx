/* eslint import/no-extraneous-dependencies:0 */
import React from 'react';
import Editor from 'elgo-rich'
import { uploadOneFile } from '../../../utils/fileService';




export type IProps = {
    placeholder?: string;
    defaultValue?: string;
    onChange?: (html: string) => void;
};

export default function ReactElgoEditor(props:IProps) {
    const {
        placeholder="Please input ",
        onChange,
        defaultValue
    } = props;
    const onContentChange = (state:string, html:string) =>{
        if(onChange){
            onChange(html)
        }
    }
    const uploadImg =  async  (file: Blob)=>{
        const result = await uploadOneFile(file);
        return {
            url:  result.data.url,
            width: 400
        }

    }

    return (
        <Editor uploadImage={uploadImg} defaultValue={defaultValue} placeholder={placeholder} onChange={onContentChange}/>

    );
}
