<template>
    <div class="gr_page-detail__container gr_page-detail__body">
        <div>
            <dl>
                <dt>
                    <!-- '彩种'︰ -->
                    {{$t('popup_030')}}︰
                </dt>
                    <!-- '越南彩' -->
                <dd v-if="isVNOfficial">{{`${$t('home_016')} - ${$t(getData.i18n_lottery_name_key)}`}}</dd>
                <dd v-else>{{$t(getData.i18n_lottery_name_key)}}</dd>
            </dl>

            <dl>
                <dt>
                    <!-- {{$t("玩法")}}： -->
                    {{$t('popup_031')}}：
                </dt>
                <dd>{{methodName(getData)}}</dd>
            </dl>
            <dl>
                <dt>
                    <!-- 奖期 -->
                    {{$t('popup_032')}}：
                </dt>
                <dd>{{isVNOfficial ? transBelongDate(getData.belong_date) : getData.issue}}</dd>
            </dl>

            <dl v-if="getData.code_type === 'input'">
                <dt>
                    <!-- {{$t("倍数")}}： -->
                    {{$t('popup_034')}}：
                </dt>
                <dd>{{parent.formatNumber(getData.multiple)}}
                    <!-- {{$t("倍")}} -->
                    {{$t('common_034')}}
                </dd>
            </dl>
            <dl>
                <dt>
                    <!-- '投注金额' -->
                    {{$t('popup_009')}}：
                </dt>
                <dd>
                    <!-- {0} 元 -->
                    {{$t("common_044", {'1': currencySymbol, '0': parent.formatNumber(getData.onePrice * getMode)})}}
                </dd>
            </dl>
            <dl>
                <dt>
                    <!-- '总额' -->
                    {{$t('popup_117')}}：
                </dt>
                <dd>
                    <!-- {0} 元 -->
                    {{$t("common_044", {'1': currencySymbol, '0': parent.formatNumber(getData.total_price)})}}
                </dd>
            </dl>
            <dl>
                <div class="gr_page-detail__table">
                  <div class="gr_table__row">
                      <!-- '返点金额' -->
                    <div class="gr_table__cell">{{$t('bettingrc_026')}}：</div>
                    <div class="gr_table__cell">
                        <!-- '{0} 元' -->
                      <span>{{$t("common_044", {'1': currencySymbol, '0': parent.formatNumber(getData.user_point)})}}</span>
                      <!-- '(开奖后派发)' -->
                      <div class="text_color_weak u_d--inline-block">{{$t('bettingrc_043')}}</div>
                    </div>
                  </div>
                </div>
            </dl>
        </div>
        <div class="detailbox_content">
            <dl>
                <dt>
                    <!-- {{$t("投注内容")}}： -->
                    {{$t('popup_007')}}：
                </dt>
            </dl>
            <div v-if="parent.transCode.length >= 50000">
                <!-- 因内容庞大无法显示，您可点击: 查看完整内容-->
                <p>{{$t('popup_039')}}：　<span class='text_color_accent_invert u_c--pointer' @click="parent.openWindow(parent.transCode)">
                    {{$t('popup_040')}}
                </span></p>
            </div>
            <div v-else v-html="parent.updateTransCode"/>
        </div>
        <div :class="{ 'u_p--b50': RWDMode === 3 }">
            <dl>
                <dt>
                    <!-- '賠率' -->
                    {{$t('common_064')}}：
                </dt>
                <dd>
                     @{{getPrize}}
                </dd>
            </dl>
            <dl>
                <dt>
                    <!-- {{$t("中奖金额")}}： -->
                    {{$t('popup_037')}}：
                </dt>
                <dd>
                    <!-- {0} 元 -->
                    {{$t("common_044", {'1': currencySymbol, '0': parent.formatNumber(getData.bonus)})}}
                </dd>
            </dl>
            <dl>
                <dt>
                    <!-- {{$t("开奖号码")}}： -->
                    {{$t('popup_038')}}：
                </dt>
            </dl>
            <div
                class="gr_game-info__number is_active"
                v-show="bingoCode.length">
                <div class="gr_number__header">
                    <span v-if="isVNOfficial">{{$t(getData.i18n_lottery_name_key)}}</span>
                    <span v-else>{{$t('common_001', { 0: getData.issue })}}</span>
                </div>
                <div class="gr_number__content">
                    <dl class="gr_number__content--item" v-for="(item, index) in bingoCode">
                        <dt class="gr_number__item--title">
                            <i class="gr_item__title--icon">{{bingoCode.length - index - 1}}</i>
                        </dt>
                        <dd class="gr_number__item--content">
                            <span class="gr_item__content--item" v-for="(i, j) in item" :data-number="j + 1">{{i}}</span>
                        </dd>
                    </dl>
                </div>
            </div>
        </div>
    </div><!-- gr_page-detail__container gr_page-detail__body -->
</template>
<script>
import { formatVNBingoCode } from '@UTIL/games/VN'
import { mapGetters } from 'vuex'
import { methodName } from '@UTIL/presenter'
export default {
    name: 'SubDetailVn',
    props: ['parent'],
    computed: {
        ...mapGetters([
            'VN_week',
            'RWDMode',
            'currencySymbol'
        ]),
        bingoCode() {
            return formatVNBingoCode(this.getData.bingo_code)
        },
        // 256是愛國彩
        isVNOfficial() {
            const filter = ['lottery_name_212', 'lottery_name_223', 'lottery_name_256']
            return !filter.includes(this.getData.cnname_key)
        },
        getMode() {
            return 10 * (0.1 ** (this.getData.modes || 1))
        },
        getData() {
            return this.parent.info
        },
        getPrize() {
            const obj = JSON.parse(this.getData.pointinfo.replace(/\\/g, ''))
            return obj.single_prize
        }
    },
    methods: {
        transBelongDate(data) {
            const date = moment(data)
            const vn_week = [
                'vn_t_016', // 日
                'vn_t_010', // 一
                'vn_t_011', // 二
                'vn_t_012', // 三
                'vn_t_013', // 四
                'vn_t_014', // 五
                'vn_t_015' // 六
            ]
            return `${date.format('YYYY-MM-DD')} (${this.$t(vn_week[date.day()])})`
        },
        methodName(item) {
            return methodName(item)
        }
    }
}
</script>
