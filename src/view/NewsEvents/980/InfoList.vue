<template>
    <div ref="content" class="gr_news-events">
        <div v-if="isShowList">
            <div
                :class="['gr_news-events__list', { is_active: isShowDetail === index }]"
                v-for="(item, index) in tempList"
                :key="index"
            >
                <div class="gr_list__title" @click="showDetail(item.notice_id, index)">
                    <span class="gr_title__date">[{{item.release_date.split(' ')[0]}}]</span>
                    <i class="gr_title__icon" :class="isShowDetail === index ? 'i_letter--open' : 'i_letter--close'" />
                    <span class="gr_title__text">{{item.title}}</span>
                    <i class="gr_title__arrow  el-icon-arrow-right" />
                </div>
                <NewEventsDetail class="gr_list__body" v-if="isShowDetail === index" />
            </div>
            <div class="u_p--t10 u_p--b10 u_t--center" v-show="newsEventsIsLoading"><i class="el-icon-loading" /></div>
        </div>
        <div class="gr_news-events__empty" v-else>
            <div>
                <!-- {{ $t("当前没有任何公告") }} -->
                {{$t('news_005')}}
            </div>
        </div>
    </div>
</template>
<script>
import PageNation from './PageNation'
import { mapGetters, mapActions } from 'vuex'
import NewEventsDetail from './NewEventsDetail'

export default {
    name: 'InfoList',
    mixins: [PageNation],
    components: {
        NewEventsDetail,
        PageNation
    },
    data() {
        return {
            groupWrap: '',
            contentHeight: '',
            listHeight: 39,
            pageLimit: 30,
            isShowDetail: null
        }
    },
    watch: {
        lang () {
            this[_M.GET_NEWS_EVENTS_LIST]()
        }
    },
    async mounted () {
        const groupWrap = await document.getElementsByClassName('gr_news-events')[0]
        const contentHeight = await document.getElementsByClassName('gr_news-message-box__content')[0]
        this.groupWrap = groupWrap
        this.contentHeight = contentHeight
        this.addListener()
    },
    async destroyed () {
        this.removeListener()
    },
    methods: {
        ...mapActions([
            _M.SET_NEWS_EVENTS_DETAIL_INDEX,
            _M.GET_NEWS_EVENTS_LIST
        ]),
        addListener() {
            this.addScrollListener()
        },
        removeListener() {
            this.removeScrollListener()
        },
        addScrollListener() {
            this.groupWrap.addEventListener('scroll', this.handleScroll)
        },
        removeScrollListener() {
            this.groupWrap.removeEventListener('scroll', this.handleScroll)
        },
        handleScroll() {
            const listHeight = this.listHeight
            const pageLimit = this.pageLimit
            const warpList = Math.ceil(this.contentHeight.offsetHeight / listHeight)
            const lastHeight = (pageLimit - warpList) * listHeight
            let listBody = document.getElementsByClassName('gr_list__body')[0]
            if (this.groupWrap.scrollTop > lastHeight + (listBody ? listBody.offsetHeight : 0) + listHeight * pageLimit * (this.page - 1) && this.totalPage >= this.page + 1) {
                this.search(this.page + 1)
            }
        },
        showDetail(id, index) {
            this.isShowDetail !== index ? this.isShowDetail = index : this.isShowDetail = null
            this[_M.SET_NEWS_EVENTS_DETAIL_INDEX](id)
        }
    },
    computed: {
        ...mapGetters([
            'newsEventsList',
            'newsEventsTemp',
            'newsEventsIsLoading',
            'lang'
        ]),
        isShowList: {
            set() {},
            get() {
                // return true
                return this.newsEventsList.data && this.newsEventsList.pagination.totalNumber > 0
            }
        },
        isShowPageNation() {
            return this.newsEventsList.data && this.newsEventsList.pagination.totalPage > 1
        },
        tempList() {
            let arr = []
            for (let i = 1; this.page >= i; i++) {
                arr = [...arr, ...this.newsEventsTemp[i].data]
            }
            return arr
        }
    }
}
</script>