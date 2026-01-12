<template>
<div>
    <div class="gr_hamburger" :class='isBackClass' @click="handleHamburgar(toggleHamburger)">
        <svg class="gr_hamburger__icon" viewBox="0 0 33.19 28">
            <path class="gr_icon__decoration" d="M26.9,23.9L11.4,8.4L4.8,1.9c-3.7,1.1-5.4,12.1-3,15h30C34.2,12.5,26,0.7,21.1,0L6.3,13.4"/>
            <path class="gr_icon__decoration" d="M26.9,3.4L11.4,18.9l-6.5,6.5c-3.7-1.1-5.4-12.1-3-15h30c2.4,4.4-5.8,16.2-10.7,16.9L6.4,14"/>
        </svg>
    </div><!-- gr_game-hamburger -->
    <div v-show="isShowListIcon" class="gr_game-hamburger" :class='{is_active: isPopActive, black: isBlackTheme}' @click.stop="gameHamburgerOpen">
        <svg class="gr_game-hamburger__icon" viewBox="0 0 28.1 23.84">
            <polygon class="gr_icon__decoration" points="23.47 23.47 23.47 18.61 21.64 16.78 21.64 0.38 2.2 0.38 2.2 16.78 0.38 18.61 0.38 23.47 23.47 23.47" />
            <rect class="gr_icon__decoration" x="4.63" y="8.88" width="4.86" height="7.29" />
            <rect class="gr_icon__decoration" x="9.49" y="8.88" width="4.86" height="7.29" />
            <rect class="gr_icon__decoration" x="14.35" y="8.88" width="4.86" height="7.29" />
            <rect class="gr_icon__decoration" x="4.63" y="2.81" width="14.58" height="3.65" />
            <line class="gr_icon__animation  gr_icon__animation--1" x1="6.9" y1="8.88" x2="6.9" y2="16.17" />
            <line class="gr_icon__animation  gr_icon__animation--2" x1="11.9" y1="8.88" x2="11.9" y2="16.17" />
            <line class="gr_icon__animation  gr_icon__animation--3" x1="16.9" y1="8.88" x2="16.9" y2="16.17" />
            <path class="gr_icon__decoration" d="M21.64,10.71h4.86a1.22,1.22,0,0,1,1.22,1.22v1.22a1.22,1.22,0,0,1-1.22,1.22H21.64a0,0,0,0,1,0,0V10.71A0,0,0,0,1,21.64,10.71Z" />
            <circle class="gr_icon__circle  gr_icon__decoration" cx="25.9" cy="3.41" r="1.82" />
            <line class="gr_icon__bar  gr_icon__decoration" x1="25.9" y1="5.24" x2="25.9" y2="10.71" />
        </svg>
    </div><!-- gr_game-hamburger -->
    <div v-show="isShowHomeIcon" class="gr_game-hamburger" @click.stop="handleToHome">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23.07776 19.625"><path d="M22.168,8.169,18.883,5.72123V.90316H14.87437v1.831L12.14668.70191a1.01721,1.01721,0,0,0-1.21656,0L.90975,8.169a1.01834,1.01834,0,0,0,.60855,1.83462H3.0109V19.125H9.072V11.66314h4.93341V19.125h6.0614V10.00361h1.4926A1.01836,1.01836,0,0,0,22.168,8.169Z" style="fill:none;stroke:#ffcb85;stroke-miterlimit:10"/></g></g></svg>
    </div>
    <div class="gr_game-lottery" :class="{is_active: isPopActive}" v-show="isShowLotteryTitle">
        <span @click.stop="handleLotteryTitle">
            {{$t(globalLottery.title_key)}}
            <i class="el-icon-arrow-down" />
        </span>
    </div>
    <div class="gr_header__game-menu" :class="{'gr_header__game-menu--black': isBlackTheme}" @click.stop>
        <!-- 选单 -->
        <div v-if="isBlackTheme" class="gr_game-menu__content black">
            <BlackTheme />
        </div>
        <template v-else>
            <div class="c_dropdown-box__btnWa">
                <div class="gr_game-menu__header">
                    <div class="gr_game-menu__arrow--prev" ref="prev" @click.prevent="menuMove('prev')" :class="{is_active: is_prev}"></div>
                    <div class="gr_game-menu__arrow--next" ref="next" @click.prevent="menuMove('next')" :class="{is_active: is_next}"></div>
                    <div class="gr_game-menu__btnWa" ref="btnWa">
                        <div
                            class="gr_game-menu__btnGroup"
                            ref="btnGroup"
                            :style="{
                                'width': `${menuWidth}px`,
                                'transform': `translateX(${menuX}px)`,
                                'padding': `0 ${menuPad}px`,
                                }"
                            @touchstart="menuTouchStart"
                            @touchmove.stop.prevent="menuTouchMove"
                        >
                            <button
                                v-for="mid in menuIdList"
                                :key="mid"
                                class="gr_header__button"
                                :class="{is_active: getMenuId === +mid}"
                                @click.stop="menuClick(mid)"
                                v-if="isShowUpper && lotteryMenu[mid]"
                                ref="lotteryIcon"
                            >
                                <a :class="iconClass[mid]"></a>
                            </button>
                            <!-- <button class="gr_header__button">
                                <a class="c_menu--lotteryMas"></a>
                                <span>马来西亚彩</span>
                            </button> -->
                        </div>
                    </div>
                </div>
            </div>
            <div class="gr_game-menu__content">
                <el-collapse :value="(isInGame)? gameType: '' " accordion>
                    <el-collapse-item  v-for="(menu, index) in filteredLotteryList" :key="menu.title" :title='$t(menu.title_key).replace(/(\[.+\])|(\(.+\))/, "")' :name="index">
                        <div v-for="menus in menu.childs" :key="menus.lottery" @click.stop="menuItemClick(0)">
                            <template v-if="!menus.isNotOpen">
                                <router-link
                                    class="el-collapse-item__link"
                                    :to="gameRouter(getMenuId, menus.lottery)"
                                    v-if="[1, 2, 4, 5, 6, 7, 8].includes(getMenuId) && !getLolli.includes(menus.lottery)"
                                >
                                    <span class="el-link__text">{{$t(menus.title_key).replace(/(\[.+\])|(\(.+\))/, "")}}</span>
                                    <i class="el-link__icon  i_play" v-if="!!isiframeGame[menus.lottery]" />
                                    <!-- <i v-if="menus.lottery === 1" class="i_closed"></i> -->
                                    <i v-if="lotteryClosed[menus.lottery]" class="i_closed"></i>
                                </router-link>
                                <a
                                    class="el-collapse-item__link"
                                    :class="{'router-link-active' : vnMenuActive(menus)}"
                                    @click="vnRoute(menus)"
                                    v-if="getMenuId === 3">
                                    <span class="c_link__text">{{$t(menus.title_key)}}</span>
                                    <i class="el-link__icon  i_play" v-if="!!isiframeGame[menus.lottery]" />
                                    <i v-if="lotteryClosed[menus.lottery ? menus.lottery : `vn${(menus.menuId + 1)}`]" class="i_closed"></i>
                                </a>
                            </template>
                            <a
                                class="el-collapse-item__link  el-collapse-item__link--disabled"
                                v-else
                            >
                                <span class="el-link__text">{{$t(menus.title_key).replace(/(\[.+\])|(\(.+\))/, "")}}</span>
                                <i class="el-link__icon  i_play" v-if="!!isiframeGame[menus.lottery]" />
                                <i v-if="lotteryClosed[menus.lottery]" class="i_closed"></i>
                            </a>
                        </div>
                    </el-collapse-item>
                </el-collapse>
            </div>
        </template>

    </div><!-- nav -->
    <div class="gr_header__menu" ref="nav">
        <div class="gr_menu__inner">
            <!-- 用户资讯 -->
            <HeaderUserarea />
            <ul class="gr_menu__list" @click="removeBodyScroll()">
                <li v-if="!lotsOneLotGame" class="gr_list__item" @click="handleHamburgar(false)">
                    <router-link class="gr_item__link" to="/" exact>
                        <!-- '游戏清单' -->
                        {{$t('home_007')}}
                    </router-link>
                </li>
                <li class="gr_list__item">
                    <router-link class="gr_item__link" to="/SalesTime" exact>
                        <!-- '贩售时间' -->
                        {{$t('timetable_003')}}
                    </router-link>
                </li>
                <li class="gr_list__item">
                    <router-link class="gr_item__link" to="/GameInfo">
                        <!-- '投注记录' -->
                        {{$t('home_009')}}
                    </router-link>
                </li>
                <!-- '追号记录' -->
                <!-- <li class="gr_list__item" v-if="isShowTaskButton && !lotsOneLotGame">
                    <router-link class="gr_item__link" to="/AddNewGameInfo">
                        {{$t('home_010')}}
                    </router-link>
                </li> -->
                <li class="gr_list__item">
                    <router-link class="gr_item__link" to="/WinLose">
                        <!-- '输赢报表' -->
                        {{$t('home_062')}}
                    </router-link>
                </li>
                <li class="gr_list__item" v-if="!isRich">
                    <router-link class="gr_item__link" to="/ReportList">
                        <!-- '盈亏查询' -->
                        {{$t('home_011')}}
                    </router-link>
                </li>
                <li class="gr_list__item" v-if="!isShowDemo">
                    <router-link class="gr_item__link" to="/Wallet">
                        <!-- '钱包记录' -->
                        {{$t('home_012')}}
                    </router-link>
                </li>
                <li class="gr_list__item" v-if="isShowHowToplay">
                    <router-link class="gr_item__link" v-if="isMobile" :to="how2PlayPath">
                        <!-- '玩法说明' -->
                        {{$t('home_013')}}
                    </router-link>
                    <a class="gr_item__link" v-else :href="how2PlayPath" target="_blank">
                        <!-- '玩法说明' -->
                        {{$t('home_013')}}
                    </a>
                </li>
                <li class="gr_list__item">
                    <router-link class="gr_item__link" to="/NewsEvents">
                        <!-- '最新公告' -->
                        {{$t('home_014')}}
                    </router-link>
                </li>
                <!-- '手机APP' -->
                <!--
                <li class="gr_list__item" v-if="IsDisplay('appPage') && lang === 'cn'">
                    <router-link class="gr_item__link" to="/APPQRCode">
                        {{$t('home_015')}}
                    </router-link>
                </li>
                 -->
                <li class="gr_list__item" v-if="isShowScoreBoard">
                    <router-link class="gr_item__link" to="/ScoreBoard">
                        <!-- '名人榜' -->
                        {{$t('celebrity_001')}}
                    </router-link>
                </li>
                <li class="gr_list__item" v-if="isUnity()">
                    <a class="gr_item__link" @click="openUnity" href="javascript:void(0);">
                        <!-- '返回大厅' -->
                        {{$t('home_051')}}
                    </a>
                </li>
            </ul>
        </div>
    </div>


    <!-- <div class="wrap_close" ref="wrapClose"  @click="handleHamburgar(false)" /> -->
