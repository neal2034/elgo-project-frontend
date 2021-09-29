// 系统配置文件

const apiPrefix = "/api"
const baseUrl = (process.env.NODE_ENV === 'production'? "http://www.elgo.cc/elgo":"/elgo") + apiPrefix

export default {baseUrl, apiPrefix}
