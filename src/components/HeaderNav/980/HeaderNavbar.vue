<template>
    <div class="gr_nav--nav-bar">
        <div
            class="gr_nav__dropdown  c_dropdown"
            :class="{ 'gr_nav__dropdown--hover  c_dropdown--hover': isGameMenuActive }"
        >
            <a class="gr_games__link" href="javascript:void(0);" @click.stop="triggerGameMenu">
                <!-- {{$t("彩票游戏")}} -->
                {{$t('home_001')}}
                <i v-if="!lotsOneLotGame" class="gr_link__arrow  el-icon-arrow-down"/>
            </a>
            <!-- :style="isGPI && 'left: 0;'"  -->
            <!-- -->
            <div class="c_dropdown-box--list-box-new" v-show="isGameMenuActive" @click.stop>
                <BlackTheme v-if="!lotsOneLotGame" />
            </div>
        </div><!-- gr_nav__dropdown -->

        <!-- <div class="gr_nav__dropdown  c_dropdown" :class="{ 'gr_nav__dropdown--hover  c_dropdown--hover': isPopActive }">
            <a class="gr_games__link" href="javascript:void(0);" @click.stop="myFavoritesOpen">
                <span :class="['gr_header__my-favorites', {is_active: isPopActive}]" >
                    <svg class="gr_my-favorites__icon" viewBox="0 0 17.85 16.11">
                        <mask id="gr_icon__mask" fill="white">
                            <path d="M8.93,3.15C8.17-.47,2.14-.66.77,3.65c-2.18,6.79,6.67,9,8.16,12,1.48-3.07,10.32-5.25,8.15-12C15.71-.66,9.68-.47,8.93,3.15Z" />
                        </mask>
                        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" mask="url(#gr_icon__mask)">
                            <g class="gr_icon__wave-line">
                                <path class="gr_icon__wave" d="M14.1,4.1c-0.9-0.1-1.5,0-2.2,0.1c-0.7,0.2-1.4,0.7-2.2,0.8C8.9,5.2,7.9,5.2,7.1,5.2c-1-0.1-1.9-0.5-1.9-0.5S4,4.2,3,4.1
                                C2.1,4,1.5,4.1,0.8,4.2C0.1,4.4-0.6,4.9-1.4,5.1C-2.2,5.2-3.2,5.2-4,5.2c-1-0.1-1.9-0.5-1.9-0.5S-7.1,4.2-8,4.1s-1.5,0-2.2,0.1
                                c-0.7,0.2-1.4,0.7-2.2,0.8c-0.8,0.1-1.7,0.2-2.6,0.1C-16,5.1-17,4.7-17,4.7V16h33.2V4.7C16.2,4.7,15,4.2,14.1,4.1"/>
                            </g>
                        </g>
                        <path class="gr_my-favorites__shape" d="M8.93,3.15C8.17-.47,2.14-.66.77,3.65c-2.18,6.79,6.67,9,8.16,12,1.48-3.07,10.32-5.25,8.15-12C15.71-.66,9.68-.47,8.93,3.15Z" />
                    </svg>
                </span>
                {{$t('home_053')}}
            </a>
            <div class="c_dropdown-arrow" />
            <div class="c_dropdown-box">
                <div class="c_dropdown-box__inner">
                    <div class="c_dropdown-box__content" @click.stop="closeAllPopMenu()">
                        <MyFavorites ref="MyFavorites" :class="{is_active: isPopActive}" v-if="!isOneLotGame" />
                    </div>
                </div>
            </div>
        </div> -->
         <!-- <div class="gr_group__item">
            <a class="gr_item__link" href="javascript:void(0);" @click="popup('favoritesPopup')">
                {{$t('112')}}
            </a>
        </div> -->
        <div v-if="!isOneLotGame" class="gr_nav__dropdown  c_dropdown" :class="{ 'gr_nav__dropdown--hover  c_dropdown--hover': isGameFavoriteMenuActive }">
            <a class="gr_games__link" href="javascript:void(0);" @click.stop="triggerFavoriteMenu">
                <!-- {{$t("我的最爱")}} -->
                <span :class="['gr_header__my-favorites', {is_active: isGameFavoriteMenuActive}]" >
                    <svg class="gr_my-favorites__icon" viewBox="0 0 17.85 16.11">
                        <mask id="gr_icon__mask" fill="white">
                            <path d="M8.93,3.15C8.17-.47,2.14-.66.77,3.65c-2.18,6.79,6.67,9,8.16,12,1.48-3.07,10.32-5.25,8.15-12C15.71-.66,9.68-.47,8.93,3.15Z" />
                        </mask>
                        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" mask="url(#gr_icon__mask)">
                            <g class="gr_icon__wave-line">
                                <path class="gr_icon__wave" d="M14.1,4.1c-0.9-0.1-1.5,0-2.2,0.1c-0.7,0.2-1.4,0.7-2.2,0.8C8.9,5.2,7.9,5.2,7.1,5.2c-1-0.1-1.9-0.5-1.9-0.5S4,4.2,3,4.1
                                C2.1,4,1.5,4.1,0.8,4.2C0.1,4.4-0.6,4.9-1.4,5.1C-2.2,5.2-3.2,5.2-4,5.2c-1-0.1-1.9-0.5-1.9-0.5S-7.1,4.2-8,4.1s-1.5,0-2.2,0.1
                                c-0.7,0.2-1.4,0.7-2.2,0.8c-0.8,0.1-1.7,0.2-2.6,0.1C-16,5.1-17,4.7-17,4.7V16h33.2V4.7C16.2,4.7,15,4.2,14.1,4.1"/>
                            </g>
                        </g>
                        <path class="gr_my-favorites__shape" d="M8.93,3.15C8.17-.47,2.14-.66.77,3.65c-2.18,6.79,6.67,9,8.16,12,1.48-3.07,10.32-5.25,8.15-12C15.71-.66,9.68-.47,8.93,3.15Z" />
                    </svg>
                </span>
                {{$t('home_053')}}
            </a>
            <div class="c_dropdown-arrow" />
            <div class="c_dropdown-box" :class="{'is_ie9': isIE9}" :style="{'transform': myFavorites.length >= 20 ? 'translateX(-25%)' : 'translateX(-50%)'}">
                <div class="c_dropdown-box__inner">
                    <div class="c_dropdown-box__content">
                        <div class="gr_my-favorites__header">
                            <!-- '加入最爱' -->
                            <div
                                class="gr_header__add"
                                @click="popup('favoritesAddPopup')"
                            >
                                <svg class="gr_add__icon" viewBox="0 0 14.67 14.67">
                                    <rect x="6.08" width="2.5" height="14.67" />
                                    <rect x="6.08" width="2.5" height="14.67" transform="translate(14.67 0) rotate(90)" />
                                </svg>
                                <!-- '立即加入最爱彩种' -->
                                <!-- <span class="gr_add__text" >{{$t('home_038')}}</span> -->
                            </div>
                            <!-- '編輯最爱' -->
                            <svg
                                class="gr_header__edit"
                                viewBox="0 0 21.37 21.37"
                                v-if="myFavorites.length"
                                @click="popup('favoritesSetPopup')"
                            >
                                <path d="M20.89,8.66l-.56,0a1.86,1.86,0,0,1-1.61-1.15l-.06-.16h0a1.87,1.87,0,0,1,.34-2l.37-.4a.5.5,0,0,0,0-.68L17.15,2a.48.48,0,0,0-.68,0l-.42.37a1.83,1.83,0,0,1-2,.32l0,0-.13,0A1.84,1.84,0,0,1,12.77,1l0-.55A.49.49,0,0,0,12.26,0H9.14a.49.49,0,0,0-.48.48l0,.56a1.83,1.83,0,0,1-1.15,1.6l-.16.07h0a1.86,1.86,0,0,1-2-.34L4.93,2a.48.48,0,0,0-.68,0L2,4.22A.48.48,0,0,0,2,4.9l.37.42a1.83,1.83,0,0,1,.32,1.95l0,.05s0,.08,0,.13A1.84,1.84,0,0,1,1,8.6l-.55,0A.49.49,0,0,0,0,9.1v3.12a.49.49,0,0,0,.48.49l.56,0a1.82,1.82,0,0,1,1.6,1.15,1.11,1.11,0,0,1,.07.16h0a1.87,1.87,0,0,1-.34,2l-.37.4a.48.48,0,0,0,0,.68l2.21,2.21a.48.48,0,0,0,.68,0L5.32,19a1.81,1.81,0,0,1,1.95-.32l.05,0,.13.05A1.84,1.84,0,0,1,8.6,20.34l0,.55a.49.49,0,0,0,.48.48h3.12a.49.49,0,0,0,.49-.48l0-.56a1.84,1.84,0,0,1,1.15-1.61l.16-.06h0A1.87,1.87,0,0,1,16,19l.4.37a.5.5,0,0,0,.68,0l2.21-2.21a.48.48,0,0,0,0-.68L19,16.05a1.81,1.81,0,0,1-.32-2l0,0a.69.69,0,0,1,.05-.13,1.84,1.84,0,0,1,1.63-1.15l.55,0a.49.49,0,0,0,.48-.49V9.14A.49.49,0,0,0,20.89,8.66Zm-4.49,2A6,6,0,0,1,16,13a5.76,5.76,0,0,1-1.23,1.85,5.49,5.49,0,0,1-1.81,1.25A5.64,5.64,0,0,1,6.66,14.8,5.73,5.73,0,0,1,5.44,13a5.81,5.81,0,0,1,3-7.62,5.59,5.59,0,0,1,4.44,0,5.62,5.62,0,0,1,1.81,1.24A5.87,5.87,0,0,1,16,8.42,6,6,0,0,1,16.4,10.69Z" />
                            </svg>
                        </div>
                        <ListNav
                            class="gr_my-favorites__warp"
                            v-if="myFavorites.length"
                            :isEdit="isEdit"
                            :cloneListData="cloneListData"
                            :setCloneMyFavorites="setCloneMyFavorites"
                            ref="listNav"
                            :favoritesWidth="favoritesWidth"
                            :style="{
                                'width': myFavorites.length <=10 ? `${favoritesWidth}px`
                                : myFavorites.length >= 11 && myFavorites.length <= 20 ? `${favoritesWidth * 2}px`
                                : myFavorites.length >= 21 && myFavorites.length <= 30 ? `${favoritesWidth * 3}px`
                                : null
                            }"
                        />
                        <div v-else class="gr_my-favorites__list--not">{{$t('home_056')}}</div>
                    </div>
                </div><!-- c_dropdown-box__inner -->
            </div><!-- c_dropdown-box list -->
        </div><!-- gr_nav__dropdown -->

        <div class="gr_nav__dropdown  c_dropdown" :class="{ 'gr_nav__dropdown--hover  c_dropdown--hover': isGameRecordMenuActive }">
            <a class="gr_games__link" href="javascript:void(0);" @click.stop="triggerRecordMenu">
                <!-- {{$t("游戏记录")}} -->
                {{$t('home_008')}}
                <i class="gr_link__arrow  el-icon-arrow-down"/>
            </a>
            <div class="c_dropdown-arrow" />
            <div class="c_dropdown-box">
                <div class="c_dropdown-box__inner">
                    <div class="c_dropdown-box__content" @click.stop="closeAllPopMenu()">
                        <router-link class="c_dropdown-box__link" to="/GameInfo">
                            <!-- {{$t("投注记录")}} -->
                            {{$t('home_009')}}
                        </router-link>
                        <!-- {{$t("追号记录")}} -->
                        <!-- <router-link class="c_dropdown-box__link" to="/AddNewGameInfo" v-if="isShowTaskButton && !lotsOneLotGame">
                            {{$t('home_010')}}
                        </router-link> -->
                        <router-link class="c_dropdown-box__link" to="/WinLose">
                            <!-- {{$t("输赢报表")}} -->
                            {{$t('home_062')}}
                        </router-link>
                        <router-link class="c_dropdown-box__link" to="/Wallet" v-if="!isShowDemo">
                            <!-- {{$t("钱包记录")}} -->
                            {{$t('home_012')}}
                        </router-link>
                        <router-link v-if="!isRich" class="c_dropdown-box__link" to="/ReportList">
                            <!-- {{$t("盈亏查询")}} -->
                            {{$t('home_011')}}
                        </router-link>
                    </div>
                </div><!-- dropdown-box__inner -->
            </div><!-- dropdown-box -->
        </div><!-- gr_nav__dropdown -->
        <div class="gr_nav__menu">
            <ul class="gr_menu__group">
                <li class="gr_group__item" v-if="isShowHowToplay">
                    <router-link v-if="isMobile" class="gr_item__link" :to="how2PlayPath">
                        <!-- '玩法说明' -->
                        {{$t('home_013')}}
                    </router-link>
                    <a v-else class="gr_item__link" :href="how2PlayPath" target="_blank">
                        <!-- '玩法说明' -->
                        {{$t('home_013')}}
                    </a>
                </li>
                <li class="gr_group__item">
                    <a class="gr_item__link" href="javascript:void(0);" @click="popup('newsPopup')">
                        <!-- {{$t("最新公告")}} -->
                        {{$t('home_014')}}
                    </a>
                    <!-- <router-link class="gr_item__link" to="/NewsEvents"> -->
                        <!-- {{$t("最新公告")}} -->
                        <!-- {{$t('home_014')}}
                    </router-link> -->
                </li>
                <li class="gr_group__item" v-if="isShowScoreBoard">
                    <a class="gr_item__link" href="javascript:void(0);"  @click.stop="showSocreBoard()">
                        <!-- '名人榜'-->
                        {{$t('celebrity_001')}}
                    </a>
                </li>
                <!-- "手机APP" -->
                <!--
                    <li v-if="IsDisplay('appPage') && lang === 'cn'" class="gr_group__item">
                    <router-link class="gr_item__link" to="/APPQRCode">
                        {{$t('home_015')}}
                    </router-link>
                </li>
                -->
                <!-- <li class="gr_group__item" v-if="isDev" >
                    <router-link class="gr_item__link" to="/GuideStyle">GuideStyle</router-link>
                </li> -->
            </ul>
        </div><!-- gr_nav__menu -->
    </div><!-- gr_nav--nav-bar -->
</template>
<script>
import iframeGameSource from '@UTIL/games/iframeGameSource'
import { mapGetters, mapActions } from 'vuex'
import ListNav from './MyFavorites/ListNav'
import BlackTheme from './BlackTheme'

export default {
    name: 'HeaderNavbar',
    data() {
        return {
            notDisplayMenu: {},
            showBlockedIcon: false,
            longestLength: {},
            menuContainerWidth: {},
            iconClass: {
                1: 'c_menu--lotteryCn',
                2: 'c_menu--lotteryCn_SIN',
                3: 'c_menu--lotteryVn',
                4: 'c_menu--lotteryTable',
                5: 'c_menu--lotteryFanTan',
                6: 'c_menu--lotteryTh',
                7: 'c_menu--lotterySTOCK',
                8: 'c_menu--lotteryBJL',
                9: 'c_menu--lotteryLA',
                10: 'c_menu--lotteryMY'

            },
            // isEdit: false,
            cloneListData: [],
            favoritesWidth: 0,
            // 要顯示icon的menu, 照顯示順序排列
            isIE9: false,
            max960: false,
            timerMenuNum: null,
            timerMenuLen: null
        }
    },
    components: {
        ListNav,
        BlackTheme
    },
    props: {
        // setIsEdit: Function,
        // apply: Function,
        isEdit: Boolean,
        popup: Function
    },
    beforeDestroy() {
        clearTimeout(this.timerMenuNum)
        clearTimeout(this.timerMenuLen)
    },
    computed: {
        ...mapGetters([
            'isOneLotGame',
            'lotteryList',
            'lotteryList2',
            'lotteryMenu',
            'userType',
            'isShowDemo',
            'isDev',
            'isTest',
            'device',
            'lang',
            'getPopActive',
            'isGPI',
            'isRich',
            'isDirect',
            'miscInfo',
            'getMenuId',
            'getMenuIdArr',
            'oneLotGameRouter',
            'lotteryListLocalVN',
            'lotteryListTH',
            'officialKeyVN',
            'VN_isOnlyOld',
            'isW88',
            'lotListVN2',
            'getLolli',
            'myFavorites',
            'isShowTaskButton',
            'lotteryStatus',
            'VN_lotteryId',
            'VN_isOld',
            'dispalyMenuOrder',
            'gameRoutePath',
            'lotteryClosed'
        ]),
        ...mapGetters({
            isSin: 'gameIsSin',
            isFT: 'gameIsFT'
        }),
        filteredLotteryList() {
            if (this.getMenuIdArr.length === 0) return {}
            const list = (this.lotteryMenu[this.getMenuId] || {}).list || {}
            // 越南彩選項
            if (this.getMenuId === 3) {
                let childs = []

                Object
                    .values(this.lotteryListLocalVN)
                    .forEach(obj => childs.push(obj))

                const official = Object
                    .entries(list)
                    .filter(([lotName]) => this.officialKeyVN.includes(lotName))
                if (official.length) {
                    // 全區
                    childs.push({
                        menuId: 0,
                        title_key: 'vn_t_001'
                    })
                    // 越南彩-南/中/北
                    official.forEach(([lotName, { title_key }]) => {
                        childs.push({
                            menuId: this.officialKeyVN.indexOf(lotName) + 1,
                            title_key
                        })
                    })
                }

                // 這個index 'VN' 320menuNavBar有使用
                return {
                    VN: {
                        childs,
                        title_key: 'home_016'
                    }
                }
                // filter 內玩法 都開啟後就可移除
            } else if ([4, 8].includes(this.getMenuId)) {
                const filter = ['HL_SSC_LHD']
                let dataList = {}
                Object
                    .entries(list)
                    .forEach(([key, val]) => {
                        const isFilter = filter.includes(key)
                        if (isFilter) {
                            this.isDev && (dataList[key] = val)
                        } else {
                            dataList[key] = val
                        }
                    })
                return dataList
            } else if (this.getMenuId === 6) {
                let childs = []
                Object
                    .values(this.lotteryListTH)
                    .forEach(obj => obj.childs.forEach(obj => childs.push(obj)))
                // 這個index 'TH' 320menuNavBar有使用
                return {
                    TH: {
                        childs,
                        title_key: 'lottery_menu_type_6'
                    }
                }
            }
            return list
        },
        filteredListLength() {
            return Object.keys(this.filteredLotteryList).length
        },
        isShowHowToplay() {
            return this.getMenuIdArr.length > 0
        },
        isShowUpper() {
            // 只有一個(官方or信用)中國彩時關閉
            const menuIdArr = this.getMenuIdArr
            return !(menuIdArr.length === 1 && menuIdArr[0] < 3)
        },
        isMobile() {
            return this.device.mobile()
        },
        isiframeGame() {
            return iframeGameSource
        },
        isGameRecordMenuActive() {
            return this.getPopActive.gameRecord
        },
        isGameMenuActive() {
            return this.getPopActive.gamePlay
        },
        isScoreBoardShow() {
            return this.getPopActive.scoreBoard
        },
        tempKey() {
            return `${this.lang}_${+this.getMenuId}`
        },
        menuIdList() {
            if (this.getMenuIdArr.length === 0) return []
            const notDisplay = []
            return this.dispalyMenuOrder.filter((menuId) => this.lotteryMenu[menuId] && !notDisplay.includes(menuId))
        },
        how2PlayPath() {
            const meunId = this.getMenuId
            //桌面玩法&百家樂暫時不要導說明頁
            if ([4, 8].includes(meunId)) return `/PlayInfo/1`
            // 非投注頁僅導航到國家彩
            if (!this.$route.name.includes('GamePlayer')) return `/PlayInfo/${meunId}`
            let gameType = ''
            switch (meunId) {
                case 1:
                case 5:
                case 2:
                case 9:
                case 10:
                    const lotId = this.$route.params.lottery

                    gameType = lotId ? (this.lotteryList2[lotId].name) : ''
                    break
                case 3:
                    const {p: vnMenuId, l: lotteryId} = this.$route.query
                    if (vnMenuId && !lotteryId) {
                        // 越南彩南中北區
                        gameType = vnMenuId > 2 ? 'VN_N' : 'VN_S'
                    } else if (vnMenuId && lotteryId) {
                        // 越南彩自主彩
                        gameType = (this.lotListVN2[lotteryId] || {}).name || 'VN_5M'
                    } else {
                        // 越南彩獨立廳, 只導航到國家(開啟有開放的第一個彩種)
                        gameType = ''
                    }
                    break
                case 6:
                    const lottery = this.$route.params.lottery
                    switch (+lottery) {
                        case 242 :
                            gameType = 'TH'
                            break
                        case 243 :
                            gameType = 'TH_30S'
                            break
                    }
                    break
                default:
                    break
            }
            return `/PlayInfo/${meunId}/${gameType}`
        },
        lotsOneLotGame() {
            return this.isOneLotGame || this.isW88
        },
        isShowScoreBoard() {
            return !!RmUserInfo.enableLeaderBoard
        },
        isGameFavoriteMenuActive() {
            return this.getPopActive.gameFavorite
        },
        isLotterType() {
            if (this.$route.name === 'GamePlayer') {
                return this.lotteryList2[+this.$route.params.lottery].name
            } else if (this.$route.name === 'GamePlayerVN') {
                return 'VN'
            }
        }
    },
    created() {
        // 設定預設menuId
        this.getMenuId === 0 && this[_M.SET_MENU_ID](+this.getMenuIdArr[0])

        // 判斷哪個menu要不要顯示
        try {
            const menuDisplay = this.miscInfo
            if (menuDisplay) {
                const showPages = JSON.parse(menuDisplay.showPage)
                Object.keys(showPages).forEach((pageName) => {
                    if (+showPages[pageName] === 0) {
                        this.notDisplayMenu[pageName] = true
                    }
                })
            }
        } catch (error) {
            // JWT.misc_info error
        }
    },
    destroyed() {
        this[_M.SET_POP_ACTIVE]()
    },
    methods: {
        ...mapActions([
            _M.SET_IS_SIN,
            _M.SET_POP_ACTIVE,
            _M.SET_MENU_ID,
            _M.GAME_ORDER_VN_SUBMIT,
            _M.SET_MY_FAVORITES,
            _M.GET_LOTTERY_STATUS
        ]),
        setCloneMyFavorites(data) {
            this.cloneListData = data
        },
        triggerGameMenu() {
            if (this.isOneLotGame) {
                this.$router.push(this.oneLotGameRouter)
            } else if (this.isW88) {
                this.$router.push('/GamePlayerVN')
            } else {
                this.showBlockedIcon = false
                this[_M.SET_POP_ACTIVE]({gamePlay: !this.isGameMenuActive})

                // 菜單打開時,切換到當前分類頁面
                if (this.isGameMenuActive) {
                    let menuId = this.getMenuId
                    switch (this.$route.name) {
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
                }
                // 調整長度
                // this.setMenuLiLength()
                // this.timerMenuLen = setTimeout(() => {
                // }, 0)
            }
            // this.setMenuNum()
            // 彩種狀態
            this.isGameMenuActive && this[_M.GET_LOTTERY_STATUS]()
        },
        triggerFavoriteMenu() {
            if (navigator.userAgent.indexOf('MSIE 9.0') > 0) this.isIE9 = true
            this[_M.SET_POP_ACTIVE]({gameFavorite: !this.isGameFavoriteMenuActive})
            // if (this.$refs.listNav !== undefined) {
            //     const _listNav = this.$refs.listNav.$children[0].$el.childNodes
            //     const array = []
            //     for (let i in _listNav) {
            //         _listNav[i].childNodes && (array.push(_listNav[i].childNodes[2].offsetWidth))
            //         // console.log(_listNav[i].childNodes)
            //     }
            //     this.favoritesWidth = Math.max(...array) + 10
            // }
            const _listNav = document.querySelectorAll('.gr_my-favorites__list .gr_list__item')
            if (_listNav !== undefined) {
                const array = []
                for (let i in _listNav) {
                    _listNav[i].childNodes && (array.push(_listNav[i].childNodes[2].offsetWidth))
                }
                this.favoritesWidth = Math.max(...array) + 10
            }
        },
        triggerRecordMenu() {
            this[_M.SET_POP_ACTIVE]({gameRecord: !this.isGameRecordMenuActive})
        },
        closeAllPopMenu(delay = 100) {
            setTimeout(() => {
                this[_M.SET_POP_ACTIVE]()
            }, delay)
        },
        menuClick(menuId) {
            // switch (+menuId) {
            //     // 中國彩-官方
            //     // 中國彩-信用
            //     case 1:
            //     case 2:
            //         break
            // }
            this[_M.SET_IS_SIN](+menuId === 2)
            this[_M.SET_MENU_ID](menuId)
            this.setMenuLiLength()
        },
        // IsDisplay(pageName) {
        //     // 暫時判斷直客關閉 App
        //     if (this.isDirect || this.notDisplayMenu[pageName]) {
        //         return false
        //     }
        //     return true
        // },
        getIcon(menus) {
            const isPlay = !!this.isiframeGame[menus.lottery]
            // 0: 未封盤; 1:封盤
            const isBlocked = menus.is_blocked || 0

            if (isBlocked) {
                this.showBlockedIcon = true
                return 'i_blockade'
            } else if (isPlay) {
                return 'i_play'
            }

            return ''
        },
        /**
        * 設定菜單整體&單組玩法的寬度,隨著多語切換自動調整
        * 單組寬度: 每組玩法(ex:SSC)中,取最寬li
        * 整體寬度: 上方彩種icon區(顯示最多 numRow 個 icon) & 底下玩法區, 兩者取較寬者
        */
        setMenuLiLength() {
            if (this.menuContainerWidth[this.tempKey]) return
            // 等渲染完成再計算(否則會拿到不正確的$ref)
            const numRow = 5
            this.$nextTick(() => {
                // margin: 10
                const upperWidth = this.$refs.lotteryIcon
                    ? (this.$refs.lotteryIcon[0].offsetWidth + 10 * 2) * Math.min(this.dispalyMenuOrder.length, numRow)
                    : 0
                const menuWidth = this.$refs.lotteryIcon.map((e) => e.offsetWidth + 20).reduce((a, b) => a + b)
                const col = Math.min(this.filteredListLength, numRow)
                const max = this.$refs.menuTitle ? this.$refs.menuTitle
                    .map(li => li.clientWidth)
                    .max() : 1
                this.$set(this.longestLength, this.tempKey, max)
                // padding: 10
                const maxW = Math.max(upperWidth + 10 * 2, (col * max + 12 + 1))
                const maxWall = maxW >= 960 ? (max * 5) + 12 + 1 : maxW
                // 分類圖 : 彩種名稱 取較長的
                this.menuContainerWidth[this.tempKey] = (maxWall > menuWidth ? maxWall : menuWidth) + 'px'
            })
        },
        gameRouter(menuId, lottery) {
            return `/${this.gameRoutePath[menuId]}/${lottery}`
        },
        vnRoute(vnMenu) {
            const {lottery: l, menuId} = vnMenu
            const query = {
                p: l ? 1 : menuId,
                l
            }
            this.$root.$emit('reset')
            if (l) {
                !this.VN_isOld && this[_M.GAME_ORDER_VN_SUBMIT]({type: 1, showList: [], ltMoneyAmout: 0, times: 1})
            } else {
                (!this.VN_isOld && this.VN_lotteryId) && this[_M.GAME_ORDER_VN_SUBMIT]({type: 1, showList: [], ltMoneyAmout: 0, times: 1})
            }
            this.$router.push({name: 'GamePlayerVN', query})
        },
        vnMenuActive(vnMenu) {
            const {lottery, menuId} = vnMenu
            const { l, p } = this.$route.query
            /*
            等價於底下
            if (l) {
                return +l === lottery
            } else if (p) {
                return menuId === +p
            } else if (this.$route.name === 'GamePlayerVN') {
                // 是越南彩且沒有l, 沒有p
                return menuId === 0
            }
            */
            // 有單式的廳 /GamePlayerVN 預設是南部
            const check = +!this.VN_isOnlyOld
            return +l === lottery || (!l && menuId === +p) || (menuId === check && this.$route.fullPath === '/GamePlayerVN')
        },
        showSocreBoard() {
            this[_M.SET_POP_ACTIVE]({scoreBoard: !this.isScoreBoardShow})
            this.$msg({
                show: true,
                zIndex: 1992,
                isCustom: true
            })
        }
    }
}
</script>
