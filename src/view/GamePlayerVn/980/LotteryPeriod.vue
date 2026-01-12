<template>
    <div class="gr_games-vn-header__lottery-period">
        <div class="gr_lottery-period__button-group">
            <div class="gr_button-group__official-website" v-if="isShowOfficalPage && !isHideOfficalPage">
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
            'VN_pos',
            'VN_isLocal',
            'VN_menuIndex',
            'VN_currentlottery',
            'lotteryOfficialVN',
            'lotterySourceLink',
            'isAE_VA285iwin',
            'VN_lotteryId',
            'VN_isLocal',
            'hideOw',
            'isW88'
        ]),
        openOfficalPage() {
            if (this.VN_isLocal) {
                // return `https://gw.shicai-intl.com/game/bonuscode/${this.VN_lotteryId}?limit=9`
                switch (+this.VN_isLocal) {
                    case 212:
                        return 'https://181888.org/history/?lottoCode=YN5FC'
                        break
                    case 223:
                        return 'https://181888.org/history/?lottoCode=YN30MC'
                        break
                }
            } else {
                return 'https://www.minhngoc.net.vn/'
            }
        },
        openHistory() {
            const url = '/History/vn?menuCode='
            let menuCode = this.VN_pos + '-'
            if (this.VN_currentlottery) {
                menuCode = `${this.VN_currentlottery.name}-${this.VN_lotteryId}`
            } else if (this.VN_pos === 'all') {
                menuCode = Object.keys(this.lotteryOfficialVN)[0] + '-'
            }
            return url + menuCode
        },
        // 判斷是否為自開彩
        isOpLocal() {
            const { is_op_local = false } = this.VN_currentlottery || {}
            return is_op_local
        },
        // 是否要顯示'開獎官網'按鈕
        isShowOfficalPage() {
            const notShow = [256]
            return !this.VN_isLocal && !this.isW88 && !this.isOpLocal && !notShow.includes(+this.VN_lotteryId) && !this.isAE_VA285iwin
        },
        // 是否要顯示'開獎官網'按鈕 後端參數
        isHideOfficalPage() {
            const lottery = this.VN_isLocal || 'vn'
            return this.hideOw[lottery]
        }
    }
}
</script>