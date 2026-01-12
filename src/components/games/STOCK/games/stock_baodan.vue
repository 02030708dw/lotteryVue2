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
            </div><!-- gr_official__section -->
        </div><!-- gr_official -->
    </div>
</template>

<script>
    // 包膽
    import GameStock from '@C/games/GameStock'
    export default {
        name: 'STOCK_baodan',
        extends: GameStock,
        computed: {
            // 只能選幾個球
            BALL_SELECT_MAX() {
                return 1
            }
        },
        methods: {
            // 包膽只能選一個球
            selectBallLimit(x, y) {
                const ballAlreadySel = this.gameBallData[x].reduce((count, isSel) => {
                    count = isSel ? count + 1 : count
                    return count
                }, 0)

                // 未達上限,或是同顆球開啟關閉
                if (ballAlreadySel < this.BALL_SELECT_MAX || this.isBallActive(x, y)) {
                    this.selectBall(x, y)
                } else {
                    this.selectClearAllBall(x)
                    this.selectBall(x, y)
                }
            },
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

                // 2位數包含該號碼之所有排列組合，總數為2*10-1
                nums = 19
                return {nums, original: [original]}
            },
            /**
             * 產生拆完單的球號碼陣列
             * 包膽:只能選1個號碼，並產生2位數包含該號碼之所有排列組合，總數為2*9+1
             * 只選一個號碼, 產生N位數所有排列組合數,總數為 (9^(n-1)*n)+1
             * @param {Array} original 切割好的彩球標題陣列 ex: [[1]]
             * @return {Array} 所選號碼球的所有組合 ex: [[1,1],[1,0],[1,2],[1,3]...[0,1],[2,1]...]
             */
            getSplitOrder(original) {
                let ans = []
                const theNum = original[0][0]
                for (let i = 0; i < 10; i++) {
                    if (i !== theNum) {
                        ans.push([theNum, i], [i, theNum])
                    }
                }
                ans.push([theNum, theNum])
                return ans
            }
        }
    }
</script>
