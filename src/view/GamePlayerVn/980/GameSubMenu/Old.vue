<template>
    <div class="gr_game-vn-submenu  gr_container  bg_primary  u_fz--small">
        <div class="u_clearfix">
            <span
                class="gr_field__button"
                v-for="(items, index) in VN_gameMenuSub"
                v-if="!items.isClose && !checkIsBlocked(items.title_key)"
                @click="changeGameSubMenu(index)"
                :class="isActive(index)"
                :key="items.title_key"
            >
                <span class="gr_button__text">{{$t(items.title_key)}}</span>
            </span>
            <GamePrompt />
            <div class="gr_game-controller__row">
                <GameButtons />
            </div>
        </div>
    </div><!-- gr_game-submenu -->
</template>
<script>

import { mapActions, mapGetters } from 'vuex'
import GameButtons from '../GameButtons'
import GamePrompt from '@C/games/VN/components/GamePrompt'
export default {
    name: 'GameSubMenuOld',
    components: {
        GameButtons,
        GamePrompt
    },
    methods: {
        ...mapActions([
            _M.SET_GAME_VN_DATA
        ]),
        changeGameSubMenu(index) {
            if (this.VN_subMenuIndex !== index) {
                let router = `/GamePlayerVN?t=${this.VN_gameType}&p=${this.VN_menuIndex}&m=${index}`
                this.VN_lotteryId && (router += `&l=${this.VN_lotteryId}`)
                this.$router.replace(router)
            }
        },
        isActive(index) {
            return { is_active: index === this.VN_subMenuIndex }
        },
        checkIsBlocked(title_key) {
            try {
                const blockeds = this.VN_gameConfig.blockedPrizeSetKey

                const subMethodKeys = {
                    '2D,3D,4D': '234d',
                    'PL2,PL3': 'pl23',
                    'vn_t_007': 'teshu'
                }

                //all
                if (this.VN_menuIndex === 0) {
                    return blockeds
                        //only blocked by all 3 area
                        .filter(key => key.split('.')[1] === subMethodKeys[title_key])
                        .length >= 3
                } else {
                    return blockeds
                        //eliminate other VN_x
                        .filter(key => key.split('.')[0] === this.VN_gameMenu[this.VN_menuIndex].key)
                        //check if sub-method is in blocked list
                        .some(key => key.split('.')[1] === subMethodKeys[title_key])
                }
            } catch (err) {
                // console.log('err: ', err.message);
                return false
            }
        }
    },
    computed: {
        ...mapGetters([
            'VN_menuIndex',
            'VN_subMenuIndex',
            'VN_gameMenu',
            'VN_gameMenuSub',
            'VN_gameConfig',
            'VN_lotteryId',
            'VN_gameType',
            'isMobile'
        ])
    }
}
</script>
