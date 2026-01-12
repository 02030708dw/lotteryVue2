<script>
import PageNation from './PageNation'
import { mapGetters, mapActions } from 'vuex'
import { formatNumber, componentBox } from '@UTIL'
import { betStatusCls, parseDanto, methodName, traceSubTaskStatus } from '@UTIL/presenter'

export default {
    name: 'InfoList',
    data() {
        return {
            tipIndex: -1
        }
    },
    props: {
        lotteryCountry: String
    },
    components: {
        PageNation
    },
    methods: {
        ...mapActions([
            _M.SET_GAME_INFO_DETAIL_INDEX,
            _M.SET_GAME_INFO_SHARE_INDEX,
            _M.SET_HEADER_NAV_IS_BACK
        ]),
        handleShare(index) {
            this[_M.SET_HEADER_NAV_IS_BACK](true)
            this[_M.SET_GAME_INFO_SHARE_INDEX](index)
            if (this.RWDMode !== 3) {
                this.$msg(componentBox({
                    zIndex: 1997,
                    beforeConfirm: () => {
                        this[_M.SET_HEADER_NAV_IS_BACK](false)
                        this[_M.SET_GAME_INFO_SHARE_INDEX](-1)
                    }
                }))
            }
        },
        showDetail(index) {
            this[_M.SET_HEADER_NAV_IS_BACK](true)
            this[_M.SET_GAME_INFO_DETAIL_INDEX](index)
            if (this.RWDMode !== 3) {
                this.$msg(componentBox({
                    beforeConfirm: () => {
                        this[_M.SET_HEADER_NAV_IS_BACK](false)
                        this[_M.SET_GAME_INFO_DETAIL_INDEX](-1)
                    }
                }))
            }
        },
        statusCls(item) {
            return betStatusCls(item)
        },
        haneletipIndex(index = -1) {
            this.tipIndex = this.tipIndex === index ? -1 : index
        },
        formatNumber(number) {
            return formatNumber(number) || 0
        },
        methodName(method) {
            return methodName(method)
        },
        updateTransCode(item, maxLength = 5) {
            return parseDanto(item, maxLength, (this.lotteryList2[item.lottery_id] || {}).name)
        },
        // IsSumIncomeOnly(sum_income_only) : 打和、已取消注单不列入计算
        get_list_item_sum(col, IsSumIncomeOnly) {
            const dontCountStatus = ['is_tie', 'is_cancel', 'cancelled_type_a', 'cancelled_type_b']

            return this.infoList.reduce((sum, item) => {
                sum += (IsSumIncomeOnly && dontCountStatus.includes(item.status_flag))
                    ? 0
                    : parseFloat(item[col])
                return sum
            }, 0)
        },
        prizeStateText(item) {
            // 依據 status_flag 判斷顯示狀態文字, 或顯示"已取消"
            return traceSubTaskStatus(item).txt || 'bettingrc_018'
        },
        // 判斷是否為官方彩
        isOfficial(lotID) {
            return +(this.lotteryList2[lotID] || {}).is_local === 0
        },
        getPrize(item) {
            const obj = JSON.parse(item.pointinfo.replace(/\\/g, ''))
            return obj.single_prize
        }
    },
    computed: {
        ...mapGetters([
            'gameInfoList',
            'gameInfoIsLoading',
            'lotteryList2',
            'RWDMode',
            'gameSum',
            'lang',
            'isShowBar',
            'hasShare'
        ]),
        infoList() {
            const { data } = this.gameInfoList
            if (!data) {
                return []
            }
            return data.list
        },
        isShowPageNation() {
            return this.gameInfoList.data && this.gameInfoList.pagination.totalNumber > 1
        },
        tipIndex2() {
            return this.tipIndex
        },
        onePrice_sum() {
            return this.get_list_item_sum('onePrice', this.gameSum.sum_income_only)
        },
        total_price_sum() {
            return this.get_list_item_sum('total_price', this.gameSum.sum_income_only)
        },
        bonus_sum() {
            return this.get_list_item_sum('bonus', this.gameSum.sum_income_only)
        },
        total_user_point() {
            return this.get_list_item_sum('user_point', this.gameSum.sum_income_only)
        },
        isShowList: {
            set() {},
            get() {
                if (!this.gameInfoList) {
                    return false
                }
                return this.gameInfoList.data && this.gameInfoList.pagination.totalNumber > 0
            }
        }

    }
}
</script>