</div>
</template>
<script>

import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'
import { Observable } from 'rxjs/Observable'
import { formatNumber } from '@UTIL'
import HeaderNavbar from '../980/HeaderNavbar'
import HeaderUserarea from './HeaderUserarea'
import Collapse from '@E/packages/collapse/index.js'
import CollapseItem from '@E/packages/collapse-item/index.js'
import BlackTheme from './BlackTheme'
export default {
    name: 'HeaderNavbar',
    mixins: [HeaderNavbar],
    components: {
        MenuText: Vue.component('MenuText', {
            // {{$t("选单")}}
            template: '<span class="gr_title__text">{{$t(\'home_006\')}}</span>'
        }),
        GameText: Vue.component('GameText', {
            // {{$t("游戏")}}
            template: '<span class="gr_title__text">{{$t(\'home_005\')}}</span>'
        }),
        [Collapse.name]: Collapse,
        [CollapseItem.name]: CollapseItem,
        HeaderUserarea,
        BlackTheme
    },
    data() {
        return {
            toggleHamburger: true,
            menuWidth: 0,
            menuX: 0,
            menuPad: 34,
            lotteryIconW: 0,
            screenWidth: 0,
            is_prev: false,
            is_next: true,
            startX: 0,
            moveX: 0
        }
    },
    beforeMount() {
        // 一開始進入越南全區再點進歷史獎期，返回上一頁"<"會抓不到頁面
        if (this.$router.history.current.fullPath === '/GamePlayerVN?p=0') {
            this.$router.push({path: '/GamePlayerVN', query: {t: 'Old', p: '0', m: '0'}})
        }
    },
    methods: {
        ...mapActions([
            _M.SET_HAMBURGAR,
            _M.SET_HEADER_NAV_ACTIVE_NAME,
            _M.GET_WALLET_BALANCE,
            _M.SET_IS_SIN,
            _M.SET_POP_ACTIVE,
            _M.SET_HEADER_NAV_IS_BACK,
            _M.GET_LOTTERY_STATUS
        ]),
        isUnity() {
            return window.isUnity
        },
        handleHamburgar(boolean) {
            this.$refs.nav.scrollTop = 0
            if (this.isHistory) {
                if (this.$route.params.type === 'vn') {
                    this.$router.go(-1)
                    this.$nextTick(() => this.back())
                } else {
                    const type = this.$route.params.type
                    const routeObj = {
                        thail: 'GamePlayerTH',
                        stock: 'GamePlayerStock',
                        la: 'GamePlayerLA',
                        my: 'GamePlayerMY'
                    }
                    let routeName = routeObj[type]
                    this.$router.push({
                        path: `/${routeName}/${this.$route.query.menuCode}`
                    })
                }
            } else if (this.isBack && this.RWDMode !== 1) {
                this.back()
            } else {
                this[_M.SET_HAMBURGAR](boolean)
                this.toggleHamburger = !this.toggleHamburger
                var bodyNoScroll = document.body.classList
                if (!this.toggleHamburger) {
                    bodyNoScroll.add('bodyNoScroll')
                } else {
                    bodyNoScroll.remove('bodyNoScroll')
                }
            }
        },
        gameHamburgerOpen() {
            if (this.isOneLotGame) {
                this.$router.push(this.oneLotGameRouter)
            } else if (this.isW88) {
                this.$router.push('/')
            } else {
                this[_M.SET_POP_ACTIVE]({gameHamburger: !this.isPopActive})
                let bodyNoScroll = document.body.classList
                if (this.isPopActive) {
                    bodyNoScroll.add('bodyNoScroll')
                    // 菜單打開時,切換到當前分類頁面
                    let menuId = this.getMenuId
                    switch (this.$route.name) {
                        case 'GamePlayer':
                            if (this.isFT) {
                                menuId = 5
                            } else if (this.isSin) {
                                menuId = 2
                            } else {
                                menuId = 1
                            }
                            break
                        case 'GamePlayerVN':
                            menuId = 3
                            break
                        case 'GamePlayerTH':
                            menuId = 6
                            break
                        case 'GamePlayerLA':
                            menuId = 9
                            break
                        case 'GamePlayerMY':
                            menuId = 10
                            break
                    }
                    this[_M.SET_MENU_ID](menuId)
                } else {
                    bodyNoScroll.remove('bodyNoScroll')
                }
                // 彩種狀態
                this.isPopActive && this[_M.GET_LOTTERY_STATUS]()
            }
            if (!this.isBlackTheme) {
                const totalW = this.$refs.lotteryIcon.reduce((total, val) => {
                    this.lotteryIconW = val.clientWidth
                    return total + val.clientWidth
                }, 0)
                this.screenWidth = this.$refs.btnWa.clientWidth
                this.menuX = 0
                if (this.screenWidth < totalW) {
                    this.menuPad = 34
                    this.menuWidth = totalW + this.menuPad * 2
                    if (this.getMenuId === 5) {
                        // 跳至番攤
                        this.menuX = -this.lotteryIconW
                        if (this.menuWidth - Math.abs(this.menuX) < this.screenWidth) {
                            this.menuX = this.screenWidth - this.menuWidth
                        }
                    } else if (this.getMenuId === 3) {
                        // 跳至越南
                        this.menuX = -(this.lotteryIconW * 2)
                        if (this.menuWidth - Math.abs(this.menuX) < this.screenWidth) {
                            this.menuX = this.screenWidth - this.menuWidth
                        }
                    }
                } else {
                    this.menuWidth = totalW
                    this.menuPad = 0
                }
                this.arrowShow()
            }
        },
        arrowShow() {
            // prev, next 顯示隱藏
            this.menuX < 0 ? this.is_prev = true : this.is_prev = false
            this.menuWidth - Math.abs(this.menuX) <= this.screenWidth ? this.is_next = false : this.is_next = true
        },
        menuMove(e) {
            // prev, next 座標移動
            if (e === 'prev') {
                if (this.menuX >= -4) {
                    this.menuX = +this.menuX + +this.lotteryIconW * 2
                } else {
                    this.menuX = 0
                }
            } else if (e === 'next') {
                this.menuX = +this.menuX - +this.lotteryIconW * 2
                if (this.menuWidth - Math.abs(this.menuX) < this.screenWidth) {
                    this.menuX = this.screenWidth - this.menuWidth
                }
            }
            this.arrowShow()
        },
        menuTouchStart(e) {
            this.startX = e.clientX || e.touches[0].clientX
        },
        menuTouchMove(e) {
            if (this.menuWidth > this.screenWidth) {
                const moveX = e.clientX || e.touches[0].clientX
                const diff = (this.startX - moveX) * 1.5
                const max = -(this.menuWidth - this.screenWidth)
                this.startX = moveX
                this.menuX = Math.max(Math.min(this.menuX - diff, 0), max)
                this.arrowShow()
            }
        },
        back() {
            this.$root.$emit('back')
        },
        removeBodyScroll() {
            document.body.classList.remove('bodyNoScroll')
        },
        menuClick(menuId) {
            switch (+menuId) {
                // 中國彩-官方
                // 中國彩-信用
                case 1:
                case 2:
                    this[_M.SET_IS_SIN](+menuId === 2)
                    break
            }
            this[_M.SET_MENU_ID](menuId)
        },
        openUnity() {
            window.location.href = 'uniwebview://return-menu'
        },
        menuItemClick() {
            this.closeAllPopMenu(0)
            this.removeBodyScroll()
            this.back()
        },
        // 彩種標題下拉彩種清單
        handleLotteryTitle() {
            !this.isPopActive && this.$root.$emit('forceUpdateLottery')
            this.gameHamburgerOpen()
        },
        // 回首頁
        handleToHome() {
            this.$route.name !== 'Home' && this.$router.push('/')
        }
    },
    subscriptions() {
        return {
            getBalance$: this.$createObservableMethod('getBalance')
                .debounceTime(1000)
                .do(() => this[_M.GET_WALLET_BALANCE](true)),
            pinned$: Observable
                .interval(0)
                .map(top => {
                    try {
                        return this.$refs.nav.scrollTop > 50 ? 'pinned' : ''
                    } catch (error) {
                        return ''
                    }
                }
                )
                .distinctUntilChanged()
                .map(className => this.hamburgar ? className : '')
        }
    },
    computed: {
        ...mapGetters([
            'availableBalance',
            'JWT',
            'isTest',
            'isDemo',
            'isBack',
            'RWDMode',
            'hamburgar',
            'navActiveName',
            'lang',
            'lotteryList2',
            'isDev',
            'isOneLotGame',
            'oneLotGameRouter',
            'isW88',
            'getLolli',
            'gameShowMode',
            'isRich',
            'isBlackTheme',
            'lotteryStatus',
            'VN_isLocal',
            'VN_currentlottery',
            'currentLottery',
            'TH_currentLottery',
            'globalLottery',
            'lotteryClosed'
        ]),
        activeName: {
            get() {
                return this.navActiveName
            },
            set(value) {
                this[_M.SET_HEADER_NAV_ACTIVE_NAME](value)
            }
        },
        userName() {
            if (this.JWT && this.JWT.user_nickname) {
                return this.JWT.user_nickname
            }
            // 亲爱的用户
            return this.$t('home_019')
        },
        isBackClass() {
            return (this.isBack && this.RWDMode !== 1) || this.isHistory ? 'is_back' : ''
        },
        lotteryId() {
            return this.$route.params.lottery
        },
        gameType() {
            // 越南彩 filteredLotteryList index: VN
            return this.$route.name === 'GamePlayerVN'
                ? 'VN'
                : (this.lotteryList2[this.lotteryId] || {}).name || ''
        },
        availableBalanceFormat() {
            return formatNumber(this.availableBalance)
        },
        isInGame() {
            return this.$route.name.includes('GamePlayer')
        },
        isPopActive() {
            return this.getPopActive.gameHamburger
        },
        isHistory() {
            return this.$route.name === 'History'
        },
        isHome() {
            return this.$route.name === 'Home'
        },
        isShowLotteryTitle() {
            return this.globalLottery && this.isBlackTheme
        },
        isShowListIcon() {
            return (!this.globalLottery && !this.isHome) || !this.isBlackTheme
        },
        isShowHomeIcon() {
            return (this.isHome || this.globalLottery) && !this.lotsOneLotGame && this.isBlackTheme
        }
    }
}
</script>
