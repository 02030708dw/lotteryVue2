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
                gameBallData: [],
                ballControlData: []
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
                return [code]
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
                if (this.VN_subMenuIndex > 2) {
                    obj.showList = [this.getShowList({
                        title_key: 'vn_t_021',
                        name: 'baozu'
                    })]
                } else {
                    const num = this.VN_subMenuIndex + 2
                    this.gameBallData = [...Array(num)].map(() => [...Array(10)].map(() => false))
                    this.ballControlData = [...Array(num)].map(() => [])
                }
                this.activeData = {}
                // 自主彩直接加入城市
                if (this.VN_isLocal) {
                    obj.cityId = this.VN_isLocal
                }
                this[_M.GAME_ORDER_VN_SUBMIT](obj)
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
            oldItem() {
                return [...Array(100)].map((e, i) => `${i}`.padStart(2, '0'))
            },
            fastSelectEntries() {
                return Object.entries(this.fastSelect)
            }
        }
    }
</script>
