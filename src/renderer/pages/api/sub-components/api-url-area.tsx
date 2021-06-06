import React, {useState} from "react";
import {Select,Input,Button} from "antd";
import ApiDialog from "../dialogs/api-dialog";
import {useSelector} from "react-redux";
import {RootState} from "../../../store/store";

const {Option}  = Select


export default function ApiUrlArea(){

    const [apiDlgVisible, setApiDlgVisible] = useState(false)
    const [apiCollections, setApiCollections] = useState(); //当前可以用于保存API的collection

    const apiItems = useSelector((state:RootState)=>state.api.apiTreeItems)

    /**
     * 过滤API tree item, 排除API项，仅保留API 集合 和分组
     * @param items
     * @returns {[]}
     */
    const getApiCollections = (items:any)=>{
        let result:any = [];
        items.forEach((item:any)=>{
            if(item.type!=='API'){
                let tempItem = {...item};
                tempItem.children = [];
                if(item.children && item.children.length>0){
                    tempItem.children = getApiCollections(item.children);
                }
                result.push(tempItem);

            }
        })
        return result;
    }

    const mapTreeData = (data:any) =>{
        return  data.map((item:any)=>{
            return {...item,   key:item.id, title:item.name, children: item.children == null || item.children.length <= 0 ? [] : mapTreeData(item.children)}
        })
    }


    const handler = {
        handleSaveClick:()=>{
            setApiDlgVisible(true)
            let collections = mapTreeData(getApiCollections(apiItems));
            setApiCollections(collections)

        }
    }

    return (
        <div className="d-flex">
            <Select style={{ width: 120 }} value={"get"}>
                <Option value="get">Get</Option>
                <Option value="post">Post</Option>
                <Option value="put">Put</Option>
                <Option value="delete">Delete</Option>
            </Select>
            <Input/>
            <Button>发送</Button>
            <Button onClick={handler.handleSaveClick}>保存</Button>
            <ApiDialog collections={apiCollections} visible={apiDlgVisible} closeDlg={()=>setApiDlgVisible(false)} mode={'add-api'} parentId={-1}/>
        </div>
    )
}
