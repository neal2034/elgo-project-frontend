import React from 'react';
import { Modal } from 'antd';

interface IConfirmDlgProps{
    visible:boolean,
    children?: React.ReactNode,
    className?: string,
    title?:string
}

export default function EffConfirmDlg(props:IConfirmDlgProps) {
    const {
        children, visible, className, title = '确认删除',
    } = props;
    return (
        <Modal className={className} closable={false} footer={false} width={400} title={title} open={visible}>
            {children}
        </Modal>
    );
}
