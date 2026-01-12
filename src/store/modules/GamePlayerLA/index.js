import state from './state'
import actions from './actions'
import mutations from './mutations'

const getters = {
    // ****************** 後端遊戲資料 Start ************ /
    LA_currentLottery: (state, getters) => getters.lotteryList2[getters.LA_lotteryId],
    LA_flipTimer: state => state.LA_flipTimer,
    LA_codeTime(state) {
        let hour = state.LA_flipTimer.hours
        if (hour === '000') {
            hour = ''
        } else if (hour[0] === '0') {
            hour = hour.substr(1, 2) + ':'
        } else {
            hour += ':'
        }
        return hour + `${state.LA_flipTimer.minutes}:${state.LA_flipTimer.seconds}`
    },
    LA_jsPrizePoint: state => state.LA_floatPrize.jsPrizePoint,
    LA_nowPrize: (state, getters) => {
        if (getters.LA_methodIsSelect.length) {
            const methodId = getters.LA_methodIsSelect[0]
            const { hprize, autoOdds } = state.LA_floatPrize.jsPrizePoint[methodId][0]
            return (hprize + autoOdds).strip()
        } else {
            return ''
        }
    },
    LA_nowGame: (state, getters) => {
        if (getters.LA_methodIsSelect.length) {
            const methodId = getters.LA_methodIsSelect[0]
            const { title_key } = getters.LA_gameSubMenuObj[methodId]
            return title_key
        } else {
            return ''
        }
    },
    LA_gamePlayData: state => state.LA_gamePlayData.gameConfigData || {},
    LA_gameMethods: (state, getters) => getters.LA_gamePlayData.gameMethods || [],
    LA_gameMenu: (state, getters) => {
        const menu = ['1D', '2D', '3D']
        let data = {}
        menu.forEach((key, i) => {
            getters.LA_gameMethods.find(({title}) => title === key) && (data[i] = key)
        })
        return data
    },
    LA_gameMenuKey: (state, getters) => {
        const keyObj = {
            '1D': 'thai_011',
            '2D': 'thai_010',
            '3D': 'thai_009'
        }
        return getters.LA_gameMethods.map(({title}) => keyObj[title])
    },
    LA_firstGame: (state, getters) => +Object.keys(getters.LA_gameMenu)[0],
    LA_gameSubMenu: (state, getters) => {
        const parent = getters.LA_gameMethods.find(({title}) => title === `${getters.LA_menuIndex + 1}D`) || { childs: [] }
        return (parent.childs[0] || {}).childs || []
    },
    LA_gameSubMenuObj: (state, getters) => {
        let obj = {}
        getters.LA_gameMethods.forEach(({childs}) => {
            (((childs || [])[0] || []).childs || []).forEach((data) => {
                obj[data.methodId] = data
            })
        })
        return obj
    },
    LA_gameSubMethodId: (state, getters) => {
        return getters.LA_gameSubMenu.map(({methodId}) => methodId)
    },
    LA_stake: state => +state.LA_gamePlayData.stake || 0,
    LA_bonus_limit: state => state.LA_gamePlayData.bonus_limit || 500000,
    LA_jsDynamicConfig: state => state.LA_jsDynamicConfig.data || {},
    LA_lastnumber: (state, getters) => getters.LA_jsDynamicConfig.lastnumber || 'null',
    LA_openingIssue: (state, getters) => getters.LA_jsDynamicConfig.openingIssue || 'null',
    LA_number: (state, getters) => getters.LA_jsDynamicConfig.number || 'null',
    LA_historyBall: (state, getters) => getters.LA_jsDynamicConfig.historyBall || [],
    LA_lastballs: (state, getters) => getters.LA_jsDynamicConfig.lastballs || '',
    LA_lotteryId: state => state.LA_gameSubmit.lotteryId,
    // ****************** 後端遊戲資料 End ************ /
    // ****************** 遊戲配置 Start ************ /
    LA_isLoading: state => state.LA_isLoading,
    LA_menuIndex: state => state.LA_menuIndex,
    LA_gameType: state => state.LA_gameType,
    LA_isOld: state => state.LA_gameType === 'Old',
    LA_gameSubmit: state => state.LA_gameSubmit,
    LA_gameSelectDataMoney: (state, getters) => getters.LA_gameSelectDataArr.reduce((a, b) => a + +b.money, 0),
    LA_gameSelectData: state => state.LA_gameSelectData,
    LA_gameSelectDataArr: state => Object.values(state.LA_gameSelectData),
    LA_gameOrderMoney: (state, getters) => getters.LA_gameOrderArr.reduce((a, b) => a + +b.money, 0),
    LA_gameOrder: state => state.LA_gameOrder,
    LA_gameOrderArr: state => Object.values(state.LA_gameOrder),
    LA_money: state => state.LA_money,
    LA_methodSelect: state => state.LA_methodSelect,
    // 目前有選取的 methodid 排除停售
    LA_methodIsSelect: (state, getters) => getters.LA_gameSubMethodId.filter(id => getters.LA_methodSelect[id]),
    // 停售
    LA_stop: state => {
        let obj = {}
        state.LA_stop.forEach(id => (obj[id] = true))
        return obj
    },
    // 超出限額
    LA_over: state => {
        let obj = {}
        state.LA_over.forEach(id => (obj[id] = true))
        return obj
    },
    // 賠率是否更新
    LA_prizeChange: state => state.LA_prizeChange

    // ****************** 遊戲配置 Start ************ /
}

export default {
    state,
    actions,
    mutations,
    getters
}
