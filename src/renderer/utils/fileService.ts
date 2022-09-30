import apiUrl from '@config/apiUrl';
import request from './request';

export const uploadOneFile = async (file:any) => {
    const formData = new FormData();

    formData.append('file', file);
    return request.doPost(apiUrl.fileApi.index, formData, undefined, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};
