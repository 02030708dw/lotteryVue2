
export default {
    flipTimer: {
        /** 獎期結束時間 */
        nowstoptime: null,
        /** 現在時間 */
        nowtime: null,
        /** 剩下時間 */
        coldTime: 0,
        hours: '00',
        minutes: '00',
        seconds: '00',
        /** 是否更換獎期中 */
        isLoading: false,
        /** 是否新的階段 */
        isNew: [true, true, true, true, true, true],
        /** 秒數次數 */
        isCountDown: true,
        /** 秒數次數 */
        countNum: 0,
        /** 每更新幾次秒數校正時間 */
        redressTime: 1000,
        /** 多久更新時間 (ms) */
        updateTime: 1000
    },
    gamePlayData: {},
    jsDynamicConfig: {},
    gameConfig: {
    },
    game: {
        /** 是否載入中 */
        isLoading: true,
        /** lazyLoad 选球区 */
        isBallsLoading: false,
        /** 玩法選單 key */
        menuIndex: 0,
        /** 子玩法 key */
        gameIndex: 0,
        /** 子子玩法 key */
        gameSubIndex: 0,
        /** ssc.qiansan.zhixuan.fushi */
        fullTypeName: '',
        /** 注單編輯中 index */
        isEditIndex: -1,
        /** 注單細節窗打開否 index */
        isDetailIndex: -1,
        /** 是否顯示追號 */
        isShowOrderFuture: false,
        /** 追號類型 */
        orderFutureType: '0',
        /** 追號期數 */
        orderFutureNum: 10,
        /** 追號倍數 */
        orderFutureMultiple: 1,
        /** 追號間隔 */
        orderFutureOffset: 2,
        /** 追號間隔倍數 */
        orderFutureOffsetMultiple: 2,
        /** 追號預期盈利率 */
        orderFuturePreWinRate: 10,
        /** 大小全雙單 按鈕 */
        ballControlData: [],
        /** 大小全雙單 按鈕 暫存 */
        ballControlEmptyData: [],
        /** 原始選球 暫存 */
        gameBallEmptyData: [],
        /** 投注倍數限制 */
        betMultiLimit: Infinity,
        /** 追號倍數限制 */
        FutureMultiLimit: Infinity,
        /** 投注項中超出倍數限制的玩法名 */
        exceededMethod: ''
    },
    gameOrder: {
        /** 彩種 */
        digitstr: '',
        /** digital | input | dxds */
        type: '',
        /** 遊戲子玩法名稱 */
        methodName: '',
        /** qiansan.zhixuan.fushi */
        parentName: '',
        /** qiansan */
        childName: '',
        /** 多語name key */
        parentNameKey: '',
        childNameKey: '',
        /** zhixuan.fushi */
        typeName: '',
        /** 彩種 */
        methodId: 0,
        /** 高獎金高返點 */
        omodel: 2,
        /** 原始選球 */
        gameBallData: [],
        /** 所有選球組合 */
        gameBallCombine: [],
        /** 注單暫存箱/單注多單 */
        ltProjectTemp: [],
        /** 元角分厘 */
        mode: 1,
        /** 金額 */
        money: 0,
        /** 倍數 */
        times: 1,
        /** 不用加密 */
        codes: '',
        /** 顯示看 */
        showCodes: '',
        /** 單式顯示看 */
        showDanshiCodes: '',
        /** 單價 */
        onePrice: 2,
        /** 注數 */
        nums: 0,
        /** 盈利 */
        bonus: 0,
        /** checkbox */
        activeCheckboxes: {}
    },
    gameSubmit: {
        /** 彩種 ID */
        lotteryId: 56,
        /** 彩種名稱 */
        gameType: '',
        /** 投注注單 */
        ltProject: [],
        /** 购买的总注数 (Number) */
        ltProjectNum: 0,
        /** 投注总金额 (Number) */
        ltMoneyAmout: 0,
        /** 购买的起始期 (String) */
        ltIssueStart: '',
        /** 是否追號 */
        orderFuture: false,
        /** 追号/陣列 (array({issue, multiple})) */
        orderFutureIssue: [],
        /** 中奖是否停止 (boolean) */
        orderFutureBingoStop: true,
        /** 追号总金额 (boolean) */
        orderFutureMoneyAmount: 0
    },
    /** 投注選單 */
    gameLtProject: [],
    /** 信用玩法投注選單 */
    creditGameLtProject: {},
    /**
     * 暫存已經添加過的注單讓重複項判斷時可以優先取用
     */
    gameBoxTemp: {},
    /**
     * 0: 選球
     * 1: 小助手
     * 2: 投注項
     */
    gameShowMode: 0,
    /** 320 遊戲選單是否顯示 */
    gameMenuActive: false,
    /* 被封鎖停押的玩法 */
    blockedMethods: [],
    /* 超出封鎖值的玩法 */
    overLimitMethods: {},
    /* 超出用戶限額的玩法 */
    bonusOverLimitMethods: {},
    /** 返點% */
    keepPoint: 7.8,
    /** 賠率是否更新 */
    diffPrizeData: {},
    floatPrize: {},
    // 信用投注視窗是否允許刪除注單
    sinSubmitBoxCanCancel: true,
    // 玩法頁籤選項-父
    parentTabIndex: undefined,
    // 玩法頁籤選項-子
    tabIndex: undefined,
    // 快速玩法
    isFast: false,
    // 殺對子
    killPairEnabled: false,
    // 是否有路紙
    hasGameScore: false,
    // 番攤經典-橡皮擦模式
    isEraser: false,
    // 番攤-路紙顯示開關
    isScoreShow: false,
    // 桌面玩法說明
    gameTablePlayInfoList: {},
    // 投注額外選項-包组,包胆
    gameOption: {}
}
