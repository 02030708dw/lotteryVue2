import { API, Storage } from '@API'
import {
    handleAjax,
    getStorage,
    setStorage
} from '@UTIL'
import exampleKeys from './config/exampleKeys.js'

const playList = getStorage(Storage.playInfoListNew)
const StampStorage = getStorage(Storage.StampStorage)

const state = {
    playList,
    playListIndex: 'SSC@cn',
    // 示例文字翻譯
    exampleTrans: {}
}

const actions = {
    /**
     * API 取得 玩法介紹資料
     * 並處如載入效果
     */
    async [_M.GET_PLAYINFO_NEW_LIST]({ commit, dispatch, rootGetters }, payload = {functionType: 'SSC', lang: 'cn'}) {
        // if (state.playInfoIsLoading) {
        //     return
        // }

        let {functionType, lang} = payload
        const tempKey = `${functionType}@${lang}`

        // 取得示例圖key翻譯
        dispatch(_M.SET_EXAMPLE_TRANS, {
            lang,
            keys: exampleKeys[functionType]
        })

        // 如果已經有資料就不打API
        if (state.playList[tempKey] && StampStorage === LANG_C_STAMP) {
            return
        }

        // 越南彩自主彩proxy  VN_* -> VN_5M
        if (functionType.includes('VN_')) {
            functionType = ['VN_S', 'VN_N'].includes(functionType) ? functionType : 'VN_5M'
        }

        // 取得玩法說明列表
        const data = await handleAjax(API.getHowToPlay, {functionType, lang}, rootGetters)
        commit(_M.SET_PLAYINFO_LIST, {
            [tempKey]: data.data.howToPlay[functionType]
        })
    },
    /**
     * 設定 玩法介紹顯示的頁面
     * @param {number} payLoad 玩法介紹顯示的 index
     */
    [_M.SET_PLAYINFO_INDEX]({commit, dispatch}, payload) {
        let {functionType, lang} = payload

        // functionType 特例
        const sp = {
            'STOCK': 'STOCK_WEB'
        }
        functionType = sp[functionType] || functionType

        dispatch(_M.GET_PLAYINFO_NEW_LIST, {functionType, lang})
        commit(_M.SET_PLAYINFO_INDEX, `${functionType}@${lang}`)
    },

    /**
     * 取得示例圖文字key的翻譯
     * @param {object} payLoad (lang, keys, page)
     */
    async [_M.SET_EXAMPLE_TRANS]({commit, rootGetters}, payload) {
        const {lang, keys} = payload
        const transData = await handleAjax(API.getTrans, {lang, arykey: keys}, rootGetters)
        commit(_M.SET_EXAMPLE_TRANS, {
            lang: lang,
            keyArr: transData.data
        })
    }
}
const mutations = {
    /**
     * 設定 玩法介紹資料
     * @param {any} payload
     */
    [_M.SET_PLAYINFO_LIST](state, payload) {
        if (!payload) {
            setStorage(Storage.playInfoListNew, {})
            setStorage(Storage.StampStorage, '')
            state.playList = {}
            return
        }

        const listData = { ...state.playList, ...payload }
        setStorage(Storage.playInfoListNew, listData)
        setStorage(Storage.StampStorage, LANG_C_STAMP)
        state.playList = listData
    },

    /**
     * 設定 玩法介紹顯示的頁面
     * @param {String} payLoad 玩法介紹顯示的 index
     */
    [_M.SET_PLAYINFO_INDEX](state, payLoad) {
        state.playListIndex = payLoad
    },
    /**
     * 設定示例圖翻譯
     * @param {Object} payload 翻譯資料
     */
    [_M.SET_EXAMPLE_TRANS](state, payload = {}) {
        const {lang, keyArr} = payload
        if (!state.exampleTrans[lang]) state.exampleTrans[lang] = {}

        state.exampleTrans = {
            ...state.exampleTrans,
            [lang]: {
                ...state.exampleTrans[lang],
                ...keyArr
            }
        }
    }
}
const getters = {
    playList: state => state.playList,
    playListIndex: state => state.playListIndex,
    exampleTrans: state => state.exampleTrans
}

export default {
    state,
    actions,
    mutations,
    getters
}
