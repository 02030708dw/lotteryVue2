<template>
    <div class="gr_game-vn-submenu  gr_container  bg_primary  u_fz--small">
        <div class="gr_game-vn-submenu_content">
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
        </div>
    </div><!-- gr_game-submenu -->
</template>
<script>

import Input from '../../980/GameSubMenu/Input'
export default {
    name: 'Input',
    extends: Input
}
</script>
