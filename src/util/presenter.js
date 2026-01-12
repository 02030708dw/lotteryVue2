import i18n from '@/lang/lang'
import { transCode } from '@UTIL'

/**
 * 投注紀錄頁注單狀態的class
 * @param {Object} item list item
 */
export const betStatusCls = (item) => {
    switch (item.status_flag) {
        case 'bingo':
            return 'text_color_strong'
        case 'not_bingo':
            return 'text_color_weak'
        case 'is_tie':
            return 'text_color_weak'
        case 'is_cancel':
        case 'cancelled_type_a':
        case 'cancelled_type_b':
            return 'text_color_weak'
        default:
            return ''
    }
}
/**
 * 追號紀錄子任務/投注紀錄狀態判斷
 * @param {Object} item list item
 */
export const traceSubTaskStatus = (item) => {
    let [txt, cls] = ['', '']
    switch (item.status_flag) {
        case 'no_prepare':
            // '未销售'
            txt = 'bettingrc_068'
            break
        case 'prepare':
            // '销售中'
            txt = 'bettingrc_019'
            break
        case 'in_progress':
            // '未开奖'
            txt = 'bettingrc_014'
            break
        case 'not_open':
            // '未开奖'
            txt = 'bettingrc_014'
            break
        case 'bingo':
            // '中奖'
            txt = 'bettingrc_015'
            cls = 'text_color_strong'
            break
        case 'not_bingo':
            // '未中奖'
            txt = 'bettingrc_016'
            cls = 'text_color_weak'
            break
        case 'is_tie':
            // '打和'
            txt = 'bettingrc_017'
            cls = 'text_color_weak'
            break
        // 投注紀錄/追號紀錄 使用的是兩個不同的cancel
        case 'cancel':
        case 'is_cancel':
            // '已取消'
            txt = 'bettingrc_018'
            cls = 'text_color_weak'
            break
        case 'cancelled_type_a':
            // 已取消(A)
            txt = 'project_status_cancelled_type_a'
            cls = 'text_color_weak'
            break
        case 'cancelled_type_b':
            // 已取消(B)
            txt = 'project_status_cancelled_type_b'
            cls = 'text_color_weak'
            break
    }
    return {txt, cls}
}
/**
 * 追號主任務狀態
 * @param {Object} item list item
 * @returns
 */
export const traceTaskStatus = (item) => {
    let [txt, cls] = ['', '']
    switch (Number(item.status)) {
        case 0:
            // txt = '进行中'
            txt = 'bettingrc_046'
            cls = 'text_color_strong'
            break
        case 1:
            // 目前選單內沒有
            // txt = '已取消'
            txt = 'bettingrc_018'
            cls = 'text_color_weak'
            break
        case 2:
            // txt = '已完成'
            txt = 'bettingrc_047'
            break
    }
    return {txt, cls}
}

/** 胆拖 "scode":"06|07&08&09&10&11" to 胆6
 * @returns {String}
*/
export const parseDanto = (item, maxLength = 5, gameType) => {
    try {
        let {
            scode,
            method_name
        } = item
        const code = scode
        scode = JSON.parse(code || '{}')
        const useScode = item.i18n_method_name_key.indexOf('dingWei') > -1
        // useScode: 定位膽直接用scode(因為要拆單)
        const transcode = parseUnit(scode, maxLength, gameType, useScode)
        if (method_name.indexOf('胆拖') !== -1) {
            let updatetransCode = transcode.split('|')
            // '胆'
            updatetransCode[0] = `[${i18n.t('common_137')}${updatetransCode[0]}]`
            return (code.length > maxLength) ? '' : updatetransCode.join(' ')
        } else if (scode.selectType === 'shaduizi') {
            // '杀对子'
            return (code.length > maxLength) ? '' : `[${i18n.t('common_145')}] ` + transcode
        } else if (method_name.includes('单式')) {
            return transcode //萬千百十個
        } else {
            return transcode
        }
    } catch (e) {
        console.warn('parseDanto error!')
    }
}

