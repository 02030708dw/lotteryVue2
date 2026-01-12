<template>
    <div>
        <HeaderNav />
        <div class="gr_home  gr_container">
            <template v-if="RWDMode === 1 || (RWDMode === 3 && !isBlackTheme)">
                <lotteryMenu :notSubmenu="notSubmenu" />
                <lotterySubMenu v-if="!notSubmenu" />
                <div class="gr_home__lottery-category  bg_primary u_clearfix" :class="{not_submenu: notSubmenu}">
                    <components
                        v-for="(menu, i) in gameMenu"
                        :key="`${menuId}${i}`"
                        :menu="menu"
                        :is="menu.class"
                        class="gr_lottery-category__lottery"
                        :class="{
                            [`c_lottery-class--${menu.class}`]: true,
                            'c_lottery-class--K3_YXX': (lotteryList2[menu.lottery] || {}).function_type === 'K3_YXX', //魚蝦蟹特例
                            'c_lottery--disabled': menu.isNotOpen,
                            [`c_lottery--${menu.lottery}`]: true
                        }"
                    />
                </div>
            </template>
            <div v-else class="gr_home__lottery-category gr_home__lottery-category320 u_clearfix" :class="{not_submenu: notSubmenu}">
                <BlackTheme />
            </div>
        </div>
    </div>
</template>
<script>
import '@CSS/View/_v_home'
import HeaderNav from '@C/HeaderNav'
import lotteryMenu from './lotteryMenu'
import lotterySubMenu from './lotterySubMenu'
import favorite320 from './components/favorite320'
import BlackTheme from './BlackTheme'
import main from './components/card/main'
import { mapGetters, mapActions } from 'vuex'
import Home from '@S/modules/Home'

