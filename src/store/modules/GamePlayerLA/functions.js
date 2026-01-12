import { API } from '@API'
import { handleAjax, returnState, warnMessageBox } from '@UTIL'
import i18n from '@/lang/lang'
import state from './state'

/**餘額計算
 * @param {*}
 */
export const getMoney = ({mode, nums, onePrice, times}) => parseFloat((mode * nums * onePrice * times).toFixed(2))
/**
 * 取得目前的 彩種 ID
 * @param {any} state Global Store
 */
export const nowLotteryId = state => state.gameSubmit.lotteryId
/**
 * 判斷是否有獎期
 * @param {any} state Global Store
 */
export const isJsDynamicConfig = (state) => {
    const jsDynamicConfig = state.jsDynamicConfig[nowLotteryId(state)]
    if (jsDynamicConfig && jsDynamicConfig.result !== '2003') {
        return true
    }
    return false
}
let checkJsTimer
/**
 * @param {Object} jsDynamicConfig 獎期資料
 * @param {Number} lotteryId 彩種 ID
 * @param {Object} params 參數
 * @param {Object} rootGetters store
 * @param {function} commit 改變狀態資料
 * @param {num} num 重試次數
 */
export const reCheckJsDynamicConfig = (jsDynamicConfig, params, num, {rootGetters, commit, dispatch}) => {
    // 官彩不 reCheckJsDynamic 因為都會差距兩期
    const currentGame = rootGetters.lotteryList2[rootGetters.LA_lotteryId]
    if (num < 0 || (currentGame && !+currentGame.is_local)) {
        return
    }
    try {
        const { number, lastnumber } = jsDynamicConfig.data
        const diff = number[number.length - 1] - lastnumber[lastnumber.length - 1]
        if (diff !== 1 && diff !== -9) {
            checkJsTimer = setTimeout(async () => {
                jsDynamicConfig = await handleAjax(API.correctionTime, params, rootGetters)
                jsDynamicConfig && reCheckJsDynamicConfig(jsDynamicConfig, params, --num, {rootGetters, commit, dispatch})
            }, 2000)
        } else {
            const config = {
                data: {
                    ...returnState(rootGetters.LA_jsDynamicConfig),
                    ...jsDynamicConfig.data
                }
            }
            commit(_M.SET_GAME_PLAY_DYNAMIC_LA_DATA, config)
        }
    } catch (err) {

    }
}
export const handlePrizeData = (floatPrize, state, commit) => {
    if (floatPrize) {
        const { prizeBar, stopBet, jsPrizePoint, keepPoint } = floatPrize.data
        const data = Object.values(stopBet || {})
        // console.log('封鎖')
        commit(_M.SET_LA_TEMP_DATA, {
            temp: 'LA_stop',
            data
        })
        commit(_M.SET_LA_FLOAT_PRIZE, { prizeBar, keepPoint, jsPrizePoint })
    }
}
/**
 * 判斷是否有獎期
 * @param {any} state Global Store
 */
export const handleJsDynamicConfig = (jsDynamicConfig, params, {commit, rootGetters, dispatch}) => {
    const nowLocalTime = +new Date()

    let ltIssueStart = false
    let timeData = {
        nowstoptime: null,
        nowLocalTime,
        nowtime: null,
        isLoading: false,
        countNum: 0,
        isNew: [true, true, true, true, true, true, true]
    }
    if (jsDynamicConfig) {
        timeData = {
            nowstoptime: +new Date(jsDynamicConfig.data.nowstoptime),
            nowLocalTime,
            nowtime: +new Date(jsDynamicConfig.data.nowtime) + (nowLocalTime - jsDynamicConfig.now),
            isLoading: false,
            countNum: 0,
            isNew: [true, true, true, true, true, true, true]
        }
        ltIssueStart = jsDynamicConfig.data.number
    }
    commit(_M.SET_SUBMIT_LA_DATA, { ltIssueStart })
    commit(_M.SET_FLIP_TIMEER_LA_DATA, timeData)
    commit(_M.SET_GAME_PLAY_DYNAMIC_LA_DATA, jsDynamicConfig)
    jsDynamicConfig && reCheckJsDynamicConfig(jsDynamicConfig, params, 3, {rootGetters, commit, dispatch})
    return jsDynamicConfig
}
/**
 * 盈利率追號計算
 * @param {Object} temp 上期計算資料
 * @param {number} multiple 上期倍數
 * @param {number} sumMoney 追號總額加總
 * @param {number} prize 玩法獎金
 * @param {number} length 注單數
 */
