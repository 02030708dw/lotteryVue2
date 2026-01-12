<template>
    <div class="gr_city-table" v-if="VN_Issue[VN_pos]">
        <div class="gr_city-table__list"
            v-for="(cities, issue, i) in area"
            :key="issue"
        >
            <div class="gr_list__item">
                <label>
                    <span
                        class="c_checkbox  c_checkbox--light"
                        :class="{'is_checked': status[issue] === (cities && cities.length) && cities, 'is_disabled': !cities}"
                        v-if="maxLength > 1"
                    >
                        <span class="c_checkbox__inner" />
                        <input
                            type="checkbox"
                            :checked="status[issue] === (cities && cities.length)"
                            :disabled="!cities"
                            @change="setChkAll(issue, $event.target.checked)"
                        />
                    </span>
                    <span class="gr_item__text">{{transDate(issue)}}</span>
                </label>
            </div>

            <div class="gr_list__item" v-for="id in pad(cities)" :key="id" :class="{'is_checked': chk[id + issue]}">
                <label >
                    <span
                        class="c_checkbox"
                        :class="{'is_checked': chk[id + issue]}"
                        v-if="id"
                    >
                        <span class="c_checkbox__inner" />
                        <input
                            type="checkbox"
                            :checked="chk[id + issue]"
                            @change="setChk(id, issue, $event.target.checked)"
                        />
                    </span>
                    <span class="gr_item__text">{{$t(VN_cityData[id])}}</span>
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
</template>

<script>
    import { mapGetters } from 'vuex'

    export default {
        name: 'CityTable',
        data() {
            return {
                chk: {},
                status: {}
            }
        },
        props: {
            cityList: Array
        },
        created() {
            this.$root.$on('removeChkKey', this.removeChkKey)
            this.$root.$on('setChkAll', this.setChkAll)
            this.$root.$on('reset', this.reset)
        },
        destroyed() {
            this.$root.$off('removeChkKey', this.removeChkKey)
            this.$root.$off('setChkAll', this.setChkAll)
            this.$root.$off('reset', this.reset)
        },
        methods: {
            reset() {
                this.chk = {}
                this.status = {}
            },
            removeChkKey(arr) {
                arr.forEach(({key}) => this.$delete(this.chk, key))
            },
            transDate(issue) {
                const data = issue.split('-')[0]
                const date = moment(data)
                return `${date.format('MM-DD')} (${this.$t(this.VN_week[date.day()])})`
            },
            setChk(cityId, issue, bool) {
                const key = cityId + issue
                let cityList = []
                if (bool) {
                    const obj = {
                        cityId,
                        issue,
                        key,
                        date: issue.split('-')[0],
                        pos: this.VN_cityArea[cityId]
                    }
                    cityList = [...this.cityList[0], obj]
                    this.status[issue] = (this.status[issue] || 0) + 1
                } else {
                    this.status[issue]--
                    cityList = this.cityList[0].filter(obj => obj.key !== key)
                }
                this.cityList.forEach((list, rowId) => {
                    this.$set(this.cityList, rowId, cityList)
                    this.$root.$emit('setRowMoney', rowId)
                })
                this.$set(this.chk, key, bool)
            },
            setChkAll(issue, bool) {
                const data = (this.area[issue] || [])
                    .filter(cityId => cityId)
                    .map(cityId => ({
                        cityId,
                        key: cityId + issue,
                        issue,
                        date: issue.split('-')[0],
                        pos: this.VN_cityArea[cityId]
                    }))
                let cityList = []
                if (bool) {
                    const listKey = {}
                    let count = 0
                    ;[...this.cityList[0], ...data].forEach((obj) => {
                        const { key, issue: issue2 } = obj
                        if (!listKey[key]) {
                            listKey[key] = true
                            cityList.push(obj)
                            issue === issue2 && count++
                        }
                    })
                    this.status[issue] = count
                    cityList.forEach(({key}) => this.$set(this.chk, key, bool))
                } else {
                    this.cityList[0].forEach(obj => {
                        const {key, issue: issue2} = obj
                        if (!data.find(obj2 => key === obj2.key)) {
                            cityList.push(obj)
                        } else {
                            issue2 && this.status[issue]--
                            this.$delete(this.chk, key)
                        }
                    })
                }
                this.area[issue] && this.$set(this.chk, issue, bool)
                this.cityList.forEach((list, rowId) => {
                    this.$set(this.cityList, rowId, cityList)
                    this.$root.$emit('setRowMoney', rowId)
                })
            },
            pad(arr = []) {
                return [...arr, ...Array(this.maxLength - arr.length)]
            }
        },
        computed: {
            ...mapGetters([
                'VN_jsDynamicConfig',
                'lotteryList2',
                'VN_isOpenIssue',
                'VN_cityArea',
                'VN_Issue',
                'VN_pos',
                'VN_menuIndex',
                'VN_gameMenu',
                'VN_area',
                'VN_pos',
                'VN_cityData',
                'VN_week'
            ]),
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
            }
        }
    }
</script>