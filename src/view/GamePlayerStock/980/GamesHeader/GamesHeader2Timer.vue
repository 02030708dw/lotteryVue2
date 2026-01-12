<template>
    <div class="gr_games-header  gr_container gr_games-stock_header">
        <MyFavoritesIcon />
        <LotteryLogo />
        <!-- 上午 -->
        <div class="gr_games-header__square">
            <div v-if="isOpen['001']">
                <strong>{{`${numberFormat} ${$t('home_059')}`}}</strong>
                <span>
                    <!-- {{$t("投注截止时间")}} -->
                    {{$t('common_002')}}
                </span>
            </div>
            <div v-else>
                <!-- {{$t("目前尚未开放奖期")}} -->
                {{$t('common_003')}}
            </div>
            <FlipTimer :timerIdx="0" :isClosed="!isOpen['001']"/>
        </div>
        <!-- 下午 -->
        <div class="gr_games-header__square">
            <div v-if="isOpen['002']">
                <strong>{{`${numberFormat} ${$t('home_060')}`}}</strong>
                <span>
                    <!-- {{$t("投注截止时间")}} -->
                    {{$t('common_002')}}
                </span>
            </div>
            <div v-else>
                <!-- {{$t("目前尚未开放奖期")}} -->
                {{$t('common_003')}}
            </div>
            <FlipTimer :timerIdx="1" :isClosed="!isOpen['002']"/>
        </div>
        <LotteryPeriod />
        <LotteryStatus />
    </div>
</template>
<script>
import LotteryLogo from './LotteryLogo'
import FlipTimer from './FlipTimer'
import LotteryPeriod from './LotteryPeriod'
import LotteryStatus from './LotteryStatus'
import MyFavoritesIcon from './MyFavoritesIcon'
import { mapGetters } from 'vuex'

export default {
    name: 'GamesHeader2Timer',
    components: {
        LotteryLogo,
        FlipTimer,
        LotteryPeriod,
        LotteryStatus,
        MyFavoritesIcon
    },
    methods: {
        currentClass(ball) {
            return 'c_ball--large'
        }
    },
    computed: {
        ...mapGetters([
            'gameType',
            'lotteryName',
            'currentjsDynamicData',
            'currentLottery',
            'gameMenu',
            'menuIndex',
            'lastballs',
            'lastnumber',
            'openingIssue',
            'number',
            'lang',
            'gameLotteryId'
        ]),
        isOpen() {
            let result = {
                // 上午
                '001': false,
                // 下午
                '002': false
            }

            if (this.currentjsDynamicData.number) {
                if (this.currentjsDynamicData.issue.length > 0) {
                    // 多獎期:2期以上可投issue才會有東西
                    result['001'] = true
                    result['002'] = true
                    return result
                }
                // 單獎期
                result[this.currentjsDynamicData.number.split('-')[1]] = true
            }

            return result
        },
        // 回傳格式化後的期號 ex: 20191120-002 -> 11-20 (三)
        numberFormat() {
            const rawDate = `${this.number}`.split('-')[0]
            const date = moment(rawDate).format('MM-DD')
            const DAY_NAME_KEY = {
                1: 'vn_t_010',
                2: 'vn_t_011',
                3: 'vn_t_012',
                4: 'vn_t_013',
                5: 'vn_t_014',
                6: 'vn_t_015',
                7: 'vn_t_016'
            }
            // 從1開始到7
            const dayName = this.$t(DAY_NAME_KEY[moment(rawDate).format('E')])
            return `${date} (${dayName})`
        }
    }
}
</script>
