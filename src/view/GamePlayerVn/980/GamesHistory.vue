<template>
    <div
        class="gr_games-vn-header__history  gr_games-vn-header__number  gr_game-info__number is_active"
        @mousedown="handleDrag"
        @touchstart="handleDrag"
        @mouseup="handleDrop"
        @touchend="handleDrop"
    >
        <div class="gr_number__header">
            <div
                class="gr_header__close"
                @mousedown.stop="handleHistoryToggle"
                @touchend.stop="handleHistoryToggle"
            >
                <svg class="gr_close__icon" viewBox="0 0 22.04 22.04">
                    <line x1="21.69" y1="0.35" x2="0.35" y2="21.69" />
                    <line x1="21.69" y1="21.69" x2="0.35" y2="0.35" />
                </svg>
            </div>
        </div>
        <div class="gr_number__content">
            <dl class="gr_number__content--item" v-for="(number, ranking) in formatPrize">
                <dt class="gr_number__item--title">
                    <i class="gr_item__title--icon">{{formatPrize.length - (ranking + 1)}}</i>
                </dt>
                <dd class="gr_number__item--content">
                    <span class="gr_item__content--item" :data-number="no + 1" v-for="(i, no) in number">{{i || '-'}}</span>
                </dd>
            </dl>
        </div>
    </div>
</template>
<script>
import { formatVNBingoCode } from '@UTIL/games/VN'
import { mapGetters } from 'vuex'
export default {
    name: 'GamesHistory',
    props: {
        handleHistoryToggle: Function,
        handleDrag: Function,
        handleDrop: Function
    },
    computed: {
        ...mapGetters([
            'VN_lastNumber'
        ]),
        formatPrize() {
            return formatVNBingoCode(this.VN_lastNumber)
        }
    }
}
</script>
