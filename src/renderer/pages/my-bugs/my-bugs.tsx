import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bugThunks } from '@slice/bugSlice';
import { Drawer } from 'antd';
import { projectActions } from '@slice/projectSlice';
import EffInfoSep from '@components/business/eff-info-sep/eff-info-sep';
import { effToast } from '@components/common/eff-toast/eff-toast';
import ImgSmile from '@imgs/smile.png';
import BugItem from '../bug/bug-item';
import BugDetail from '../bug/bug-detail';
import { RootState } from '../../store/store';
import './my-bugs.less';

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

function MyProjectBug(props:IPropProjectBugs) {
    const dispatch = useDispatch();
    const { item } = props;

    const response = {
        handleSelected: (id:number) => {
            dispatch(projectActions.setProjectMembers(item.members));
            props.onBugSelected(id);
        },
    };

    const bugItems = item.defectList.map((bugItem:any, index) => (
        <BugItem key={bugItem.id} showBg={index % 2 !== 0} bug={bugItem} onChosen={response.handleSelected} />));

    return (
        <>
            <EffInfoSep className="ml40 mt40" name={item.projectName} />
            {bugItems}

        </>
    );
}

export default function MyBugs() {
    const dispatch = useDispatch();
    const myBugs = useSelector((state:RootState) => state.bug.myBugs);
    const [showDetail, setShowDetail] = useState(false); // 是否显示任务详情

    useEffect(() => {
        dispatch(bugThunks.listMyBugs());
    }, [dispatch]);

    const response = {
        handleDel: async (id:number) => {
            const result:any = await dispatch(bugThunks.deleteBug({ id }));
            if (result as boolean) {
                effToast.success_withdraw('Bug放入回收站成功', () => response.handleWithdrawDel(id));
                dispatch(bugThunks.listMyBugs());
                setShowDetail(false);
            }
        },
        handleWithdrawDel: async (id:number) => {
            const result:any = await dispatch(bugThunks.withdrawDelBug({ id }));
            if (result as boolean) {
                effToast.success('撤销成功');
                dispatch(bugThunks.listMyBugs());
            }
        },
        handleTaskSelected: async (id:number) => {
            await dispatch(bugThunks.getBugDetail(id));
            setShowDetail(true);
        },
    };
    const bugList = myBugs.map((item:any) => <MyProjectBug key={item.projectId} onBugSelected={response.handleTaskSelected} item={item} />);
    return (
        <div className="my-bugs">
            {myBugs.length === 0 ? (
                <div className="empty-bugs d-flex-column align-center justify-center">
                    <img alt="empty" src={ImgSmile} width={80} />
                    <span className="mt20 desc">太棒了,没有需要解决的Bug耶</span>
                </div>
            ) : bugList}
            <Drawer
                title={null}
                width="60%"
                placement="right"
                closable={false}
                onClose={() => setShowDetail(false)}
                visible={showDetail}
            >
                <BugDetail onDel={response.handleDel} />
            </Drawer>
        </div>
    );
}
