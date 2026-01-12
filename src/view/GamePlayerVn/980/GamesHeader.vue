<template>
    <div class="gr_games-vn-header  gr_container">
        <MyFavoritesIcon />
        <LotteryLogo />
        <div
            class="gr_games-vn-header__square"
            :class="{is_active:  VN_gameMenu[VN_menuIndex].key === area}"
            v-for="(obj, area) in VN_jsDynamicConfig"
            v-if="officialKeyVN.includes(area) && VN_lotteryOfficialSwitch[area]"
            :key="area"
        > <!-- className: is_active -->
            <div v-if="obj">
                <span>
                    {{$t(VN_areaTitle[area])}}
                </span>
                <strong>{{ issue(obj.sale_end) }}</strong>
                <span>
                    <!-- {{$t("投注截止时间")}} -->
                    {{$t('common_002')}}
                </span>
            </div>
            <div v-else>
                <!-- {{$t("目前尚未开放奖期")}} -->
                {{$t('common_003')}}
            </div>
            <FlipTimer :area="area" />
        </div>
        <LotteryPeriod />
        <LotteryStatus />
    </div>
</template>
<script>
import LotteryLogo from './LotteryLogo'
import LotteryPeriod from './LotteryPeriod'
import LotteryStatus from './LotteryStatus'
import MyFavoritesIcon from './MyFavoritesIcon'
import FlipTimer from './FlipTimer'
import { mapGetters } from 'vuex'
export default {
    name: 'GamesHeader',
    components: {
        LotteryLogo,
        FlipTimer,
        LotteryPeriod,
        LotteryStatus,
        MyFavoritesIcon
    },
    methods: {
        issue(date) {
            date = moment(date).utcOffset(480)
            return `${date.format('MM-DD')} (${this.$t(this.VN_week[date.day()])})`
        }
    },
    computed: {
        ...mapGetters([
            'VN_lotteryOfficialSwitch',
            'VN_jsDynamicConfig',
            'officialKeyVN',
            'VN_areaTitle',
            'VN_gameMenu',
            'VN_menuIndex',
            'VN_week'
        ])
    }
}
</script>
