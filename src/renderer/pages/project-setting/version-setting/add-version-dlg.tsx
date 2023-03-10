import React from 'react';
import { Form, Input, Modal } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import EffButton from '@components/eff-button/eff-button';

interface IProps{
    visible:boolean,
    onClose: ()=>void
    onAdd: (name:string)=>void,
    onEdit: (name:string, id:number)=>void,
    version?:{
        id:number,
        name:string
    }
}

export default function AddVersionDlg(props:IProps) {
    const {
        version, onClose, visible, onEdit, onAdd,
    } = props;
    const title = version ? '编辑版本' : '添加版本';
    const [addForm] = Form.useForm();

    if (version) {
        addForm.setFieldsValue({
            name: version.name,
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
            if (version) {
                onEdit(values.name, version.id);
            } else {
                onAdd(values.name);
            }
        },

    };

    return (
        <Modal width={500} className="api-envs-dialog" title={titleArea} footer={null} destroyOnClose closable={false} open={visible}>
            <Form form={addForm} hideRequiredMark>
                <Form.Item name="name" label="版本" rules={[{ required: true, message: '请输入版本号/名称' }]}>
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
