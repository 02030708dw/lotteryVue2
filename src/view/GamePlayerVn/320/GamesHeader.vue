<template>
    <div class="gr_games-vn-header  gr_games-vn-header--320  gr_container bg_secondary">
        <div class="gr_games-vn-header__inner  u_clearfix">
            <vnd-header>
                <template #top>
                    <div class="l">
                        <span>{{ VN_localIssue|fIssue }}</span>
                        <div class="gr_games-vn-header__nubmer_new" @click.stop="handleHistoryToggle" v-if="VN_isLocal">
                            <dt class="gr_number__nubmer_new--title">
                                <i class="gr_item__title--icon">{{ 8 }}</i>
                                <span class="gr_number__nubmer_new"> {{ lastNumber[8] }}</span>
                            </dt>
                            <dt class="gr_number__nubmer_new--title">
                                <i class="gr_item__title--icon">{{ 1 }}</i>
                                <span class="gr_number__nubmer_new"> {{ lastNumber[7] }}</span>
                            </dt>
                        </div>
                    </div>
                    <div class="r">
                        <span>{{ VN_lastIssue | fIssue}}</span>
                        <div class="gr_games-vn-header__desc" v-if="VN_isLocal">
                                <span class="gr_desc__draw" v-if="isOpen">
                                    <!-- {{$t("目前尚未开放奖期")}} -->
                                    {{ $t('common_003') }}
                                </span>
                            <span v-else>
<!--                                    &lt;!&ndash; 第{0}期 &ndash;&gt;
                                    <i18n path="common_001" tag="span">
                                        <strong place="0">{{ VN_localIssue }}</strong>
                                    </i18n>-->
                                    <span class="gr_desc__draw">
                                        <strong>{{ localTimer }}</strong>
                                    </span>
                                </span>
                        </div>
                        <div class="gr_games-vn-header__desc" v-else>
                                <span class="gr_desc__draw" v-if="isOpen">
                                    <!-- {{$t("目前尚未开放奖期")}} -->
                                    {{ $t('common_003') }}
                                </span>
                            <span v-else>
                                    <span class="gr_desc__draw" v-show="VN_lotteryOfficialSwitch['VN_S']">
                                        <!-- 南 -->
                                        {{ $t('vn_t_048') }}
                                        <strong>{{ VN_S_timer }}</strong>
                                    </span>
                                    <span class="gr_desc__draw" v-show="VN_lotteryOfficialSwitch['VN_C']">
                                        <!-- 中 -->
                                        {{ $t('vn_t_049') }}
                                        <strong>{{ VN_C_timer }}</strong>
                                    </span>
                                    <span class="gr_desc__draw" v-show="VN_lotteryOfficialSwitch['VN_N']">
                                        <!-- 北 -->
                                        {{ $t('vn_t_050') }}
                                        <strong>{{ VN_N_timer }}</strong>
                                    </span>
                                </span>
                        </div>
                    </div>
                </template>
            </vnd-header>
        </div>
    </div>
</template>
<script>
import {mapActions, mapGetters} from 'vuex'
import {warnMessageBox} from '@UTIL'
import {getData} from '@V/SalesTime/config/data'
import RollTxt from './header/rollTxt.vue'
import VndHeader from './header/vndHeader.vue'

