<template>
    <div class="gr_container  bg_primary">
        <GameSubmenu />
        <div class="gr_game-la-classic" :class="{is_disabled: LA_methodIsSelect.length === 0}">
            <div class="gr_old-tab" v-if="+LA_menuIndex === 2">
                <div
                    class="gr_old-tab--item"
                    :class="{is_active: index === tabIndex}"
                    v-for="(item, index) in oldTab"
                    @click="tabIndex = index"
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
                >
                    <span>{{item}}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex'
    import { warnMessageBox, formatNumber } from '@UTIL'
    import GameSubmenu from '@C/games/LA/components/GameSubmenu'
    export default {
        name: 'GameLA',
        data() {
            return {
                filter: '',
                tabIndex: 0,
                isMuti: false,
                isBold: false,
                fastSelect: {

                }
            }
        },
        beforeMount() {
            this.$root.$on('reset', this.emptyFastSelect)
            if (this.LA_gameSubMenu.length) {
                let LA_gameSubMenu = {}
                const data = this.LA_gameSubMenu[0]
                LA_gameSubMenu[data.methodId] = true
                this[_M.SET_LA_TEMP_DATA]({
                    temp: 'LA_methodSelect',
                    data: LA_gameSubMenu
                })
            }
        },
        beforeDestroy() {
            this.$root.$off('reset', this.emptyFastSelect)
        },
        components: {
            GameSubmenu
        },
        computed: {
            ...mapGetters([
                'LA_stake',
                'LA_money',
                'LA_menuIndex',
                'LA_jsPrizePoint',
                'LA_gameSubMenu',
                'LA_methodSelect', // method 是否選取的資料
                'LA_methodIsSelect', // 塞選好的 method 列表
                'LA_gameSelectData', // 選球資料
                'LA_gameSelectDataArr'
            ]),
            numLen() {
                return this.LA_menuIndex + 1
            },
            activeData() {
                let obj = {}
                this.oldItem.forEach((num) => {
                    obj[num] = this.LA_methodIsSelect.find(id => this.LA_gameSelectData[`${id}_${num}`])
                })
                return obj
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
            fastSelectEntries() {
                return Object.entries(this.fastSelect)
            }
        },
        methods: {
            ...mapActions([
                _M.SET_LA_TEMP_DATA
            ]),
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
                const codes = this.getCodes(code)
                this.handleOrder(codes, bool)
            },
            // 2d 才有的快選 包膽
            selectBold(num) {
                const bool = !!this.fastSelect[num]
                this.fastSelect = { ...this.fastSelect }
                const arr = [...Array(10)].map((v, i) => i)
                let codes = []
                arr.forEach(i => codes.push(`${num}${i}`))
                arr.forEach(i => codes.push(`${i}${num}`))
                if (bool) {
                    delete this.fastSelect[num]
                } else {
                    this.fastSelect[num] = codes.join(',')
                }
                this.handleOrder(codes, !bool)
            },
            handleOrder(codes, bool) {
                if (this.LA_stake) {
                    const data = {...this.LA_gameSelectData}
                    this.LA_methodIsSelect.forEach((methodId) => {
                        if (bool) {
                            codes.forEach((code) => {
                                data[`${methodId}_${code}`] = {
                                    methodId,
                                    codes: code,
                                    money: Math.max(+this.LA_money, this.LA_stake),
                                    hprize: this.hprize(methodId)
                                }
                            })
                        } else {
                            codes.forEach((code) => {
                                delete data[`${methodId}_${code}`]
                            })
                        }
                    })
                    // if (Object.keys(data).length > 60) {
                    //     return this.$msg(warnMessageBox({
                    //     // '最多只能增加60组号码'
                    //         message: this.$t('popup_106', {'0': 60})
                    //     }))
                    // }
                    this[_M.SET_LA_TEMP_DATA]({
                        temp: 'LA_gameSelectData',
                        data
                    })
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
                }
            },
            hprize(id) {
                if (this.LA_jsPrizePoint) {
                    const { hprize, autoOdds } = this.LA_jsPrizePoint[id][0]
                    return (hprize + autoOdds).strip()
                } else {
                    return ''
                }
            },
            emptyFastSelect() {
                this.fastSelect = {}
            }
        }
    }
</script>
