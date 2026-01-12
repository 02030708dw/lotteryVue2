<template>
    <div class="gr_page-detail__container gr_page-detail__body">
        <div>
            <dl>
                <dt>
                    <!-- {{$t("彩种")}}︰ -->
                    {{$t('popup_030')}}︰
                </dt>
                <dd>{{$t(parent.info.i18n_lottery_name_key)}}</dd>
            </dl>
            <dl>
                <dt>
                    <!-- {{$t("玩法")}}： -->
                    {{$t('popup_031')}}：
                </dt>
                <dd>{{$t(parent.methodName(parent.info))}}</dd>
            </dl>
            <dl>
                <dt>
                    <!-- {{$t("奖期")}}： -->
                    {{$t('popup_032')}}：
                </dt>
                <dd>{{parent.info.issue}}</dd>
            </dl>
            <dl>
                <dt>
                    <!-- {{$t("模式")}}： -->
                    {{$t('popup_033')}}：
                </dt>
                <dd>{{$t(parent.getMode)}}</dd>
            </dl>
            <dl>
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
                    <!-- {{$t("投注金额")}}： -->
                    {{$t('popup_009')}}：
                </dt>
                <dd>
                    <!-- {0} 元 -->
                    {{$t("common_044", {'1': currencySymbol,'0': parent.formatNumber(parent.info.total_price)})}}
                </dd>
            </dl>
            <dl v-if="parent.isShowBar">
                <div class="gr_page-detail__table">
                  <div class="gr_table__row">
                      <!-- '返点金额' -->
                    <div class="gr_table__cell">{{$t('bettingrc_026')}}：</div>
                    <div class="gr_table__cell">
                        <!-- '{0} 元' -->
                      <span>{{$t("common_044", {'1': currencySymbol,'0': parent.formatNumber(parent.info.user_point)})}}</span>
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
            <div v-else>
                <p v-html="isUpdateTransCode" class="betting_detail" />
            </div>
        </div>
        <div :class="{ 'u_p--b50': RWDMode === 3 }">
            <dl>
                <dt>
                    <!-- {{$t("中奖金额")}}： -->
                    {{$t('popup_037')}}：
                </dt>
                <dd>
                    <!-- {0} 元 -->
                    {{$t("common_044", {'1': currencySymbol,'0': parent.formatNumber(parent.info.bonus)})}}
                </dd>
            </dl>
            <dl>
                <dt>
                    <!-- {{$t("开奖号码")}}： -->
                    {{$t('popup_038')}}：
                </dt>
                <dd class="detailbox_winningNum">
                    <div>
                        <!-- <span v-for="(code, index) in parent.bingoCode" :key="index">{{ code }}</span> -->
                        {{calcDisplay}}
                    </div>
                </dd>
            </dl>
        </div>
    </div><!-- gr_page-detail__container gr_page-detail__body -->
</template>
<style lang="scss" scoped>
/deep/ .betting_detail  {
    span {
        margin: 0 1px 0 1px;
        &.sy {
            margin: 0 5px;
        }
    }
}
</style>

