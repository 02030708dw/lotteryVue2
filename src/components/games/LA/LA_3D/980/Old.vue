
<style lang="scss" scoped>
.gr_game-la-classic {
    .gr_old-container {
        border-top: 0px;
    }
}
</style>
<script>
    //3D
    import GameLA from '@C/games/GameLA'
    import { mapGetters } from 'vuex'
    export default {
        name: 'LA_3D_980_OLD',
        extends: GameLA,
        data() {
            return {
                // 头 前三 后三 头奖组选
                // checkboxes: ['thai_001', 'thai_004', 'thai_005', 'thai_003'],
                // 搜尋、包组
                isSearchBar: true,
                // 包胆
                isBold: false,
                allItem: [...Array(1000)].map((e, i) => `${i}`.padStart(3, '0'))
            }
        },

        methods: {

        },
        computed: {
            ...mapGetters([
                'LA_menuIndex',
                'LA_gameSubMenu'
            ]),
            oldTab() {
                return [...Array(10)].map((e, i) => `${i * 100}`.padStart(3, '0'))
            },
            oldItem() {
                return [...Array(100)].map((e, i) => `${i + (this.tabIndex * 100)}`.padStart(3, '0'))
            },
            activeData() {
                let obj = {}
                this.allItem.forEach((num) => {
                    obj[num] = this.LA_methodIsSelect.find(id => this.LA_gameSelectData[`${id}_${num}`])
                })
                return obj
            },
            tabCountData() {
                let obj = {}
                Object.entries(this.activeData).forEach(([num, bool]) => {
                    if (bool) {
                        const key = ~~(num / 100)
                        if (obj[key]) {
                            obj[key] += 1
                        } else {
                            obj[key] = 1
                        }
                    }
                })
                return obj
            }
        }
    }
</script>
