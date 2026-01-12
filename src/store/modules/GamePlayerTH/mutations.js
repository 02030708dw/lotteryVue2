
export default {
    /**
     * 投注計時時間
     * @param {any} state Global Stroe
     * @param {any} payload  Object 要存進去的資料
     * @param {String} payload.key  (多獎期)索引
     * @param {Object} payload.data  (多獎期)要存進去的資料
     */
    [_M.SET_FLIP_TIMEER_TH_DATA](state, payload) {
        state.TH_flipTimer = { ...state.TH_flipTimer, ...payload }
    },
    /**
     * 遊戲主要資料
     * @param {any} state Global Stroe
     * @param {any} payload  Object 要存進去的資料
     */
    [_M.SET_GAME_PLAY_TH_DATA](state, payload) {
        state.TH_gamePlayData = { ...state.TH_gamePlayData, ...payload }
    },
    /**
     * 遊戲主要獎期資料
     * @param {any} state Global Stroe
     * @param {any} payload  Object 要存進去的資料
     */
    [_M.SET_GAME_PLAY_DYNAMIC_TH_DATA](state, payload) {
        state.TH_jsDynamicConfig = { ...state.TH_jsDynamicConfig, ...payload }
    },
    /**
     * 遊戲投注資料
     * @param {any} state Global Stroe
     * @param {any} payload  Object 要存進去的資料
     */
    [_M.SET_SUBMIT_TH_DATA](state, payload) {
        state.TH_gameSubmit = {
            ...state.TH_gameSubmit,
            ...payload
        }
    },
    /**
     * 賠率拉吧索引
     */
    [_M.SET_TH_FLOAT_PRIZE](state, payload) {
        state.TH_floatPrize = payload
    },
    [_M.SET_TH_TEMP_DATA](state, payload = {}) {
        state[payload.temp] = payload.data
    }
}