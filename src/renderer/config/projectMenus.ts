import React from 'react';
import Requirement from '../pages/requirment/requirement';
import Funztion from '../pages/funztion/funztion';
import Task from '../pages/task/task';
import Api from '../pages/api/api';
import TestCase from '../pages/case/test-case';
import TestPlan from '../pages/test-plan/test-plan';
import Bug from '../pages/bug/bug';
import ProjectSetting from '../pages/project-setting/project-setting';
import ExecuteTestPlan from '../pages/test-plan/execute-test-plan';

interface IMenuRoute{
    menuKey:string, // 用于识别项目菜单，未必唯一
    path:string, // 路由路径
    name:string, // 菜单名称
    component:React.FC, // 路由展示组件,
    noMenu?:boolean, // 不显示菜单，仅作为路由
}

const basePath = '/app/project/:serial';

const projectMenuRoutes:IMenuRoute[] = [
    {
        menuKey: 'task', path: `${basePath}/task`, name: '任务', component: Task,
    },
    {
        menuKey: 'requirement', path: `${basePath}/requirement`, name: '需求', component: Requirement,
    },
    {
        menuKey: 'funztion', path: `${basePath}/funztion`, name: '功能', component: Funztion,
    },
    {
        menuKey: 'api', path: `${basePath}/api`, name: 'API', component: Api,
    },
    {
        menuKey: 'test-case', path: `${basePath}/test-case`, name: '测试用例', component: TestCase,
    },
    {
        menuKey: 'test-plan', path: `${basePath}/test-plan`, name: '测试计划', component: TestPlan,
    },
    {
        menuKey: 'test-plan', path: `${basePath}/test-plan-execute/:id`, noMenu: true, name: '执行测试计划', component: ExecuteTestPlan,
    },
    {
        menuKey: 'bug', path: `${basePath}/bug`, name: 'Bug', component: Bug,
    },
    {
        menuKey: 'project-setting', path: `${basePath}/project-setting`, name: '设置', component: ProjectSetting,
    },
];

export { projectMenuRoutes, IMenuRoute };
