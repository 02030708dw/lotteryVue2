<template>
    <div class="gr_container  gr_game-danshi">
        <!-- '请选择一个城市' -->
        <div v-show="RWDMode === 3 && !VN_isLocal" class="gr_grid-vn__header">
            <div class="gr_header__text">{{$t('popup_131')}}</div>
        </div>
        <CityTableSingle v-if="VN_menuIndex && !VN_lotteryId" />
        <GameSubmenu v-if="RWDMode === 1" />
        <GameSubmenu320 v-else />
        <div class="gr_game-vn-classic">
            <div class="gr_old-tab" v-if="this.VN_subMenuIndex === 1">
                <div
                    class="gr_old-tab--item"
                    :class="{is_active: index === tabIndex}"
                    v-for="(item, index) in oldTab"
                    @click="tabIndex = index"
                    :key="'a'+index"
                >
                    {{item}}
                    <span v-show="tabCountData[index]">{{tabCountData[index]}}</span>
                </div>
            </div>
            <div class="gr_old-container">
                <div
                    class="gr_old-num--item"
                    v-for="item in balls"
                    :class="{is_active: activeData[item]}"
                    @click="selectBall(item)"
                    :key="'b' + item"
                >
                    <span>{{item}}</span>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.gr_game-danshi {
    padding: 9px 10px 0px 10px;
}
@media screen and (max-width: 979px) {
    .gr_game-danshi {
        padding: 0px 10px;
        .gr_game-danshi__inner {
            padding: 0px;
            .gr_game-danshi__button-area {
                padding: 10px 0;
            }
        }
    }
}
</style>

<script>
    // import GameBalls from '@C/games/GameBalls'
    import { mapActions, mapGetters } from 'vuex'
    import { warnMessageBox } from '@UTIL'
    import CityTableSingle from './VN/components/CityTableSingle'
    import GameSubmenu from './VN/components/GameSubmenu'
    import GameSubmenu320 from './VN/components/GameSubmenu320'
    import areaNumData1 from '@S/modules/GamePlayerVN/config/2d3d4d'
    import areaNumData2 from '@S/modules/GamePlayerVN/config/pl2pl3'
