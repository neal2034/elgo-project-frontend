
interface Map {
    [key: string]: any;
    [index: number]: any;
}

/**
 * 需求状态
 */
export const REQUIREMENT_STATUS:Map = {
    PLANNING: {
        key: "PLANNING",
        name: "规划中",
        color: "#F4545C",
    },
    DEFINED: {
        key: "DEFINED",
        name: "已定义",
        color:"#00b7c2",
    },
    DOING: {
        key: "DOING",
        name: "实现中",
        color: "#4E89AE"
    },
    DONE: {
        key: "DONE",
        name: "已实现",
        color: "#408C55"
    },
    PENDING: {
        key: "PENDING",
        name: "已搁置",
        color: "#FFA372",
    },
    REJECT: {
        key: "REJECT",
        name: "已拒绝",
        color: "#B52B65",
    }
}

//优先级
export const PRIORITY:Map = {
NONE:{name:'无', key:'NONE', color: "#999999"},
LOW:{name:'低', key:'LOW', color:"#96bb7c",},
MIDDLE:{name:'中', key:'MIDDLE', color: "#00b7c2"},
HIGH:{name:'高', key:'HIGH',color:"#f4545c"}
}

//任务状态
export const TASK_STATUS:Map = {
    UNSTART:{name:'未开始', key:'UNSTART', color:'#F4545C'},
    START:{name:'已开始', key:'START', color:'#4E89AE'},
    DONE:{name:'已完成', key:'DONE', color: '#408C55'},
    DEPEND:{name:'被阻碍', key:'DEPEND',color: '#FFA372'}
}


//任务状态
export const TEST_PLAN_STATUS:Map = {
    UN_EXECUTED:{name:'未开始', key:'UN_EXECUTED', color:'#F4545C'},
    START:{name:'已开始', key:'START', color:'#4E89AE'},
    DONE:{name:'已完成', key:'DONE', color: '#408C55'},

}



