import { API } from '@API'
import { handleAjax, today, returnState } from '@UTIL'
import { orderTypeNameList } from '@UTIL/orderTypeIds'

const walletDataTemp = {
    startDate: today(),
    endDate: today(),
    orderTypeIds: JSON.parse(JSON.stringify(orderTypeNameList())).map(item => parseInt(item.id)),
    calSum: true,
    isSearch: false
}

const state = {
    walletInfoLoading: false,
    walletList: {},
    walletTempList: {},
    walletData: returnState(walletDataTemp),
    walletDeltaAmount: 0,
    walletInfoPageNationNum: 1
}

const actions = {
    async [_M.GET_WALLET_LIST]({ state, commit, rootGetters, dispatch }, payload) {
        if (rootGetters.isShowDemo) {
            return
        }
        commit(_M.SET_WALLET_INFO_LOADING, true)
        const page = payload ? payload.page : false
        if (!page) {
            dispatch(_M.SET_WALLET_INFO_PAGE_NATION_NUM)
        }
        const result = await handleAjax(API.history, {
            pageLimit: 20,
            ...payload,
            ...state.walletData
        }, rootGetters)
        result && commit(_M.SET_WALLET_LIST, result)
        commit(_M.SET_WALLET_DATA, { isSearch: true })
        commit(_M.SET_WALLET_INFO_LOADING, false)
    },
    clearWalletList({ commit, dispatch }) {
        commit(_M.CLEAR_WALLET_LIST)
        dispatch(_M.SET_WALLET_DATA, returnState(walletDataTemp))
    },
    [_M.SET_WALLET_INFO_PAGE_NATION_NUM]({ commit }, payload) {
        commit(_M.SET_WALLET_INFO_PAGE_NATION_NUM, payload)
    },
    [_M.SET_WALLET_DATA]({ commit }, payload) {
        commit(_M.SET_WALLET_DATA, payload)
    }
}

const mutations = {
    [_M.SET_WALLET_LIST](state, payload) {
        if (payload.pagination) {
            state.walletTempList[payload.pagination.page] = payload
        }
        state.walletDeltaAmount = payload.data.list.shift()
        state.walletList = payload
    },
    [_M.SET_WALLET_INFO_LOADING](state, payload) {
        state.walletInfoLoading = payload
    },
    [_M.CLEAR_WALLET_LIST](state) {
        state.walletList = {}
    },
    [_M.SET_WALLET_INFO_PAGE_NATION_NUM](state, payload = 1) {
        state.walletInfoPageNationNum = payload
    },
    [_M.SET_WALLET_DATA](state, payload) {
        state.walletData = { ...state.walletData, ...payload }
    }
}

const getters = {
    getWalletList: state => state.walletList,
    getWalletTempList: state => state.walletTempList,
    getWalletInfoLoading: state => state.walletInfoLoading,
    getWalletInfoPageNationNum: state => state.walletInfoPageNationNum,
    getWalletData: state => state.walletData,
    getWalletDeltaAmount: state => state.walletDeltaAmount
}

export default {
    state,
    actions,
    mutations,
    getters
}
