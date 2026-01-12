<template>
    <div class="gr_history__info" ref="content" v-loading.body="getHistoryBallVNInfoLoading" :element-loading-text="$t('home_020')">
        <div class="gr_info__list">
            <div class="gr_list__content">
                <template v-if="(historyBallVNList || []).length > 0">
                    <div
                        class="gr_list__number  gr_game-info__number  is_active"
                        v-for="(item, index) in historyBallVNList"
                        v-if="!isOfficial || (isOfficial && VN_cityData[item.lottery])" 
                        :key="index"
                    >
                        <div class="gr_number__header u_f--bold">
                            {{VN_cityData[item.lottery] ? $t(VN_cityData[item.lottery]) : $t('common_001', { 0: item.issue })}}
                        </div>
                        <div class="gr_number__content">
                            <dl class="gr_number__content--item" v-for="(number, ranking) in formatPrize(item.code)" :key="ranking">
                                <dt class="gr_number__item--title">
                                    <i class="gr_item__title--icon">{{formatPrize(item.code).length - (ranking + 1)}}</i>
                                </dt>
                                <dd class="gr_number__item--content">
                                    <span class="gr_item__content--item" :data-number="no + 1" v-for="(i, no) in number" :key="no">{{i || '-'}}</span>
                                </dd>
                            </dl>
                        </div>
                    </div>
                </template>
                <div v-else>
                    <!-- 当前查询没有任何数据 -->
                    {{$t('trend_054')}}
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { formatVNBingoCode } from '@UTIL/games/VN'
import { mapGetters, mapActions } from 'vuex'
import { returnState } from '@UTIL'
import { Observable } from 'rxjs/Observable'

export default {
    name: 'HistoryInfoList',
    data() {
        return {
            isLoading: false,
            isOfficial: false
        }
    },
    subscriptions() {
        const scrollBody = Observable.fromEvent(document.body, 'scroll') // 320
        const scroll = Observable.fromEvent(window, 'scroll') // mobile, 980
        return {
            loadMore$: Observable
                .merge(scrollBody)
                .pluck('target')
                .filter(({ scrollTop, offsetHeight, scrollHeight }) => (
                    !this.isLoading &&
                    scrollTop + offsetHeight) === scrollHeight &&
                     // 當天第一期為 1
                     this.lastHistoryBall &&
                     +this.lastHistoryBall.split('-')[1] !== 1
                )
                .throttleTime(1000)
                .do(this.searchHistory),
            loadMorePC$: Observable
                .merge(scroll)
                .pluck('currentTarget')
                .filter(({innerHeight, scrollY, pageYOffset}) => {
                    // 載入中不打API, IE 不支援scrollY
                    return !this.isLoading &&
                     ((innerHeight + (scrollY || pageYOffset)) >= this.$parent.$refs.container.offsetHeight) &&
                     // 當天第一期為 1
                     this.lastHistoryBall &&
                     +this.lastHistoryBall.split('-')[1] !== 1
                })
                .throttleTime(1000)
                .do(this.searchHistory)
        }
    },
    methods: {
        ...mapActions([
            _M.GET_HISTORYBALLVN_LIST
        ]),
        formatPrize(prize) {
            return formatVNBingoCode(prize)
        },
        searchHistory() {
            this.isLoading = true
            this[_M.GET_HISTORYBALLVN_LIST]({
                menuCode: this.menuCode,
                next: this.lastHistoryBall
            })
        }
    },
    computed: {
        ...mapGetters([
            'getHistoryBallVNInfoLoading',
            'getHistoryBallVNList',
            'VN_cityData',
            'getHistoryBallVNData',
            'getHistoryBallVNTempList',
            'getHistoryPagination'
        ]),
        menuCode() {
            return this.$route.query.menuCode
        },
        historyBallVNList() {
            const official = ['VN_S', 'VN_C', 'VN_N']
            const data = Object.values(returnState(this.getHistoryBallVNTempList))
            if (data.length === 0) return []
            let result = []
            const lotName = Object.keys(data[0])[0]
            data.forEach((oneGroup) => {
                Object.entries(oneGroup[lotName]).forEach(([lottery, cardsData]) => {
                    // 判斷是否為官彩
                    this.isOfficial = official.findIndex((checkWord) => {
                        return this.menuCode.includes(checkWord)
                    }) > -1
                    if (this.isOfficial) {
                        cardsData[0].lottery = lottery
                    }
                    result = result.concat(cardsData)
                })
            })
            this.isLoading = false
            return result
        },
        lastHistoryBall() {
            const list = this.historyBallVNList
            return list.length ? list[list.length - 1].issue : null
        }
    }
}
</script>
