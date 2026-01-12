<template>
    <component :is="whichComponent" :gameMenuSub="gameMenuSub" />
</template>
<script>
    import { mapActions, mapGetters } from 'vuex'
    export default {
        name: 'currentGame',
        computed: {
            ...mapGetters([
                'fullTypeName',
                'gameConfig',
                'getGameOption'
            ]),
            whichComponent() {
                const gameOptionMap = {
                // 包膽
                    '4d_o_025': 'STOCK_baodan',
                    // 包組
                    'vn_t_021': 'STOCK_baozu'
                }

                const selKey = Object.entries(this.getGameOption).reduce((ans, [optionKey, optionVal]) => {
                    ans = (ans === '' && optionVal) ? optionKey : ans
                    return ans
                }, '')

                return gameOptionMap[selKey] || this.fullTypeName
            }
        },
        props: {
            gameMenuSub: Array
        },
        methods: {
            ...mapActions([
                _M.SET_GAME_CONFIG
            ])
        }
    }
</script>