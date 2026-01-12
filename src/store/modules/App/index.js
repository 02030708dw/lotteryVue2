import Device from '@UTIL/device'
import { API, Storage } from '@API'
import lotterySourceLink from '../GamePlayer/configs/lotterySourceLink'
import {
    handleAjax,
    returnState,
    getStorage,
    setStorage,
    getCookie,
    b64DecodeUnicode,
    handleJson,
    checkLoginSource
} from '@UTIL'

const device = new Device()
const state = {
    lotterySourceLink,
    RWDMode: window.innerWidth < 980 ? 3 : 1,
    hamburgar: false,
    selectLock: false,
    lotteryLoading: false,
    lotteryMenu: {},
    lotteryStatus: {},
    offsetGetBalanceNum: 1,
    offsetGetBalanceCount: 90,
    availableBalance: 0,
    navActiveName: 'first',
    serverTime: '',
    isSin: false,
    isBack: false,
    isDev: process.env.NODE_ENV === 'development',
    myFavorites: [],
    /** 管理页面资讯视窗 */
    popActive: {
        // 投注页-历史奖号 history: false,
        // 投注页-玩法说明 howToPlay: false,
        // 投注页-生肖说明 howToPlayAnimal: false,
        // 投注页-信用快选金额 quickOption: false,
        // 投注页-名人榜开关 scoreBoard: false,
        // 菜单-彩票游戏 gamePlay: false,
        // 菜单-游戏纪录 gameRecord: false,
        // 菜单-语系选项 lang: false,
        // 越南彩-小键盘 keyboard:false
    },
    // 语系选项
    langObj: {
        cn: {
            open: true,
            l: '中文',
            s: '中文'
        },
        us: {
            open: true,
            l: 'ENGLISH',
            s: 'En'
        },
        // 泰语
        th: {
            open: true,
            l: 'ภาษาไทย',
            s: 'ภาษาไทย'
        },
        // 越南语
        vn: {
            open: true,
            l: 'Tiếng Việt',
            s: 'Tiếng Việt'
        },
        jp: {
            open: true,
            l: '日本语',
            s: '日本语'
        },
        // 印尼语
        id: {
            open: false,
            l: 'Bahasa Indonesia',
            s: 'Bahasa Indonesia'
        }
    },
    menuId: 0,
    // 历史routing path
    routeHistory: [],
    isOutGame: false,
    popularEntries: [],
    // 投注页-玩法说明keys-翻译
    transKeyArr: {}
}

