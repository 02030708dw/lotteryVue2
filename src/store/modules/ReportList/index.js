import { API } from '@API'
import { handleAjax, today } from '@UTIL'

const state = {
    reportLoading: false,
    reportTemp: {},
    reportList: {},
    reportData: {
        startDate: today(),
        endDate: today(),
        isSearch: false
    }
}

const actions = {
    /**
     * API 取得 盈虧紀錄資料
     * 如果 payload 沒值則清除暫存資料
     * 如果 payload 值在暫存資料已經有了則直接引用暫存資料
     * @param {object} payload 盈虧紀錄資料
     */
    async [_M.GET_REPORT_LIST]({ commit, state, rootGetters }, payload) {
        if (rootGetters.isShowDemo) {
            return
        }
        const page = payload ? payload.page : 1
        if (!payload) {
            commit(_M.RESET_REPORT_TEMP_DATA)
        }
        if (state.reportTemp[page]) {
            commit(_M.SET_REPORT_LIST, state.reportTemp[page])
            return
        }
        commit(_M.SET_REPORT_LOAD, true)
        const params = { ...state.reportData, ...payload }
        const data = await handleAjax(API.userProfit, params, rootGetters)
        data && commit(_M.SET_REPORT_LIST, data)
        commit(_M.SET_REPORT_DATA, { isSearch: true })
        commit(_M.SET_REPORT_LOAD, false)
    },
    /**
     * 設定資料並緩存在陣列
     * @param {any} payload 盈虧紀錄資料
     */
    [_M.SET_REPORT_DATA]({ state, commit }, payload) {
        commit(_M.SET_REPORT_DATA, {})
        commit(_M.RESET_REPORT_TEMP_DATA)
        payload && commit(_M.SET_REPORT_DATA, payload)
    },
    /**
     * 清除所有資料
     */
    [_M.CLEAR_REPORT_DATA]({ commit }) {
        commit(_M.SET_REPORT_LIST, {})
        commit(_M.SET_REPORT_DATA, {
            startDate: today(),
            endDate: today(),
            isSearch: false
        })
    }
}
const mutations = {
    /**
     * 設定 盈虧紀錄資料
     * @param {any} payload 盈虧紀錄資料
     */
    [_M.SET_REPORT_LIST](state, payload) {
        if (payload.pagination) {
            state.reportTemp[payload.pagination.page] = payload
        }
        state.reportList = payload
    },
    /**
     * 設定資料並緩存在陣列
     * @param {any} payload 盈虧紀錄資料
     */
    [_M.SET_REPORT_DATA](state, payload) {
        state.reportData = {...state.reportData, ...payload}
    },
    /**
     * 清除暫存資訊
     */
    [_M.RESET_REPORT_TEMP_DATA](state) {
        state.reportTemp = {}
    },
    /**
     * 判斷是否載入中
     * @param {boolean} payLoad true, false
     */
    [_M.SET_REPORT_LOAD](state, payLoad) {
        state.reportLoading = payLoad
    }
}

const getters = {
    reportLoading: state => state.reportLoading,
    reportTemp: state => state.reportTemp,
    reportList: state => state.reportList,
    reportData: state => state.reportData
}

export default {
    state,
    actions,
    mutations,
    getters
}