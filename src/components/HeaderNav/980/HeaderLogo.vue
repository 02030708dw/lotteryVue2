<template>
    <div
        :class="logo ? 'gr_customlogo' : 'gr_logo'"
        :style="logo ? `background-image: url(${logo});background-size: 90%` : null"
        @click="handleHamburgar(false);removeBodyScroll()"
    >
        <router-link v-if="!isOneLotGame && !isW88" class="gr_logo__link" to="/" exact />
    </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'

export default {
    name: 'HeaderLogo',
    data() {
        let logo = ''
        if (DIRECT_LOGO && DIRECT_LOGO !== '{{$DIRECT_LOGO}}') {
            logo = DIRECT_LOGO
        }
        return {
            logo
        }
    },
    methods: {
        ...mapActions([
            _M.SET_HAMBURGAR,
            _M.SET_HEADER_NAV_IS_BACK
        ]),
        handleHamburgar(boolean) {
            this[_M.SET_HAMBURGAR](boolean)
            this[_M.SET_HEADER_NAV_IS_BACK](boolean)
        },
        removeBodyScroll() {
            document.body.classList.remove('bodyNoScroll')
        }
    },
    computed: {
        ...mapGetters([
            'isOneLotGame',
            'isW88'
        ])
    }
}
</script>
