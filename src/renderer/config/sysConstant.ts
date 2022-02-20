interface Map {
    [key: string]: any;
    [index: number]: any;
}

/**
 * 需求状态
 */
export const REQUIREMENT_STATUS: Map = {
    PLANNING: { key: 'PLANNING', name: '规划中', color: '#FF6C40' },
    DEFINED: { key: 'DEFINED', name: '已定义', color: '#00b7c2' },
    DOING: { key: 'DOING', name: '实现中', color: '#4E89AE' },
    DONE: { key: 'DONE', name: '已实现', color: '#4caf50' },
    PENDING: { key: 'PENDING', name: '已搁置', color: '#FFA372' },
    REJECT: { key: 'REJECT', name: '已拒绝', color: '#B52B65' },
};

// 优先级
export const PRIORITY: Map = {
    LOW: { name: '低', key: 'LOW', color: '#96bb7c' },
    MIDDLE: { name: '中', key: 'MIDDLE', color: '#00b7c2' },
    HIGH: { name: '高', key: 'HIGH', color: '#f4545c' },
};

// 任务状态
export const TASK_STATUS: Map = {
    UNSTART: { name: '未开始', key: 'UNSTART', color: '#F4545C' },
    START: { name: '已开始', key: 'START', color: '#4E89AE' },
    DONE: { name: '已完成', key: 'DONE', color: '#408C55' },
    DEPEND: { name: '被阻碍', key: 'DEPEND', color: '#FFA372' },
};

// 测试计划状态
export const TEST_PLAN_STATUS: Map = {
    UN_EXECUTED: { name: '未开始', key: 'UN_EXECUTED', color: '#F4545C' },
    START: { name: '已开始', key: 'START', color: '#4E89AE' },
    DONE: { name: '已完成', key: 'DONE', color: '#408C55' },
};

// 测试计划用例状态
export const PLAN_CASE_STATUS: Map = {
    UNTEST: { name: '未测试', key: 'UNTEST', color: '#F4545C' },
    PASS: { name: '通过', key: 'PASS', color: '#4E89AE' },
    FAIL: { name: '失败', key: 'FAIL', color: '#408C55' },
};

export const BUG_SEVERITY: Map = {
    CRASH: { name: '崩溃', key: 'CRASH', color: '#F4545C' },
    SERIOUS: { name: '严重', key: 'SERIOUS', color: '#4E89AE' },
    NORMAL: { name: '一般', key: 'NORMAL', color: '#408C55' },
    HINT: { name: '提示', key: 'HINT', color: '#FFA372' },
    ADVICE: { name: '建议', key: 'ADVICE', color: '#4f8a8b' },
};

export const BUG_STATUS: Map = {
    OPEN: { name: '待解决', key: 'OPEN', color: '#F4545C' },
    REJECT: { name: '已拒绝', key: 'REJECT', color: '#4E89AE' },
    FIXED: { name: '已解决', key: 'FIXED', color: '#FFA372' },
    VERIFIED: { name: '已确认', key: 'VERIFIED', color: '#4f8a8b' },
    WORK_AS_DESIGN: { name: '非缺陷', key: 'WORK_AS_DESIGN', color: '#78bf73' },
    CAN_NOT_REPRODUCE: { name: '无法重现', key: 'CAN_NOT_REPRODUCE', color: '#f8bd7f' },
};

export const colors = ['#4e89a3', '#43658b', '#00b7c2', '#ed6663', '#b52b65', '#f4545c', '#f8bd7f', '#ffa372', '#e48532', '#4f8a8b', '#96bb7c', '#78bf73'];

// 未完成的任务
export const UNDONE_TASK = ['UNSTART', 'START', 'DEPEND'];

// 项目颜色
export const PROJECT_COLOR = ['#78BF73', '#4E89A3', '#00B7C2', '#ED6663', '#B52B65', '#F4545C', '#F8BD7F', '#FFA372', '#E48532', '#2167C0'];
export const PROJECT_ICON = ['music', 'statistics', 'prize', 'plane', 'fly', 'earth', 'crown', 'medal'];
export const USER_COLORS = PROJECT_COLOR;
