import { Storage } from '@API'
import {
    setStorage
} from '@UTIL'
import i18n from '../../../lang/lang'
import axios from 'axios'
// import lzmad from '@UTIL/lzmad'

// const stringPool = getStorage(Storage.stringPool)
const state = {
    lang: i18n.locale,
    poolList: []
}
const cache = {}
const w88Alias = {
    us: 'GLI Lottery',
    th: 'GLI ลอตเตอรี่',
    vn: 'Xổ Số GLI',
    default: 'GLI Lottery'
}

const w88WebTitle = {
    cn: '世彩国际(GLI)',
    us: 'GLI Lottery',
    th: 'GLI ลอตเตอรี่',
    vn: 'Xổ Số GLI',
    default: 'GLI Lottery'
}

const actions = {
    async [_M.SET_LANG]({ commit, dispatch, state }, payload) {
        const { lang, $route } = payload
        if (lang !== state.lang) {
            await dispatch(_M.GET_STRING_POOL, { lang })
            commit(_M.SET_LANG, lang)
            i18n.setTitle($route.meta.title)
        }
    },
    async [_M.GET_STRING_POOL]({ commit, rootGetters }, payload = {}) {
        const pagelist = payload.pageList || state.poolList
        const lang = payload.lang || state.lang
        // 紀錄此頁面用到那些語言包
        commit(_M.SET_STRING_POOL_LIST, pagelist)
        i18n.setTitle(payload.pageTitle || '')

        // 取得該語系語言包
        let mergeArr = []
        for (let onePage of pagelist) {
            const cacheKey = lang + onePage
            if (!cache[cacheKey]) {
                // 開發用
                // const jsonPath = `${CDN}/language/${lang}_all.json.lz?v=${+new Date()}`
                const jsonPath = `${CDN}/language/${lang}_all.json?v=${LANG_C_STAMP}`
                await axios
                    .get(jsonPath)
                    .then(({data}) => {
                        cache[cacheKey] = true
                        mergeArr.push(data)
                        // const lz = lzmad.decompress(data.split(','))
                        // mergeArr.push(JSON.parse(lz))
                    })
                    .catch(() => console.error('lang package load error'))
            }
        }
        if (mergeArr.length) {
            const mergeStrPool = Object.assign({}, ...mergeArr)
            const pageTitle = payload.pageTitle || ''
            // 新增語系記得加入 @E/src/locale/lang/[$lang].js
            await import(/* webpackChunkName: "elLang-[request]" */ `@E/src/locale/lang/${lang}.js`)
                .then(locElementUi => Object.assign({}, mergeStrPool, locElementUi.default))
                .then((langObj) => {
                    // 參展用之後可以移除
                    // if (+rootGetters.JWT.room_master_id === 3) {
                    // langObj['common_044'] = '{1}{0}'

                    //過濾越南彩字眼
                    if (rootGetters.isW88) {
                        const trans = w88Alias[lang] || w88Alias.default
                        langObj.lottery_name_212 = trans
                        langObj.home_022 = w88WebTitle[lang] || w88WebTitle.default
                    }
                    i18n.setLocaleMessage(lang, Object.freeze(langObj))
                    i18n.setTitle(pageTitle)
                    // 語系包太過肥大不使用
                    // setStorage(Storage.i18nMessages + lang, langObj)
                })
                .catch((err) => console.log(err, 'i18n err'))
        }
        i18n.locale = lang
    }
}

const mutations = {
    [_M.SET_LANG] (state, payload) {
        setStorage(Storage.locale, payload, false)
        state.lang = payload
    },
    /**
     * 設定 語言包列表
     * @param {any} payload
     */
    [_M.SET_STRING_POOL_LIST] (state, payload) {
        state.poolList = payload
    }
}

const getters = {
    lang: state => state.lang
}

export default {
    state,
    actions,
    mutations,
    getters
}