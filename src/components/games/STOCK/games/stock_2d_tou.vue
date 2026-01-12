
<script>
    // 2d頭
    import GameStock from '@C/games/GameStock'
    export default {
        name: 'STOCK_2d_2d_2d_tou',
        extends: GameStock,
        methods: {
            /**
             * 產生拆完單的球號碼陣列
             * @param {Array} original 切割好的彩球標題陣列 ex: [[4,5],[3]]
             * @return {Array} 所選號碼球的所有組合 ex: [[4,3], [5,3]]
             */
            getSplitOrder(original) {
                const [row1, row2] = original
                const ans = []
                row1.forEach((numTen) => {
                    row2.forEach((num) => {
                        ans.push([numTen, num])
                    })
                })
                return ans
            }
        }
    }
</script>
