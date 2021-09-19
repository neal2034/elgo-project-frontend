//api 接口

const  apiUrl = {
    user:{
        login: '/login',                //登录
        lookup: "/user/public/lookup",  //查找用户
        signon: "/user/public/signon",  //用户登录
        retrievePwdEmail: "/user/public/retrieve-password-email",    //发送找回密码邮件
        checkRetrievePwdToken: "/user/public/check-retrieve-pwd-token",  //校验找回密码token
        retrievePassword: "/user/public/retrieve-password",              //重设密码
        userRes: "/user",                                               //用户资源
    },
    organization:{
        orgRes: '/organization',            //组织资源,
        detail: '/organization/detail',     //获取组织详情
        addMember: '/organization/member',     //添加组织成员
        checkOrgUserToken: '/organization/public/check-token',          //检查组织成员token有效性
        activeMember: '/organization/public/member/active',              //用户激活
        getMemberInfo: '/organization/member',                      //获取组织成员详情
        currentMemberInfo: '/organization/current-member',          //当前组织成员信息
        orgMemberRes: '/organization/member',                     //组织成员资源
        lastLogin: '/organization/last-login',                    //设置最近登录组织
        getLogin: '/organization/login',                          //获取需要登录的组织

    },
    orgMember:{
        available: '/org-member/available',                     //可以分配给指定项目的组织成员
        currentMember: 'org-member/current',                    //获取当前成员信息
    },
    project:{
        projectRes: '/project',        //项目资源,
        recycle: '/project/recycle',   //回收项目
        rename: '/project/rename',     //修改名称
        members: '/project/member',    //项目成员资源
        detail: '/project/detail',     //获取项目详情
    },
    api:{
        setRes: '/api-tree-item/set',   //api 集合资源,
        groupRes: '/api-tree-item/group',   //api分组资源
        apiTreeItemRes: '/api-tree-item/api',       //api条目资源
        treeItemRes: '/api-tree-item',   //api tree item 资源
        withdraw: '/api-tree-item/withdraw',      //撤销删除,
        apiRes: '/api',                        //api 资源
        apiViaTreeItem: '/api/tree-item',       //根据tree item 获取API
        apiDescription: '/api/description',     //改变api 描述

    },
    apiEnv:{
        apiEnvRes: '/env',          //api 环境资源
        withdrawDelApiEnv: '/env/withdraw',     //撤销删除API 环境
    },
    apiExample:{
        apiExampleRes: '/api-example',      //api example 资源
        withdrawDel: '/api-example/withdraw',   //撤销删除 api example
    },
    requirements:{
        index: '/requirements',
        trash: "/requirements/:id/trash",
        revert: "/requirements/:id/revert",
        detail: "/requirements/detail",
    },
    requirementsClass: {
        index: "/requirements-class",
        delete: "/requirements-class/:id"
    },
    requirementsSources: {
        index: "/requirements-source",
        withdraw: "/requirements-source/withdraw",
        delete: "/requirements-source/:id"
    },
    funztion:{
        index: "/funztion",
        detail: "/funztion/detail",     //功能详情
        editRequirement: '/funztion/requirement', //编辑需求
        withdrawDel: '/funztion/withdraw',      //撤销删除需求
        description: '/funztion/description',   //编辑详情
        status: '/funztion/status',             //修改功能状态
        name: '/funztion/name',                 //修改功能名称
        tags: '/funztion/tags',                 //修改功能标签
        withIds: '/funztion/with-ids',          //列出指定ID的功能
    },
    funztionStatus:{
        index: "/funztion-status"
    },
    versions:{
        index: "/versions",
        withdraw: "/versions/withdraw"
    },
    tags: {
        index: "/tags",
        withdrawDel: '/tags/withdraw',          //撤销删除
    },
    taskList: {
        index: '/task-list',
        withdraw: '/task-list/withdraw', //撤销删除
        detail: '/task-list/detail'
    },
    // 文件API
    fileApi:{
        getOssSignature: '/file/oss-signature'
    },
    task:{
        index: '/task',
        editDescription: '/task/description',  //修改任务描述
        withdrawDel: '/task/revert?id=',           //撤销删除任务
        editHandler: '/task/handler',           //修改负责人
        editStatus: '/task/status',             //任务状态修改
        editPriority: '/task/priority',         //优先级修改
        editName: '/task/name',                 //修改任务名称
        editDeadline: '/task/deadline',         //修改任务截至日期
        editTags: '/task/tag',                  //修改任务标签
        setDone: '/task/done',                  //设置为已完成
        setUndone: '/task/un-done',             //取消完成
        detail: '/task/detail',                 //任务详情
        withdraw: '/task/revert',               //撤销删除
        mine:'/my/task',                        //我的任务
    },
    testCase:{
        index: '/test-case',
        detail: '/test-case/detail',        //测试用例详情
        withdrawDel: '/test-case/withdraw', //撤销删除
        editName: '/test-case/name',        //修改测试用例名称
        editFunztion:'/test-case/funztion', //修改测试用例对应功能
        editTag: '/test-case/tag',          //修改测试用例标签
        editPriority: '/test-case/priority',    //修改用例优先级
        editDescription: '/test-case/description',  //修改用例描述
    },
    testPlan:{
        index: '/test-plan',
        detail: '/test-plan/detail',
        editName: '/test-plan/name',        //编辑计划名称
        editDescription: '/test-plan/description',     // 编辑计划描述
        editFunztion: '/test-plan/funztion',        //编辑计划测试功能
        editStatus: '/test-plan/status',            //编辑计划状态
        withdrawDel: '/test-plan/withdraw',        //撤销删除
        planCase: '/plan-case',                     //测试计划测试用例
        planCaseDetail:'/plan-case/detail',         //测试计划测试用例详情
    },
    bug:{
        index: '/defect',
        detail: '/defect/detail',               //获取详情
        editDescription: '/defect/description',  //修改详情
        editName: '/defect/name',               //修改名称
        editTester: '/defect/tester',               //修改测试者
        editHandler: '/defect/handler',         //修改解决人
        editTags: '/defect/tags',               //修改标签
        editSeverity: '/defect/severity',       //修改优先级
        editStatus: '/defect/status',           //修改状态,
        withdrawDel: '/defect/withdraw',        //撤销删除
        mine:'/my/defect',                        //我的任务

    }
}


export default apiUrl;
