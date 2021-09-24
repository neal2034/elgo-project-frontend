import React, {useEffect, useState} from "react";
import HomeLogo from "@imgs/elgo-logo.png";
import {Form, Input} from "antd";
import EffButton from "@components/eff-button/eff-button";
import './signup.less'
import {useDispatch, useSelector} from "react-redux";
import {accountThunks} from "@slice/accountSlice";
import {useHistory} from "react-router";
import {effToast} from "@components/common/eff-toast/eff-toast";
import {RootState} from "../../store/store";
import {login} from "@slice/accountSlice";
import md5 from "md5";
import umbrella from "umbrella-storage";


export default function Signup(){
    const dispatch = useDispatch()
    const history = useHistory()
    const isEmailSent = useSelector((state:RootState)=>state.account.signupEmailSent)
    const isUserExist = useSelector( (state:RootState) => state.account.signupUserExist)
    const [sentEmail, setSentEmail] = useState<string>()
    const [isResent, setIsResent] = useState(false)


    const [signupForm] = Form.useForm()
    const [newOrgForm] = Form.useForm()


    useEffect(()=>{
        umbrella.setLocalStorage('token', null);
        umbrella.setLocalStorage('oserial', null);
        umbrella.setLocalStorage('pserial', null);
    },[])

    const response = {
        nextStep: async ()=>{
            let values = await signupForm.validateFields()
            let code = values.code
            let email = values.email
            setSentEmail(email)
            let result:any = await dispatch(accountThunks.signup({code,email}))
            if(!result){
                effToast.success('邀请码有误，请核实后重新输入')
            }
        },
        resentSignupEmail: async () => {
            if(!isResent){
                dispatch(accountThunks.resentSignUp({email:sentEmail!}))
                setIsResent(true)
            }

        },
        goCreateNewOrg: async ()=>{
            let values = await newOrgForm.validateFields();
            let password = md5(values.password)
            let result:any = await dispatch(login({username:sentEmail!, password}))
            if(result){
                history.push('/new-org/new')
            }else{
                effToast.error('密码有误，请重新输入')
            }

        }
    }

    return (
        <div className="signup">
            <div className="content">
                <img src={HomeLogo} width={200} className="logo" />

                {!isEmailSent && !isUserExist && <Form  form={signupForm}  className="signup-form mt20">
                    <span className="title">注册</span>
                    <Form.Item name="code"  className="mt20" rules={[{ required: true, message: '请输入邀请码' }]}>
                        <Input placeholder="内侧中，请输入注册邀请码" />
                    </Form.Item>
                    <Form.Item name="email"  className="mt20" rules={[{ required: true, message: '请输入邮箱地址' }, {type:'email', message:'请输入有效的邮箱'}]}>
                        <Input placeholder="请输入邮箱地址，将作为登录账号" />
                    </Form.Item>
                    <EffButton onClick={response.nextStep} className="mb20 mt20" text={'下一步'} type={"filled"} round={true} width={330} />
                </Form> }

                { isEmailSent && <div style={{minHeight:'200px'}} className="signup-form mt20 d-flex-column">
                    <span className="success-msg mb20" >账号激活邮件已发送至邮箱{sentEmail},请前往激活</span>
                    <div className="d-flex resent">
                        <span>未收到邮件？</span> <span onClick={response.resentSignupEmail} className="resent-btn">{isResent? '已重新发送':'重新发送'}</span>
                    </div>

                </div>}

                {isUserExist &&
                        <Form  form={newOrgForm}  className="signup-form mt20">
                            <span className="title-des">由于您已经有Elgo的账号，请输入该账号的密码，我们将为您创建新的组织</span>
                            <Form.Item name="password"  className="mt20" rules={[{ required: true, message: '请输入密码' }]}>
                                <Input type={"password"} placeholder="请输入账号密码" />
                            </Form.Item>
                            <EffButton onClick={response.goCreateNewOrg} className="mb20 mt20" text={'下一步'} type={"filled"} round={true} width={330} />
                        </Form>}
            </div>

        </div>
    )
}
