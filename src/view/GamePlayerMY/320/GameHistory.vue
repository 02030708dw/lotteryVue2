<template>
    <div :class="[
        'gr_game-my-history',
        {is_active: isPopActive}]"
        @click.stop>
        <div class="gr_game-my-history__button-group">
            <a
                v-if="!isShowDemo && openOfficalPage !== '' && !isHideOfficalPage"
                class="c_flat-button--primary c_flat-button--full"
                :href="openOfficalPage"
                target="_blank"
            >
                <span class="c_button__text">
                    <!-- '开奖官网' -->
                    {{$t('common_006')}}
                </span>
            </a>
            <div
                class="c_flat-button--primary c_flat-button--full"
                @click="openHistory320"
            >
                <span class="c_button__text">
                    <!-- '历史奖号' -->
                    {{$t('common_007')}}
                </span>
            </div>
        </div>
        <div class="gr_game-my-history__title">
            <!-- '历史奖号' -->
            {{$t('common_007')}}
        </div>
        <div class="gr_game-my-history__scroll-area">
            <div class="gr_game-my-history__list" v-for="(item, index) in MY_historyBall.slice(0, 10)" :key="index">
                <span class="gr_list__issue">#{{item.issue}}</span>
                <template v-if="item.code" v-for="(code, i) in item.code.split(',')">
                    <span class="gr_list__code">{{code}}</span>
                    <span class="gr_list__code gray" v-if="[0,2,4].includes(i)">|</span>
                </template>
            </div>
            <div class="gr_game-my-history__list is_empty" v-if="!MY_historyBall || MY_historyBall.length === 0" >
                <!-- '沒有奖期' -->
                {{$t('common_011')}}
            </div>
        </div>
    </div>
</template>
<script>
import LotteryPeriod from '../980/GameHeader/LotteryPeriod'
import { mapGetters } from 'vuex'
export default {
    name: 'GameHistory',
    extends: LotteryPeriod,
    computed: {
        ...mapGetters([
            'isIos',
            'getPopActive',
            'currentLottery',
            'MY_historyBall',
            'MY_lotteryId'
        ]),
        isPopActive() {
            return this.getPopActive.gameHistory
        },
        fillterMY_historyBall() {
            return this.MY_historyBall.map((e) => {
                return e.split(',')
            })
        }
        // 判斷是否為自開彩
        // isOpLocal() {
        //     return true
        //     // const { is_op_local = false } = this.currentLottery
        //     // return is_op_local
        // },
    },
    methods: {
        openHistory320() {
            this.$router.push({
                path: '/History/my',
                query: {
                    menuCode: this.MY_lotteryId
                }
            })
        }
    }
}
</script>
