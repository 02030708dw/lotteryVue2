<template>
    <div class="gr_games-header__lottery-period">
        <div class="gr_lottery-period__button-group">
            <div class="gr_button-group__official-website"
                v-if="!isShowDemo && openOfficalPage !== '' && !isOpLocal && !isHideOfficalPage">
                <a
                    class="i_lottery-period--official-website"
                    :href="openOfficalPage"
                    target="_blank"
                >
                    <!-- 开奖官网 -->
                    <span class="c_button__text">
                        {{$t('common_006')}}
                    </span>
                </a>
            </div>
            <div style="margin-top: 8px;">
                <a class="i_lottery-period--history" :href="openHistory" target="_blank">
                    <span class="c_button__text">
                        <!-- {{$t("历史奖号")}} -->
                        {{$t('common_007')}}
                    </span>
                </a>
            </div>
        </div>
        <div class="gr_lottery-period__info" @click.stop v-if="is2Timer">
            <table>
                <tr v-for="(item, index) in historyBall.slice(0, 10)" v-show="index < 4" :key="index">
                    <td>{{item.issue}}</td>
                    <td v-if="item.code">
                        <em>{{item.code}}</em>
                    </td>
                </tr>
                <tfoot v-if="!historyBall || historyBall.length === 0" >
                    <tr>
                        <td>
                            <!-- {{$t("沒有奖期")}} -->
                            {{$t('common_011')}}
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
    name: 'LotteryPeriod',
    computed: {
        ...mapGetters([
            'game',
            'lang',
            'hideOw',
            'lotteryList2',
            'isShowDemo',
            'lotterySourceLink',
            'historyBall',
            'gameMenu',
            'menuIndex',
            'getPopActive',
            'currentLottery',
            'get2Timer'
        ]),
        ...mapGetters({
            lotteryId: 'gameLotteryId'
        }),
        /**
         * 取得開獎網站連結
         * @return {String} '' OR $link, 空字串代表不顯示
         */
        openOfficalPage() {
            const link = this.lotterySourceLink[this.lotteryId]
            if (link === undefined) {
                return this.lotterySourceLink.default(this.lotteryList2[this.lotteryId].series[0].lotteryId)
            }
            return link
        },
        // 判斷是否為自開彩
        isOpLocal() {
            const { is_op_local = false } = this.currentLottery
            return is_op_local
        },
        // 判斷是否為一日兩期
        is2Timer() {
            return this.get2Timer.includes(+this.lotteryId)
        },
        // 歷史獎號
        openHistory() {
            return `/History/stock?menuCode=${this.lotteryId}`
        },
        // 是否要顯示'開獎官網'按鈕 後端參數
        isHideOfficalPage() {
            return this.hideOw[this.lotteryId]
        }
    }
}
</script>