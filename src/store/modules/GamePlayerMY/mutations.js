
export default {
    /**
     * 投注計時時間
     * @param {any} state Global Stroe
     * @param {any} payload  Object 要存進去的資料
     * @param {String} payload.key  (多獎期)索引
     * @param {Object} payload.data  (多獎期)要存進去的資料
     */
    [_M.SET_FLIP_TIMEER_MY_DATA](state, payload) {
        state.MY_flipTimer = { ...state.MY_flipTimer, ...payload }
    },
    /**
     * 遊戲主要資料
     * @param {any} state Global Stroe
     * @param {any} payload  Object 要存進去的資料
     */
    [_M.SET_GAME_PLAY_MY_DATA](state, payload) {
        state.MY_gamePlayData = { ...state.MY_gamePlayData, ...payload }
    },
    /**
     * 遊戲主要獎期資料
     * @param {any} state Global Stroe
     * @param {any} payload  Object 要存進去的資料
     */
    [_M.SET_GAME_PLAY_DYNAMIC_MY_DATA](state, payload) {
        state.MY_jsDynamicConfig = { ...state.MY_jsDynamicConfig, ...payload }
    },
    /**
     * 遊戲投注資料
     * @param {any} state Global Stroe
     * @param {any} payload  Object 要存進去的資料
     */
    [_M.SET_SUBMIT_MY_DATA](state, payload) {
        state.MY_gameSubmit = {
            ...state.MY_gameSubmit,
            ...payload
        }
    },
    /**
     * 賠率拉吧索引
     */
    [_M.SET_MY_FLOAT_PRIZE](state, payload) {
        state.MY_floatPrize = payload
    },
    [_M.SET_MY_TEMP_DATA](state, payload = {}) {
        state[payload.temp] = payload.data
    }
}