export default {
        name: 'Danshi',
        components: {
            CityTableSingle,
            GameSubmenu,
            GameSubmenu320
        },
        beforeMount() {
            this.emptyTextArea({mode: 1})
            this.$root.$on('beforeCheck', this.beforeCheck)
            this.$root.$on('reset', this.emptyTextArea)
        },
        beforeDestroy() {
            this.$root.$off('beforeCheck', this.beforeCheck)
            this.$root.$off('reset', this.emptyTextArea)
        },
        data() {
            return {
                type: 'input',
                // 是否到達最大注數警告
                bigCodeWarning: false,
                filter: '',
                tabIndex: 0,
                isMuti: false,
                areaNumData: {
                    ...areaNumData1,
                    ...areaNumData2
                },
                keyMap: {
                    tou: 0,
                    wei: 1,
                    touwei: 2,
                    baozu: 3,
                    baozu7: 4
                },
                activeData: {},
                fastSelect: {

                }
            }
        },
        subscriptions() {
            return {
                route$: this.$watchAsObservable('$route')
                    .do(this.emptyTextArea)
            }
        },
        methods: {
            ...mapActions([
                _M.GAME_ORDER_VN_SUBMIT
            ]),
            beforeCheck(fn) {
                fn(this.emptyTextArea)
            },
            allRotated(list) {
                const rotatedTo = (i) => {
                    var rotated = []
                    rotated.push(list[i])
                    return rotated.concat(list.slice(0, i))
                        .concat(list.slice(i + 1, list.length))
                }
                var all = []
                for (var i = 0; i < list.length; i++) {
                    all.push(rotatedTo(i))
                }
                return all
            },

            perm(list) {
                var pls = []
                if (!list.length) {
                    pls.push([])
                } else {
                    this.allRotated(list).forEach((lt) => {
                        this.perm(lt.slice(1, lt.length)).forEach((tailPl) => {
                            var pl = []
                            pl.push(lt[0])
                            pls.push(pl.concat(tailPl))
                        })
                    })
                }
                return pls
            },
            getCodes(code) {
                // 点击包组（Selected），假设点击数字035，系统自动勾选035所有排列组合的数字
                if (this.isMuti) {
                    return this.perm(code.split('')).map((codes) => codes.join(''))
                }
                return [code]
            },
            selectBall(code) {
                const bool = !this.activeData[code]
                const codes = this.getCodes(code).unique()
                this.calcOrder(codes, bool)
            },
            calcOrder(codes, bool) {
                codes.forEach(code => this.$set(this.activeData, code, bool))
                const data = Object.entries(this.activeData).filter(([, value]) => value).map(([key]) => key)
                const showCodes = data.join(',')
                const length = data.length
                if (!length) {
                    this[_M.GAME_ORDER_VN_SUBMIT]({ type: 7, nums: 0, codes: '', showCodes: '' })
                    return
                }
                const scode_key = showCodes
                const nums = length
                this[_M.GAME_ORDER_VN_SUBMIT]({ type: 7, nums, codes: showCodes, showCodes, scode_key })
                // 快選需要消除 active 的處理
                if (!bool) {
                    let temp = []
                    let obj = {}
                    // 把會被刪除的key 暫存在 temp
                    this.fastSelectEntries.forEach(([key, value]) => {
                        codes.forEach(code => value.includes(code) && temp.push(key))
                    })
                    temp = temp.unique()
                    // 保留不被刪除的key 在 obj
                    this.fastSelectEntries.forEach(([key, value]) => {
                        !temp.includes(key) && (obj[key] = value)
                    })
                    //重新賦予 fastSelect 的資料
                    this.fastSelect = {...obj}
                }
            },
            getShowList({title_key, name}) {
                const title = this.VN_currentMethod.toLowerCase()
                const nums = this.areaNumData[title][this.keyMap[name]][this.VN_pos]
                return {
                    type: 'input',
                    title_key,
                    name,
                    title,
                    nums
                }
            },
            emptyTextArea(options = {}) {
                let obj = {
                    type: 7,
                    showList: [],
                    ltMoneyAmout: 0,
                    cityId: '',
                    key: '',
                    nums: 0,
                    codes: '',
                    showCodes: '',
                    scode_key: '',
                    showDanshiCodes: '',
                    issue: '',
                    ...options
                }
                // pl2 pl3 只有包組
                if (this.VN_subMenuIndex > 1) {
                    obj.showList = [this.getShowList({
                        title_key: 'vn_t_021',
                        name: 'baozu'
                    })]
                }
                this.activeData = {}
                // 自主彩直接加入城市
                if (this.VN_isLocal) {
                    obj.cityId = this.VN_isLocal
                }
                this[_M.GAME_ORDER_VN_SUBMIT](obj)
                this.fastSelect = {}
            }
        },
        computed: {
            ...mapGetters([
                'VN_menuIndex',
                'VN_lotteryId',
                'VN_subMenuIndex',
                'VN_gameOrder',
                'VN_currentMethod',
                'VN_pos',
                'VN_isLocal',
                'RWDMode',
                'VN_maxbet'
            ]),
            showCodes() {
                return this.VN_gameOrder.showDanshiCodes || ''
            },
            codes() {
                return this.VN_gameOrder.codes || ''
            },
            showList() {
                return this.VN_gameOrder.showList || []
            },
            balls() {
                return this.filterNum === ''
                    ? this.oldItem
                    : this.oldItem.filter(num => num.includes(this.filterNum))
            },
            filterNum: {
                get() {
                    return this.filter
                },
                set(value) {
                    const temp = (value + '').replace(/[^0-9]/g, '')
                    const temp2 = this.filter
                    const notNum = /[^0-9]/.test(value)
                    const isOver = value > 999 || value.length > 3
                    this.filter = value
                    this.$nextTick(() => {
                        if (notNum) {
                            this.filter = temp
                        } else if (isOver) {
                            this.filter = temp2
                        }
                    })
                }
            },
            oldTab() {
                return [...Array(10)].map((e, i) => `${i * 100}`.padStart(3, '0'))
            },
            oldItem() {
                return this.VN_subMenuIndex !== 1
                    ? [...Array(100)].map((e, i) => `${i}`.padStart(2, '0'))
                    : [...Array(100)].map((e, i) => `${i + (this.tabIndex * 100)}`.padStart(3, '0'))
            },
            tabCountData() {
                let obj = {}
                Object.entries(this.activeData).forEach(([num, bool]) => {
                    if (bool) {
                        const key = ~~(num / 100)
                        if (obj[key]) {
                            obj[key] += 1
                        } else {
                            obj[key] = 1
                        }
                    }
                })
                return obj
            },
            fastSelectEntries() {
                return Object.entries(this.fastSelect)
            }
        }
    }
</script>
