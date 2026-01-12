<script>
    //2D3D4D
    import GameDanshiVN from '@C/games/GameDanshiVN'
    export default {
        name: 'VN_PL2_PL3_980_INPUT',
        extends: GameDanshiVN,
        data() {
            // {
            //     title_key: 'vn_t_021',
            //     name: 'baozu'
            // },
            // const t2 = t1.filter((t, i) => i !== 4)
            return {
                col: {
                    3: 2,
                    4: 3
                }
                // methodTitle: [t2, t1, t1, t2],
            }
        },
        methods: {
            getFilterCount(str, key) {
                const arr = str.split('')
                return arr.reduce((a, b) => b === key ? a + 1 : a, 0)
            },
            mathResult() {
                return !this.showCodes ? '' : this.showCodes
                    .split(this.filtration)
                    .map(items => items.trim().split('&').sort((a, b) => a - b).join('&'))
                    .filter((items) => {
                        const item = items.split('&')
                        return (
                            // 找出有幾個 & 的判斷 pl2 1 個 pl3 2個
                            this.getFilterCount(items, '&') === this.col[this.VN_subMenuIndex] - 1 &&
                            // 去重
                            item.unique().length === this.col[this.VN_subMenuIndex] &&
                            // 需有值兩位數正整數
                            item.filter(num => num && this.checkNum.test(num) && num.length === 2).length === this.col[this.VN_subMenuIndex]
                        )
                    })
                    .unique()
            },
            makeCodes(original) {
                let codes = original.join(',')
                let showCodes = original.join(',')
                return { codes, showCodes }
            }
        }
    }
</script>
