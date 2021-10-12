// 系统配置文件

const apiPrefix = "/api"
const isElectron = window && window.process && window.process.type == 'renderer'
const baseUrl = (isElectron? "http://www.elgo.cc/elgo":"/elgo") + apiPrefix

export default {baseUrl, apiPrefix}
