import { API } from '@API'
import { handleAjax, today } from '@UTIL'

const state = {
    winLoseLoading: false,
    params: {
        calSum: true,
        periodType: 'created_at',
        pageLimit: 15,
        startDate: today(),
        endDate: today()
    },
    data: {}
}

const actions = {
    async [_M.USERPROFIT_LIST]({ state, commit, rootGetters }, payload = {}) {
        commit(_M.SET_WINLOSE_LOAD, true)
        const result = await handleAjax(API.userProjectsProfit, {
            ...state.params,
            ...payload
        }, rootGetters)
        const {data, pagination} = result
        const list = data.list
        const sum = data.calSum
        commit(_M.SET_WINLOSE_DATA, {list, pagination, sum})
        commit(_M.SET_WINLOSE_LOAD, false)
    }
}

const mutations = {
    [_M.SET_WINLOSE_LOAD](state, payload) {
        state.winLoseLoading = payload
    },
    [_M.SET_WINLOSE_DATA](state, payload) {
        state.data = payload
    }
}

const getters = {
    winLoseLoading: state => state.winLoseLoading,
    winLoseData: state => state.data || [],
    winLoseList: (state, getters) => getters.winLoseData.list || [],
    sum: (state, getters) => getters.winLoseData.sum || {},
    pagination: (state, getters) => getters.winLoseData.pagination || {},
    page: (state, getters) => getters.pagination.page || 1,
    totalPage: (state, getters) => getters.pagination.totalPage || 1
}

export default {
    state,
    actions,
    mutations,
    getters
}
