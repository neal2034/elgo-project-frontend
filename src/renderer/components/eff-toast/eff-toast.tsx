import React from "react";
import Snackbar from '@material-ui/core/Snackbar';
import {CheckOutlined} from '@ant-design/icons'
import './eff-toast.less'

interface IEffToastProps{
    open:boolean,
    duration?:number,
    message:string,
    isWithDraw?:boolean,
    onClose:()=>void,
    onWithDraw?:()=>void
}

export default function EffToast(props:IEffToastProps){

    const {open, message, duration=2000, onClose, isWithDraw=false, onWithDraw} = props

    return (
        <React.Fragment>
         <Snackbar open={open}  onClose={onClose}  anchorOrigin={{ vertical:'top', horizontal:'center' }}
                   autoHideDuration={duration}>
             <div className="eff-toast">
                 <CheckOutlined style={{color:'#408C55'}} width={20} />
                 <span className="ml10">{message}</span>
                 { isWithDraw? <span className="ml10">-- <span onClick={onWithDraw} className="ml10 withdraw">撤销</span></span>:null}
             </div>

         </Snackbar>
        </React.Fragment>

    )
}
