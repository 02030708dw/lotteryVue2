<template>
    <i class="gr_game-vn-info-icon  i_question" @click.stop="handleIsActive()" />
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
    name: 'GameInfo',
    methods: {
        ...mapActions([
            _M.SET_POP_ACTIVE
        ]),
        handleIsActive() {
            this[_M.SET_POP_ACTIVE]({GameInfo: !this.isPopActive})
            const bodyNoScroll = document.body.classList
            bodyNoScroll.add('bodyNoScroll')
        }
    },
    computed: {
        ...mapGetters([
            'getPopActive'
        ]),
        isPopActive() {
            return this.getPopActive.GameInfo
        }
    }
}
</script>