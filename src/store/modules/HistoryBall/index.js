import { API } from '@API'
import { handleAjax, today } from '@UTIL'

const state = {
    HB_loading: false,
    HB_list: [],
    HB_search: {
        periodNums: 30,
        lotteryId: null,
        // YYYY-MM-01 00:00:00
        startTime: null,
        // YYYY-MM-DD 23:59:59
        endTime: null
    }
}

const actions = {
    /**
     * 取得歷史獎號資料
     * @param {Object} payload fatch
     */
    async [_M.GET_HB_LIST]({ state, commit, rootGetters }, payload) {
        commit(_M.SET_HB_LOADING, true)
        commit(_M.SET_HB_SEARCH, payload)

        const {data} = await handleAjax(API.historyBall, payload, rootGetters)
        data && commit(_M.SET_HB_LIST, data)
        commit(_M.SET_HB_LOADING, false)
    },
    // 設定歷史獎期 搜尋參數
    [_M.SET_HB_SEARCH]({ commit }, payload) {
        commit(_M.SET_HB_SEARCH, payload)
    },
    // 直接設定歷史獎期資料
    [_M.SET_HB_LIST]({ commit }, payload) {
        commit(_M.SET_HB_LIST, payload)
    }
}

const mutations = {
    /**
     * 設定歷史獎期資料
     * @param {Object} payload 空值就清空, 不為空則串聯
     */
    [_M.SET_HB_LIST](state, payload) {
        if (!payload) {
            state.HB_list = []
            return
        }
        state.HB_list = [...state.HB_list, ...payload]
    },
    // 設定loading
    [_M.SET_HB_LOADING](state, payload) {
        state.HB_loading = !!payload
    },
    // 設定歷史獎期 搜尋參數
    [_M.SET_HB_SEARCH](state, payload) {
        state.HB_search = { ...state.HB_search, ...payload }
    }
}

const getters = {
    getHBLoading: state => state.HB_loading,
    getHBList: state => state.HB_list,
    getHBSearch: state => state.HB_search
}

export default {
    state,
    actions,
    mutations,
    getters
}
