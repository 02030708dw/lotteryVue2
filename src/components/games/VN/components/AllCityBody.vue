<template>
    <GrCol>
        <GrRow>
            <GrCom>
                <ul class="gr_grid-vn__group">
                    <li class="gr_group__list">
                        <label class="gr_list__item">
                            <span
                                class="gr_item__input  c_checkbox"
                                :class="{'is_checked': chkAll}"
                            >
                                <span class="c_checkbox__inner" />
                                <input
                                    type="checkbox"
                                    :checked="chkAll"
                                    @change="setChkAll({bool: $event.target.checked})"
                                >
                            </span>
                            <!-- '全部' -->
                            <span class="gr_item__text">{{$t('bettingrc_002')}}</span>
                        </label>
                    </li>
                    <li
                        class="gr_group__list"
                        v-if="VN_nowAreaCity && VN_Issue[area] === VN_allAreaIssue && VN_lotteryOfficialSwitch[area] && !checkIsBlocked(area)"
                        v-for="(pos, area) in VN_areaTitle"
                        :key="area"
                    >
                        <label
                            class="gr_list__item"
                            v-for="id in VN_nowAreaCity[area]" :key="id"
                            v-if="id && lotteryList2[id]"
                        >
                            <span
                                class="gr_item__input  c_checkbox"
                                :class="{'is_checked': chk[id + VN_allAreaIssue], 'is_disabled': !VN_isOpenIssue[area] || (VN_Issue[area] !== VN_allAreaIssue)}"
                            >
                                <span class="c_checkbox__inner" />
                                <input
                                    type="checkbox"
                                    :value="id"
                                    :checked="chk[id + VN_allAreaIssue]"
                                    :disabled="!VN_isOpenIssue[area] || (VN_Issue[area] !== VN_allAreaIssue)"
                                    @change="setChk(id, $event.target.checked)"
                                />
                            </span>
                            <span class="gr_item__text">{{$t(VN_cityData[id])}}</span>
                        </label>
                    </li>
                    <li v-else class="gr_group__list" />
                </ul>
            </GrCom>
        </GrRow>
    </GrCol>
</template>
<script>
    import GrRow from './GrRow'
    import GrCol from './GrCol'
    import GrCom from './GrCom'
    import { mapGetters } from 'vuex'
    import blockedFilter from '@C/games/VN/helpers/blockedFilter'
    export default {
        name: 'AllCityBody',
        components: {
            GrRow,
            GrCol,
            GrCom
        },
        created() {
            this.$root.$on('setChkAll', this.setChkAll)
            this.$root.$on('setChkArea', this.setChkArea)
            this.$root.$on('removeChkKey', this.removeChkKey)
            this.$root.$on('reset', this.reset)
        },
        destroyed() {
            this.$root.$off('setChkAll', this.setChkAll)
            this.$root.$off('setChkArea', this.setChkArea)
            this.$root.$off('removeChkKey', this.removeChkKey)
            this.$root.$off('reset', this.reset)
        },
        data() {
            return {
                chk: {}
            }
        },
        props: {
            cityList: Array,
            rowId: Number,
            chkPosN: Boolean,
            chkPosS: Boolean,
            chkPosC: Boolean
        },
        computed: {
            ...mapGetters([
                'VN_areaTitle',
                'VN_nowAreaCity',
                'VN_nowAreaCityAll',
                'VN_isOpenIssue',
                'VN_allAreaIssue',
                'VN_cityData',
                'VN_cityArea',
                'VN_Issue',
                'RWDMode',
                'VN_gameConfig',
                'VN_subMenuIndex',
                'VN_gameMenuSub',
                'officialKeyVN',
                'VN_lotteryOfficialSwitch',
                'lotteryList2'
            ]),
            chkAll() {
                return (this.chkPosN || this.checkIsBlocked('VN_N')) &&
                     (this.chkPosS || this.checkIsBlocked('VN_S')) &&
                     (this.chkPosC || this.checkIsBlocked('VN_C'))
            }
        },
        watch: {
            chk() {
                if (this.RWDMode === 1) {
                    let obj = {}
                    const chkArr = Object.values(this.chk)
                    chkArr.forEach((pos) => (obj[pos] = (obj[pos] || 0) + 1))
                    this.setParentStatus(obj, 'SStatus', 'VN_S')
                    this.setParentStatus(obj, 'CStatus', 'VN_C')
                    this.setParentStatus(obj, 'NStatus', 'VN_N')
                }
            }
        },
        methods: {
            setParentStatus(obj, status, pos) {
                const parent = this.$parent.$parent
                const res = !this.VN_nowAreaCity[pos] || this.filterCity(this.VN_nowAreaCity[pos]).length === obj[pos]
                parent.$set(parent[status], this.rowId, res)
            },
            reset() {
                this.chk = {}
            },
            removeChkKey(arr) {
                arr.forEach(({key}) => this.$delete(this.chk, key))
            },
            filterCity(cityArr = this.VN_nowAreaCityAll) {
                return cityArr
                    .filter(cityId =>
                        cityId &&
                        this.VN_isOpenIssue[this.VN_cityArea[cityId]] &&
                        !this.checkIsBlocked(this.VN_cityArea[cityId]) &&
                        (this.VN_Issue[this.VN_cityArea[cityId]] === this.VN_allAreaIssue)
                    )
            },
            setChk(cityId, bool) {
                const issue = this.VN_allAreaIssue
                const key = cityId + issue
                if (bool) {
                    const obj = this.mapCityData(cityId)
                    this.cityList[this.rowId].push(obj)
                    this.$set(this.chk, key, obj.pos)
                } else {
                    const index = this.cityList[this.rowId].findIndex(obj => obj.key === key)
                    this.cityList[this.rowId].splice(index, 1)
                    this.$delete(this.chk, key)
                }
                this.$root.$emit('setRowMoney', this.rowId)
            },
            setChkAll({bool, rowId = this.rowId}) {
                // console.log({bool, rowId});
                if (bool) {
                    const filterList = this
                        .filterCity()
                        .map(this.mapCityData)
                    this.$set(this.cityList, rowId, filterList)
                    filterList.forEach(({key, pos}) => this.$set(this.chk, key, pos))
                } else {
                    this.$set(this.cityList, rowId, [])
                    this.$set(this, 'chk', {})
                }
                this.$root.$emit('setRowMoney', rowId)
            },
            setChkArea({area, bool}) {
                if (bool) {
                    const areaCity = this.VN_nowAreaCityAll
                        .filter(cityId =>
                            this.VN_cityArea[cityId] === area &&
                            !this.cityList[this.rowId].find(({key}) => key === cityId + this.VN_allAreaIssue)
                        )
                        .map(this.mapCityData)
                    this.$set(this.cityList, this.rowId, [...this.cityList[this.rowId], ...areaCity])
                } else {
                    const areaCity = this.cityList[this.rowId]
                        .filter(({cityId}) => this.VN_cityArea[cityId] !== area)
                    this.$set(this.cityList, this.rowId, [...areaCity])
                }
                const tempChk = {}
                this.cityList[this.rowId].forEach(({key, pos}) => (tempChk[key] = pos))
                this.$set(this, 'chk', tempChk)
                this.$root.$emit('setRowMoney', this.rowId)
            },
            mapCityData(cityId) {
                const issue = this.VN_allAreaIssue
                return {
                    key: cityId + issue,
                    cityId,
                    issue,
                    date: issue.split('-')[0],
                    pos: this.VN_cityArea[cityId]
                }
            },
            checkIsBlocked(area) {
                return blockedFilter.checkIsBlocked(area, this)
            }
        }
    }
</script>