<template>
    <div class="v-modal" @touchmove.prevent :style="{ zIndex }" />
</template>
<script>
    import { mapGetters } from 'vuex'
    export default {
        name: 'MaskScreen',
        created() {
            // const bodyNoScroll = document.body.classList
            // bodyNoScroll && bodyNoScroll.add('bodyNoScrollModal')
            // const gameMenuScroll = document.querySelector('.gr_game-menu__content')
            // if (gameMenuScroll) {
            //     gameMenuScroll.classList.add('bodyNoScroll')
            // }
        },
        destroyed() {
            // const bodyNoScroll = document.body.classList
            // bodyNoScroll && bodyNoScroll.remove('bodyNoScrollModal')
            // const gameMenuScroll = document.querySelector('.gr_game-menu__content')
            // if (gameMenuScroll) {
            //     gameMenuScroll.classList.remove('bodyNoScroll')
            // }
        },
        computed: {
            ...mapGetters([
                'maskQueue'
            ]),
            zIndex() {
                const last = this.maskQueue.length - 1
                return this.maskQueue[last] ? this.maskQueue[last].zIndex - 1 : 500
            }
        }
    }
</script>