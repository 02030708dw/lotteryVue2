<template>
  <!-- 加载中 -->
    <div class="gr_container gr_page__content bg_primary" v-loading.body="gameInfoIsLoading" :element-loading-text="$t('home_020')">
        <!--越南彩-->
        <div class="table_default table_stripe table_hover_bg">
            <table>
                <thead>
                    <tr>
                        <th style="width: 80px">
                            <!-- '投注时间' -->
                            {{$t("popup_028")}}
                        </th>
                        <th style="width: 80px">
                            <!-- '结算时间' -->
                            {{$t('bettingrc_081')}}
                        </th>
                        <th>
                            <!-- '彩种' -->
                            {{$t("bettingrc_021")}}
                        </th>
                        <th>
                            <!-- '玩法' -->
                            {{$t("popup_031")}}
                        </th>
                        <th>
                            <!-- '奖期' -->
                            {{$t('popup_032')}}
                        </th>
                        <th>
                            <!-- '投注内容' -->
                            {{$t("popup_007")}}
                        </th>
                        <th>
                            <!-- '投注金额' -->
                            {{$t("popup_009")}}
                        </th>
                        <th>
                            <!-- '返点金额' -->
                            {{$t('bettingrc_026')}}
                        </th>
                        <th>
                            <!-- '中奖金额' -->
                            {{$t("popup_037")}}
                        </th>
                        <th v-if="hasShare">
                            <!-- {{$t("分享注单")}} -->
                            {{$t('popup_158')}}
                        </th>
                        <th>
                            <!-- '状态' -->
                            {{$t("bettingrc_029")}}
                        </th>
                    </tr>
                </thead>
                <tbody v-if="isShowList">
                    <tr class="u_c--pointer" v-for="(item, index) in infoList" :key="index" @click="showDetail(index)">
                        <!-- 投注时间 -->
                        <td>
                            {{item.write_time.split(' ')[0]}}<br>{{item.write_time.split(' ')[1]}}
                        </td>
                        <!-- 结算时间 -->
                        <td>
                            {{item.deduct_time}}
                        </td>
                        <!-- 彩种 -->
                        <td>
                            {{$t(item.i18n_lottery_name_key)}}
                        </td>
                        <!-- 玩法 -->
                        <td>
                            <!-- $t(item.i18n_method_lv1_name_key)}} - {{$t(item.method_name_key) -->
                            {{$t(keyObj[item.i18n_method_lv1_name])}} - {{$t(item.method_name_key)}}
                        </td>
                        <!-- '奖期' 自主彩顯示獎期, 官方彩顯示開獎日期 -->
                        <td>
                            {{item.issue}}
                        </td>
                        <!-- 投注内容 -->
                        <td>
                            <!-- '详细号码' -->
                            <a style="color:rgb(0,113,188);" v-if="parseVNCode(item, false).length >= 20" href="javascript:void(0)">{{$t('common_104')}}</a>
                            <span v-else v-html="parseVNCode(item)"/>
                        </td>
                        <!-- 投注金额 -->
                        <td>
                            {{formatNumber(item.onePrice * getMode(item.modes))}}
                        </td>
                        <td>
                            <!-- 返点金额 -->
                            {{formatNumber(item.user_point)}}
                        </td>
                        <!-- 中奖金额 -->
                        <td>
                            {{formatNumber(item.bonus)}}
                        </td>
                        <td v-if="hasShare" @click.stop="handleShare(index)">
                            {{$t('popup_159')}}
                        </td>
                        <!-- 状态 -->
                        <td :class="statusCls(item)">
                            {{$t(prizeStateText(item))}}
                        </td>
                    </tr>
                    <!-- 小計 -->
                    <tr>
                        <td colspan="6">
                            <!-- "小计"/ (打和、已取消注单不列入计算) -->
                            {{$t('bettingrc_032')}}{{gameSum.sum_income_only ? $t('bettingrc_083') : ''}}
                        </td>
                        <!-- 小計-投注金额 -->
                        <!-- <td>{{formatNumber(onePrice_sum)}}</td> -->
                        <!-- 小計-总额 -->
                        <td>{{formatNumber(total_price_sum)}}</td>
                        <!-- 小計-返点金额 -->
                        <td>{{formatNumber(total_user_point)}}</td>
                        <!-- 小計-中奖金额 -->
                        <td>{{formatNumber(bonus_sum)}}</td>
                        <td></td>
                        <td v-show="hasShare"></td>
                    </tr>
                    <!-- 總計 -->
                    <tr>
                        <td colspan="6">
                            <!-- "总计"/ (打和、已取消注单不列入计算) -->
                            {{$t('bettingrc_033')}}{{gameSum.sum_income_only ? $t('bettingrc_083') : ''}}
                        </td>
                        <!-- 總計-投注金额 -->
                        <!-- <td>{{formatNumber(gameSum.sum_onePrice)}}</td> -->
                        <!-- 總計-总额 -->
                        <td>{{formatNumber(gameSum.sum_total_price)}}</td>
                        <!-- 總計-返点金额 -->
                        <td>{{formatNumber(gameSum.sum_user_point)}}</td>
                        <!-- 總計-中奖金额 -->
                        <td>{{formatNumber(gameSum.sum_bonus)}}</td>
                        <td></td>
                        <td v-show="hasShare"></td>
                    </tr>
                </tbody>
                <tfoot v-else>
                    <tr>
                        <!-- "查无资料" : "请选择条件后进行查询" -->
                        <td :colspan="hasShare ? 12 : 11">{{$t($route.params.search ? "bettingrc_031" : "bettingrc_030")}}</td>
                    </tr>

                </tfoot>
            </table>
        </div><!-- table_default table_stripe -->
        <PageNation v-if="isShowPageNation" :lotteryCountry="lotteryCountry"/>
    </div><!-- gr_page__content -->
</template>
<script>
import InfoList from './InfoList'
import { parseVNCode } from '@UTIL/presenter'

export default {
    name: 'InfoList_stock',
    mixins: [InfoList],
    data() {
        return {
            keyObj: {
                '1D': 'thai_011',
                '2D': 'thai_010',
                '3D': 'thai_009'
            }
        }
    },
    methods: {
        parseVNCode(item, isHtml) {
            return parseVNCode({
                code: item.code,
                scode: item.scode,
                methodName: item.i18n_method_lv1_name,
                isHtml
            })
        },
        getMode(modes) {
            return 10 * (0.1 ** (modes || 1))
        }
    }
}
</script>