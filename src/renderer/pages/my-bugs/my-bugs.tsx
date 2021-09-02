import React, {useEffect} from "react";
import {useDispatch} from "react-redux";
import {setBreadcrumbs} from "../../store/breadcrumbSlice";



export default function MyBugs(){
    const dispatch = useDispatch()
    useEffect(()=>{dispatch(setBreadcrumbs(['我的Bug']))}, [dispatch])
    return (
        <div>
            我的Bug
        </div>
    )
}
