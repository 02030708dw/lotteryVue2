<template>
    <div class="gr_history__info">
        <div class="gr_info__content">
            <template v-if="(historyBallVNList || []).length > 0">
                <div class="gr_list__number  gr_game-info__number  is_active" v-for="(item, index) in historyBallVNList">
                    <div class="gr_number__header u_f--bold">
                        {{VN_cityData[item.lottery] ? $t(VN_cityData[item.lottery]) : $t('common_001', { 0: item.issue })}}
                    </div>
                    <div class="gr_number__content">
                        <dl class="gr_number__content--item" v-for="(number, ranking) in formatPrize(item.code)">
                            <dt class="gr_number__item--title">
                                <i class="gr_item__title--icon">{{formatPrize(item.code).length - (ranking+1)}}</i>
                            </dt>
                            <dd class="gr_number__item--content">
                                <span class="gr_item__content--item" :data-number="no+1" v-for="(i, no) in number">{{i || '-'}}</span>
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
</template>
<script>
import InfoList from '../980/InfoList'
import { mapActions, mapGetters } from 'vuex'

export default {
    name: 'HistoryInfoList',
    mixins: [InfoList],
    beforeMount() {
        this.$root.$on('back', this.back)
    },
    beforeDestroy() {
        this.$root.$off('back', this.back)
    },
    methods: {
        ...mapActions([
            _M.SET_HISTORYBALLVN_DATA,
            _M.CLEAR_HISTORYBALLVN_LIST,
            _M.SET_HEADER_NAV_IS_BACK,
            _M.SET_HISTORY
        ]),
        back() {
            // 返回上一頁
            // const path = this.getRouteHistory[this.getRouteHistory.length - 1]
            // this.$router.replace(path)
            this[_M.SET_HISTORY]({mode: 'del'})
            this[_M.SET_HEADER_NAV_IS_BACK](false)
        }
    },
    computed: {
        ...mapGetters([
            'getRouteHistory'
        ])
    }
}
</script>
