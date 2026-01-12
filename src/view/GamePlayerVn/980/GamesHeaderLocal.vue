<template>
    <div class="gr_games-vn-header  gr_container">
        <MyFavoritesIcon />
        <LotteryLogo />
        <div
            class="gr_games-vn-header__square  gr_games-vn-header__square--medium"
        > <!-- className: is_active -->
            <div v-if="VN_currentlottery">
                <!-- 第{0}期 -->
                <i18n path="common_001" tag="span">
                    <strong place="0">{{ VN_localIssue }}</strong>
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
            <FlipTimer :area="VN_localArea" />
        </div>
        <div
            class="gr_games-vn-header__square  gr_games-vn-header__square--long"
        >
            <!-- 第{0}期 -->
            <i18n path="common_001" tag="span">
                <strong class="u_f--bold" place="0">{{VN_lastIssue}}</strong>
            </i18n>
            <span>
                <!-- {{$t("开奖号")}} -->
                {{$t('common_005')}}
            </span>
            <div
                class="gr_games-vn-header__number  gr_game-info__number"
                :class="{is_active: !historyToggle}"
                ref="initPos"
                @click.stop="handleHistoryToggle"
            >
                <div class="gr_number__content">
                    <dl class="gr_number__content--item" v-for="(n, i) in [8, 7]">
                        <dt class="gr_number__item--title">
                            <i class="gr_item__title--icon">{{n}}</i>
                        </dt>
                        <dd class="gr_number__item--content">
                            <span class="gr_item__content--item">{{lastNumber[i]}}</span>
                        </dd>
                    </dl>
                </div>
                <div class="gr_number__footer">
                    <i class="el-icon-arrow-down"/>
                </div>
            </div>
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
import { mapGetters, mapActions } from 'vuex'
export default {
    name: 'GamesHeaderLocal',
    components: {
        LotteryLogo,
        FlipTimer,
        LotteryPeriod,
        LotteryStatus,
        MyFavoritesIcon
    },
    props: {
        historyToggle: Boolean,
        handleHistoryToggle: Function
    },
    beforeMount() {
        this[_M.GET_GAME_LASTNUMBER_VN]()
    },
    methods: {
        ...mapActions([
            _M.GET_GAME_LASTNUMBER_VN,
            _M.SET_GAME_LASTNUMBER_VN
        ])
    },
    watch: {
        VN_currentlottery() {
            this[_M.SET_GAME_LASTNUMBER_VN]()
            this[_M.GET_GAME_LASTNUMBER_VN]()
        }
    },
    computed: {
        ...mapGetters([
            'VN_localJsDynamic',
            'VN_currentlottery',
            'VN_localArea',
            'VN_localIssue',
            'VN_lastIssue',
            'VN_lastNumber'
        ]),
        lastNumber() {
            return this.VN_lastNumber.split(',')
        }
    }
}
</script>
