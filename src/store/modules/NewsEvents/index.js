import { API } from '@API'
import { handleAjax } from '@UTIL'
import i18n from '../../../lang/lang'

const state = {
    newsEventsIsLoading: false,
    newsEventsDetailIndex: '',
    newsEventsTemp: {},
    newsEventsList: {},
    newsEventsData: {
        pageLimit: 30,
        page: 1
    },
    newsEventsPageNationNum: 1
}

const actions = {
    /**
     * API 取得 最新公告資料
     * @param {any} { commit, state, rootGetters }
     */
    async [_M.GET_NEWS_EVENTS_LIST]({ commit, dispatch, state, rootGetters }, payload) {
        const {page} = payload || {}
        page && commit(_M.SET_NEWS_EVENTS_DATA, payload)

        // GameClientKM : 20170625 Sun 09:27:55 增加一個狀態旗標識別用...資料正在加載...
        // commit(_M.SET_NEWS_EVENTS_LOAD, true)
        const params = { ...state.newsEventsData }
        params.lang = i18n.locale
        params.page = page || state.newsEventsData.page
        const data = await handleAjax(API.getNoticeList, params, rootGetters)

        if (data) {
            commit(_M.SET_NEWS_EVENTS_LIST, data)
            // commit(_M.SET_NEWS_EVENTS_LOAD, false)
            dispatch(_M.SET_NEWS_EVENTS_PAGE_NATION_NUM)
        }
    },
    /**
     * API 取得 公告詳細資料
     * @param {any} { commit, state, rootGetters }
     * @param {JSON} noticeId
     */
    async [_M.GET_NEWS_EVENT_DETAIL]({ commit, state, rootGetters }, payload) {
        // const page = payload ? payload.page : 1
        // if (!payload) {
        //     commit(_M.RESET_NEWS_EVENTS_TEMP)
        // }
        // if (state.newsEventsTemp[page]) {
        //     commit(_M.SET_NEWS_EVENTS_LIST, state.newsEventsTemp[page])
        //     return
        // }
        // GameClientKM : 20170625 Sun 09:27:55 增加一個狀態旗標識別用...資料正在加載...
        commit(_M.SET_NEWS_EVENTS_LOAD, true)
        // const params = { ...state.newsEventsData, ...payload }
        let params = {...payload}
        params.lang = i18n.locale
        const data = await handleAjax(API.getNoticeDetail, params, rootGetters)
        data && commit(_M.SET_NEWS_EVENTS_DATA, data)
        commit(_M.SET_NEWS_EVENTS_LOAD, false)
    },
    /**
     * 設定資料並緩存在陣列
     * @param {object} payload 設定投注資料
     */
    [_M.SET_NEWS_EVENTS_DATA]({ commit }) {
        commit(_M.SET_NEWS_EVENTS_LIST, {})
        commit(_M.RESET_NEWS_EVENTS_TEMP)
        commit(_M.SET_NEWS_EVENTS_DATA, {page: 1})
    },
    /**
     * 清空詳細資料
     * @param {object} payload 詳細資料index
     */
    [_M.RESET_NEWS_EVENTS_DETAIL_DATA]({ commit }) {
        commit(_M.SET_NEWS_EVENTS_DATA, {data: {}})
    },
    /**
     * 最新公告詳情資料頁索引
     * @param {number} payLoad 最新公告詳情資料頁 Index
     */
    [_M.SET_NEWS_EVENTS_DETAIL_INDEX]({ commit }, payLoad) {
        commit(_M.SET_NEWS_EVENTS_DETAIL_INDEX, payLoad)
    },
    /**
     * 分頁顯示頁碼位置
     * @param {any} payLoad 獎期列表
     */
    [_M.SET_NEWS_EVENTS_PAGE_NATION_NUM]({ commit }, payLoad) {
        const pageNationNum = payLoad || state.newsEventsPageNationNum
        commit(_M.SET_NEWS_EVENTS_PAGE_NATION_NUM, pageNationNum)
    }
}
const mutations = {
    /**
     * 設定 最新公告資料
     * @param {object} payload 追號紀錄資料
     */
    [_M.SET_NEWS_EVENTS_LIST](state, payload) {
        if (payload.pagination) {
            state.newsEventsTemp[payload.pagination.page] = payload
        }
        state.newsEventsList = payload
    },
    /**
     * 設定資料並緩存在陣列
     * @param {object} payload 設定投注資料
     */
    [_M.SET_NEWS_EVENTS_DATA](state, payload) {
        state.newsEventsData = {...state.newsEventsData, ...payload}
    },
    /**
     * 清除暫存資訊
     */
    [_M.RESET_NEWS_EVENTS_TEMP](state) {
        state.newsEventsTemp = {}
    },
    /**
     * 判斷是否載入中
     * @param {boolean} payLoad 判斷是否載入中
     */
    [_M.SET_NEWS_EVENTS_LOAD](state, payLoad) {
        state.newsEventsIsLoading = payLoad
    },
    /**
     * 最新公告詳情資料頁索引
     * @param {number} payLoad 最新公告詳情資料頁 Index
     */
    [_M.SET_NEWS_EVENTS_DETAIL_INDEX](state, payLoad) {
        state.newsEventsDetailIndex = payLoad
    },
    /**
     * 分頁顯示頁碼位置
     * @param {any} payLoad 頁碼
     */
    [_M.SET_NEWS_EVENTS_PAGE_NATION_NUM](state, payLoad = 1) {
        state.newsEventsPageNationNum = payLoad
    }
}

const getters = {
    newsEventsIsLoading: state => state.newsEventsIsLoading,
    newsEventsTemp: state => state.newsEventsTemp,
    newsEventsList: state => state.newsEventsList,
    newsEventsData: state => state.newsEventsData,
    newsEventsDetailIndex: state => state.newsEventsDetailIndex,
    newsEventsPageNationNum: state => state.newsEventsPageNationNum
}

export default {
    state,
    actions,
    mutations,
    getters
}