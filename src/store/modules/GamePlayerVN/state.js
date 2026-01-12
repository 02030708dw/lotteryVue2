// import { defaultFlipTimer } from './functions'

export default {
    VN_flipTimer: {},
    VN_jsDynamicConfig: {},
    VN_lastNumber: '',
    VN_lastIssue: '',
    VN_area: {},
    VN_gameConfig: {},
    VN_game: {
        /** 是否載入中 */
        VN_isLoading: false,
        /** 玩法選單 key */
        VN_menuIndex: 0,
        lotteryId: 0,
        /** 子玩法 key */
        VN_subMenuIndex: 0,
        /** 注單細節窗打開否 index */
        isDetailIndex: -1,
        /** 投注倍數限制 */
        betMultiLimit: Infinity,
        VN_gameType: 'Old'
    },
    VN_gameAreaMoney: 0,
    VN_gameSubmit: {
        /** 顯示用 */
        showList: [],
        /** 投注总金额 (Number) */
        ltMoneyAmout: 0
    },
    VN_gameOrder: {
        /** 顯示用 */
        showList: [],
        /** 投注总金额 (Number) */
        ltMoneyAmout: 0,
        /** row計數 */
        orderRowNum: 0,
        /** 單式球版 1倍 */
        times: '',
        /** 單式球版元角分 */
        mode: 1
    },
    VN_gameMenu: [
        {
            // '全区'
            key: 'all',
            title_key: 'vn_t_001'
        },
        {
            // '南部'
            key: 'VN_S',
            title_key: 'vn_t_002'
        },
        {
            // '中部'
            key: 'VN_C',
            title_key: 'vn_t_003'
        },
        {
            // '北部'
            key: 'VN_N',
            title_key: 'vn_t_004'
        }
    ],
    VN_week: [
        'vn_t_016', // 日
        'vn_t_010', // 一
        'vn_t_011', // 二
        'vn_t_012', // 三
        'vn_t_013', // 四
        'vn_t_014', // 五
        'vn_t_015' // 六
    ],
    VN_stop: [],
    VN_stopNumber: [],
    VN_stopAndOver: [],
    VN_blocked: []
}