export default {
    name: 'Home',
    props: {
        setStore: Function
    },
    components: {
        ...main,
        HeaderNav,
        BlackTheme,
        favorite320,
        lotteryMenu,
        lotterySubMenu
    },
    data() {
        return {
            // isLotteryListLoaded: false,
            timer: null,
            loadedNum: 0,
            menuId: '1',
            subMenuKey: 'SSC',
            allIssueTimer: null
        }
    },
    created() {
        this.checkOneLotGame()
        document.body.classList.remove('scrollDown')

        if (!this.isOneLotGame) {
            this.setStore({
                Home
            })
            this[_M.GET_ALL_OPEN_ISSUE]()
            this[_M.GET_ALL_ISSUE]()
            this.allIssueTimer = setInterval(() => this[_M.GET_ALL_OPEN_ISSUE](), 10000)
            this.timer = setInterval(this[_M.GET_FLIP_TIMEER_ALL], 1000)
        }
    },
    beforeDestroy() {
        clearInterval(this.timer)
    },
    beforeRouteEnter (to, from, next) {
        next(async (that) => {
            await that[_M.GET_STRING_POOL]({
                // pageList: ['Desktop', 'Message', 'Message', 'tools/lottery'],
                pageList: ['all'],
                pageTitle: to.meta.title
            })
        })
    },
    methods: {
        ...mapActions([
            _M.GET_STRING_POOL,
            _M.GET_ALL_ISSUE,
            _M.GET_ALL_OPEN_ISSUE,
            _M.GET_FLIP_TIMEER_ALL
        ]),
        // loaded() {
        //     ++this.loadedNum
        //     if (this.loadedNum === this.gameMenu.length) {
        //         this.isImgLoaded = true
        //     }
        // },
        // error() {
        //     this.loaded()
        // },
        checkOneLotGame() {
            if (this.isOneLotGame) {
                return this.$router.replace(this.oneLotGameRouter)
            }
        },
        setMenuId(id) {
            this.menuId = id
            this.subMenuKey = ![0, 9999].includes(this.menuId) && Object.keys(this.lotteryMenu[this.menuId].list || {})[0]
            this.$router.replace({name: 'Home', query: {t: id}})
            this.$nextTick(() => this.menuId && this.$root.$emit('updateUlWidth'))
        },
        setSubMenuKey(key) {
            this.subMenuKey = key
        },
        gameRouter(router, lottery) {
            return router || `/GamePlayer/${lottery}`
        }
    },
    watch: {
        gameMenu() {
            this.checkOneLotGame()
        }
    },
    computed: {
        ...mapGetters([
            'lotteryMenu',
            'lotteryList',
            'lotteryList2',
            'isOneLotGame',
            'oneLotGameRouter',
            'officialKeyVN',
            'lotteryOfficialVN',
            'lotteryListLocalVN',
            'lotteryListChina',
            'VN_hasOld',
            'popularEntries',
            'myFavorites',
            'lotListVN',
            'allIssue',
            'RWDMode',
            'isBlackTheme',
            'gameRoutePath'
        ]),
        lotteryKey() {
            return Object.keys(this.lotteryList)
        },
        // 取得有開放的lottery List
        // getLotOpen() {
        //     // 越南彩不列入
        //     const open = [1, 2, 4, 5, 6, 7]
        //     return Object.entries(this.lotteryList).reduce((ans, [lotKey, data]) => {
        //         if (open.includes(data.menuId)) {
        //             ans[lotKey] = data
        //         }
        //         return ans
        //     }, {})
        // },
        gameMenu() {
            let list = []
            const data = (![0, 9999].includes(this.menuId)) && ((this.lotteryMenu[this.menuId] || {}).list || {})
            let listData = []
            const vnKey = {
                VN_S: '163',
                VN_C: '183',
                VN_N: '197',
                VN_ALL: '162'
            }
            // 我的最愛
            if (!this.menuId) {
                listData = this.myFavorites.map(id => this.lotteryList2[id]).filter(obj => obj)
                // 熱門彩種
            } else if (this.menuId === 9999) {
                listData = this.popularEntries.map(id => this.lotteryList2[id] || this.lotteryList2[vnKey[id]])
            } else if ([3].includes(+this.menuId)) {
                Object.values(this.lotteryListLocalVN)
                    .forEach(obj => {
                        listData.push(this.lotteryList2[obj.lottery])
                    })
                // 全區 官彩
                const isShowAllArea = this.officialKeyVN.find(pos => this.lotteryOfficialVN[pos]) && this.VN_hasOld
                isShowAllArea && listData.push({
                    is_local: false,
                    lottery: '162',
                    menuId: 3
                })
                // 官方彩
                Object
                    .entries(data)
                    .filter(([lotName]) => this.officialKeyVN.includes(lotName))
                    .forEach(([lotName, val]) => {
                        // 官方彩
                        listData.push({
                            lottery: vnKey[lotName],
                            menuId: 3,
                            name: lotName
                        })
                    })
            } else if ([6].includes(+this.menuId)) {
                Object
                    .entries(data)
                    .forEach(([, obj]) => {
                        (obj.childs || []).forEach((obj) => {
                            listData.push(obj)
                        })
                    })
            } else {
                listData = (data[this.subMenuKey] || {}).childs || []
            }
            const pushlist = (items) => {
                list.push({
                    ...items,
                    class: items.function_type,
                    router: `/${this.gameRoutePath[items.menuId]}/${items.lottery}`
                })
            }
            const thPushList = items => pushlist({...items, function_type: 'TH', class2: items.function_type})
            const vnPushList = (items) => {
                const officialId = [162, 163, 183, 197]
                if (officialId.includes(+items.lottery)) {
                    if (+items.lottery !== 162) {
                        const p = {
                            VN_S: 1,
                            VN_C: 2,
                            VN_N: 3
                        }
                        const title = {
                            VN_S: 'lottery_functionType_VN_S',
                            VN_C: 'lottery_functionType_VN_C',
                            VN_N: 'lottery_functionType_VN_N'
                        }
                        list.push({
                            class: 'VIETNAM',
                            lotteryId: items.lottery,
                            lottery: 'vietnam',
                            function_type: items.name,
                            title_key: title[items.name],
                            router: `/GamePlayerVN?p=${p[items.name]}`
                        })
                    } else {
                        const isShowAllArea = this.officialKeyVN.find(pos => this.lotteryOfficialVN[pos]) && this.VN_hasOld
                        isShowAllArea && list.push({
                            is_local: false,
                            class: 'VIETNAM',
                            lotteryId: '162',
                            lottery: 'vietnam',
                            function_type: 'VN_ALL',
                            title_key: 'vn_t_001',
                            router: {name: 'GamePlayerVN', query: {p: 0, l: undefined, t: 'Old'}}
                        })
                    }
                } else {
                    list.push({
                        ...items,
                        class: 'VIETNAM',
                        lotteryId: items.lottery,
                        router: `/GamePlayerVN?p=1&l=${items.lottery}`
                    })
                }
            }
            const routerFn = {
                1: pushlist,
                2: pushlist,
                3: vnPushList,
                4: pushlist,
                5: pushlist,
                6: thPushList,
                7: pushlist,
                8: pushlist,
                9: pushlist,
                10: pushlist
            }
            listData.forEach((item) => {
                const { menuId = 3 } = this.lotteryList2[item.lottery] || {}
                routerFn[menuId].call(this, {...item, menuId})
            })
            return list
        },
        subTabData() {
            return (this.menuId !== 0) && Object.entries((this.lotteryMenu[this.menuId] || {}).list || {})
        },
        notSubmenu() {
            return [0, 3, 6, 7, 9, 10, 9999].includes(+this.menuId)
        }
    }
}
</script>