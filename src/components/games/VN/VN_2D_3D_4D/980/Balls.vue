<template>
    <div class="gr_container  gr_game-danshi">
        <!-- '请选择一个城市' -->
        <div v-show="RWDMode === 3 && !VN_isLocal" class="gr_grid-vn__header">
            <div class="gr_header__text">{{$t('popup_131')}}</div>
        </div>
        <CityTableSingle v-if="VN_menuIndex && !VN_lotteryId" />
        <GameSubmenu v-if="RWDMode === 1" />
        <GameSubmenu320 v-else />
        <div class="gr_game-vn--balls gr_vnball">
            <div class="gr_game-vn--balls__section  u_clearfix" v-for="(item, index) in rows[this.VN_subMenuIndex]" :key="index">
                <!-- 位數標題(ex:萬位) -->
                <div class="gr_section__title" >{{$t(item)}}</div>
                <div class="gr_section__body">
                    <!-- ball -->
                    <ul class="gr_body__group">
                        <li class="gr_group__item" v-for="(ballText, ballIndex) in 10" :key="ballIndex">
                            <div class="gr_item__ball" :class="isBallActive(index, ballIndex)" @click="selectBall(index, ballIndex)">
                                <span class="gr_ball__inner">{{ballIndex}}</span><!-- only translate string -->
                            </div>
                        </li>
                    </ul>
                </div><!-- gr_section__body -->
                <div class="gr_section__controller">
                    <ul class="gr_controller__group">
                        <li class="gr_group__item" @click="selectAllBall(index)" :class="optionsClass(index, 0)">
                            <!-- {{$t("全")}} -->
                            <span class="gr_item__text">{{$t('common_019')}}</span>
                        </li>
                        <li class="gr_group__item" @click="selectBigBall(index)" :class="optionsClass(index, 1)">
                            <!-- {{$t("大")}} -->
                            <span class="gr_item__text">{{$t('common_020')}}</span>
                        </li>
                        <li class="gr_group__item" @click="selectSmallBall(index)" :class="optionsClass(index, 2)">
                            <!-- {{$t("小")}} -->
                            <span class="gr_item__text">{{$t('common_021')}}</span>
                        </li>
                        <li class="gr_group__item" @click="selectOddBall(index)" :class="optionsClass(index, 3)">
                            <!-- {{$t("奇")}} -->
                            <span class="gr_item__text">{{$t('common_022')}}</span>
                        </li>
                        <li class="gr_group__item" @click="selectEvenBall(index)" :class="optionsClass(index, 4)">
                            <!-- {{$t("偶")}} -->
                            <span class="gr_item__text">{{$t('common_023')}}</span>
                        </li>
                        <li class="gr_group__item" @click="selectClearAllBall(index)">
                            <!-- {{$t("清")}} -->
                            <span class="gr_item__text">{{$t('common_031')}}</span>
                        </li>
                    </ul>
                </div><!-- gr_section__controller -->
            </div><!-- gr_game-vn--balls__section -->
        </div><!-- gr_game-vn--balls -->
    </div>
</template>

