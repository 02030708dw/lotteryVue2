import { getMoney } from './functions'
import { returnState } from '@UTIL'

export default {
    /**
     * 設定遊戲核心資料
     * @param {any} state Global Stroe
     * @param {Object} payload 遊戲資料
     */
    [_M.SET_GAME_CONFIG](state, payload) {
        state.gameConfig = Object.assign({}, state.gameConfig, payload)
    },
    /**
     * 投注計時時間
     * @param {any} state Global Stroe
     * @param {any} payload  Object 要存進去的資料
     * @param {String} payload.key  (多獎期)索引
     * @param {Object} payload.data  (多獎期)要存進去的資料
     */
    [_M.SET_FLIP_TIMEER_DATA](state, payload) {
        const {key, data} = payload
        if (data) {
            // 有data => 存資料
            state.flipTimer.muti[key] = {...state.flipTimer.muti[key], ...data}
            return
        }
        // 無data,無key => 單Timer存資料
        state.flipTimer = { ...state.flipTimer, ...payload }
    },
    /**
     * 遊戲部分參數
     * @param {any} state Global Stroe
     * @param {any} payload  Object 要存進去的資料
     */
    [_M.SET_GAME_DATA](state, payload) {
        state.game = { ...state.game, ...payload }
    },
    /**
     * 遊戲主要資料
     * @param {any} state Global Stroe
     * @param {any} payload  Object 要存進去的資料
     */
    [_M.SET_GAME_PLAY_DATA](state, payload) {
        state.gamePlayData = { ...state.gamePlayData, ...payload }
    },
    /**
     * 遊戲主要獎期資料
     * @param {any} state Global Stroe
     * @param {any} payload  Object 要存進去的資料
     */
    [_M.SET_GAME_PLAY_DYNAMIC_DATA](state, payload) {
        state.jsDynamicConfig = { ...state.jsDynamicConfig, ...payload }
    },
    /**
     * 遊戲選球/計算的資料
     * @param {any} state Global Stroe
     * @param {any} payload  Object 要存進去的資料
     */
    [_M.SET_GAME_ORDER_DATA](state, payload) {
        if (payload.nums || payload.times || payload.mode || payload.betMultiLimit || payload.onePrice) {
            const nums = payload.nums || payload.nums === 0 ? payload.nums : state.gameOrder.nums
            let times = payload.times || state.gameOrder.times
            const mode = payload.mode || state.gameOrder.mode
            payload.money = getMoney({
                mode,
                nums,
                onePrice: payload.onePrice || state.gameOrder.onePrice,
                times
            })
        } else if (payload.digitstr || payload.bonus) {

        } else {
            payload.money = 0
            payload.bonus = 0
        }
        state.gameOrder = { ...state.gameOrder, ...payload }
    },
    /**
     * 修改checkbox選取狀態
     * @param {any} state Global Stroe
     * @param {object} payload  activeCheckboxes
     */
    [_M.SET_ACTIVE_CHECKBOXES](state, payload) {
        state.gameOrder.activeCheckboxes = payload
    },
    /**
     * 設定 所有選球組合(gameBallCombine)
     * @param {object} payload  gameBallCombine
     */
    [_M.SET_BALLS_COMBINE](state, payload = []) {
        state.gameOrder.gameBallCombine = payload
    },
    /**
     * 遊戲投注資料
     * @param {any} state Global Stroe
     * @param {any} payload  Object 要存進去的資料
     */
    [_M.SET_SUBMIT_DATA](state, payload) {
        state.gameSubmit = {
            ...state.gameSubmit,
            ...payload
        }
    },
    /**
     * 設定注單暫存(gameOrder.ltProjectTemp)資料
     * @param {Number} payload.type 功能代碼
     * @param {String,Number} payload.idx 設定對象在整個陣列的index
     * @param {Object} payload.data 資料內容
     */
    [_M.SET_PROJECT_TEMP](state, payload = {}) {
        const {type, idx, data} = payload
        switch (type) {
            // 新增單一(暫未使用)
            // case 1:
            //     state.gameOrder.ltProjectTemp.push(data)
            //     break
            // 修改單一
            case 2:
                state.gameOrder.ltProjectTemp[idx] = {...state.gameOrder.ltProjectTemp[idx], ...data}
                break
            // 刪除單一
            case 3:
                state.gameOrder.ltProjectTemp.splice(idx, 1)
                break
            // 覆蓋單一(暫未使用)
            // case 4:
            //     state.gameOrder.ltProjectTemp[idx] = data
            //     break
            // 全覆蓋
            case 5:
                state.gameOrder.ltProjectTemp = data
                break
            // 全清空
            default:
                state.gameOrder.ltProjectTemp = []
                break
        }
    },
    /**
     * 設定注單資料
     */
    [_M.SET_GAME_LT_PROJECT](state, payload = {}) {
        const {type, index, data} = payload

        switch (type) {
            // 新增單一
            case 1:
                state.gameLtProject = [data, ...state.gameLtProject]
                break
            // 覆蓋單一
            case 2:
                state.gameLtProject[index] = data
                break
            // 濾除單一
            case 3:
                state.gameLtProject = state.gameLtProject.filter((obj, idx) => idx !== index)
                break
            // 全覆蓋
            case 4:
                state.gameLtProject = data
                break
            // 修改單一
            case 5:
                state.gameLtProject[index] = {...state.gameLtProject[index], ...data}
                break
            // 全清空
            default:
                state.gameLtProject = []
                break
        }
    },
    /**
     * 設定信用玩法注單資料
     */
    [_M.SET_CREDIT_GAME_LT_PROJECT](state, payload = {}) {
        switch (payload.type) {
            // 新/修
            case 1:
                state.creditGameLtProject = { ...state.creditGameLtProject, [payload.key]: payload }
                break
            // 刪除
            case 2:
                const creditGameLtProject = returnState(state.creditGameLtProject)
                delete creditGameLtProject[payload.key]
                state.creditGameLtProject = creditGameLtProject
                break
            // 批次變更
            case 3:
                state.creditGameLtProject = { ...state.creditGameLtProject, ...payload.creditGameLtProject }
                break
            // 批次清除
            case 4:
                Object.keys(payload.creditGameLtProject).forEach(key => delete state.creditGameLtProject[key])
                state.creditGameLtProject = { ...state.creditGameLtProject }
                break
            // set
            case 5:
                state.creditGameLtProject = payload.creditGameLtProject
                break
            // 清除
            default:
                state.creditGameLtProject = {}
                // state.overLimitMethods = {}
                break
        }
    },
    /**
     * 修改投注總金額/注數
     */
    [_M.SET_SUBMIT_MONEY](state) {
        const ltProject = state.gameLtProject
        const orderFutureIssue = state.gameSubmit.orderFutureIssue
        let ltProjectNum = 0
        let ltMoneyAmout = 0
        let orderFutureMoneyAmount = 0
        if (state.gameSubmit.orderFuture) {
            ltProject.forEach(({nums, money, times}) => {
                ltProjectNum += (+nums)
                ltMoneyAmout += parseFloat((money / times).toFixed(2))
            })
            orderFutureIssue.forEach(({money, checked}) => {
                if (checked) {
                    orderFutureMoneyAmount += Math.abs(parseFloat(money))
                }
            })
        } else {
            ltProject.forEach(({nums, money}) => {
                ltProjectNum += (+nums)
                ltMoneyAmout += parseFloat(money)
            })
        }
        state.gameSubmit.ltProjectNum = ltProjectNum
        state.gameSubmit.ltMoneyAmout = ltMoneyAmout.toFixed(2)
        state.gameSubmit.orderFutureMoneyAmount = orderFutureMoneyAmount.toFixed(2)
    },
    /**
     * 已經添加過注單的名稱快取(拿來判斷是否為相同注單)
     * @param {object} payload.gameOrder gameOrder
     * @param {object} payload.isSave 是否還有效(可能被刪除所以失效)
     * @param {object} payload.key 自訂快取索引名稱
     */
    [_M.SET_GAME_BOX_TEMP](state, payload) {
        if (payload) {
            let { gameOrder, isSave, key } = payload
            const { type, mode, methodId, codes, digitstr, keepPoint, killPairEnabled } = gameOrder
            key = key || (methodId + mode + type + codes + digitstr + keepPoint + killPairEnabled)
            state.gameBoxTemp[key] = isSave
        } else {
            state.gameBoxTemp = {}
        }
    },
    /**
     * 320模式顯示區塊
     * @param {any} payload 0: 選球, 1: 小助手, 2: 投注項
     */
    [_M.SET_GAME_SHOW_MODE](state, payload) {
        state.gameShowMode = payload
    },
    /**
     * 320 遊戲選單是否顯示
     */
    [_M.SET_GAME_MENU_ACTIVE](state) {
        state.gameMenuActive = !state.gameMenuActive
    },
    /**
     * set 被封鎖停押的玩法
     */
    [_M.SET_BLOCKED_METHODS](state, payload) {
        state.blockedMethods = payload
    },
    /**
     * set 超出封鎖值的玩法
     */
    [_M.SET_OVERLIMIT_METHODS](state, payload) {
        state.overLimitMethods = payload
    },
    /**
     * set 超出用戶限額的玩法
     */
    [_M.SET_BONUS_OVERLIMIT_METHODS](state, payload) {
        state.bonusOverLimitMethods = payload
    },
    /*
     * 返點%設定
     */
    [_M.SET_KEEP_POINT](state, payload) {
        state.keepPoint = +payload
    },
    /**
     * 賠率是否更新
     */
    [_M.SET_DIFF_PRIZE_DATA](state, payload) {
        state.diffPrizeData = { ...payload }
    },
    /**
     * 賠率拉吧索引
     */
    [_M.GET_FLOAT_PRIZE](state, payload) {
        state.floatPrize = payload
    },
    /**
     * 信用投注視窗是否允許刪除注單
     */
    [_M.SET_SIN_SUBMIT_BOX_CAN_CANCEL](state, payload) {
        state.sinSubmitBoxCanCancel = payload
    },
    // 設定玩法頁籤
    [_M.SET_TAB_INDEX](state, payload) {
        const { parentTabIndex, tabIndex } = payload
        state.parentTabIndex = parentTabIndex
        state.tabIndex = tabIndex
    },
    [_M.SET_IS_FAST](state, payload) {
        state.isFast = payload
    },
    /**
     * 殺對子
     */
    [_M.SET_KILL_PAIR](state, payload) {
        state.killPairEnabled = payload
    },
    /*
     * 因應桌面設定 玩法介紹資料
     * @param {any} payload
     */
    [_M.SET_PLAYINFO_LIST](state, payload) {
        state.gameTablePlayInfoList = { ...state.gameTablePlayInfoList, ...payload }
    },
    /**
     * 設定是否有路紙
     */
    [_M.SET_HAS_GAME_SCORE](state, payload) {
        state.hasGameScore = payload
    },
    // 番攤-路紙顯示開關
    [_M.SET_SCORE_SHOW](state, payload) {
        state.isScoreShow = payload
    },
    // 番攤-設定橡皮擦模式
    [_M.SET_ERASER](state, payload) {
        state.isEraser = payload
    },
    // 設定投注額外選項
    [_M.SET_GAME_OPTION](state, payload) {
        state.gameOption = {...payload}
    }
}
