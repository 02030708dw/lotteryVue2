<script>
    //2D3D4D
    import GameDanshiVN from '@C/games/GameDanshiVN'
    export default {
        name: 'LA_1D_980_INPUT',
        extends: GameDanshiVN,
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
                methodTitle: [t2, t1, t1, t2]
            }
        },
        methods: {
            mathResult() {
                return !this.showCodes ? '' : this.showCodes
                    .split(this.filtration)
                    .map(items => items.trim())
                    .filter(items => items && items.length === this.col[this.VN_subMenuIndex] && this.checkNum.test(items))
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
