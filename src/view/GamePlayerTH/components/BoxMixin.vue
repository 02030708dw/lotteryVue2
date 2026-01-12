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
            this.TH_gameSelectDataArr.forEach((obj, i) => {
                if (i === index) {
                    return
                }
                data[`${obj.methodId}_${obj.codes}`] = obj
            })
            this[_M.SET_TH_TEMP_DATA]({
                temp: 'TH_gameSelectData',
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
            const { title_key, parent } = this.TH_gameSubMenuObj[methodId]
            return `${this.$t(this.keyObj[parent.toUpperCase()])}-${this.$t(title_key)}`
        },
        setMoney(key, money, index) {
            const temp = (this.TH_gameSelectDataArr[index].money + '').replace(/[^0-9]/g, '')
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
            let data = returnState(this.TH_gameSelectData)
            data[key].money = money
            this[_M.SET_TH_TEMP_DATA]({
                temp: 'TH_gameSelectData',
                data
            })
        },
        handleBlur(key, index) {
            if (!+this.TH_gameSelectDataArr[index].money || this.TH_gameSelectDataArr[index].money < this.TH_stake) {
                this.handleMoney(key, this.TH_stake)
            }
        }
    }
}
</script>
