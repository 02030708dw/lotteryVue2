<template>
    <div
        class="gr_games-my-header  gr_games-my-header--320  gr_container bg_secondary"
    >
        <div class="gr_games-header__inner  u_clearfix">
            <div class="gr_games-header__sectoin">
                <div class="gr_games-my-header__my-favorites  gr_my-favorites__tooltip"
                    :class="{is_active: isInFavorites, is_tooltip: isTip}"
                    @click="setMyFavorites"
                >
                    <svg class="gr_my-favorites__icon" viewBox="0 0 17.85 16.11">
                        <path d="M8.93,3.15C8.17-.47,2.14-.66.77,3.65c-2.18,6.79,6.67,9,8.16,12,1.48-3.07,10.32-5.25,8.15-12C15.71-.66,9.68-.47,8.93,3.15Z" />
                    </svg>
                    <span class="gr_tooltip__arrow" />
                    <div class="gr_tooltip__popper">{{$t(tipTxt)}}</div>
                </div>
                <span class="gr_games-my-header__title">{{$t(lotteryNameKey)}}</span>
                <span
                    class="gr_games-header__button"
                    @click="toggle"
                    v-show="isShowMedia === 0 && !$parent.showGameBox"
                >
                    <svg
                        v-if="$parent.isShowVideo || $parent.isShowIframe"
                        class="gr_button__icon"
                        viewBox="0 0 7.77 11.22"
                    >
                        <rect class="gr_icon--shadow" x="0.31" y="0.27" width="2.9" height="10.95" rx="0.55" ry="0.55" />
                        <rect class="gr_icon--shadow" x="4.87" y="0.27" width="2.9" height="10.95" rx="0.55" ry="0.55" />
                        <rect width="2.9" height="10.95" rx="0.55" ry="0.55" />
                        <rect x="4.56" width="2.9" height="10.95" rx="0.55" ry="0.55" />
                    </svg>
                    <svg
                        v-else
                        class="gr_button__icon"
                        viewBox="0 0 8.21 9.24"
                    >
                        <path class="gr_icon--shadow" d="M1,9.24A.52.52,0,0,1,.46,8.7V1A.52.52,0,0,1,1,.46a.58.58,0,0,1,.28.07L7.93,4.39a.52.52,0,0,1,0,.92L1.26,9.17A.58.58,0,0,1,1,9.24Z" />
                        <path d="M.52,8.79A.53.53,0,0,1,0,8.25V.54A.53.53,0,0,1,.52,0,.54.54,0,0,1,.8.08L7.48,3.93a.53.53,0,0,1,.27.46.55.55,0,0,1-.27.47L.8,8.71a.54.54,0,0,1-.28.08Z" />
                    </svg>
                </span>
            </div>
            <div class="gr_games-header__desc" v-if="!!MY_number && MY_number !== 'null'">
                <div class="gr_desc__draw">
                    #{{MY_number}}
                    <!-- 第{0}期 -->
                    <!-- {{$t("common_001", {'0': number})}} -->
                </div>
                <div class="gr_desc__time">{{MY_codeTime}}</div>
            </div>
            <div class="gr_games-header__desc  is_empty" v-else>
                <!-- {{$t("目前尚未开放奖期")}} -->
                {{$t('common_003')}}
            </div>

            <div class="gr_games-header__last">
                <div class="gr_last__number">#{{MY_lastnumber}}</div>
                <div class="gr_last__balls">
                    <template v-for='(ball, i) in lastballs'>
                        <span class="gr_balls__text  text_color_accent" :key="`ball_${i}`">{{ball || '-'}}</span>
                        <span class="gr_balls__text" :key="`comma_${i}`" v-if="lastballs.length - 1 > i">,</span>
                    </template>
                </div>
            </div>
            <div
                class="gr_games-my-lotteryStatus-warp"
                @click.stop="toggleStatus"
                :class="{is_active: isStatusActive}"
                v-if="getDataArr['MY'] && getSellTime"
            >
                <div class="gr_games-my-lotteryStatus-toggle">{{$t('timetable_003')}}</div>
                <div class="gr_games-my-lotteryStatus" :style="{'max-width': maxWStatus}" ref="lotteryStatus">
                    <div class="gr_games-my-lotteryStatus__sold">
                        <span class="gr_games-my-lotteryStatus__sold--title">
                            <!-- {{$t('贩售:')}} -->
                            {{$t('timetable_001')}}
                        </span>
                        <span class="gr_games-my-lotteryStatus__sold--txt">
                            {{$t(getSellTime.selling[0], {
                                '0': getSellTime.selling[1],
                                '1': getSellTime.selling[2]}
                            )}}
                        </span>
                        <span>;</span>
                    </div>
                    <div class="gr_games-my-lotteryStatus__time">
                        <span class="gr_games-my-lotteryStatus__time--title">
                            <!-- {{$t('开奖:')}} -->
                            {{$t('timetable_002')}}
                        </span>
                        <span class="gr_games-my-lotteryStatus__time--txt">
                            {{$t(getSellTime.winning[0], {
                                '0': getSellTime.winning[1],
                                '1': getSellTime.winning[2],
                                '2': getSellTime.winning[3]}
                            )}}
                        </span>
                    </div>
                </div>
            </div>
            <div :class="['gr_games-header__history-toggle', {is_active: isPopActive}]" @click.stop="handleIsActive()">
                <i class="gr_history-toggle__icon  el-icon-arrow-down" />
            </div>
            <!-- <div class="gr_games-header__button-group">
                <div class="gr_button-group__button  u_c--pointer" @click="changeMode(1)">
                    <i class="i_history" />
                </div>
                <div class="gr_button-group__button  u_c--pointer" v-if="!isSin" @click="changeMode(2)">
                    <i class="i_playinfo" />
                </div>
            </div> -->
        </div>
    </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import { warnMessageBox } from '@UTIL'
