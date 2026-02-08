import { API } from '@API'
import { handleAjax, warnMessageBox, returnState } from '@UTIL'
import i18n from '@/lang/lang'

const Input = async ({ commit, dispatch, rootGetters }, orderData, payload) => {
    let ltProject = []
    const { ltProjectNum, ltMoneyAmout, showList } = orderData
    showList.forEach(({methodId, codes, scode_key, onePrice, times, issue, money, mode, tNums}) => {
        const obj = {
            methodId,
            codes,
            scode_key,
            onePrice,
            times,
            issue,
            mode,
            type: 'input',
            digitstr: '',
            nums: tNums,
            money
        }
        rootGetters.VN_isLocal && (obj.issue = rootGetters.VN_localIssue)
        ltProject.push(obj)
    })
    const params = {
        ltIssueStart: false, //依後端要求帶false
        ltProject,
        ltProjectNum,
        ltMoneyAmout,
        timestemp: +new Date(),
        orderFuture: false
    }
    rootGetters.VN_isLocal && (params.lotteryId = rootGetters.VN_isLocal)
    const res = await handleAjax(API.gameOrder, params, rootGetters)
    commit(_M.SET_STOP_AND_OVER_VN_DATA) // 清空封鎖停押資料
    let errorCode = -999
    if (res) {
        errorCode = +res.result
        if (errorCode === 0) {
            const { availablebalance } = res.data

            availablebalance && commit(_M.SET_WALLET_BALANCE, availablebalance)
            // 越南彩只有自主彩,顯示獎期
            const message = !!rootGetters.VN_isLocal
                ? `${i18n.t('common_001', {'0': res.params.ltProject[0].issue})} ${i18n.t(res.message_key)}`
                : res.message_key

            dispatch(_M.SET_MESSAGE_BOX_DATA, {
                show: true,
                zIndex: 2001,
                // 第{0}期 投注成功
                message,
                // message: res.message_key,
                // 您的回馈，是我们持续进步的动力。
                content: 'popup_130',
                // 继续投注
                confirmText: 'popup_021',
                type: 'success',
                // 游戏回馈
                isShowCancelBtn: true,
                cancelText: 'popup_124',
                beforeCancel: (instance) => {
                /*
                rootGetters.isIos
                    ? intance.$router.push(routerUrl)
                    : window.open(routerUrl, '_blank')
                */
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
                                        // '确定'
                                        confirmText: `${i18n.t('popup_004')} 2`,
                                        coldTime: 2
                                    }))
                                    // feedbackMsgBox.$root.$emit('reset320Times')
                                }
                                feedbackMsgBox.reset()
                            }
                        }))
                    }, 100)
                }
            })
        // 封鎖停押
        } else if (errorCode === 8103) { //投注金额超过最大上限，无法完成投注
            const obj = returnState(rootGetters.VN_stopNumber)
            Object.entries(res.data.stop_bet_number).forEach(([key, numbers]) => {
                numbers.forEach((number) => {
                    obj[key] ? obj[key].push(number) : (obj[key] = [number])
                })
            })
            commit(_M.SET_VN_TEMP_DATA, {
                temp: 'VN_stopNumber',
                data: obj
            })
            dispatch(_M.FILTER_NUMBER_VN, res.data.stop_bet_number)
        } else if ([9501, 9502, 9503].includes(errorCode)) {
            const { Over = [], Stop } = res.data
            Stop && commit(_M.SET_STOP_VN_DATA, Stop)
            ;[9502, 9503].includes(errorCode) && commit(_M.SET_STOP_AND_OVER_VN_DATA, [...rootGetters.VN_stop, ...Over].unique())
            dispatch(_M.SET_MESSAGE_BOX_DATA, {
                fast: !!payload,
                isFilter: true,
                show: true,
                zIndex: 2003,
                errorCode,
                type: 'warning',
                beforeConfirm: () => {
                    rootGetters.RWDMode === 1 && dispatch(_M.GAME_ORDER_VN_SUBMIT_BOX, payload)
                }
            })
        } else if (errorCode === 9504) {
            dispatch(_M.SET_MESSAGE_BOX_DATA, warnMessageBox({
                // '超过投注限额'
                message: res.message_key,
                // '<span class="text_color_strong">超过投注限额</span>，请重新确认投注内容。'
                content: 'popup_097',
                isShowCloseIcon: false
                // afterConfirm: () => {
                //     const overMethodIds = res.data.OverBonus
                //     const arr = rootGetters.gameLtProject.map((item) => {
                //         const isOver = overMethodIds.includes(item.methodId)
                //         const _item = {...item, isOver}
                //         return _item
                //     })
                //     commit(_M.SET_GAME_LT_PROJECT, {type: 4, data: arr})
                // }
            }))
        // 玩法開關
        } else if (errorCode === 9009 || errorCode === 9010) {
            commit(_M.SET_BLOCKED_VN_DATA, res.data.vnBlockedMethod)
            dispatch(_M.SET_MESSAGE_BOX_DATA, {
                fast: !!payload,
                isFilter: true,
                show: true,
                zIndex: 2005,
                type: 'warning',
                beforeConfirm: () => {
                    rootGetters.RWDMode === 1 && dispatch(_M.GAME_ORDER_VN_SUBMIT_BOX, payload)
                }
            })
        }
    }
    return errorCode
}

