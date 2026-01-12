<template>
    <div class="gr_games-header  gr_container">
        <MyFavoritesIcon />
        <LotteryLogo />
        <div class="gr_games-header__square" style="width: 370px;">
            <div v-if="isOpen">
                <!-- 第{0}期 -->
                <i18n path="common_001" tag="span">
                    <strong place="0">{{ numberFormat }}</strong>
                </i18n>
                <span>
                    <!-- {{$t("投注截止时间")}} -->
                    {{$t('common_002')}}
                </span>
            </div>
            <div v-else>
                <!-- {{$t("目前尚未开放奖期")}} -->
                {{$t('common_003')}}
            </div>
            <FlipTimer />
        </div>
        <div class="gr_games-header__square" style="width: 370px;">
            <strong class="u_f--bold" place="0">{{lastnumber}}</strong>
            <span>
                <!-- {{$t("开奖号")}} -->
                {{$t('common_005')}}
            </span>
            <div class="gr_games-stock-header__number">
                <!-- '头奖'/'二星' -->
                <div class="gr_number__content">
                    <dl class="gr_number__content--item">
                        <dt class="gr_number__item--content">{{$t('thai_012')}}</dt>
                        <dd class="gr_number__item--content">{{$t('thai_013')}}</dd>
                    </dl>
                    <dl class="gr_number__content--item">
                        <dt class="gr_number__item--content">{{getBalls.first}}</dt>
                        <dd class="gr_number__item--content">{{getBalls.second}}</dd>
                    </dl>
                </div>
            </div>
        </div>
        <div style="margin-left: 20px;"><LotteryPeriod /></div>
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
    name: 'GamesHeaderNormal',
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
            return !!this.currentjsDynamicData.number
        },
        // 開獎號
        getBalls() {
            const [first, second] = this.lastballs
            return {
                first,
                second
            }
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
