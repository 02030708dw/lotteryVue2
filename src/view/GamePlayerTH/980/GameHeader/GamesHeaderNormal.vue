<template>
    <div class="gr_games-th-header  gr_container">
        <MyFavoritesIcon />
        <LotteryLogo />
        <div
            class="gr_games-th-header__square  gr_games-th-header__square--medium"
        > <!-- className: is_active -->
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
        <div
            class="gr_games-th-header__square  gr_games-th-header__square--long"
        >
            <!-- 第{0}期 -->
            <i18n path="common_001" tag="span">
                <strong class="u_f--bold" place="0">{{TH_lastnumber}}</strong>
            </i18n>
            <span>
                <!-- {{$t("开奖号")}} -->
                {{$t('common_005')}}
            </span>
            <div class="gr_games-th-header__warp">
                <div
                    class="gr_games-th-header__number  gr_game-info__number"
                    :class="{is_active: !$parent.$parent.historyToggle}"
                    ref="initPos"
                    @click.stop="$parent.$parent.handleHistoryToggle($event)"
                >
                    <div class="gr_number__content">
                        <dl class="gr_number__content--item">
                            <dt class="gr_number__item--title">{{$t('thai_012')}}</dt>
                            <dt class="gr_number__item--title">{{$t('thai_004')}}</dt>
                            <dt class="gr_number__item--title">{{$t('thai_005')}}</dt>
                            <dt class="gr_number__item--title">{{$t('thai_013')}}</dt>
                        </dl>
                        <dl class="gr_number__content--item">
                            <dd class="gr_number__item--content">
                                <span>{{lastNumber[0]}}</span>
                            </dd>
                            <dd class="gr_number__item--content">
                                <span>{{lastNumber[1]}}</span>
                                <span>{{lastNumber[2]}}</span>
                            </dd>
                            <dd class="gr_number__item--content">
                                <span>{{lastNumber[3]}}</span>
                                <span>{{lastNumber[4]}}</span>
                            </dd>
                            <dd class="gr_number__item--content">
                                <span>{{lastNumber[5]}}</span>
                            </dd>
                        </dl>
                    </div>
                    <div class="gr_number__footer">
                        <i class="el-icon-arrow-down"/>
                    </div>
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
    name: 'Old',
    components: {
        LotteryLogo,
        FlipTimer,
        LotteryPeriod,
        LotteryStatus,
        MyFavoritesIcon
    },
    beforeMount() {
        // this[_M.GET_GAME_LASTNUMBER_VN]()
    },
    methods: {
        ...mapActions([
            // _M.GET_GAME_LASTNUMBER_VN,
            // _M.SET_GAME_LASTNUMBER_VN
        ])
    },
    // watch: {
    //     VN_currentlottery() {
    //         this[_M.SET_GAME_LASTNUMBER_VN]()
    //         this[_M.GET_GAME_LASTNUMBER_VN]()
    //     }
    // },
    computed: {
        ...mapGetters([
            'TH_lastnumber',
            'TH_lastballs',
            'TH_number',
            'TH_lotteryId'
        ]),
        isOpen() {
            return !!this.TH_number && this.TH_number !== 'null'
        },
        lastNumber() {
            return this.TH_lastballs.split(',')
        },
        // 回傳格式化後的期號 ex: 20191120-002 -> 11-20 (三)
        numberFormat() {
            const rawDate = `${this.TH_number}`.split('-')[0]
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
            return (+this.TH_lotteryId === 242) ? `${date} (${dayName})` : this.TH_number
        }
    }
}
</script>
