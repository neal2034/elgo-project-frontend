import React, {useContext, useState, useRef, useEffect} from "react";
import {Table, Form, Input, Checkbox} from "antd";
import {FormInstance} from "antd";
import './editable-table.less'

//
// const EditableContext = React.createContext<FormInstance<any>|null>(null)
//
// interface EditableRowProps{
//     index:number
// }
//
// const EditableRow = (props:any)=>{
//     const [form] = Form.useForm();
//     return(
//         <Form form={form} component={false}>
//             <EditableContext.Provider value={form}>
//                 <tr {...props}/>
//             </EditableContext.Provider>
//         </Form>
//     )
//
// }
//
// interface EditableCellProps{
//     editable:boolean,
//     children:React.ReactNode,
// }


const EditableCell = (props:any)=>{
    const [editing, setEditing] = useState(false);
    const inputRef = useRef<Input>(null)
    const {children, editable, dataIndex, handleSave, selectable, ...restProps} = props


    useEffect(()=>{
        if(editing){
            inputRef.current!.focus()
        }
    }, [editing])

    const toggleEdit = () =>{
        setEditing(!editing);
    }

    const valueChanged = (e:any) =>{
        handleSave(props.record, props.dataIndex, e.target.value)
    }

    const selectChanged = (e:any) =>{
        handleSave(props.record, props.dataIndex, e.target.checked)
    }

    let childNode = children
    if(editable){
        childNode = editing?(
            <div>
                <Input onChange={valueChanged} value={props.record[dataIndex]} ref={inputRef} onPressEnter={toggleEdit} onBlur={toggleEdit} />
            </div>
        ):(
            <div className="editable-cell-value-wrap" onClick={toggleEdit}>{children}</div>
        )
    }
    if(selectable){
        childNode = <div><Checkbox  onChange={selectChanged} checked={props.record[dataIndex]}/></div>
    }


    return <td {...restProps}>{childNode}</td>;
}


export default function EditableTable(props:any){

    const {columns, dataSource, valueChange} = props
    const tableCols = columns.map((col:any) => {
        if (!col.editable && !col.selectable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: any) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                selectable:col.selectable,
                handleSave:valueChange

            }),
        };
    });
    const components = {
        body:{
            cell:EditableCell
        }
    }
    return (
        <Table bordered components={components} dataSource={dataSource} columns={tableCols} pagination={false}/>
    )
}
