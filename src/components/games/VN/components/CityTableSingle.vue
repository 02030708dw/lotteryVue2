<template>
    <div class="gr_city-table gr_city-tableSingle" v-if="VN_Issue[VN_pos]">
        <div class="gr_city-tableSingle__wrap">
            <div class="gr_city-table__list"
                v-for="(cities, issue, i) in area"
                :key="issue"
            >
                <div class="gr_list__item">
                    <label>
                        <span class="gr_item__text">{{transDate(issue)}}</span>
                    </label>
                </div>

                <div class="gr_list__item" v-for="id in pad(cities)" :key="id" @click="setChk(id, issue)">
                    <label>
                        <span :class="{is_checked: cityIssue === id + issue}">
                            <span class="gr_item__text">{{$t(VN_cityData[id])}}</span>
                        </span>
                    </label>
                </div>
            </div>
            <div class="gr_city-table__list"
                v-for="i in fillArea"
                :key="i"
            >
                <div class="gr_list__item">
                    <label>
                        <span class="gr_item__text">-</span>
                    </label>
                </div>
                <div class="gr_list__item" v-for="j in maxLength" :key="j">
                    <label>
                        <span class="gr_item__text"></span>
                    </label>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex'

    export default {
        name: 'CityTableSingle',
        data() {
            return {
                chk: {}
            }
        },
        beforeMount() {
            this.$root.$on('filterOverIssueCity', this.filterOverIssueCity)
        },
        destroyed() {
            this.$root.$off('filterOverIssueCity', this.filterOverIssueCity)
        },
        methods: {
            ...mapActions([
                _M.GAME_ORDER_VN_SUBMIT
            ]),
            transDate(issue) {
                const data = issue.split('-')[0]
                const date = moment(data)
                return `${date.format('MM-DD')} (${this.$t(this.VN_week[date.day()])})`
            },
            setChk(cityId, issue) {
                if (cityId) {
                    const key = cityId + issue
                    this[_M.GAME_ORDER_VN_SUBMIT]({ type: 7, key, cityId, issue })
                }
            },
            pad(arr = []) {
                return [...arr, ...Array(this.maxLength - arr.length)]
            },
            // 獎期換新後過濾機制
            filterOverIssueCity() {
                // 官彩才需要過濾
                if (!this.VN_isLocal) {
                    let obj = {type: 7}
                    let ltProjectNum = 0
                    let ltMoneyAmout = 0
                    // const orderList = this.VN_gameOrder.showList[0]
                    const showList = this.VN_gameSubmit.showList.filter(({issue, cityId}) =>
                        issue.replace('-', '') >= this.issueAreaDate[this.VN_cityArea[cityId]]
                    )
                    // 號碼項/一般投注彈窗過濾
                    showList.forEach(({tNums, money}) => {
                        ltProjectNum += tNums
                        ltMoneyAmout += money
                    })
                    this[_M.GAME_ORDER_VN_SUBMIT]({ type: 1, showList, ltProjectNum, ltMoneyAmout })
                    // 城市選擇區&快速投注彈窗過濾
                    if (this.VN_gameOrder.issue.replace('-', '') < this.issueAreaDate[this.VN_pos]) {
                        obj.cityId = ''
                        obj.issue = ''
                        obj.ltProjectNum = 0
                        obj.showList = this.VN_gameOrder.showList.map(({
                            name,
                            nums,
                            title,
                            title_key,
                            type
                        }) => ({
                            name,
                            nums,
                            title,
                            title_key,
                            type
                        }))
                    }
                    this[_M.GAME_ORDER_VN_SUBMIT](obj)
                }
            }
        },
        computed: {
            ...mapGetters([
                'VN_jsDynamicConfig',
                'VN_isOpenIssue',
                'VN_cityArea',
                'VN_Issue',
                'VN_pos',
                'VN_menuIndex',
                'VN_gameMenu',
                'VN_area',
                'VN_cityData',
                'VN_week',
                'VN_gameOrder',
                'VN_gameSubmit',
                'lotteryList2'
            ]),
            issueAreaDate() {
                let obj = {}
                Object.entries(this.VN_Issue).forEach(([key, val]) => {
                    obj[key] = val ? val.replace('-', '') : 0
                })
                return obj
            },
            nowIssueDate() {
                return +this.VN_Issue[this.VN_pos].replace('-', '')
            },
            area() {
                let area = {}
                let num = 0
                Object
                    .entries(this.VN_area)
                    .forEach(([issue, cityArr]) => {
                        const date = +issue.replace('-', '')
                        if (this.nowIssueDate <= date && num++ < 7) {
                            area[issue] = (cityArr[this.VN_pos] || []).filter(cityId => this.lotteryList2[cityId])
                        }
                    })
                return area
            },
            fillArea() {
                return 7 - Object.keys(this.area).length
            },
            maxLength() {
                let res = 1
                Object.values(this.area).forEach((areas) => {
                    const len = (areas || []).length
                    len > res && (res = len)
                })
                return res
            },
            cityIssue() {
                return this.VN_gameOrder.key
            }
        }
    }
</script>