import state from './state'
import actions from './actions'
import mutations from './mutations'

const getters = {
    // ****************** 後端遊戲資料 Start ************ /
    TH_currentLottery: (state, getters) => getters.lotteryList2[getters.TH_lotteryId],
    TH_flipTimer: state => state.TH_flipTimer,
    TH_codeTime(state) {
        let hour = state.TH_flipTimer.hours
        if (hour === '000') {
            hour = ''
        } else if (hour[0] === '0') {
            hour = hour.substr(1, 2) + ':'
        } else {
            hour += ':'
        }
        return hour + `${state.TH_flipTimer.minutes}:${state.TH_flipTimer.seconds}`
    },
    TH_jsPrizePoint: state => state.TH_floatPrize.jsPrizePoint,
    TH_gamePlayData: state => state.TH_gamePlayData.gameConfigData || {},
    TH_gameMethods: (state, getters) => getters.TH_gamePlayData.gameMethods || [],
    TH_gameMenu: (state, getters) => {
        const menu = ['1D', '2D', '3D']
        let data = {}
        menu.forEach((key, i) => {
            getters.TH_gameMethods.find(({title_show}) => title_show === key) && (data[i] = key)
        })
        return data
    },
    TH_gameMenuKey: (state, getters) => {
        const keyObj = {
            '1D': 'thai_011',
            '2D': 'thai_010',
            '3D': 'thai_009'
        }
        return getters.TH_gameMethods.map(({title}) => keyObj[title])
    },
    TH_firstGame: (state, getters) => +Object.keys(getters.TH_gameMenu)[0],
    TH_gameSubMenu: (state, getters) => {
        const parent = getters.TH_gameMethods.find(({title_show}) => title_show === `${getters.TH_menuIndex + 1}D`) || { childs: [] }
        return (parent.childs[0] || {}).childs || []
    },
    TH_gameSubMenuObj: (state, getters) => {
        let obj = {}
        getters.TH_gameMethods.forEach(({childs}) => {
            (((childs || [])[0] || []).childs || []).forEach((data) => {
                obj[data.methodId] = data
            })
        })
        return obj
    },
    TH_gameSubMethodId: (state, getters) => {
        return getters.TH_gameSubMenu.map(({methodId}) => methodId)
    },
    TH_stake: state => +state.TH_gamePlayData.stake || 0,
    TH_bonus_limit: state => state.TH_gamePlayData.bonus_limit || 500000,
    TH_jsDynamicConfig: state => state.TH_jsDynamicConfig.data || {},
    TH_lastnumber: (state, getters) => getters.TH_jsDynamicConfig.lastnumber || 'null',
    TH_openingIssue: (state, getters) => getters.TH_jsDynamicConfig.openingIssue || 'null',
    TH_number: (state, getters) => getters.TH_jsDynamicConfig.number || 'null',
    TH_historyBall: (state, getters) => getters.TH_jsDynamicConfig.historyBall || [],
    TH_lastballs: (state, getters) => getters.TH_jsDynamicConfig.lastballs || '',
    TH_lotteryId: state => state.TH_gameSubmit.lotteryId,
    // ****************** 後端遊戲資料 End ************ /
    // ****************** 遊戲配置 Start ************ /
    TH_isLoading: state => state.TH_isLoading,
    TH_menuIndex: state => state.TH_menuIndex,
    TH_gameType: state => state.TH_gameType,
    TH_isOld: state => state.TH_gameType === 'Old',
    TH_gameSubmit: state => state.TH_gameSubmit,
    TH_ltMoneyAmout: (state, getters) => getters.TH_gameSelectDataArr.reduce((a, b) => a + +b.money, 0),
    TH_gameSelectData: state => state.TH_gameSelectData,
    TH_gameSelectDataArr: state => Object.values(state.TH_gameSelectData),
    TH_money: state => state.TH_money,
    TH_methodSelect: state => state.TH_methodSelect,
    // 目前有選取的 methodid 排除停售
    TH_methodIsSelect: (state, getters) => getters.TH_gameSubMethodId.filter(id => getters.TH_methodSelect[id] && !getters.TH_stop[id]),
    // 停售
    TH_stop: state => {
        let obj = {}
        state.TH_stop.forEach(id => (obj[id] = true))
        return obj
    },
    // 停壓號碼
    TH_stopNumber: state => state.TH_stopNumber,
    // 停壓號碼
    TH_stopNumberCalc: state => {
        let obj = {}
        Object.entries(state.TH_stopNumber).forEach(([key, numbers]) => {
            const [, , method] = key.split('.')
            numbers.forEach((number) => {
                obj[`${method}_${number}`] = method
            })
        })
        return obj
    },
    TH_StopNumberFilter: (state, getters) => {
        return getters.TH_gameSelectDataArr.filter(({methodId, codes}) => getters.TH_stopNumberCalc[`${methodId}_${codes}`])
    },
    // 超出限額
    TH_over: state => {
        let obj = {}
        state.TH_over.forEach(id => (obj[id] = true))
        return obj
    },
    // 賠率是否更新
    TH_prizeChange: state => state.TH_prizeChange

    // ****************** 遊戲配置 Start ************ /
}

export default {
    state,
    actions,
    mutations,
    getters
}