export const orderFuturePreWinRateCalc = (temp, multiple, sumMoney, money, orderFuturePreWinRate, prize, length) => {
    let multiples = temp.multiple ? temp.multiple : multiple
    let bouns = multiples * prize * length
    let needMoney = multiples * money
    let sumMoney2 = (needMoney + sumMoney)
    let preMoney = bouns - sumMoney2
    let prePercent = preMoney / sumMoney2 * 100
    while (prePercent < orderFuturePreWinRate && multiples < 10000) {
        multiples++
        bouns = multiples * prize * length
        needMoney = multiples * money
        sumMoney2 = (needMoney + sumMoney)
        preMoney = bouns - sumMoney2
        prePercent = preMoney / sumMoney2 * 100
    }
    if (!temp.multiple && multiple !== multiples) {
        multiples = 10000
    }
    return {
        bouns,
        preMoney,
        prePercent,
        multiples,
        needMoney
    }
}

// getHprizeIndex
export const getHprizeIndex = (getters) => {
    const splitArr = ['|', '&']
    let hprizeIndex
    const gname = getters.game.fullTypeName.replace(/\./g, '_')
    const configArr = getters.gameConfig[gname.includes('K3') ? gname : gname.toLowerCase()] || []
    if (!configArr.hprize) return 0
    let splitKey = splitArr.find((item) => getters.gameOrder.codes.includes(item))
    const gameOrderArr = getters.gameOrder.codes.split(splitKey)
    gameOrderArr.forEach((item) => {
        let filterItem
        splitKey = splitArr.find((key) => item.includes(key))
        // 龍虎專用
        if (splitKey) {
            let resultIndex
            item.split(splitKey).forEach((subItem) => {
                const subItemFilter = (configArr.hprize || []).filter((config) => config.indexOf(subItem) > -1)
                const minIndex = (configArr.hprize || []).indexOf(subItemFilter[0])
                if ((minIndex > -1 && resultIndex === undefined) || minIndex > -1 && minIndex < resultIndex) {
                    resultIndex = minIndex
                }
            })
            filterItem = [configArr.hprize[resultIndex]]
        } else {
            filterItem = (configArr.hprize || []).filter((configItem) => {
                return configItem.indexOf(item) > -1 && !!item
            })
        }
        const matchIndex = (configArr.hprize || []).indexOf(filterItem[0])
        if (matchIndex > -1 && hprizeIndex === undefined) {
            hprizeIndex = matchIndex
        } else if (matchIndex > -1 && matchIndex < hprizeIndex) {
            hprizeIndex = matchIndex
        }
    })
    return hprizeIndex || 0
}

export const betDoneDialog = (res, routerUrl, rootGetters) => {
    const msgWithParm = res.message_param
        ? i18n.t(res.message_key, res.message_param.map(param => i18n.t(param)))
        : i18n.t(res.message_key)

    // 找出這次投注所有的獎期
    let issueArr = res.params.ltProject.map((oneProject) => oneProject.issue || res.params.ltIssueStart)
    issueArr = issueArr.unique().sort()

    // 組成功訊息
    let message = issueArr.join('，<br/>')
    // 第{0}期
    message = `${i18n.t('common_001', {'0': message})} ${msgWithParm}`

    return {
        message,
        zIndex: 2001,
        // 您的回馈，是我们持续进步的动力。
        content: 'popup_130',
        // 继续投注
        confirmText: 'popup_021',
        isShowCancelBtn: true,
        // 游戏回馈
        cancelText: 'popup_124',
        beforeCancel: (instance) => {
            instance.$root.$emit('reset320Times')
            setTimeout(() => {
                instance.$store.dispatch(_M.SET_MESSAGE_BOX_DATA, warnMessageBox({
                    // '游戏回馈'
                    zIndex: 2007,
                    beforeConfirm: async (feedbackMsgBox) => {
                        const params = {
                            title: feedbackMsgBox.formTitle,
                            content: feedbackMsgBox.formContent,
                            url: feedbackMsgBox.$route.fullPath
                        }
                        const res = await handleAjax(API.sendComment, params, rootGetters)
                        if (!+res.result) {
                            feedbackMsgBox.$store.dispatch(_M.SET_MESSAGE_BOX_DATA, warnMessageBox({
                            // '感谢您的回馈'
                                message: 'popup_128',
                                zIndex: 2002,
                                type: 'success',
                                confirmText: `${i18n.t('popup_004')} 2`,
                                coldTime: 2
                            }))
                        }
                        feedbackMsgBox.$root.$emit('reset320Times')
                        feedbackMsgBox.reset()
                    }
                }))
            }, 100)
        },
        beforeConfirm: (instance) => {
            instance.$root.$emit('reset320Times')
        },
        beforeClose: (instance) => instance.$root.$emit('reset320Times'),
        type: 'success'
    }
}
/**
 * 設定遊戲config 資料
 * @param {Object} config 遊戲config 資料
 * @param {Boolean} notCount 不記順序
 * @param {Boolean} notLoad 是否第一次載入遊戲資料
 */
