import { API } from '@API'
import { handleAjax, today } from '@UTIL'

const state = {
    historyBallVNInfoLoading: false,
    historyBallVNList: [],
    historyBallVNTempList: {},
    historyBallVNData: {
        cancelDeadline: today(),
        periodNums: 9,
        menuCode: ''
    }
}

const actions = {
    /**
     * ajax歷史獎期資料
     * @param {Object} payload fatch 參數 type: 1 新增;type: 2 reset
     */
    async [_M.GET_HISTORYBALLVN_LIST]({ state, commit, rootGetters }, payload) {
        // commit(_M.SET_HISTORYBALLVN_INFO_LOADING, true)
        commit(_M.SET_HISTORYBALLVN_DATA, payload)
        const [menuCode, lotteryId] = state.historyBallVNData.menuCode.split('-')
        const result = await handleAjax(API.vnHistoryBall, { ...state.historyBallVNData, menuCode, lotteryId }, rootGetters)
        result && commit(_M.SET_HISTORYBALLVN_LIST, { type: 1, result })
        commit(_M.SET_HISTORYBALLVN_INFO_LOADING, false)
    },
    /**
     * 清除歷史獎期資料
     * @param {Object} payload fatch 參數 type: 1 新增;type: 2 reset
     */
    [_M.CLEAR_HISTORYBALLVN_LIST]({ commit }) {
        commit(_M.SET_HISTORYBALLVN_LIST, { type: 2 })
    },
    [_M.SET_HISTORYBALLVN_DATA]({ commit }, payload) {
        commit(_M.SET_HISTORYBALLVN_DATA, payload)
    }
}

const mutations = {
    /**
     * 設定歷史獎期資料
     * @param {Object} payload fatch 參數 type: 1 新增;type: 2 reset
     */
    [_M.SET_HISTORYBALLVN_LIST](state, payload) {
        switch (payload.type) {
            case 1:
                const { params, data } = payload.result
                state.historyBallVNTempList = { ...state.historyBallVNTempList, ...{ [params.next]: data } }
                return (state.historyBallVNList = data)
            case 2:
                state.historyBallVNTempList = {}
                return (state.historyBallVNList = [])
        }
    },
    [_M.SET_HISTORYBALLVN_INFO_LOADING](state, payload) {
        state.historyBallVNInfoLoading = payload
    },
    [_M.SET_HISTORYBALLVN_DATA](state, payload) {
        state.historyBallVNData = { ...state.historyBallVNData, ...payload }
    }
}

const getters = {
    getHistoryBallVNList: state => state.historyBallVNList,
    getHistoryBallVNTempList: state => state.historyBallVNTempList,
    getHistoryBallVNInfoLoading: state => state.historyBallVNInfoLoading,
    getHistoryBallVNData: state => state.historyBallVNData
}

export default {
    state,
    actions,
    mutations,
    getters
}
