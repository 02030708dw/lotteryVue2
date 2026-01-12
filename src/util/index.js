import axios from 'axios'
import base64 from 'hi-base64'
import router from '@/router'
export const utc8 = (m = moment()) => m.utcOffset(8)
export const now = (format = true) => {
    return format ? utc8().format('YYYY-MM-DD hh:mm:ss') : utc8().valueOf()
}
export const today = () => utc8().format('YYYY-MM-DD')

export const warnMessageBox = options => ({
    show: true,
    zIndex: 2000,
    type: 'warning',
    ...options
})

export const warnMessageBox2 = options => ({
    show: true,
    zIndex: 2004,
    type: 'warning',
    ...options
})
export const componentBox = options => ({
    show: true,
    zIndex: 1996,
    isOutSideClickClose: true,
    type: '',
    ...options
})
/**
 * 多重帳號登入鎖死彈窗
 * @param {object} options 參數
 */
export const checkLoginMessageBox = (options, rootGetters) => ({
    show: true,
    type: 'warning',
    // '您的账号已重复登入，此页面已被登出。'
    message: 'popup_088',
    // '确定'
    confirmBtnText: 'popup_004',
    isShowCloseIcon: false,
    isPressEscClose: false,
    zIndex: 2004,
    beforeConfirm: () => {
        const { userInfo, isGPI, miscInfo, isDirect } = rootGetters
        parent && parent.postMessage && parent.postMessage({ logout: true }, '*')
        opener && opener.postMessage({ demoLogout: true }, '*')
        if (userInfo.home) {
            return location.replace(userInfo.home)
        }
        // 如果有此參數，直接關掉視窗
        if (miscInfo && !miscInfo.logoutRedirectk) {
            window.close()
        }
        if (isGPI) {
            const redirectUrl = getCookie('ERROR_URL')
            if (redirectUrl) {
                window.location = decodeURIComponent(redirectUrl)
            } else {
                let myWindow = window.open('', '_self')
                myWindow.document.write('<p></p>')
            }
        } else if (isDirect) {
            window.close()
        } else {
            router.replace('/Redirect')
        }
    },
    ...options
})
/**
 * 判斷登入的用戶來源
 * @param {Object} JWT
 */
export const checkLoginSource = JWT => {
    if (!JWT) throw 'checkLoginSource fail'
    let idx = JWT.room_master_login_type
    // '0' => 'B2B',
    // '1' => 'GPI',
    // '2' => 'DIRECT',
    // '8' => 'DEMO',
    // '9' => 'TEST',
    const types = {
        0: 'B2B',
        1: 'GPI',
        2: 'DIRECT', // 直客
        8: 'DEMO',
        9: 'TEST'
    }
    return types[idx]
}
/**
 * 投注頁投注時的彈窗
 * @param {object} options 參數
 */
export const gameSumbitBox = options => ({
    show: true,
    zIndex: 1998,
    isPressEscClose: false,
    isCustom: true,
    type: 'warning',
    ...options
})
/**
 * 處理 JWT
 * @param {object} JWT JWT
 * @param {object} JWTHash JWTHash
 */
const handleJWT = (JWTHash, rootGetters) => {
    // don't check if already at Redirect page
    if (
        window.location.pathname === '/Redirect' ||
        window.location.hash === '#/Redirect' //for IE9 compatibility
    ) {
        return false
    }

    let JWTCookie = getCookie('JWT')
    if ((JWTCookie && JWTCookie !== JWTHash) || !JWTCookie) {
        // '尚未登入'
        checkLoginMessageBox({ message: 'popup_089' }, rootGetters)
        return false
    } else {
        return true
    }
}
const ajaxGetWayAllow = {
    '0': 1,
    '8103': 1,
    '9401': 1,
    '9402': 1,
    '9501': 1,
    '9502': 1,
    '9503': 1,
    '9504': 1,
    '9505': 1,
    '8104': 1,
    '2003': 1,
    '9007': 1,
    '9009': 1, // 越南彩玩法開關
    '9010': 1 // 越南彩玩法開關
}
const ajaxNotLogin = {
    '2': 1,
    '3': 1,
    '4': 1,
    '5': 1,
    '9': 1,
    '10': 1
}
/**
 * 檢查 Ajax 回傳結果
 * 檢查 Ajax 狀態碼
 * 0 成功
 * 1 JWT 不合法参数
 * 2 JWT 非预期数值
 * 3 JWT 签章不合法
 * 4 JWT 使用时段不符
 * 5 JWT token 过期
 * 6 payload data not send
 * 7 data 解密失败
 * 8 data json decode fail
 * 9 无此 user_id
 * 10 己被其他设备登入
 * 98 JWT 套件未定义例外
 * 99 其他未定义例外
 * 2003 未開獎期
 * 8001 號碼格式有誤
 * 8002 注單注數有誤
 * 8003 注單金額錯誤
 * 9001 投注错误0x01 例外狀況錯誤
 * 9002 投注错误0x02 例外狀況錯誤
 * 9003 投注错误0x03 出號機
 * 9401 賠率有誤
 * 9501 停售
 * 9502 封鎖
 * 9503 停售+封鎖
 * 9007 杀对子已关闭，请重新投注。
 * 9009 越南彩玩法開關
 * 9010 越南彩玩法開關
 * @param {object} res 回傳結果
 */
