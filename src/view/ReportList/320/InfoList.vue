<template>
	<!-- 加载中 -->
    <div class="gr_container gr_page__content bg_primary" v-loading.body="reportLoading" :element-loading-text="$t('home_020')">
        <div class="table_default table_stripe">
            <table>
                <tbody v-if="isShowList">
                    <tr>
                        <th>
                            <div class="u_f--left">
                                <!-- {{ $t("盈亏查询") }} -->
                                {{$t('bettingrc_072')}}
                            </div>
                            <div class="u_f--right">{{sum.profit}}</div>
                        </th>
                    </tr>
                    <!--投注 sell, 返點 point, 实际销售总额 sellPoint, 中獎 bonus, 活動 event, 游戲總盈虧 profit-->
                    <tr v-for="(items, index) in infoList" :key="index">
                        <td>
                            <div class="u_f--left">{{items.summary_date}}</div>
                            <div class="u_f--right">{{formatNumber(items.profit * -1)}}</div>
                        </td>
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
    </div>
</template>
<script>
import InfoList from '../980/InfoList'
import { Observable } from 'rxjs/Observable'

export default {
    name: 'InfoList',
    mixins: [InfoList],
    subscriptions() {
        const scroll = Observable.fromEvent(window, 'scroll') // mobile
        const scrollBody = Observable.fromEvent(document.body, 'scroll') // 320 window
        return {
            scroll$: Observable
                .merge(scrollBody)
                .merge(scroll)
                .throttleTime(1000)
                .do(() => {
                    // 滾動的時候關閉下拉選單
                    this.$parent.$children
                        .find((vue) => vue.$options._componentTag === 'Controls')
                        .$children.forEach((select) => {
                            select.$options._componentTag === 'el-select' && (select.visible = false)
                        })
                })
        }
    }
}
</script>