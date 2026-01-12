
<script>
    //2D
    import GameLA from '@C/games/GameLA'
    export default {
        name: 'LA_2D_980_OLD',
        extends: GameLA,
        data() {
            return {
                // 头 尾 头奖组选
                // checkboxes: ['thai_001', 'thai_002', 'thai_003'],
                // 搜尋、包组
                isSearchBar: true,
                // 包胆
                isBold: true
            }
        },

        methods: {

        },
        computed: {
            oldTab() {
                return [...Array(10)].map(e => e)
            },
            oldItem() {
                return [...Array(100)].map((e, i) => `${i}`.padStart(2, '0'))
            }
        }
    }
</script>
