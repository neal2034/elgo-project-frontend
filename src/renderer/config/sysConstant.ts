
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

export const PRIORITY:Map = {
NONE:{name:'无', key:'NONE', color: "#999999"},
LOW:{name:'低', key:'LOW', color:"#96bb7c",},
MIDDLE:{name:'中', key:'MIDDLE', color: "#00b7c2"},
HIGH:{name:'高', key:'HIGH',color:"#f4545c"}
}