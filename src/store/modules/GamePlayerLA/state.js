// import { defaultFlipTimer } from './functions'

export default {
    LA_flipTimer: {
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
    LA_jsDynamicConfig: {},
    LA_floatPrize: {},
    LA_lastNumber: '',
    LA_lastIssue: '',
    LA_area: {},
    LA_gamePlayData: {},
    /** 玩法選單 key */
    LA_menuIndex: 0,
    /** 是否載入中 */
    LA_isLoading: false,
    LA_gameType: 'Old',
    LA_gameSubmit: {
        /** 顯示用 */
        /** 投注总金额 (Number) */
        ltMoneyAmout: 0
    },
    LA_methodSelect: {},
    LA_gameSelectData: {},
    LA_gameOrder: {},
    LA_money: '',
    LA_stop: [],
    LA_over: [],
    LA_prizeChange: {}
}
