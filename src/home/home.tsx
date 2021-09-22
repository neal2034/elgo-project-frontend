import { AppContainer as ReactHotContainer } from 'react-hot-loader';
import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
const AppContainer = process.env.NODE_ENV === 'development' ? ReactHotContainer : Fragment;
import './home.less'
import HomeLogo from '@home/assets/home-logo.png'
import Process from '@home/assets/process.png'
import SingleCommunication from '@home/assets/single-comunication.png'
import TeamWork from '@home/assets/team-work.png'
import Statistics from '@home//assets/statistics.png'



ReactDOM.render(
    <AppContainer>
          <div className="elgo-home d-flex-column">
              <div className="header d-flex justify-between align-center">
                   <div className="d-flex align-center">
                       <img style={{height:'36px'}} src={HomeLogo}/>
                       <div className="d-flex align-center menus">
                           <span className="menu-item">帮助</span>
                           <span className="menu-item">社区</span>
                           <span className="menu-item">关于我们</span>
                       </div>
                   </div>
                   <div className="btn-group d-flex align-center">
                        <div className="login btn">登录</div>
                        <div className="btn signup ml20">注册</div>
                   </div>
              </div>

              <div className="content">
                  <div style={{marginTop:'40px'}} className="d-flex justify-between align-center">
                      <div className="d-flex-column text-part">
                          <span className="title">高效组织软件研发流程</span>
                          <span className="description mt40">以项目为核心，需求驱动，任务追踪，接口同步等方式，确保<br/>研发流程协调一致</span>
                          <div className="btn signup mt40">免费试用</div>
                      </div>
                      <img className="des-img"  src={Process}/>
                  </div>

                  <div style={{marginTop:'100px'}} className="d-flex justify-between align-center">
                      <img className="des-img" src={Statistics}/>
                      <div className="d-flex-column right-text-part">
                          <span className="title">随时掌控研发动态</span>
                          <span className="description mt40">对研发状态实时汇总，统计总结，随时获取当前研发状态，<br/>规避进度风险</span>
                      </div>
                  </div>

                  <div style={{marginTop:'100px'}} className="d-flex justify-between align-center">
                      <div className="d-flex-column text-part">
                          <span className="title">需求，功能，任务，接口，<br/>测试用例，BUG相互关联，<br/>统一管理</span>
                          <span className="description mt40">对软件项目的整个声明周期要素进行相关关联，信息同步，使得产品经理，<br/>项目经理，研发人员，测试人员，始终在同一信息层面协调工作</span>
                      </div>
                      <img className="des-img" src={TeamWork}/>
                  </div>

                  <div style={{marginTop:'100px'}} className="d-flex justify-between align-center">
                      <img className="des-img" src={SingleCommunication}/>
                      <div className="d-flex-column right-text-part">
                          <span className="title">智能协同，解耦沟通</span>
                          <span className="description mt40">更适合远程工作，多种方式流程同步，信息触达，生活工作更容易平衡</span>
                      </div>
                  </div>

                  <div className="copyright justify-center align-center d-flex">Copyright ©1998-2021 Elgo All Rights Reserved     粤ICP备B2-20090059-69</div>
              </div>

          </div>
    </AppContainer>,
    document.getElementById('app')
);
