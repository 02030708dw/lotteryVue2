<template>
    <div class="gr_history__info" ref="content" v-loading.body="getHBLoading" :element-loading-text="$t('home_020')">
        <div class="gr_info__list">
            <div class="gr_list__content">
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
                    <!-- 当前查询没有任何数据 -->
                    {{$t('trend_054')}}
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
    name: 'HistoryInfoList',
    computed: {
        ...mapGetters([
            'getHBList',
            'getHBLoading'
        ])
    },
    methods: {
        historyCode(codeNum) {
            return codeNum.split(',')
        }
    }
}
</script>
