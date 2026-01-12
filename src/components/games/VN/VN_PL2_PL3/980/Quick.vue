<script>
    //2D3D4D
    import GameQuickVN from '@C/games/GameQuickVN'
    export default {
        name: 'VN_PL2_PL3_980_Quick',
        extends: GameQuickVN,
        data() {
            // {
            //     title_key: 'vn_t_021',
            //     name: 'baozu'
            // },
            // const t2 = t1.filter((t, i) => i !== 4)
            return {
                // methodTitle: [t2, t1, t1, t2],
            }
        },
        methods: {
            selectBall(code) {
                const bool = !this.activeData[code]
                if (bool) {
                    const data = Object.entries(this.activeData).filter(([, value]) => value)
                    if (data.length === this.VN_subMenuIndex) {
                        return
                    }
                }
                this.calcOrder(code, bool)
            },
            calcOrder(code, bool) {
                this.$set(this.activeData, code, bool)
                const data = Object.entries(this.activeData).filter(([, value]) => value).map(([key]) => key)
                const showCodes = data.join('&')
                const scode_key = showCodes
                const nums = +(data.length === this.VN_subMenuIndex)
                this[_M.GAME_ORDER_VN_SUBMIT]({ type: 7, nums, codes: showCodes, showCodes, scode_key })
            }
        },
        computed: {

        }
    }
</script>