<script>
    //2D3D4D
    import GameBallsVN from '@C/games/GameBallsVN'
    import { returnState, warnMessageBox } from '@UTIL'
    export default {
        name: 'VN_2D_3D_4D_980_Balls',
        extends: GameBallsVN,
        data() {
            const t1 = [
                {
                    title_key: 'vn_t_018',
                    name: 'tou'
                },
                {
                    title_key: 'vn_t_019',
                    name: 'wei'
                },
                {
                    title_key: 'vn_t_020',
                    name: 'touwei'
                },
                {
                    title_key: 'vn_t_021',
                    name: 'baozu'
                },
                {
                    title_key: 'vn_t_022',
                    name: 'baozu7'
                }
            ]
            const t2 = t1.filter((t, i) => i !== 4)
            return {
                col: {
                    0: 2,
                    1: 3,
                    2: 4
                },
                rows: [
                    ['ssc_o_004', 'ssc_o_005'],
                    ['ssc_o_003', 'ssc_o_004', 'ssc_o_005'],
                    ['ssc_o_002', 'ssc_o_003', 'ssc_o_004', 'ssc_o_005']
                ],
                methodTitle: [t2, t1, t1, t2]

            }
        },
        methods: {
            combine(arr) {
                const len = arr.length
                // 当数组大于等于2个的时候
                if (len >= 2) {
                    // 第一个数组的长度
                    const arr0 = arr[0]
                    const arr1 = arr[1]

                    const len1 = arr0.length
                    // 第二个数组的长度
                    const len2 = arr1.length
                    //  申明一个新数组,做数据暂存
                    let items = []
                    // 申明新数组的索引
                    let index = 0
                    // 2层嵌套循环,将组合放到新数组中
                    for (let i = 0; i < len1; i++) {
                        for (let j = 0; j < len2; j++) {
                            if (arr0[i] instanceof Array) {
                                items[index] = arr0[i].concat(arr1[j]).join()
                            } else {
                                items[index] = `${arr0[i]}${arr1[j]}`
                            }
                            index++
                        }
                    }
                    // 将新组合的数组并到原数组中
                    let newArr = []
                    for (let i = 2; i < arr.length; i++) {
                        newArr[i - 1] = arr[i]
                    }
                    newArr[0] = items
                    // 执行回调
                    return this.combine(newArr)
                } else {
                    return arr[0]
                }
            },
            selectBall(i, j) {
                const balls = this.gameBallData[i].map((bool, j2) => j === j2 ? !bool : bool)
                this.selectBalls(i, balls)
            },
            selectBalls(i, balls) {
                this.ballControlData[i] = []
                const temp = returnState(this.gameBallData)
                balls.forEach((bool, j) => (temp[i][j] = bool))
                const transData = temp.map(arr2 => arr2.map((bool, i) => bool && i).filter(bool => bool !== false))
                console.log(transData)
                const data = this.combine(transData)
                if (data.length > this.VN_maxbet) {
                    return this.$msg(warnMessageBox({
                        // '请勿超过5000组号码'
                        message: 'popup_140'
                    }))
                }
                balls.forEach((bool, j) => this.$set(this.gameBallData[i], j, bool))
                if (!data.length) {
                    this[_M.GAME_ORDER_VN_SUBMIT]({ type: 7, nums: 0, codes: '', showCodes: '' })
                    return
                }
                const showCodes = data.join(',')
                console.log(showCodes)
                const scode_key = showCodes
                const nums = data.length
                this[_M.GAME_ORDER_VN_SUBMIT]({ type: 7, nums, codes: showCodes, showCodes, scode_key })
            },
            selectAllBall(index) {
                const balls = [...Array(10)].map(() => true)
                this.selectBalls(index, balls)
                this.ballControlData[index][0] = true
            },
            selectBigBall(index) {
                const balls = [...Array(10)].map((i, j) => j > 4)
                this.selectBalls(index, balls)
                this.ballControlData[index][1] = true
            },
            selectSmallBall(index) {
                const balls = [...Array(10)].map((i, j) => j < 5)
                this.selectBalls(index, balls)
                this.ballControlData[index][2] = true
            },
            selectOddBall(index) {
                const balls = [...Array(10)].map((i, j) => !!(j % 2))
                this.selectBalls(index, balls)
                this.ballControlData[index][3] = true
            },
            selectEvenBall(index) {
                const balls = [...Array(10)].map((i, j) => !(j % 2))
                this.selectBalls(index, balls)
                this.ballControlData[index][4] = true
            },
            selectClearAllBall(index) {
                const balls = [...Array(10)].map(() => false)
                this.selectBalls(index, balls)
            },
            isBallActive(x, y) {
                return this.gameBallData[x][y] ? 'is_active' : ''
            },
            optionsClass(index, option) {
                return this.ballControlData[index][option] ? 'is_active' : ''
            }
        },
        computed: {

        }
    }
</script>
