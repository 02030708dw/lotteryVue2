<style lang="scss" scoped>
.gr_game-th-classic {
    .gr_old-container {
        border: 0px;
    }
}
</style>
<script>
    //1D
    import GameTh from '@C/games/GameTh'
    export default {
        name: 'TH_1D_980_OLD',
        extends: GameTh,
        data() {
            return {
                // 头 尾
                // checkboxes: ['thai_001', 'thai_002'],
                // 搜尋、包组
                isSearchBar: false,
                // 包胆
                isBold: false
            }
        },
        methods: {

        },
        computed: {
            oldTab() {
                return [...Array(10)].map((e, i) => i)
            },
            oldItem() {
                return [...Array(10)].map((e, i) => i)
            }
        }
    }
</script>
