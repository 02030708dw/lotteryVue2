<template>
    <div class="gr_game-vn-submenu2">
        <div class="u_clearfix" v-if="methodType[VN_gameType].includes(VN_subMenuIndex)">
            <div class="gr_game-danshi__select-bar">
                <el-checkbox
                    v-for="({title_key, name}, i) in $parent.methodTitle[VN_menuIndex]"
                    :key="title_key"
                    :checked="!!showList.find(obj => obj.name === name)"
                    :value="!!showList.find(obj => obj.name === name)"
                    @input="setShowList({title_key, name})"
                    v-if="VN_subMenuIndex !== 2 || VN_subMenuIndex === 2 && [1, 3].includes(i)"
                >
                    {{$t(title_key)}}
                </el-checkbox>
            </div>
            <div class="gr_quick"  v-if="VN_gameType === 'Quick'">
                <!-- 快选 -->
                <div class="gr_quick__text">{{$t('common_167')}}:</div>
                <div class="gr_quick__btn">
                    <div
                        class="gr_field__button"
                        :class="{is_active: $parent.fastSelect[key]}"
                        v-for="({key, title_key}) in fastMap"
                        @click="handleFast(key)"
                        v-if="VN_subMenuIndex === 0 || key ==='Repeat'"
                        :key="key"
                    >
                        <span class="gr_button__text">{{$t(title_key)}}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="gr_under--line" v-show="methodType[VN_gameType].includes(VN_subMenuIndex)" />
        <div
            class="gr_section__bar"
            v-if="VN_gameType === 'Quick'"
        >
            <div class="c_input--medium" v-show="false">
                <!-- 搜寻号码 -->
                <i class="i_funnel" />
                <input
                    class="c_input__inner"
                    type="tel"
                    v-model="$parent.filterNum"
                    :placeholder="$t('thai_036')"
                />
                <i
                    class="el-icon-circle-close"
                    v-if="$parent.filterNum"
                    @click="cleanrSearch"
                />
            </div>
            <div class="c_input--big" v-if="[0, 1].includes(VN_subMenuIndex)" @click="$parent.isMuti = !$parent.isMuti">
                <span class="gr_bagGroup__button" :class="{is_active: $parent.isMuti}">
                    <!-- 包组 -->
                    <span class="gr_button__text">{{$t('thai_008')}}</span>
                </span>
            </div>
            <div class="gr_bold" v-if="!VN_subMenuIndex">
                <!-- 包胆 -->
                <div class="gr_bold__text">{{$t('thai_007')}}:</div>
                <div class="gr_bold__btn">
                    <div
                        class="gr_field__button"
                        :class="{is_active: $parent.fastSelect[index]}"
                        v-for="(item, index) in 10"
                        @click="selectBold(index)"
                        :key="index"
                    >
                        <span class="gr_button__text">{{index}}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import { mapGetters, mapActions } from 'vuex'
    import areaNumData1 from '@S/modules/GamePlayerVN/config/2d3d4d'
    import areaNumData2 from '@S/modules/GamePlayerVN/config/pl2pl3'
    export default {
        name: 'checkbar',
        data() {
            return {
                // 固定只有一条row
                // rowIndex: 0,
                keyMap: {
                    tou: 0,
                    wei: 1,
                    touwei: 2,
                    baozu: 3,
                    baozu7: 4
                },
                areaNumData: {
                    ...areaNumData1,
                    ...areaNumData2
                },
                fastMap: [
                    { key: 'Big', title_key: 'common_020' },
                    { key: 'Small', title_key: 'common_021' },
                    { key: 'Odd', title_key: 'common_024' },
                    { key: 'Even', title_key: 'common_025' },
                    { key: 'Repeat', title_key: 'vn_t_092' }
                ],
                methodType: {
                    Quick: [0, 1],
                    Balls: [0, 1, 2]
                }
            }
        },
        computed: {
            ...mapGetters([
                'VN_menuIndex',
                'VN_gameType',
                'VN_lotteryId',
                'VN_subMenuIndex',
                'VN_gameOrder',
                'VN_currentMethod',
                'VN_pos',
                'VN_isLocal',
                'RWDMode',
                'VN_maxbet'
            ]),
            showList() {
                return this.VN_gameOrder.showList || []
            }
        },
        methods: {
            ...mapActions([
                _M.GAME_ORDER_VN_SUBMIT
            ]),
            cleanrSearch() {
                this.$parent.filterNum = ''
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
            setShowList({title_key, name}) {
                const length = this.showList.length
                let showList = this.showList.filter(n => n.name !== name)
                showList.length === length && showList.push(this.getShowList({title_key, name}))
                this[_M.GAME_ORDER_VN_SUBMIT]({
                    type: 7,
                    showList
                })
            },
            handleSelect(key, codes) {
                const codeStr = codes.join(',')
                const bool = !!this.$parent.fastSelect[key]
                if (bool) {
                    delete this.$parent.fastSelect[key]
                } else {
                    this.$parent.fastSelect[key] = codeStr
                }
                this.$parent.fastSelect = { ...this.$parent.fastSelect }
                this.$parent.calcOrder(codes, !bool)
            },
            // 2d 才有的快选 包胆
            selectBold(num) {
                const arr = [...Array(10)].map((v, i) => i)
                let codes = []
                arr.forEach(i => codes.push(`${num}${i}`))
                arr.forEach(i => codes.push(`${i}${num}`))
                this.handleSelect(num, codes)
            },
            // 50 - 99
            selectBig() {
                return [...Array(50)].map((v, i) => i + 50)
            },
            // 00 - 49
            selectSmall() {
                return [...Array(50)].map((v, i) => (i + '').padStart(2, '0'))
            },
            // 單
            selectOdd() {
                return [...Array(50)].map((v, i) => ((i * 2 + 1) + '').padStart(2, '0'))
            },
            // 雙
            selectEven() {
                return [...Array(50)].map((v, i) => (i * 2 + '').padStart(2, '0'))
            },
            // 重號
            selectRepeat() {
                return this.VN_subMenuIndex !== 1
                    ? [...Array(100)].map((e, i) => `${i}`.padStart(2, '0')).filter(v => v[0] === v[1])
                    : [...Array(1000)].map((e, i) => `${i}`.padStart(3, '0')).filter(v => v[1] === v[2])
            },
            handleFast(key) {
                const codes = this[`select${key}`]()
                this.handleSelect(key, codes)
            }
        }
    }
</script>