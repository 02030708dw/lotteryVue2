<template>
    <div class="gr_games-header  gr_games-header--320  gr_container bg_secondary">
        <div class="gr_games-header__inner gr_games-stock__inner u_clearfix">
            <div class="gr_games-header__sectoin">
                <div class="gr_games-header__my-favorites  gr_my-favorites__tooltip"
                    :class="{is_active: isInFavorites, is_tooltip: isTip}"
                    @click="setMyFavorites"
                >
                    <svg class="gr_my-favorites__icon" viewBox="0 0 17.85 16.11">
                        <path d="M8.93,3.15C8.17-.47,2.14-.66.77,3.65c-2.18,6.79,6.67,9,8.16,12,1.48-3.07,10.32-5.25,8.15-12C15.71-.66,9.68-.47,8.93,3.15Z" />
                    </svg>
                    <span class="gr_tooltip__arrow" />
                    <div class="gr_tooltip__popper">{{$t(tipTxt)}}</div>
                </div>
                <span class="gr_games-header__title">{{$t(lotteryNameKey)}}</span>
            </div>
            <div class="gr_games-header__desc gr_games-stock__twotime" v-if="isOpen">
                <span>{{numberFormat}}</span>
                <div>{{$t('home_059')}}<span>{{countDownNoon}}</span></div>
                <div>{{$t('home_060')}}<span>{{countDownAfternoon}}</span></div>
            </div>
            <div class="gr_games-header__desc  is_empty" v-else>
                <!-- {{$t("目前尚未开放奖期")}} -->
                {{$t('common_003')}}
            </div>
            <LotteryStatus />
            <div :class="['gr_games-header__history-toggle', {is_active: isPopActive}]" @click.stop="handleIsActive()">
                <i class="gr_history-toggle__icon  el-icon-arrow-down" />
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { warnMessageBox } from '@UTIL'
import LotteryStatus from './LotteryStatus'

export default {
    name: 'GamesHeader2Timer',
    data() {
        return {
            gameModeTemp: 0,
            isSetFavoriting: false,
            isTip: false,
            tipTimer: null,
            tipTxt: '',
            setFavoritingTimer: null
        }
    },
    components: {
        LotteryStatus
    },
    beforeDestroy() {
        clearTimeout(this.tipTimer)
        clearTimeout(this.setFavoritingTimer)
    },
    computed: {
        ...mapGetters([
            'lotteryNameKey',
            'game',
            'gameShowMode',
            'myFavorites',
            'getPopActive',
            'currentjsDynamicData',
            'flipTimer',
            'number'
        ]),
        ...mapGetters({
            lotteryId: 'gameLotteryId'
        }),
        isInFavorites() {
            return this.myFavorites.includes(this.lotteryId)
        },
        isPopActive() {
            return this.getPopActive.gameHistory
        },
        isOpen() {
            return !!this.currentjsDynamicData.number
        },
        // 當前是否有複數獎期可投
        is2Timer() {
            return (this.currentjsDynamicData.issue || []).length > 0
        },
        // 上午倒數
        countDownNoon() {
            return this.transtime(this.is2Timer ? this.flipTimer.muti[0] : {})
        },
        // 下午倒數
        countDownAfternoon() {
            return this.transtime(this.is2Timer ? this.flipTimer.muti[1] : this.flipTimer)
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
    },
    methods: {
        ...mapActions([
            _M.T_GAME_TOOLS,
            _M.SET_GAME_SHOW_MODE,
            _M.SET_HEADER_NAV_IS_BACK,
            _M.SET_MY_FAVORITES,
            _M.SET_POP_ACTIVE
        ]),
        showTools() {
            this.gameModeTemp = this.gameShowMode
            this.gameModeTemp === 2 && this[_M.SET_HEADER_NAV_IS_BACK](false)
            this[_M.SET_GAME_SHOW_MODE](1)
        },
        closeTools() {
            this.gameModeTemp === 2 && this[_M.SET_HEADER_NAV_IS_BACK](true)
            this[_M.SET_GAME_SHOW_MODE](this.gameModeTemp)
        },
        async setMyFavorites() {
            if (!this.isSetFavoriting) {
                this.isSetFavoriting = true
                let data
                if (this.isInFavorites) {
                    data = this.myFavorites.filter(id => id !== this.lotteryId)
                    // '已取消最爱'
                    this.tipTxt = 'common_135'
                } else if (this.myFavorites.length >= 30) {
                    //return this.isSetFavoriting = false 超過30 tip
                    // '最多30个最爱彩种'
                    this.tipTxt = 'home_043'
                } else {
                    data = [...this.myFavorites, this.lotteryId]
                    // '已加入最爱'
                    this.tipTxt = 'common_136'
                }
                const isNotError = data ? await this[_M.SET_MY_FAVORITES](data) : true
                this.setFavoritingTimer = setTimeout(() => (this.isSetFavoriting = false), 500)
                if (isNotError) {
                    this.isTip = true
                    clearTimeout(this.tipTimer)
                    this.tipTimer = setTimeout(() => (this.isTip = false), 3000)
                } else {
                    this.$msg(warnMessageBox({
                        // '系统繁忙中，请再试一次。'
                        message: this.$t('popup_098')
                    }))
                }
            }
        },
        handleIsActive() {
            this[_M.SET_POP_ACTIVE]({gameHistory: !this.isPopActive})
        },
        transtime(data) {
            return (data || {}).isCountDown
                ? `${data.hours || '00'}:${data.minutes || '00'}:${data.seconds || '00'}`
                : '00:00:00'
        }
    }
}
</script>
