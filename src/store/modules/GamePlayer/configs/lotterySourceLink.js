// 空字串代表不顯示
export default {
    // 股票
    // 日经股票
    '245': 'https://indexes.nikkei.co.jp/en/nkave',
    // 台湾股票
    '246': 'http://www.twse.com.tw/zh/',
    // 韩国股票
    '247': 'http://global.krx.co.kr/main/main.jsp',
    // 中国深圳股票
    '248': 'http://www.szse.cn/certificate/',
    // 香港恒生股票
    '249': 'https://www.hsi.com.hk/schi',
    // 泰证SET指数
    '285': 'https://www.set.or.th/en/',
    // 老X彩
    '288': 'https://laodl.com/',
    // 馬來西亞彩
    '289': 'https://www.magnum4d.my/zh-cn/results',
    default: lotteryId => `https://gw.shicai-intl.com/game/bonuscode/${lotteryId}?limit=60`
}
