
<script>
    // 3d-头奖组选
    import GameStock from '@C/games/GameStock'
    export default {
        name: 'STOCK_3d_3d_3d_toujiangzuxuan',
        extends: GameStock,
        data() {
            return {
                // 多少個號碼組成一單
                NUM_PER_ORDER: 3
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

                if (selCount < this.NUM_PER_ORDER) {
                    return false
                }

                // 從 selCount 顆球裏頭, 選 NUM_PER_ORDER 個組合(不用排列)
                nums = this.combine(selCount, this.NUM_PER_ORDER)
                return {nums, original: [original]}
            },
            /**
             * 產生拆完單的球號碼陣列
             * @param {Array} original 切割好的彩球標題陣列 ex: [4,5,6,7]
             * @return {Array} 所選號碼球的所有排不重複組合, C(x,3) ex: [[4,5,6],[4,5,7],[4,6,7],[5,6,7]]
             */
            getSplitOrder(original) {
                let ans = []
                /**
                 * 遞迴取值
                 * @param {array} subArr 子陣列
                 * @param {number} getNums 取幾個數
                 * @param {array} oneAns 本次的數字組合
                 */
                const R = (subArr, getNums, oneAns = []) => {
                    if (getNums === 0) {
                        ans.push(oneAns)
                        return
                    }
                    // 切成幾個子陣列
                    const rounds = subArr.length - getNums
                    for (let i = 0; i <= rounds; i++) {
                        let temp = oneAns.slice()
                        temp.push(subArr[i])
                        R(subArr.slice(i + 1), getNums - 1, temp)
                    }
                }
                R(original[0], this.NUM_PER_ORDER)
                return ans
            },
            /**
             * 取得隨機一注球號: 0-9隨機取出不重複3顆球,並排序
             * @returns {Array} Obj.ballOrderArr 排序的隨機單注資料(ex: [1,3,9])
             */
            randomNum() {
                const {balls} = this.config
                let ballOrderArr = []
                while (ballOrderArr.length < 3) {
                    const randomIdx = ~~(Math.random() * balls.length)
                    ballOrderArr.push(balls[randomIdx])
                    ballOrderArr = ballOrderArr.unique()
                }
                ballOrderArr = ballOrderArr.sort()

                return { ballOrderArr }
            },
            /**
             * 320: 取得隨機之後的選球結果
             * @param {Array} ballOrder 注單選球結果
             * @return {Array} ex: [Array(10), Array(10), Array(10)]
             */
            get320BallPreview(ballOrder) {
                return [this.config.balls.map((ballVal) => ballOrder.includes(ballVal))]
            }
        }
    }
</script>
