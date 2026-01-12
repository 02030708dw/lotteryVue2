
export default {
    /**
     * 投注計時時間
     * @param {any} state Global Stroe
     * @param {any} payload  Object 要存進去的資料
     * @param {String} payload.key  (多獎期)索引
     * @param {Object} payload.data  (多獎期)要存進去的資料
     */
    [_M.SET_FLIP_TIMEER_LA_DATA](state, payload) {
        state.LA_flipTimer = { ...state.LA_flipTimer, ...payload }
    },
    /**
     * 遊戲主要資料
     * @param {any} state Global Stroe
     * @param {any} payload  Object 要存進去的資料
     */
    [_M.SET_GAME_PLAY_LA_DATA](state, payload) {
        state.LA_gamePlayData = { ...state.LA_gamePlayData, ...payload }
    },
    /**
     * 遊戲主要獎期資料
     * @param {any} state Global Stroe
     * @param {any} payload  Object 要存進去的資料
     */
    [_M.SET_GAME_PLAY_DYNAMIC_LA_DATA](state, payload) {
        state.LA_jsDynamicConfig = { ...state.LA_jsDynamicConfig, ...payload }
    },
    /**
     * 遊戲投注資料
     * @param {any} state Global Stroe
     * @param {any} payload  Object 要存進去的資料
     */
    [_M.SET_SUBMIT_LA_DATA](state, payload) {
        state.LA_gameSubmit = {
            ...state.LA_gameSubmit,
            ...payload
        }
    },
    /**
     * 賠率拉吧索引
     */
    [_M.SET_LA_FLOAT_PRIZE](state, payload) {
        state.LA_floatPrize = payload
    },
    [_M.SET_LA_TEMP_DATA](state, payload = {}) {
        state[payload.temp] = payload.data
    }
}