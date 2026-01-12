<template>
    <div :class="[
        'gr_game-history',
        {is_active: isPopActive}]"
        @click.stop>
        <div class="gr_game-history__button-group">
            <a
                v-if="!isShowDemo && openOfficalPage !== '' && !isOpLocal && !isHideOfficalPage"
                class="c_flat-button--primary c_flat-button--full"
                :href="openOfficalPage"
                target="_blank"
            >
                <span class="c_button__text">
                    <!-- '开奖官网' -->
                    {{$t('common_006')}}
                </span>
            </a>
            <a
                class="c_flat-button--primary c_flat-button--full"
                :href="openHistory"
            >
                <span class="c_button__text">
                    <!-- '历史奖号' -->
                    {{$t('common_007')}}
                </span>
            </a>
        </div>
        <div class="gr_game-history__title">
            <!-- '历史奖号' -->
            {{$t('common_007')}}
        </div>
        <div class="gr_game-history__scroll-area">
            <div class="gr_game-history__list" v-for="(item, index) in historyBall.slice(0, 10)" :key="index">
                <span class="gr_list__issue">#{{item.issue}}</span>
                <template v-if="item.code">
                    <span class="gr_list__code">{{item.code}}</span>
                </template>
            </div>
            <div class="gr_game-history__list is_empty" v-if="!historyBall || historyBall.length === 0" >
                <!-- '沒有奖期' -->
                {{$t('common_011')}}
            </div>
        </div>
    </div>
</template>
<script>
import LotteryPeriod from '../980/GamesHeader/LotteryPeriod'
import { mapGetters } from 'vuex'
export default {
    name: 'GameHistory',
    extends: LotteryPeriod,
    computed: {
        ...mapGetters([
            'isIos',
            'getPopActive',
            'currentLottery'
        ]),
        isPopActive() {
            return this.getPopActive.gameHistory
        },
        // 判斷是否為自開彩
        isOpLocal() {
            const { is_op_local = false } = this.currentLottery
            return is_op_local
        },
        // 歷史獎號
        openHistory() {
            return `/History/stock?menuCode=${this.lotteryId}`
        }
    }
}
</script>
