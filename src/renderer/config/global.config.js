// 系统配置文件

const apiPrefix = "/api"
const baseUrl = (process.env.NODE_ENV === 'production'? "http://www.dev.effwork.net/effwork":"/effwork") + apiPrefix

export default {baseUrl, apiPrefix}
