
<template>
    <div class="gr_fast-game-order"><!--  v-if="poultry" -->
        <div
            class="gr_fast-game-order__header"
            :class="toggleMenuClass"
            @click="toggleMenu"
        >
            <!-- {{$t("快速选号")}} -->
            {{$t('mark6_t_022')}}
            <div class="gr_header__arrow" />
        </div>
        <div class="gr_fast-game-order__content">
            <div
                class="gr_fast-game-order__item"
                v-for="(data, i) in fastGameOrderListData"
                :class="[lang === 'cn' ? 'c_ball--medium c_ball--link' : 'c_rectangle--xsmall c_rectangle--link', {is_active: fastOrderActiveArr[i]}]"
                @click="handleClick(data, i)"
                :key="fastGameOrderTitle[i]"
            >
                <div :class="lang === 'cn' ? 'c_ball__item' : 'c_rectangle__item'">{{$t(fastGameOrderTitle[i])}}</div>
            </div>
        </div>
    </div>
</template>
<script>
    // 快速选号
    import * as util from '@UTIL/games/MARK6_SIN'
    // import { warnMessageBox } from '@UTIL'
    import { mapGetters } from 'vuex'
    export default {
        name: 'FastGameOrder',
        created() {
            this.$root.$on('handleReset', this.handleFastOrderReset)
        },
        beforeDestroy() {
            this.$root.$off('handleReset', this.handleFastOrderReset)
        },
        data() {
            return {
                ...util,
                isShowMenu: true
            }
        },
        props: {
            gameData: Array,
            money: [String, Number],
            RWDMode: Number,
            ballActiveArr: Array,
            fastOrderActiveArr: Array,
            jsDynamicConfig: Object,
            creditGameLtProject: Object,
            setCreditGameLtProject: Function,
            handleFastGameOrder: Function,
            filterMoney: Function,
            handleFastOrderReset: Function
        },
        methods: {
            handleClick(data, i) {
                let gameArr = []
                data.forEach((val) => {
                    const index = +val - 1
                    const {
                        title,
                        title_key,
                        methodId,
                        name,
                        upperName,
                        upperName_key,
                        sortId,
                        isBlocked
                    } = this.gameData[index]
                    if (isBlocked) {
                        // this.$msg(warnMessageBox({
                        //     type: null,
                        //     message: this.$t('此玩法本期已停售。'),
                        //     type: 'warning',
                        //     content: ''
                        // }))
                        return
                    }
                    const hprize = this.$parent.prize({methodId, title})
                    const subTitle = upperName
                    const key = subTitle + title
                    const ltProject = this.creditGameLtProject[key]
                    if ((this.fastOrderActiveArr[i] && ltProject) || (!this.fastOrderActiveArr[i] && !ltProject)) {
                        let money
                        if (this.RWDMode === 1) {
                            money = this.filterMoney(+this.money)
                            money = money < this.onePrice ? +this.onePrice : money
                        } else {
                            money = +this.money
                        }
                        ltProject
                            ? gameArr.push({type: 2, key})
                            : gameArr.push({
                                key,
                                type: 1,
                                codes: title,
                                title,
                                title_key,
                                upperName_key,
                                subTitle,
                                hprize,
                                keepPoint: this.kp,
                                money,
                                methodId,
                                upperName,
                                typeName: name,
                                sortId,
                                isUpdated: this.diffPrizeData[methodId + title]
                            })
                        //觸發用渲染用
                        this.$set(this.ballActiveArr, index, !this.ballActiveArr[index])
                    }
                })
                this.setCreditGameLtProject(gameArr)
                if (this.ballActiveArr.find(bool => bool)) {
                    this.$set(this.fastOrderActiveArr, i, !this.fastOrderActiveArr[i])
                    !this.fastOrderActiveArr[i] && this.handleFastGameOrder()
                } else {
                    this.handleFastOrderReset()
                }
            },
            toggleMenu() {
                this.isShowMenu = !this.isShowMenu
            }
        },
        computed: {
            ...mapGetters([
                'diffPrizeData',
                'lang',
                'kp',
                'onePrice'
            ]),
            animalData() {
                return this.jsDynamicConfig[this.$route.params.lottery].data.animal.data
            },
            animals() {
                let obj = {}
                Object.keys(this.animalData)
                    .forEach((key) => {
                        const animal = this.animalData[key]
                        obj[animal] ? obj[animal].push(key) : obj[animal] = [key]
                    })
                return obj
            },
            poultry() {
                let arr = []
                this.poultryName.forEach(name => (arr = arr.concat(this.animals[name])))
                return arr
            },
            beast() {
                let arr = []
                this.beastName.forEach(name => (arr = arr.concat(this.animals[name])))
                return arr
            },
            toggleMenuClass() {
                return this.isShowMenu ? 'is_active' : ''
            },
            fastGameOrderListData() {
                return [
                    this.big, this.small, this.odd, this.even, this.bigOdd, this.bigEven, this.smallOdd, this.smallEven, this.sumOdd, this.sumEven, this.sumBig, this.sumSmall,
                    this.animals['鼠'], this.animals['牛'], this.animals['虎'], this.animals['兔'],
                    this.animals['龙'], this.animals['蛇'], this.animals['马'], this.animals['羊'],
                    this.animals['猴'], this.animals['鸡'], this.animals['狗'], this.animals['猪'],
                    this.redBig, this.redSmall, this.redOdd, this.redEven, this.blueBig, this.blueSmall, this.blueOdd, this.blueEven, this.greenBig, this.greenSmall, this.greenOdd, this.greenEven,
                    this.red, this.blue, this.green, this.poultry, this.beast
                ]
            }
        }
    }
</script>
