import Vue from 'vue'
import VueI18n from 'vue-i18n'
import { Storage } from '@API'
import { getStorage } from '@UTIL'

const lang = {
    // https://gist.github.com/wpsmith/7604842
    // https://www.itread01.com/articles/1495793960.html

    // 中文 -> cn
    'cn': 'cn',
    'zh': 'cn',
    'zh-cn': 'cn',
    // 'zh-hk': 'cn', // 香港(hk)
    // 'zh-sg': 'cn', // 新加坡(sg)
    'zh-tw': 'cn', // 台灣
    // 'zh-mo': 'cn', // 澳門(mo)
    // 英文 -> us
    'us': 'us',
    'en': 'us',
    // 'en-au': 'us', //'English (Australia)',
    // 'en-bz': 'us', //'English (Belize)',
    // 'en-ca': 'us', // 加拿大(ca)
    // 'en-ie': 'us', // 愛爾蘭(ie)
    // 'en-jm': 'us', //'English (Jamaica)',
    // 'en-nz': 'us', //'English (New Zealand)',
    // 'en-ph': 'us', // 菲律賓(ph)
    // 'en-za': 'us', //'English (South Africa)',
    // 'en-tt': 'us', //'English (Trinidad & Tobago)',
    // 'en-gb': 'us', // 英國(gb)
    'en-us': 'us', //'English (United States)',
    // 'en-zw': 'us', //'English (Zimbabwe)',
    // 'gi': 'us', //直布羅陀(gi)
    // 泰國
    'th': 'th',
    // 越南
    'vi': 'vn',
    'vn': 'vn',
    // 日文
    'ja': 'jp',
    'jp': 'jp'
    // 印尼
    // 'id': 'id'
    // 柬埔寨
    // 'km': 'kh',
    /*
    // 寮國(找不到)
    'la': 'la',
    // 緬甸
    'my': 'mm',
    // 馬來西亞
    'ms': 'my',
    // 印度
    'pa-in': 'in',
    // 奧地利
    'at': 'at',
    'de-at': 'at', // 奧地利德語
    // 瑞典
    'sv': 'se',
    // 丹麥
    'da': 'dk',
    // 芬蘭
    'fi': 'fi',
    // 西班牙
    'es': 'es',
    'es-es': 'es',
    // 挪威
    'no': 'no',
    // 德國
    'de': 'de',
    'de-de': 'de',
    // 馬爾他
    'mt': 'mt'
    */
}

Vue.use(VueI18n)

const locale =
    // (lang[getStorage(Storage.locale, false)] ||
    (lang[USER_LANG] ||
    lang[window.navigator.userLanguage] ||
    lang[window.navigator.language] ||
    lang['cn']).toLowerCase()
// 語系包太過肥大不使用
// const lagnPackage = getStorage(Storage.i18nMessages + locale)
// const messages = lagnPackage ? {[locale]: lagnPackage} : {}

// 未成功載到語言包時的預設文字
const messages = {
    [locale]: {
        'popup_001': '温馨提示',
        'popup_004': '确定',
        'home_022': '世彩国际(GW)'
    }
}
const i18n = new VueI18n({
    locale,
    messages,
    silentTranslationWarn: true // warn 警報不出現
})

i18n.$tu = (cnKey, gameType) => {
    if (gameType === undefined) throw '$tu(cnKey, gameType): 需要彩種名來判定校正'
    const formatType = gameType.toLowerCase().replace('hl_', '')
    const keyMap = {

    }

    try {
        return i18n.t(keyMap[formatType][cnKey])
    } catch (e) {
        console.log('$tu ERROR:', e)
    }
    return cnKey
}

// '世彩国际(GW)'
const webTitle = DIRECT_TITLE || 'home_022'
i18n.setTitle = (title = '') => (document.title = title ? `${i18n.t(webTitle)} | ${i18n.t(title)}` : i18n.t(webTitle))

export default i18n