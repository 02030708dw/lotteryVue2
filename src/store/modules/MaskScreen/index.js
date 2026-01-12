const state = {
    maskQueue: []
}
const actions = {
    /**
     * 設定遮罩 mask queue
     * @param {boolean} payload true: 展開, false: 縮回
     */
    [_M.SET_MASK_QUEUE]({ state, commit }, payload) {
        commit(_M.SET_MASK_QUEUE, [...state.maskQueue, payload].sort((a, b) => a.zIndex < b.zIndex))
    },
    /**
     * 刪除最前面的遮罩
     */
    [_M.DELETE_MASK]({ state, commit }, payload) {
        commit(_M.SET_MASK_QUEUE, state.maskQueue.filter(obj => obj.zIndex !== payload))
    }
}
const mutations = {
    /**
     * 設定遮罩 mask queue
     * @param {boolean} payload true: 顯示, false: 不顯示
     */
    [_M.SET_MASK_QUEUE](state, payload) {
        state.maskQueue = payload
    }
}
const getters = {
    maskQueue: state => state.maskQueue
}

export default {
    state,
    actions,
    mutations,
    getters
}