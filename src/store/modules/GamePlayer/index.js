import state from './state'
import actions from './actions'
import mutations from './mutations'

const getters = {
    gameLotteryId: state => state.gameSubmit.lotteryId,
    currentLottery: (state, getters) => getters.lotteryList2[getters.gameLotteryId],
    flipTimer: state => state.flipTimer,
    codeTime(state) {
        let hour = state.flipTimer.hours
        if (hour === '000') {
            hour = ''
        } else if (hour[0] === '0') {
            hour = hour.substr(1, 2) + ':'
        }
        return hour + `${state.flipTimer.minutes}:${state.flipTimer.seconds}`
    },
    // gamePlayData
    gamePlayData: state => state.gamePlayData,
    currentGamePlayData: (state, getters) => state.gamePlayData[getters.gameLotteryId] || {},
    gameConfigData: (state, getters) => getters.currentGamePlayData.gameConfigData || {},
    allIsBlocked: (state, getters) => getters.gameConfigData.allIsBlocked,
    // lotteryName: (state, getters) => getters.gameConfigData.gameTypeCn || null,
    lotteryNameKey: (state, getters) => getters.gameConfigData.gameTypeCn_key || null,
    gameMenu: (state, getters) => getters.gameConfigData.gameMethods || [],
    isAllChildBlocked: (state, getters) => getters.gameMenu[getters.menuIndex] ? getters.gameMenu[getters.menuIndex].allChildIsBlocked : false,
    gameMenuSub: (state, getters) =>
        getters.gameMenu[getters.menuIndex] ? getters.gameMenu[getters.menuIndex].childs : [],
    subGame: (state, getters) =>
        getters.gameMenuSub[getters.gameIndex]
            ? getters.gameMenuSub[getters.gameIndex].childs[getters.gameSubIndex]
            : {},
    methodId: (state, getters) => getters.subGame.methodId,
    bonusLimit: (state, getters) => +getters.currentGamePlayData.bonus_limit,
    // jsDynamicConfig
    jsDynamicConfig: state => state.jsDynamicConfig,
    currentjsDynamicData: (state, getters) =>
        state.jsDynamicConfig[getters.gameLotteryId] ? state.jsDynamicConfig[getters.gameLotteryId].data : {},
    lastnumber: (state, getters) => getters.currentjsDynamicData.lastnumber || 'null',
    openingIssue: (state, getters) => getters.currentjsDynamicData.openingIssue || 'null',
    number: (state, getters) => getters.currentjsDynamicData.number || 'null',
    historyBall: (state, getters) => getters.currentjsDynamicData.historyBall || [],
    gameHistoryList: (state, getters) => {
        let arr = []
        getters.historyBall.forEach(issue => arr.unshift(issue))
        return arr
    },
    lastballs: (state, getters) =>
        getters.currentjsDynamicData.lastballs
            ? getters.currentjsDynamicData.lastballs.split(',')
            : ['-', '-', '-', '-', '-'],
    gameConfig: state => state.gameConfig,
    config: state => state.gameConfig[state.game.fullTypeName],
    /** 無選球時最高賠率 */
    maxHprizeIndex: (state, getters) => {
        const prizeObj = (getters.jsPrizePoint || {})[getters.methodId]
        const prizeData = Object.values(prizeObj || {})
        let index = 0
        //置入 賠率
        prizeData.forEach(({ hprize }, i) => {
            if (i && +hprize > +prizeData[index].hprize) {
                index = i
            }
        })
        return index
    },
    /** 有選球時最高賠率 */
    prizeIndex: (state, getters) => {
        const config = getters.config || {}
        let obj = {}
        if (config.prizeIndex) {
            obj = config.prizeIndex(state.gameOrder.gameBallData)
        } else {
            state.gameOrder.gameBallData.forEach(arr => {
                arr.forEach((bools, y) => {
                    if (bools) {
                        obj[config.balls[y]] = ++obj[config.balls[y]] || 1
                    }
                })
            })
        }
        const prizeObj = (getters.jsPrizePoint || {})[getters.methodId]
        const prizeData = Object.keys(obj)
        if (!prizeData.length) {
            return getters.maxHprizeIndex
        }
        //置入 賠率
        let index
        const { hprizeIndex } = config
        if (hprizeIndex) {
            prizeData.forEach((title, i) => {
                if (i === 0 || +prizeObj[hprizeIndex[title]].hprize > +prizeObj[index].hprize) {
                    index = hprizeIndex[title]
                }
            })
            return index
        } else {
            console.log('no hprizeIndex')
            return 0
        }
    },
    //game
    game: state => state.game,
    gameType: state => state.game.gameType,
    fullTypeName: state => state.game.fullTypeName,
    gameIsSin: state => state.game.fullTypeName.indexOf('_SIN') !== -1,
    gameIsFT: state => state.game.fullTypeName.indexOf('_FT') !== -1,
    currentGame: state => state.game.currentGame,
    menuIndex: state => state.game.menuIndex,
    gameIndex: state => state.game.gameIndex,
    gameSubIndex: state => state.game.gameSubIndex,
    //gameOrder
    gameOrder: state => state.gameOrder,
    gameBallData: state => state.gameOrder.gameBallData,
    digitstr: state => state.gameOrder.digitstr,
    gameTimes: state => +state.gameOrder.times,
    moneyRatio: state => state.gameOrder.mode,
    //gameSubmit
    gameSubmit: state => state.gameSubmit,
    orderFutureLength: state => state.gameSubmit.orderFutureIssue.filter(item => item.checked).length,
    gameLtProject: state => state.gameLtProject,
    creditGameLtProject: state => state.creditGameLtProject,
    gameBoxTemp: state => state.gameBoxTemp,
    gameShowMode: state => state.gameShowMode,
    gameMenuActive: state => state.gameMenuActive,
    blockedMethods: state => state.blockedMethods,
    keepPoint: state => state.keepPoint,
    // 前台顯示用keepPoint
    kp: state => Math.min(Math.max((state.keepPoint / 100), 0), state.floatPrize.keepPoint).toFixed(3),
    autoOdds: (state, getters) => {
        try {
            return getters.jsPrizePoint[getters.methodId][0].autoOdds
        } catch (error) {
            return false
        }
    },
    diffPrizeData: state => state.diffPrizeData,
    prizeIsUpdated: (state, getters) => {
        const { methodId, typeName } = getters.gameOrder
        return getters.diffPrizeData[typeName + methodId]
    },
    floatPrize: state => state.floatPrize,
    jsPrizePoint: state => state.floatPrize.jsPrizePoint,
    stopBet: state => state.floatPrize.stopBet,
    overLimitMethods: state => state.overLimitMethods,
    bonusOverLimitMethods: state => state.bonusOverLimitMethods,
    gameBonus: state => state.gameBonus,
    sinSubmitBoxCanCancel: state => state.sinSubmitBoxCanCancel,
    parentTabIndex: state => state.parentTabIndex,
    tabIndex: state => state.tabIndex,
    isFast: state => state.isFast,
    hasKillPair: (state, getters) => {
        try {
            // config裡有設定開啟 && 後端有開放
            return !!(getters.config.hasKillPair && getters.gameConfigData.shaduizi.includes(+getters.methodId))
        } catch (error) {
            return false
        }
    },
    killPairEnabled: (state, getters) => getters.hasKillPair && state.killPairEnabled,
    onePrice: state => state.gameSubmit.onePrice,
    hasGameScore: state => state.hasGameScore,
    delayTimeLottery: () => ({
        '1': 100,
        '5': 240,
        '6': 190,
        '7': 190,
        '8': 210,
        '106': 90,
        '114': 160,
        '115': 190,
        '118': 390,
        '119': 260,
        '120': 100,
        '121': 260,
        '122': 390,
        '123': 190,
        '124': 90,
        '125': 160,
        '126': 240,
        '127': 190,
        '128': 210,
        '129': 210,
        '134': 260,
        '135': 260,
        '136': 260,
        '137': 260,
        '138': 260,
        '139': 260,
        '140': 260,
        '141': 260,
        '142': 1,
        '143': 1,
        '144': 190,
        '153': 1,
        '154': 1,
        '155': 1,
        '156': 1,
        '157': 100,
        '158': 100,
        '159': 100,
        '160': 100
    }),
    isEraser: state => state.isEraser,
    isScoreShow: state => state.isScoreShow,
    getFanTanChip: () => [ 5, 10, 50, 100, 500, 1000 ],
    gameTablePlayInfoList: state => state.gameTablePlayInfoList,
    // K3 魚蝦蟹lotteryID
    gameLotIdYXX: () => [ 240, 241 ],
    // 投注額外選項
    getGameOption: state => state.gameOption,
    // 股票彩一日兩期
    get2Timer: () => [245, 248, 249, 285]
}

export default {
    state,
    actions,
    mutations,
    getters
}
