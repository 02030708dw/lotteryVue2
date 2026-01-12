<template>
    <div class="gr_container gr_page__content bg_primary" v-loading.body="reportLoading" :element-loading-text="$t('home_020')">
        <!--<PageNation v-if="isShowPageNation" />-->
        <div class="table_default table_stripe">
            <table>
                <thead>
                    <tr>
                        <th>
                            <!-- {{ $t("结算日期") }} -->
                            {{$t('bettingrc_082')}}
                        </th>
                        <th>
                            <!-- {{ $t("投注总额") }} -->
                            {{$t('bettingrc_073')}}
                        </th>
                        <!-- <th>返点总额</th> -->
                        <!-- <th>实际销售总额</th> -->
                        <!-- '返点总额' -->
                        <th v-if="isShowRebate">{{ $t("bettingrc_074") }}</th>
                        <th>
                            <!-- {{ $t("中奖总额") }} -->
                            {{$t('bettingrc_075')}}
                        </th>
                        <th>
                            <!-- {{ $t("活动奖金") }} -->
                            {{$t('bettingrc_076')}}
                        </th>
                        <th>
                            <!-- {{ $t("游戏总盈亏") }} -->
                            {{$t('bettingrc_077')}}
                        </th>
                    </tr>
                </thead>
                <tbody v-if="isShowList">
                    <tr>
                        <th>
                            <!-- {{$t("总计")}} -->
                            {{$t('bettingrc_033')}}
                        </th>
                        <th>{{sum.sell}}</th>
                        <!-- <th>{{sum.point}}</th> -->
                        <!-- <th>{{sum.sellPoint}}</th> -->
                        <th v-if="isShowRebate">{{sum.point}}</th>
                        <th>{{sum.bonus}}</th>
                        <th>{{sum.event}}</th>
                        <th>{{sum.profit}}</th>
                    </tr>
                    <!--投注 sell, 返點 point, 实际销售总额 sellPoint, 中獎 bonus, 活動 event, 游戲總盈虧 profit-->
                    <tr v-for="(items, index) in infoList" :key="index">
                        <td>{{items.summary_date}}</td>
                        <td>{{formatNumber(items.sell)}}</td>
                        <!-- <td>{{formatNumber(items.point)}}</td> -->
                        <!-- <td>{{formatNumber(items.sellPoint)}}</td> -->
                        <td v-if="isShowRebate">{{formatNumber(items.point)}}</td>
                        <td>{{formatNumber(items.bonus)}}</td>
                        <td>{{formatNumber(items.event)}}</td>
                        <td>{{formatNumber(items.profit * -1)}}</td>
                    </tr>
                </tbody>
                <tfoot v-else>
                    <tr>
                        <!-- "查无资料" : "请选择区间后进行查询" -->
                        <td colspan="7">{{$t(reportData.isSearch ? "bettingrc_031" : "bettingrc_030")}}</td>
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
    components: {
        PageNation
    },
    methods: {
        // 空值顯示0
        formatNumber(number) {
            return +number === 0 ? 0 : formatNumber(number)
        }
    },
    computed: {
        ...mapGetters([
            'reportList',
            'reportLoading',
            'reportData',
            'isShowBar',
            'lotteryMenu'
        ]),
        infoList() {
            const { data } = this.reportList
            if (!data) {
                return []
            }

            data.list.forEach(function (value, idx) {
                data.list[idx]['sellPoint'] = parseFloat(data.list[idx]['sell']) - parseFloat(data.list[idx]['point'])
            })

            return data.list
        },
        // 投注 sell, 返點 point, 实际销售总额 sellPoint, 中獎 bonus, 活動 event, 游戲總盈虧 profit
        // 投注总额 返点总额 实际销售总额 中奖总额 活动奖金 游戏总盈亏
        sum() {
            let [sell, point, sellPoint, bonus, event, profit] = [0, 0, 0, 0, 0, 0]
            this.infoList.forEach((row) => {
                // 投注总额
                sell += parseFloat(row.sell)
                // 返点总额
                point += parseFloat(row.point)
                //实际销售总额 = 投注总额 - 返点总额
                sellPoint += parseFloat(row.sell) - parseFloat(row.point)
                // 中奖总额
                bonus += parseFloat(row.bonus)
                // 活动奖金
                event += parseFloat(row.event)
                // 游戏总盈亏 需乘上 -1 因後臺產生報表部分，在遊戲商角度是賠錢緣故
                profit += parseFloat(row.profit * -1)
            })

            return {
                sell: this.formatNumber(sell),
                point: this.formatNumber(point),
                sellPoint: this.formatNumber(sellPoint),
                bonus: this.formatNumber(bonus),
                event: this.formatNumber(event),
                profit: this.formatNumber(profit)
            }
        },
        isShowList() {
            return this.reportList.data && this.reportList.pagination.totalNumber > 0
        },
        isShowPageNation() {
            return this.reportList.data && this.reportList.pagination.totalNumber > 1
        },
        isShowRebate() {
            return this.isShowBar || this.lotteryMenu[3]
        }
    }
}
</script>
