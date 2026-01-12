import { API, Storage } from '@API'
import { handleAjax, getStorage, setStorage } from '@UTIL'

const playList = getStorage(Storage.playInfoList)

const state = {
    playInfoIsLoading: false,
    playList,
    playListIndex: 0
}

const actions = {
    /**
     * API 取得 玩法介紹資料
     * 並處如載入效果
     */
    async [_M.GET_PLAYINFO_LIST]({ state, commit, rootGetters }) {
        if (state.playInfoIsLoading) {
            return
        }
        const data = await handleAjax(API.helps, {}, rootGetters)
        commit(_M.SET_PLAYINFO_LIST, data.data)
        commit(_M.SET_PLAYINFO_LOAD, true)
    },
    /**
     * 設定 玩法介紹顯示的頁面
     * @param {number} payLoad 玩法介紹顯示的 index
     */
    [_M.SET_PLAYINFO_INDEX]({commit}, payload) {
        commit(_M.SET_PLAYINFO_INDEX, payload)
    }
}
const mutations = {
    /**
     * 設定 玩法介紹資料
     * @param {any} payload
     */
    [_M.SET_PLAYINFO_LIST](state, payload) {
        setStorage(Storage.playInfoList, payload)
        state.playList = payload
    },
    /**
     * 判斷是否載入中
     * @param {boolean} payLoad true, false
     */
    [_M.SET_PLAYINFO_LOAD](state, payLoad) {
        state.playInfoIsLoading = payLoad
    },
    /**
     * 設定 玩法介紹顯示的頁面
     * @param {number} payLoad 玩法介紹顯示的 index
     */
    [_M.SET_PLAYINFO_INDEX](state, payLoad) {
        state.playListIndex = payLoad
    }
}
const getters = {
    playInfoIsLoading: state => state.playInfoIsLoading,
    playList: state => state.playList,
    playListIndex: state => state.playListIndex
}

export default {
    state,
    actions,
    mutations,
    getters
}