import apiUrl from "@config/apiUrl";
import request from "./request";

export const uploadOneFile = async (file:any, name:string) => {
    const formData = new FormData();
    formData.append( name, file)
    return await request.doPost(apiUrl.fileApi.index, formData, undefined, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
};
