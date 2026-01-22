import { API } from '@API'
import { handleAjax, returnState, controlDate, componentBox, warnMessageBox, warnMessageBox2, today } from '@UTIL'

const state = {
    gameInfoIsLoading: false,
    GameInfoDetailIndex: -1,
    GameInfoShareIndex: -1,
    gameTempInfo: {},
    gameSum: {
        sum_bonus: 0,
        sum_total_price: 0
    },
    gameInfoList: {},
    gameInfoData: {
        startDate: today(),
        endDate: today(),
        saleStartDate: null,
        saleEndDate: null,
        code: '',
        lotteryId: null,
        methodId: null,
        methodName: null,
        startIssue: null,
        endIssue: null,
        periodType: 1,
        pageLimit: 20,
        status: [0, 1, 2],
        page: null,
        canPageNation: false,
        functionType: 'unity'
    },
    gameInfoPageNationNum: 1,
    gameInfoIssue: []
}

const gameInfoDataTemp = returnState(state.gameInfoData)

const actions = {
    /**
     * API 取得 投注紀錄資料
     * @param {any} { commit, state, rootGetters }
     * @param {object} payload 投注紀錄資料
     */
    async [_M.GET_GAME_INFO_LIST]({ commit, state, rootGetters, dispatch }, payload) {
        if (rootGetters.isShowDemo) {
            return
        }
        const page = payload ? payload.page : false
        // 越南,泰國,股票 改打 orderHistoryVN
        const url = (['vn', 'th', 'stock', 'la', 'my'].includes((payload || {}).countryType)) ? API.orderHistoryVN : API.orderHistory
        let startDate = null
        let endDate = null
        let startIssue = null
        let endIssue = null
        let saleStartDate = null
        let saleEndDate = null
        let lotteryId = null
        if (!page) {
            const calSum = state.gameInfoData.calSum
                ? true
                : payload
                    ? payload.calSum
                    : false
            state.gameInfoData.page
                ? commit(_M.SET_GAME_INFO_DATA, {page: null, calSum})
                : commit(_M.SET_GAME_INFO_DATA, {calSum})
            commit(_M.RESET_GAME_INFO_TEMP)
            dispatch(_M.SET_GAME_INFO_PAGE_NATION_NUM)
        } else {
            if (!state.gameInfoData.canPageNation) {
                payload.page = null
            }
            commit(_M.SET_GAME_INFO_DATA, payload)
        }
        // if (state.gameTempInfo[page]) {
        //     commit(_M.SET_GAME_INFO_LIST, state.gameTempInfo[page])
        //     return
        // }
        // 投注號不需要日期
        if ([1, 2].includes(+state.gameInfoData.periodType)) {
            // GameClientKM : 20170625 Sun 09:27:55 增加一個狀態旗標識別用...資料正在加載...
            if (state.gameInfoData.startDate === 2) {
                startDate = controlDate(7)[4].value
            } else if (state.gameInfoData.startDate === 3) {
                startDate = controlDate(7)[8].value
            } else {
                startDate = state.gameInfoData.startDate
            }
            endDate = state.gameInfoData.endDate
        } else if (+state.gameInfoData.periodType === 4) {
            ({ lotteryId, saleStartDate, saleEndDate } = returnState(state.gameInfoData))
        } else {
            ({ startIssue, endIssue, lotteryId } = returnState(state.gameInfoData))
            // if (!lotteryId) {
            //     return dispatch(_M.SET_MESSAGE_BOX_DATA, warnMessageBox({
            //         // '请选择一个彩种。'
            //         message: 'popup_141'
            //     }))
            // } else if (!(startIssue || endIssue)) {
            //     return dispatch(_M.SET_MESSAGE_BOX_DATA, warnMessageBox({
            //         // '请输入投注期号。'
            //         message: 'popup_142'
            //     }))
            // } else {
            if (/^\d{9}/.test(startIssue) && !/-/.test(startIssue)) {
                startIssue = startIssue.split('')
                startIssue.splice(8, 0, '-')
                startIssue = startIssue.join('')
            }
            if (/^\d{9}/.test(endIssue) && !/-/.test(endIssue)) {
                endIssue = endIssue.split('')
                endIssue.splice(8, 0, '-')
                endIssue = endIssue.join('')
            }
            // }
        }
        commit(_M.SET_GAME_INFO_LOAD, true)
        const { functionType } = payload || {}
        let params = { ...state.gameInfoData, startDate, endDate, startIssue, endIssue, saleStartDate, saleEndDate }
        if (functionType) {
            params.functionType = functionType
            commit(_M.SET_GAME_INFO_DATA, { functionType })
        }
        const data = await handleAjax(url, params, rootGetters)
        data && dispatch(_M.SET_GAME_INFO_LIST, data)
        commit(_M.SET_GAME_INFO_LOAD, false)
        commit(_M.SET_GAME_INFO_DATA, { canPageNation: true })
        return data
    },
    async [_M.GET_GAME_INFO_VNLIST]({ commit, state, rootGetters, dispatch }, payload) {
        console.log(1111)
    },
    /**
     * API 取得 投注紀錄單筆注單資料
     * @param {any} { commit, state, rootGetters }
     * @param {object} payload 注單編號
     */
    async [_M.GET_GAME_INFO_DETAIL]({ commit, state, rootGetters }, payload) {
        commit(_M.SET_GAME_INFO_LOAD, true)
        const params = { ...state.gameInfoData, ...payload, projectId: payload.projectId }
        let url = payload.countryType !== 'vn' ? API.orderHistoryDetail : API.orderHistoryDetailVN
        const data = await handleAjax(url, params, rootGetters)
        if (data) {
            let temp = returnState(rootGetters.RWDMode === 3 ? state.gameTempInfo : state.gameInfoList)
            const index = state.GameInfoDetailIndex
            if (rootGetters.RWDMode === 3) {
                const page = parseInt(index / 20) + 1
                const itemIndex = index % 20
                temp[page].data.list[itemIndex] = { ...data.data.list[0] }
                commit(_M.SET_GAME_TEMP_INFO, temp)
            } else {
                temp.data.list[index] = data.data.list[0]
                commit(_M.SET_GAME_INFO_LIST, temp)
            }
        }
        commit(_M.SET_GAME_INFO_LOAD, false)
    },
    /**
     * 文件內容:
     * 獎期清單 /api/{version}/game/issueList/{jwtToken}
     * ================================================
     * roomMasterId 廳主 ID, userid 使用者 ID
     * 規則說明
     * 查詢日期 (YYYY-MM-DD) (option) 有:一天 無:前五天("就是全部的意思...不需額外寫邏輯")
     * 登入直接取得 roomMasterId, userid()
     * 可查詢項目 lotteryId, methodId, issue
     * 實現邏輯:
     * issueData 是 設定 lotteryId 和 methodId 後 觸發 handelAjax 取得..
     * TODO: 獲得 獎期清單\
     */
    async [_M.GET_GAME_INFO_ISSUE]({ commit, state, rootGetters }) {
        const params = { queryDate: state.gameInfoData.startDate, lotteryId: state.gameInfoData.lotteryId }
        const issueData = await handleAjax(API.issueList, params, rootGetters)
        issueData && commit(_M.SET_GAME_INFO_ISSUE, issueData.data)
    },
    /**
     * 設定資料並緩存在陣列
     * @param {object} payload 設定投注資料
     */
    [_M.SET_GAME_INFO_DATA]({ state, commit }, payload) {
        // commit(_M.RESET_GAME_INFO_TEMP)
        commit(_M.SET_GAME_INFO_DETAIL_INDEX, -1)
        commit(_M.SET_GAME_INFO_SHARE_INDEX, -1)
        payload && commit(_M.SET_GAME_INFO_DATA, payload)
    },
    /**
     * 投注紀錄詳情資料頁索引
     * @param {number} payLoad 投注紀錄詳情資料頁 Index
     */
    [_M.SET_GAME_INFO_DETAIL_INDEX]({ commit }, payLoad) {
        commit(_M.SET_GAME_INFO_DETAIL_INDEX, payLoad)
    },
    /**
     * 投注紀錄分享資料頁索引
     * @param {number} payLoad 投注紀錄詳情資料頁 Index
     */
    [_M.SET_GAME_INFO_SHARE_INDEX]({ commit }, payLoad) {
        commit(_M.SET_GAME_INFO_SHARE_INDEX, payLoad)
    },
    /**
     * 清除所有資料
     */
    [_M.CLEAR_GAME_INFO_DATA]({ commit }) {
        commit(_M.SET_GAME_INFO_LIST, {})
        commit(_M.SET_GAME_INFO_DATA, returnState(gameInfoDataTemp))
        commit(_M.SET_GAME_INFO_ISSUE, [])
        commit(_M.SET_GAME_INFO_SUM, {
            sum_bonus: 0,
            sum_total_price: 0
        })
    },
    /**
     * 分頁顯示頁碼位置
     * @param {any} payLoad 獎期列表
     */
    [_M.SET_GAME_INFO_PAGE_NATION_NUM]({ commit }, payLoad) {
        commit(_M.SET_GAME_INFO_PAGE_NATION_NUM, payLoad)
    },
    /**
     * 投注徹單
     * @param {any} payLoad 投注單號
     */
    [_M.ACTION_PROJECT_CANCEL]({ commit, dispatch, rootGetters }, payLoad) {
        const {
            projectId,
            countryType,
            fn
        } = payLoad
        dispatch(_M.SET_MESSAGE_BOX_DATA, warnMessageBox({
            // '取消' / '您确定要撤销此注单吗?'
            cancelText: 'popup_013',
            message: 'popup_050',
            isShowCancelBtn: true,
            beforeConfirm: async (instance) => {
                // '撤销中...'
                instance.confirmDataText = 'popup_054'
                const data = await handleAjax(API.userProjectCancel, {id: projectId}, rootGetters, { isNotShowMessageBox: true })
                if (!data) {
                    // '撤销失败'
                    dispatch(_M.SET_MESSAGE_BOX_DATA, warnMessageBox2({ message: 'popup_057' }))
                    return
                }
                if (data.result === '0') {
                    // '撤销成功'
                    data.message = 'popup_051'
                    data.type = 'success'
                    const { availablebalance } = data.data
                    availablebalance && commit(_M.SET_WALLET_BALANCE, availablebalance)
                    commit(_M.SET_OFFSET_GET_BALANCE_NUM, 1)
                    await dispatch(_M.GET_GAME_INFO_DETAIL, {projectId, countryType})
                    dispatch(_M.SET_MESSAGE_BOX_DATA, warnMessageBox2(data))

                    // 撤銷後關閉詳情窗&更新列表
                    dispatch(_M.SET_MESSAGE_BOX_DATA, componentBox({
                        show: false
                    }))
                    await dispatch(_M.GET_GAME_INFO_LIST, { countryType })

                    // 320 撤銷成功時回上一頁
                    fn && fn()
                }
            }
        }))
    },
    /**
     * 設定投注紀錄資料
     * @param {any} payLoad 资料
     */
    [_M.SET_GAME_INFO_LIST]({ commit }, payLoad) {
        if (payLoad.params && payLoad.params.calSum) {
            const sum = payLoad.data.list.splice(0, 1)[0]
            commit(_M.SET_GAME_INFO_SUM, sum)
        }
        commit(_M.SET_GAME_INFO_LIST, payLoad)
    },
    /**
     * 設定投注紀錄總計資料
     * @param {any} payLoad 资料
     */
    [_M.SET_GAME_INFO_SUM]({ commit }, payLoad) {
        commit(_M.SET_GAME_INFO_SUM, payLoad)
    }
}
const mutations = {
    /**
     * 設定 投注紀錄資料
     * @param {object} payload 追號紀錄資料
     */
    [_M.SET_GAME_INFO_LIST](state, payload) {
        if (payload.pagination) {
            // state.gameTempInfo[payload.pagination.page] = payload
            state.gameTempInfo = {...state.gameTempInfo, [payload.pagination.page]: payload}
        }
        state.gameInfoList = payload
    },
    /**
     * 設定 投注紀錄資料Temp
     * @param {object} payload 追號紀錄資料
     */
    [_M.SET_GAME_TEMP_INFO](state, payload) {
        state.gameTempInfo = payload
    },
    /**
     * 設定 投注資料總計
     * @param {object} payload 追號紀錄資料
     */
    [_M.SET_GAME_INFO_SUM](state, payload) {
        state.gameSum = payload
    },
    /**
     * 設定資料並緩存在陣列
     * @param {object} payload 設定投注資料
     */
    [_M.SET_GAME_INFO_DATA](state, payload) {
        state.gameInfoData = {...state.gameInfoData, ...payload}
    },
    /**
     * 清除暫存資訊
     */
    [_M.RESET_GAME_INFO_TEMP](state) {
        state.gameTempInfo = {}
    },
    /**
     * 判斷是否載入中
     * @param {boolean} payLoad 判斷是否載入中
     */
    [_M.SET_GAME_INFO_LOAD](state, payLoad) {
        state.gameInfoIsLoading = payLoad
    },
    /**
     * 投注紀錄詳情資料頁索引
     * @param {number} payLoad 投注紀錄詳情資料頁 Index
     */
    [_M.SET_GAME_INFO_DETAIL_INDEX](state, payLoad) {
        state.GameInfoDetailIndex = payLoad
    },
    /**
     * 投注紀錄詳情資料頁索引
     * @param {number} payLoad 投注紀錄詳情資料頁 Index
     */
    [_M.SET_GAME_INFO_SHARE_INDEX](state, payLoad) {
        state.GameInfoShareIndex = payLoad
    },
    /**
     * 獎期列表
     * @param {any} payLoad 獎期列表
     */
    [_M.SET_GAME_INFO_ISSUE](state, payLoad) {
        state.gameInfoIssue = payLoad
    },
    /**
     * 分頁顯示頁碼位置
     * @param {any} payLoad 頁碼
     */
    [_M.SET_GAME_INFO_PAGE_NATION_NUM](state, payLoad = 1) {
        state.gameInfoPageNationNum = payLoad
    }
}

const getters = {
    gameInfoIsLoading: state => state.gameInfoIsLoading,
    gameTempInfo: state => state.gameTempInfo,
    gameSum: state => state.gameSum,
    gameInfoList: state => state.gameInfoList,
    gameInfoData: state => state.gameInfoData,
    GameInfoDetailIndex: state => state.GameInfoDetailIndex,
    GameInfoShareIndex: state => state.GameInfoShareIndex,
    gameInfoIssue: state => state.gameInfoIssue,
    gameInfoPageNationNum: state => state.gameInfoPageNationNum

}

export default {
    state,
    actions,
    mutations,
    getters
}
