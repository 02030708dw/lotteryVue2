// import { defaultFlipTimer } from './functions'

export default {
    TH_flipTimer: {
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
    TH_jsDynamicConfig: {},
    TH_floatPrize: {},
    TH_lastNumber: '',
    TH_lastIssue: '',
    TH_area: {},
    TH_gamePlayData: {},
    /** 玩法選單 key */
    TH_menuIndex: 0,
    /** 是否載入中 */
    TH_isLoading: false,
    TH_gameType: 'Old',
    TH_gameSubmit: {
        /** 顯示用 */
        /** 投注总金额 (Number) */
        ltMoneyAmout: 0
    },
    TH_methodSelect: {},
    TH_gameSelectData: {},
    TH_money: '',
    TH_stop: [],
    TH_stopNumber: [],
    TH_over: [],
    TH_prizeChange: {}
}