export const setGameConfigData = ({jsPrizePoint, config, newBlockeds}) => {
    // console.log('111', newBlockeds)
    let data = {}
    let diffPrizeData = {}
    data.gameConfigData = returnState(config.gameConfigData)
    data.bonus_limit = config.bonus_limit
    data.stake = config.stake
    data.gameConfigData.defaultMethod = data.gameConfigData.defaultMethod.replace(/\./g, '_')
    let allIsBlocked = true
    // let menu = []
    // let submenu = {}
    data.gameConfigData.gameMethods.forEach((game) => {
        let counting = 0
        let allChildIsBlocked = true
        let cache = {}
        // 信用玩法
        game.childs.forEach((method) => {
            method.childs.forEach((child) => {
                counting += 1
                child.sortId = counting
                child.methodId = child.methodId.split('-')[0]
                //玩法停押
                const isBlocked = checkIsBlocked(child.methodId, child.title) || checkIsBlocked(child.methodId, child.upperName)
                child.isBlocked = isBlocked

                if (newBlockeds) {
                    if (child.upperName === '一肖中') {
                        // console.log(newBlockeds[child.methodId + '_' + child.upperName])
                    }
                    const isNewBlocked = newBlockeds[child.methodId + '_' + child.title] || newBlockeds[child.methodId + '_' + child.upperName]
                    if (isNewBlocked) {
                        diffPrizeData[child.methodId + child.title] = true
                        diffPrizeData[child.methodId + child.upperName] = true
                    }
                }

                if (allChildIsBlocked && !child.isBlocked) {
                    allChildIsBlocked = false
                    allIsBlocked = false
                }
                if (jsPrizePoint && config.jsPrizePoint) {
                    const prizePoint = jsPrizePoint[child.methodId][child.title]
                    const oldPrizePoint = config.jsPrizePoint[child.methodId][child.title]
                    try {
                        if (!((prizePoint.autoOdds === oldPrizePoint.autoOdds) && (prizePoint.hprize === oldPrizePoint.hprize) && (prizePoint.prize === oldPrizePoint.prize))) {
                            diffPrizeData[child.methodId + child.title] = prizePoint
                        }
                    } catch (err) {
                        if (!cache[child.methodId] && !prizePoint) {
                            cache[child.methodId] = true
                            try {
                                if (['shaibao', 'yuxiaxie'].includes(child.mode)) {
                                    const newPrize = Object.entries(jsPrizePoint[child.methodId])
                                    const oldPrize = config.jsPrizePoint[child.methodId]
                                    newPrize.forEach(([key, prizePoint]) => {
                                        const oldPrizePoint = oldPrize[key]
                                        if (!((prizePoint.autoOdds === oldPrizePoint.autoOdds) && (prizePoint.hprize === oldPrizePoint.hprize) && (prizePoint.prize === oldPrizePoint.prize))) {
                                            diffPrizeData[child.methodId + key] = prizePoint
                                        }
                                    })
                                }
                            } catch (err) {
                                console.error('test', jsPrizePoint[child.methodId])
                            }
                        }
                    }
                }
            })
        })
        // 官方玩法
        data.jsPrizePoint = jsPrizePoint || config.jsPrizePoint
        game.allChildIsBlocked = allChildIsBlocked
    })
    // console.log(menu)
    // console.log(submenu)
    data.gameConfigData.allIsBlocked = allIsBlocked
    return { data, diffPrizeData }
}

/**
 * 檢查玩法是否停押
 * @param  {String|Number} methodId
 * @param  {String} title
 * @return
 */
export const checkIsBlocked = (methodId, title) => {
    try {
        const key = `${methodId}_${title}`
        return state.blockedMethods[key]
    } catch (err) {
        return false
    }
}

/**
 * 封鎖停押依後端回傳的停押玩法ID更新state.blockedMethods
 * @param  {Object} data res.data.Stop
 * @param  {Object} context {state, commit, dispatch}
 */
export const updateBlockedMethods = (Stop, {state, commit, rootGetters, getters, dispatch}) => {
    const toObj = (arr) => {
        const obj = {}
        arr.forEach((v) => (obj[v] = true))
        return obj
    }
    const newBlockeds = toObj(Stop)
    const updatedBlockedMethods = {...state.blockedMethods, ...newBlockeds}
    commit(_M.SET_BLOCKED_MELAODS, updatedBlockedMethods)
    const { data } = setGameConfigData({
        config: rootGetters.currentGamePlayData,
        newBlockeds
    })
    commit(_M.SET_GAME_PLAY_DATA, {[rootGetters.gameLotteryId]: data})
    dispatch(_M.SET_FLOAT_PRIZE_AND_BLOCKED_MELAODS, newBlockeds)
}

// /**
//  * 過濾被停押的玩法
//  * @param  {String} title
//  * @return
//  */
// export const Methods = ()Methods = (methodId, title) => {
//     const key = `${methodId}_${title}`
//     return state.blockedMethods[key]
// }

/**
 * 翻譯後端彈窗訊息內參數key
 * @param  {Object} paramArr message_param
 * @return {Object} transArr
 */
export const Methods = (paramArr) => {
    return paramArr.map((param) => {
        return i18n.t(param)
    })
}