import React, {useEffect, useState} from "react";
import HomeLogo from "@imgs/elgo-logo.png";
import {Form, Input} from "antd";
import EffButton from "@components/eff-button/eff-button";
import {useDispatch, useSelector} from "react-redux";
import {useHistory, useParams} from "react-router";
import {orgThunks} from "@slice/orgSlice";
import {RootState} from "../../store/store";
import {effToast} from "@components/common/eff-toast/eff-toast";
import md5 from "md5";


export default function ActiveUser(){
    const dispatch = useDispatch()
    const history = useHistory()
    const [activeForm] = Form.useForm();
    const activeUserStatus = useSelector((state:RootState) => state.organization.activeUserStatus)
    const [title, setTitle] = useState<string>();
    const [isAvailable, setIsAvailable] = useState(true)
    const {token} = useParams();

    useEffect(()=>{
          dispatch(orgThunks.checkInviteToken({token}))
    },[])

    useEffect(()=>{
        if(activeUserStatus==1){
            setTitle('请设置密码');
            setIsAvailable(false);
            effToast.error('激活链接已失效，请联系管理员');
        }else if(activeUserStatus == 0){
            setTitle('请设置密码')
        }else if(activeUserStatus == -1){
            setTitle('您已有Elgo账户，请输入密码')
        }
    },[activeUserStatus])



    const response = {
        activeUser: async ()=>{
            const values = await  activeForm.validateFields();
            const password = md5(values.password)
            const data = {
                token,
                password,
                boolNew: activeUserStatus == 0
            }
            const result:any = await  dispatch(orgThunks.activeUser(data))
            if(result){
                effToast.success('用户激活成功')
                history.push('/login')
            }
        }
    }

    return (
        <div className="signup">
            <div className="content">
                <img src={HomeLogo} width={200} className="logo" />

                 <Form  form={activeForm}  className="signup-form mt20">
                    <span className="title">{title}</span>
                    <Form.Item name="password"  className="mt20" rules={[{ required: true, message: '请输入密码' }]}>
                        <Input disabled={!isAvailable} type={"password"} placeholder="请输入密码" />
                    </Form.Item>
                    <EffButton disabled={!isAvailable} onClick={response.activeUser} className="mb20 mt20" text={'确定'} type={"filled"} round={true} width={330} />
                </Form>
            </div>

        </div>
    )

}
