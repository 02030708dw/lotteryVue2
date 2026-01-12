<template>
    <div class="gr_page-detail__container gr_page-detail__body">
        <div>
            <dl>
                <dt>
                    <!-- '彩种'︰ -->
                    {{$t('popup_030')}}︰
                </dt>
                <dd>{{$t(parent.info.i18n_lottery_name_key)}}</dd>
            </dl>

            <dl>
                <dt>
                    <!-- {{$t("玩法")}}： -->
                    {{$t('popup_031')}}：
                </dt>
                <dd>{{$t(keyObj[parent.info.i18n_method_lv1_name])}} - {{$t(parent.info.method_name_key)}}</dd>
            </dl>
            <dl>
                <dt>
                    <!-- 奖期 -->
                    {{$t('popup_032')}}：
                </dt>
                <dd>{{parent.info.issue}}</dd>
            </dl>
            <dl v-if="parent.info.code_type === 'input'">
                <dt>
                    <!-- {{$t("倍数")}}： -->
                    {{$t('popup_034')}}：
                </dt>
                <dd>{{parent.formatNumber(parent.info.multiple)}}
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
                    {{$t("common_044", {'1': currencySymbol, '0': parent.formatNumber(parent.info.onePrice * this.getMode)})}}
                </dd>
            </dl>
            <dl>
                <div class="gr_page-detail__table">
                  <div class="gr_table__row">
                      <!-- '返点金额' -->
                    <div class="gr_table__cell">{{$t('bettingrc_026')}}：</div>
                    <div class="gr_table__cell">
                        <!-- '{0} 元' -->
                      <span>{{$t("common_044", {'1': currencySymbol, '0': parent.formatNumber(parent.info.user_point)})}}</span>
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
                    <!-- {{$t("中奖金额")}}： -->
                    {{$t('popup_037')}}：
                </dt>
                <dd>
                    <!-- {0} 元 -->
                    {{$t("common_044", {'1': currencySymbol, '0': parent.formatNumber(parent.info.bonus)})}}
                </dd>
            </dl>
            <dl>
                <dt>
                    <!-- {{$t("开奖号码")}}： -->
                    {{$t('popup_038')}}：
                </dt>
            </dl>
            <div v-show="bingoCode.length">
                <div>
                    <span v-for="(code, index) in bingoCode" class="th_number">
                        <div class="th_number-title">{{$t(bingoTitleArr[index])}}</div>
                        <div class="th_number-prize">{{code}}</div>
                    </span>
                </div>
            </div>
        </div>
    </div><!-- gr_page-detail__container gr_page-detail__body -->
</template>

<style lang="scss">
.th_number {
    display: inline-block;
    border: 1px solid gray;
    border-left: none;
    width: 24%;
    text-align: center;

    &:first-child {
        border-left: 1px solid gray;
    }

    & .th_number-prize {
        border-top: 1px solid gray;
    }
}
</style>

<script>
import { mapGetters } from 'vuex'
import { methodName } from '@UTIL/presenter'

export default {
    name: 'SubDetail_my',
    props: ['parent'],
    data() {
        return {
            // 头奖/二星
            bingoTitleArr: ['thai_012', '4d_o_029'],
            keyObj: {
                '1D': 'thai_011',
                '2D': 'thai_010',
                '3D': 'thai_009'
            }
        }
    },
    computed: {
        ...mapGetters([
            'VN_week',
            'RWDMode',
            'currencySymbol'
        ]),
        bingoCode() {
            if (this.parent.info.bingo_code === '') {
                return []
            }
            return this.parent.info.bingo_code.split(',').reduce((formatArr, code, codeIndex) => {
                if ([2, 4].includes(codeIndex)) {
                    formatArr[formatArr.length - 1] += ` ${code}`
                } else {
                    formatArr.push(code)
                }
                return formatArr
            }, [])
        },
        getMode() {
            return 10 * (0.1 ** (this.parent.info.modes || 1))
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
