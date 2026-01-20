import { API } from '@API'
import {
    handleAjax,
    gameSumbitBox,
    formatTimer,
    warnMessageBox,
    utc8
} from '@UTIL'
import {
    submitOrder,
    getIsFocusArea,
    defaultFlipTimer,
    fetchStopBetNumber
} from './functions'
import i18n from '@/lang/lang'
const $t = i18n.t.bind(i18n)
let globalLocalTime = 0
let globalNowTime = 0
let countNum = 0
let isFetching = false
let isFirstColdDown = true

export default {
    [_M.SET_VN_TEMP_DATA]({ commit }, payload) {
        commit(_M.SET_VN_TEMP_DATA, payload)
    },
    /**
     * 投注冷卻時間
     * @param {any} { dispatch, commit, state }
     */
    [_M.RESET_GAME_VN]({ commit, dispatch }) {
        dispatch(_M.GAME_ORDER_VN_SUBMIT, { type: 5 })
        dispatch(_M.GAME_ORDER_VN_SUBMIT, { type: 8 })
        dispatch(_M.SET_GAME_VN_DATA, {
            VN_subMenuIndex: 0,
            VN_menuIndex: 0,
            lotteryId: 0
        })
        commit(_M.SET_FLIP_TIMEER_VN_DATA, {
            VN_S: { ...defaultFlipTimer }, // VN_S
            VN_C: { ...defaultFlipTimer }, // VN_C
            VN_N: { ...defaultFlipTimer } // VN_N
        })
        commit(_M.SET_COLD_DOWN_VN_DATA, {
            VN_S: false,
            VN_C: false,
            VN_N: false
        })
    },
    /**
     * 投注冷卻時間
     * @param {any} { dispatch, commit, state }
     */
    [_M.GET_FLIP_TIMEER_VN]({ dispatch, commit, state, rootGetters }) {
        const nowLocalTime = +utc8()
        const redressTime = 90
        let data = []
        let nowtime = globalNowTime + nowLocalTime - globalLocalTime
        rootGetters.lotteryVN.forEach((area) => {
            const flipTimer = state.VN_flipTimer[area]
            const config = state.VN_jsDynamicConfig[area]
            if (config) {
                let coldTime = Math.ceil((config.sale_end - nowtime + 1100) / 1000)
                if (coldTime <= 0) {
                    const isFocusArea = getIsFocusArea(rootGetters, area)
                    flipTimer.isCountDown && dispatch(_M.GET_COLD_DOWN_VN_DATA, isFocusArea)
                    data[area] = { isCountDown: false }
                    return
                }
                const hours = formatTimer(~~(coldTime / 3600))
                const minutes = formatTimer((coldTime / 60) % 60)
                const seconds = formatTimer(coldTime % 60)
                data[area] = {
                    isCountDown: true,
                    coldTime,
                    hours,
                    minutes,
                    seconds
                }
            } else {
                data[area] = { isCountDown: false }
            }
        })
        commit(_M.SET_FLIP_TIMEER_VN_DATA, data)
        globalNowTime = nowtime
        globalLocalTime = nowLocalTime
        countNum++
        if (countNum % redressTime === 0) {
            handleAjax(API.time, {}, rootGetters, { isNotShowMessageBox: true })
                .then(({ nowTime }) => {
                    globalNowTime = nowTime
                    countNum = 0
                })
                .catch(() => (countNum = redressTime - 10))
        }
    },
    /**
     * 設定越南彩資料
     * @param {any} { state, commit }
     */
    [_M.SET_GAME_VN_DATA]({ commit }, payload) {
        commit(_M.SET_GAME_VN_DATA, payload)
    },
    /**
     * 設定越南彩獎期
     * @param {any} { state, commit }
     * @param {Object} payload 是否更新獎期
     */
    [_M.GET_COLD_DOWN_VN_DATA]({ commit, rootGetters, dispatch }, payload) {
        const param = { menuType: 3, issueCount: 1 }
        const options = { isPromise: true }
        const fetchCountdownConfig = () => {
            const nowLocalTime = +utc8()
            let tempData = {
                VN_S: false,
                VN_C: false,
                VN_N: false
            }
            handleAjax(API.countdownConfig, param, rootGetters, options)
                .then((data) => {
                    const errorCode = +data.result
                    if (errorCode === 0) {
                        const { countdownData, nowTime, stop_bet } = data.data
                        countdownData.forEach(({ function_type, issueDate, lotteryId }) => {
                            tempData[function_type] = {
                                function_type,
                                ...issueDate[0],
                                lotteryId
                            }
                        })
                        globalNowTime = nowTime
                        globalLocalTime = nowLocalTime
                        countNum = 0
                        // payload && dispatch(_M.SET_MESSAGE_BOX_DATA, warnMessageBox({
                        //     type: '',
                        //     zIndex: 2002,
                        //     // '当期奖期结束'
                        //     message: 'popup_024',
                        //     // '当期奖期已结束，请注意奖期变化'
                        //     content: 'popup_025',
                        //     confirmText: `${$t('popup_004')} 3`,
                        //     beforeMount: instance => instance.$root.$emit('filterOverIssueCity'),
                        //     coldTime: 3
                        // }))
                        payload && rootGetters.getVue().$root.$emit('updateTipGamePlay')

                        // tempData.VN_S.sale_end = tempData.VN_S.sale_start
                        // tempData.VN_N.sale_end = +new Date(tempData.VN_S.nowtime) + 25000
                        // tempData.VN_C.sale_end = +new Date(tempData.VN_S.nowtime) + 35000
                        commit(_M.SET_COLD_DOWN_VN_DATA, tempData)
                        commit(_M.SET_STOP_VN_DATA, stop_bet)
                        if (isFirstColdDown) {
                            isFirstColdDown = false
                            rootGetters.getVue().$root.$emit('stopBet')
                        }
                        rootGetters.VN_isLocal && dispatch(_M.GET_GAME_LASTNUMBER_VN)
                    } else if (errorCode === 2003) {
                        //沒有獎期
                    }
                })
                .catch(() => setTimeout(fetchCountdownConfig, 5000))
        }
        const fetchAreaIssue = () => {
            handleAjax(API.areaIssue, param, rootGetters, options)
                .then(({ data }) => commit(_M.SET_VN_AREA_DATA, data))
                .catch(() => setTimeout(fetchAreaIssue, 5000))
        }
        fetchCountdownConfig()
        fetchAreaIssue()
        fetchStopBetNumber({ commit, rootGetters })
    },
    [_M.SET_GAME_LASTNUMBER_VN]({ commit }, payload) {
        commit(_M.SET_GAME_LASTNUMBER_VN, payload)
    },
    [_M.SET_GAME_LASTNUMBER_VN_V2]({ commit }, payload) {
        commit(_M.SET_GAME_LASTNUMBER_VN_V2, payload)
    },
    /**
     * 取得越南彩最新號碼
     * @param {any} { state, commit }
     * @param {Object} payload fatch 參數
     */
    [_M.GET_GAME_LASTNUMBER_VN]({ commit, rootGetters }) {
        const options = { isPromise: true }
        const {
            VN_lastIssue = '',
            VN_currentlottery,
            VN_jsDynamicConfig
        } = rootGetters
        const jsDynamicConfig = VN_jsDynamicConfig[VN_currentlottery.name]
        const { issue = '' } = jsDynamicConfig || {}
        const diff = issue[issue.length - 1] - VN_lastIssue[VN_lastIssue.length - 1]
        if (!issue || diff === 1 || diff === -9) {
            return
        }
        let retry = 5
        const fetchlastNumber = () => {
            const { name: menuCode, lottery: lotteryId } = VN_currentlottery
            console.log({ menuCode, lotteryId }, rootGetters, options);
            handleAjax(API.vnLatestDrawV2, { menuCode, lotteryId }, rootGetters, options)
                .then(({ data }) => {
                    const obj = data[menuCode]

                    commit(_M.SET_GAME_LASTNUMBER_VN_V2, obj)
                })
            handleAjax(API.vnLatestDraw, { menuCode, lotteryId }, rootGetters, options)
                .then(({ data }) => {
                    const { code: lastNumber, issue: lastIssue } = data[menuCode]
                    const obj = { lastNumber, lastIssue }
                    // 沒獎期間隔2秒就更新
                    const diff = issue[issue.length - 1] - lastIssue[lastIssue.length - 1]
                    const isNew = diff === 1 || diff === -9
                    if (isNew || !retry) {
                        retry = 5
                        commit(_M.SET_GAME_LASTNUMBER_VN, obj)
                    } else {
                        --retry
                        setTimeout(fetchlastNumber, 2000)
                    }
                })
                .catch(() => setTimeout(fetchlastNumber, 5000))
        }
        fetchlastNumber()
    },
    /**
     * 設定越南彩遊戲資料
     * @param {any} { state, commit }
     * @param {Object} payload fatch 參數
     */
    [_M.GET_GAME_CONFIG_VN_DATA]({ commit, rootGetters }, payload = { menuType: 3 }) {
        const options = { isPromise: true }
        const fetchGameConfigNF = () => {
            handleAjax(API.gameConfigNF, payload, rootGetters, options)
                .then(({ data: { vnBlockedMethod, ...data } }) => {
                    commit(_M.SET_GAME_CONFIG_VN_DATA, data)
                    commit(_M.SET_BLOCKED_VN_DATA, vnBlockedMethod)
                    rootGetters.getVue().$root.$emit('blocked')
                })
                .catch(() => setTimeout(fetchGameConfigNF, 5000))
        }
        fetchGameConfigNF()
    },
    /**
     * 號碼區總金額
     * @param {any} { state, commit }
     * @param {Number} payload 金額
     */
    [_M.SET_GAME_AREA_VN_MONEY]({ commit }, payload) {
        commit(_M.SET_GAME_AREA_VN_MONEY, payload)
    },
    /**
     * 投注資料處理
     * @param {any} { commit }
     * @param {Object} payload 投注資料
     */
    [_M.GAME_ORDER_VN_SUBMIT]({ commit }, payload) {
        commit(_M.GAME_ORDER_VN_SUBMIT, payload)
    },
    /**
     * 980經典版確認投注彈窗功能
     * @param {any} { state, commit }
     */
    [_M.GAME_ORDER_VN_SUBMIT_BOX](context, payload) {
        const { state, dispatch, commit, getters } = context
        dispatch(_M.SET_MESSAGE_BOX_DATA, gameSumbitBox({
            fast: !!payload,
            beforeConfirm: async (instance) => {
                if (isFetching) {
                    return
                }
                isFetching = true
                instance.isShowLocalCancelBtn = false
                instance.isShowLocalCloseIcon = false
                // 投注中...
                instance.confirmDataText = 'popup_016'
                const errorCode = await submitOrder[state.VN_game.VN_gameType](context, payload ? state.VN_gameOrder : state.VN_gameSubmit, payload)
                isFetching = false
                if (errorCode === 0) {
                    getters.VN_isOld
                        ? instance.$root.$emit('reset')
                        : instance.$root.$emit('reset', { times: '' })
                    getters.VN_isOld && dispatch(_M.GAME_ORDER_VN_SUBMIT, { type: 5 })
                        ; (!payload || getters.VN_isOld) && dispatch(_M.GAME_ORDER_VN_SUBMIT, { type: 1, showList: [] })
                }
            },
            afterClose() {
                commit(_M.SET_STOP_AND_OVER_VN_DATA, []) // 清空暫存封鎖停押資料
            },
            afterCancel() {
                commit(_M.SET_STOP_AND_OVER_VN_DATA, []) // 清空暫存封鎖停押資料
            }
        }))
    },
    /**
     * 320經典版投注
     * @param {string} payload //gameOrder or gameSubmit
     */
    async [_M.MOBILE_GAME_ORDER_VN_SUBMIT_BOX](context, payload) {
        if (isFetching) {
            return
        }
        isFetching = true
        const fast = context.getters.VN_gameType === 'Old'
            ? payload === 'gameOrder'
            : payload === 'gameOrder'

        const { state } = context
        const errorCode = await submitOrder[state.VN_game.VN_gameType](context, context.state[`VN_${payload}`], fast)
        isFetching = false
        return errorCode
    },
    /**
     * 彈窗內容移除功能
     * @param {any} { state, commit }
     * @param {Object} payload 項目及是否快速投注
     */
    [_M.GAME_ORDER_VN_SUBMIT_REMOVE]({ commit }, payload) {
        const { index, isFast = true } = payload
        const type = isFast ? 2 : 4
        commit(_M.GAME_ORDER_VN_SUBMIT, {
            type,
            index
        })
    },
    /**
     * 封鎖停押暫存資料儲存用
     * @param {any} { commit }
     * @param {Array} payload 封鎖停押暫存資料儲存用
     */
    [_M.SET_STOP_AND_OVER_VN_DATA]({ commit }, payload) {
        commit(_M.SET_STOP_AND_OVER_VN_DATA, payload)
    },
    [_M.FILTER_NUMBER_VN]({ state, dispatch, rootGetters }, payload) {
        const keyObj = {
            '2d': '2D',
            '3d': '3D',
            '4d': '4D',
            pl2: 'PL2',
            pl3: 'PL3',
            teshu: 'vn_t_007', //特殊
            tou: 'vn_t_018', //头,
            wei: 'vn_t_019', //尾
            touwei: 'vn_t_020', //头尾
            baozu: 'vn_t_021', //包组
            baozu7: 'vn_t_022' //包组7
        }
        payload = payload || state.VN_stopNumber
        const numberData = Object.entries(payload)
        let content = ''
        numberData.forEach(([key, numbers]) => {
            const [cityId, issue, , methodName, subMethodName] = key.split('.')
            const cityName = $t(rootGetters.lotteryList2[cityId].title_key)
            const name = $t(keyObj[methodName])
            const subName = $t(keyObj[subMethodName])
            content += `<div>[${cityName}-${issue}-${name}-${subName}]</div><div>`
            numbers.forEach((number, i) => {
                content += `${number}`
                if (i !== numbers.length - 1) {
                    (content += `, `)
                }
            })
            content += `</div>`
        })
        numberData.length && dispatch(_M.SET_MESSAGE_BOX_DATA, warnMessageBox({
            // '此玩法本期已停售。'
            message: i18n.t('Bet_001_0006'),
            type: 'warning',
            dangerouslyUseHTMLString: true,
            content
        }))
    }
}
