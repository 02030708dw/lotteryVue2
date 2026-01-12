<template>
    <div class="gr_container bg_primary gr_page__controls">
        <div class="bg_secondary" style="padding: 7px; 10px;" v-if="RWDMode === 3">
            <!-- {{ $t("贩售时间") }} -->
            <span>{{$t('timetable_003')}}</span>
        </div>
        <el-select
            :class="className"
            :className="className"
            v-model='lotteryMenuVal'
            :listObject='lotteryMenuArr'
            :placeholder="$t('timetable_004')"
            showLabel='titleKey'
            showValue="titleValue"
        >
            <el-option
                v-for="item in lotteryMenuArr"
                :label="item.titleKey"
                :key='item.titleKey'
                :value='item.titleValue'
            ></el-option>
        </el-select>
        <el-select
            :class='className'
            :className='className'
            clearable
            v-model='lotteryListVal'
            :listGroup='lotteryData'
            :placeholder="$t('timetable_005')"
        >
            <el-option-group
                v-for='(menu, index) in lotteryData'
                :key='menu.title_key'
                :label="$t(menu.title_key)"
                :value='menu.lottery'
            >
                <el-option
                    v-for='itemChild in menu.childs'
                    :key='itemChild.lottery'
                    :label='$t(itemChild.title_key)'
                    :value='itemChild.lottery'
                />
            </el-option-group>
        </el-select>
    </div>
</template>
<style lang="scss">
.el-select-dropdown {
    position: fixed !important;
    top: 0;
}
</style>
<script>
import Controls from '@C/Controls'
import { mapGetters } from 'vuex'
import { returnState } from '@UTIL'

export default {
    name: 'Controls',
    mixins: [Controls],
    data() {
        return {
            className: 'small long',
            lotteryMenuVal: '',
            lotteryListVal: ''
        }
    },
    watch: {
        lotteryMenuVal(v) {
            this.lotteryListVal = ''
            this.$root.$emit('lotMenu', v)
        },
        lotteryListVal(v) {
            this.$root.$emit('lotList', v)
        }
    },
    methods: {
    },
    computed: {
        ...mapGetters([
            'RWDMode',
            'lotteryMenu',
            'lotteryList',
            'lotteryListLocalVN'
        ]),
        lotteryMenuArr() {
            // '@': 需帶入非數字字串所以加'@'
            let dateArray = []
            Object.keys(this.lotteryMenu).forEach(e => {
                dateArray.push({
                    titleKey: [1, 2].includes(+this.lotteryMenu[e].menuType)
                        ? `${this.$t('home_044')}-${this.$t(this.lotteryMenu[e].title_key)}`
                        : this.$t(this.lotteryMenu[e].title_key),
                    titleValue: '@' + this.lotteryMenu[e].menuType
                })
            })
            return dateArray
        },
        lotteryData() {
            let dateArray = {}
            Object.keys(this.filLotteryList).forEach(e => {
                if (this.lotteryMenuVal === '@' + this.filLotteryList[e].menuId) {
                    dateArray[e] = {
                        title_key: this.filLotteryList[e].title_key,
                        lottery: '@' + this.filLotteryList[e].menuId,
                        functionType: e,
                        childs: this.filLotteryList[e].childs
                    }
                }
            })
            this.$root.$emit('dateArray', dateArray)
            return dateArray
        },
        filLotteryList() {
            let arrAll = {}
            let arrTh = {}
            let arrVn = {}
            Object.keys(this.lotteryList).forEach(e => {
                ;(e.indexOf('VN_') < 0 && e.indexOf('TH') < 0) && (arrAll[e] = this.lotteryList[e])
                ;(e.indexOf('TH') === 0) && (arrTh[e] = this.lotteryList[e].childs[0])
                ;['VN_C', 'VN_N', 'VN_S'].includes(e) && (arrVn[e] = this.lotteryList[e].childs[0])
            })
            // 給越南全區、北、中、南彩新的id、key
            let arrVnState = returnState(arrVn)
            let VN_A = {
                title_key: 'vn_t_001',
                lottery: 0
            }
            if (arrVnState.VN_S) {
                arrVnState.VN_S.lottery = 1
                arrVnState.VN_S.title_key = 'vn_t_002'
            }
            if (arrVnState.VN_C) {
                arrVnState.VN_C.lottery = 2
                arrVnState.VN_C.title_key = 'vn_t_003'
            }
            if (arrVnState.VN_N) {
                arrVnState.VN_N.lottery = 3
                arrVnState.VN_N.title_key = 'vn_t_004'
            }
            const vnChilds = {
                ...this.lotteryListLocalVN
            }
            // 全區
            if (arrVnState.VN_S || arrVnState.VN_C || arrVnState.VN_N) {
                vnChilds.VN_A = VN_A
            }
            // 重組越南彩、泰國彩
            const addArr = {
                ...arrAll,
                VN_ALL: {
                    menuId: 3,
                    title: '越南彩',
                    title_key: 'lottery_menu_type_3',
                    functionType: 'VN_ALL',
                    childs: {
                        ...vnChilds,
                        ...arrVnState
                    }
                },
                TH_ALL: {
                    menuId: 6,
                    title: '泰国彩',
                    title_key: 'lottery_menu_type_6',
                    functionType: 'TH_ALL',
                    childs: {
                        ...arrTh
                    }
                }
            }
            return addArr
        }
    }
}
</script>