import FastGameOrder from '@C/games/MARK6_SIN/components/FastGameOrder'
import iframeGameSource from '@UTIL/games/iframeGameSource'
import { getData } from '@V/SalesTime/config/data'
const { colorData } = FastGameOrder.data()

export default {
    name: 'GamesHeader',
    data() {
        return {
            gameModeTemp: 0,
            isSetFavoriting: false,
            isTip: false,
            tipTimer: null,
            tipTxt: '',
            colorData,
            setFavoritingTimer: null,
            maxWStatus: ''
        }
    },
    beforeDestroy() {
        clearTimeout(this.tipTimer)
        clearTimeout(this.setFavoritingTimer)
    },
    props: {
        changeMode: Function,
        videoToggle: Function
    },
    methods: {
        ...mapActions([
            _M.T_GAME_TOOLS,
            _M.SET_GAME_SHOW_MODE,
            _M.SET_HEADER_NAV_IS_BACK,
            _M.SET_MY_FAVORITES,
            _M.SET_POP_ACTIVE
        ]),
        currentClass(ball) {
            try {
                const c = ball === '-'
                    ? 'r'
                    : colorData[ball][0]
                return `gr_balls__text--c-${c}`
            } catch (error) {
                console.log('error at GamesHeaderMark6.currentClass', error)
                return ''
            }
        },
        showTools() {
            this.gameModeTemp = this.isShowMedia
            this.gameModeTemp === 2 && this[_M.SET_HEADER_NAV_IS_BACK](false)
            this[_M.SET_GAME_SHOW_MODE](1)
        },
        closeTools() {
            this.gameModeTemp === 2 && this[_M.SET_HEADER_NAV_IS_BACK](true)
            this[_M.SET_GAME_SHOW_MODE](this.gameModeTemp)
        },
        toggle() {
            this.$parent.isShowVideo = !this.$parent.isShowVideo
            this.$parent.isShowIframe = !this.$parent.isShowIframe
        },
        async setMyFavorites() {
            if (!this.isSetFavoriting) {
                this.isSetFavoriting = true
                let data
                if (this.isInFavorites) {
                    data = this.myFavorites.filter(id => id !== this.MY_lotteryId)
                    // '已取消最爱'
                    this.tipTxt = 'common_135'
                } else if (this.myFavorites.length >= 30) {
                    //return this.isSetFavoriting = false 超過30 tip
                    // '最多30个最爱彩种'
                    this.tipTxt = 'home_043'
                } else {
                    data = [...this.myFavorites, this.MY_lotteryId]
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
        toggleStatus() {
            this[_M.SET_POP_ACTIVE]({gameStatus: !this.isStatusActive})
            const lot = this.$refs.lotteryStatus
            lot.offsetWidth >= lot.offsetParent.offsetWidth &&
                (this.maxWStatus = `${lot.offsetParent.offsetWidth - 10}px`)
        },
        handleBallData(balls) {
            const ballArr = balls.split(',')
            return ballArr
        }
    },
    computed: {
        ...mapGetters([
            'lotteryList2',
            'lotteryListVideo',
            'game',
            'MY_lastnumber',
            'MY_lastballs',
            'MY_number',
            'openingIssue',
            'MY_codeTime',
            'myFavorites',
            'getPopActive',
            'MY_lotteryId',
            'MY_currentLottery'
        ]),
        lastballs() {
            return this.handleBallData(this.MY_lastballs)
        },
        lotteryNameKey() {
            return this.lotteryList2[this.MY_lotteryId] && this.lotteryList2[this.MY_lotteryId].title_key
        },
        isVideoGame() {
            try {
                return !!this.lotteryListVideo[this.MY_currentLottery.name]
            } catch (err) {
                return false
            }
        },
        isShowMedia() {
            const MY_currentLottery = !iframeGameSource[this.MY_lotteryId]
            this.$emit('showMedia', !MY_currentLottery)
            return !MY_currentLottery ? 0 : 2
        },
        isInFavorites() {
            return this.myFavorites.includes(this.MY_lotteryId)
        },
        isPopActive() {
            return this.getPopActive.gameHistory
        },
        isStatusActive() {
            return this.getPopActive.gameStatus
        },
        getDataArr() {
            return getData()
        },
        bigGameType() {
            return this.gameType.toUpperCase()
        },
        // 取得販售時間資料
        getSellTime() {
            return this.getDataArr['MY'][this.$route.params.lottery]
        }
    }
}
</script>
