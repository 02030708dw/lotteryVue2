import 'babel-polyfill'
global.browser = null
global.page = null
global.flow = (flow) => flow.forEach(({key, fn}) => test(key, fn))