<script>
import { mapGetters } from 'vuex'
export default {
    name: 'SubDetail_bjl',
    props: ['parent'],
    computed: {
        ...mapGetters([
            'RWDMode',
            'currencySymbol'
        ]),
        isUpdateTransCode() {
            let arr = this.parent.updateTransCode
            return arr ? arr.replace(/([,])/g, '<span>$1</span>').replace(/([|])/g, '<span class="sy">$1</span>') : ''
        },
        // 取得開獎號轉換成牌
        getCards() {
            const balls = this.parent.bingoCode
            return [
                (+balls[0] + +balls[1]) % 10,
                (+balls[2] + +balls[3]) % 10,
                +balls[8] % 10,
                (+balls[4] + +balls[5]) % 10,
                (+balls[6] + +balls[7]) % 10,
                +balls[9] % 10
            ]
        },
        // 取得闲家的牌
        getPlayerCard() {
            // 闲家
            const [first, second, third] = [this.getCards[0], this.getCards[1], this.getCards[2]]
            const sum = (first + second) % 10
            // 莊家
            const [bkFirst, bkSecond] = [this.getCards[3], this.getCards[4]]
            const bksum = (bkFirst + bkSecond) % 10
            return (bksum > 7 || sum > 5) ? [first, second] : [first, second, third]
        },
        // 取得莊家的牌
        getBankerCard() {
            // 闲家
            const [first, second, third] = [this.getCards[0], this.getCards[1], this.getCards[2]]
            const sum = (first + second) % 10
            // 莊家
            const [bkFirst, bkSecond, bkThird] = [this.getCards[3], this.getCards[4], this.getCards[5]]
            const bksum = (bkFirst + bkSecond) % 10

            // 是否補牌
            let addCard = false
            if (bksum > 6 || sum > 7) {
                // 莊家合計 7,8,9 或 闲家合計 8,9 -> 莊家不補牌
                addCard = false
            } else if (bksum < 3 || [6, 7].includes(sum)) {
                // 莊家合計 0,1,2 或 闲家合計 6,7 -> 莊家補牌
                addCard = true
            } else {
                const mode = {
                    3: third !== 8, // 闲家補牌非8點 -> 補牌
                    4: (third >= 2 && third <= 7), // 闲家補牌為 2~7點 -> 補牌
                    5: (third >= 4 && third <= 7), // 闲家補牌為 4~7點 -> 補牌
                    6: (third === 6 || third === 7) // 闲家補牌為 6,7點 -> 補牌
                }

                addCard = mode[bksum]
            }

            return addCard ? [bkFirst, bkSecond, bkThird] : [bkFirst, bkSecond]
        },
        /**
         * 計算開獎-莊賢合
         * @returns {String} 'pk10_t_135','common_030','baccarat_001'
         */
        calcBankerPlayerTie() {
            const bankerPoint = this.getBankerCard.reduce((a, b) => a + b) % 10
            const playerPoint = this.getPlayerCard.reduce((a, b) => a + b) % 10
            let ans = ''
            if (bankerPoint > playerPoint) {
                // 庄
                ans = 'pk10_t_135'
            } else if (bankerPoint === playerPoint) {
                // 和
                ans = 'common_030'
            } else {
                // 闲
                ans = 'baccarat_001'
            }
            return ans
        },

        /**
         * 計算開獎-對子(可能同時兩種都成立)
         * @returns {Array} ['baccarat_004','baccarat_003']
         */
        calcPair() {
            const playerCard = this.getPlayerCard
            const bankerCard = this.getBankerCard

            let ans = []
            // 闲对
            if (playerCard[0] === playerCard[1]) {
                ans.push('baccarat_004')
            }
            // 庄对
            if (bankerCard[0] === bankerCard[1]) {
                ans.push('baccarat_003')
            }
            return ans
        },
        /**
         * 計算開獎-大小
         * @returns {String} 'common_020', 'common_021'
         */
        calcBigSmall() {
            const playerCard = this.getPlayerCard
            const bankerCard = this.getBankerCard

            // 多於4張卡片為大,不可能少於4張, 大 : 小
            return (playerCard.length + bankerCard.length) > 4 ? 'common_020' : 'common_021'
        },
        // 顯示的開獎號碼
        calcDisplay() {
            if (this.parent.bingoCode.length) {
                const a1 = this.calcBankerPlayerTie
                const a2 = this.calcBigSmall
                const a3 = this.calcPair
                // 開獎玩法
                const bingo = [a1, a2, ...a3].map((word) => this.$t(word)).join(', ')
                // 闲家手牌
                const p = this.getPlayerCard.join(', ')
                // 莊家手牌
                const bk = this.getBankerCard.join(', ')
                // ${開獎玩法} | 庄: ${莊家手牌}; 闲: ${闲家手牌}
                let ans = `${bingo} | ${this.$t('pk10_t_135')}: ${bk}; ${this.$t('baccarat_001')}: ${p}`

                return ans
            }
            return ''
        }
    }
}
</script>
