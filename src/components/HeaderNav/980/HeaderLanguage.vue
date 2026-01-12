<template>
    <div class="gr_language  c_dropdown" @click.stop="menuOpen" :class="{ 'is_active  c_dropdown--hover': isPopActive }">
        <span class="gr_language__text" @click.stop="menuOpen">{{currentLang}}</span>
        <div class="gr_language-arrow" />
        <div class="c_dropdown-arrow" />
        <div class="c_dropdown-box">
            <div class="c_dropdown-box__inner">
                <div class="c_dropdown-box__content">
                    <a
                        v-for="(obj, _lang) in getLangObj"
                        :key="_lang"
                        v-if="obj.open"
                        :class="['c_dropdown-box__link', { is_active: _lang === lang }]"
                        href="javascript:void(0);"
                        @click="setLang(_lang)"
                        >{{obj.l}}</a>
                </div>
            </div><!-- dropdown-box__inner -->
        </div><!-- dropdown-box -->
    </div><!-- gr_language -->
</template>
<script>
import { mapGetters, mapActions } from 'vuex'

export default {
    name: 'HeaderLanguage',
    computed: {
        ...mapGetters([
            'lang',
            'getPopActive',
            'getLangObj',
            'isDev',
            'isTest'
        ]),
        currentLang () {
            return this.getLangObj[this.lang].s
        },
        isPopActive() {
            return this.getPopActive.lang
        }
    },
    methods: {
        ...mapActions([
            _M.SET_LANG,
            _M.SET_POP_ACTIVE
        ]),
        setLang(lang) {
            this[_M.SET_LANG]({
                lang,
                $route: this.$route
            })
            this.closeAllPopMenu()
        },
        menuOpen() {
            this[_M.SET_POP_ACTIVE]({lang: !this.isPopActive})
        },
        menuClose() {
            this[_M.SET_POP_ACTIVE]()
        },
        closeAllPopMenu(delay = 100) {
            setTimeout(() => {
                this[_M.SET_POP_ACTIVE]()
            }, delay)
        }
    }
}
</script>
