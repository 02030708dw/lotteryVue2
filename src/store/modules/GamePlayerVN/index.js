import state from './state'
import actions from './actions'
import mutations from './mutations'

const getters = {
    VN_currentName: (state, getters) => getters.VN_localArea || getters.VN_gameMenu[getters.VN_menuIndex].key,
    VN_currentArea: (state, getters) => getters.VN_gameMenu[getters.VN_menuIndex].title_key,
    VN_currentMethod: (state, getters) => getters.VN_gameMenuSub[getters.VN_subMenuIndex].title_key,
    VN_game: state => state.VN_game,
    // VN_gameConfig: state => state.VN_gameConfig,
    VN_methodData: (state, getters) => {
        const key = {
            '2D,3D,4D': '234d',
            '2D': '234d',
            '3D': '234d',
            '4D': '234d',
            vn_t_007: 'teshu',
            'PL2,PL3': 'pl23',
            PL2: 'pl23',
            PL3: 'pl23'
        }
        const { methodData } = state.VN_gameConfig
        return methodData ? methodData[key[getters.VN_currentMethod]] : {}
    },
    VN_gameConfig: state => state.VN_gameConfig || {},
    VN_blocked: state => state.VN_blocked || [],
    VN_blockedData: (state, getters) => {
        let obj = { VN_S: [], VN_C: [], VN_N: [], all: [] }
        getters.VN_blocked.forEach((str) => {
            const [lotteryId, methodId, method, subMethod] = str.split('.')
            const data = {
                lotteryId,
                method,
                methodId,
                subMethod
            }
            let pos = lotteryId
            if (lotteryId <= 197) {
                getters.VN_cityArea[lotteryId] && obj.all.push(data)
                pos = getters.VN_cityArea[lotteryId]
            }
            obj[pos] = [...(obj[pos] || []), data]
        })
        return obj
    },
    VN_nowblockedData: (state, getters) => {
        const pos = getters.VN_isLocal ? getters.VN_isLocal : getters.VN_currentName
        return getters.VN_blockedData[pos] || []
    },
    VN_nowblockedId: (state, getters) => {
        let obj = {}
        getters.VN_nowblockedData.forEach(({ methodId, lotteryId }) => {
            const key = methodId || lotteryId
            obj[key] = true
        })
        return obj
    },
    VN_jsPrize: (state, getters) => getters.VN_gameConfig.jsPrize || {},
    VN_stake: state => +state.VN_gameConfig.stake || 1,
    VN_minUtil: (state, getters) => (getters.VN_stake >= 1 ? 0 : 2),
    VN_modes: state => (state.VN_gameConfig.base || '').split(',').map(e => +e),
    VN_mode: state => state.VN_gameConfig.base.split(',').indexOf(state.VN_gameOrder.mode + '') + 1,
    VN_limitBonus: state => state.VN_gameConfig.bonus_limit || {},
    VN_flipTimer: state => state.VN_flipTimer,
    VN_isLoading: state => state.VN_game.VN_isLoading,
    VN_menuIndex: state => state.VN_game.VN_menuIndex,
    VN_subMenuIndex: state => state.VN_game.VN_subMenuIndex,
    VN_gameType: state => state.VN_game.VN_gameType,
    VN_isOld: state => state.VN_game.VN_gameType === 'Old',
    VN_lotteryId: state => state.VN_game.lotteryId,
    VN_gameMenu: state => state.VN_gameMenu,
    VN_gameMenuSub: (state, getters) => getters.VN_gameMenuSubData[getters.VN_gameType],
    VN_gameMenuSubData: () => ({
        Old: [
            {
                title_key: '2D,3D,4D'
            },
            {
                title_key: 'PL2,PL3'
            },
            {
                // '特殊'
                title_key: 'vn_t_007'
            }
        ],
        Input: [
            {
                title_key: '2D'
            },
            {
                title_key: '3D'
            },
            {
                title_key: '4D'
            },
            {
                title_key: 'PL2'
            },
            {
                title_key: 'PL3'
            }
        ],
        Balls: [
            {
                title_key: '2D'
            },
            {
                title_key: '3D'
            },
            {
                title_key: '4D'
            },
            {
                title_key: 'PL2'
            },
            {
                title_key: 'PL3'
            }
        ],
        Quick: [
            {
                title_key: '2D'
            },
            {
                title_key: '3D'
            },
            {
                title_key: 'PL2'
            },
            {
                title_key: 'PL3'
            }
        ]
    }),
    VN_gameAreaMoney: state => state.VN_gameAreaMoney,
    VN_jsDynamicConfig: state => state.VN_jsDynamicConfig,
    VN_lastNumber: state => state.VN_lastNumber,
    VN_lastIssue: state => state.VN_lastIssue,
    VN_lastNumber_V2: state => state.VN_lastNumber_V2,
    VN_lastIssue_V2: state => state.VN_lastIssue_V2,
    VN_currentlottery: (state, getters) => getters.lotteryListLocalVN[getters.VN_lotteryId],
    VN_localArea: (state, getters) => (getters.VN_currentlottery || {}).name,
    VN_isLocal: state => +state.VN_game.lotteryId,
    VN_localJsDynamic: (state, getters) => state.VN_jsDynamicConfig[getters.VN_localArea],
    VN_localIssue: (state, getters) => (getters.VN_localJsDynamic || {}).issue,
    VN_localFirstLottery: (state, getters) => Object.values(getters.lotteryListLocalVN)[0],
    VN_localCity: (state, getters) => {
        const cityId = +getters.VN_lotteryId
        const issue = getters.VN_localIssue
        const key = cityId + issue
        return {
            cityId,
            issue,
            key
        }
    },
    VN_gameSubmit: state => state.VN_gameSubmit,
    VN_gameOrder: state => state.VN_gameOrder,
    VN_nowAreaCity: (state, getters) => getters.VN_area[getters.VN_Issue.all] || {},
    VN_nowAreaCityAll: (state, getters) => {
        const { VN_S = {}, VN_C = {}, VN_N = {} } = getters.VN_nowAreaCity || {}
        return [...VN_S, ...VN_C, ...VN_N]
    },
    VN_nowAreaCityAllKey: (state, getters) => {
        let obj = {}
        getters.VN_nowAreaCityAll.forEach(cityId => (obj[cityId] = true))
        return obj
    },
    VN_Issue: (state, getters) => {
        let obj = { all: false }
        getters.officialKeyVN.forEach(area => {
            const val = state.VN_jsDynamicConfig[area]
            if (val) {
                obj[area] = obj.all = val.issue
            } else {
                obj[area] = false
            }
        })
        return obj
    },
    VN_lotteryOfficialSwitch: (state, getters) => {
        let obj = {}
        if (getters.VN_hasOfficial) {
            getters.lotteryVN.forEach(key => (obj[key] = true))
            obj.all = true
        }
        return obj
    },
    VN_hasOfficial: (state, getters) => {
        let hasOfficial = 0
        getters.lotteryMenu[3] &&
            getters.lotteryVN.forEach(key => getters.officialKeyVN.includes(key) && hasOfficial++)
        return hasOfficial
    },
    VN_allAreaIssue: (state, getters) => getters.VN_Issue.all,
    VN_isOpenIssue: (state, getters) => getters.VN_Issue,
    VN_area: state => state.VN_area,
    VN_areaTitle: () => ({
        VN_S: 'vn_t_002',
        VN_C: 'vn_t_003',
        VN_N: 'vn_t_004'
    }),
    VN_pos: (state, getters) => getters.VN_gameMenu[getters.VN_menuIndex].key,
    VN_cityData: (state, getters) => {
        let obj = { 0: '' }
        getters.lotteryListArr.forEach(
            ([key, { function_type, lottery, title_key }]) =>
                function_type.indexOf('VN_') === 0 && (obj[lottery] = title_key)
        )
        return obj
    },
    VN_cityArea: (state, getters) => {
        let obj = {}
        getters.lotteryListArr.forEach(
            ([key, { function_type, lottery }]) =>
                function_type.indexOf('VN_') === 0 && (obj[lottery] = function_type)
        )
        return obj
    },
    VN_week: state => state.VN_week,
    // 最大可投注組數
    VN_maxbet: () => 5000,
    VN_stop: () => state.VN_stop || [],
    VN_stopData: (state, getters) => {
        let obj = { VN_S: [], VN_C: [], VN_N: [], all: [] }
        getters.VN_stop.forEach((str) => {
            const [lotteryId, issue, methodId, method, subMethod] = str.split('.')
            const data = {
                lotteryId,
                issue,
                method,
                methodId,
                subMethod
            }
            let pos = lotteryId
            if (lotteryId <= 197) {
                getters.VN_cityArea[lotteryId] && obj.all.push(data)
                // issue === getters.VN_Issue[pos] && obj.all.push(data)
                pos = getters.VN_cityArea[lotteryId]
            }
            obj[pos] = [...(obj[pos] || []), data]
        })
        return obj
    },
    VN_nowStopData: (state, getters) => {
        const pos = getters.VN_isLocal ? getters.VN_isLocal : getters.VN_currentName
        return getters.VN_stopData[pos] || []
    },
    VN_nowStopId: (state, getters) => {
        let obj = {}
        getters.VN_nowStopData.forEach(({ methodId, issue }) => {
            const key = methodId + issue
            obj[key] = true
        })
        return obj
    },
    VN_stopAndOver: () => state.VN_stopAndOver || [],
    VN_stopAndOverData: (state, getters) => {
        let obj = { VN_S: [], VN_C: [], VN_N: [], all: [] }
        getters.VN_stopAndOver.forEach((str) => {
            const [lotteryId, issue, methodId, method, subMethod] = str.split('.')
            const data = {
                lotteryId,
                issue,
                method,
                methodId,
                subMethod
            }
            let pos = lotteryId
            if (lotteryId <= 197) {
                getters.VN_cityArea[lotteryId] && obj.all.push(data)
                // issue === getters.VN_Issue[pos] && obj.all.push(data)
                pos = getters.VN_cityArea[lotteryId]
            }
            obj[pos] = [...(obj[pos] || []), data]
        })
        return obj
    },
    // 停壓號碼
    VN_stopNumber: state => state.VN_stopNumber,
    // 停壓號碼
    VN_stopNumberCalc: state => {
        let obj = {}
        Object.entries(state.VN_stopNumber).forEach(([key, numbers]) => {
            const [cityId, issue, methodId] = key.split('.')
            obj[`${cityId}_${issue}_${methodId}`] = []
            numbers.forEach((number) => {
                obj[`${cityId}_${issue}_${methodId}`].push(number)
            })
        })
        return obj
    },
    VN_StopNumberFilter: (state, getters) => {
        return getters.VN_gameSubmit.showList.filter(({ cityId, methodId, issue, codes }) => {
            if (getters.VN_stopNumberCalc[`${cityId}_${issue}_${methodId}`]) {
                let bool = false
                getters.VN_stopNumberCalc[`${cityId}_${issue}_${methodId}`].forEach((code) => {
                    if (codes.includes(code)) {
                        bool = true
                    }
                })
                return bool
            } else {
                return false
            }
        })
    },
    VN_StopNumberFastFilter: (state, getters) => {
        const { cityId, issue, codes } = getters.VN_gameOrder
        return getters.VN_gameOrder.showList.filter(({ methodId }) => {
            if (getters.VN_stopNumberCalc[`${cityId}_${issue}_${methodId}`]) {
                let bool = false
                getters.VN_stopNumberCalc[`${cityId}_${issue}_${methodId}`].forEach((code) => {
                    if (codes.includes(code)) {
                        bool = true
                    }
                })
                return bool
            } else {
                return false
            }
        })
    },
    VN_nowStopAndOverData: (state, getters) => {
        const pos = getters.VN_isLocal ? getters.VN_isLocal : getters.VN_currentName
        return getters.VN_stopAndOverData[pos] || []
    },
    VN_nowStopAndOverId: (state, getters) => {
        let obj = {}
        getters.VN_nowStopAndOverData.forEach(({ methodId, issue }) => {
            const key = methodId + issue
            obj[key] = true
        })
        return obj
    }
}

export default {
    state,
    actions,
    mutations,
    getters
}