/**
 * 用在越南彩, code格式化成顯示樣式
 * @param {String} code 格式化前的code
 * @param {String} scode scode,目前只有'特殊'會使用
 * @param {String} methodName i18n_method_lv1_name, ex: 2D,3D, PL2...
 * @param {boolean} isHtml (optional)是否回傳html tag
 * @param {boolean} isParentheses (optional)是否要回傳括號
 * @return {String} 格式化後的文字
*/
export const parseVNCode = ({code = '', scode = '', methodName = '', isHtml = true, isParentheses = true, length = -1}) => {
    // 2D,3D,4D直接用code
    let formatCode = code
    // html tag ex: '<b></b>'
    const tag = 'b'
    // const [TagS, TagE] = [`<${tag} style='color:rgb(251,128,50)'>`, `</${tag}>`]
    // const [parenthesesS, parenthesesE] = isHtml ? [`${TagS}(${TagE}`, `${TagS})${TagE}`] : ['(', ')']
    const tagDom = `<${tag} style='color:#fb8032'>###</${tag}>`
    const leftBrackets = tagDom.replace('###', '(')
    const rightBrackets = tagDom.replace('###', ')')
    const parentheses = '(###)'
    const parenthesesHtml = `${leftBrackets}###${rightBrackets}`
    if (['特殊'].includes(methodName)) {
        // SP 用 scode
        let {scode_key} = JSON.parse(scode || {})
        return i18n.t(scode_key)
    } else if (['PL2', 'PL3'].includes(methodName)) {
        // PL2, PL3 需要加括號
        let isOneGroup = code.split(',').length === 1
        let domStr = isHtml ? parenthesesHtml : parentheses
        if (length !== -1 && !isOneGroup) {
            let tempCode = ''
            let strCount = 0
            code
                .split(',')
                .forEach((word, i) => {
                    const format = word.replace(/&/g, ' , ')
                    const deffLength = length - strCount
                    let str = parentheses.replace('###', format)
                    if (deffLength > 0) {
                        str = i ? (' , ' + str).substr(0, deffLength) : str.substr(0, deffLength)
                        strCount += str.length
                        tempCode += str.replace(/\(/g, leftBrackets).replace(/\)/g, rightBrackets)
                    }
                })
            return tempCode
        } else {
            formatCode = code
                .split(',')
                .map(word => {
                    let format = word.replace(/&/g, ',')
                    return isOneGroup || !isParentheses
                        ? format
                        : domStr.replace('###', format)
                }).join(' , ')
        }
    }
    // 2d3d4d
    formatCode = formatCode.replace(/,/g, ' , ')
    // 逗點前後有空格
    return (length !== -1) ? formatCode.substr(0, length) : formatCode
}

/**
 * parse digitstr
 * @param {String} code
 */
export const parseUnit = (code, maxLength = 5, gameType, useScode) => {
    try {
        let { scode, digitstr, scode_key } = code
        const tempScode = useScode ? scode : (scode_key || scode)
        let codes = (tempScode ? tempScode + '' : tempScode)
            .split('|')
            .map((line) => (
                line
                    .split('&')
                    .map(word => i18n.t(word))
                    .join('&')
            )).join('|')
        codes = digitstr ? (parseDigitstr(digitstr, gameType) + '：' + codes) : codes
        codes = transCode(codes)
        return codes.length > maxLength ? '' : codes
    } catch (err) {
        console.warn('parseUnit err!')
        code = transCode(code)
        return code.length > maxLength ? '' : code
    }
}

export const parseDigitstr = (digitstr, gameType) => {
    if (digitstr === '') return
    return digitstr
        .replace('w_', i18n.$tu('万', gameType))
        .replace('q_', i18n.$tu('千', gameType))
        .replace('b_', i18n.$tu('百', gameType))
        .replace('s_', i18n.$tu('十', gameType))
        .replace('g_', i18n.$tu('个', gameType))
}

/**
 * 處理複合式玩法名
 * @param {String} method
 */
export const methodName = (method) => {
    const [name, lv1_name] = [i18n.t(method.i18n_method_name_key), i18n.t(method.i18n_method_lv1_name_key)]
    let methodName = name.indexOf(lv1_name) > -1 ? name : (lv1_name + ' - ' + name)

    if (method.code_type === 'input') {
        return methodName.replace('复式', '单式')
    }
    return methodName
}

/**
 * 處理複合式玩法名(key)
 * @param {String} pKey parentNameKey
 * @param {String} cKey childNameKey
 */
export const methodNameKey = (pKey, cKey) => {
    const [pName, cName] = [i18n.t(pKey), i18n.t(cKey)]
    return cName.indexOf(pName) > -1 ? cName : pName + ' - ' + cName
}

/**
 * 投注內容的 [&] 換成 ,並把定位膽缺位補上 [-], 並翻譯key內容
 * @param {Object} code_key 投注內容
 */
export const transCodeI18n = code_key => code_key
    .replace(/&/g, ',')
    .split('|')
    .map(codes =>
        codes ? codes.split(',').map((oneKey) => i18n.t(oneKey)).join(',') : '-'
    )
    .join('|')