export default {
    name: 'GamesHeader320',
    components: {VndHeader, RollTxt},
    data() {
        return {
            gameModeTemp: 0,
            isSetFavoriting: false,
            isTip: false,
            tipTimer: null,
            tipTxt: '',
            isOpen: false,
            gameShowMode: 0,
            setFavoritingTimer: null,
            // statusX: {}
            maxWStatus: ''
        }
    },
    beforeDestroy() {
        clearTimeout(this.tipTimer)
        clearTimeout(this.setFavoritingTimer)
    },
    props: {
        handleHistoryToggle: {
            type: Function,
            required: true
        }
    },
    watch: {
        VN_currentlottery(newVal, oldVal) {
            // console.log('[Header320 watch]', this._uid, 'old=', oldVal && oldVal.name, 'new=', newVal && newVal.name)
            this[_M.SET_GAME_LASTNUMBER_VN]()
            this[_M.GET_GAME_LASTNUMBER_VN]()
        }
    },
    filters:{
      fIssue(v=''){
          return v.substring(4,v.length)
      }
    },
    methods: {
        ...mapActions([
            _M.T_GAME_TOOLS,
            _M.SET_GAME_SHOW_MODE,
            _M.SET_HEADER_NAV_IS_BACK,
            _M.SET_MY_FAVORITES,
            _M.SET_HISTORY,
            _M.SET_POP_ACTIVE,
            _M.GET_GAME_LASTNUMBER_VN,
            _M.SET_GAME_LASTNUMBER_VN
        ]),
        // showTools() {
        //     this.gameModeTemp = this.gameShowMode
        //     this.gameModeTemp === 2 && this[_M.SET_HEADER_NAV_IS_BACK](false)
        //     this[_M.SET_GAME_SHOW_MODE](1)
        // },
        // closeTools() {
        //     this.gameModeTemp === 2 && this[_M.SET_HEADER_NAV_IS_BACK](true)
        //     this[_M.SET_GAME_SHOW_MODE](this.gameModeTemp)
        // },
        async setMyFavorites() {
            if (!this.isSetFavoriting) {
                this.isSetFavoriting = true
                let data
                if (this.isInFavorites) {
                    data = this.myFavorites.filter(id => id !== this.favorId)
                    // '已取消最爱'
                    this.tipTxt = 'common_135'
                } else if (this.myFavorites.length >= 30) {
                    // '最多30个最爱彩种'
                    this.tipTxt = 'home_043'
                } else {
                    data = [...this.myFavorites, this.favorId]
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
        transtime(data) {
            return (data || {}).isCountDown ? `${data.hours}:${data.minutes}:${data.seconds}` : '00:00:00'
        },
        localTranstime(data) {
            return (data || {}).isCountDown ? `${data.minutes}:${data.seconds}` : '00:00'
        },
        // 導向到歷史獎期頁面
        goHistory() {
            this[_M.SET_HISTORY]({path: this.$route.fullPath, mode: 'add'})
            this[_M.SET_HEADER_NAV_IS_BACK](true)
            this.$router.push(this.openHistory)
        },
        toggleStatus() {
            this[_M.SET_POP_ACTIVE]({gameStatus: !this.isStatusActive})
            const lot = this.$refs.lotteryStatus
            lot.offsetWidth >= lot.offsetParent.offsetWidth &&
            (this.maxWStatus = `${lot.offsetParent.offsetWidth - 10}px`)
        },
    },
    computed: {
        ...mapGetters([
            'myFavorites',
            'lotteryMenu',
            'VN_flipTimer',
            'VN_allAreaIssue',
            'VN_currentlottery',
            'VN_week',
            'VN_isLocal',
            'VN_localArea',
            'VN_localIssue',
            'VN_lotteryOfficialSwitch',
            'isAE_VA285iwin',
            'lotteryOfficialVN',
            'VN_currentName',
            'lotListVN',
            'isIos',
            'isW88',
            'VN_pos',
            'VN_lotteryId',
            'getPopActive',
            'isOneLotGame',
            'hideOw',
            'lang',
            'isShowDemo',
            'VN_lastNumber',
            'VN_lastIssue'
        ]),
        currentTitle() {
            return this.VN_isLocal
                ? this.$t((this.VN_currentlottery || {}).title_key)
                : (this.$t((this.lotteryMenu[3] || {}).title_key) || '') + ' ' + this.issue
        },
        isInFavorites() {
            return this.myFavorites.includes(this.favorId)
        },
        favorId() {
            return (this.lotListVN[this.VN_currentName] || {}).lottery + ''
        },
        issue() {
            if (!this.VN_allAreaIssue) return ''
            const data = this.VN_allAreaIssue.split('-')[0]
            const date = moment(data)
            return `${date.format('MM-DD')} (${this.$t(this.VN_week[date.day()])})`
        },
        VN_S_timer() {
            return this.transtime(this.VN_flipTimer.VN_S)
        },
        VN_C_timer() {
            return this.transtime(this.VN_flipTimer.VN_C)
        },
        VN_N_timer() {
            return this.transtime(this.VN_flipTimer.VN_N)
        },
        localTimer() {
            return this.localTranstime(this.VN_flipTimer[this.VN_localArea])
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
        isStatusActive() {
            return this.getPopActive.gameStatus
        },
        getDataArr() {
            return getData()
        },
        // 取得販售時間資料
        getSellTime() {
            return this.getDataArr['VN_ALL'][this.VN_lotteryId]
        },
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
        // 判斷是否為自開彩
        isOpLocal() {
            const {is_op_local = false} = this.VN_currentlottery || {}
            return is_op_local
        },
        // 是否要顯示'開獎官網'按鈕
        isShowOfficalPage() {
            const notShow = [256]
            return !this.isW88 && !this.isOpLocal && !notShow.includes(+this.VN_lotteryId) && !this.isAE_VA285iwin
        },
        // 是否要顯示'開獎官網'按鈕 後端參數
        isHideOfficalPage() {
            const lottery = this.VN_isLocal || 'vn'
            return this.hideOw[lottery]
        },
        lastNumber() {
            return this.VN_lastNumber.split(',')
        }
    }
}
</script>
