const ApiFn = path => `/api/v1/${path}/1.1.1`

export const API = {
    /** 用户登入游戏中心 - 取得 user 可以玩的彩種 - 之後會整合進來...*/
    userLogin: ApiFn('user/login'),
    /** 使用者代理樹 */
    proxyTree: ApiFn('user/proxyTree'),
    /** 使用者总代列表 */
    ZDList: ApiFn('user/ZDList'),
    /** 使用者代理列表 */
    proxyList: ApiFn('user/proxyList'),
    /** 投注记录查询 */
    orderHistory: ApiFn('game/orderHistory'),
    /** 投注记录查询-越南 */
    orderHistoryVN: ApiFn('game/orderHistoryVN'),
    /** 投注记录單筆注單查询 */
    orderHistoryDetail: ApiFn('game/orderHistoryDetail'),
    /** 投注记录單筆注單查询-越南 */
    orderHistoryDetailVN: ApiFn('game/orderHistoryDetailVN'),
    /** 投注撤單 */
    userProjectCancel: ApiFn('userProjectCancel'),
    /** 帐变历史查询 */
    history: ApiFn('orders/history'),
    /** 彩种报表查询 */
    lotteryProfitSum: ApiFn('report/lotteryProfitSum'),
    /** 玩法报表查询 */
    methodProfitSum: ApiFn('report/methodProfitSum'),
    /** 用户盈亏统计查询 */
    userProfitSum: ApiFn('report/userProfitSum'),
    /** 输赢报表 */
    userProjectsProfit: ApiFn('report/userProjectsProfit'),
    /** 用户盈亏查询 */
    userProfit: ApiFn('report/userProfit'),
    /** 总代盈亏统计查询 */
    zdUserProfitSum: ApiFn('report/zdUserProfitSum'),
    /** 奖期盈亏统计查询 */
    issueProfit: ApiFn('report/issueProfit'),
    /** 厅主盈亏统计查询 */
    roomMasterProfitSum: ApiFn('report/roomMasterProfitSum'),

    /** 中心钱包转到游戏钱包 */
    recharge: ApiFn('wallet/recharge'),
    /** 用戶餘額 */
    availableBalance: ApiFn('wallet/availableBalance'),
    /** 用户投注 */
    gameOrder: ApiFn('game/order'),
    /** 追号记录查询 */
    orderFutureHistory: ApiFn('game/orderFutureHistory'),
    /** 追号记录查询詳細 */
    orderFutureHistoryDetail: ApiFn('game/orderFutureHistoryDetail'),
    /** 取消追號 */
    cancelTask: ApiFn('game/cancelTask'),
    /** 玩法介紹查詢 */
    helps: ApiFn('infomation/helps'),
    /** 玩法介紹新版查詢 */
    getHowToPlay: ApiFn('game/getHowToPlay'),
    /** 取得KEY的翻譯 */
    getTrans: ApiFn('game/getTransHowToPlay'),
    // client public API

    /** 取得 遊戲參數及高獎金 */
    gameConfig: ApiFn('game/gameConfig'),
    /** 新版取得 遊戲參數及高獎金 */
    gameConfigNF: ApiFn('game/gameConfigNF'),
    /** 越南彩/馬來彩取得獎期地區 API */
    areaIssue: ApiFn('game/areaIssue'),
    /** 取得 遊戲參數及高獎金 2 in 1*/
    gameConfigBind: ApiFn('game/gameConfigBind'),
    /** 取得 遊戲參數及高獎金 3 in 1*/
    gameConfigAllBind: ApiFn('game/gameConfigAllBind'),
    /** 取得 遊戲參數 */
    jsDynamicConfig: ApiFn('game/jsDynamicConfig'),
    /** 取得 遊戲多遊戲獎期 */
    countdownConfig: ApiFn('game/countdownConfig'),
    /** 取得泰國彩/越南彩停押 */
    stopBetting: ApiFn('game/stopBetting'),
    /** 取得 遊戲時間參數 */
    correctionTime: ApiFn('game/correctionTime'),
    /** 彩種清單 */
    lotteryList: ApiFn('game/lotteryList'),
    /** 新彩種清單 */
    lotteryMenu: ApiFn('game/lotteryMenu'),
    /** 新彩種狀態清單 */
    lotteryStatus: ApiFn('game/lotteryStatus'),
    /** 獎期清單 */
    issueList: ApiFn('game/issueList'),
    /** 獎期清單 */
    historyBall: ApiFn('game/historyBall'),
    /** 所有獎期清單 */
    historyBalls: ApiFn('game/historyBalls'),
    /** 越南投注頁歷史獎號 */
    vnLatestDraw: ApiFn('game/vnLatestDraw'),
    /** 越南投注頁歷史獎號2 */
    vnLatestDrawV2: ApiFn('game/vnLatestDrawV2'),
    /** 越南歷史獎號 */
    vnHistoryBall: ApiFn('game/vnHistoryBall'),
    /** 抓表頭時間用 */
    time: ApiFn('time'),
    /** 取得公告 */
    getNoticeList: ApiFn('info/getNotices'),
    /** 取得公告細節 */
    getNoticeDetail: ApiFn('info/getNoticesDetail'),
    /** 信用玩法+投注紀錄 */
    getMethodList: ApiFn('game/getMethodList'),
    /** 被封鎖停押的玩法 */
    blockadeMethod: ApiFn('game/blockadeMethod'),
    /** 信用玩法+投注紀錄 */
    getAPPUrl: 'api/v1/app/version',
    /** 返點拉吧索引 */
    floatPrize: ApiFn('game/floatPrize'),
    /** 讀取我的最愛 */
    getMyFavorites: ApiFn('game/getMyFavorites'),
    /** 設定我的最愛 */
    setMyFavorites: ApiFn('game/setMyFavorites'),
    /** 意見回饋 */
    sendComment: ApiFn('game/sendComment'),
    /** 名人榜榜單 */
    getLeaderBoard: ApiFn('game/getLeaderBoard'),
    /** 所有獎期 */
    nextFewIssues: ApiFn('game/nextFewIssues'),
    /** 熱門彩種清單 */
    getPopularGroupEntries: ApiFn('game/popularGroupEntries/get')
}

export const Storage = {
    /** 玩法介紹緩存 */
    // playInfoList: 'playInfoList',
    playInfoListNew: 'playInfoListNew',
    StampStorage: 'StampStorage',
    // saleTimeList: 'saleTimeList',
    /** 彩種列表緩存 */
    lotteryList: 'lotteryList',
    lotteryList2: 'lotteryList2',
    lotteryListOfficial: 'lotteryListOfficial',
    lotteryListSin: 'lotteryListSin',
    lotteryListVideo: 'lotteryListVideo',
    /** 多國語言 */
    locale: 'locale',
    // 新多語
    i18nMessages: 'i18nMessages',
    /** 彩種資料 */
    gameConfig: 'gameConfig',
    /** 彩種遊戲視頻預設是否開啟 */
    iframeIsShow: 'iframeIsShow',
    // 桌面-音效設定
    tableSoundConfig: 'tableSoundConfig',
    // 桌面-硬幣種類
    coinIndex: 'coinIndex',
    // 分享注單文字
    shareText: 'shareText'
}
