import { API } from '@API'
import {
    handleAjax,
    // warnMessageBox,
    formatTimer,
    utc8
} from '@UTIL'
import {
    defaultFlipTimer
} from './functions'
let globalLocalTime = 0
let globalNowTime = 0
let countNum = 0
let flipTimerIndex = {}
let isLoadingAllIssue = false
export default {
    /**
     * 投注冷卻時間
     * @param {any} { dispatch, commit, state }
     */
    [_M.GET_FLIP_TIMEER_ALL]({ dispatch, commit, state, rootGetters }) {
        const nowLocalTime = +utc8()
        const redressTime = 90
        let data = []
        let nowtime = globalNowTime + nowLocalTime - globalLocalTime
        rootGetters.areaListAll.forEach(([key, config]) => {
            const flipTimer = state.flipTimerAll[key]
            const index = flipTimerIndex[key] = flipTimerIndex[key] || 0
            if (config.length) {
                const { sale_end, issue } = config[index]
                let coldTime = Math.ceil((sale_end * 1000 - nowtime + 1100) / 1000)
                if (coldTime <= 0) {
                    const length = config.length
                    if (length === index + 1) {
                        flipTimer.isCountDown && dispatch(_M.GET_ALL_ISSUE)
                    } else {
                        flipTimerIndex[key]++
                    }
                    data[key] = { isCountDown: false, issue }
                    return
                }
                const hours = formatTimer(~~(coldTime / 3600))
                const minutes = formatTimer((coldTime / 60) % 60)
                const seconds = formatTimer(coldTime % 60)
                data[key] = {
                    isCountDown: true,
                    coldTime,
                    hours,
                    minutes,
                    seconds,
                    issue
                }
            } else {
                data[key] = { isCountDown: false }
            }
        })
        commit(_M.SET_FLIP_TIMEER_ALL_DATA, data)
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
     * API 取得所有開獎獎期
     */
    async [_M.GET_ALL_ISSUE]({ state, commit, rootGetters }, payload = {}) {
        const options = { isPromise: true }
        const fetchNextFewIssues = async() => {
            const nowLocalTime = +utc8()
            await handleAjax(API.nextFewIssues, payload, rootGetters, options)
                .then((data) => {
                    const errorCode = +data.result
                    if (errorCode === 0) {
                        const { issues, now_timestamp } = data.data
                        globalNowTime = now_timestamp * 1000
                        globalLocalTime = nowLocalTime
                        countNum = 0
                        flipTimerIndex = {}
                        commit(_M.SET_ALL_ISSUE, issues)
                    }
                })
                .catch(() => setTimeout(fetchNextFewIssues, 5000))
            isLoadingAllIssue = false
        }
        if (!isLoadingAllIssue) {
            isLoadingAllIssue = true
            return fetchNextFewIssues()
        } else {
            return false
        }
    },
    /**
     * API 取得所有開獎獎期
     */
    async [_M.GET_ALL_OPEN_ISSUE]({ state, commit, rootGetters }, payload) {
        const { data } = await handleAjax(API.historyBalls, {}, rootGetters)
        data && commit(_M.SET_ALL_OPEN_ISSUE, data)
    }
}
