import apiUrl from "@config/apiUrl";
import request from "./request";


function getOssSignature() {
    return  request.get({url:apiUrl.fileApi.getOssSignature})
}


/**
 * 上传文件到OSS 指定位置
 * @param theFile
 * @returns {*}
 */
export function uploadFileToOss(theFile:any, fileName:any) {
    return getOssSignature().then(result=>{
        let data = result.data;
        let host =   result.data.host
        let fileData = new FormData()
        fileData.append('OSSAccessKeyId', data.accessId)
        fileData.append('signature', data.signature)
        fileData.append('policy', data.policy)
        fileData.append("success_action_status", '200')
        fileData.append("key", fileName)
        fileData.append("file",theFile)

        return fetch(host, {
            method: 'post',
            body: fileData,
        })
    })
}
