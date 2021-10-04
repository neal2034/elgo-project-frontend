import React from "react";
import {useHistory, useParams} from "react-router";
import HomeLogo from "@imgs/elgo-logo.png";
import {Form, Input} from "antd";
import EffButton from "@components/eff-button/eff-button";
import {useDispatch} from "react-redux";
import {orgThunks} from "@slice/orgSlice";
import 'md5'
import md5 from "md5";
import {effToast} from "@components/common/eff-toast/eff-toast";


export default function NewOrg(){
    const dispatch = useDispatch();
    const history = useHistory()
    const {token} = useParams();
    const isNew = token == 'new';
    const title = isNew? '创建新组织':'激活Elgo账号'
    const [newOrgForm] = Form.useForm();


    const response = {
        newOrg: async ()=>{
            const values = await newOrgForm.validateFields();
            const name = values.name


            if(isNew){
                const name = values.name;
                const result:any = await dispatch(orgThunks.addAnotherOrganization({name}))
                if(result){
                    effToast.success('新组织创建成功')
                    history.push('/login')
                }

            }else{
                //激活账号
                const password = md5(values.password)
                const result:any = await dispatch(orgThunks.addOrganization({name, password,token}))
                if(result){
                    effToast.success('账号激活成功')
                    history.push('/login')
                }
            }
        }
    }

    return (
        <div className="signup">
            <div className="content">
                <img src={HomeLogo} width={200} className="logo" />

                <Form form={newOrgForm}  className="signup-form mt20">
                    <span className="title-des">{title}</span>

                    { !isNew && <Form.Item name="password"   className="mt20" rules={[{ required: true, message: '请设置账号密码' }]}>
                        <Input type={'password'} placeholder="请设置账号密码" />
                    </Form.Item> }

                    <Form.Item name="name"    className="mt20" rules={[{ required: true, message: '请输您的入组织名称' }]}>
                        <Input placeholder="请输入您的组织名称" />
                    </Form.Item>

                    <EffButton onClick={response.newOrg} className="mb20 mt20" text={'确定'} type={"filled"} round={true} width={330} />
                </Form>
            </div>

        </div>
    )

}
