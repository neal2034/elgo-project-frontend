import React, { useEffect, useState } from 'react';
import { Form, Input, Modal } from 'antd';
import EffButton from '@components/eff-button/eff-button';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import { colors } from '@config/sysConstant';

interface IProps{
    visible:boolean,
    onClose: ()=>void
    onAdd: (name:string, color:string)=>void,
    onEdit: (name:string, color:string, id:number)=>void,
    tag?:{
        id:number,
        name:string,
        color:string,
    }
}
// 用于表达tag 对话框可供选择的小色块
function TagColor(props:{color:string, selected:boolean, onChosen:()=>void}) {
    const { onChosen, selected, color } = props;
    return (
        <div
            onClick={onChosen}
            className="ml10 d-flex justify-center align-center cursor-pointer"
            style={{ width: '20px', height: '20px', backgroundColor: color }}
        >
            {selected && <CheckOutlined style={{ color: 'white', fontSize: '14px', fontWeight: 'bold' }} />}
        </div>
    );
}

export default function TagDialog(props:IProps) {
    const { tag, onClose, visible } = props;
    const title = tag ? '编辑标签' : '添加标签';
    const [tagForm] = Form.useForm();
    const [selectColor, setSelectColor] = useState(colors[0]);

    useEffect(() => {
        if (props.tag) {
            setSelectColor(props.tag.color);
            tagForm.setFieldsValue({ name: props.tag.name });
        }
    }, [tag]);

    const titleArea = (
        <div className="dlg-head font-title d-flex justify-between">
            {title}
            <CloseOutlined className="cursor-pointer" onClick={onClose} />
        </div>
    );

    const response = {
        saveTag: async () => {
            const values = await tagForm.validateFields();
            const { name } = values;
            if (props.tag) {
                props.onEdit(name, selectColor, props.tag.id);
            } else {
                props.onAdd(name, selectColor);
            }
        },
    };

    return (
        <Modal width={500} className="tag-dialog" title={titleArea} footer={null} destroyOnClose closable={false} visible={visible}>
            <Form form={tagForm} hideRequiredMark>
                <Form.Item name="name" label="标签名称" rules={[{ required: true, message: '请输入标签名称' }]}>
                    <Input size="large" />
                </Form.Item>

                <Form.Item name="name" label="标签颜色">
                    <div className="d-flex flex-wrap">
                        {colors.map((color) => (
                            <TagColor
                                onChosen={() => setSelectColor(color)}
                                color={color}
                                key={color}
                                selected={color === selectColor}
                            />
                        ))}
                    </div>
                </Form.Item>

                <div className="btn-group d-flex justify-end mt40">
                    <EffButton type="line" round className="mr20" onClick={onClose} text="取消" key="cancel" />
                    <EffButton type="filled" round onClick={response.saveTag} text="保存" key="confirm" />
                </div>
            </Form>
        </Modal>
    );
}
