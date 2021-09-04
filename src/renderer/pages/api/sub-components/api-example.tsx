import React, {useState} from "react";
import {CaretDownOutlined} from '@ant-design/icons'
import {API, apiThunks} from "@slice/apiSlice";
import {Popover} from "antd";
import './api-example.less'
import {apiActions} from "@slice/apiSlice";
import IconRemove from '@imgs/remove.png'
import {useDispatch} from "react-redux";
import EffConfirmDlg from "../../../components/eff-confirm-dlg/eff-confirm-dlg";
import EffButton from "../../../components/eff-button/eff-button";
import {effToast} from "@components/common/eff-toast/eff-toast";


interface IApiProps{
    api: API
}


export default function ApiExample(props:IApiProps){
    const {examples=[]} = props.api
    const dispatch = useDispatch()
    const [willDelExample, setWillDelExample] = useState<any>()
    const [confirmDelDlgVisible, setConfirmDelDlgVisible] = useState(false)
    const apiNum = examples.length
    const handler = {
        editExample: (example:any)=>{
            dispatch(apiActions.editApiExample(example))
        },
        confirmDelExample: (event:any, example:any)=>{
            event.stopPropagation();
            setWillDelExample(example)
            setConfirmDelDlgVisible(true)

        },
        delExample: async ()=>{
            setConfirmDelDlgVisible(false)
            let id = willDelExample.id
           let result:any =  await dispatch(apiThunks.delApiExample(id))
            if(result){
                effToast.success_withdraw(`示例${willDelExample.name}已放入回收站`, ()=>handler.withdrawDelApiExample(id))
            }


        },
        withdrawDelApiExample: (id:number)=>{
            dispatch(apiThunks.withdrawDelApiExample(id))
        }
    }
    const content = examples.map((example:any)=>{
      return (<div className="api-example cursor-pointer d-flex justify-between" key={example.id} onClick={()=>handler.editExample(example)}>
            <span className="ml10">{example.name}</span>
            <div className="d-flex actions"  >
                <img onClick={(event)=>handler.confirmDelExample(event, example)} src={IconRemove} className="ml5 mr10" width={14} />
            </div>
        </div>)
    })
    return (
        <div className="api-examples">

            <Popover   content={content} placement="bottomLeft" trigger={"click"}>
                <span className="cursor-pointer">示例({apiNum})<CaretDownOutlined /></span>
            </Popover>
            <EffConfirmDlg visible={confirmDelDlgVisible}>
                <div>
                    <div className="d-flex-column">
                        <span>确定将示例“{willDelExample && willDelExample.name}”放入回收站</span>
                     </div>
                    <div className="mt10 d-flex justify-end">
                        <EffButton onClick={()=>setConfirmDelDlgVisible(false)} round={true} key={"cancel"} text={"取消"}/>
                        <EffButton onClick={handler.delExample} className="mr20 ml10" type={"filled"} key={"confirm"} text={"确定"} round={true}/>
                    </div>
                </div>
            </EffConfirmDlg>
         </div>
    )
}
