<template>
    <div class="gr_games-my-header__lottery-period">
        <div class="gr_lottery-period__button-group">
            <div class="gr_button-group__official-website" v-if="!isHideOfficalPage">
                <a
                    v-if="!isShowDemo"
                    class="i_lottery-period--official-website"
                    :href="openOfficalPage"
                    target="_blank"
                >
                    <!-- 开奖官网 -->
                    <span>
                        {{$t('common_006')}}
                    </span>
                </a>
            </div>
            <div class="gr_button-group__history">
                <a class="i_lottery-period--history" :href="openHistory" target="_blank">
                    <span>
                        <!-- {{$t("历史奖号")}} -->
                        {{$t('common_007')}}
                    </span>
                </a>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
    name: 'LotteryPeriod',
    methods: {
        // showHistoryNum(index) {
        //     return !this.isPopActive ? index < 4 : true
        // }
    },
    computed: {
        ...mapGetters([
            'JWT',
            'isShowDemo',
            'hideOw',
            'MY_lotteryId',
            'lotterySourceLink'
        ]),
        openOfficalPage() {
            return this.lotterySourceLink[this.MY_lotteryId] || ''
        },
        // 歷史獎號
        openHistory() {
            return `/History/my?menuCode=${this.MY_lotteryId}`
        },
        // 是否要顯示'開獎官網'按鈕 後端參數
        isHideOfficalPage() {
            return this.hideOw[this.MY_lotteryId]
        }
    }
}
</script>