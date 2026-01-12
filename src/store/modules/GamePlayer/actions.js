import state from './state'
import { API } from '@API'
import {
    handleAjax,
    gameSumbitBox,
    warnMessageBox,
    warnMessageBox2,
    componentBox,
    returnState,
    formatTimer,
    formatHours,
    today,
    // setStorage,
    // getStorage,
    b64EncodeUnicodeBytes,
    b64EncodeUnicode,
    utc8
} from '@UTIL'
import {
    getMoney,
    nowLotteryId,
    isJsDynamicConfig,
    handlePrizeData,
    // orderFuturePreWinRateCalc,
    betDoneDialog,
    setGameConfigData,
    filterSinLtProject,
    updateBlockedMethods,
    handleJsDynamicConfig
    // filterBlockedMethods
} from './functions'
import lzma from '@UTIL/lzma'
// import lzmad from '@UTIL/lzmad'
import { resetGameOrder, resetOrderFuture } from './configs/resetOrder'
import i18n from '@/lang/lang'
const $t = i18n.t.bind(i18n)
let setTimeoutFloatPrize
let historyOrderTimer
let isFetching = false
export default {
    /**
     * 設定遊戲核心資料
     * @param {any} { commit }
     * @param {Object} payload 遊戲資料
     */
    [_M.SET_GAME_CONFIG]({ commit }, payload) {
        commit(_M.SET_GAME_CONFIG, payload)
    },
    /**
     * 投注冷卻時間
     * @param {object} that vue obj
     */
    async [_M.GET_FLIP_TIMEER]({ dispatch, commit, state, rootGetters }, that) {
        if (!state.flipTimer.isCountDown) {
            return
        }
        const jsDynamicConfig = state.jsDynamicConfig[nowLotteryId(state)]
        if (jsDynamicConfig && jsDynamicConfig.result !== '2003') {
            const { redressTime, nowstoptime } = state.flipTimer
            const nowLocalTime = +new Date()
            let countNum = state.flipTimer.countNum + 1
            let nowtime = state.flipTimer.nowtime + (nowLocalTime - state.flipTimer.nowLocalTime)
            if (countNum % redressTime === 0) {
                commit(_M.SET_FLIP_TIMEER_DATA, { isCountDown: false })
                const correctionTime = await handleAjax(API.time, {}, rootGetters, { isNotShowMessageBox: true })
                if (correctionTime) {
                    nowtime = correctionTime.serverTime + (nowLocalTime - correctionTime.now)
                    countNum = 0
                } else {
                    countNum = 30
                }
                commit(_M.SET_FLIP_TIMEER_DATA, { isCountDown: true })
            }
            // const coldTime = Math.round((nowstoptime - nowtime) / 1000, 0)
            let coldTime = Math.ceil((nowstoptime - nowtime + 1100) / 1000)

            if (coldTime <= 0) {
                if (state.flipTimer.isLoading) {
                    return
                }
                commit(_M.SET_FLIP_TIMEER_DATA, {
                    isLoading: true,
                    coldTime: 0,
                    hours: '000',
                    minutes: '00',
                    seconds: '00'
                })
                dispatch(_M.GET_GAME_JS_DYNAMIC_CONFIG, that)
            }

            // const week = formatDate((timeDiff / 3600 / 24 / 7) % 24)
            // const day = formatDate(timeDiff / 3600 / 24)
            const hours = formatHours(coldTime / 3600)
            const minutes = formatTimer((coldTime / 60) % 60)
            const seconds = formatTimer(coldTime % 60)
            commit(_M.SET_FLIP_TIMEER_DATA, {
                coldTime,
                nowtime,
                nowLocalTime,
                hours,
                minutes,
                seconds,
                countNum
            })
        } else {
            commit(_M.SET_FLIP_TIMEER_DATA, {
                coldTime: 0,
                hours: '000',
                minutes: '00',
                seconds: '00'
            })
        }
    },
    /**
     * 投注冷卻時間(多獎期)
     * @param {object} that vue obj
     */
    async [_M.GET_FLIP_TIMEER_MUTI]({ dispatch, commit, state, rootGetters }, that) {
        const nowLotId = nowLotteryId(state)
        const jsDynamicConfig = state.jsDynamicConfig[nowLotId]
        if (!jsDynamicConfig || jsDynamicConfig.result === '2003') {
            commit(_M.SET_FLIP_TIMEER_DATA, {
                muti: []
            })
            return
        }

        const timerRoot = state.flipTimer
        let {redressTime, countNum} = timerRoot
        const nowLocalTime = +utc8()
        let nowtime = timerRoot.nowtime + (nowLocalTime - timerRoot.nowLocalTime)

        timerRoot.muti.forEach((oneTimer, timerIdx) => {
            if (!oneTimer.isCountDown) {
                return
            }
            const { nowstoptime } = oneTimer
            const coldTime = Math.ceil((nowstoptime - nowtime + 1100) / 1000)

            if (coldTime <= 0) {
                commit(_M.SET_FLIP_TIMEER_DATA, {
                    key: timerIdx,
                    data: {
                        isCountDown: false
                    }
                })
                dispatch(_M.GET_GAME_JS_DYNAMIC_CONFIG, that)
                return
            }

            const hours = formatHours(coldTime / 3600)
            const minutes = formatTimer((coldTime / 60) % 60)
            const seconds = formatTimer(coldTime % 60)
            commit(_M.SET_FLIP_TIMEER_DATA, {
                key: timerIdx,
                data: {
                    isCountDown: true,
                    coldTime,
                    hours,
                    minutes,
                    seconds
                }
            })
        })

        // 全部Time設定完遞增
        countNum++
        // 到達指定的設定次數(redressTime)時, 重打API校正時間
        if (countNum % redressTime === 0) {
            const correctionTime = await handleAjax(API.time, {}, rootGetters, { isNotShowMessageBox: true })
            if (correctionTime) {
                nowtime = correctionTime.serverTime + (nowLocalTime - correctionTime.now)
                countNum = 0
            } else {
                countNum = 30
            }
        }
        commit(_M.SET_FLIP_TIMEER_DATA, {
            countNum,
            nowtime,
            nowLocalTime
        })
    },
    [_M.DELETE_CREDIT_GAME_LT_PROJECT]({ commit }, payload) {
        commit(_M.SET_CREDIT_GAME_LT_PROJECT, { type: 2, key: payload })
    },
    [_M.SET_CREDIT_GAME_LT_PROJECT]({ state, commit }, payload) {
        let projectData = payload
        if (Array.isArray(payload)) {
            if (!payload[0]) {
                return
            }
            let creditGameLtProject = {}
            const type = payload[0].type === 2 ? 4 : 3
            payload.forEach(obj => (creditGameLtProject[obj.key] = obj))
            projectData = { type, creditGameLtProject }
        }
        let ltProjectNum = 0
        let ltMoneyAmout = 0
        // 單筆多注
        if (payload && payload.nums) {
            projectData.nums = ltProjectNum = payload.nums
            ltMoneyAmout = ltProjectNum * payload.money
            commit(_M.SET_CREDIT_GAME_LT_PROJECT, projectData)
        } else if (Array.isArray(payload) && payload.length === 1 && !payload[0].isFast) {
            ltProjectNum = payload[0].nums || 1
            ltMoneyAmout = ltProjectNum * payload[0].money
            commit(_M.SET_CREDIT_GAME_LT_PROJECT, projectData)
        } else {
            commit(_M.SET_CREDIT_GAME_LT_PROJECT, projectData)
            const creditGameLtProjectValueArr = Object.values(state.creditGameLtProject)
            ltProjectNum = creditGameLtProjectValueArr.length
            creditGameLtProjectValueArr.forEach(obj => {
                ltMoneyAmout += obj.money
            })
        }
        commit(_M.SET_SUBMIT_DATA, { ltProjectNum, ltMoneyAmout })
    },
    [_M.SET_CREDIT_GAME_LT_PROJECT_ALL]({ state, commit }, payload) {
        let creditGameLtProject = returnState(state.creditGameLtProject)
        Object.values(creditGameLtProject).forEach(obj => (obj.money = payload))
        commit(_M.SET_CREDIT_GAME_LT_PROJECT, { type: 3, creditGameLtProject })
        let nums = null
        const creditGameLtProjectValueArr = Object.values(state.creditGameLtProject)
        creditGameLtProjectValueArr.forEach((obj) => {
            // 單筆多注
            if (obj.nums) {
                nums = obj.nums
            }
        })
        const ltProjectNum = nums || creditGameLtProjectValueArr.length
        const ltMoneyAmout = payload * ltProjectNum
        commit(_M.SET_SUBMIT_DATA, { ltProjectNum, ltMoneyAmout })
    },
    async [_M.GET_FLOAT_PRIZE_AND_BLOCKED_METHODS]({ state, commit, rootGetters }, lotteryId) {
        const floatPrize = await handleAjax(API.floatPrize, { lotteryId }, rootGetters)
        handlePrizeData(floatPrize, state, commit)
    },
    /**
     * 取得遊戲選丹資料
     * @param {any} { state, commit, dispatch }
     * @param {any} lotteryId 彩種 ID
     */
    async [_M.GET_GAME_PLAY_MENU_DATA]({ commit, rootGetters }, lotteryId) {
        const params = { lotteryId }
        const gameConfig = await handleAjax(API.gameConfig, params, rootGetters)
        if (gameConfig) {
            const object = {
                [lotteryId]: gameConfig.data
            }
            commit(_M.SET_GAME_PLAY_DATA, object)
        }
        return true
    },
    /**
     * 取得遊戲總資料
     * @param {any} { state, commit, dispatch }
     * @param {any} lotteryId 彩種 ID
     */
    async [_M.GET_GAME_PLAY_DATA]({ state, commit, dispatch, rootGetters }, payload) {
        // console.log('開始讀取遊戲資料', +new Date() - startTime)
        const { lotteryId, subGameName, isLoadHistory } = payload
        commit(_M.SET_GAME_DATA, { isLoading: true, isBallsLoading: true })
        dispatch(_M.REMOVE_SUBMIT_ALL_ORDER)
        commit(_M.SET_FLIP_TIMEER_DATA, {
            coldTime: 0,
            isLoading: false,
            isNew: [true, true, true, true, true, true, true],
            hours: '000',
            minutes: '00',
            seconds: '00',
            countNum: 0,
            muti: []
        })
        const { menuId, name } = rootGetters.lotteryList2[lotteryId] || {}
        let params = { lotteryId }
        if ([2, 5, 8].includes(menuId)) {
            params.issueCount = 100
        } else if (menuId === 4) {
            params.issueCount = 50
            if (name === 'K3_SB') {
                params.issueCount = 20
            }
        }
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
            //關閉overlay
            commit(_M.SET_GAME_DATA, {
                isBallsLoading: false
            })

            try {
                // go to the first available lottery
                const lotteryId = Object.values(rootGetters.lotteryList2)[0].lottery
                // window.location.replace('/GamePlayer/' + lotteryId)
            } catch (err) {
                //redirect to '/'
                window.location.replace('/')
            }
            return
        }
        // console.log('遊戲資料讀取完畢', +new Date() - startTime)
        handlePrizeData(floatPrize, state, commit)
        commit(_M.SET_KEEP_POINT, floatPrize.data.keepPoint * 100)
        if (gameConfig) {
            const { data } = setGameConfigData({
                config: gameConfig.data,
                jsPrizePoint: state.floatPrize.jsPrizePoint
            })
            const object = {
                [lotteryId]: data
            }
            const gameTypeName = data.gameConfigData.gameTypeCn
            let gameType = data.gameConfigData.gameType
            commit(_M.SET_SUBMIT_DATA, {
                gameTypeName,
                gameType,
                onePrice: gameConfig.data.stake,
                modes: gameConfig.data.base,
                lotteryId
            })
            commit(_M.SET_GAME_PLAY_DATA, object)
            commit(_M.SET_SUBMIT_DATA, { lotteryId })
            dispatch(_M.GET_GAME_INDEX, subGameName)
        }
        handleJsDynamicConfig(jsDynamicConfig, lotteryId, params, { commit, rootGetters, dispatch })
        if (isLoadHistory) {
            dispatch(_M.CLEAR_HISTORY_ORDER_TIMER)
            historyOrderTimer = setTimeout(() => {
                dispatch(_M.GET_HISTORY_ORDER)
            }, 2000)
        }
        //載入投注資料及追號資料
    },
    /**
     * 取得遊戲獎期/追號等資料
     * @param {object} that vue obj
     */
    async [_M.GET_GAME_JS_DYNAMIC_CONFIG]({ state, commit, dispatch, rootGetters, rootState }, that) {
        const lotteryId = nowLotteryId(state)
        const { menuId, name } = rootGetters.lotteryList2[lotteryId] || {}
        let params = { lotteryId }
        if ([2, 5, 8].includes(menuId)) {
            params.issueCount = 100
        } else if (menuId === 4) {
            params.issueCount = 50
            if (name === 'K3_SB') {
                params.issueCount = 20
            }
        }
        const jsDynamicConfig = await handleAjax(API.jsDynamicConfig, params, rootGetters)
        if (jsDynamicConfig) {
            if (jsDynamicConfig.data.number !== rootGetters.currentjsDynamicData.number && rootState.route.name.includes('GamePlayer')) {
                // const emitUpdateBounus = (instance) => instance.$root.$emit('updateBonus')
                if (![4, 8].includes(menuId)) {
                    //that.$root.$emit('gameTableCD')
                    // dispatch(_M.SET_MESSAGE_BOX_DATA, warnMessageBox({
                    //     type: '',
                    //     zIndex: 2002,
                    //     // '当期奖期结束'
                    //     message: 'popup_024',
                    //     // '当期奖期已结束，请注意奖期变化'
                    //     content: 'popup_025',
                    //     confirmText: `${$t('popup_004')} 3`,
                    //     coldTime: 3,
                    //     beforeConfirm: emitUpdateBounus,
                    //     beforeCancel: emitUpdateBounus,
                    //     beforeClose: emitUpdateBounus
                    // }))
                    that.$root.$emit('updateTipGamePlay')
                    that.$root.$emit('updateBonus')
                    // 獎期變動彈窗關閉投注詳情彈窗
                    // dispatch(_M.SET_MESSAGE_BOX_DATA, componentBox({
                    //     show: false
                    // }))
                } else {
                    that.$root.$emit('updateTip')
                }
            }
            handleJsDynamicConfig(jsDynamicConfig, lotteryId, params, { commit, rootGetters, dispatch })
            if (state.gameSubmit.orderFutureIssue.length) {
                // 傳統玩法清除追號超過限額高亮
                // 桌面玩法更新期號
                ![4, 8].includes(menuId) ? dispatch(_M.UPDATE_ORDER_FUTURE) : dispatch(_M.SET_TABLE_ORDER_FUTURE)
            }
            // 清除投注項超過限額高亮
            if (state.gameLtProject.length) {
                const arr = state.gameLtProject.map((item) => {
                    const isOver = false
                    const _item = {...item, isOver}
                    return _item
                })
                commit(_M.SET_GAME_LT_PROJECT, {type: 4, data: arr})
            }
            // 獎期結束兩秒後刷新控賠更新
            setTimeoutFloatPrize = setTimeout(async () => {
                await dispatch(_M.SET_FLOAT_PRIZE_AND_BLOCKED_METHODS, true)
                that && that.$root.$emit('updateBonus')
            }, 2000)
            // 獎期結束後刷新超過封鎖直的玩法資料
            commit(_M.SET_OVERLIMIT_METHODS, {})
            commit(_M.SET_BONUS_OVERLIMIT_METHODS, {})
            dispatch(_M.CLEAR_HISTORY_ORDER_TIMER)
            historyOrderTimer = setTimeout(() => {
                ![4, 8].includes(menuId) && dispatch(_M.GET_HISTORY_ORDER)
                dispatch(_M.GET_WALLET_BALANCE, true)
            }, 5000)
        }
    },
    /**
     * 抓取投注紀錄追號紀錄
     * @param {any} { commit, dispatch }
     */
    [_M.GET_HISTORY_ORDER]({ dispatch, getters }) {
        const params = {
            // startDate: moment().utcOffset('+0800').subtract(7, 'days').format('YYYY-MM-DD'),
            startDate: today(),
            endDate: today(),
            pageLimit: 20,
            calSum: true
        }
        dispatch(_M.SET_GAME_INFO_DATA, params)
        dispatch(_M.GET_GAME_INFO_LIST)
        if (getters.isShowTaskButton) {
            dispatch(_M.SET_ADD_NEW_GAME_INFO_DATA, params)
            dispatch(_M.GET_ADD_NEW_GAME_INFO_LIST, params)
        }
    },
    /**
     * 抓取投注紀錄追號紀錄
     * @param {any} { commit, dispatch }
     */
    [_M.CLEAR_HISTORY_ORDER_TIMER]() {
        clearTimeout(historyOrderTimer)
    },
    /**
     * 官方彩種延遲抓號機制
     * @param {any} { commit, dispatch }
     */
    async [_M.GET_GAME_JS_DYNAMIC_CONFIG_FOR_OFFICAL]({ state, commit, rootGetters }) {
        const lotteryId = nowLotteryId(state)
        const { menuId, name } = rootGetters.lotteryList2[lotteryId] || {}
        let params = { lotteryId }
        if ([2, 5, 8].includes(menuId)) {
            params.issueCount = 100
        } else if (menuId === 4) {
            params.issueCount = 50
            if (name === 'K3_SB') {
                params.issueCount = 20
            }
        }
        rootGetters.currentjsDynamicData.number &&
            handleAjax(API.correctionTime, params, rootGetters, { isNotShowMessageBox: true })
                .then(({data}) => {
                    const notYetUpdated = rootGetters.currentjsDynamicData.lastnumber !== data.lastnumber
                    if (notYetUpdated) {
                        const jsDynamicConfig = {
                            data: {
                                ...returnState(rootGetters.currentjsDynamicData),
                                ...data
                            }
                        }
                        commit(_M.SET_GAME_PLAY_DYNAMIC_DATA, { [lotteryId]: jsDynamicConfig })
                    }
                }).catch(() => null)
    },
    /**
     * 取得遊戲獎期/追號等資料
     * @param {any} { commit, dispatch }
     */
    // async [_M.GET_GAME_JS_DYNAMIC_HISTORY]({ commit, dispatch, rootGetters }) {
    //     const lotteryId = nowLotteryId(state)

    // },
    /**
     * 透過名稱取得遊戲點位置
     * @param {any} { state, commit }
     * @param {any} payload 玩法名字羅馬拚音
     */
    async [_M.GET_GAME_INDEX]({ state, commit, dispatch }, payload) {
        const lotteryId = nowLotteryId(state)
        // prevent error
        if (state.gamePlayData[lotteryId] === undefined) return
        let { gameConfigData } = returnState(state.gamePlayData[lotteryId])
        let typeName = payload || gameConfigData.defaultMethod
        const gameType = gameConfigData.gameType
        const fullTypeName = `${gameType}_${typeName}`

        //***反選不處理
        if (payload === state.gameOrder.typeName && state.game.isEditIndex > -1) {
            return
        }
        let typeNameIsLegit = false
        gameConfigData.gameMethods.forEach((menu, index) => {
            if (menu.childs) {
                menu.childs.forEach((gameMenu, index2) => {
                    if (gameMenu.childs) {
                        gameMenu.childs.forEach(({ methodId, mode, parent, name, title, title_key }, index3) => {
                            const formatType = `${mode}_${parent}_${name}`.replace(/\./g, '_')
                            if (typeName === formatType) {
                                typeNameIsLegit = true
                                let menuIndex = 0
                                let gameIndex = 0
                                let gameSubIndex = 0
                                menuIndex = index
                                gameIndex = index2
                                gameSubIndex = index3
                                const methodName = menu.title + title
                                const [parentName, childName] = [menu.title, title]
                                const [parentNameKey, childNameKey] = [menu.title_key, title_key]
                                methodId = methodId.split('-')[0]
                                commit(_M.SET_GAME_DATA, {
                                    isLoading: false,
                                    menuIndex,
                                    gameIndex,
                                    gameSubIndex,
                                    gameType,
                                    fullTypeName,
                                    isEditIndex: -1
                                })
                                commit(_M.SET_GAME_ORDER_DATA, {
                                    typeName,
                                    methodId,
                                    methodName,
                                    parentName,
                                    childName,
                                    parentNameKey,
                                    childNameKey,
                                    showDanshiCodes: ''
                                })
                            }
                        })
                    } else {
                        // console.log(gameMenu)
                    }
                })
                if (!typeNameIsLegit) dispatch(_M.GET_GAME_INDEX)
            }
        })
    },
    /**
     * 更動game
     * @param {any} { state, commit }
     * @param {any} { payload }
     */
    [_M.SET_GAME]({ commit }, payload) {
        commit(_M.SET_GAME_DATA, { ...payload })
    },
    /**
     * 更動gamePlayerData
     * @param {any} { state, commit }
     * @param {any} { payload }
     */
    [_M.SET_GAME_PLAY_DATA]({ commit }, payload) {
        commit(_M.SET_GAME_PLAY_DATA, payload)
    },
    /**
     * 初始化球的架構
     * @param {any} { state, commit }
     * @param {any} { x, y, digitstr, type, onePrice, methodName }
     */
    [_M.SET_INIT_BALLS_DATA]({ state, commit, getters, dispatch }, { x, y, yTwo, digitstr, type, onePrice }) {
        let gameBallData = []
        let ballControlData = []
        x.forEach((key, row) => {
            gameBallData[row] = []
            ballControlData[row] = []
            if (yTwo) {
                if (row % 2 === 0) {
                    yTwo.forEach((key, col) => {
                        gameBallData[row][col] = false
                        if (col <= 5) {
                            ballControlData[row][col] = false
                        }
                    })
                } else {
                    y.forEach((key, col) => {
                        gameBallData[row][col] = false
                        if (col <= 5) {
                            ballControlData[row][col] = false
                        }
                    })
                }
            } else {
                y.forEach((key, col) => {
                    if (Array.isArray(key)) {
                        key.forEach((val, col2) => {
                            gameBallData[row][col2] = false
                            if (col <= 5) {
                                ballControlData[row][col] = false
                            }
                        })
                    } else {
                        gameBallData[row][col] = false
                        if (col <= 5) {
                            ballControlData[row][col] = false
                        }
                    }
                })
            }
        })
        const gameBallEmptyData = returnState(gameBallData)
        //注單非編輯中才初始化選球資料(非反選)
        if (state.game.isEditIndex === -1) {
            commit(_M.SET_GAME_ORDER_DATA, {
                gameBallData,
                digitstr,
                type,
                onePrice: onePrice || +getters.onePrice,
                nums: 0,
                codes: '',
                bonus: 0,
                scode_key: '',
                /** checkbox */
                activeCheckboxes: {}
            })
        }
        commit(_M.SET_GAME_DATA, {
            isBallsLoading: false,
            ballControlEmptyData: ballControlData,
            ballControlData,
            gameBallEmptyData,
            isEditIndex: state.gameOrder.nums ? state.game.isEditIndex : -1
        })
        commit(_M.SET_IS_SIN, false)
    },
    /**
     * 初始化信用玩法的架構
     * @param {any} { state, commit }
     */
    [_M.SET_INIT_CREDIT_DATA]({ commit }) {
        commit(_M.SET_IS_SIN, true)
        commit(_M.SET_GAME_DATA, {
            isBallsLoading: false
        })
        commit(_M.SET_CREDIT_GAME_LT_PROJECT)
    },
    /**
     * 切換玩法主玩法
     * @param {any} { commit }
     * @param {any} payload 主玩法 index
     */
    [_M.SET_GAME_MENU_INDEX]({ commit }, payload) {
        commit(_M.SET_GAME_DATA, { ...payload })
    },
    /**
     * 選球
     * @param {any} { state, commit }
     * @param {any} payload 球的座標位置
     */
    [_M.SELECT_BALL]({ state, commit }, payload) {
        let gameBallData = state.gameOrder.gameBallData
        let ballControlData = [...state.game.ballControlData]
        if (Array.isArray(payload)) {
            payload.forEach(({x, y, boolean}) => {
                ballControlData[x] = [...state.game.ballControlEmptyData[x]]
                if (typeof boolean === 'boolean') {
                    gameBallData[x][y] = boolean
                } else {
                    gameBallData[x][y] = !gameBallData[x][y]
                }
            })
        } else {
            const { x, y } = payload
            ballControlData[x] = [...state.game.ballControlEmptyData[x]]
            gameBallData[x][y] = !gameBallData[x][y]
        }
        commit(_M.SET_GAME_DATA, { ballControlData })
        commit(_M.SET_GAME_ORDER_DATA, { gameBallData })
    },
    /**
     * 修改checkbox選取狀態
     * @param {any} state Global Stroe
     * @param {any} payload  checkbox位置{x, y}
     */
    [_M.TOGGLE_CHECKBOX]({ state, commit }, payload) {
        const {x, y} = payload //x: row, y: pos
        const activeCheckboxes = returnState(state.gameOrder.activeCheckboxes || {})

        if (!activeCheckboxes[x]) activeCheckboxes[x] = {}

        if (['all', '320all', '320clear'].includes(y)) { //全选/全不选
            const currentGame = state.game.fullTypeName
            const config = state.gameConfig[currentGame].checkboxes
            const allIsChecked = Object.keys(config[x]).length === Object.keys(activeCheckboxes[x]).length
            const allCheckedState = {}
            Object.keys(config[x]).forEach((e, i) => (allCheckedState[i] = true))

            if (y === 'all') { // 980
                activeCheckboxes[x] = (allIsChecked) ? {} : allCheckedState
            } else { // 320
                activeCheckboxes[x] = (y === '320clear') ? {} : allCheckedState
            }
        } else { // 一般單一checkbox
            if (!activeCheckboxes[x][y]) {
                activeCheckboxes[x][y] = true
            } else {
                delete activeCheckboxes[x][y]
            }
        }

        commit(_M.SET_ACTIVE_CHECKBOXES, activeCheckboxes)
    },
    /**
     * 選球(控制項)
     * @param {any} { state, commit }
     * @param {any} payload 控制項
     */
    [_M.SET_BALL_CONTROL]({ state, commit }, payload) {
        const { fn, index, option } = payload
        const row = [...state.game.gameBallEmptyData[index]]
        let gameBallData = [...state.gameOrder.gameBallData]
        let ballControlData = [...state.game.ballControlData]
        ballControlData[index] = [...state.game.ballControlEmptyData[index]]
        ballControlData[index][option] = true
        gameBallData[index] = row.map(fn)
        commit(_M.SET_GAME_DATA, { ballControlData })
        commit(_M.SET_GAME_ORDER_DATA, { gameBallData })
    },
    /**
     * 清除(控制項)
     */
    [_M.CLEAR_BALL_CONTROL]({ state, commit }) {
        const ballControlData = returnState(state.game.ballControlEmptyData)
        commit(_M.SET_GAME_DATA, { ballControlData })
    },
    /**
     * 選球(全)
     * @param {any} { state, dispatch }
     * @param {number} payload 第幾列的 (全) index
     */
    [_M.SELECT_ALL_BALL]({ dispatch }, payload) {
        dispatch(_M.SET_BALL_CONTROL, {
            fn: () => true,
            index: payload,
            option: 0
        })
    },
    /**
     * 選球(大)
     * @param {any} { state, dispatch }
     * @param {number} payload 第幾列的 (大) index
     */
    [_M.SELECT_BIG_BALL]({ state, dispatch }, payload) {
        const row = [...state.game.gameBallEmptyData[payload]]
        dispatch(_M.SET_BALL_CONTROL, {
            fn: (i, index) => Math.floor(row.length / 2) < index + 1,
            index: payload,
            option: 1
        })
    },
    /**
     * 選球(小)
     * @param {any} { state, dispatch }
     * @param {number} payload 第幾列的 (小) index
     */
    [_M.SELECT_SMALL_BALL]({ state, dispatch }, payload) {
        const row = [...state.game.gameBallEmptyData[payload]]
        dispatch(_M.SET_BALL_CONTROL, {
            fn: (i, index) => Math.floor(row.length / 2) > index,
            index: payload,
            option: 2
        })
    },
    /**
     * 選球(奇)
     * @param {any} { state, dispatch }
     * @param {number} payload 第幾列的 (奇) index
     */
    [_M.SELECT_ODD_BALL]({ state, dispatch }, payload) {
        dispatch(_M.SET_BALL_CONTROL, {
            fn: (i, index) => (parseInt(state.gameConfig[state.game.fullTypeName].balls[index]) % 2) === 1,
            index: payload,
            option: 3
        })
    },
    /**
     * 選球(偶)
     * @param {any} { state, dispatch }
     * @param {number} payload 第幾列的 (偶) index
     */
    [_M.SELECT_EVEN_BALL]({ state, dispatch }, payload) {
        dispatch(_M.SET_BALL_CONTROL, {
            fn: (i, index) => (parseInt(state.gameConfig[state.game.fullTypeName].balls[index]) % 2) === 0,
            index: payload,
            option: 4
        })
    },
    /**
     * 單式輸入事件
     * @param {any} { state, commit }
     * @param {string} payload 單式所輸入的 text
     */
    [_M.INPUT_DANSHI_TEXT]({ commit }, payload) {
        commit(_M.SET_GAME_ORDER_DATA, { showDanshiCodes: payload })
    },
    /**
     * 選球(清)
     * @param {any} { state, dispatch }
     * @param {number} payload 第幾列的 (清) index
     */
    [_M.SELECT_CLEAR_ALL_BALL]({ dispatch }, payload) {
        dispatch(_M.SET_BALL_CONTROL, {
            fn: () => false,
            index: payload,
            option: 5
        })
    },
    /**
     * 清空選球
     * @param {any} { state, commit }
     */
    [_M.CLEAR_ALL_BALLS]({ state, commit }) {
        let gameBallData = returnState(state.game.gameBallEmptyData)
        let ballControlData = returnState(state.game.ballControlEmptyData)
        commit(_M.SET_GAME_ORDER_DATA, {
            gameBallData,
            nums: 0,
            codes: ''
        })
        commit(_M.SET_GAME_DATA, { ballControlData, isEditIndex: -1 })
    },
    /**
     * 打開/關閉注單細節窗
     * @param {any} { state, commit }
     * @param {boolean} payload 打開/關閉
     */
    [_M.GAME_DETAIL_TOGGLE]({ commit }, payload) {
        const isDetailIndex = payload
        commit(_M.SET_GAME_DATA, { isDetailIndex })
    },
    /**
     * 反選球
     * @param {any} { state, commit, dispatch }
     * @param {number} payload 投注項注單的 index
     */
    [_M.RE_SELECT_BALL]({ state, commit, dispatch }, payload) {
        const gameOrder = returnState(state.gameLtProject[payload])
        const ballControlData = returnState(state.game.ballControlEmptyData)
        dispatch(_M.GET_GAME_INDEX, gameOrder.typeName)
        commit(_M.SET_GAME_DATA, { isEditIndex: payload, ballControlData })
        commit(_M.SET_GAME_ORDER_DATA, gameOrder)
        commit(_M.SET_KEEP_POINT, gameOrder.keepPoint * 100)
        commit(_M.SET_KILL_PAIR, gameOrder.killPairEnabled)
    },
    /**
     * 設定倍數
     * @param {any} { commit }
     * @param {number} 倍數
     */
    [_M.SET_GAME_ORDER_TIMES]({ commit }, payload) {
        commit(_M.SET_GAME_ORDER_DATA, {times: payload.times})
    },
    /**
     * 設定元角分
     * @param {any} { commit }
     * @param {any} payload 元角分
     */
    [_M.SET_GAME_ORDER_MODE]({ commit }, payload) {
        commit(_M.SET_GAME_ORDER_DATA, payload)
    },
    /**
     * 設定萬、千、十、百、個控制項
     * @param {any} { state, commit }
     * @param {any} payload 控制項
     */
    [_M.SET_GAME_ORDER_DIGITSTR]({ state, commit }, payload) {
        const { checked, key } = payload
        let str = state.gameOrder.digitstr.split('_')
        if (checked) {
            if (str.indexOf(key) !== -1) {
                return
            }
            str = [key, ...str].join('_')
        } else {
            str = str
                .filter(items => items !== key)
                .join('_')
        }
        let digitstr = ''
        str.indexOf('w_') > -1 && (digitstr += 'w_')
        str.indexOf('q_') > -1 && (digitstr += 'q_')
        str.indexOf('b_') > -1 && (digitstr += 'b_')
        str.indexOf('s_') > -1 && (digitstr += 's_')
        str.indexOf('g_') > -1 && (digitstr += 'g_')
        commit(_M.SET_GAME_ORDER_DATA, { digitstr })
    },
    [_M.SET_GAME_ORDER_DATA]({ commit }, payload) {
        commit(_M.SET_GAME_ORDER_DATA, payload)
    },
    /**
     * 添加/修改號碼箱 並修改 SubmitData 的注單資料
     * @param {any} { state, commit, dispatch }
     * @param {array} hprizes 控賠多獎金
     */
    [_M.SET_SUBMIT_ORDER]({ state, commit, dispatch, getters }) {
        if (state.gameOrder.nums <= 0 || !state.gameOrder.times || !state.gameOrder.codes) {
            dispatch(_M.SET_MESSAGE_BOX_DATA, warnMessageBox({
                // 号码选择不完整
                message: 'popup_002',
                // 号码选择不完整，请重新选择。
                content: 'popup_003'
            }))
            return
        }
        const ballControlData = returnState(state.game.ballControlEmptyData)
        let isSameProject = false
        const keepPoint = getters.kp
        const kp = ((state.floatPrize.keepPoint - keepPoint) * 100).toFixed(1) + '%'
        const gameOrder = { ...returnState(state.gameOrder), keepPoint, kp }
        if (state.game.isEditIndex === -1) {
            //非反選
            const {
                type,
                methodId,
                codes,
                mode,
                typeName,
                times,
                showCodes,
                digitstr
            } = gameOrder
            if (gameOrder.type === 'input') {
                gameOrder.showDanshiCodes = showCodes
                gameOrder.killPairEnabled = getters.killPairEnabled
            }
            isSameProject = state.gameBoxTemp[methodId + mode + type + codes + digitstr + keepPoint + getters.killPairEnabled]
            if (!isSameProject) {
                commit(_M.SET_GAME_LT_PROJECT, { type: 1, data: gameOrder })
                commit(_M.SET_GAME_BOX_TEMP, { gameOrder, isSave: true })
            } else {
                let index = 0
                let project = returnState(state.gameLtProject.find((items, i) => {
                    if (items.codes === codes &&
                        items.typeName === typeName &&
                        items.digitstr === digitstr &&
                        items.keepPoint === keepPoint &&
                        items.killPairEnabled === getters.killPairEnabled &&
                        items.mode === mode) {
                        index = i
                        return true
                    }
                    return false
                }))

                //check multiplier limit
                const newTimes = parseInt(project.times) + parseInt(times)
                const limit = project.betMultiLimit
                project.times = (newTimes > limit) ? limit : newTimes

                project.money = getMoney(project)
                commit(_M.SET_GAME_LT_PROJECT, {type: 2, index, data: project})
                dispatch(_M.SET_MESSAGE_BOX_DATA, warnMessageBox({
                    // 号码已在投注项内
                    message: 'popup_022',
                    // 您选择的号码已在投注项内，将直接进行倍数累加
                    content: 'popup_023'
                }))
            }
            const detailIndex = (state.game.isDetailIndex === -1) ? -1 : state.game.isDetailIndex + 1
            commit(_M.SET_GAME_DATA, { isDetailIndex: detailIndex, ballControlData })
            commit(_M.SET_GAME_ORDER_DATA, { ...resetGameOrder, gameBallData: returnState(state.game.gameBallEmptyData) })
        } else {
            // 反選狀態
            const {
                type,
                methodId,
                codes,
                mode,
                typeName,
                times,
                digitstr
            } = gameOrder
            if (type === 'input') {
                gameOrder.showDanshiCodes = gameOrder.showCodes
            }
            let ltProject = returnState(state.gameLtProject)
            isSameProject = state.gameBoxTemp[methodId + mode + type + codes + digitstr + keepPoint + getters.killPairEnabled]
            if (!isSameProject) {
                commit(_M.SET_GAME_BOX_TEMP, { gameOrder: ltProject[state.game.isEditIndex], isSave: false })
                commit(_M.SET_GAME_LT_PROJECT, {type: 2, index: state.game.isEditIndex, data: gameOrder})
                commit(_M.SET_GAME_BOX_TEMP, { gameOrder, isSave: true })
            } else {
                let index = -1
                let project = returnState(state.gameLtProject.find((items, i) => {
                    if (items.codes === codes &&
                        items.typeName === typeName &&
                        items.mode === mode &&
                        items.digitstr === digitstr &&
                        items.keepPoint === keepPoint &&
                        items.killPairEnabled === getters.killPairEnabled &&
                        state.game.isEditIndex !== i) {
                        index = i
                        return true
                    }
                    return false
                }) || {})
                if (index >= 0) {
                    //check multiplier limit
                    const newTimes = parseInt(project.times) + parseInt(times)
                    const limit = project.betMultiLimit
                    project.times = (newTimes > limit) ? limit : newTimes
                    project.money = getMoney(project)
                    commit(_M.SET_GAME_BOX_TEMP, { gameOrder: ltProject[state.game.isEditIndex], isSave: false })
                    commit(_M.SET_GAME_LT_PROJECT, {type: 2, index, data: project})
                    commit(_M.SET_GAME_LT_PROJECT, {type: 3, index: state.game.isEditIndex, data: gameOrder})
                    dispatch(_M.SET_MESSAGE_BOX_DATA, warnMessageBox({
                        // 号码已在投注项内
                        message: 'popup_022',
                        // 您选择的号码已在投注项内，将直接进行倍数累加
                        content: 'popup_023'
                    }))
                } else {
                    commit(_M.SET_GAME_LT_PROJECT, {type: 2, index: state.game.isEditIndex, data: gameOrder})
                }
            }
            commit(_M.SET_GAME_DATA, { isEditIndex: -1, ballControlData })
        }
        dispatch(_M.SET_CHANGE_ORDER_FUTURE)
    },
    /**
     * 生成指定数目的随机投注号码，并添加进号码篮以及修改 SubmitData 的注單資料
     * @param {any} { state, commit, dispatch }
     * @param {any} payload 注單資料
     */
    [_M.SET_RANDOM_LOTTERYS]({ state, commit, dispatch, getters }, payload) {
        const { nums, bonus } = payload
        const keepPoint = getters.kp
        const gameOrder = {
            ...returnState(state.gameOrder),
            ...payload,
            keepPoint,
            kp: ((state.floatPrize.keepPoint - keepPoint) * 100).toFixed(1) + '%',
            bonus,
            onePrice: state.gameSubmit.onePrice,
            killPairEnabled: getters.killPairEnabled,
            isOver: false
        }
        const {
            type,
            mode,
            onePrice,
            times,
            methodId,
            codes,
            typeName,
            digitstr
        } = gameOrder
        // 更新多獎金時的最高倍數
        commit(_M.SET_GAME_ORDER_DATA, { codes: codes })

        // 檢查有沒有超過最高倍數
        gameOrder.money = getMoney({ mode, nums, onePrice, times })

        const isSameProject = state.gameBoxTemp[methodId + mode + type + codes + digitstr + keepPoint + getters.killPairEnabled]
        if (isSameProject) {
            let index = 0
            let project = returnState(state.gameLtProject.find((items, i) => {
                if (items.codes === codes &&
                    items.typeName === typeName &&
                    items.digitstr === digitstr &&
                    items.keepPoint === keepPoint &&
                    items.killPairEnabled === getters.killPairEnabled &&
                    items.mode === mode) {
                    index = i
                    return true
                }
                return false
            }))
            // 檢查相加有沒有高於最高倍數
            const newTimes = project.times + gameOrder.times
            const limit = state.gameOrder.betMultiLimit
            project.times = (newTimes > limit) ? limit : newTimes
            project.money = getMoney(project)
            dispatch(_M.SET_MESSAGE_BOX_DATA, warnMessageBox({
                // 号码已在投注项内
                message: 'popup_022',
                // 您选择的号码已在投注项内，将直接进行倍数累加
                content: 'popup_023'
            }))
            commit(_M.SET_GAME_LT_PROJECT, { type: 2, data: project, index })
        } else {
            commit(_M.SET_GAME_BOX_TEMP, { gameOrder, isSave: true })
            commit(_M.SET_GAME_LT_PROJECT, { type: 1, data: gameOrder })
        }
        commit(_M.SET_GAME_DATA, {
            ballControlData: returnState(state.game.ballControlEmptyData)
        })
        state.game.isEditIndex !== -1 && commit(_M.SET_GAME_DATA, {
            isEditIndex: -1,
            isDetailIndex: -1
        })
    },
    /**
     * 顯示/隱藏並清除追號急修改 SubmitData 的注單資料
     * @param {any} { state, commit, dispatch }
     * @param {boolean} payload 顯示/隱藏
     */
    [_M.SET_IS_SHOW_ORDER_FUTURE]({ commit, dispatch }, payload) {
        if (payload) {
            commit(_M.SET_GAME_DATA, { isShowOrderFuture: payload })
        } else {
            commit(_M.SET_GAME_DATA, { isShowOrderFuture: payload })
            dispatch(_M.REMOVE_ORDER_FUTURE)
        }
    },
    /**
     * 刷新注單總計金額(state.gameSubmit.ltMoneyAmout)
     */
    [_M.REFRESH_SUBMIT_SUM]({ commit }) {
        commit(_M.SET_SUBMIT_MONEY)
    },
    /**
     * 追號 並修改 SubmitData 的注單資料
     * @param {any} { state, commit }
     */
    [_M.SET_ORDER_FUTURE]({ state, commit, dispatch }) {
        if (!isJsDynamicConfig(state)) {
            dispatch(_M.SET_MESSAGE_BOX_DATA, warnMessageBox({
                // 尚未开放奖期
                message: 'common_118'
            }))
            return
        }
        const ltProject = state.gameLtProject
        if (ltProject.length < 1) {
            dispatch(_M.SET_MESSAGE_BOX_DATA, warnMessageBox({
                // 号码选择不完整
                message: 'popup_002',
                // 号码选择不完整，请重新选择。
                content: 'popup_003'

            }))
            return
        }
        const lotteryId = nowLotteryId(state)
        const jsDynamicConfig = state.jsDynamicConfig[lotteryId].data
        const orderFutureType = state.game.orderFutureType
        const gamenumbers = returnState(jsDynamicConfig.gamenumbers)
        let multiple = parseInt(state.game.orderFutureMultiple)
            ? state.game.orderFutureMultiple : 1
        const multiLimit = state.game.futureMultiLimit
        multiple > multiLimit && (multiple = multiLimit)
        let orderFutureIssue = []
        let money = 0 //multiplied
        let moneyBase = 0 //unmultiplied
        let isSome = true

        state.gameLtProject.forEach(({mode, nums, onePrice, type, methodId}) => {
            if (state.gameLtProject[0].methodId !== methodId ||
                state.gameLtProject[0].type !== type ||
                state.gameLtProject[0].mode !== mode) {
                isSome = false
            }
            money += getMoney({
                mode,
                nums,
                onePrice,
                times: multiple
            })
            moneyBase += getMoney({
                mode,
                nums,
                onePrice,
                times: 1
            })
        })
        const tracemaxtimes = state.game.orderFutureNum >= jsDynamicConfig.tracemaxtimes
            ? jsDynamicConfig.tracemaxtimes : state.game.orderFutureNum

        // 普通追號, 1: 翻倍追號, 2: 殖利率追號
        if (orderFutureType === '1') {
            for (let i = 0; i < tracemaxtimes; i++) {
                let _multiple = multiple * Math.pow(state.game.orderFutureOffsetMultiple, parseInt(i / state.game.orderFutureOffset))
                _multiple > multiLimit && (_multiple = multiLimit)
                orderFutureIssue.push({
                    issue: gamenumbers[i].number,
                    multiple: _multiple,
                    time: gamenumbers[i].time,
                    money: moneyBase * _multiple,
                    checked: true
                })
            }
        } else {
            for (let i = 0; i < tracemaxtimes; i++) {
                orderFutureIssue.push({
                    issue: gamenumbers[i].number,
                    multiple,
                    time: gamenumbers[i].time,
                    money,
                    checked: true
                })
            }
        }
        // else if (orderFutureType === '2') {
        //     if (!isSome) {
        //         dispatch(_M.SET_MESSAGE_BOX_DATA, warnMessageBox({
        //             message: '盈利率追号不支持混投，请确保您的投注都为同一玩法类型，且元角模式一致。'
        //         }))
        //         return
        //     }
        //     const method = ltProject[0].methodId
        //     const mode = ltProject[0].mode
        //     const orderFuturePreWinRate = state.game.orderFuturePreWinRate
        //     const util = 1 * (mode === 1 ? 1 : Math.pow(0.1, mode - 1))
        //     const hprize = state.floatPrize.jsPrizePoint[method][0].hprize
        //     const prize = hprize * util
        //     let temp = {}
        //     let sumMoney = 0

        //     for (let i = 0; i < tracemaxtimes; i++) {
        //         const {
        //             bouns,
        //             preMoney,
        //             prePercent,
        //             multiples,
        //             needMoney
        //         } = orderFuturePreWinRateCalc(temp, multiple, sumMoney, money, orderFuturePreWinRate, prize, ltProject.length)
        //         if (multiples >= 10000) {
        //             dispatch(_M.SET_MESSAGE_BOX_DATA, warnMessageBox({
        //                 message: '盈利率追号无法到达您预期设定的目标值，请修改您的设置。'
        //             }))
        //             return
        //         }
        //         sumMoney += needMoney
        //         temp = {
        //             issue: gamenumbers[i].number,
        //             multiple: multiples,
        //             time: gamenumbers[i].time,
        //             money: needMoney,
        //             checked: true,
        //             bouns,
        //             preMoney,
        //             prePercent
        //         }
        //         orderFutureIssue.push(temp)
        //     }
        // }

        state.game.orderFutureNum >= jsDynamicConfig.tracemaxtimes && commit(_M.SET_GAME_DATA, {orderFutureNum: tracemaxtimes})
        commit(_M.SET_SUBMIT_DATA, { orderFuture: state.game.orderFutureNum > 0, orderFutureIssue })
        !state.game.isShowOrderFuture && commit(_M.SET_GAME_DATA, { isShowOrderFuture: true })
        commit(_M.SET_SUBMIT_MONEY)
    },
    /**
     * 追號 並修改 SubmitData 的注單資料
     * @param {any} { state, commit }
     */
    [_M.SET_TABLE_ORDER_FUTURE]({ state, commit, getters }) {
        const jsDynamicConfig = getters.currentjsDynamicData
        const gamenumbers = returnState(jsDynamicConfig.gamenumbers)
        let orderFutureIssue = []
        let orderFutureMoneyAmount = 0
        const tracemaxtimes = state.game.orderFutureNum
        const money = state.gameSubmit.ltMoneyAmout
        for (let i = 0; i < tracemaxtimes; i++) {
            orderFutureIssue.push({
                issue: gamenumbers[i].number,
                multiple: 1,
                time: gamenumbers[i].time,
                money,
                checked: true
            })
            orderFutureMoneyAmount += +money
        }
        commit(_M.SET_SUBMIT_DATA, { orderFuture: tracemaxtimes > 0, orderFutureIssue, orderFutureMoneyAmount })
    },
    /**
     * 改變追號類型 並清除追號資料
     * @param {any} { commit }
     * @param {string} { payload } 0: 普通追號 1: 翻倍追號: 2: 盈利率追號
     */
    [_M.SET_ORDER_FUTURE_TYPE]({ state, commit, dispatch }, payload) {
        payload !== state.game.orderFutureType && dispatch(_M.REMOVE_ORDER_FUTURE)
        dispatch(_M.REFRESH_SUBMIT_SUM)
        commit(_M.SET_GAME_DATA, { orderFutureType: payload })
    },
    /**
     * 獎期結束更新追號期數 並修改 SubmitData 的注單資料
     * @param {any} { state, commit }
     */
    [_M.UPDATE_ORDER_FUTURE]({ state, commit, dispatch }) {
        if (!isJsDynamicConfig(state)) {
            dispatch(_M.SET_MESSAGE_BOX_DATA, warnMessageBox({
                // 尚未开放奖期
                message: 'common_118'
            }))
            return
        }
        if (state.gameLtProject < 1) {
            dispatch(_M.SET_MESSAGE_BOX_DATA, warnMessageBox({
                // 号码选择不完整
                message: 'popup_002',
                // 号码选择不完整，请重新选择。
                content: 'popup_003'

            }))
            return
        }
        const lotteryId = nowLotteryId(state)
        const jsDynamicConfig = state.jsDynamicConfig[lotteryId].data
        const gamenumbers = returnState(jsDynamicConfig.gamenumbers)
        let orderFutureIssue = []

        const tracemaxtimes = state.game.orderFutureNum >= jsDynamicConfig.tracemaxtimes
            ? jsDynamicConfig.tracemaxtimes : state.game.orderFutureNum
        for (let i = 0; i < tracemaxtimes; i++) {
            orderFutureIssue.push({
                ...state.gameSubmit.orderFutureIssue[i],
                time: gamenumbers[i].time,
                issue: gamenumbers[i].number,
                isOver: false
            })
        }
        state.game.orderFutureNum >= jsDynamicConfig.tracemaxtimes && commit(_M.SET_GAME_DATA, {orderFutureNum: tracemaxtimes})
        commit(_M.SET_SUBMIT_DATA, { orderFuture: orderFutureIssue.filter(items => items.checked).length > 0, orderFutureIssue })
        !state.game.isShowOrderFuture && commit(_M.SET_GAME_DATA, { isShowOrderFuture: true })
    },
    /**
     * 微調追號倍數 並修改 SubmitData 的注單資料
     * @param {any} { state, commit }
     */
    [_M.SET_CHANGE_ORDER_FUTURE]({ state, commit, getters, dispatch }) {
        // 股票彩不清掉時段
        let resetOrder = { ...resetGameOrder, gameBallData: returnState(state.game.gameBallEmptyData) }
        const menuId = (getters.currentLottery || {}).menuId
        if (+menuId === 7) {
            resetOrder.activeCheckboxes = returnState(state.gameOrder.activeCheckboxes)
        }

        commit(_M.SET_GAME_ORDER_DATA, resetOrder)
        if (state.gameLtProject.length < 1) {
            commit(_M.SET_SUBMIT_DATA, { orderFuture: false })
            commit(_M.SET_SUBMIT_MONEY)
            return
        }
        if (state.gameSubmit.orderFutureIssue.length === 0) {
            commit(_M.SET_SUBMIT_MONEY)
            return
        }
        let orderFutureIssue = returnState(state.gameSubmit.orderFutureIssue)
        // if (state.game.orderFutureType === '2') {
        //     let isSome = true
        //     const ltProject = state.gameLtProject
        //     ltProject.forEach((project) => {
        //         if (ltProject[0].type !== project.type ||
        //             ltProject[0].methodId !== project.methodId ||
        //             ltProject[0].mode !== project.mode) {
        //             isSome = false
        //         }
        //     })
        //     if (!isSome) {
        //         dispatch(_M.SET_MESSAGE_BOX_DATA, warnMessageBox({
        //             message: '盈利率追号不支持混投，请确保您的投注都为同一玩法类型，且元角模式一致。'
        //         }))
        //         dispatch(_M.REMOVE_ORDER_FUTURE)
        //         commit(_M.SET_SUBMIT_MONEY)
        //         return
        //     }
        //     const method = ltProject[0].methodId
        //     const mode = ltProject[0].mode
        //     const util = 1 * (mode === 1 ? 1 : Math.pow(0.1, mode - 1))
        //     const hprize = state.floatPrize.jsPrizePoint[method][0].hprize
        //     const prize = hprize * util
        //     let sumMoney = 0
        //     orderFutureIssue = orderFutureIssue.map((items) => {
        //         items.money = items.multiple * state.gameSubmit.ltMoneyAmout * ltProject.length
        //         sumMoney += items.money
        //         items.bouns = items.multiple * prize * ltProject.length
        //         items.preMoney = items.bouns - sumMoney
        //         items.prePercent = items.preMoney / sumMoney * 100
        //         return items
        //     })
        // } else {
        //     commit(_M.SET_SUBMIT_MONEY)
        //     orderFutureIssue = orderFutureIssue.map((items) => {
        //         items.money = items.multiple * state.gameSubmit.ltMoneyAmout
        //         return items
        //     })
        // }
        commit(_M.SET_SUBMIT_MONEY)
        orderFutureIssue = orderFutureIssue.map((items) => {
            items.money = items.multiple * state.gameSubmit.ltMoneyAmout
            return items
        })
        commit(_M.SET_SUBMIT_DATA, { orderFutureIssue })
        commit(_M.SET_SUBMIT_MONEY)
    },
    /**
     * 刪除追號 並修改SubmitData 的注單資料
     * @param {any} { commit }
     */
    [_M.REMOVE_ORDER_FUTURE]({ commit }) {
        let orderFutureIssue = []
        commit(_M.SET_SUBMIT_DATA, { orderFutureIssue, orderFuture: false })
    },
    /**
     * 追號期數 並修改 SubmitData 的注單資料
     * @param {any} { commit }
     * @param {number} payload 追號期數
     */
    [_M.ORDER_FUTURE_NUMBERS]({ commit }, payload) {
        const orderFutureNum = payload
        commit(_M.SET_GAME_DATA, { orderFutureNum })
    },
    /**
     * 追號間隔 並修改 SubmitData 的注單資料
     * @param {any} { commit }
     * @param {number} payload 追號期數
     */
    [_M.ORDER_FUTURE_OFFSET]({ commit }, payload) {
        const orderFutureOffset = payload
        commit(_M.SET_GAME_DATA, { orderFutureOffset })
    },
    /**
     * 追號間隔倍數 並修改 SubmitData 的注單資料
     * @param {any} { commit }
     * @param {number} payload 追號期數
     */
    [_M.ORDER_FUTURE_OFFSET_MULTIPLE]({ commit }, payload) {
        const orderFutureOffsetMultiple = payload
        commit(_M.SET_GAME_DATA, { orderFutureOffsetMultiple })
    },
    /**
     * 追號預期盈利率 並修改 SubmitData 的注單資料
     * @param {any} { commit }
     * @param {number} payload 追號期數
     */
    [_M.ORDER_FUTURE_PRE_WIN_RATE]({ commit }, payload) {
        const orderFuturePreWinRate = payload
        commit(_M.SET_GAME_DATA, { orderFuturePreWinRate })
    },
    /**
     * 全選/取消 追號勾選項 並修改SubmitData 的注單資料
     * @param {any} { commit }
     * @param {boolean} payload 全選或取消
     */
    [_M.ORDER_FUTURE_CHECK_ALL]({ commit }, payload) {
        let orderFutureIssue = returnState(state.gameSubmit.orderFutureIssue)
        const orderFuture = orderFutureIssue.length > 0 && payload
        let orderFutureMoneyAmount = 0
        orderFutureIssue.forEach((items, index) => {
            orderFutureIssue[index].checked = payload
            if (items.checked) {
                orderFutureMoneyAmount += Math.abs(parseFloat(items.money))
            }
        })
        commit(_M.SET_SUBMIT_DATA, { orderFutureIssue, orderFuture, orderFutureMoneyAmount })
    },
    /**
     * 選取/取消 追號勾選項 並修改SubmitData 的注單資料
     * @param {any} { commit }
     * @param {number} payload 追號序列 index
     */
    [_M.ORDER_FUTURE_CHECK_INDEX]({ commit }, payload) {
        let orderFutureIssue = returnState(state.gameSubmit.orderFutureIssue)
        orderFutureIssue[payload].checked = !orderFutureIssue[payload].checked
        const orderFuture = orderFutureIssue.filter(items => items.checked).length > 0
        let orderFutureMoneyAmount = 0
        orderFutureIssue.forEach(({money, checked}) => {
            if (checked) {
                orderFutureMoneyAmount += Math.abs(parseFloat(money))
            }
        })
        commit(_M.SET_SUBMIT_DATA, { orderFutureIssue, orderFuture, orderFutureMoneyAmount })
    },
    /**
     * 全部追號倍數 並修改SubmitData 的注單資料
     * @param {any} { commit }
     * @param {number} payload 追號倍數
     */
    [_M.ORDER_FUTURE_MULTIPLE_ALL]({ commit }, payload) {
        const orderFutureMultiple = payload // if not number, set to 0
        commit(_M.SET_GAME_DATA, { orderFutureMultiple })
        commit(_M.SET_SUBMIT_MONEY)
    },
    /**
     * 個別追號倍數 追號勾選項 並修改SubmitData 的注單資料
     * @param {any} { commit }
     * @param {number} payload 個別追號 index
     */
    [_M.ORDER_FUTURE_MULTIPLE_INDEX]({ commit, dispatch }, payload) {
        const { index, multiple } = payload
        let orderFutureIssue = returnState(state.gameSubmit.orderFutureIssue)
        orderFutureIssue[index].money = (state.gameSubmit.ltMoneyAmout * multiple).toFixed(2)
        orderFutureIssue[index].multiple = multiple
        commit(_M.SET_SUBMIT_DATA, { orderFutureIssue })
        state.game.orderFutureType === '2' && dispatch(_M.SET_CHANGE_ORDER_FUTURE)
        commit(_M.SET_SUBMIT_MONEY)
    },
    // /**
    //  * 設定投注倍數限制
    //  * @param {any} { commit }
    //  * @param {number} payload 控賠
    //  */
    // [_M.SET_MULTIPLE_LIMIT]({ getters, state, commit }, payload = 0) {
    //     //限制投注倍數
    //     //单注最高奖金限额50万(bonusLimit) ÷ 该玩法单注最高奖金 = 限制倍数（无条件舍去）
    //     const kp = (state.keepPoint / 100).toFixed(3)
    //     const bonusLimit = getters.bonusLimit
    //     const methodId = state.gameOrder.methodId
    //     const mode = state.gameOrder.mode
    //     const unitAdjust = Math.pow(10, mode - 1)
    //     const lotteryId = nowLotteryId(state)
    //     let jsPrizePoint = returnState(state.floatPrize.jsPrizePoint) // list of hprizes
    //     const hprizeIndex = getHprizeIndex(getters, lotteryId)
    //     const curPrizeArr = Object.values(jsPrizePoint[methodId]) //somethime it's arr... sotimetimes it's obj...
    //     const idxOfHprize = curPrizeArr.indexOf(curPrizeArr.reduce((p, e) => (p.hprize > e.hprize) ? p : e)) // for klsf dxds only
    //     const hprize = (curPrizeArr[hprizeIndex] && hprizeIndex !== 0)
    //         ? curPrizeArr[hprizeIndex].hprizeIndex
    //         : curPrizeArr[idxOfHprize].hprize
    //     const prize = (+state.floatPrize.prizeBar[hprize][kp] + payload) / unitAdjust
    //     let betMultiLimit = Math.floor(bonusLimit / prize)
    //     commit(_M.SET_GAME_DATA, { betMultiLimit })
    //     commit(_M.SET_GAME_ORDER_DATA, { betMultiLimit })
    // },
    /**
     * 設定追號倍數限制，以gameSubmit中倍數最低者為準
     * @param {any} { commit }
     */
    [_M.SET_ORDER_FUTURE_MULTIPLE_LIMIT]({ commit }) {
        //限制追號倍數
        //单注最高奖金限额 ÷ 该玩法单注最高奖金 = 限制倍数（无条件舍去）
        const orders = [].concat(state.gameLtProject)
        orders.sort((a, b) => a.betMultiLimit - b.betMultiLimit)
        const exceededMethod = `${i18n.t(orders[0].parentNameKey)}-${i18n.t(orders[0].childNameKey)}`
        const futureMultiLimit = orders[0].betMultiLimit
        commit(_M.SET_GAME_DATA, { futureMultiLimit, exceededMethod })
    },
    /**
     * 中獎後停止勾選項 並修改SubmitData 的注單資料
     * @param {any} { state, commit }
     * @param {boolean} payload 中獎號停止
     */
    [_M.CHANGE_ORDER_FUTURE_BINGOSTOP]({ commit }, payload) {
        const orderFutureBingoStop = payload
        commit(_M.SET_SUBMIT_DATA, { orderFutureBingoStop })
    },
    /**
     * 刪除號碼箱所有注單並修改 SubmitData 的注單資料
     * @param {any} { commit }
     */
    [_M.REMOVE_SUBMIT_ALL_ORDER]({ commit, getters, dispatch }) {
        const ballControlData = returnState(state.game.ballControlEmptyData)

        commit(_M.SET_GAME_DATA, {
            ballControlData,
            isEditIndex: -1,
            isDetailIndex: -1,
            ...resetOrderFuture
        })
        commit(_M.SET_GAME_LT_PROJECT)
        commit(_M.SET_SUBMIT_DATA, {
            orderFuture: false,
            orderFutureIssue: []
        })
        commit(_M.SET_GAME_BOX_TEMP)
        // 股票彩不清掉時段
        let resetOrder = { ...resetGameOrder, gameBallData: returnState(state.game.gameBallEmptyData) }
        const menuId = (getters.currentLottery || {}).menuId
        if (+menuId === 7) {
            resetOrder.activeCheckboxes = returnState(state.gameOrder.activeCheckboxes)
        }
        commit(_M.SET_GAME_ORDER_DATA, resetOrder)

        commit(_M.SET_SUBMIT_MONEY)
        dispatch(_M.SET_GAME_SHOW_MODE)
        dispatch(_M.SET_HEADER_NAV_IS_BACK, false)
    },
    /**
     * 刪除號碼箱某隻注單並修改 SubmitData 的注單資料
     * @param {any} { state, commit, dispatch }
     * @param {number} payload 移除某之投注單的位置 index
     */
    [_M.REMOVE_SUBMIT_ORDER_INDEX]({ state, commit, dispatch }, payload) {
        //如果全清空要出現提示窗
        if (state.gameLtProject.length === 1) {
            dispatch(_M.REMOVE_SUBMIT_ALL_ORDER)
            return
        } else {
            commit(_M.SET_GAME_BOX_TEMP, { gameOrder: state.gameLtProject[payload], isSave: false })
        }
        const ballControlData = returnState(state.game.ballControlEmptyData)
        commit(_M.SET_GAME_DATA, {
            ballControlData,
            isEditIndex: -1,
            isDetailIndex: -1
        })
        commit(_M.SET_GAME_LT_PROJECT, { type: 3, index: payload })
        dispatch(_M.SET_CHANGE_ORDER_FUTURE)
    },
    /**
     * 確認投注功能
     * @param {any} { state, commit }
     */
    async [_M.GAME_ORDER_SUBMIT]({ state, commit, dispatch, rootGetters }, payload) {
        //需判斷有無獎期
        if (!isJsDynamicConfig(state)) {
            dispatch(_M.SET_MESSAGE_BOX_DATA, warnMessageBox({
                // 尚未开放奖期
                message: 'common_118'
            }))
            return
        }

        // 需判斷號碼選擇有無完整
        if (state.gameLtProject.length < 1) {
            dispatch(_M.SET_MESSAGE_BOX_DATA, warnMessageBox({
                // 号码选择不完整
                message: 'popup_002',
                // 号码选择不完整，请重新选择。
                content: 'popup_003'
            }))
            return
        }

        //比較觸發時的期號及彈窗afterConfirm觸發時的期號
        const initialIssue = rootGetters.lastnumber

        //投注
        const submit = async (instance) => {
            // 投注中...
            instance.confirmDataText = 'popup_016'
            const orderFutureIssue = state.gameSubmit.orderFutureIssue.filter(items => items.checked)
            const ltProject = []
            state.gameLtProject.forEach((items) => {
                const times = state.gameSubmit.orderFuture ? 1 : items.times
                const money = (state.gameSubmit.orderFuture ? ((items.money * 1000) / (items.times * 1000)) : items.money).strip()
                const mode = state.gameSubmit.modes.split(',').indexOf(items.mode.toString()) + 1
                let project = {
                    digitstr: items.digitstr,
                    methodId: items.methodId,
                    codes: items.codes,
                    scode_key: items.scode_key,
                    nums: items.nums,
                    type: items.type,
                    typeName: items.typeName,
                    omodel: items.omodel,
                    mode,
                    keepPoint: items.keepPoint,
                    times,
                    money,
                    hprize: items.hprize,
                    onePrice: items.onePrice
                }
                if (items.type === 'input') {
                    project.codes = b64EncodeUnicodeBytes(lzma.compress(items.codes, 1))
                }
                // 殺對子
                if (items.killPairEnabled && rootGetters.gameConfigData.shaduizi.includes(+items.methodId)) {
                    project.selectType = 'shaduizi'
                }
                // 自訂獎期(ex:股票彩一日兩期)
                if (items.issue) {
                    project.issue = items.issue
                }

                ltProject.push(project)
            })
            const params = {
                subject: 'intro',
                ...state.gameSubmit,
                ltProject,
                timestemp: +new Date(),
                orderFutureIssue
            }
            const res = await handleAjax(API.gameOrder, params, rootGetters)
            if (!res) {
                return Promise.resolve(-999)
            }
            const errorCode = +res.result
            if (errorCode === 0) {
                const search = {
                    startDate: today(),
                    endDate: today(),
                    lotteryId: state.gameSubmit.lotteryId,
                    issue: res.params.ltIssueStart
                }
                const urlCode = b64EncodeUnicode(JSON.stringify(search))
                const routerUrl = state.gameSubmit.orderFuture ? `/AddNewGameInfo/${urlCode}` : `/GameInfo/${urlCode}`
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

                dispatch(_M.SET_MESSAGE_BOX_DATA, warnMessageBox(betDoneDialog(res, routerUrl, rootGetters)))
                dispatch(_M.GET_HISTORY_ORDER)
                dispatch(_M.REMOVE_SUBMIT_ALL_ORDER)
                commit(_M.SET_DIFF_PRIZE_DATA, {})
            } else if (errorCode === 9501) { //停售
                dispatch(_M.SET_MESSAGE_BOX_DATA, warnMessageBox({
                    // '玩法已停售'
                    message: 'popup_070',
                    // '系统已为您过滤停售玩法，请再次确认。'
                    content: 'popup_080',
                    isShowCloseIcon: false,
                    afterConfirm: () => {
                        const isNextIssue = initialIssue !== this.getters.lastnumber
                        if (isNextIssue) return

                        const stopMethodIds = res.data.Stop
                        const arr = state.gameLtProject.filter((item) => {
                            const isStopped = stopMethodIds.includes(+item.methodId)
                            return !isStopped
                        })
                        commit(_M.SET_GAME_LT_PROJECT, {type: 4, data: arr})
                        updateBlockedMethods(res.data.Stop, {state, commit, dispatch, rootGetters})
                        if (arr.length === 0) {
                            dispatch(_M.SET_GAME_SHOW_MODE) //320退回投注頁
                            dispatch(_M.REMOVE_SUBMIT_ALL_ORDER) //停售隱藏追號欄
                        }
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
                        const overMethodIds = res.data.Over
                        const arr = state.gameLtProject.map((item) => {
                            const isOver = overMethodIds.includes(+item.methodId)
                            const _item = {...item, isOver}
                            return _item
                        })
                        commit(_M.SET_GAME_LT_PROJECT, {type: 4, data: arr})
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
                        const overMethodIds = res.data.Over
                        const stopMethodIds = res.data.Stop
                        const arr = state.gameLtProject.filter((item) => {
                            const isStopped = stopMethodIds.includes(+item.methodId)
                            return !isStopped
                        }).map((item) => {
                            const isOver = overMethodIds.includes(+item.methodId)
                            const _item = {...item, isOver}
                            return _item
                        })
                        commit(_M.SET_GAME_LT_PROJECT, {type: 4, data: arr})

                        updateBlockedMethods(res.data.Stop, {state, commit, dispatch, rootGetters})
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
                        const overMethodIds = res.data.OverBonus
                        const arr = state.gameLtProject.map((item) => {
                            const isOver = overMethodIds.includes(item.methodId)
                            const _item = {...item, isOver}
                            return _item
                        })
                        commit(_M.SET_GAME_LT_PROJECT, {type: 4, data: arr})
                    }
                }))
            } else if (errorCode === 9505) { //用戶限額
                dispatch(_M.SET_MESSAGE_BOX_DATA, warnMessageBox({
                    // '追号超出最大投注倍数'
                    message: 'popup_133',
                    // '请重新确认投注倍数。'
                    content: 'popup_134',
                    isShowCloseIcon: false,
                    afterConfirm: () => {
                        const tasks = res.data.TaskOverBonus
                        let orderFutureIssue = returnState(state.gameSubmit.orderFutureIssue).map((item) => {
                            item.isOver = !!tasks.find(({issue}) => issue === item.issue)
                            return item
                        })
                        commit(_M.SET_SUBMIT_DATA, { orderFutureIssue })
                    }
                }))
            } else if (errorCode === 9402) { // 賠率不同時更新處理
                //update all order item
                await dispatch(_M.SET_FLOAT_PRIZE_AND_BLOCKED_METHODS)
                dispatch(_M.SET_MESSAGE_BOX_DATA, warnMessageBox({
                    message: res.message_key || res.message,
                    // '您的投注奖金已更新，请重新确认。'
                    content: 'popup_132',
                    isShowCloseIcon: false
                }))
                instance.$root.$emit('updateBonus')
            } else if (errorCode === 8104) { //追号超出限额或已停售
                dispatch(_M.SET_MESSAGE_BOX_DATA, warnMessageBox({
                    // '投注失败',
                    message: 'popup_104',
                    // '追号超出限额或已停售，无法完成投注。',
                    content: 'popup_103'
                }))
            } else if (errorCode === 9007) { //杀对子已关闭，请重新投注。
                await dispatch(_M.GET_GAME_PLAY_MENU_DATA, nowLotteryId(state))
                dispatch(_M.SET_MESSAGE_BOX_DATA, warnMessageBox({
                    // '杀对子已关闭，请重新投注。',
                    message: res.message_key || res.message
                }))
            }
            return Promise.resolve(errorCode)
        }

        const skipDialog = rootGetters.RWDMode === 3
        if (skipDialog) {
            if (isFetching) {
                return
            }
            isFetching = true
            await submit(payload)
            isFetching = false
        } else {
            //跳彈窗
            dispatch(_M.SET_MESSAGE_BOX_DATA, gameSumbitBox({
                fast: false,
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
    },
    /**
     * 直接投注功能
     * @param {any} { state, commit }
     */
    async [_M.FAST_GAME_ORDER_SUBMIT]({ state, commit, getters, rootGetters, dispatch }, payload) {
        //需判斷號碼選擇有無完整
        if (state.gameOrder.nums <= parseInt(0) || !state.gameOrder.times) {
            dispatch(_M.SET_MESSAGE_BOX_DATA, warnMessageBox({
                // 号码选择不完整
                message: 'popup_002',
                // 杀对子后已无号码，请重新选择。 : 号码选择不完整，请重新选择。
                content: (getters.killPairEnabled) ? 'popup_105' : 'popup_003'
            }))
            return
        }
        //需判斷有無獎期
        if (!isJsDynamicConfig(state)) {
            dispatch(_M.SET_MESSAGE_BOX_DATA, warnMessageBox({
                // 尚未开放奖期
                message: 'common_118'
            }))
            return
        }
        const mode = state.gameSubmit.modes.split(',').indexOf(state.gameOrder.mode.toString()) + 1

        const gameBallCombine = getters.gameOrder.gameBallCombine
        let ltProject = []
        let resetOrder = {
            ...resetGameOrder,
            gameBallData: returnState(state.game.gameBallEmptyData)
        }

        // 有拆單的狀況 (ex:股票彩)
        if (gameBallCombine.length) {
            dispatch(_M.SET_PROJECT_TEMP, {type: 5})
            // 投注成功後不清掉勾選的時段
            resetOrder.activeCheckboxes = returnState(state.gameOrder.activeCheckboxes)
        } else {
            ltProject.push({
                digitstr: state.gameOrder.digitstr,
                methodId: state.gameOrder.methodId,
                codes: state.gameOrder.codes,
                scode_key: state.gameOrder.scode_key,
                nums: state.gameOrder.nums,
                type: state.gameOrder.type,
                typeName: state.gameOrder.typeName,
                money: (state.gameOrder.money).strip(),
                omodel: state.gameOrder.omodel,
                mode,
                times: +state.gameOrder.times,
                onePrice: state.gameOrder.onePrice,
                hprize: state.gameOrder.hprize,
                keepPoint: rootGetters.kp
            })
            if (ltProject[0].type === 'input') {
                ltProject[0].codes = b64EncodeUnicodeBytes(lzma.compress(ltProject[0].codes, 1))
            }
            // 殺對子
            if (getters.killPairEnabled) {
                ltProject[0].selectType = 'shaduizi'
            }
        }

        //比較觸發時的期號及彈窗afterConfirm觸發時的期號
        const initialIssue = rootGetters.lastnumber

        const submit = async (instance) => {
            const ballControlData = returnState(state.game.ballControlEmptyData)
            let { ltIssueStart, lotteryId } = state.gameSubmit
            let {nums, money} = state.gameOrder

            // ltProject 為空時從暫存箱(ltProjectTemp)取得
            if (ltProject.length === 0) {
                ltProject = returnState(state.gameOrder.ltProjectTemp)
                nums = ltProject.length
                money = ltProject.reduce((sum, oneProjet) => {
                    sum += oneProjet.money
                    return sum
                }, 0)
                // ltIssueStart用第一項的issue
                ltIssueStart = ltProject[0].issue || ltIssueStart
            }

            const params = {
                subject: 'intro',
                lotteryId,
                ltProject,
                ltProjectNum: nums,
                ltMoneyAmout: money,
                ltIssueStart,
                timestemp: +new Date(),
                orderFuture: false
            }
            const res = await handleAjax(API.gameOrder, params, rootGetters)
            if (!res) {
                return Promise.resolve(-999)
            }
            const errorCode = +res.result
            if (errorCode === 0) {
                const search = {startDate: today(), endDate: today(), lotteryId, issue: res.params.ltIssueStart}
                const urlCode = b64EncodeUnicode(JSON.stringify(search))
                const routerUrl = `/GameInfo/${urlCode}`
                const { availablebalance } = res.data
                availablebalance && commit(_M.SET_WALLET_BALANCE, availablebalance)
                commit(_M.SET_OFFSET_GET_BALANCE_NUM, 1)
                dispatch(_M.SET_MESSAGE_BOX_DATA, warnMessageBox(betDoneDialog(res, routerUrl, rootGetters)))
                dispatch(_M.GET_HISTORY_ORDER)
                commit(_M.SET_GAME_ORDER_DATA, resetOrder)
                commit(_M.SET_GAME_DATA, { isEditIndex: -1, ballControlData })
                commit(_M.SET_DIFF_PRIZE_DATA, {})
                // 成功投注清空暫存箱
                commit(_M.SET_PROJECT_TEMP)
            } else if (errorCode === 9501 || errorCode === 9503) { //停售
                dispatch(_M.SET_MESSAGE_BOX_DATA, warnMessageBox({
                    // '玩法已停售'
                    message: 'popup_070',
                    // '您投注的玩法已停售。'
                    content: 'popup_079',
                    isShowCloseIcon: false,
                    afterConfirm: () => {
                        const isNextIssue = initialIssue !== this.getters.lastnumber
                        if (isNextIssue) return

                        updateBlockedMethods(res.data.Stop, {state, commit, dispatch, rootGetters})
                    }
                }))
            } else if (errorCode === 9502 || errorCode === 9504) { //超出停押值
                dispatch(_M.SET_MESSAGE_BOX_DATA, warnMessageBox({
                    // '超过投注限额'
                    message: 'popup_081',
                    // '<span class="text_color_strong">超过投注限额</span>，请重新确认投注内容。'
                    content: 'popup_097'
                }))
            } else if (errorCode === 9402) { // 賠率不同時更新處理
                //update current gametype
                await dispatch(_M.SET_FLOAT_PRIZE_AND_BLOCKED_METHODS)
                dispatch(_M.SET_MESSAGE_BOX_DATA, warnMessageBox({
                    message: res.message_key || res.message,
                    // '您的投注奖金已更新，请重新确认。'
                    content: 'popup_132',
                    isShowCloseIcon: false
                }))
                instance.$root.$emit('updateBonus')
            } else if (errorCode === 9007) { //殺對子未開啟
                await dispatch(_M.GET_GAME_PLAY_MENU_DATA, nowLotteryId(state))
                dispatch(_M.SET_MESSAGE_BOX_DATA, warnMessageBox({
                    // '杀对子已关闭，请重新投注。',
                    message: res.message_key || res.message
                }))
            }
            return Promise.resolve(errorCode)
        }

        const skipDialog = rootGetters.RWDMode === 3
        if (skipDialog) {
            if (isFetching) {
                return
            }
            isFetching = true
            await submit(payload)
            isFetching = false
        } else {
            dispatch(_M.SET_MESSAGE_BOX_DATA, gameSumbitBox({
                fast: true,
                beforeConfirm: async (instance) => {
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
    },
    /**
     * 信用玩法立即投注功能
     * @param {any} { state, commit }
     */
    async [_M.CREDIT_GAME_ORDER_SUBMIT]({ state, commit, getters, rootGetters, dispatch }) {
        const creditGameLtProjectValueArr = Object.values(state.creditGameLtProject)
        // 停售
        let hasBlocked = creditGameLtProjectValueArr.some(({ title, methodId }) => {
            return state.blockedMethods[methodId + '_' + title]
        })
        if (hasBlocked) {
            const shouldContinue = await new Promise((resolve) => {
                filterSinLtProject({Stop: Object.keys(state.blockedMethods)}, {state, commit})
                const orderIsEmpty = Object.values(state.creditGameLtProject).length === 0
                dispatch(_M.SET_MESSAGE_BOX_DATA, warnMessageBox({
                    // 玩法已停售
                    message: $t('popup_070'),
                    // 系统已为您过滤停售玩法，请再次确认。
                    content: $t(`popup_080`),
                    afterConfirm: () => {
                        resolve(!orderIsEmpty)
                    },
                    beforeCancel: () => {
                        resolve(false)
                    }
                }))
            })
            if (!shouldContinue) return
            else filterSinLtProject({Stop: Object.keys(state.blockedMethods)}, {state, commit})
        }

        //需判斷號碼選擇有無完整
        let isShow = true
        if (creditGameLtProjectValueArr.length === 0) {
            dispatch(_M.SET_MESSAGE_BOX_DATA, warnMessageBox({
                // 号码选择不完整
                message: 'popup_002',
                // 号码选择不完整，请重新选择。
                content: 'popup_003'
            }))
            return
        }

        // 超过投注限制
        creditGameLtProjectValueArr.find(({
            money,
            hprize,
            title_key,
            upperName_key
        }) => {
            const calcHprize = `${hprize}`.split('/').max()
            const bonusLimit = getters.bonusLimit
            if (money * calcHprize > bonusLimit) {
                isShow = false
                // title_key ex: 'mark6_t_036,mark6_t_037'
                const formatTitle = title_key ? title_key.split(',').map(onekey => $t(onekey)).join(',') : ''
                const conjunction = ($t(upperName_key) !== '' && formatTitle !== '') ? ' : ' : ''
                const key = $t(upperName_key) + conjunction + formatTitle
                dispatch(_M.SET_MESSAGE_BOX_DATA, warnMessageBox({
                    // 超过投注限制
                    message: 'popup_035',
                    // 您于【{0}】的投注金额已超过最高投注上限，请重新选择。
                    content: $t('popup_074', { '0': key })
                }))
                return true
            }
        })

        // //需判斷有無獎期
        if (!isJsDynamicConfig(state)) {
            dispatch(_M.SET_MESSAGE_BOX_DATA, warnMessageBox({
                // 尚未开放奖期
                message: 'common_118'
            }))
            return
        }
        if (isShow) {
            dispatch(_M.SET_MESSAGE_BOX_DATA, gameSumbitBox({
                beforeConfirm: (instance) => {
                    instance.isShowLocalCancelBtn = false
                    instance.isShowLocalCloseIcon = false
                    return new Promise(async(resolve) => {
                        const creditGameLtProjectValueArr = Object.values(state.creditGameLtProject)
                        const validInput = creditGameLtProjectValueArr.find(obj => {
                            if (obj.money === 0) {
                                dispatch(_M.SET_MESSAGE_BOX_DATA, warnMessageBox({
                                    // 投注金额错误
                                    message: 'popup_036',
                                    // 投注金额不得为0，请重新选择。
                                    content: 'popup_062'
                                }))
                                return true
                            }
                        })
                        if (!validInput) {
                            const creditGameLtProject = returnState(state.creditGameLtProject)
                            const ltProject = Object.values(creditGameLtProject)
                            // Add missing properties
                            ltProject.forEach((arr) => {
                                arr.money = (arr.money).strip()
                                arr.digitstr = ''
                                arr.nums = arr.nums || 1
                                arr.type = 'digital'
                                arr.omodel = 2
                                arr.mode = 1
                                arr.times = 1
                                arr.onePrice = arr.money
                                if (arr.methodId.indexOf('-') !== -1) {
                                    arr.methodId = arr.methodId.split('-')[0]
                                }
                                return arr
                            })
                            const ballControlData = returnState(state.game.ballControlEmptyData)
                            const {
                                ltIssueStart,
                                lotteryId
                            } = state.gameSubmit
                            const params = {
                                subject: 'intro',
                                lotteryId,
                                ltProject,
                                ltProjectNum: state.gameSubmit.ltProjectNum,
                                ltMoneyAmout: state.gameSubmit.ltMoneyAmout,
                                ltIssueStart,
                                timestemp: +new Date(),
                                orderFuture: false
                            }
                            const res = await handleAjax(API.gameOrder, params, rootGetters)
                            if (!res) {
                                return resolve(true)
                            }
                            const errorCode = +res.result
                            if (errorCode === 0) {
                                const search = {startDate: today(), endDate: today(), lotteryId, issue: res.params.ltIssueStart}
                                const urlCode = b64EncodeUnicode(JSON.stringify(search))
                                const routerUrl = `/GameInfo/${urlCode}`
                                const { availablebalance } = res.data
                                availablebalance && commit(_M.SET_WALLET_BALANCE, availablebalance)
                                commit(_M.SET_OFFSET_GET_BALANCE_NUM, 1)
                                dispatch(_M.SET_MESSAGE_BOX_DATA, warnMessageBox(betDoneDialog(res, routerUrl, rootGetters)))
                                const params = {
                                    // startDate: moment().utcOffset('+0800').subtract(7, 'days').format('YYYY-MM-DD'),
                                    startDate: today(),
                                    endDate: today()
                                }
                                dispatch(_M.SET_GAME_INFO_DATA, params)
                                dispatch(_M.GET_GAME_INFO_LIST)
                                commit(_M.SET_GAME_ORDER_DATA, { ...resetGameOrder, gameBallData: returnState(state.game.gameBallEmptyData) })
                                commit(_M.SET_GAME_DATA, { isEditIndex: -1, ballControlData })
                                commit(_M.SET_CREDIT_GAME_LT_PROJECT)
                                commit(_M.SET_DIFF_PRIZE_DATA, {})
                                commit(_M.SET_OVERLIMIT_METHODS, {})
                                commit(_M.SET_BONUS_OVERLIMIT_METHODS, {})
                                resolve(false)
                            } else if (errorCode === 9401) { // 賠率不同時更新處理
                                await dispatch(_M.SET_FLOAT_PRIZE_AND_BLOCKED_METHODS)
                                dispatch(_M.SET_MESSAGE_BOX_DATA, warnMessageBox({
                                    message: res.message_key || res.message,
                                    // '您的投注赔率已更新，请重新确认。'
                                    content: 'popup_073',
                                    isShowCloseIcon: false,
                                    afterConfirm: () => Object.keys(state.creditGameLtProject).length && dispatch(_M.CREDIT_GAME_ORDER_SUBMIT)
                                }))
                                resolve(true)
                            } else if (errorCode === 9501) { //停售
                                // await dispatch(_M.SET_FLOAT_PRIZE_AND_BLOCKED_METHODS)
                                dispatch(_M.SET_MESSAGE_BOX_DATA, warnMessageBox({
                                    // '玩法已停售'
                                    message: 'popup_070',
                                    // '您的投注赔率已更新，请重新确认。'
                                    content: 'popup_080',
                                    isShowCloseIcon: false,
                                    afterConfirm: () => {
                                        filterSinLtProject(res.data, {state, commit})
                                        updateBlockedMethods(res.data.Stop, {state, commit, dispatch, rootGetters})
                                        Object.keys(state.creditGameLtProject).length && dispatch(_M.CREDIT_GAME_ORDER_SUBMIT)
                                    }
                                }))
                                resolve(true)
                            } else if (errorCode === 9502) { //封鎖超過投注限額
                                dispatch(_M.SET_MESSAGE_BOX_DATA, warnMessageBox({
                                    // '超过投注限额'
                                    message: 'popup_081',
                                    // <span class="text_color_strong">超过投注限额</span>，请重新确认投注内容。'
                                    content: 'popup_097',
                                    isShowCloseIcon: false,
                                    afterConfirm: () => {
                                        filterSinLtProject(res.data, {state, commit})
                                        dispatch(_M.CREDIT_GAME_ORDER_SUBMIT)
                                    }
                                }))
                                resolve(true)
                            } else if (errorCode === 9503) { //停售 & 封鎖超過投注限額
                                dispatch(_M.SET_MESSAGE_BOX_DATA, warnMessageBox({
                                    // '部分玩法已停售且超过投注限额'
                                    message: 'popup_093',
                                    // '系统已为您过滤停售项目。请重新确认<span class="text_color_strong">超过投注限额</span>的投注内容。'
                                    content: 'popup_084',
                                    isShowCloseIcon: false,
                                    afterConfirm: () => {
                                        filterSinLtProject(res.data, {state, commit})
                                        updateBlockedMethods(res.data.Stop, {state, commit, dispatch, rootGetters})
                                        Object.keys(state.creditGameLtProject).length && dispatch(_M.CREDIT_GAME_ORDER_SUBMIT)
                                    }
                                }))
                                resolve(true)
                            } else if (errorCode === 9504) { // 投注项投注用戶限額
                                dispatch(_M.SET_MESSAGE_BOX_DATA, warnMessageBox({
                                    // '超过投注限额'
                                    message: res.message_key,
                                    // '<span class="text_color_strong">超过投注限额</span>，请重新确认投注内容。'
                                    // '超过投注限额，请重新确认投注内容。'
                                    content: 'popup_097',
                                    isShowCloseIcon: false,
                                    afterConfirm: () => {
                                        filterSinLtProject(res.data, {state, commit})
                                        dispatch(_M.CREDIT_GAME_ORDER_SUBMIT)
                                    }
                                }))
                                resolve(true)
                            }
                        } else {
                            resolve(true)
                        }
                    })
                }
            }))
        }
    },
    /**
     * 320 信用玩法立即投注功能
     * @param {any} { state, commit }
     */
    async [_M.MOBILE_CREDIT_GAME_ORDER_SUBMIT]({ state, commit, getters, rootGetters, dispatch }) {
        let isShow = true
        const creditGameLtProjectValueArr = Object.values(state.creditGameLtProject)
        // if (creditGameLtProjectKeyArr.length === 0) {
        //     dispatch(_M.SET_MESSAGE_BOX_DATA, warnMessageBox({
        //         message: '号码选择不完整',
        //         content: '号码选择不完整，请重新选择。'
        //     }))
        //     return
        // }
        // //需判斷有無獎期
        if (!isJsDynamicConfig(state)) {
            dispatch(_M.SET_MESSAGE_BOX_DATA, warnMessageBox({
                // 尚未开放奖期
                message: 'common_118'
            }))
            return Promise.resolve(true)
        }
        creditGameLtProjectValueArr.find(({
            money,
            hprize,
            title_key,
            upperName_key
        }) => {
            const calcHprize = `${hprize}`.split('/').max()
            const bonusLimit = getters.bonusLimit
            if (money * calcHprize > bonusLimit) {
                isShow = false
                const formatTitle = title_key ? title_key.split(',').map(onekey => $t(onekey)).join(', ') : ''
                const conjunction = ($t(upperName_key) !== '' && formatTitle !== '') ? ' : ' : ''
                const key = $t(upperName_key) + conjunction + formatTitle
                dispatch(_M.SET_MESSAGE_BOX_DATA, warnMessageBox({
                    // 超过投注限制
                    message: 'popup_035',
                    // 您于【{0}】的投注金额已超过最高投注上限，请重新选择。
                    content: $t('popup_074', { '0': key })
                }))
                return true
            }
            if (money === 0) {
                isShow = false
                dispatch(_M.SET_MESSAGE_BOX_DATA, warnMessageBox({
                    // 投注金额错误
                    message: 'popup_036',
                    // 投注金额不得为0，请重新选择。
                    content: 'popup_062'
                }))
                return true
            }
        })
        return new Promise(async (resolve) => {
            if (isShow) {
                const validInput = creditGameLtProjectValueArr.find(obj => {
                    if (obj.money === 0) {
                        dispatch(_M.SET_MESSAGE_BOX_DATA, warnMessageBox({
                            // 投注金额错误
                            message: 'popup_036',
                            // 投注金额不得为0，请重新选择。
                            content: 'popup_062'
                        }))
                        return true
                    }
                })
                if (!validInput) {
                    const creditGameLtProject = returnState(state.creditGameLtProject)
                    const ltProject = Object.values(creditGameLtProject)
                    // Add missing properties
                    ltProject.forEach((arr) => {
                        arr.money = (arr.money).strip()
                        arr.digitstr = ''
                        arr.nums = arr.nums || 1
                        arr.type = 'digital'
                        arr.omodel = 2
                        arr.mode = 1
                        arr.times = 1
                        arr.onePrice = arr.money
                        if (arr.methodId.indexOf('-') !== -1) {
                            arr.methodId = arr.methodId.split('-')[0]
                        }
                        return arr
                    })
                    const ballControlData = returnState(state.game.ballControlEmptyData)
                    const {
                        ltIssueStart,
                        lotteryId
                    } = state.gameSubmit
                    const params = {
                        subject: 'intro',
                        lotteryId,
                        ltProject,
                        ltProjectNum: state.gameSubmit.ltProjectNum,
                        ltMoneyAmout: state.gameSubmit.ltMoneyAmout,
                        ltIssueStart,
                        timestemp: +new Date(),
                        orderFuture: false
                    }
                    const res = await handleAjax(API.gameOrder, params, rootGetters)
                    if (!res) {
                        return resolve(true)
                    }
                    const errorCode = +res.result
                    if (errorCode === 0) {
                        const search = {startDate: today(), endDate: today(), lotteryId, issue: res.params.ltIssueStart}
                        const urlCode = b64EncodeUnicode(JSON.stringify(search))
                        const routerUrl = `/GameInfo/${urlCode}`
                        const { availablebalance } = res.data
                        availablebalance && commit(_M.SET_WALLET_BALANCE, availablebalance)
                        commit(_M.SET_OFFSET_GET_BALANCE_NUM, 1)
                        dispatch(_M.SET_MESSAGE_BOX_DATA, warnMessageBox(betDoneDialog(res, routerUrl, rootGetters)))
                        dispatch(_M.SET_GAME_SHOW_MODE)
                        commit(_M.SET_CREDIT_GAME_LT_PROJECT)
                        commit(_M.SET_GAME_ORDER_DATA, { ...resetGameOrder, gameBallData: returnState(state.game.gameBallEmptyData) })
                        commit(_M.SET_GAME_DATA, { isEditIndex: -1, ballControlData })
                        commit(_M.SET_HEADER_NAV_IS_BACK, false)
                        commit(_M.SET_SUBMIT_DATA, { ltMoneyAmout: 0, ltProjectNum: 0 })
                        commit(_M.SET_DIFF_PRIZE_DATA, {})
                        commit(_M.SET_OVERLIMIT_METHODS, {})
                        commit(_M.SET_BONUS_OVERLIMIT_METHODS, {})
                        return resolve(false)
                    } else if (errorCode === 9501) { //停售
                        dispatch(_M.SET_MESSAGE_BOX_DATA, warnMessageBox({
                            // '玩法已停售'
                            message: 'popup_070',
                            // '系统已为您过滤停售项目，请再次确认。'
                            content: 'popup_094',
                            isShowCloseIcon: false,
                            afterConfirm: () => {
                                filterSinLtProject(res.data, {state, commit})
                                updateBlockedMethods(res.data.Stop, {state, commit, dispatch, rootGetters})
                                !Object.keys(state.creditGameLtProject).length && dispatch(_M.SET_GAME_SHOW_MODE) //320退回投注頁
                            }
                        }))
                        resolve(true)
                    } else if (errorCode === 9502) { //封鎖超過投注限額
                        dispatch(_M.SET_MESSAGE_BOX_DATA, warnMessageBox({
                            // '超过投注限额'
                            message: 'popup_081',
                            // <span class="text_color_strong">超过投注限额</span>，请重新确认投注内容。
                            content: 'popup_097',
                            isShowCloseIcon: false,
                            afterConfirm: () => {
                                filterSinLtProject(res.data, {state, commit})
                            }
                        }))
                        resolve(true)
                    } else if (errorCode === 9503) { //停售 & 封鎖超過投注限額
                        dispatch(_M.SET_MESSAGE_BOX_DATA, warnMessageBox({
                            // '部分玩法已停售且超过投注限额'
                            message: 'popup_093',
                            // '系统已为您过滤停售项目。请重新确认<span class="text_color_strong">超过投注限额</span>的投注内容。'
                            content: 'popup_084',
                            isShowCloseIcon: false,
                            afterConfirm: () => {
                                filterSinLtProject(res.data, {state, commit})
                                updateBlockedMethods(res.data.Stop, {state, commit, dispatch, rootGetters})
                                !Object.keys(state.creditGameLtProject).length && dispatch(_M.SET_GAME_SHOW_MODE) //320退回投注頁
                            }
                        }))
                        resolve(true)
                    } else if (errorCode === 9504) { // 投注项投注用戶限額
                        dispatch(_M.SET_MESSAGE_BOX_DATA, warnMessageBox({
                            // '超过投注限额'
                            message: res.message_key,
                            // '<span class="text_color_strong">超过投注限额</span>，请重新确认投注内容。'
                            content: 'popup_097',
                            isShowCloseIcon: false,
                            afterConfirm: () => {
                                filterSinLtProject(res.data, {state, commit})
                            }
                        }))
                        resolve(true)
                    } else if (errorCode === 9401) { // 賠率不同時更新處理
                        await dispatch(_M.SET_FLOAT_PRIZE_AND_BLOCKED_METHODS)
                        dispatch(_M.SET_MESSAGE_BOX_DATA, warnMessageBox({
                            message: res.message_key || res.message,
                            // '您的投注赔率已更新，请重新确认。'
                            content: 'popup_073',
                            afterConfirm: () => {
                                if (Object.keys(state.creditGameLtProject).length === 0) {
                                    dispatch(_M.SET_GAME_SHOW_MODE, 0)
                                    dispatch(_M.SET_HEADER_NAV_IS_BACK, false)
                                }
                            }
                        }))
                        resolve(true)
                    }
                } else {
                    resolve(true)
                }
            } else {
                resolve(true)
            }
        })
    },
    /**
     * 桌面玩法投注功能
     * @param {any} { state, commit }
     * @param {Vue} payload vue 的實例
     */
    async [_M.TABLE_GAME_ORDER_SUBMIT]({ state, commit, rootGetters, dispatch }, payload) {
        const instance = payload
        let isShow = true
        return new Promise(async (resolve) => {
            if (isShow) {
                const creditGameLtProject = returnState(state.creditGameLtProject)
                const ltProject = Object.values(creditGameLtProject)
                // Add missing properties
                ltProject.forEach((arr) => {
                    arr.money = (arr.money).strip()
                    arr.digitstr = ''
                    arr.nums = arr.nums || 1
                    arr.type = 'digital'
                    arr.omodel = 2
                    arr.mode = 1
                    arr.times = 1
                    arr.onePrice = arr.money
                    if (arr.methodId.indexOf('-') !== -1) {
                        arr.methodId = arr.methodId.split('-')[0]
                    }
                    return arr
                })
                const params = {
                    ...state.gameSubmit,
                    ltProject,
                    timestemp: +new Date()
                }
                const res = await handleAjax(API.gameOrder, params, rootGetters)
                // 銷毀投注彈窗
                instance.gameSubmitPopDestroy()
                if (!res) {
                    return resolve(true)
                }
                const errorCode = +res.result
                if (errorCode === 0) {
                    const { availablebalance } = res.data
                    availablebalance && commit(_M.SET_WALLET_BALANCE, availablebalance)
                    commit(_M.SET_OFFSET_GET_BALANCE_NUM, 1)
                    // const msgWithParm = res.message_param
                    //     ? instance.$t(res.message_key, res.message_param.map(param => instance.$t(param)))
                    //     : instance.$t(res.message_key)
                    //部份追号超出限额或停售
                    const stopNum = +res.data.TaskStopBet
                    if (!!stopNum) {
                        instance.$msg({
                            // '部份追号超出限额或停售'
                            message: 'popup_102',
                            // '系统已为您取消已停售的{0}注追号内容。'
                            content: $t('popup_086', {0: stopNum})
                        })
                    } else {
                        const betmes = `${instance.$t('common_001', {'0': res.params.ltIssueStart})}`
                        instance.drawBetSuccess(betmes)
                    }
                    instance.resetSpriteStatus()
                    // commit(_M.SET_GAME_ORDER_DATA, { ...resetGameOrder, gameBallData: returnState(state.game.gameBallEmptyData) })
                    dispatch(_M.REMOVE_ORDER_FUTURE)
                    commit(_M.SET_SUBMIT_DATA, { ltMoneyAmout: 0, ltProjectNum: 0 })
                    commit(_M.SET_DIFF_PRIZE_DATA, {})
                    commit(_M.SET_OVERLIMIT_METHODS, {})
                    commit(_M.SET_BONUS_OVERLIMIT_METHODS, {})
                    return resolve(false)
                } else if (errorCode === 9501) { //停售
                    filterSinLtProject(res.data, {state, commit})
                    updateBlockedMethods(res.data.Stop, {state, commit, dispatch, rootGetters})
                    instance.$msg({
                        // '玩法已停售'
                        message: 'popup_070',
                        // '系统已为您过滤停售项目，请再次确认。'
                        content: 'popup_094',
                        isShowCloseIcon: false,
                        afterConfirm: () => {
                            instance.creditGameLtProjectVal.length && instance.drawGameSubmitPop()
                        }
                    })
                    resolve(true)
                } else if (errorCode === 9502 || errorCode === 9504) { //封鎖超過投注限額 // 投注项投注用戶限額
                    filterSinLtProject(res.data, {state, commit})
                    instance.handleOverLimit()
                    instance.$msg({
                        // '超过投注限额'
                        message: 'popup_081',
                        // 超过投注限额，请重新确认投注内容。
                        content: instance.$t('popup_097').replace(/<[^/]+>/, '<red>').replace(/<\/.+>/, '</red>'),
                        isMessageMuti: true,
                        isShowCloseIcon: false,
                        afterConfirm: () => {
                            instance.creditGameLtProjectVal.length && instance.drawGameSubmitPop()
                        }
                    })
                    resolve(true)
                } else if (errorCode === 9503) { //停售 & 封鎖超過投注限額
                    const { prizeBar, jsPrizePoint, keepPoint } = state.floatPrize
                    // console.log('封鎖', stopBetObj)
                    const toObj = (arr) => {
                        const obj = {}
                        arr.forEach((v) => (obj[v] = true))
                        return obj
                    }
                    const stopBet = toObj(res.data.Stop)
                    commit(_M.GET_FLOAT_PRIZE, { prizeBar, keepPoint, jsPrizePoint, stopBet })
                    filterSinLtProject(res.data, {state, commit})
                    instance.handleOverLimit()
                    // .replace(/<[^>]+>|&[^>]+;/g, '').trim()
                    instance.$msg({
                        // '部分玩法已停售且超过投注限额'
                        message: 'popup_093',
                        // '系统已为您过滤停售项目。请重新确认<span class="text_color_strong">超过投注限额</span>的投注内容。'
                        content: instance.$t('popup_084').replace(/<[^/]+>/, '<red>').replace(/<\/.+>/, '</red>'),
                        isMessageMuti: true,
                        isShowCloseIcon: false,
                        afterConfirm: () => {
                            instance.creditGameLtProjectVal.length && instance.drawGameSubmitPop()
                            updateBlockedMethods(res.data.Stop, {state, commit, dispatch, rootGetters})
                        }
                    })
                    resolve(true)
                } else if (errorCode === 9505) { //追号超出最大投注倍数
                    filterSinLtProject(res.data, {state, commit})
                    instance.$msg({
                        // '追号超出最大投注倍数'
                        message: 'popup_133',
                        // '请重新确认投注倍数。'
                        content: 'popup_134',
                        isShowCloseIcon: false
                    })
                    resolve(true)
                } else if (errorCode === 9401) { // 賠率不同時更新處理
                    // CREDIT_GAME_ORDER_SUBMIT
                    await dispatch(_M.SET_FLOAT_PRIZE_AND_BLOCKED_METHODS)
                    instance.handleAutoOdds()
                    instance.$msg({
                        message: res.message_key || res.message,
                        // '您的投注赔率已更新，请重新确认。'
                        content: 'popup_073',
                        afterConfirm: () => {
                            instance.creditGameLtProjectVal.length && instance.drawGameSubmitPop()
                        }
                    })
                    resolve(true)
                } else if (errorCode === 8104) { //追号超出限额或已停售
                    instance.$msg({
                        // '投注失败',
                        message: 'popup_104',
                        // '追号超出限额或已停售，无法完成投注。',
                        content: 'popup_103'
                    })
                }
            } else {
                resolve(true)
            }
        })
    },
    /**
     * 320模式顯示區塊
     * @param {any} payload 0: 選球, 1: 小助手, 2: 投注項
     */
    [_M.SET_GAME_SHOW_MODE]({commit}, payload = 0) {
        commit(_M.SET_GAME_SHOW_MODE, payload)
    },
    /**
     * 320 遊戲選單是否顯示
     */
    [_M.SET_GAME_MENU_ACTIVE]({commit}) {
        commit(_M.SET_GAME_MENU_ACTIVE)
    },
    /*
     * 設定返點 %
     * @param {any} payload %數
     */
    [_M.SET_KEEP_POINT]({commit}, payload) {
        commit(_M.SET_KEEP_POINT, payload)
    },
    /*
     * 設定返點 %
     * @param {any} payload %數
     */
    [_M.SET_DIFF_PRIZE_CREDIT_DATA]({dispatch, rootGetters, state, commit}, payload = false) {
        const creditGameLtProject = returnState(state.creditGameLtProject)
        const gameLtProject = returnState(state.gameLtProject)
        const { menuId } = rootGetters.lotteryList2[rootGetters.gameLotteryId] || {}
        const arr = []
        if ([2, 4, 5, 8].includes(menuId)) {
            if ([4, 8].includes(menuId)) {
                Object.values(creditGameLtProject).forEach((project) => {
                    let difData
                    const { title, subTitle, methodId, prizeNameArr, hprize } = project
                    if (prizeNameArr) {
                        const difData = prizeNameArr.map((title) => state.diffPrizeData[methodId + title])
                        const isUpdated = difData.map(val => !!val && !payload)
                        const obj = {
                            ...project,
                            isUpdated
                        }
                        if (difData.some(val => !!val)) {
                            const oldHprize = hprize.split(',')
                            let prizeArr = []
                            difData.forEach((data, i) => {
                                if (data) {
                                    let { hprize, autoOdds } = data
                                    hprize = (hprize + autoOdds).strip()
                                    prizeArr.push(hprize)
                                } else {
                                    prizeArr.push(oldHprize[i])
                                }
                            })
                            obj.hprize = prizeArr.join(',')
                        }
                        arr.push(obj)
                    } else {
                        difData = state.diffPrizeData[methodId + title] || state.diffPrizeData[methodId + subTitle]
                        // 單一hprize
                        if (difData) {
                            let { hprize, autoOdds } = difData
                            hprize = (hprize + +autoOdds).strip()
                            arr.push({
                                ...project,
                                isUpdated: !payload,
                                hprize
                            })
                        } else {
                            arr.push({
                                ...project,
                                isUpdated: false
                            })
                        }
                    }
                })
            } else {
                Object.values(creditGameLtProject).forEach((project) => {
                    const { title, subTitle, methodId, keepPoint } = project
                    const difData = state.diffPrizeData[methodId + title] || state.diffPrizeData[methodId + subTitle]
                    if (difData) {
                        let { hprize, autoOdds } = difData
                        hprize = (+(state.floatPrize.prizeBar[hprize][keepPoint]) + +(autoOdds)).strip()
                        arr.push({
                            ...project,
                            isUpdated: !payload,
                            hprize
                        })
                    } else {
                        arr.push({
                            ...project,
                            isUpdated: false
                        })
                    }
                })
            }
            dispatch(_M.SET_CREDIT_GAME_LT_PROJECT, arr)
        } else {
            Object.values(gameLtProject).forEach((project) => {
                let { methodId, keepPoint, typeName, shprizes, shprize } = project
                const difData = state.diffPrizeData[typeName + methodId]
                if (difData) {
                    let autoOdds = difData.autoOdds
                    const prizeBar = state.floatPrize.prizeBar
                    let { hprizes, hprize } = {}
                    try {
                        hprizes = shprizes.map(hprize => (+(prizeBar[hprize][keepPoint]) + +autoOdds).strip())
                        hprize = shprize.map(hprize => (+(prizeBar[hprize][keepPoint]) + +autoOdds).strip()).join(',')
                    } catch (error) {
                        // console.log({autoOdds, prizeBar, hprizes}, error.message)
                    }
                    arr.push({
                        ...project,
                        isUpdated: !payload,
                        hprizes,
                        hprize
                    })
                } else {
                    arr.push({
                        ...project,
                        isUpdated: false
                    })
                }
            })
            commit(_M.SET_GAME_LT_PROJECT, {type: 4, data: arr})
        }
    },
    /*
     * 設定賠率更新及封鎖停押 %
     * @param {Boolean} payload true: 不更新賠率顏色, false: 賠率全部變黑色
     */
    async [_M.SET_FLOAT_PRIZE_AND_BLOCKED_METHODS]({dispatch, state, commit}, payload) {
        const shouldUpdateColor = typeof payload === 'boolean' && payload
        const newBlockeds = typeof payload === 'object' && payload
        clearTimeout(setTimeoutFloatPrize)
        const lotteryId = nowLotteryId(state)
        await dispatch(_M.GET_FLOAT_PRIZE_AND_BLOCKED_METHODS, lotteryId)
        const { data, diffPrizeData } = setGameConfigData({
            config: state.gamePlayData[lotteryId],
            jsPrizePoint: state.floatPrize.jsPrizePoint,
            newBlockeds
        })
        commit(_M.SET_GAME_PLAY_DATA, {[lotteryId]: data})
        commit(_M.SET_DIFF_PRIZE_DATA, diffPrizeData)
        await dispatch(_M.SET_DIFF_PRIZE_CREDIT_DATA, shouldUpdateColor)
        shouldUpdateColor && commit(_M.SET_DIFF_PRIZE_DATA, {})
    },
    /**
     * 信用投注視窗是否允許刪除注單
     * @param {any} { commit }
     * @param {bool} payload
     */
    [_M.SET_SIN_SUBMIT_BOX_CAN_CANCEL]({ commit }, payload) {
        commit(_M.SET_SIN_SUBMIT_BOX_CAN_CANCEL, payload)
    },
    // 設定玩法頁籤
    [_M.SET_TAB_INDEX]({ commit }, payload) {
        commit(_M.SET_TAB_INDEX, payload)
    },
    // 設定快速玩法
    [_M.SET_IS_FAST]({ commit }, payload) {
        commit(_M.SET_IS_FAST, payload)
    },
    // 設定殺對子
    [_M.SET_KILL_PAIR]({ commit }, payload) {
        commit(_M.SET_KILL_PAIR, payload)
    },
    //因應桌面新增玩法說明
    async [_M.GET_PLAYINFO_NEW_LIST]({ commit, rootGetters }, payload) {
        // 取得玩法說明列表
        const data = await handleAjax(API.getHowToPlay, payload, rootGetters)
        commit(_M.SET_PLAYINFO_LIST, data.data.howToPlay)
    },
    /**
     * 設定是否有路紙
     */
    [_M.SET_HAS_GAME_SCORE]({ commit }, payload) {
        commit(_M.SET_HAS_GAME_SCORE, payload)
    },
    // 番攤-設定路紙開關
    [_M.SET_SCORE_SHOW]({ commit }, payload) {
        commit(_M.SET_SCORE_SHOW, !!payload)
    },
    // 番攤-設定橡皮擦模式
    [_M.SET_ERASER]({ commit }, payload) {
        commit(_M.SET_ERASER, !!payload)
    },
    // 設定投注額外選項
    [_M.SET_GAME_OPTION]({ commit }, payload) {
        commit(_M.SET_GAME_OPTION, payload)
    },
    // 設定 所有選球組合
    [_M.SET_BALLS_COMBINE]({ commit }, payload) {
        commit(_M.SET_BALLS_COMBINE, payload)
    },
    /**
     * [股票彩](官方玩法但是要單注拆單)-添加/修改號碼箱
     */
    [_M.SET_SUBMIT_ORDER_MUTI]({ state, commit, dispatch, getters, rootGetters }) {
        if (state.gameOrder.nums <= 0) {
            dispatch(_M.SET_MESSAGE_BOX_DATA, warnMessageBox({
                // 号码选择不完整
                message: 'popup_002',
                // 号码选择不完整，请重新选择。
                content: 'popup_003'
            }))
            return
        }

        if (!isJsDynamicConfig(state)) {
            dispatch(_M.SET_MESSAGE_BOX_DATA, warnMessageBox({
                // 尚未开放奖期
                message: 'common_118'
            }))
            return
        }

        const {ltIssueStart} = state.gameSubmit
        let issueArr = [ltIssueStart]
        if (getters.currentjsDynamicData.issue.length > 0) {
            // 上午/下午獎期map
            const issueMap = {
                0: '001',
                1: '002'
            }
            // 把使用者勾選值轉換成獎期代碼 (ex 0 -> 001)
            const userSelIssueArr = Object.keys(state.gameOrder.activeCheckboxes[0] || {}).map((sel) => issueMap[sel])
            // 從 jsDynamicData.issue 中取出使用者選擇的獎期陣列
            issueArr = getters.currentjsDynamicData.issue.reduce((ans, issueData) => {
                const isInSel = userSelIssueArr.findIndex((selMap) => issueData.number.includes(selMap))
                if (isInSel >= 0) {
                    ans.push(issueData.number)
                }
                return ans
            }, [])
        }

        const { methodId, onePrice, parentNameKey, parentName, childNameKey, hprize } = returnState(state.gameOrder)
        issueArr.forEach((oneIssue) => {
            getters.gameOrder.gameBallCombine.forEach((oneBallSet) => {
                // 股票彩投注項不檢查重複(重複直接增加新注)
                const codes = oneBallSet.join('')
                commit(_M.SET_GAME_LT_PROJECT, {
                    type: 1,
                    data: {
                        digitstr: '',
                        methodId,
                        codes,
                        showCodes: codes,
                        nums: 1,
                        type: 'digital',
                        money: (+onePrice).strip(),
                        mode: 1,
                        times: 1,
                        onePrice: onePrice,
                        hprize,
                        keepPoint: rootGetters.kp,
                        // 組顯示名稱用
                        parentName,
                        parentNameKey,
                        childNameKey,
                        issue: oneIssue
                    }
                })
            })
        })

        const detailIndex = (state.game.isDetailIndex === -1) ? -1 : state.game.isDetailIndex + 1
        commit(_M.SET_GAME_DATA, { isDetailIndex: detailIndex, ballControlData: returnState(state.game.ballControlEmptyData) })
        // 股票彩加入投注項後不清掉勾選的時段
        commit(_M.SET_GAME_ORDER_DATA, {
            ...resetGameOrder,
            gameBallData: returnState(state.game.gameBallEmptyData),
            activeCheckboxes: returnState(state.gameOrder.activeCheckboxes)
        })
        commit(_M.SET_SUBMIT_MONEY)
    },
    /**
     * [股票彩](官方玩法一單多注&可修改單注投注金額)-設定(立即投注時的)暫時注單箱
     * @param {Number} payload.type 功能代碼
     * @param {String,Number} payload.idx 設定對象在整個陣列的index
     * @param {Object} payload.data 資料內容
     */
    [_M.SET_PROJECT_TEMP]({ state, commit, getters, rootGetters }, payload = {}) {
        const {type, idx, data} = payload
        switch (+type) {
            // 2:修改單一 / 3:刪除單一
            case 2:
            case 3:
                commit(_M.SET_PROJECT_TEMP, {type, idx, data})
                return
            // 全覆蓋:加入整筆拆單到號碼箱
            case 5:
                break
            // 全清空
            default:
                commit(_M.SET_PROJECT_TEMP)
                return
        }
        // type:5 才往下做
        const gameBallCombine = getters.gameOrder.gameBallCombine
        const {methodId, onePrice, parentNameKey, parentName, childNameKey, hprize} = state.gameOrder
        const {ltIssueStart} = state.gameSubmit
        let ltProject = []

        let issueArr = [ltIssueStart]
        if (getters.currentjsDynamicData.issue.length > 0) {
            // 上午/下午獎期map
            const issueMap = {
                0: '001',
                1: '002'
            }
            // 把使用者勾選值轉換成獎期代碼 (ex 0 -> 001)
            const userSelIssueArr = Object.keys(state.gameOrder.activeCheckboxes[0] || {}).map((sel) => issueMap[sel])
            // 從 jsDynamicData.issue 中取出使用者選擇的獎期陣列
            issueArr = getters.currentjsDynamicData.issue.reduce((ans, issueData) => {
                const isInSel = userSelIssueArr.findIndex((selMap) => issueData.number.includes(selMap))
                if (isInSel >= 0) {
                    ans.push(issueData.number)
                }
                return ans
            }, [])
        }

        issueArr.forEach((oneIssue) => {
            gameBallCombine.forEach((oneBallSet) => {
                // 產生投注codes, 股票彩不用分隔符號
                const codes = oneBallSet.join('')
                ltProject.push({
                    digitstr: '',
                    methodId,
                    codes,
                    showCodes: codes,
                    nums: 1,
                    type: 'digital',
                    money: (+onePrice).strip(),
                    mode: 1,
                    times: 1,
                    onePrice,
                    hprize,
                    keepPoint: rootGetters.kp,
                    parentName,
                    parentNameKey,
                    childNameKey,
                    issue: oneIssue
                })
            })
        })

        commit(_M.SET_PROJECT_TEMP, { type: 5, data: ltProject })
    },
    /**
     * 直接設定注單箱
     * @param {Number} payload.type 功能代碼
     * @param {String,Number} payload.index 設定對象在整個陣列的index
     * @param {Object} payload.data 資料內容
     */
    [_M.SET_GAME_LT_PROJECT]({ state, commit }, payload = {}) {
        const {type, index, data} = payload
        switch (+type) {
            // 1:新增單一 / 4: 全覆蓋-加入整筆單到注單箱
            case 1:
            case 4:
                commit(_M.SET_GAME_LT_PROJECT, {type, data})
                break
            // 2:覆蓋單一 / 5:修改單一
            case 2:
            case 5:
                commit(_M.SET_GAME_LT_PROJECT, {type, index, data})
                break
            // 濾除單一
            case 3:
                commit(_M.SET_GAME_LT_PROJECT, {type, index})
                break
            // 全清空
            default:
                commit(_M.SET_GAME_LT_PROJECT)
                break
        }
    },
    /**
     * [股票彩] 將随机投注号码添加进号码篮
     * @param {any} { state, commit, dispatch }
     * @param {any} payload 注單資料
     */
    [_M.SET_RANDOM_LOTTERYS_MUTI]({ state, commit, dispatch, getters }, payload) {
        if (!isJsDynamicConfig(state)) {
            dispatch(_M.SET_MESSAGE_BOX_DATA, warnMessageBox({
                // 尚未开放奖期
                message: 'common_118'
            }))
            return
        }

        // 加入投注項
        commit(_M.SET_GAME_LT_PROJECT, { type: 1, data: payload })
        // // 重置全大小奇偶清
        commit(_M.SET_GAME_DATA, {
            ballControlData: returnState(state.game.ballControlEmptyData)
        })
        // 重置反選
        state.game.isEditIndex !== -1 && commit(_M.SET_GAME_DATA, {
            isEditIndex: -1,
            isDetailIndex: -1
        })
        // 重置上方選球區, 股票彩加入投注項後不清掉勾選的時段
        commit(_M.SET_GAME_ORDER_DATA, {
            ...resetGameOrder,
            gameBallData: returnState(state.game.gameBallEmptyData),
            activeCheckboxes: returnState(state.gameOrder.activeCheckboxes)
        })
        // 更新加總金額
        commit(_M.SET_SUBMIT_MONEY)
    }

}
