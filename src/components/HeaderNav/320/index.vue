<template>
        <div class="gr_header__outer">
            <div class="gr_header  u_clearfix">
                <HeaderNavbar />
                <HeaderLogo v-show="isShowLogo" />
                <HeaderLanguage v-if="hamburgar" />
            </div>
        </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex'
    import HeaderNavbar_980 from '../980/'
    import HeaderLogo from './HeaderLogo'
    import HeaderNavbar from './HeaderNavbar'
    import HeaderLanguage from './HeaderLanguage'

    export default {
        name: 'HeaderNavbar_320',
        mixins: [HeaderNavbar_980],
        components: {
            HeaderLogo,
            HeaderNavbar,
            HeaderLanguage
        },
        methods: {
            ...mapActions([
                _M.SET_POP_ACTIVE
            ]),
            myFavoritesOpen() {
                this.isPopActive && (this.$refs.MyFavorites.isEdit = false)
                this[_M.SET_POP_ACTIVE]({myFavorites: !this.isPopActive})
                var bodyNoScroll = document.body.classList
                if (this.isPopActive) {
                    bodyNoScroll.add('bodyNoScroll')
                } else {
                    bodyNoScroll.remove('bodyNoScroll')
                }
                this.$parent.$emit('favorites_active', this.isPopActive)
            }
        },
        computed: {
            ...mapGetters([
                'hamburgar',
                'getPopActive',
                'isOneLotGame',
                'isBlackTheme'
            ]),
            isPopActive() {
                return this.getPopActive.myFavorites
            },
            isShowLogo() {
                const isGamePage = window.location.href.includes('GamePlay')
                return !this.isBlackTheme || !isGamePage
            }
            // isIn() {
            //     return this.$route.path === '/MyFavorites'
            // }
        }
    }
</script>