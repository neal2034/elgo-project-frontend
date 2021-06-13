import React, {useState} from "react";
import {CaretDownOutlined} from '@ant-design/icons'
import {API, apiThunks} from "@slice/apiSlice";
import {Popover} from "antd";
import './api-example.less'
import {apiActions} from "@slice/apiSlice";
import IconEdit from '@imgs/pen-edit.png'
import IconRemove from '@imgs/remove.png'
import {useDispatch, useSelector} from "react-redux";
import EffConfirmDlg from "../../../components/eff-confirm-dlg/eff-confirm-dlg";
import EffButton from "../../../components/eff-button/eff-button";
import EffToast from "../../../components/eff-toast/eff-toast";
import {RootState} from "../../../store/store";


interface IApiProps{
    api: API
}


export default function ApiExample(props:IApiProps){
    const {examples=[]} = props.api
    const dispatch = useDispatch()
    let isToastOpen = useSelector((state:RootState)=>state.api.toastOpen)
    const [willDelExample, setWillDelExample] = useState<any>()
    const [confirmDelDlgVisible, setConfirmDelDlgVisible] = useState(false)
    const [popoverVisible, setPopoverVisible] = useState(false)
    const [toastMessage, setToastMessage] = useState<string>();
    const [isToastWithdraw, setToastWithdraw] = useState(false);
    const apiNum = examples.length
    const handler = {
        editExample: (example:any)=>{
            setPopoverVisible(false)
            dispatch(apiActions.editApiExample(example))
        },
        confirmDelExample: (example:any)=>{
            setPopoverVisible(false)
            setWillDelExample(example)
            setConfirmDelDlgVisible(true)

        },
        delExample: async ()=>{
            setConfirmDelDlgVisible(false)
            let id = willDelExample.id
            setToastMessage(`示例${willDelExample.name}已放入回收站`)
            setToastWithdraw(true)
            await dispatch(apiThunks.delApiExample(id))


        },
        withdrawDelApiExample: ()=>{
            dispatch(apiThunks.withdrawDelApiExample(willDelExample.id))
        }
    }
    const content = examples.map((example:any)=>{
      return (<div className="api-example cursor-pointer d-flex justify-between" key={example.id}>
            <span className="ml10">{example.name}</span>
            <div className="d-flex actions">
                <img onClick={()=>handler.editExample(example)} src={IconEdit} width={14} />
                <img onClick={()=>handler.confirmDelExample(example)} src={IconRemove} className="ml5 mr10" width={14} />
            </div>
        </div>)
    })
    return (
        <div className="api-examples">
            示例({apiNum})
            <Popover visible={popoverVisible} content={content} placement="bottomLeft" trigger={"click"}>
                <CaretDownOutlined onClick={()=>setPopoverVisible(true)} />
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
            <EffToast onWithDraw={handler.withdrawDelApiExample} isWithDraw={isToastWithdraw} open={isToastOpen} message={toastMessage!} onClose={()=>dispatch(apiActions.setToastOpen(false))}/>
        </div>
    )
}
