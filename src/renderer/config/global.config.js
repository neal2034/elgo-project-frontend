// 系统配置文件

const apiPrefix = '/api';
const isElectron = process.env.RUN_ENV === 'pc';
const isProduction = process.env.NODE_ENV === 'production';
const baseUrl = ((isElectron && isProduction) ? 'https://www.elgo.cc/elgo' : '') + apiPrefix;

export default { baseUrl, apiPrefix };
