const crypto = require('crypto');
const md5 = crypto.createHash('md5')

const rmids = {
    local: '8',
    dev: '109',
    nf: '109',
    nf2: '109',
    nf3: '109',
    ao: '109',
    cr: '109',
    lang: '109',
    develop: '266',
    2015: '160',
    prod: '266'
}

const urls = {
    local: 'http://localhost:8000',
    dev: 'http://gameclient.test',
    nf: 'http://api-new.b2bdev.com',
    nf2: 'http://api-new2.b2bdev.com',
    nf3: 'http://api-new3.b2bdev.com',
    ao: 'http://api-autoodds.b2bdev.com',
    cr: 'ttp://api-currency.b2bdev.com',
    lang: 'http://api-lang.b2bdev.com',
    develop: 'https://gc1st.gw1238.online',
    2015: 'http://landgameclient.com',
    prod: 'https://api.shicai-client.com'
}

// op 預設值
const op = {
    dev: 'testOP1',
    nf: 'testOP1',
    nf2: 'testOP1',
    nf3: 'testOP1',
    ao: 'testOP1',
    cr: 'testOP1',
    lang: 'testOP1',
    develop: 'web',
    2015: 'test',
    prod: 'web'
}

let config = {
    // id: process.env.USERNAME,
    id:'1688735462343',
    port: 8084,
    env: null,
    rmid: null,
    currency: 'CNY',
    op: null,
    token: null,
}
function setConfig(key, arg) {
    config[key] = arg.split('=')[1]
}

const args = process.argv.slice(2)
args.forEach((arg, i) => {
    if (arg.toLowerCase().includes('port=')) {
        setConfig('port', arg)
    } else if (arg.includes('-')) {
        config.env = arg.slice(1, 99)
    } else if (arg.includes('rmid=')) {
        setConfig('rmid', arg)
    } else if (arg.includes('currency=')) {
        setConfig('currency', arg)
    } else if (arg.includes('op=')) {
        setConfig('op', arg)
    } else if (arg.includes('token=')) {
        setConfig('token', arg)
    } else {
        config.id = arg
    }
})
const rmid = config.rmid || rmids[config.env] || ''
// 設定 op
!config.op && (config.op = op[config.env])

const md5Last3Num = md5.update(rmid).digest('hex').slice(-3).toLocaleLowerCase()
const prefix = `/login/thirdparty/${rmid}-${md5Last3Num}`
const target = urls[config.env]
let login = `${prefix}?thirdpartyUserId=${config.id}`
config.currency && (login += `&currency=${config.currency}`)
login += `&op=${config.op}`
config.token && (login += `&thirdpartyUserId=${config.token}`)

module.exports = {
    port: config.port,
    login,
    target
}

