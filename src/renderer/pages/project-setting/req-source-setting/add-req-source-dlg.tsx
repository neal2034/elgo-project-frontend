import React from 'react';
import { Form, Input, Modal } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import EffButton from '@components/eff-button/eff-button';

interface IProps{
    visible:boolean,
    onClose: ()=>void
    onAdd: (name:string)=>void,
    onEdit: (name:string, id:number)=>void,
    reqSource?:{
        id:number,
        name:string
    }
}

export default function AddReqSourceDlg(props:IProps) {
    const {
        reqSource, onClose, visible, onEdit, onAdd,
    } = props;
    const title = reqSource ? '编辑需求来源' : '添加需求来源';
    const [addForm] = Form.useForm();
    if (reqSource) {
        addForm.setFieldsValue({
            name: reqSource.name,
        });
    }

    const titleArea = (
        <div className="dlg-head font-title d-flex justify-between">
            {title}
            <CloseOutlined className="cursor-pointer" onClick={onClose} />
        </div>
    );

    const response = {
        saveReqSource: async () => {
            const values = await addForm.validateFields();
            if (reqSource) {
                onEdit(values.name, reqSource.id);
            } else {
                onAdd(values.name);
            }
        },

    };

    return (
        <Modal width={500} className="api-envs-dialog" title={titleArea} footer={null} destroyOnClose closable={false} open={visible}>
            <Form form={addForm} hideRequiredMark>
                <Form.Item name="name" label="需求来源" rules={[{ required: true, message: '请输入需求来源' }]}>
                    <Input size="large" />
                </Form.Item>

                <div className="btn-group d-flex justify-end mt40">
                    <EffButton type="line" round className="mr20" onClick={onClose} text="取消" key="cancel" />
                    <EffButton type="filled" round onClick={response.saveReqSource} text="保存" key="confirm" />
                </div>
            </Form>
        </Modal>
    );
}
