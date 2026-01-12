<template>
    <div class="gr_container gr_page__content bg_primary" v-loading.body="winLoseLoading" :element-loading-text="$t('home_020')">
        <div class="table_default table_stripe">
            <table>
                <thead>
                    <tr>
                        <th>
                            <!-- {{ $t("投注日期") }} : {{ $t("结算日期") }} -->
                            {{isPeriodType === 'created_at' ? $t('bettingrc_037') : $t('bettingrc_082')}}
                        </th>
                        <th>
                            <!-- {{ $t("投注总额") }} -->
                            {{$t('bettingrc_073')}}
                        </th>
                        <th>
                            <!-- {{ $t("返点总额") }} -->
                            {{$t('bettingrc_074')}}
                        </th>
                        <th>
                            <!-- {{ $t("中奖总额") }} -->
                            {{$t('bettingrc_075')}}
                        </th>
                        <th>
                            <!-- {{ $t("输赢") }} -->
                            {{$t('home_063')}}
                        </th>
                    </tr>
                </thead>
                <tbody v-if="isShowList">
                    <tr>
                        <th>
                            <!-- {{$t("总计")}} -->
                            {{$t('bettingrc_033')}}
                        </th>
                        <th>{{formatNumber(sum.sum_sell + '')}}</th>
                        <th >{{formatNumber(sum.sum_point + '')}}</th>
                        <th>{{formatNumber(sum.sum_bonus + '')}}</th>
                        <th>{{formatNumber((sum.sum_profit * -1) + '')}}</th>
                    </tr>
                    <tr v-for="(items, index) in winLoseList" :key="index">
                        <td>{{items.summary_date}}</td>
                        <td>{{formatNumber(items.sell)}}</td>
                        <td>{{formatNumber(items.point)}}</td>
                        <td>{{formatNumber(items.bonus)}}</td>
                        <td>{{formatNumber(items.profit * -1)}}</td>
                    </tr>
                </tbody>
                <tfoot v-else>
                    <tr>
                        <!-- "查无资料" : "请选择区间后进行查询" -->
                        <td colspan="7">{{$t(isSearch ? "bettingrc_031" : "bettingrc_030")}}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
        <PageNation v-if="isShowPageNation" />
    </div>
</template>

<script>
import PageNation from './PageNation'
import { mapGetters } from 'vuex'
import { formatNumber } from '@UTIL'

export default {
    name: 'InfoList',
    data() {
        return {
            isSearch: false,
            isPeriodType: 'created_at'
        }
    },
    beforeMount() {
        this.$root.$on('dateSearch', this.dateSearch)
        this.$root.$on('periodType', this.periodType)
    },
    beforeDestroy() {
        this.$root.$off('dateSearch', this.dateSearch)
        this.$root.$off('periodType', this.periodType)
    },
    watch: {
        winLoseList(v) {
            v.length === 0 && (this.isSearch = true)
        }
    },
    methods: {
        formatNumber(number) {
            return formatNumber(number)
        },
        periodType(v) {
            this.isPeriodType = v
        },
        dateSearch(v) {
            if (v === '') {
                this.isSearch = false
            }
        }
    },
    computed: {
        ...mapGetters([
            'winLoseList',
            'winLoseLoading',
            'pagination',
            'sum'
        ]),
        isShowList() {
            return this.winLoseList && this.pagination.totalNumber > 0
        },
        isShowPageNation() {
            return this.winLoseList && this.pagination.totalNumber > 1
        }
    },
    components: {
        PageNation
    }
}
</script>
