import Requirement from "../pages/requirment/requirement";
import Funztion from "../pages/funztion/funztion";
import Task from "../pages/task/task";
import Api from "../pages/api/api";
import TestCase from "../pages/case/test-case";
import TestPlan from "../pages/test-plan/test-plan";
import Bug from "../pages/bug/bug";
import ProjectSetting from "../pages/project-setting/project-setting";

const  projectMenus:any = [
    {key:'requirement', path:`/requirement`, name:'需求', component:Requirement},
    {key:'funztion',path:`/funztion`,name:'功能', component:Funztion},
    {key:'task', path:`/task`, name:'任务', component:Task},
    {key:'api', path:`/api`, name:'API', component:Api},
    {key:'test-case', path:`/test-case`, name:'测试用例',component:TestCase},
    {key:'test-plan-home', path:`/test-plan-home/test-plan`, name:'测试计划', component:TestPlan},
    {key:'bug', path:`/bug`, name:'Bug', component:Bug},
    {key:'project-setting', path:`/project-setting`, name:'设置', component:ProjectSetting},
]


export {projectMenus};
