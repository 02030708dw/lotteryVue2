<template>
    <div class="gr_games-header  gr_games-header--320  gr_container bg_secondary">
        <div class="gr_games-header__inner  u_clearfix">
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
            <div class="gr_games-header__desc" v-if="isOpen">
                <div class="gr_desc__draw">
                    #{{getDate}}
                </div>
                <div class="gr_desc__time">{{codeTime}}</div>
            </div>
            <div class="gr_games-header__desc  is_empty" v-else>
                <!-- {{$t("目前尚未开放奖期")}} -->
                {{$t('common_003')}}
            </div>
            <div class="gr_games-header__last">
                <div class="gr_last__number">#{{lastnumber}}</div>
                <div class="gr_last__balls">
                    <template v-for='(ball, i) in lastballs'>
                        <span class="gr_balls__text  text_color_accent" :key="`ball_${i}`">{{ball || '-'}}</span>
                        <span class="gr_balls__text" :key="`comma_${i}`" v-if="lastballs.length - 1 > i">,</span>
                    </template>
                </div>
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
    name: 'GamesHeaderNormal',
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
        }
    },
    computed: {
        ...mapGetters([
            'lotteryNameKey',
            'game',
            'gameShowMode',
            'lastballs',
            'lastnumber',
            'number',
            'codeTime',
            'myFavorites',
            'getPopActive',
            'currentjsDynamicData'
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
        // 回傳獎期日期 ex: 20191120-002 -> 2019-11-20
        getDate() {
            const rawDate = `${this.number}`.split('-')[0]
            return moment(rawDate).format('YYYY-MM-DD')
        }
    }
}
</script>
