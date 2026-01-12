// import { defaultFlipTimer } from './functions'

export default {
    MY_flipTimer: {
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
    MY_jsDynamicConfig: {},
    MY_floatPrize: {},
    MY_lastNumber: '',
    MY_lastIssue: '',
    MY_area: {},
    MY_gamePlayData: {},
    /** 玩法選單 key */
    MY_menuIndex: 0,
    /** 是否載入中 */
    MY_isLoading: false,
    MY_gameType: 'Old',
    MY_gameSubmit: {
        /** 顯示用 */
        /** 投注总金额 (Number) */
        ltMoneyAmout: 0
    },
    MY_methodSelect: {},
    MY_gameSelectData: {},
    MY_gameOrder: {},
    MY_money: '',
    MY_stop: [],
    MY_over: [],
    MY_prizeChange: {}
}
