<template>
    <div class="gr_container gr_page__content bg_primary" v-loading.body="gameInfoIsLoading" :element-loading-text="$t('home_020')">
        <!--<PageNation v-if="isShowPageNation" />-->
        <!-- <component :is="`InfoList_${lotteryCountry}`"/> -->
        <div class="table_default table_stripe table_hover_bg">
            <table>
                <thead>
                    <tr>
                        <th style="width: 80px">
                            <!-- {{$t("投注时间")}} -->
                            {{$t('bettingrc_020')}}
                        </th>
                        <th style="width: 80px">
                            <!-- '结算时间' -->
                            {{$t('bettingrc_081')}}
                        </th>
                        <template v-if="lang === 'cn'">
                            <th>
                                <!-- {{$t("彩种")}} -->
                                {{$t('bettingrc_021')}}
                            </th>
                            <th>
                                <!-- {{$t("玩法")}} -->
                                {{$t('bettingrc_022')}}
                            </th>
                        </template>
                        <th v-else style="min-width: 146px;">
                            <!-- {{$t("彩种")}} / {{$t("玩法")}} -->
                            {{$t('bettingrc_021')}} / {{$t('bettingrc_022')}}
                        </th>
                        <th style="min-width: 55px;">
                            <!-- {{$t("期号")}} -->
                            {{$t('bettingrc_023')}}
                        </th>
                        <th style="width: 70px;">
                            <!-- {{$t("投注内容")}} -->
                            {{$t('bettingrc_024')}}
                        </th>
                        <th>
                            <!-- {{$t("投注金额")}} -->
                            {{$t('bettingrc_025')}}
                        </th>
                        <!-- 返点金额 -->
                        <th v-if="isShowBar">{{$t('bettingrc_026')}}</th>
                        <th>
                            <!-- {{$t("中奖金额")}} -->
                            {{$t('bettingrc_027')}}
                        </th>
                        <th style="width: 180px;">
                            <!-- {{$t("开奖号码")}} -->
                            {{$t('bettingrc_028')}}
                        </th>
                        <th>
                            <!-- {{$t("状态")}} -->
                            {{$t('bettingrc_029')}}
                        </th>
                    </tr>
                </thead>
                <tbody v-if="isShowList">
                    <tr class="u_c--pointer" v-for="(item, index) in infoList" :key="index" @click="showDetail(index)">
                        <template v-if="lang === 'cn'">
                            <td>
                                {{item.write_time.split(' ')[0]}}<br>{{item.write_time.split(' ')[1]}}
                            </td>
                            <td>
                                {{item.deduct_time}}
                            </td>
                            <td>
                                {{$t(item.i18n_lottery_name_key)}}
                            </td>
                            <td>
                                {{$t(methodName(item))}}
                            </td>
                        </template>
                        <template v-else>
                            <td>
                                {{item.write_time.split(" ")[0]}}
                                <br>
                                {{item.write_time.split(" ")[1]}}
                            </td>
                            <td>
                                {{item.deduct_time}}
                            </td>
                            <td>
                                <div class="u_p--l10  u_t--left">
                                    {{$t(item.i18n_lottery_name_key)}}
                                </div>
                                <div class="u_p--l10  u_t--left  text_color_weak">
                                    {{$t(methodName(item))}}
                                </div>
                            </td>
                        </template>
                        <td>{{item.issue}}</td>
                        <td>
                            <!-- 投注內容 -->
                            {{$t(updateTransCode(item))}}
                            <div class="text_color_accent_invert" v-if="!updateTransCode(item)">
                                <!-- {{$t("详细号码")}} -->
                                {{$t('bettingrc_036')}}
                            </div>
                        </td>
                        <td>{{formatNumber(item.total_price)}}</td>
                        <td v-if="isShowBar">{{formatNumber(item.user_point)}}</td>
                        <td>{{formatNumber(item.bonus)}}</td>
                        <td v-if="lang !== 'cn' && item.bingo_code && item.bingo_code.length == '29'">
                            <div>{{item.bingo_code.slice(0, 15)}}</div>
                            <div>{{item.bingo_code.slice(15)}}</div>
                        </td>
                        <td v-else-if="[240, 241].includes(+item.lottery_id)" class="fscBall">
                            <!-- 魚蝦蟹 -->
                            <i
                                v-for="(val, index) in fscList(item)" :key="index"
                                :style="{backgroundImage: `url(/static/image/icon/i_${val}.png)`}"
                            />
                        </td>
                        <td v-else>
                            {{item.bingo_code}}
                        </td>
                        <td :class="statusCls(item)">
                            {{$t(prizeStateText(item))}}
                        </td>
                        <!-- <td class="u_c--pointer" @click="showDetail(index)">
                            <span class="text_color_accent_invert">{{$t("查看")}}</span>
                        </td> -->
                    </tr>
                    <!-- 小計 -->
                    <tr>
                        <td v-if="lang === 'cn'" colspan="6">
                            <!-- "小计"/ (打和、已取消注单不列入计算) -->
                            {{$t('bettingrc_032')}}{{gameSum.sum_income_only ? $t('bettingrc_083') : ''}}
                        </td>
                        <td v-else colspan="5">
                            <!-- "小计"/ (打和、已取消注单不列入计算) -->
                            {{$t('bettingrc_032')}}{{gameSum.sum_income_only ? $t('bettingrc_083') : ''}}
                        </td>
                        <td>{{formatNumber(total_price_sum)}}</td>
                        <td v-if="isShowBar">{{formatNumber(total_user_point)}}</td>
                        <td>{{formatNumber(bonus_sum)}}</td>
                        <td></td>
                        <td></td>
                    </tr>
                    <!-- 總計 -->
                    <tr>
                        <td v-if="lang === 'cn'" colspan="6">
                            <!-- "总计"/ (打和、已取消注单不列入计算) -->
                            {{$t('bettingrc_033')}}{{gameSum.sum_income_only ? $t('bettingrc_083') : ''}}
                        </td>
                        <td v-else colspan="5">
                            <!-- "总计"/ (打和、已取消注单不列入计算) -->
                            {{$t('bettingrc_033')}}{{gameSum.sum_income_only ? $t('bettingrc_083') : ''}}
                        </td>
                        <!-- <td v-if="lang === 'cn'"></td> -->
                        <td>{{formatNumber(gameSum.sum_total_price)}}</td>
                        <td v-if="isShowBar">{{formatNumber(gameSum.sum_user_point)}}</td>
                        <td>{{formatNumber(gameSum.sum_bonus)}}</td>
                        <td></td>
                        <td></td>
                    </tr>
                </tbody>
                <tfoot v-else>
                    <tr>
            <!-- "查无资料" : "请选择条件后进行查询" -->
                        <td colspan="11">{{$t($route.params.search ? "bettingrc_031" : "bettingrc_030")}}</td>
                    </tr>

                </tfoot>
            </table>
        </div><!-- table_default table_stripe -->
        <PageNation v-if="isShowPageNation" />
    </div><!-- gr_page__content -->
</template>
<style lang="scss" scoped>
.fscBall {
    i {
        width: 35px;
        height: 35px;
        display: inline-block;
        margin: 2px 1.5px -2px 1.5px;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center center;
    }
}
</style>
<script>
import InfoList from './InfoList'

export default {
    name: 'InfoList_bjl',
    mixins: [InfoList],
    data: () => ({

    }),
    methods: {
        fscList(item) {
            item = item.bingo_code.split('')
            const fscArr = []
            item.forEach((x) => {
                switch (+x[0]) {
                    case 1: x = 'fish'
                        break
                    case 2: x = 'shrimp'
                        break
                    case 3: x = 'gourd'
                        break
                    case 4: x = 'tiger'
                        break
                    case 5: x = 'crab'
                        break
                    case 6: x = 'chicken'
                        break
                }
                fscArr.push(x)
            })
            return fscArr
        }
    }
}
</script>
