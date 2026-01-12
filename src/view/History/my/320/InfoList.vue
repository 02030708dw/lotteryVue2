<template>
    <div class="gr_history__info">
        <div class="gr_info__content">
            <div class="gr_stock_history" v-if="(getHBList || []).length > 0">
                <dl>
                    <dt>{{$t('popup_111')}}</dt>
                    <dt>{{$t('thai_012')}}</dt>
                    <dt>{{$t('thai_013')}}</dt>
                </dl>
                <dl v-for="(item, index) in getHBList" :key="index">
                    <dd>{{item.issue}}</dd>
                    <dd>{{historyCode(item.code)[0]}}</dd>
                    <dd>{{historyCode(item.code)[1]}}</dd>
                </dl>
            </div>
            <div v-else>
                {{$t('trend_054')}}
            </div>
        </div>
    </div>
</template>
<script>
import InfoList from '../980/InfoList'
import { mapActions } from 'vuex'

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
            _M.SET_HEADER_NAV_IS_BACK,
            _M.SET_HISTORY
        ]),
        back() {
            // 返回上一頁
            this[_M.SET_HISTORY]({mode: 'del'})
            this[_M.SET_HEADER_NAV_IS_BACK](false)
        }
    }
}
</script>
