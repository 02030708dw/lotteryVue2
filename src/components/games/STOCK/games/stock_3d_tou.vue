
<script>
    // 3d頭
    import GameStock from '@C/games/GameStock'
    export default {
        name: 'STOCK_3d_3d_3d_tou',
        extends: GameStock,
        methods: {
            /**
             * 產生拆完單的球號碼陣列
             * @param {Array} original 切割好的彩球標題陣列 ex: [[4,5],[3],[1]]
             * @return {Array} 所選號碼球的所有組合 ex: [[4,3,1], [5,3,1]]
             */
            getSplitOrder(original) {
                const [row1, row2, row3] = original
                const ans = []
                row1.forEach((numHun) => {
                    row2.forEach((numTen) => {
                        row3.forEach((num) => {
                            ans.push([numHun, numTen, num])
                        })
                    })
                })
                return ans
            }
        }
    }
</script>
