<template>
    <div class="gr_grid-vn">
        <div class="gr_grid-vn__header">
            <!-- '地区' -->
            <span class="gr_header__text">{{$t('vn_t_008')}}</span>
        </div>
        <div class="gr_grid-vn__controller">
            <div
                class="gr_controller__item"
                :class="{is_active: chkAll}"
                @click="setChkAll(true)"
            >
                <!-- '全' -->
                <div class="gr_item__text">{{$t('common_019')}}</div>
            </div>
            <div class="gr_controller__item" @click="setChkAll(false)">
                <!-- '清' -->
                <div class="gr_item__text">{{$t('common_031')}}</div>
            </div>
        </div>
        <div class="gr_grid-vn__content">
            <div
                class="gr_content__list"
                v-for="area in officialKeyVN"
                :key="area"
                v-if="VN_nowAreaCity[area] && VN_lotteryOfficialSwitch[area]"
            >
                <div class="gr_list__title">{{$t(chkTitle[area])}}</div>
                <div class="gr_list__body">
                    <span
                        class="gr_list__button"
                        :class="{
                            is_active: chk[id + VN_allAreaIssue],
                            is_disabled: !VN_isOpenIssue[area] || (VN_Issue[area] !== VN_allAreaIssue)
                        }"
                        v-for="id in VN_nowAreaCity[area]" :key="id"
                        v-if="id && lotteryList2[id]"
                        @click="setChk(id)"
                    >
                        <span class="gr_button__text">{{$t(VN_cityData[id])}}</span>
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import AllCityBody from './AllCityBody'
    // import { mapGetters } from 'vuex'
    export default {
        name: 'Area',
        mixins: [AllCityBody],
        data() {
            return {
                chkTitle: {
                    VN_S: 'vn_t_002', //南部
                    VN_C: 'vn_t_003', //中部
                    VN_N: 'vn_t_004' //北部
                },
                chk: {},
                titleChk: {
                    VN_S: false,
                    VN_C: false,
                    VN_N: false
                }
            }
        },
        props: {
            handleChk: Function
        },
        methods: {
            setChk(cityId) {
                if (this.VN_isOpenIssue[this.VN_cityArea[cityId]]) {
                    const issue = this.VN_allAreaIssue
                    const key = cityId + issue
                    const bool = !this.chk[key]
                    if (bool) {
                        this.cityList.forEach((list, rowId) => {
                            const obj = this.mapCityData(cityId)
                            this.cityList[rowId].push(obj)
                            this.$set(this.chk, key, bool)
                            this.$root.$emit('setRowMoney', rowId)
                        })
                    } else {
                        this.cityList.forEach((list, rowId) => {
                            const index = this.cityList[rowId].findIndex(obj => obj.key === key)
                            this.cityList[rowId].splice(index, 1)
                            this.$delete(this.chk, key)
                            this.$root.$emit('setRowMoney', rowId)
                        })
                    }
                }
            },
            setChkAll(bool) {
                this.chkAll = bool
                let cityList = []
                const filterList = this.VN_nowAreaCityAll
                    .filter(cityId =>
                        cityId &&
                        this.VN_isOpenIssue[this.VN_cityArea[cityId]] &&
                        (this.VN_Issue[this.VN_cityArea[cityId]] === this.VN_allAreaIssue)
                    )
                    .map(this.mapCityData)
                if (bool) {
                    const listKey = {}
                    ;[...this.cityList[0], ...filterList].forEach((obj) => {
                        if (!listKey[obj.key]) {
                            listKey[obj.key] = true
                            cityList.push(obj)
                        }
                    })
                    cityList.forEach((obj) => this.$set(this.chk, obj.key, bool))
                } else {
                    this.chk = {}
                }
                this.cityList.forEach((list, rowId) => {
                    this.$set(this.cityList, rowId, cityList)
                    this.$root.$emit('setRowMoney', rowId)
                })
            },
            setChkArea({area, bool}) {
                if (this.VN_isOpenIssue[area]) {
                    if (bool) {
                        const areaCity = this.VN_nowAreaCityAll
                            .filter(id => this.VN_cityArea[id] === area)
                            .map(this.mapCityData)
                        this.cityList.forEach((list, rowId) => {
                            this.$set(this.cityList, rowId, [...this.cityList[rowId], ...areaCity])
                            this.$root.$emit('setRowMoney', rowId)
                        })
                    } else {
                        const areaCity = this.cityList[0]
                            .filter(({cityId}) => this.VN_cityArea[cityId] !== area)
                        this.cityList.forEach((list, rowId) => {
                            this.$set(this.cityList, rowId, areaCity)
                            this.$root.$emit('setRowMoney', rowId)
                        })
                    }
                    const tempChk = {}
                    this.cityList[0].forEach(({key}) => (tempChk[key] = true))
                    this.titleChk[area] = bool
                    this.$set(this, 'chk', tempChk)
                }
            }
        }
    }
</script>
