const integerPattern = /^[0-9]+$/
// 小數且允許'10.'
const floatPatternSoft = /(^[1-9][0-9]*(\.[0-9]*)?$)|(^[0-9](\.[0-9]*)?$)/

export default {
    /**
     * 更新後觸發輸入檢查
     * ex: v-clean-input:float.long={val, setVal, cb}
     * v-clean-input:[arg].[modifiers]
     * @param {String} el 綁定的DOM
     * @param {String} binding.arg 自訂參數
     * @param {String} binding.expression 綁定值的字串
     * @param {String} binding.modifiers 修飾符
     * @param {String} binding.value 綁定對象
     * @param {String} binding.oldValue 綁定對象更新前
     * @param {String} value.val 綁定對象的值
     * @param {Function} value.setVal 設定值的方法
     * @param {Function} value.cb callback
     */
    update: (el, binding, vnode) => {
        const { oldValue: oldV, value: v, expression, arg, modifiers } = binding
        const value = `${v.val}`
        const oldValue = `${oldV.val}`
        const _this = vnode.context
        // 沒有值或者前後相同不檢查
        if (!value || value === oldValue) return

        //小數點前的位數限制參數, 如果modifiers為數字則直接套用(ex:v-clean-input:float.7)
        const digitMode = {
            tiny: 2,
            short: 4,
            mid: 6,
            long: 8,
            default: 20
        }
        // 設定值列表
        const modifiersList = Object.keys(modifiers)
        // 設定檢驗數字位數, 以第一個 modifiers 為設定項(ex:v-clean-input:float.7)
        const digit = +modifiersList[0] || digitMode[modifiersList[0]] || digitMode.default

        _this.$nextTick(() => {
            let valid = true
            // 整數:只允許輸入數字
            if (arg === 'int') {
                // 最後輸入數
                valid = integerPattern.test(value)
                // 小數:只允許輸入數字&小數點, 且小數點只有一個
            } else if (arg === 'float') {
                valid = floatPatternSoft.test(value)
            }

            // 超過位數 (整數位數, 小數位數)
            const [intNum = '', floatNum = ''] = value.split('.')
            if (intNum.length > digit || floatNum.length > 6) {
                valid = false
            }

            // 只要不合法就還原回舊值
            !valid && v.setVal(oldValue)

            // callback
            if (v.cb) {
                v.cb(valid ? value : oldValue)
            }
        })
    }
}
