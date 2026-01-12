<template>
    <div class="gr_container  bg_primary">
        <div class="gr_official">
            <checkBar
                v-if="is2Timer"
                :activeCheckboxes="activeCheckboxes"
                :selectCheckbox='selectCheckbox'
                :ableCheckbox="ableCheckbox"
            />
            <div class="gr_official__section  u_clearfix">
                <div class="gr_section__body">
                    <!-- ball -->
                    <ul class="gr_body__group">
                        <li class="gr_group__item" v-for="(ballText, ballIndex) in config.balls" :key="ballIndex">
                            <div class="gr_item__ball" :class="isBallActive(0, ballIndex)" @click="selectBallLimit(0, ballIndex)">
                                <span class="gr_ball__inner">{{ballText}}</span>
                            </div>
                        </li>
                    </ul>
                </div><!-- gr_section__body -->
                <div class="gr_section__controller">
                    <ul class="gr_controller__group">
                        <li class="gr_group__item" @click="selectClearAllBall(0)">
							<!-- {{$t("清")}} -->
                            <span class="gr_item__text">{{$t('common_031')}}</span>
                        </li>
                    </ul>
                </div><!-- gr_section__controller -->
            </div><!-- gr_official__section -->
        </div><!-- gr_official -->
    </div>
</template>

<script>
    // 包組
    import { mapGetters } from 'vuex'
    import stock_baodan from './stock_baodan'
    export default {
        name: 'STOCK_baozu',
        extends: stock_baodan,
        computed: {
            ...mapGetters([
                'menuIndex'
            ]),
            // 包組各玩法的選球上限(N)不一樣
            BALL_SELECT_MAX() {
                // 2D: 上限2
                // 3D: 上限3
                return this.menuIndex + 1
            }
        },
        methods: {
            // 計算注數與取得選擇球之投注值
            checkBallData() {
                const ballRow = this.gameBallData[0]
                let nums = 0
                let original = []

                const selCount = ballRow.reduce((count, isSel, selIdx) => {
                    if (isSel) {
                        count++
                        original.push(this.config.balls[selIdx])
                    }
                    return count
                }, 0)

                if (selCount < this.BALL_SELECT_MAX) {
                    return false
                }

                // selCount 顆球的所有排列數目: N!
                nums = this.factorial(selCount)
                return {nums, original: [original]}
            },
            /**
             * 產生拆完單的球號碼陣列
             * 包組:只能選N個號碼，並產生所有排列，總數為N!
             * @param {Array} original 切割好的彩球標題陣列 ex: [[1,2]]
             * @return {Array} 所選號碼球的所有排列 ex: [[1,2],[2,1]]
             */
            getSplitOrder(original) {
                let ans = []
                const rounds = this.BALL_SELECT_MAX

                /**
                 * 遞迴取值
                 * @param {array} subArr 子陣列
                 * @param {number} getNums 取幾個數
                 * @param {array} oneAns 本次的數字組合
                 */
                const R = (subArr, getNums, oneAns = []) => {
                    if (getNums === 1) {
                        let tempAns = oneAns.slice()
                        tempAns.push(subArr[0])
                        ans.push(tempAns)
                        return
                    }

                    // 切成幾個子陣列
                    for (let i = 0; i < getNums; i++) {
                        let tempAns = oneAns.slice()
                        tempAns.push(subArr[i])
                        const newSubArr = subArr.filter((v, idx) => idx !== i)
                        R(newSubArr, getNums - 1, tempAns)
                    }
                }
                R(original[0], rounds)
                return ans
            },
            /**
             * 取得隨機資訊(特別處理, ex: 3D頭獎組選包組)
             * @returns {Array} Obj.ballOrderArr 隨機單注資料(ex: [2,3])
             */
            randomNumSP() {
                const {balls} = this.config
                let ballOrderArr = []
                while (ballOrderArr.length < 3) {
                    const randomIdx = ~~(Math.random() * balls.length)
                    ballOrderArr.push(balls[randomIdx])
                    ballOrderArr = ballOrderArr.unique()
                }
                ballOrderArr = ballOrderArr.sort()

                return { ballOrderArr }
            }
        }
    }
</script>
