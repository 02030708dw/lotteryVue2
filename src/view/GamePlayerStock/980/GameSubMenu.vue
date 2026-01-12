<template>
    <div class="gr_game-submenu  gr_container  bg_primary  u_fz--small">
        <div class="gr_game-submenu__field  u_clearfix" v-for="(item, index) in gameMenuSub" :key="index">
            <div class="gr_field__title">{{$t(keyObj[item.title])}}</div>
            <span
                class="gr_field__button"
                v-for="(items, subIndex) in item.childs"
                @click="changeGameSubMenu(items)"
                :class="isActive(items)"
                :key="subIndex"
            >
                <span class="gr_button__text">{{$t(items.title_key)}}</span>
            </span>
        </div>
    </div><!-- gr_game-submenu -->
</template>
<script>

import { mapActions, mapGetters } from 'vuex'
export default {
    name: 'GameSubMenu980',
    data() {
        return {
            keyObj: {
                '1D': 'thai_011',
                '2D': 'thai_010',
                '3D': 'thai_009'
            }
        }
    },
    computed: {
        ...mapGetters([
            'game',
            'gameOrder',
            'gameMenuSub',
            'gameLotteryId'
        ])
    },
    methods: {
        ...mapActions([
            _M.SET_GAME_ORDER_TIMES,
            _M.SET_KILL_PAIR
        ]),
        // 回傳格式化的 mode, parent, name
        formatType({ mode, parent, name }) {
            return `${mode}_${parent}_${name}`.replace(/\./g, '_')
        },
        changeGameSubMenu({ mode, parent, name }) {
            this[_M.SET_GAME_ORDER_TIMES]({times: 1})
            const formatType = this.formatType({ mode, parent, name })
            this.$root.$emit('bonusKL', false)
            this.$router.replace(`/GamePlayerStock/${this.gameLotteryId}?sub=${formatType}`)
        },
        isActive({ mode, parent, name }) {
            const formatType = this.formatType({ mode, parent, name })
            return this.gameOrder.typeName === formatType ? 'is_active' : ''
        }
    }
}
</script>
