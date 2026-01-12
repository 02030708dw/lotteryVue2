<template>
    <div class="gr_container bg_secondary gr_page__nav">
       <!-- {{ $t("最新公告") }} -->
       {{$t('news_001')}}
    </div>
</template>

<script>

import { mapGetters, mapActions } from 'vuex'

export default {
    name: 'Navigation',
    mounted() {
        this.$root.$on('back', this.back)
    },
    beforeDestroy() {
        this.$root.$off('back', this.back)
    },
    methods: {
        ...mapActions([
            _M.SET_NEWS_EVENTS_DETAIL_INDEX,
            _M.SET_HEADER_NAV_IS_BACK
        ]),
        back() {
            this[_M.SET_HEADER_NAV_IS_BACK](false)
            this[_M.SET_NEWS_EVENTS_DETAIL_INDEX]('')
        }
    },
    computed: {
        ...mapGetters([
            'newsEventsDetailIndex'
        ]),
        isShowDetail() {
            return this.newsEventsDetailIndex !== ''
        }
    }
}
</script>