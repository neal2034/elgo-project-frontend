import React from 'react'
import  './login.less'
import {Button} from "antd";
import request from "../../utils/request";



export default class Login extends React.Component<any> {

    private handleSubmit =  async () => {

      let result = await  request.post({
            url: '/effwork/login',
            data:{
                username:'admin@effwork.net',
                password:'Pas1234'
            },
          config:{
              baseURL:''
          }
        })
        // this.props.history.push("/not");
    };



    render() {
        return (
            <div className="login">
                <Button type="primary" onClick={this.handleSubmit}>登录</Button>
            </div>
        );
    }
}
