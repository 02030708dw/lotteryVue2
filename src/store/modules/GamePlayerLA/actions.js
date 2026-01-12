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
    handleJsDynamicConfig
} from './functions'
import i18n from '@/lang/lang'
const $t = i18n.t.bind(i18n)
// let globalLocalTime = 0
// let globalNowTime = 0
// let countNum = 0
let setTimeoutFloatPrize
// let historyOrderTimer
let isFetching = false
export default {
    [_M.SET_LA_TEMP_DATA]({ commit }, payload) {
        commit(_M.SET_LA_TEMP_DATA, payload)
    },
    /**
     * 投注冷卻時間
     * @param {object} that vue obj
     */
    async [_M.GET_FLIP_TIMEER_LA]({ dispatch, commit, state, rootGetters }, that) {
        if (!state.LA_flipTimer.isCountDown) {
            return
        }
        const jsDynamicConfig = state.LA_jsDynamicConfig
        if (jsDynamicConfig && jsDynamicConfig.result !== '2003') {
            const { redressTime, nowstoptime } = state.LA_flipTimer
            const nowLocalTime = +new Date()
            let countNum = state.LA_flipTimer.countNum + 1
            let nowtime = state.LA_flipTimer.nowtime + (nowLocalTime - state.LA_flipTimer.nowLocalTime)
            if (countNum % redressTime === 0) {
                commit(_M.SET_FLIP_TIMEER_LA_DATA, { isCountDown: false })
                const correctionTime = await handleAjax(API.time, {}, rootGetters, { isNotShowMessageBox: true })
                if (correctionTime) {
                    nowtime = correctionTime.serverTime + (nowLocalTime - correctionTime.now)
                    countNum = 0
                } else {
                    countNum = 30
                }
                commit(_M.SET_FLIP_TIMEER_LA_DATA, { isCountDown: true })
            }
            // const coldTime = Math.round((nowstoptime - nowtime) / 1000, 0)
            let coldTime = Math.ceil((nowstoptime - nowtime + 1100) / 1000)

            if (coldTime <= 0) {
                if (state.LA_flipTimer.isLoading) {
                    return
                }
                commit(_M.SET_FLIP_TIMEER_LA_DATA, {
                    isLoading: true,
                    coldTime: 0,
                    hours: '000',
                    minutes: '00',
                    seconds: '00'
                })
                dispatch(_M.GET_GAME_JS_DYNAMIC_CONFIG_LA, that)
            }

            // const week = formatDate((timeDiff / 3600 / 24 / 7) % 24)
            // const day = formatDate(timeDiff / 3600 / 24)
            const hours = formatHours(coldTime / 3600)
            const minutes = formatTimer((coldTime / 60) % 60)
            const seconds = formatTimer(coldTime % 60)
            commit(_M.SET_FLIP_TIMEER_LA_DATA, {
                coldTime,
                nowtime,
                nowLocalTime,
                hours,
                minutes,
                seconds,
                countNum
            })
        } else {
            commit(_M.SET_FLIP_TIMEER_LA_DATA, {
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
    async [_M.GET_GAME_PLAY_LA_DATA]({ state, commit, dispatch, rootGetters }, payload) {
        // console.log('開始讀取遊戲資料', +new Date() - startTime)
        const { lotteryId, subGameName, isLoadHistory } = payload
        commit(_M.SET_TEMP_DATA, { temp: 'LA_isLoading', data: true })
        commit(_M.SET_FLIP_TIMEER_LA_DATA, {
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
        const [floatPrize, gameConfig, jsDynamicConfig] = await Promise.all(fetchArr)
        // 網址列採種ID錯誤
        if (!gameConfig) {
            try {
                // go to the first available lottery
                // const lotteryId = Object.values(rootGetters.lotteryList2)[9].lottery
                // window.location.replace('/GamePlayerLA/' + lotteryId)
                window.location.replace('/')
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
                jsPrizePoint: state.LA_floatPrize.jsPrizePoint
            })
            const gameTypeName = data.gameConfigData.gameTypeCn
            let gameType = data.gameConfigData.gameType
            commit(_M.SET_SUBMIT_LA_DATA, {
                gameTypeName,
                gameType,
                onePrice: gameConfig.data.stake,
                modes: gameConfig.data.base,
                lotteryId
            })
            commit(_M.SET_GAME_PLAY_LA_DATA, data)
            // 預設全選 method
            let LA_gameSubMenu = {}
            const item = rootGetters.LA_gameSubMenu[0]
            LA_gameSubMenu[item.methodId] = true
            // rootGetters.LA_gameSubMenu.forEach(({methodId}) => (LA_gameSubMenu[methodId] = true))
            commit(_M.SET_LA_TEMP_DATA, {
                temp: 'LA_methodSelect',
                data: LA_gameSubMenu
            })
            let arykey = []
            Object.values(rootGetters.LA_gameSubMenuObj).forEach((subMethod) => {
                const {methoddesc_key, methodexample_key} = subMethod.faceparamter
                arykey.push(methoddesc_key, methodexample_key)
            })
            dispatch(_M.GET_TRANS, {
                lang: rootGetters.lang,
                arykey
            })
        }
        handleJsDynamicConfig(jsDynamicConfig, params, { commit, rootGetters, dispatch })
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
    async [_M.GET_GAME_JS_DYNAMIC_CONFIG_LA]({ state, commit, dispatch, rootGetters, rootState }, that) {
        const lotteryId = rootGetters.LA_lotteryId
        let params = { lotteryId }
        const jsDynamicConfig = await handleAjax(API.jsDynamicConfig, params, rootGetters)
        if (jsDynamicConfig) {
            if (jsDynamicConfig.data.number !== rootGetters.LA_jsDynamicConfig.number && rootState.route.name.includes('GamePlayerLA')) {
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
                rootGetters.LA_gameOrderArr.forEach((item) => {
                    const { methodId, codes } = item
                    const key = `${methodId}_${codes}`
                    const {hprize, autoOdds} = rootGetters.LA_jsPrizePoint[methodId][0]
                    if (!rootGetters.LA_stop[methodId]) {
                        data[key] = { ...item, hprize: (hprize + autoOdds).strip() }
                    }
                    commit(_M.SET_LA_TEMP_DATA, {
                        temp: 'LA_gameOrder',
                        data
                    })
                })
            }, 2000)
            // 獎期結束後刷新超過封鎖直的玩法資料
            commit(_M.SET_LA_TEMP_DATA, {
                temp: 'LA_over',
                data: []
            })
            commit(_M.SET_LA_TEMP_DATA, {
                temp: 'LA_prizeChange',
                data: {}
            })
            // dispatch(_M.CLEAR_HISTORY_ORDER_TIMER)
            // historyOrderTimer = setTimeout(() => {
            //     dispatch(_M.GET_HISTORY_ORDER)
            //     dispatch(_M.GET_WALLET_BALANCE, true)
            // }, 5000)
        }
    },
    async [_M.GET_GAME_JS_DYNAMIC_CONFIG_FOR_OFFICAL_LA]({ state, commit, rootGetters }) {
        const lotteryId = rootGetters.LA_lotteryId
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
        rootGetters.LA_jsDynamicConfig.number &&
            handleAjax(API.correctionTime, params, rootGetters, { isNotShowMessageBox: true })
                .then(({data}) => {
                    const notYetUpdated = rootGetters.LA_jsDynamicConfig.lastnumber !== data.lastnumber
                    if (notYetUpdated) {
                        const jsDynamicConfig = {
                            data: {
                                ...returnState(rootGetters.LA_jsDynamicConfig),
                                ...data
                            }
                        }
                        commit(_M.SET_GAME_PLAY_DYNAMIC_LA_DATA, jsDynamicConfig)
                    }
                }).catch(() => null)
    },
    async [_M.GAME_ORDER_LA_SUBMIT]({ state, commit, dispatch, rootGetters }, payload = {}) {
        const { instance, fast } = payload
        //需判斷有無獎期
        if (+state.LA_jsDynamicConfig.result !== 0) {
            dispatch(_M.SET_MESSAGE_BOX_DATA, warnMessageBox({
                // 尚未开放奖期
                message: 'common_118'
            }))
            return
        }
        const arr = fast ? rootGetters.LA_gameSelectDataArr : rootGetters.LA_gameOrderArr
        const getHprize = (id) => {
            if (rootGetters.LA_jsPrizePoint) {
                const { hprize, autoOdds } = rootGetters.LA_jsPrizePoint[id][0]
                return (hprize + autoOdds).strip()
            } else {
                return ''
            }
        }
        // 超过投注限额
        const overLimit = arr.find(({money, methodId}) => money * getHprize(methodId) > rootGetters.LA_bonus_limit)
        const keyObj = {
            '1D': 'thai_011',
            '2D': 'thai_010',
            '3D': 'thai_009'
        }
        if (overLimit) {
            const { title_key, parent } = rootGetters.LA_gameSubMenuObj[overLimit.methodId]
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
        // if (rootGetters.LA_gameSelectDataArr.length < 1) {
        //     dispatch(_M.SET_MESSAGE_BOX_DATA, warnMessageBox({
        //         // 号码选择不完整
        //         message: 'popup_002',
        //         // 号码选择不完整，请重新选择。
        //         content: 'popup_003'
        //     }))
        //     return
        // }
        const initialIssue = rootGetters.LA_lastnumber

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
                    issue: state.LA_jsDynamicConfig.number,
                    lotteryId: state.LA_gameSubmit.lotteryId
                }
                ltProject.push(project)
            })
            const params = {
                subject: 'intro',
                ...state.LA_gameSubmit,
                ltProjectNum: arr.length,
                ltMoneyAmout: fast ? rootGetters.LA_gameSelectDataMoney : rootGetters.LA_gameOrderMoney,
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
                //     lotteryId: state.LA_gameSubmit.lotteryId,
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
                commit(_M.SET_LA_TEMP_DATA, {
                    temp: 'LA_gameSelectData',
                    data: {}
                })
                !fast && commit(_M.SET_LA_TEMP_DATA, {
                    temp: 'LA_gameOrder',
                    data: {}
                })
                commit(_M.SET_LA_TEMP_DATA, {
                    temp: 'LA_over',
                    data: []
                })
                commit(_M.SET_LA_TEMP_DATA, {
                    temp: 'LA_prizeChange',
                    data: {}
                })
                instance.$root.$emit('reset')
            } else if (errorCode === 9501) { //停售
                dispatch(_M.SET_MESSAGE_BOX_DATA, warnMessageBox({
                    // '玩法已停售'
                    message: 'popup_070',
                    // '系统已为您过滤停售玩法，请再次确认。'
                    content: 'popup_080',
                    isShowCloseIcon: false,
                    afterConfirm: () => {
                        const isNextIssue = initialIssue !== rootGetters.LA_lastnumber
                        if (isNextIssue) return
                        // 處理停售
                        const stopMethodIds = res.data.Stop
                        commit(_M.SET_LA_TEMP_DATA, {
                            temp: 'LA_stop',
                            data: [...state.LA_stop, ...stopMethodIds].unique()
                        })
                        // 過濾注單
                        let data = {}
                        rootGetters.LA_gameOrderArr.forEach((item) => {
                            const { methodId, codes } = item
                            const key = `${methodId}_${codes}`
                            !rootGetters.LA_stop[item.methodId] && (data[key] = item)
                        })
                        commit(_M.SET_LA_TEMP_DATA, {
                            temp: 'LA_gameOrder',
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
                        const isNextIssue = initialIssue !== rootGetters.LA_lastnumber
                        if (isNextIssue) return
                        // 設定超出限額
                        const overMethodIds = res.data.Over
                        commit(_M.SET_LA_TEMP_DATA, {
                            temp: 'LA_over',
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
                        const isNextIssue = initialIssue !== rootGetters.LA_lastnumber
                        if (isNextIssue) return
                        // 處理停售
                        const stopMethodIds = res.data.Stop
                        commit(_M.SET_LA_TEMP_DATA, {
                            temp: 'LA_stop',
                            data: [...state.LA_stop, ...stopMethodIds].unique()
                        })
                        // 過濾注單
                        let data = {}
                        rootGetters.LA_gameOrderArr.forEach((item) => {
                            const { methodId, codes } = item
                            const key = `${methodId}_${codes}`
                            !rootGetters.LA_stop[item.methodId] && (data[key] = item)
                        })
                        commit(_M.SET_LA_TEMP_DATA, {
                            temp: 'LA_gameOrder',
                            data
                        })
                        const overMethodIds = res.data.Over
                        commit(_M.SET_LA_TEMP_DATA, {
                            temp: 'LA_over',
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
                        const isNextIssue = initialIssue !== rootGetters.LA_lastnumber
                        if (isNextIssue) return
                        // 設定超出用戶獎金限額
                        const overMethodIds = res.data.OverBonus
                        commit(_M.SET_LA_TEMP_DATA, {
                            temp: 'LA_over',
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
                        const isNextIssue = initialIssue !== rootGetters.LA_lastnumber
                        if (isNextIssue || !floatPrize) return
                        const { jsPrizePoint } = floatPrize.data
                        let data = {}
                        Object
                            .entries(jsPrizePoint)
                            .forEach(([methodId, arr]) => {
                                const {hprize, autoOdds} = arr[0]
                                const {hprize: hprizeOld, autoOdds: autoOddsOld} = rootGetters.LA_jsPrizePoint[methodId][0]
                                data[methodId] = !(hprize === hprizeOld && autoOdds === autoOddsOld)
                            })
                        commit(_M.SET_LA_TEMP_DATA, {
                            temp: 'LA_prizeChange',
                            data
                        })
                        handlePrizeData(floatPrize, state, commit)
                        // 更新號碼箱內的獎金
                        let data2 = {}
                        rootGetters.LA_gameOrderArr.forEach((item) => {
                            const { methodId, codes } = item
                            const key = `${methodId}_${codes}`
                            const {hprize, autoOdds} = rootGetters.LA_jsPrizePoint[methodId][0]
                            if (!rootGetters.LA_stop[methodId]) {
                                data2[key] = { ...item, hprize: (hprize + autoOdds).strip() }
                            }
                        })
                        commit(_M.SET_LA_TEMP_DATA, {
                            temp: 'LA_gameOrder',
                            data: data2
                        })
                        // 更新選球區內的獎金

                        let data3 = {}
                        rootGetters.LA_gameSelectDataArr.forEach((item) => {
                            const { methodId, codes } = item
                            const key = `${methodId}_${codes}`
                            const {hprize, autoOdds} = rootGetters.LA_jsPrizePoint[methodId][0]
                            if (!rootGetters.LA_stop[methodId]) {
                                data3[key] = { ...item, hprize: (hprize + autoOdds).strip() }
                            }
                        })
                        commit(_M.SET_LA_TEMP_DATA, {
                            temp: 'LA_gameSelectData',
                            data: data3
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
            const errorCode = await submit(instance)
            isFetching = false
            return errorCode
        } else {
            //跳彈窗
            dispatch(_M.SET_MESSAGE_BOX_DATA, gameSumbitBox({
                fast,
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
