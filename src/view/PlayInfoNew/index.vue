<template>
    <component :is="currentRWD" />
</template>

<script>
import '@CSS/View/_v_playinfo'
import RWD_980 from './980'
import RWD_320 from './320'
import RwdMixin from '@C/RwdMixin'
import PlayInfoNew from '@C/../store/modules/PlayInfoNew/'

import { mapActions, mapGetters } from 'vuex'

export default {
    name: 'PlayInfoNew',
    mixins: [RwdMixin],
    components: {
        RWD_980,
        RWD_320
    },
    beforeRouteEnter (to, from, next) {
        next((that) => {
            that[_M.GET_STRING_POOL]({
                // pageList: ['Desktop', 'tools/lottery', 'tools/howToPlay', 'tools/howToPlay/SSC'],
                pageList: ['all'],
                pageTitle: to.meta.title
            })
        })
    },
    props: {
        setStore: Function
    },
    watch: {
        lang() {
            this.getDefaultPage()
        }
    },
    created() {
        //lazy load store
        this.setStore({ PlayInfoNew })
        this.getDefaultPage()
        this.$root.$on('getH2PDeault', this.getDefaultPage)
    },
    destroyed() {
        this.$root.$off('getH2PDeault', this.getDefaultPage)
    },
    computed: {
        ...mapGetters([
            'lang',
            'lotteryMenu',
            'getMenuId'
        ])
    },
    methods: {
        ...mapActions([
            _M.GET_STRING_POOL,
            _M.SET_PLAYINFO_INDEX,
            _M.SET_MENU_ID
        ]),
        async getDefaultPage() {
            // 預設頁面設定(開啟當前國家彩的第一個彩種)
            const menuId = +this.$route.params.menuId || this.getMenuId
            menuId !== this.getMenuId && this[_M.SET_MENU_ID](menuId)

            // 如果有指定開啟彩種
            const lotName = this.$route.params.lotName || ''
            const defaultName = lotName.toUpperCase() || Object.keys(this.lotteryMenu[menuId].list)[0]
            this[_M.SET_PLAYINFO_INDEX]({
                functionType: defaultName.replace('HL_', ''),
                lang: this.lang
            })
        }
    }
}
</script>
