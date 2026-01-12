import { API } from '@API'
import { handleAjax } from '@UTIL'

const state = {
    scoreBoardIsLoading: false,
    scoreBoardData: {}
}

const actions = {
    /**
     * 取得 名人榜榜單資料
     */
    async [_M.GET_SCORE_BOARD_DATA]({ commit, state, rootGetters }) {
        commit(_M.SET_SCORE_BOARD_ISLOADING, true)

        const { result, data } = await handleAjax(API.getLeaderBoard, {}, rootGetters)
        if (+result === 0) {
            commit(_M.SET_SCORE_BOARD_DATA, data)
        }

        commit(_M.SET_SCORE_BOARD_ISLOADING, false)
    }
}
const mutations = {
    /**
     * 設定 名人榜列表資料
     * @param {object} payload 列表資料
     */
    [_M.SET_SCORE_BOARD_DATA](state, payload) {
        state.scoreBoardData = {...payload}
    },
    /**
     * 設定 名人榜是否正在載入
     * @param {boolean} payload 是否正在載入
     */
    [_M.SET_SCORE_BOARD_ISLOADING](state, payload) {
        state.scoreBoardIsLoading = !!payload
    }
}

const getters = {
    // 是否正在載入中
    isScoreBoardLoading: state => state.scoreBoardIsLoading,
    // 取得最後更新時間
    getScoreBoardUpdateTime: state => state.scoreBoardData.lastUpdated || '',
    // 取得投注金額名人榜
    getOrderScoreBoard: state => state.scoreBoardData.orderingAmountLeaderBoard || [],
    // 取得中獎金額名人榜
    getWinningScoreBoard: state => state.scoreBoardData.winningAmountLeaderBoard || []
}

export default {
    state,
    actions,
    mutations,
    getters
}