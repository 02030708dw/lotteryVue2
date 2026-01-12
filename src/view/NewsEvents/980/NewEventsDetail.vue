<template>
    <div>
        <i class="el-icon-loading" v-show="newsEventsIsLoading"/>
        <div v-html="news.content" />
    </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'

export default {
    name: 'NewEventsDetail',
    methods: {
        ...mapActions([
            _M.GET_NEWS_EVENT_DETAIL,
            _M.RESET_NEWS_EVENTS_DETAIL_DATA
        ])
    },
    watch: {
        lang () {
            this[_M.GET_NEWS_EVENT_DETAIL]({ noticeId: this.newsEventsDetailIndex })
        }
    },
    computed: {
        ...mapGetters([
            'newsEventsData',
            'newsEventsDetailIndex',
            'newsEventsIsLoading',
            'lang'
        ]),
        news() {
            return this.newsEventsData.data ||
            {
                content: ''
            }
        }
    },
    created() {
        this[_M.RESET_NEWS_EVENTS_DETAIL_DATA]()
        this[_M.GET_NEWS_EVENT_DETAIL]({ noticeId: this.newsEventsDetailIndex })
    }
}
</script>