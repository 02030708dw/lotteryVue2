export default {
    /**
     * 設定所有獎期資料
     * @param {any} state Global Stroe
     * @param {any} payload  號碼區金額
     */
    [_M.SET_FLIP_TIMEER_ALL_DATA](state, payload) {
        state.flipTimerAll = payload
    },
    [_M.SET_ALL_OPEN_ISSUE](state, payload) {
        state.allOpenIssue = {...state.allOpenIssue, ...payload}
    },
    [_M.SET_ALL_ISSUE](state, payload) {
        state.allIssue = payload
        state.firstLoadFlipTimer = false
    }
}
