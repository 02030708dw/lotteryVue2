import { API } from '@API'
import {
    handleAjax,
    gameSumbitBox,
    formatTimer,
    formatHours,
    warnMessageBox,
    warnMessageBox2,
    // utc8,
    // b64EncodeUnicode,
    // today,
    returnState
} from '@UTIL'
import {
    handlePrizeData,
    betDoneDialog,
    setGameConfigData,
    handleStopBetNumber,
    handleJsDynamicConfig
} from './functions'
import i18n from '@/lang/lang'
const $t = i18n.t.bind(i18n)
const keyObj = {
    '1D': 'thai_011',
    '2D': 'thai_010',
    '3D': 'thai_009'
}
// let globalLocalTime = 0
// let globalNowTime = 0
// let countNum = 0
let setTimeoutFloatPrize
// let historyOrderTimer
let isFetching = false
export default {
    [_M.SET_TH_TEMP_DATA]({ commit }, payload) {
        commit(_M.SET_TH_TEMP_DATA, payload)
    },
    /**
     * 投注冷卻時間
     * @param {object} that vue obj
     */
    async [_M.GET_FLIP_TIMEER_TH]({ dispatch, commit, state, rootGetters }, that) {
        if (!state.TH_flipTimer.isCountDown) {
            return
        }
        const jsDynamicConfig = state.TH_jsDynamicConfig
        if (jsDynamicConfig && jsDynamicConfig.result !== '2003') {
            const { redressTime, nowstoptime } = state.TH_flipTimer
            const nowLocalTime = +new Date()
            let countNum = state.TH_flipTimer.countNum + 1
            let nowtime = state.TH_flipTimer.nowtime + (nowLocalTime - state.TH_flipTimer.nowLocalTime)
            if (countNum % redressTime === 0) {
                commit(_M.SET_FLIP_TIMEER_TH_DATA, { isCountDown: false })
                const correctionTime = await handleAjax(API.time, {}, rootGetters, { isNotShowMessageBox: true })
                if (correctionTime) {
                    nowtime = correctionTime.serverTime + (nowLocalTime - correctionTime.now)
                    countNum = 0
                } else {
                    countNum = 30
                }
                commit(_M.SET_FLIP_TIMEER_TH_DATA, { isCountDown: true })
            }
            // const coldTime = Math.round((nowstoptime - nowtime) / 1000, 0)
            let coldTime = Math.ceil((nowstoptime - nowtime + 1100) / 1000)

            if (coldTime <= 0) {
                if (state.TH_flipTimer.isLoading) {
                    return
                }
                commit(_M.SET_FLIP_TIMEER_TH_DATA, {
                    isLoading: true,
                    coldTime: 0,
                    hours: '000',
                    minutes: '00',
                    seconds: '00'
                })
                dispatch(_M.GET_GAME_JS_DYNAMIC_CONFIG_TH, that)
            }

            // const week = formatDate((timeDiff / 3600 / 24 / 7) % 24)
            // const day = formatDate(timeDiff / 3600 / 24)
            const hours = formatHours(coldTime / 3600)
            const minutes = formatTimer((coldTime / 60) % 60)
            const seconds = formatTimer(coldTime % 60)
            commit(_M.SET_FLIP_TIMEER_TH_DATA, {
                coldTime,
                nowtime,
                nowLocalTime,
                hours,
                minutes,
                seconds,
                countNum
            })
        } else {
            commit(_M.SET_FLIP_TIMEER_TH_DATA, {
                coldTime: 0,
                hours: '000',
                minutes: '00',
                seconds: '00'
            })
        }
    },
    /**
     * 取得遊戲總資料
     * @param {any} { state, commit, dispatch }
     * @param {any} lotteryId 彩種 ID
     */
    async [_M.GET_GAME_PLAY_TH_DATA]({ state, commit, dispatch, rootGetters }, payload) {
        // console.log('開始讀取遊戲資料', +new Date() - startTime)
        const { lotteryId, subGameName, isLoadHistory } = payload
        commit(_M.SET_TEMP_DATA, { temp: 'TH_isLoading', data: true })
        commit(_M.SET_FLIP_TIMEER_TH_DATA, {
            coldTime: 0,
            isLoading: false,
            isNew: [true, true, true, true, true, true, true],
            hours: '000',
            minutes: '00',
            seconds: '00',
            countNum: 0,
            muti: []
        })
        // const { menuId, name } = rootGetters.lotteryList2[lotteryId] || {}
        let params = { lotteryId }
        // if ([2, 5].includes(menuId)) {
        //     params.issueCount = 100
        // } else if (menuId === 4) {
        //     params.issueCount = 50
        //     if (name === 'K3_SB') {
        //         params.issueCount = 20
        //     }
        // }
        const fetchArr = [
            // 獎金組控賠
            API.floatPrize,
            // 遊戲選單資料/玩法說明
            API.gameConfig,
            // 獎期資料
            API.jsDynamicConfig
        ].map(api => Promise.resolve(handleAjax(api, params, rootGetters)))
        fetchArr.push(Promise.resolve(handleStopBetNumber({menuType: 6}, { state, commit, dispatch, rootGetters })))
        const [floatPrize, gameConfig, jsDynamicConfig] = await Promise.all(fetchArr)
        // 網址列採種ID錯誤
        if (!gameConfig) {
            try {
                // go to the first available lottery
                const lotteryId = Object.values(rootGetters.lotteryList2)[6].lottery
                window.location.replace('/GamePlayerTH/' + lotteryId)
            } catch (err) {
                //redirect to '/'
                window.location.replace('/')
            }
            return
        }
        // console.log('遊戲資料讀取完畢', +new Date() - startTime)
        handlePrizeData(floatPrize, state, commit)
        if (gameConfig) {
            const { data } = setGameConfigData({
                config: gameConfig.data,
                jsPrizePoint: state.TH_floatPrize.jsPrizePoint
            })
            const gameTypeName = data.gameConfigData.gameTypeCn
            let gameType = data.gameConfigData.gameType
            let onePrice = gameConfig.data.stake
            if (rootGetters.isAIA && +lotteryId === 242) {
                onePrice = 5
                data.stake = 5
            }
            commit(_M.SET_SUBMIT_TH_DATA, {
                gameTypeName,
                gameType,
                onePrice,
                modes: gameConfig.data.base,
                lotteryId
            })
            commit(_M.SET_GAME_PLAY_TH_DATA, data)
            // 預設全選 method
            let TH_gameSubMenu = {}
            rootGetters.TH_gameSubMenu.forEach(({methodId}) => (TH_gameSubMenu[methodId] = true))
            commit(_M.SET_TH_TEMP_DATA, {
                temp: 'TH_methodSelect',
                data: TH_gameSubMenu
            })
        }
        handleJsDynamicConfig(jsDynamicConfig, params, { commit, rootGetters, dispatch })
        // 彈窗顯示不能投的號碼
        dispatch(_M.FILTER_NUMBER_TH)
        // if (isLoadHistory) {
        //     dispatch(_M.CLEAR_HISTORY_ORDER_TIMER)
        //     historyOrderTimer = setTimeout(() => {
        //         dispatch(_M.GET_HISTORY_ORDER)
        //     }, 2000)
        // }
        //載入投注資料及追號資料
    },
    /**
     * 官方彩種延遲抓號機制
     * @param {any} { commit, dispatch }
     */
    /**
     * 取得遊戲獎期/追號等資料
     * @param {object} that vue obj
     */
    async [_M.GET_GAME_JS_DYNAMIC_CONFIG_TH]({ state, commit, dispatch, rootGetters, rootState }, that) {
        const lotteryId = rootGetters.TH_lotteryId
        let params = { lotteryId }
        const jsDynamicConfig = await handleAjax(API.jsDynamicConfig, params, rootGetters)
        if (jsDynamicConfig) {
            if (jsDynamicConfig.data.number !== rootGetters.TH_jsDynamicConfig.number && rootState.route.name.includes('GamePlayerTH')) {
                that.$root.$emit('updateTipGamePlay')
                // that.$root.$emit('updateBonus')
            }
            handleJsDynamicConfig(jsDynamicConfig, params, { commit, rootGetters, dispatch })
            // 獎期結束兩秒後刷新控賠更新
            setTimeoutFloatPrize = setTimeout(async () => {
                const floatPrize = await handleAjax(API.floatPrize, params, rootGetters)
                handlePrizeData(floatPrize, state, commit)
                // 更新號碼箱內的獎金
                let data = {}
                rootGetters.TH_gameSelectDataArr.forEach((item) => {
                    const { methodId, codes } = item
                    const key = `${methodId}_${codes}`
                    const {hprize, autoOdds} = rootGetters.TH_jsPrizePoint[methodId][0]
                    if (!rootGetters.TH_stop[methodId]) {
                        data[key] = { ...item, hprize: (hprize + autoOdds).strip() }
                    }
                    commit(_M.SET_TH_TEMP_DATA, {
                        temp: 'TH_gameSelectData',
                        data
                    })
                })
            }, 2000)
            // 獎期結束後刷新超過封鎖直的玩法資料
            commit(_M.SET_TH_TEMP_DATA, {
                temp: 'TH_over',
                data: []
            })
            commit(_M.SET_TH_TEMP_DATA, {
                temp: 'TH_prizeChange',
                data: {}
            })
            // dispatch(_M.CLEAR_HISTORY_ORDER_TIMER)
            // historyOrderTimer = setTimeout(() => {
            //     dispatch(_M.GET_HISTORY_ORDER)
            //     dispatch(_M.GET_WALLET_BALANCE, true)
            // }, 5000)
        }
    },
    async [_M.GET_GAME_JS_DYNAMIC_CONFIG_FOR_OFFICAL_TH]({ state, commit, rootGetters }) {
        const lotteryId = rootGetters.TH_lotteryId
        // const { menuId, name } = rootGetters.lotteryList2[lotteryId] || {}
        let params = { lotteryId }
        // if ([2, 5].includes(menuId)) {
        //     params.issueCount = 100
        // } else if (menuId === 4) {
        //     params.issueCount = 50
        //     if (name === 'K3_SB') {
        //         params.issueCount = 20
        //     }
        // }
        handleStopBetNumber({menuType: 6}, { state, commit, rootGetters })
        rootGetters.TH_jsDynamicConfig.number &&
            handleAjax(API.correctionTime, params, rootGetters, { isNotShowMessageBox: true })
                .then(({data}) => {
                    const notYetUpdated = rootGetters.TH_jsDynamicConfig.lastnumber !== data.lastnumber
                    if (notYetUpdated) {
                        const jsDynamicConfig = {
                            data: {
                                ...returnState(rootGetters.TH_jsDynamicConfig),
                                ...data
                            }
                        }
                        commit(_M.SET_GAME_PLAY_DYNAMIC_TH_DATA, jsDynamicConfig)
                    }
                }).catch(() => null)
    },
    [_M.FILTER_NUMBER_TH]({ state, dispatch, rootGetters }, payload) {
        const showMethodName = (methodId) => {
            const { title_key, parent } = rootGetters.TH_gameSubMenuObj[methodId]
            return `${i18n.t(keyObj[parent.toUpperCase()])}-${i18n.t(title_key)}`
        }
        payload = payload || state.TH_stopNumber
        const numberData = Object.entries(payload)
        let content = ''
        numberData.forEach(([key, numbers]) => {
            const [, , method] = key.split('.')
            content += `<div>[${showMethodName(method)}]</div><div>`
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
    },
    async [_M.GAME_ORDER_TH_SUBMIT]({ state, commit, dispatch, rootGetters }, payload) {
        //需判斷有無獎期
        if (+state.TH_jsDynamicConfig.result !== 0) {
            dispatch(_M.SET_MESSAGE_BOX_DATA, warnMessageBox({
                // 尚未开放奖期
                message: 'common_118'
            }))
            return
        }
        const arr = rootGetters.TH_gameSelectDataArr
        const getHprize = (id) => {
            if (rootGetters.TH_jsPrizePoint) {
                const { hprize, autoOdds } = rootGetters.TH_jsPrizePoint[id][0]
                return (hprize + autoOdds).strip()
            } else {
                return ''
            }
        }
        // 超过投注限额
        const overLimit = arr.find(({money, methodId}) => money * getHprize(methodId) > rootGetters.TH_bonus_limit)

        if (overLimit) {
            const { title_key, parent } = rootGetters.TH_gameSubMenuObj[overLimit.methodId]
            const key = `${$t(keyObj[parent.toUpperCase()])}-${$t(title_key)}`
            dispatch(_M.SET_MESSAGE_BOX_DATA, warnMessageBox({
                // 超过投注限制
                message: 'popup_035',
                // 您于【{0}】的投注金额已超过最高投注上限，请重新选择。
                content: $t('popup_074', { '0': key })
            }))
            return
        }
        // 需判斷號碼選擇有無完整
        // if (rootGetters.TH_gameSelectDataArr.length < 1) {
        //     dispatch(_M.SET_MESSAGE_BOX_DATA, warnMessageBox({
        //         // 号码选择不完整
        //         message: 'popup_002',
        //         // 号码选择不完整，请重新选择。
        //         content: 'popup_003'
        //     }))
        //     return
        // }
        const initialIssue = rootGetters.TH_lastnumber

        const submit = async (instance) => {
            // 投注中...
            instance.confirmDataText = 'popup_016'
            const ltProject = []
            arr.forEach((items) => {
                let project = {
                    ...items,
                    digitstr: '',
                    omodel: 2,
                    scode_key: items.codes,
                    mode: 1,
                    times: 1,
                    keepPoint: '0.000',
                    type: 'digital',
                    onePrice: items.money,
                    nums: 1,

                    issue: state.TH_jsDynamicConfig.number,
                    lotteryId: state.TH_gameSubmit.lotteryId
                }
                ltProject.push(project)
            })
            const params = {
                subject: 'intro',
                ...state.TH_gameSubmit,
                ltProjectNum: arr.length,
                ltMoneyAmout: rootGetters.TH_ltMoneyAmout,
                orderFuture: false,
                ltProject,
                timestemp: +new Date()
            }
            const res = await handleAjax(API.gameOrder, params, rootGetters)
            if (!res) {
                return -999
            }
            const errorCode = +res.result
            if (errorCode === 0) {
                // const search = {
                //     startDate: today(),
                //     endDate: today(),
                //     lotteryId: state.TH_gameSubmit.lotteryId,
                //     issue: res.params.ltIssueStart
                // }
                // const urlCode = b64EncodeUnicode(JSON.stringify(search))
                // const routerUrl = `/GameInfo/${urlCode}`
                const { availablebalance } = res.data
                availablebalance && commit(_M.SET_WALLET_BALANCE, availablebalance)
                commit(_M.SET_OFFSET_GET_BALANCE_NUM, 1)

                //部份追号超出限额或停售
                const stopNum = +res.data.TaskStopBet
                if (!!stopNum) {
                    dispatch(_M.SET_MESSAGE_BOX_DATA, warnMessageBox2({
                        // '部份追号超出限额或停售'
                        message: 'popup_102',
                        // '系统已为您取消已停售的{0}注追号内容。'
                        content: $t('popup_086', {0: stopNum})
                    }))
                }

                dispatch(_M.SET_MESSAGE_BOX_DATA, warnMessageBox(betDoneDialog(res, '', rootGetters)))
                // dispatch(_M.GET_HISTORY_ORDER)
                commit(_M.SET_TH_TEMP_DATA, {
                    temp: 'TH_gameSelectData',
                    data: {}
                })
                commit(_M.SET_TH_TEMP_DATA, {
                    temp: 'TH_over',
                    data: []
                })
                commit(_M.SET_TH_TEMP_DATA, {
                    temp: 'TH_prizeChange',
                    data: {}
                })
            } else if (errorCode === 8103) { //投注金额超过最大上限，无法完成投注
                const obj = returnState(state.TH_stopNumber)
                Object.entries(res.data.stop_bet_number).forEach(([key, numbers]) => {
                    numbers.forEach((number) => {
                        obj[key] ? obj[key].push(number) : (obj[key] = [number])
                    })
                })
                commit(_M.SET_TH_TEMP_DATA, {
                    temp: 'TH_stopNumber',
                    data: obj
                })
                dispatch(_M.FILTER_NUMBER_TH, res.data.stop_bet_number)
            } else if (errorCode === 9501) { //停售
                dispatch(_M.SET_MESSAGE_BOX_DATA, warnMessageBox({
                    // '玩法已停售'
                    message: 'popup_070',
                    // '系统已为您过滤停售玩法，请再次确认。'
                    content: 'popup_080',
                    isShowCloseIcon: false,
                    afterConfirm: () => {
                        const isNextIssue = initialIssue !== rootGetters.TH_lastnumber
                        if (isNextIssue) return
                        // 處理停售
                        const stopMethodIds = res.data.Stop
                        commit(_M.SET_TH_TEMP_DATA, {
                            temp: 'TH_stop',
                            data: [...state.TH_stop, ...stopMethodIds].unique()
                        })
                        // 過濾注單
                        let data = {}
                        rootGetters.TH_gameSelectDataArr.forEach((item) => {
                            const { methodId, codes } = item
                            const key = `${methodId}_${codes}`
                            !rootGetters.TH_stop[item.methodId] && (data[key] = item)
                        })
                        commit(_M.SET_TH_TEMP_DATA, {
                            temp: 'TH_gameSelectData',
                            data
                        })
                    }
                }))
            } else if (errorCode === 9502) { //超出停押值
                dispatch(_M.SET_MESSAGE_BOX_DATA, warnMessageBox({
                    // '超过投注限额'
                    message: 'popup_081',
                    // '<span class="text_color_strong">超过投注限额</span>，请重新确认投注内容。'
                    content: 'popup_097',
                    isShowCloseIcon: false,
                    afterConfirm: () => {
                        const isNextIssue = initialIssue !== rootGetters.TH_lastnumber
                        if (isNextIssue) return
                        // 設定超出限額
                        const overMethodIds = res.data.Over
                        commit(_M.SET_TH_TEMP_DATA, {
                            temp: 'TH_over',
                            data: overMethodIds
                        })
                    }
                }))
            } else if (errorCode === 9503) { //停售 & 超出停押值
                dispatch(_M.SET_MESSAGE_BOX_DATA, warnMessageBox({
                    // '玩法已停售且超过投注限额'
                    message: 'popup_083',
                    // '系统已为您过滤停售玩法。请重新确认<span class="text_color_strong">超过投注限额</span>的投注内容。'
                    content: 'popup_084',
                    isShowCloseIcon: false,
                    afterConfirm: () => {
                        const isNextIssue = initialIssue !== rootGetters.TH_lastnumber
                        if (isNextIssue) return
                        // 處理停售
                        const stopMethodIds = res.data.Stop
                        commit(_M.SET_TH_TEMP_DATA, {
                            temp: 'TH_stop',
                            data: [...state.TH_stop, ...stopMethodIds].unique()
                        })
                        // 過濾注單
                        let data = {}
                        rootGetters.TH_gameSelectDataArr.forEach((item) => {
                            const { methodId, codes } = item
                            const key = `${methodId}_${codes}`
                            !rootGetters.TH_stop[item.methodId] && (data[key] = item)
                        })
                        commit(_M.SET_TH_TEMP_DATA, {
                            temp: 'TH_gameSelectData',
                            data
                        })
                        const overMethodIds = res.data.Over
                        commit(_M.SET_TH_TEMP_DATA, {
                            temp: 'TH_over',
                            data: overMethodIds
                        })
                    }
                }))
            } else if (errorCode === 9504) { // 投注项投注用戶限額
                dispatch(_M.SET_MESSAGE_BOX_DATA, warnMessageBox({
                    // '超过投注限额'
                    message: res.message_key,
                    // '<span class="text_color_strong">超过投注限额</span>，请重新确认投注内容。'
                    content: 'popup_097',
                    isShowCloseIcon: false,
                    afterConfirm: () => {
                        const isNextIssue = initialIssue !== rootGetters.TH_lastnumber
                        if (isNextIssue) return
                        // 設定超出用戶獎金限額
                        const overMethodIds = res.data.OverBonus
                        commit(_M.SET_TH_TEMP_DATA, {
                            temp: 'TH_over',
                            data: overMethodIds
                        })
                    }
                }))
            } else if (errorCode === 9402) { // 賠率不同時更新處理
                //update all order item
                const floatPrize = await handleAjax(API.floatPrize, params, rootGetters)
                dispatch(_M.SET_MESSAGE_BOX_DATA, warnMessageBox({
                    message: res.message_key || res.message,
                    // '您的投注奖金已更新，请重新确认。'
                    content: 'popup_132',
                    isShowCloseIcon: false,
                    afterConfirm: () => {
                        const isNextIssue = initialIssue !== rootGetters.TH_lastnumber
                        if (isNextIssue || !floatPrize) return
                        const { jsPrizePoint } = floatPrize.data
                        let data = {}
                        Object
                            .entries(jsPrizePoint)
                            .forEach(([methodId, arr]) => {
                                const {hprize, autoOdds} = arr[0]
                                const {hprize: hprizeOld, autoOdds: autoOddsOld} = rootGetters.TH_jsPrizePoint[methodId][0]
                                data[methodId] = !(hprize === hprizeOld && autoOdds === autoOddsOld)
                            })
                        commit(_M.SET_TH_TEMP_DATA, {
                            temp: 'TH_prizeChange',
                            data
                        })
                        handlePrizeData(floatPrize, state, commit)
                        // 更新號碼箱內的獎金
                        let data2 = {}
                        rootGetters.TH_gameSelectDataArr.forEach((item) => {
                            const { methodId, codes } = item
                            const key = `${methodId}_${codes}`
                            const {hprize, autoOdds} = rootGetters.TH_jsPrizePoint[methodId][0]
                            if (!rootGetters.TH_stop[methodId]) {
                                data2[key] = { ...item, hprize: (hprize + autoOdds).strip() }
                            }
                        })
                        commit(_M.SET_TH_TEMP_DATA, {
                            temp: 'TH_gameSelectData',
                            data: data2
                        })
                    }
                }))
            }
            return errorCode
        }
        const skipDialog = rootGetters.RWDMode === 3
        if (skipDialog) {
            if (isFetching) {
                return
            }
            isFetching = true
            const errorCode = await submit(payload)
            isFetching = false
            return errorCode
        } else {
            //跳彈窗
            dispatch(_M.SET_MESSAGE_BOX_DATA, gameSumbitBox({
                beforeConfirm: async instance => {
                    if (isFetching) {
                        return
                    }
                    isFetching = true
                    instance.isShowLocalCancelBtn = false
                    instance.isShowLocalCloseIcon = false
                    await submit(instance)
                    isFetching = false
                }
            }))
        }
    }
}