const handleAjaxData = (res, now, params, rootGetters, options) => {
    const { dispatch } = rootGetters
    const { isNotShowMessageBox = false } = options
    let data = res.data
    data.now = now
    data.serverTime = +utc8(moment(res.headers.date))
    data.params = params
    if (res.status !== 200) {
        const err = {
            message: `Error Status ${res.status}`,
            response: 1
        }
        return Promise.reject(err)
    }
    const stateCode = +data.result
    if (ajaxGetWayAllow[stateCode]) {
        // '休市维护中'
        stateCode === 2003 &&
            !isNotShowMessageBox &&
            dispatch(_M.SET_MESSAGE_BOX_DATA, warnMessageBox({ message: 'popup_049' }))
        return data
    } else if (ajaxNotLogin[stateCode]) {
        // '请重新登入'
        dispatch(
            _M.SET_MESSAGE_BOX_DATA,
            checkLoginMessageBox({ ...data, message: 'popup_090' }, rootGetters)
        )
        return false
    } else if (+stateCode === 11) {
        // 被GCA登出
        dispatch(
            _M.SET_MESSAGE_BOX_DATA,
            checkLoginMessageBox({ ...data, message: 'popup_150' }, rootGetters)
        )
        return false
    }

    const err = {
        message: data.message_key || data.message || `Error Code: ${stateCode}`,
        messageParam: data.message_param,
        response: 1
    }
    return Promise.reject(err)
}
/**
 * Ajax 錯誤處理
 * @param {object} data 回傳結果
 */
const handleCatch = (err, dispatch, options) => {
    if (!options.isNotShowMessageBox) {
        if (err.response) {
            dispatch(
                _M.SET_MESSAGE_BOX_DATA,
                warnMessageBox({
                    message: err.message,
                    messageParam: err.messageParam
                })
            )
        } else {
            dispatch(
                _M.SET_MESSAGE_BOX_DATA,
                warnMessageBox({
                    // 您的网络连接异常，请检查连接并按下[确认] 重整页面。
                    message: 'popup_129',
                    beforeConfirm: () => window.location.reload()
                })
            )
        }
    }
    return false
}
/**
 * Ajax 打包
 * @param {string} url API位址
 * @param {object} params API 參數
 * @param {object} JWT JWT state
 * @param {Object} options ajax 選項
 * @param {Number} num 重試次數
 * @param {Number} timeOut 間隔秒數重試
 */
export const handleAjax = async (url, params, rootGetters, options = {}) => {
    const { JWT, JWTHash, dispatch, isIdle, isOutGame } = rootGetters
    if (isOutGame) {
        return false
    }
    if (isIdle) {
        dispatch(
            _M.SET_MESSAGE_BOX_DATA,
            checkLoginMessageBox(
                {
                    // '您已闲置过久，请重新整理。"按下确认后重整后才可继续操作。'
                    message: 'popup_101',
                    beforeConfirm: () => window.location.reload()
                },
                rootGetters
            )
        )
        console.log('idle')
        return false
    }
    if (!handleJWT(JWTHash, rootGetters)) {
        console.log('JWT fail')
        return false
    }
    const { isPromise = false, timeout = 0 } = options
    //廳主 Id
    params.roomMasterId = JWT.room_master_id
    //廳主 userId
    params.userId = JWT.user_id
    const now = +new Date()
    const data = await axios({
        method: 'post',
        url,
        data: params,
        timeout
    })
        .then(res => handleAjaxData(res, now, params, rootGetters, options))
        .then(data => data || false)
        .catch(err => handleCatch(err, dispatch, options))

    if (isPromise && !data) {
        return Promise.reject(data)
    } else {
        return data
    }
}

/**
 * base 64 編碼
 * @param {string} str 要編碼的字串
 */
export const b64EncodeUnicode = str => base64.encode(str)

/**
 * base 64 Bytes 編碼
 * @param {string} arr 要編碼的字串
 */
export const b64EncodeUnicodeBytes = arr => b64EncodeUnicode(new Uint8Array(arr))

/**
 * base 64 解碼
 * @param {string} str 要解碼的字串
 */
export const b64DecodeUnicode = str => base64.decode(str)

/**
 * base 64 Bytes 解碼
 * @param {string} str 要解碼的字串
 */
export const b64DecodeUnicodeBytes = str => base64.decode.bytes(str)
/**
 * 取得 Cookie
 * @param {string} cname Cookie Name
 */
export const getCookie = cname => {
    let name = cname + '='
    let ca = document.cookie.split(';')
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i]
        while (c.charAt(0) === ' ') {
            c = c.substring(1)
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length)
        }
    }
    return ''
}
/**
 * 判斷是否為 json 格式
 * true 轉換成 javascript 可用的格式
 * false 返回空字串
 * @param {string} string json 字串
 */
