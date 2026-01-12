<script>
import { formatNumber, returnState } from '@UTIL'

export default {
    name: 'BoxMixin',
    data() {
        return {
            keyObj: {
                '1D': 'thai_011',
                '2D': 'thai_010',
                '3D': 'thai_009'
            }
        }
    },
    methods: {
        handleRemove(index) {
            let data = {}
            this.MY_gameOrderArr.forEach((obj, i) => {
                if (i === index) {
                    return
                }
                data[`${obj.methodId}_${obj.codes}`] = obj
            })
            this[_M.SET_MY_TEMP_DATA]({
                temp: 'MY_gameOrder',
                data
            })
        },
        randomLotterys(num) {
            if (this.isBlocked) return
            this.$root.$emit('beforeRandomLotterys', num)
        },
        formatNumber(number) {
            return formatNumber(number)
        },
        showMethodName(methodId) {
            const { title_key, parent } = this.MY_gameSubMenuObj[methodId]
            return `${this.$t(this.keyObj[parent.toUpperCase()])}-${this.$t(title_key)}`
        },
        setMoney(key, money, index) {
            const temp = (this.MY_gameOrderArr[index].money + '').replace(/[^0-9]/g, '')
            const notNum = /[^0-9]/.test(money)
            const isOver = money > 99999999
            this.handleMoney(key, money)
            this.$nextTick(() => {
                if (notNum) {
                    this.handleMoney(key, temp)
                } else if (isOver) {
                    this.handleMoney(key, 99999999)
                }
            })
        },
        handleMoney(key, money) {
            let data = returnState(this.MY_gameOrder)
            data[key].money = money
            this[_M.SET_MY_TEMP_DATA]({
                temp: 'MY_gameOrder',
                data
            })
        },
        handleBlur(key, index) {
            if (!+this.MY_gameOrderArr[index].money || this.MY_gameOrderArr[index].money < +this.MY_stake) {
                this.handleMoney(key, this.MY_stake)
            }
        },
        handleEmpty() {
            this[_M.SET_MY_TEMP_DATA]({
                temp: 'MY_gameOrder',
                data: {}
            })
        }
    }
}
</script>
