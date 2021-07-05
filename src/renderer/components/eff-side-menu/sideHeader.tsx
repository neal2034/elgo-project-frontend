import React, {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store/store";
import {orgThunks} from "../../pages/organizationHome/orgSlice";
import {accountThunks} from "../../pages/account/accountSlice";
import {useHistory} from "react-router";
import './side-header.less'
import ImgUpDown from '@imgs/up-down.png'
import {Dropdown, Menu} from "antd";



export default function SideHeader(){
    const dispatch = useDispatch()
    const history = useHistory()
    const [orgMenuVisible, setOrgMenuVisible] = useState(false);
    const orgName = useSelector((state:RootState) => state.organization.name)
    const memberName = useSelector((state:RootState)=>state.account.memberName)
    const memberEmail = useSelector((state:RootState)=>state.account.memberEmail)

    useEffect(()=>{
        dispatch(orgThunks.getOrganizationDetail())
        dispatch(accountThunks.getCurrentMember())
    },[])


    //设置点击弹出菜单以外的地方关闭菜单
    useEffect(()=>{
        document.addEventListener("click", handleClickOutside, false);
        return () =>{
            document.removeEventListener("click", handleClickOutside, false);
        }

    }, [])

    const handleClickOutside = (event:any) =>{
        event.stopPropagation();
        if(!(  event.target.className && typeof event.target.className === 'string' && (event.target.className.includes("ant-dropdown-menu-item") || event.target.className.includes("drop-down-menu-trigger")))){
            setOrgMenuVisible(false)
        }
    }

    const handler = {
        goHome:()=>{
            history.push("/app/organization")
        }
    }

    const response = {
        dropdownMenuSelected: ({key,domEvent}:{key:any,domEvent:any})=>{
            domEvent.stopPropagation()
            setOrgMenuVisible(false)
            switch (key){
                case 'switch-org':
                    history.push("/app/org-switch")
                    break;
                case 'change-pwd':
                    alert('修改密码功能开发中')
                    break;
                case 'log-out':
                    history.push("/login")
                    break;
            }
        },
        openDropdownMenu: (event:any)=>{
            event.stopPropagation();
            setOrgMenuVisible(true);
        }
    }


    const menu = (
        <Menu onClick={response.dropdownMenuSelected} className="drop-down-menu-only">
            <Menu.Item key={"switch-org"}>
                 <span>切换组织</span>
            </Menu.Item>
            {/*<Menu.Item key={"change-pwd"}>*/}
            {/*      <span>修改密码</span>*/}
            {/*</Menu.Item>*/}
            <Menu.Item key={"log-out"}>
               <span>退出登录</span>
            </Menu.Item>

        </Menu>
    );


    return (
        <div className="d-flex-column align-start">
            <Dropdown  overlayStyle={{width:'200px'}} overlay={menu} visible={orgMenuVisible}  placement="bottomRight" >
                <span onClick={handler.goHome} className="font-title cursor-pointer org-name">
                    {orgName}
                    <div className="drop-down-menu-trigger"  onClick={response.openDropdownMenu}>
                        <img className="drop-down-menu-trigger" src={ImgUpDown} width={14}/>
                    </div>
                </span>
            </Dropdown>
            <span className="font-weak ml20"><span>{memberName}</span><span className="ml5">{memberEmail}</span></span>
        </div>
    )
}
