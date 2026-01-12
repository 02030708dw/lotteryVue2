import { API } from '@API'
import { handleAjax } from '@UTIL'

const state = {
    gameInfoControl: {}
}

const actions = {
    /**
     * 取得遊戲資料(不含獎期)
     * @param {any} { state, commit, dispatch }
     * @param {any} lotteryId 彩種 ID
     */
    async [_M.GET_GAME_INFO_CONTROL]({ state, commit, rootGetters }, lotteryId) {
        // TODO:: error handle
        const menuId = rootGetters.lotteryList2[lotteryId].menuId
        if (menuId) {
            let gameConfig
            const params = { lotteryId }
            let data = {}
            switch (true) {
                // 官方
                case +menuId === 1:
                    gameConfig = await handleAjax(API.gameConfig, params, rootGetters)
                    data.gameConfigData = gameConfig.data.gameConfigData
                    commit(_M.SET_GAME_INFO_CONTROL, {
                        menuId,
                        lotteryId,
                        data
                    })
                    break
                // 信用, 越南, 桌面, 番攤, 泰國
                case [2, 3, 4, 5, 6, 7, 8, 9, 10].includes(+menuId):
                    gameConfig = await handleAjax(API.getMethodList, params, rootGetters)
                    gameConfig.data.map(method => {
                        method.showTitle =
                            (menuId === 3 ? method.mode_key : method.parent_key) + '@' + method.method_key
                        return method
                    })
                    commit(_M.SET_GAME_INFO_CONTROL, {
                        menuId,
                        lotteryId,
                        data: gameConfig.data
                    })
                    break
                default:
                    console.warn('no this menuId!')
                    break
            }
        }
    }
}
const mutations = {
    /**
     * 遊戲主要資料
     * @param {any} state Global Stroe
     * @param {any} payload  Object 要存進去的資料
     */
    [_M.SET_GAME_INFO_CONTROL](state, payload) {
        const {menuId, lotteryId, data} = payload
        let menu = state.gameInfoControl[menuId]
        !menu && (state.gameInfoControl[menuId] = {})
        const obj = {
            [menuId]: {
                [lotteryId]: data
            }
        }
        // 處理 getter 抓不到資料的問題
        state.gameInfoControl = {...state.gameInfoControl, ...obj}
    }
}
const getters = {
    gameInfoControl: state => state.gameInfoControl
}
export default {
    state,
    actions,
    mutations,
    getters
}