const actions = {
    [_M.SET_TEMP_DATA]({ commit }, payload) {
        commit(_M.SET_TEMP_DATA, payload)
    },
    /**
     * 初始化设置
     * @param {Object} payload Vue
     */
    [_M.APP_INIT]({ getters, dispatch }, payload) {
        setTimeout(() => {
            dispatch(_M.GET_WALLET_BALANCE, true)
            dispatch(_M.GET_SERVER_TIME)
            dispatch(_M.GET_LOTTERY_STATUS)
        }, 0)
        window['dev'] = key =>
            (getters.isTest || key === 'dev') &&
            dispatch(_M.SET_ENV, { app: payload, isDev: true })
        getters.isDev && window.dev()
    },
    /**
     * 初始化环境设置
     * @param {Object} payload isDev: 是否开发环境, app: Vue
     */
    [_M.SET_ENV]({ commit, dispatch }, payload) {
        const { isDev, app } = payload
        const gc = () => app.$store.getters
        const rc = (rmid, uid, currency = 'CNY') => {
            try {
                if (!rmid || !uid) throw ''
                window.location = `${window.location.origin}/login/thirdparty/${rmid}?thirdpartyUserId=${uid}&currency=${currency}`
            } catch (error) {
                console.error('rc(RoomMasterId, UserId, currency)')
            }
        }
        window['sp'] = () => gc().miscInfo
        if (isDev) {
            // window['$c'] = commit
            window['$d'] = dispatch
            // window['_M'] = _M
            window['gc'] = gc
            window['n'] = () =>
                gc().gameOrder.methodName + ': ' + gc().game.fullTypeName
            window['j'] = () =>
                console.log(
                    '奖金组',
                    gc().floatPrize.jsPrizePoint[gc().gameOrder.methodId]
                )
            window['id'] = () => gc().gameOrder.methodId
            window['$v'] = app
            // window['$t'] = app.$t
            // window['$i18n'] = app.$i18n
            window['$k'] = str => {
                // i18n look up key
                const obj = app.$i18n.messages.cn
                for (const i in obj) {
                    if (str === obj[i]) return i
                }
            }
            window['rc'] = rc //reconnect
            window['lang'] = (lang = 'cn') => {
                commit(_M.SET_LANG, lang)
                window.location.reload()
            }
        }
        commit(_M.SET_ENV, payload)
    },
    /**
     * 设定 RWD 判断并缩回 SideBar
     * @param {number} payload 1: 980 2: 768 3: 320 \
     */
    [_M.SET_RWD_MODE]({ commit }, payload) {
        commit(_M.SET_RWD_MODE, payload)
        commit(_M.SET_HAMBURGAR, false)
    },
    /**
     * 设定 侧边栏
     * @param {boolean} payload true: 展开, false: 缩回
     */
    [_M.SET_HAMBURGAR]({ commit }, payload) {
        commit(_M.SET_HAMBURGAR, payload)
    },
    /**
     * 设定 RWD 锁
     * @param {boolean} payload true: 展开, false: 缩回
     */
    [_M.SET_SELECT_LOCK]({ commit }, payload) {
        commit(_M.SET_SELECT_LOCK, payload)
    },
    /**
     * API 取得 用户余额
     * @param {boolean} payload 是否强制取得余额
     */
    async [_M.GET_WALLET_BALANCE](
        { state, commit, rootGetters },
        payload = false
    ) {
        if (
            state.offsetGetBalanceNum % state.offsetGetBalanceCount === 0 ||
            payload === true
        ) {
            commit(_M.SET_OFFSET_GET_BALANCE_NUM, 1)
            return handleAjax(API.availableBalance, {}, rootGetters, {
                isNotShowMessageBox: true,
                isPromise: true
            })
                .then(res => {
                    commit(_M.SET_WALLET_BALANCE, res.data.availablebalance)
                    return res
                })
                .catch(() =>
                    commit(
                        _M.SET_OFFSET_GET_BALANCE_NUM,
                        state.offsetGetBalanceCount - 5
                    )
                )
        } else {
            commit(
                _M.SET_OFFSET_GET_BALANCE_NUM,
                state.offsetGetBalanceNum + 1
            )
        }
    },
    /**
     * API 取得 彩种状态
     * @param {array} payload
     */
    async [_M.GET_LOTTERY_STATUS]({ commit, rootGetters }) {
        const params = {}
        const data = await handleAjax(API.lotteryStatus, params, rootGetters)
        data && commit(_M.GET_LOTTERY_STATUS, data)
    },
    /**
     * API 取得 LotteryID 及各玩法
     * @param {boolean} payload 是否要强制更新
     */
    async [_M.GET_LOTTERY_MENU](
        { state, commit, rootGetters },
        payload = false
    ) {
        if (payload || !state.lotteryLoading) {
            commit(_M.SET_LOTTERY_LOAD, true)
            let data
            if (LOTTERY_MENU) {
                data = LOTTERY_MENU
            } else {
                ({ data } = await handleAjax(API.lotteryMenu, {}, rootGetters))
            }

            // 测试彩种关闭用
            if (rootGetters.isDev) {
                delete data[1]
                delete data[2]
                // 越南彩
                // delete data[3]
                // delete data[3].list.VN_S
                // delete data[3].list.VN_C
                // delete data[3].list.VN_N
                // 棋牌
                // delete data[4]
                // delete data[4].list.SSC_LHD
                delete data[5]
                // 泰国彩
                // delete data[6]
                // 股票彩
                // delete data[7]
                // 百家乐
                // delete data[8]
                // 老挝彩
                // delete data[9]
                // 马来彩
                // delete data[10]
            }

            data && commit(_M.SET_LOTTERY_MENU, data)
        }
    },
    /**
     * 设定 汉堡标签是否改成返回箭头
     * @param {boolean} payload 是否返回箭头
     */
    [_M.SET_HEADER_NAV_IS_BACK]({ commit }, payload) {
        commit(_M.SET_HEADER_NAV_IS_BACK, payload)
    },
    /**
     * 设定 768以上 Sidebar 分页的 index
     * @param {boolean} payload index
     */
    [_M.SET_HEADER_NAV_ACTIVE_NAME]({ commit }, payload) {
        commit(_M.SET_HEADER_NAV_ACTIVE_NAME, payload)
    },
    /**
     * 取得伺服器时间
     */
    async [_M.GET_SERVER_TIME]({ commit, rootGetters }) {
        const correctionTime = await handleAjax(API.time, {}, rootGetters, {
            isNotShowMessageBox: true
        })
        correctionTime && commit(_M.SET_SERVER_TIME, correctionTime.date)
    },
    /**
     * 设定信用/官方的按钮状态
     */
    async [_M.SET_IS_SIN]({ commit }, payload) {
        commit(_M.SET_IS_SIN, payload)
    },
    /**
     * 载入我的最爱
     */
    async [_M.GET_MY_FAVORITES]({ commit, rootGetters }) {
        let favorites
        if (MY_FAVORITES !== undefined) {
            favorites = MY_FAVORITES
            commit(_M.SET_MY_FAVORITES, favorites.split(','))
        } else {
            const data = await handleAjax(API.getMyFavorites, {}, rootGetters)
            if (data) {
                favorites = data.data.favorites
                favorites && commit(_M.SET_MY_FAVORITES, favorites.split(','))
            }
        }
    },
    /**
     * 设定我的最爱
     * @param {array} payload 阵列
     */
    async [_M.SET_MY_FAVORITES]({ commit, rootGetters }, payload) {
        const params = { favorites: payload.join(',') }
        const data = await handleAjax(API.setMyFavorites, params, rootGetters)
        // 成功
        data && commit(_M.SET_MY_FAVORITES, payload)
        return Promise.resolve(data)
    },
    /**
     * 载入热门游戏彩种
     */
    async [_M.GET_POPULAR_ENTRIES]({ commit, rootGetters }) {
        if (POPULAR_ENTRIES !== undefined) {
            commit(_M.SET_POPULAR_ENTRIES, POPULAR_ENTRIES)
        } else {
            const data = await handleAjax(
                API.getPopularGroupEntries,
                {},
                rootGetters
            )
            if (data) {
                commit(_M.SET_POPULAR_ENTRIES, data.data.group_entries_id)
            }
        }
    },
    /**
     * 开启/关闭 页面资讯视窗
     * @param {any} { commit }
     * @param {any} payload
     */
    [_M.SET_POP_ACTIVE]({ commit, state }, payload) {
        const notClose = ['history', 'VNhistory']
        const has = notClose.find(key => state.popActive[key]);
        ((!payload && !has) || payload) &&
            commit(_M.SET_POP_ACTIVE, payload || {})
    },
    /**
     * 设定当前显示的menuID
     * @param {integer} payload menuId
     */
    [_M.SET_MENU_ID]({ commit }, payload) {
        commit(_M.SET_MENU_ID, +payload)
    },
    /**
     * 设定routeHistory
     * @param {Object} payload {path:路径, mode:模式}
     */
    [_M.SET_HISTORY]({ commit }, payload) {
        commit(_M.SET_HISTORY, payload)
    },
    /**
     * 设置是否正在离开游戏网页
     * @param {Boolean} payload
     */
    [_M.SET_IS_OUT_GAME]({ commit }, payload) {
        commit(_M.SET_IS_OUT_GAME, payload)
    },
    /**
     * 取得KEY的翻译
     * @param {any} { commit }
     * @param {object} payload
     */
    async [_M.GET_TRANS]({ commit, rootGetters }, payload) {
        const transData = await handleAjax(API.getTrans, payload, rootGetters)
        commit(_M.GET_TRANS, {
            lang: payload.lang,
            keyArr: transData.data
        })
    }
}
const mutations = {
    [_M.SET_TEMP_DATA](state, payload = {}) {
        state[payload.temp] = payload.data
    },
    /**
     * 设定 isDev 判断
     * 设定 Vue
     * @param {Boolean} payload true: 开发模式, false: 生产模式
     */
    [_M.SET_ENV](state, payload) {
        const { isDev } = payload
        state.isDev = isDev
    },
    /**
     * 设定 RWD 判断
     * @param {number} payload 1: 980 2: 768 3: 320
     */
    [_M.SET_RWD_MODE](state, payload) {
        state.RWDMode = payload
    },
    /**
     * 设定 侧边栏
     * @param {boolean} payload true: 锁定, false: 解锁
     */
    [_M.SET_HAMBURGAR](state, payload) {
        state.hamburgar = payload
    },
    /**
     * 设定 Select 锁
     * @param {boolean} payload true: 锁定, false: 解锁
     */
    [_M.SET_SELECT_LOCK](state, payload) {
        state.selectLock = payload
    },
    /**
     * 设定 用户余额
     * @param {any} payload 用户余额
     */
    [_M.SET_WALLET_BALANCE](state, payload) {
        state.availableBalance = payload
    },
    /**
     * 设定 用户余额 校正间隔次数
     * @param {any} payload 用户余额
     */
    [_M.SET_OFFSET_GET_BALANCE_NUM](state, payload) {
        state.offsetGetBalanceNum = payload
    },
    /**
     * 设定 LotteryID 及各玩法
     * @param {any} payload LotteryID 列表
     */
    [_M.SET_LOTTERY_MENU](state, payload) {
        state.lotteryMenu = payload
    },
    /**
     * 设定 判断是否已经取得 LotteryID
     * @param {boolean} payload true, false
     */
    [_M.SET_LOTTERY_LOAD](state, payload) {
        state.lotteryLoading = payload
    },
    /**
     * 设定 汉堡标签是否改成返回箭头
     * @param {boolean} payload 是否返回箭头
     */
    [_M.SET_HEADER_NAV_IS_BACK](state, payload) {
        state.isBack = payload
    },
    /**
     * 设定 768以上 Sidebar 分页的 index
     * @param {boolean} payload index
     */
    [_M.SET_HEADER_NAV_ACTIVE_NAME](state, payload) {
        state.navActiveName = payload
    },
    /**
     * 设定 serverTime
     * @param {string} payload time
     */
    [_M.SET_SERVER_TIME](state, payload) {
        state.serverTime = payload
    },
    /**
     * 设定 信用官方的开关状态
     * @param {string} payload time
     */
    [_M.SET_IS_SIN](state, payload) {
        state.isSin = payload
    },
    /**
     * 设定我的最爱
     * @param {string} payload time
     */
    [_M.SET_MY_FAVORITES](state, payload) {
        state.myFavorites = payload
    },
    /**
     * 设定我的最爱
     * @param {string} payload time
     */
    [_M.SET_POPULAR_ENTRIES](state, payload) {
        state.popularEntries = payload
    },
    /**
     * 彩种状态
     */
    [_M.GET_LOTTERY_STATUS](state, payload) {
        state.lotteryStatus = payload
    },
    /**
     * 开启/关闭页面资讯视窗isPopActive
     * @param {string} payload {页面: boolean}
     */
    [_M.SET_POP_ACTIVE](state, payload) {
        state.popActive = payload
    },
    /**
     * 设定当前显示的menuID
     * @param {integer} payload menuId
     */
    [_M.SET_MENU_ID](state, payload) {
        state.menuId = +payload
    },
    /**
     * 设定routeHistory
     * @param {String} path 路径, 提供string则新增, 空值则清空
     * @param {String} mode 模式, add:新增, del: 删除最后一笔(state.length -1), empty:清空
     */
    [_M.SET_HISTORY](state, { path, mode }) {
        switch (mode) {
            case 'del':
                state.routeHistory.pop(path)
                break
            case 'empty':
                state.routeHistory = []
                break
            case 'add':
            default:
                state.routeHistory.push(path)
                break
        }
    },
    [_M.SET_IS_OUT_GAME](state, payload) {
        state.isOutGame = payload
    },
    /*
     * 设定投注页-玩法说明
     * @param {any} state Global Stroe
     * @param {Object} payload 说明资料
     */
    [_M.GET_TRANS](state, payload = {}) {
        const { lang, keyArr } = payload
        if (!state.transKeyArr[lang]) state.transKeyArr[lang] = {}
        state.transKeyArr[lang] = { ...state.transKeyArr[lang], ...keyArr }
    }
}
const getters = {
    lotterySourceLink: state => state.lotterySourceLink,
    currency: (state, getters) => getters.JWT.user_currency,
    currencySymbol: (state, getters) => {
        const obj = {
            // IDR  ₨
            IDR: ' ',
            // MYR RM
            MYR: ' '
        }
        return (
            getters.JWT.user_currency_symbol +
            (obj[getters.JWT.user_currency] || '')
        )
    },
    RWDMode: state => state.RWDMode,
    hamburgar: state => state.hamburgar,
    selectLock: state => state.selectLock,
    lotteryLoading: state => state.lotteryLoading,
    lotteryMenu: state => state.lotteryMenu,
    lotteryMenuData: (state, getters) => {
        if (getters.getMenuIdArr.length === 0) return []
        return getters.dispalyMenuOrder
            .filter(menuId => getters.lotteryMenu[menuId])
            .map(menuId => getters.lotteryMenu[menuId])
    },
    lotteryStatus: state => state.lotteryStatus.data || [],
    // 有封盘的彩种
    lotteryClosed: (state, getters) => {
        let obj = {}
        getters.lotteryStatus.forEach(e => {
            if (e.status === 'closed') {
                obj[e.lottery_id || `vn${e.lottery_group_id}`] = true
            }
        })
        return obj
    },
    isOneLotGame: (state, getters) => {
        const data = getters.lotteryMenuData
        if (data.length === 1) {
            const menuId = +data[0][0]
            switch (menuId) {
                case 3:
                    return menuId
                default:
                    return 0
            }
        }
        return 0
    },
    // isOneLotGame: state => 3,
    oneLotGameRouter: (state, getters) => {
        const firstLotteryId = getters.lotteryListArr[0][0]
        const router = {
            3: '/GamePlayerVN',
            4: `/GamePlayerTable/${firstLotteryId}`, // 中国彩桌面
            6: `/GamePlayerTH/${firstLotteryId}`, // 泰国彩
            7: `/GamePlayerStock/${firstLotteryId}` // 中国彩信用
        }
        return router[getters.isOneLotGame]
    },
    lotteryList: state => {
        let data = {}
        Object.values(state.lotteryMenu).forEach(obj => {
            for (let lotName in obj.list) {
                data[lotName] = {
                    ...obj.list[lotName],
                    menuId: +obj.menuType
                }
            }
        })
        return data
    },
    lotteryList2: (state, getters) => {
        const data = getters.lotteryList
        let data2 = {}
        for (let name in data) {
            data[name].childs &&
                data[name].childs.forEach(items => {
                    data2[items.lottery] = {
                        name,
                        menuId: (data[name] || {}).menuId || 0,
                        ...items
                    }
                })
        }
        return data2
    },
    lotteryListArr: (state, getters) => Object.entries(getters.lotteryList2),
    lotteryListSin: (state, getters) => {
        const data = getters.lotteryList
        let sin = {}
        for (let name in data) {
            name.indexOf('_SIN') > -1 && (sin[name] = data[name])
        }
        return sin
    },
    lotteryListOfficial: (state, getters) => {
        const data = getters.lotteryList
        let official = {}
        for (let name in data) {
            name.indexOf('_SIN') === -1 && (official[name] = data[name])
        }
        return official
    },
    // 纯粹中国彩-官方(menuId = 1)
    lotteryListCnOfficial: state => (state.lotteryMenu[1] || {}).list || {},
    // 纯粹中国彩-信用(menuId = 2)
    lotteryListCnSin: state => (state.lotteryMenu[2] || {}).list || {},
    // 纯粹番摊 (menuId = 5)
    lotteryListFantan: state => (state.lotteryMenu[5] || {}).list || {},
    // 纯粹中国彩(menuId = 1 & 2 & 4 & 5)
    lotteryListChina: (state, getters) => {
        return {
            ...getters.lotteryListCnOfficial,
            ...getters.lotteryListCnSin,
            ...getters.lotteryListTable,
            ...getters.lotteryListFantan
        }
    },
    // 纯粹桌面彩(menuId = 4)
    lotteryListTable: state => {
        return (state.lotteryMenu[4] || {}).list || {}
    },
    // 纯粹泰国彩(menuId = 6)
    lotteryListTH: state => {
        return (state.lotteryMenu[6] || {}).list || {}
    },
    // 纯粹股票彩(menuId = 7)
    lotteryListStock: state => {
        return (state.lotteryMenu[7] || {}).list || {}
    },
    officialKeyVN: () => ['VN_S', 'VN_C', 'VN_N'],
    lotteryVN: state => Object.keys((state.lotteryMenu[3] || {}).list || {}),
    lotteryListLocalVN: state => {
        const data = state.lotteryMenu[3] || {}
        const filter = ['all', 'VN_S', 'VN_C', 'VN_N']
        let VN = {}
        Object.entries(data.list || {})
            .filter(([type]) => !filter.includes(type))
            .forEach(([type, { childs }]) => {
                childs.forEach(lot => {
                    const lottery = lot.lottery
                    VN[lottery] = lot
                    VN[lottery].name = type
                })
            })
        return VN
    },
    lotteryOfficialVN: (state, getters) => {
        const data = state.lotteryMenu[3] || {}
        let VN = {}
        getters.officialKeyVN.forEach(pos => {
            (data.list || {})[pos] && (VN[pos] = data.list[pos])
        })
        return VN
    },
    // 给我的最爱用的越南彩列表, 包含代表的城市ID
    lotListVN: (state, getters) => {
        let data = {}
        let local = getters.lotteryListLocalVN
        const vnList = (state.lotteryMenu[3] || {}).list || {}

        // 自主彩
        Object.values(local).forEach(oneLocal => {
            data[oneLocal.name] = {
                is_local: !!oneLocal.lottery,
                lottery: oneLocal.lottery,
                menuId: 1,
                title_key: oneLocal.title_key
            }
        })

        // 官方彩
        const official = Object.entries(vnList).filter(([lotName]) =>
            getters.officialKeyVN.includes(lotName)
        )

        if (official.length) {
            // 全区-用南区的第一个城市ID
            data['all'] = {
                is_local: false,
                lottery: 162,
                menuId: 0,
                title_key: 'vn_t_001',
                prefix: 'vn_t_056'
            }
            // 越南彩-南(用第二个城市ID)/中/北
            official.forEach(([lotName, { title_key, childs }]) => {
                data[lotName] = {
                    is_local: false,
                    lottery: lotName === 'VN_S' ? 163 : childs[0].lottery,
                    menuId: getters.officialKeyVN.indexOf(lotName) + 1,
                    title_key,
                    prefix: 'vn_t_056'
                }
            })
        }

        return data
    },
    // 以id排序的lotListVN
    lotListVN2(state, getters) {
        let list = {}
        Object.entries(getters.lotListVN).forEach(oneLotData => {
            const [name, oneLot] = [oneLotData[0], oneLotData[1]]
            list[oneLot.lottery] = {
                ...oneLot,
                name
            }
        })
        return list
    },
    lotteryListVideo: (state, getters) => {
        const data = getters.lotteryList
        let video = {}
        for (let name in data) {
            name.indexOf('HL_') === 0 && (video[name] = data[name])
        }
        return video
    },
    offsetGetBalanceNum: state => state.offsetGetBalanceNum,
    offsetGetBalanceCount: state => state.offsetGetBalanceCount,
    availableBalance: state => state.availableBalance,
    userInfo: () => RmUserInfo || {},
    JWT: (state, getters) =>
        getters.JWTHash
            ? handleJson(b64DecodeUnicode(getters.JWTHash.split('.')[1]))
            : '',
    JWTHash: () => getCookie('JWT'),
    navActiveName: state => state.navActiveName,
    serverTime: state => state.serverTime,
    userType: (state, getters) => checkLoginSource(getters.JWT),
    isDev: state => state.isDev,
    // isShowBar: (state, getters) => true,
    isShowBar: () => +RmUserInfo.isShowPointBar,
    isSin: state => state.isSin,
    isBack: state => state.isBack,
    isMobile: () => !device.desktop(),
    isShowDemo: (state, getters) =>
        +getters.JWT.room_master_thirdparty_status === 2,
    isGPI: (state, getters) => +getters.JWT.room_master_login_type === 1,
    isShowTaskButton: (state, getters) => getters.JWT.is_show_task_button,
    isW88: (state, getters) => +getters.userInfo.HIDE_VN === 1,
    isShowDirectNav: (state, getters) => getters.userInfo.home,
    isDirect: (state, getters) => +getters.JWT.room_master_login_type === 2,
    isDemo: (state, getters) => +getters.JWT.room_master_login_type === 8,
    isTest: (state, getters) => {
        const bool = +getters.JWT.room_master_login_type === 9
        // bool && (() => {
        //     var script = document.createElement('script')
        //     script.src = 'http://192.168.98.85:1337/vorlon.js'
        //     document.body.appendChild(script)
        // })()
        return bool
    },
    isOutGame: state => state.isOutGame,
    // 是否显示"经典"(一般版)按钮 {0: 不显示, 1: 显示}
    isShowClassic: state => +RmUserInfo.isShowClassicBtn,
    // 是否显示"复刻"(亚博版)按钮 {0: 不显示, 1: 显示}
    isShowThemeSwitch: state =>
        +RmUserInfo.isShowRetroBtn &&
        (state.lotteryMenu[2] || state.lotteryMenu[5]),
    // 是否显示"手机"(一般版)按钮 {0: 不显示, 1: 显示}
    isShowWap: state => true,
    // 只有经典or可切换到输入模式 {0: 不显示, 1: 显示切换开关}
    VN_isOnlyOld: (state, getters) =>
        !(
            getters.isTest ||
            getters.VN_hasInput ||
            getters.VN_hasQuick ||
            getters.VN_hasBall
        ),
    VN_hasOld: (state, getters) => !getters.isAE_V11VND188,
    VN_hasInput: () => true,
    // VN_hasInput: (state, getters) => +getters.JWT.vn_game_player_open_input || getters.isTest,
    VN_hasQuick: () => true,
    // VN_hasQuick: (state, getters) => +getters.JWT.vn_game_player_open_form || getters.isTest,
    VN_hasBall: () => true,
    // VN_hasBall: (state, getters) => +getters.JWT.vn_game_player_open_ball || getters.isTest,
    VN_isAllClose: (state, getters) =>
        !getters.VN_hasOld &&
        !getters.VN_hasInput &&
        !getters.VN_hasQuick &&
        !getters.VN_hasBall,
    // 里面有就隐藏开奖官网~ 越南彩官彩以 vn 代表
    hideOw: (state, getters) => {
        let obj = {};
        (getters.JWT.hide_ow || '').split(',').forEach(id => (obj[id] = true))
        return obj
    },
    //
    // hideOw: (state, getters) => {
    //     return { vn: true, '212': true, '134': true, 247: true }
    // },
    miscInfo: (state, getters) => getters.JWT.misc_info,
    isIos: () => device.ios(),
    device: () => device,
    myFavorites: (state, getters) =>
        state.myFavorites.filter(item => !!getters.lotteryList2[item]),
    myFavoritesKey: (state, getters) => {
        let obj = {}
        getters.myFavorites.forEach(lotteryId => (obj[lotteryId] = true))
        return obj
    },
    getPopActive: state => state.popActive,
    getLangObj: (state, getters) => getters.langObj,
    getMenuId: (state, getters) => getters.isOneLotGame || state.menuId,
    getMenuIdArr: state => Object.keys(state.lotteryMenu),
    langObj: (state, getters) => {
        const isActive = !getters.isW88
        return {
            cn: {
                open: true,
                l: '中文',
                s: '中文'
            },
            us: {
                open: true,
                l: 'ENGLISH',
                s: 'En'
            },
            // 泰语
            th: {
                open: isActive,
                l: 'ภาษาไทย',
                s: 'ภาษาไทย'
            },
            // 越南语
            vn: {
                open: true,
                l: 'Tiếng Việt',
                s: 'Tiếng Việt'
            },
            // jp: {
            //     open: isActive,
            //     l: '日本语',
            //     s: '日本语'
            // },
            // 印尼语
            id: {
                open: false,
                l: 'Bahasa Indonesia',
                s: 'Bahasa Indonesia'
            }
        }
    },
    getRouteHistory: state => state.routeHistory,
    // 乐利彩的ID, 供选单过滤掉用(黑名单)
    getLolli: () => [224, 226, 229],
    // 是否为财富宫
    isRich: (state, getters) =>
        [221, 234].includes(+getters.JWT.room_master_id),
    // 是否为正棋
    isRect: (state, getters) => [275].includes(+getters.JWT.room_master_id),
    // 是否为 AE
    isAE_V11VND188: (state, getters) =>
        +getters.JWT.room_master_id === 278 &&
        getters.JWT.operator === 'V11VND188',
    isAE_VA285iwin: (state, getters) =>
        +getters.JWT.room_master_id === 278 &&
        getters.JWT.operator === 'VA285iwin',
    // 是否为 AIA
    isAIA: (state, getters) => +getters.JWT.room_master_id === 289,
    // 以语系优先显示该国彩种
    dispalyMenuOrder: (state, getters) => {
        switch (getters.lang) {
            case 'vn':
                return [3, 1, 2, 5, 8, 6, 7, 4, 9, 10]
            case 'th':
                return [6, 9, 1, 2, 5, 8, 3, 7, 4, 10]
            default:
                return [1, 2, 5, 8, 3, 6, 7, 4, 9, 10]
        }
        // 3: vn
        // 6: th
    },
    popularEntries: () =>
        state.popularEntries.filter(
            id => !['VN_ALL', 'VN_N', 'VN_S', 'VN_C'].includes(id)
        ),
    // 是否为黑色样式选单及首页
    isBlackTheme: () => true,
    globalVNTitle(state, getters) {
        if (getters.VN_isLocal) {
            return { ...getters.VN_currentlottery, menuId: 3 }
        } else {
            return { ...getters.lotListVN[getters.VN_pos], menuId: 3 }
        }
    },
    globalLottery(state, getters) {
        const empty = () => ''
        const {
            name,
            params: { lottery }
        } = getters.getVue().$route
        const key = {
            GamePlayer: () => {
                return getters.lotteryList2[lottery]
            },
            GamePlayerStock: () => {
                return getters.lotteryList2[lottery]
            },
            GamePlayerTH: () => {
                return getters.lotteryList2[lottery]
            },
            GamePlayerVN: () => {
                return getters.globalVNTitle
            },
            GamePlayerTable: () => {
                return getters.lotteryList2[lottery]
            },
            GamePlayerMY: () => {
                return getters.lotteryList2[lottery]
            },
            GamePlayerLA: () => {
                return getters.lotteryList2[lottery]
            }
        }
        return (key[name] || empty)()
    },
    gameRoutePath: () => {
        return {
            4: 'GamePlayerTable',
            6: 'GamePlayerTH',
            7: 'GamePlayerStock',
            8: 'GamePlayerTable',
            9: 'GamePlayerLA',
            10: 'GamePlayerMY'
        }
    },
    transKeyArr: state => state.transKeyArr,
    // 启用分享注单
    hasShare: (state, getters) => getters.isDev || getters.JWT.is_promotion,
    // hasShare: (state, getters) => false,
    shareText: (state, getters) =>
        getters.JWT.waterprint ||
        '测123测123测123测123测123测123测123测123测123测123测123测123测123测123',
    shareLogo: (state, getters) => getters.JWT.stencil,
    calcMenuData: (state, getters) => {
        let data = returnState(getters.lotteryMenuData)
        // 我的最爱
        getters.filterFavoriteLen &&
            data.unshift({ title_key: 'home_053', menuType: 0 })
        // 热门游戏
        getters.popularEntries.length &&
            data.unshift({ title_key: 'home_065', menuType: 9999 })
        return data
    },
    filterFavoriteLen: (state, getters) => {
        return getters.myFavorites
            .map(id => getters.lotteryList2[id])
            .filter(obj => obj).length
    }
}

export default {
    state,
    actions,
    mutations,
    getters
}
