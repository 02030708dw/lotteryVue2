<script>
import PageNation from '@C/PageNation'

import { mapGetters, mapActions } from 'vuex'

export default {
    name: 'PageNation',
    mixins: [PageNation],
    methods: {
        ...mapActions([
            _M.GET_NEWS_EVENTS_LIST,
            _M.SET_NEWS_EVENTS_PAGE_NATION_NUM
        ]),
        search(page) {
            if (page === this.page) {
                return
            }
            this[_M.GET_NEWS_EVENTS_LIST]({page})
        },
        setPageNationNum(page) {
            if (page === this.pageNationNum) {
                return
            }
            this[_M.SET_NEWS_EVENTS_PAGE_NATION_NUM](page)
        }
    },
    computed: {
        ...mapGetters([
            'newsEventsList',
            'newsEventsPageNationNum'
        ]),
        infoList() {
            return this.newsEventsList
        },
        pageNationNum() {
            return this.newsEventsPageNationNum
        }

    }
}
</script>