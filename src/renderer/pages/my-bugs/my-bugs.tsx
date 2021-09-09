import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {setBreadcrumbs} from "../../store/breadcrumbSlice";
import {taskThunks} from "@slice/taskSlice";
import {bugThunks} from "@slice/bugSlice";
import {RootState} from "../../store/store";
import {Drawer} from "antd";
import TaskDetail from "../task/task-detail";
import BugDetail from "../bug/bug-detail";
import {projectActions} from "@slice/projectSlice";
import OneTask from "../task/one-task";
import EffInfoSep from "@components/business/eff-info-sep/eff-info-sep";
import BugItem from "../bug/bug-item";
import {effToast} from "@components/common/eff-toast/eff-toast";




interface IProjectBugs{
    projectId:number,
    projectName:string,
    members:[],
    defectList: {
        id:number,
        name:string,
        serial:number
    }[]
}

interface IPropProjectBugs{
    item:IProjectBugs,
    onBugSelected:(id:number)=>void,
}




export default function MyBugs(){
    const dispatch = useDispatch()
    const myBugs = useSelector((state:RootState)=>state.bug.myBugs)
    const [showDetail, setShowDetail] = useState(false);      //是否显示任务详情

    useEffect(()=>{
        dispatch(setBreadcrumbs(['我的Bug']))
        dispatch(bugThunks.listMyBugs())
    }, [dispatch])

    const response = {
        handleDel: async (id:number)=>{
            let result:any =await dispatch(bugThunks.deleteBug({id}))
            if(result as boolean){
                effToast.success_withdraw('Bug放入回收站成功',()=>response.handleWithdrawDel(id))
                dispatch(bugThunks.listMyBugs())
                setShowDetail(false)
            }
        },
        handleWithdrawDel: async (id:number)=>{
            let result:any = await dispatch(bugThunks.withdrawDelBug({id}))
            if(result as boolean){
                effToast.success("撤销成功")
                dispatch(bugThunks.listMyBugs())
            }
        },
        handleTaskSelected: async (id:number)=>{
            await dispatch(bugThunks.getBugDetail(id))
            setShowDetail(true)

        },
    }
    const bugList = myBugs.map((item:any)=><MyProjectBug key={item.projectId} onBugSelected={response.handleTaskSelected} item={item}/>)
    return (
        <div>
            {bugList}
            <Drawer
                title={null}
                width={'60%'}
                placement="right"
                closable={false}
                onClose={()=>setShowDetail(false)}
                visible={showDetail}
            >
                <BugDetail onDel={response.handleDel}/>
            </Drawer>
        </div>
    )
}



  function MyProjectBug(props:IPropProjectBugs){
    const dispatch = useDispatch()
    const {item} = props;

    const response = {
        handleSelected: (id:number)=>{
            dispatch(projectActions.setProjectMembers(item.members))
            props.onBugSelected(id)
        }
    }

    const bugItems = item.defectList.map((item:any, index)=><BugItem key={item.id} showBg={index%2!=0} bug={item} onChosen={response.handleSelected}/>)

    return(
        <React.Fragment>
            <EffInfoSep  className="ml40 mt40" name={item.projectName}/>
            {bugItems}

        </React.Fragment>
    )
}
