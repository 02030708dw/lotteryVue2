import state from './state'
import actions from './actions'
import mutations from './mutations'

const getters = {
    // ****************** 後端遊戲資料 Start ************ /
    MY_currentLottery: (state, getters) => getters.lotteryList2[getters.MY_lotteryId],
    MY_flipTimer: state => state.MY_flipTimer,
    MY_codeTime(state) {
        let hour = state.MY_flipTimer.hours
        if (hour === '000') {
            hour = ''
        } else if (hour[0] === '0') {
            hour = hour.substr(1, 2) + ':'
        } else {
            hour += ':'
        }
        return hour + `${state.MY_flipTimer.minutes}:${state.MY_flipTimer.seconds}`
    },
    MY_jsPrizePoint: state => state.MY_floatPrize.jsPrizePoint,
    MY_nowPrize: (state, getters) => {
        if (getters.MY_methodIsSelect.length) {
            const methodId = getters.MY_methodIsSelect[0]
            const { hprize, autoOdds } = state.MY_floatPrize.jsPrizePoint[methodId][0]
            return (hprize + autoOdds).strip()
        } else {
            return ''
        }
    },
    MY_nowGame: (state, getters) => {
        if (getters.MY_methodIsSelect.length) {
            const methodId = getters.MY_methodIsSelect[0]
            const { title_key } = getters.MY_gameSubMenuObj[methodId]
            return title_key
        } else {
            return ''
        }
    },
    MY_gamePlayData: state => state.MY_gamePlayData.gameConfigData || {},
    MY_gameMethods: (state, getters) => getters.MY_gamePlayData.gameMethods || [],
    MY_gameMenu: (state, getters) => {
        const menu = ['1D', '2D', '3D']
        let data = {}
        menu.forEach((key, i) => {
            getters.MY_gameMethods.find(({title}) => title === key) && (data[i] = key)
        })
        return data
    },
    MY_gameMenuKey: (state, getters) => {
        const keyObj = {
            '1D': 'thai_011',
            '2D': 'thai_010',
            '3D': 'thai_009'
        }
        return getters.MY_gameMethods.map(({title}) => keyObj[title])
    },
    MY_firstGame: (state, getters) => +Object.keys(getters.MY_gameMenu)[0],
    MY_gameSubMenu: (state, getters) => {
        const parent = getters.MY_gameMethods.find(({title}) => title === `${getters.MY_menuIndex + 1}D`) || { childs: [] }
        return (parent.childs[0] || {}).childs || []
    },
    MY_gameSubMenuObj: (state, getters) => {
        let obj = {}
        getters.MY_gameMethods.forEach(({childs}) => {
            (((childs || [])[0] || []).childs || []).forEach((data) => {
                obj[data.methodId] = data
            })
        })
        return obj
    },
    MY_gameSubMethodId: (state, getters) => {
        return getters.MY_gameSubMenu.map(({methodId}) => methodId)
    },
    MY_stake: state => +state.MY_gamePlayData.stake || 0,
    MY_bonus_limit: state => state.MY_gamePlayData.bonus_limit || 500000,
    MY_jsDynamicConfig: state => state.MY_jsDynamicConfig.data || {},
    MY_lastnumber: (state, getters) => getters.MY_jsDynamicConfig.lastnumber || 'null',
    MY_openingIssue: (state, getters) => getters.MY_jsDynamicConfig.openingIssue || 'null',
    MY_number: (state, getters) => getters.MY_jsDynamicConfig.number || 'null',
    MY_historyBall: (state, getters) => getters.MY_jsDynamicConfig.historyBall || [],
    MY_lastballs: (state, getters) => getters.MY_jsDynamicConfig.lastballs || '',
    MY_lotteryId: state => state.MY_gameSubmit.lotteryId,
    // ****************** 後端遊戲資料 End ************ /
    // ****************** 遊戲配置 Start ************ /
    MY_isLoading: state => state.MY_isLoading,
    MY_menuIndex: state => state.MY_menuIndex,
    MY_gameType: state => state.MY_gameType,
    MY_isOld: state => state.MY_gameType === 'Old',
    MY_gameSubmit: state => state.MY_gameSubmit,
    MY_gameSelectDataMoney: (state, getters) => getters.MY_gameSelectDataArr.reduce((a, b) => a + +b.money, 0),
    MY_gameSelectData: state => state.MY_gameSelectData,
    MY_gameSelectDataArr: state => Object.values(state.MY_gameSelectData),
    MY_gameOrderMoney: (state, getters) => getters.MY_gameOrderArr.reduce((a, b) => a + +b.money, 0),
    MY_gameOrder: state => state.MY_gameOrder,
    MY_gameOrderArr: state => Object.values(state.MY_gameOrder),
    MY_money: state => state.MY_money,
    MY_methodSelect: state => state.MY_methodSelect,
    // 目前有選取的 methodid 排除停售
    MY_methodIsSelect: (state, getters) => getters.MY_gameSubMethodId.filter(id => getters.MY_methodSelect[id]),
    // 停售
    MY_stop: state => {
        let obj = {}
        state.MY_stop.forEach(id => (obj[id] = true))
        return obj
    },
    // 超出限額
    MY_over: state => {
        let obj = {}
        state.MY_over.forEach(id => (obj[id] = true))
        return obj
    },
    // 賠率是否更新
    MY_prizeChange: state => state.MY_prizeChange

    // ****************** 遊戲配置 Start ************ /
}

export default {
    state,
    actions,
    mutations,
    getters
}
