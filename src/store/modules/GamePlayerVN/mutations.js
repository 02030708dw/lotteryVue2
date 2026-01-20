
const orderMethod = {
    // 變更投注資料
    1: (state, payload) => (state.VN_gameSubmit = payload),
    // 經典版刪除訂單
    2: (state, payload) => {
        const { money, nums, tNums } = state.VN_gameSubmit.showList[payload.index]
        state.VN_gameSubmit.showList.splice(payload.index, 1)
        state.VN_gameSubmit.ltMoneyAmout -= money
        state.VN_gameSubmit.ltProjectNum -= tNums || nums
    },
    3: (state, payload) => {
        const data = state.VN_gameOrder
        const len = data.showList.length
        if (len) {
            const { ltMoneyAmout, order, orderRowNum } = payload
            let { showList } = payload
            const insRowNum = Object.keys(data.order).length
            showList = showList.map((list) => {
                list.id = +list.id + insRowNum
                return list
            })
            let newOrder = {}
            Object.entries(order).forEach(([key, val]) => (newOrder[+key + insRowNum] = val))
            state.VN_gameOrder.showList = [...data.showList, ...showList]
            state.VN_gameOrder.order = { ...data.order, ...newOrder }
            state.VN_gameOrder.orderRowNum += orderRowNum
            state.VN_gameOrder.ltMoneyAmout += ltMoneyAmout
        } else {
            state.VN_gameOrder = payload
        }
    },
    // 經典版 320 刪除訂單
    4: (state, payload) => {
        const { money, nums, tNums } = state.VN_gameOrder.showList[payload.index]
        state.VN_gameOrder.showList.splice(payload.index, 1)
        const orderRowNum = state.VN_gameOrder.showList.map(({ id }) => id).unique().length
        state.VN_gameOrder.orderRowNum = orderRowNum
        state.VN_gameOrder.ltMoneyAmout -= money
        state.VN_gameOrder.ltProjectNum -= tNums || nums
    },
    // 重置選球區內容
    5: (state) => {
        state.VN_gameOrder = {
            showList: [],
            ltMoneyAmout: 0,
            orderRowNum: 0
        }
    },
    // 經典版投注項處理
    6: (state, payload) => {
        state.VN_gameOrder.showList.forEach((list, i) => {
            state.VN_gameOrder.showList[i].cityList = list.cityList.filter((city) => {
                const { issue, pos } = city
                const bool = issue.replace('-', '') >= payload.issueAreaDate[pos]
                if (!bool) {
                    list.methodVal.forEach((val, j) => {
                        if (val) {
                            const { nums = 0, money = 0 } = state.VN_gameOrder.order[list.id][`${city.key}${j}`]
                            state.VN_gameOrder.order[list.id][`count${city.issue}`] -= nums
                            state.VN_gameOrder.order[list.id][`money${city.issue}`] -= money
                            state.VN_gameOrder.ltMoneyAmout -= money
                        }
                    })
                    return false
                }
                return true
            })
        })
        state.VN_gameOrder.showList = state.VN_gameOrder.showList.filter(list => list.cityList.length)
    },
    // 單式球版投注項
    7: (state, payload) => (state.VN_gameOrder = { ...state.VN_gameOrder, ...payload }),
    // 重置投注項
    8: (state) => {
        state.VN_gameSubmit = {
            showList: [],
            ltMoneyAmout: 0,
            ltProjectNum: 0
        }
    }
}

export default {
    /**
     * 設定越南彩獎期資料
     * @param {any} state Global Stroe
     * @param {any} payload  號碼區金額
     */
    [_M.SET_FLIP_TIMEER_VN_DATA](state, payload) {
        state.VN_flipTimer = payload
    },
    /**
     * 越南彩遊戲區設定金額
     * @param {any} state Global Stroe
     * @param {any} payload  號碼區金額
     */
    [_M.SET_GAME_AREA_VN_MONEY](state, payload) {
        state.VN_gameAreaMoney = payload
    },
    /**
     * 設定越南彩獎期及倒數
     * @param {any} state Global Stroe
     * @param {any} payload  號碼區金額
     */
    [_M.SET_COLD_DOWN_VN_DATA](state, payload) {
        state.VN_jsDynamicConfig = payload
    },
    /**
     * 設定越南彩最新號碼
     * @param {any} state Global Stroe
     * @param {any} payload  號碼區金額
     */
    [_M.SET_GAME_LASTNUMBER_VN](state, payload = {}) {
        const { lastNumber = '', lastIssue = '' } = payload
        state.VN_lastNumber = lastNumber
        state.VN_lastIssue = lastIssue
    },
    /**
     * 設定越南彩最新號碼V2
     * @param {any} state Global Stroe
     * @param {any} payload  號碼區金額数组
     */
    [_M.SET_GAME_LASTNUMBER_VN_V2](state, payload = {}) {
        state.VN_lastNumber_V2 = payload
    },
    /**
     * 設定越南彩獎期城市
     * @param {any} state Global Stroe
     * @param {any} payload  獎期城市
     */
    [_M.SET_VN_AREA_DATA](state, payload) {
        state.VN_area = payload
    },
    /**
     * 設定越南彩遊戲資料
     * @param {any} state Global Stroe
     * @param {any} payload  遊戲資料
     */
    [_M.SET_GAME_CONFIG_VN_DATA](state, payload) {
        state.VN_gameConfig = payload
    },
    /**
     * 越南彩遊戲部分參數
     * @param {any} state Global Stroe
     * @param {any} payload  Object 要存進去的資料
     */
    [_M.SET_GAME_VN_DATA](state, payload) {
        state.VN_game = { ...state.VN_game, ...payload }
    },
    /**
     * 越南彩彈窗資料
     * @param {any} state Global Stroe
     * @param {any} payload  Object 要存進去的資料
     */
    [_M.GAME_ORDER_VN_SUBMIT](state, payload) {
        orderMethod[payload.type](state, payload)
    },
    /**
     * 320 遊戲選單是否顯示
     */
    [_M.SET_GAME_MENU_ACTIVE](state) {
        state.VN_gameMenuActive = !state.VN_gameMenuActive
    },
    /**
     * 設定越南彩封鎖停押
     * @param {any} state Global Stroe
     * @param {any} payload  封鎖停押
     */
    [_M.SET_STOP_VN_DATA](state, payload) {
        state.VN_stop = payload
    },
    /**
     * 設定越南彩封鎖停押跟停售
     * @param {any} state Global Stroe
     * @param {any} payload  設定越南彩封鎖停押跟停售
     */
    [_M.SET_STOP_AND_OVER_VN_DATA](state, payload = []) {
        state.VN_stopAndOver = payload
    },
    /**
     * 設定越南彩玩法開關
     * @param {any} state Global Stroe
     * @param {any} payload  玩法開關
     */
    [_M.SET_BLOCKED_VN_DATA](state, payload) {
        state.VN_blocked = payload
    },
    [_M.SET_VN_TEMP_DATA](state, payload = {}) {
        state[payload.temp] = payload.data
    }
}