export const submitOrder = {
    Old: async ({ commit, dispatch, rootGetters }, orderData, payload) => {
        let ltProject = []
        const { order, showList, ltMoneyAmout } = orderData
        let ltProjectNum = 0
        showList.forEach(({key, codes, id: rowId, orderId, scode_key, ...data}) => {
            const obj = {
                pid: rowId,
                ...data,
                codes: codes.filter ? codes.filter(c => c).join('&') : codes,
                scode_key: scode_key.filter ? scode_key.filter(c => c).join('&') : scode_key,
                times: 1,
                omodel: 1,
                mode: 1,
                type: 'digital',
                digitstr: ''
            }
            rootGetters.VN_isLocal && (obj.issue = rootGetters.VN_localIssue)
            ltProject.push(obj)
            ltProjectNum += order[rowId][orderId].nums
        })
        const params = {
            ltIssueStart: false, //依後端要求帶false
            ltProject,
            ltProjectNum,
            ltMoneyAmout,
            timestemp: +new Date(),
            orderFuture: false
        }
        rootGetters.VN_isLocal && (params.lotteryId = rootGetters.VN_isLocal)
        const res = await handleAjax(API.gameOrder, params, rootGetters)
        commit(_M.SET_STOP_AND_OVER_VN_DATA) // 清空暫存封鎖停押資料
        let errorCode = -999
        if (res) {
            errorCode = +res.result
            if (errorCode === 0) {
                const { availablebalance } = res.data

                // const search = {
                //     startDate: today(),
                //     endDate: today(),
                //     lotteryId: '',
                //     issue: params.ltIssueStart,
                //     countryType: 'vn'
                // }
                // const routerUrl = '/GameInfo/' + b64EncodeUnicode(JSON.stringify(search))
                availablebalance && commit(_M.SET_WALLET_BALANCE, availablebalance)
                // 越南彩只有自主彩,顯示獎期
                const message = !!rootGetters.VN_isLocal
                    ? `${i18n.t('common_001', {'0': res.params.ltProject[0].issue})} ${i18n.t(res.message_key)}`
                    : res.message_key

                dispatch(_M.SET_MESSAGE_BOX_DATA, {
                    show: true,
                    zIndex: 2001,
                    // 第{0}期 投注成功
                    message,
                    // message: res.message_key,
                    // 您的回馈，是我们持续进步的动力。
                    content: 'popup_130',
                    // 继续投注
                    confirmText: 'popup_021',
                    type: 'success',
                    // 游戏回馈
                    isShowCancelBtn: true,
                    cancelText: 'popup_124',
                    beforeCancel: (instance) => {
                    /*
                    rootGetters.isIos
                        ? intance.$router.push(routerUrl)
                        : window.open(routerUrl, '_blank')
                    */
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
                                            // '确定'
                                            confirmText: `${i18n.t('popup_004')} 2`,
                                            coldTime: 2
                                        }))
                                        // feedbackMsgBox.$root.$emit('reset320Times')
                                    }
                                    feedbackMsgBox.reset()
                                }
                            }))
                        }, 100)
                    }
                })
            // 封鎖停押
            } else if (errorCode === 8103) { //投注金额超过最大上限，无法完成投注
                const obj = returnState(rootGetters.VN_stopNumber)
                Object.entries(res.data.stop_bet_number).forEach(([key, numbers]) => {
                    numbers.forEach((number) => {
                        obj[key] ? obj[key].push(number) : (obj[key] = [number])
                    })
                })
                commit(_M.SET_VN_TEMP_DATA, {
                    temp: 'VN_stopNumber',
                    data: obj
                })
                dispatch(_M.FILTER_NUMBER_VN, res.data.stop_bet_number)
            } else if ([9501, 9502, 9503].includes(errorCode)) {
                const { Over = [], Stop } = res.data
                Stop && commit(_M.SET_STOP_VN_DATA, Stop)
                ;[9502, 9503].includes(errorCode) && commit(_M.SET_STOP_AND_OVER_VN_DATA, [...rootGetters.VN_stop, ...Over].unique())
                dispatch(_M.SET_MESSAGE_BOX_DATA, {
                    fast: !!payload,
                    isFilter: true,
                    show: true,
                    zIndex: 2003,
                    errorCode,
                    type: 'warning',
                    beforeConfirm: () => {
                        rootGetters.RWDMode === 1 && dispatch(_M.GAME_ORDER_VN_SUBMIT_BOX, payload)
                    }
                })
            } else if (errorCode === 9504) {
                dispatch(_M.SET_MESSAGE_BOX_DATA, warnMessageBox({
                    // '超过投注限额'
                    message: res.message_key,
                    // '<span class="text_color_strong">超过投注限额</span>，请重新确认投注内容。'
                    content: 'popup_097',
                    isShowCloseIcon: false
                    // afterConfirm: () => {
                    //     const overMethodIds = res.data.OverBonus
                    //     const arr = rootGetters.gameLtProject.map((item) => {
                    //         const isOver = overMethodIds.includes(item.methodId)
                    //         const _item = {...item, isOver}
                    //         return _item
                    //     })
                    //     commit(_M.SET_GAME_LT_PROJECT, {type: 4, data: arr})
                    // }
                }))
            // 玩法開關
            } else if (errorCode === 9009 || errorCode === 9010) {
                commit(_M.SET_BLOCKED_VN_DATA, res.data.vnBlockedMethod)
                dispatch(_M.SET_MESSAGE_BOX_DATA, {
                    fast: !!payload,
                    isFilter: true,
                    show: true,
                    zIndex: 2005,
                    type: 'warning',
                    beforeConfirm: () => {
                        rootGetters.RWDMode === 1 && dispatch(_M.GAME_ORDER_VN_SUBMIT_BOX, payload)
                    }
                })
            }
        }
        return errorCode
    },
    Input,
    Quick: Input,
    Balls: Input
}
export const defaultFlipTimer = {
    /** 剩下時間 */
    coldTime: 0,
    hours: '00',
    minutes: '00',
    seconds: '00',
    /** 是否倒數中 */
    isCountDown: false
}

export const getIsFocusArea = (getters, area) => {
    const official = ['VN_S', 'VN_C', 'VN_N']
    const local = getters.VN_isLocal
    const fn = {
        Old: () => {
            // 非官彩獎期彈窗處理
            if (local) {
                return getters.lotteryListLocalVN[local].name === area
            }
            return (!getters.VN_menuIndex && official.includes(area)) || // 全區
                area === getters.VN_gameMenu[getters.VN_menuIndex].key
        },
        // 非官彩獎期彈窗處理
        Input: () => local ? getters.lotteryListLocalVN[local].name === area : official.includes(area),
        Quick: () => local ? getters.lotteryListLocalVN[local].name === area : official.includes(area),
        Balls: () => local ? getters.lotteryListLocalVN[local].name === area : official.includes(area)
    }
    return fn[getters.VN_gameType]()
}

export const fetchStopBetNumber = ({ commit, rootGetters }) => {
    handleAjax(API.stopBetting, {menuType: 3}, rootGetters, { isPromise: true })
        .then(({data}) => {
            console.log(data,'1231231111111111')
            const { stop_bet_number } = data
            commit(_M.SET_VN_TEMP_DATA, {
                temp: 'VN_stopNumber',
                data: stop_bet_number
            })
        })
}