export const handleJson = string => {
    try {
        return JSON.parse(string)
    } catch (error) {
        return ''
    }
}
/**
 * 設定 localStorage
 * true 返回 localStorage 並進行 json 檢測
 * false 返回空字串
 * @param {string} key localStorage 的 Key
 * @param {string} data 資料
 * @param {boolean} isJson 是否 Json
 */
export const setStorage = (key, data, isJson = true) => {
    try {
        data = isJson ? JSON.stringify(data) : data
        localStorage[b64EncodeUnicode(key)] = b64EncodeUnicode(data)
    } catch (err) {
        console.error('SetStorage rror', err)
        // return
    }
}

/**
 * 取得 localStorage 並判斷有無
 * true 返回 localStorage 並進行 json 檢測
 * false 返回空字串
 * @param {string} key localStorage 的 Key
 * @param {boolean} isJson 是否 Json
 */
export const getStorage = (key, isJson = true) => {
    const storage = localStorage[b64EncodeUnicode(key)]
    if (storage) {
        try {
            const unCode = b64DecodeUnicode(storage)
            return isJson ? handleJson(unCode) : unCode
        } catch (err) {
            console.error('GetStorage Error', err)
            return ''
        }
    }
    return ''
}

/**
 * 深複製
 * @param {any} state 要複製的資料
 */
export const returnState = data => {
    try {
        return data ? JSON.parse(JSON.stringify(data)) : {}
    } catch (error) {
        console.warn('deep clone failed. data: ', data)
        return {}
    }
}

/**
 * 千分號逗點
 * @param {string|number} number 金額
 */
export const thousandComma = number => {
    let num = returnState(number)
    num = parseFloat(num).toFixed(2)
    const pattern = /(-?\d+)(\d{3})/

    while (pattern.test(num)) {
        num = num.replace(pattern, '$1,$2')
    }
    return num
}
/**
 * 千分號逗點/小數點最多五位
 * @param {string|number} number 金額
 */
export const formatNumber = number => {
    const pattern = /(\d+)(\d{3})/
    const tails = /\.?0*$/
    let num = returnState(number)
    num = parseFloat(num)
        .toFixed(5)
        .replace(tails, '')
        .split('.')

    while (pattern.test(num[0])) {
        num[0] = num[0].replace(pattern, '$1,$2')
    }

    num = num.join('.')

    return num === 'NaN' ? '' : num
}
const units = n => [...Array(10).keys()].map(i => '0'.repeat(n) + i)
const tens = n => [...Array(89).keys()].map(i => '0'.repeat(n) + (i + 10))
const hundreds = [...Array(750).keys()].map(i => i + 99)
const hoursData = [...units(2), ...tens(1), ...hundreds]
const timerData = [...units(1), ...tens(0), ...hundreds]
/**
 * 計時器缺位补零
 * @param {number} number 數字
 */
export const formatTimer = number => `${timerData[~~number]}`
/**
 * 計時器缺位补零
 * @param {number} number 數字
 */
export const formatHours = number => `${hoursData[~~number]}`
/**
 * 投注紀錄/追號紀錄的日期產生
 * @param {number} number 天數
 * @param {string} serverTime 伺服器日期
 */
export const controlDate = (number, serverTime) => {
    const today = () => moment(serverTime)
    let array = [
        {
            // '今日'
            label: 'bettingrc_005',
            value: today().format('YYYY-MM-DD')
        },
        {
            // '近三日'
            label: 'bettingrc_006',
            value: 2
        },
        {
            // '近七日'
            label: 'bettingrc_007',
            value: 3
        }
    ]

    for (let i = 1; i < number; i++) {
        const value = today()
            .add(-i, 'day')
            .format('YYYY-MM-DD')

        array.push({
            label: value,
            value
        })
    }
    return array
}

/**
 * 投注內容的 [&] 換成 ,並把定位膽缺位補上 [-]
 * @param {String} code 投注內容
 */
export const transCode = code => {
    return code
        ? code
            .replace(/&/g, ',')
            .split('|')
            .map(codes => codes || '-')
            .join('|')
        : ''
}

// Check IE version
export const isIE = () => {
    var ua = window.navigator.userAgent

    // Test values; Uncomment to check result …

    // IE 10
    // ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';

    // IE 11
    // ua = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';

    // Edge 12 (Spartan)
    // ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0';

    // Edge 13
    // ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586';

    var msie = ua.indexOf('MSIE ')
    if (msie > 0) {
        // IE 10 or older => return version number
        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10)
    }

    var trident = ua.indexOf('Trident/')
    if (trident > 0) {
        // IE 11 => return version number
        var rv = ua.indexOf('rv:')
        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10)
    }

    var edge = ua.indexOf('Edge/')
    if (edge > 0) {
        // Edge (IE 12+) => return version number
        return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10)
    }

    // other browser
    return false
}

// Date to String
export const formatDateToString = date => {
    const data = {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
    }
    // 月/日 不滿兩位補零 mmdd
    return `${data.year}-${(+data.month < 10 ? '0' : '') + data.month}-${(+data.day < 10 ? '0' : '') +
        data.day}`
}
