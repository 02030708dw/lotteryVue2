
<script>
    // 1d頭
    import GameStock from '@C/games/GameStock'
    export default {
        name: 'STOCK_1d_1d_1d_tou',
        extends: GameStock,
        methods: {
            /**
             * 產生拆完單的球號碼陣列
             * @param {Array} original 切割好的彩球標題陣列 ex: [[4,5]]
             * @return {Array} 所選號碼球的所有組合 ex: [4,5]
             */
            getSplitOrder(original) {
                const numArr = original[0]
                return numArr.map(n => [+n])
            }
        }
    }
</script>
