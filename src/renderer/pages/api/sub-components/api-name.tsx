/**
 * 组件： api 名称
 */
import React from "react";
import {API} from "@slice/apiSlice";
import {CaretRightOutlined, CaretDownOutlined} from '@ant-design/icons'
import {apiActions} from '@slice/apiSlice'
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/store";

interface ApiProps{
    api: API
}

export default function ApiName(props:ApiProps){
    const {name, id} = props.api
    const dispatch = useDispatch()
    const isShowDescription = useSelector((state:RootState)=>state.api.showDescription)
    const savedApi = !!id
    const handler = {
        showDescription:()=>{
            dispatch(apiActions.setShowDescription(true))
        },

        hideDescription:()=>{
            dispatch(apiActions.setShowDescription(false))
        }
    }
    return (
        <div className="d-flex">
            {savedApi? (isShowDescription?<CaretDownOutlined onClick={handler.hideDescription} />:<CaretRightOutlined onClick={handler.showDescription} />):null}
            {name}
        </div>
    )
}
