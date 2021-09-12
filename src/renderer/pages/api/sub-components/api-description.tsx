import React, {useState} from "react";
import {API,apiThunks} from "@slice/apiSlice";
import './api-description.less'
import ImgEdit from '@imgs/pen-edit.png'
import TextArea from "antd/es/input/TextArea";
import EffButton from "../../../components/eff-button/eff-button";
import {useDispatch} from "react-redux";


interface IApiProps{
    api: API
}

export default function ApiDescription(props:IApiProps){
    const {description} = props.api
    const dispatch = useDispatch()
    const [isEdit, setIsEdit] = useState(false);
    const [apiDes, setApiDes] = useState(description);
    const [hoverOnDes, setHoverOnDes] = useState(false)

    const handler = {
        cancelEdit:()=>setIsEdit(false),
        confirmEdit:async ()=>{
            await dispatch(apiThunks.editApiDescription(apiDes))
            setIsEdit(false)
        },
        descriptionChanged:(e:any)=>{
             setApiDes(e.target.value)
        }
    }

    return (
        <div className="mt10 api-description">
            {isEdit? <div className="d-flex-column align-end">
                <TextArea value={apiDes} onChange={handler.descriptionChanged} autoSize={{minRows: 10, maxRows: 10}}/>
                <div className="d-flex mt5">
                    <EffButton onClick={handler.cancelEdit} text={"取消"} key={"cancel"}/>
                    <EffButton onClick={handler.confirmEdit} text={"确定"} key={"confirm"}/>
                </div>
            </div>:
            <div onMouseEnter={()=>setHoverOnDes(true)} onMouseLeave={()=>setHoverOnDes(false)} className="d-flex">
                {description?<span>{description}</span>:<span className="add-des-btn cursor-pointer" onClick={()=>setIsEdit(true)}>添加简介</span>}
                {(hoverOnDes && !!description)?<img onClick={()=>{setIsEdit(true); setHoverOnDes(false)}} className="cursor-pointer ml10" src={ImgEdit} width={14}/>:null}
            </div>}
        </div>
    )
}
