<template>
    <div class="playinfo_menu">
        <ul class="playinfo_tab" v-if="!isOneLotGame">
            <li v-for="{mid, lot} in getPlayInfoMenu"
                :class="chkMenuActive(mid)"
                @click="toggleMenu(mid)"
                :key="mid">
                <p>{{mid < 3 ? `${$t('home_044')}-${$t(lot.title_key)}` : $t(lot.title_key)}}</p>
            </li>
        </ul>
        <div class="playinfo_type">
            <a class="playinfo_type_prev" v-show="is_typeDisplay" @click="typeClick('left')"></a>
            <a class="playinfo_type_next" v-show="is_typeDisplay" @click="typeClick('right')"></a>
            <div ref="typeMenu">
                <ul :style="cssPrefix">
                    <li
                      v-for="(item, key) in lotteryList"
                      v-if="isDisplayMenu(key)"
                      :key="item.key"
                      :class="subMenuActive(key)"
                      @click="changeList(key)">
                      {{$t('lottery_functionType_VN_S' === item.title_key
                      ? 'lottery_functionType_VN_SC'
                      : item.title_key).replace(/(\[.+\])|(\(.+\))/, '')}}
                    </li>
                    <!-- lottery_functionType_VN_SC:中南部(特例) -->
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { Observable } from 'rxjs/Observable'

export default {
    name: 'Menu',
    data() {
        return {
            positionIndex: 0,
            transformPX: 0,
            is_typeDisplay: true,
            div_Width: 0,
            ul_Width: 0,
            screenWidth: document.body.clientWidth
        }
    },
    watch: {
        screenWidth (val) {
            if (!this.timer) {
                this.screenWidth = val
                this.timer = true
                setTimeout(() => {
                    this.is_typeDisplay = !(this.screenWidth > this.ul_Width + 80)
                    this.timer = false
                }, 500)
            }
        }
    },
    mounted() {
        this.typeDisplay()

        window.onresize = () => {
            return (() => {
                window.screenWidth = document.body.clientWidth
                this.screenWidth = window.screenWidth
            })()
        }
    },
    updated () {
        this.typeDisplay()
    },
    computed: {
        ...mapGetters([
            'playListIndex',
            'lang',
            'lotteryMenu',
            'getMenuId',
            'getMenuIdArr',
            'isOneLotGame',
            'lotteryListLocalVN'
        ]),
        lotteryList() {
            if (this.getMenuIdArr.length === 0) return {}
            const lotList = this.lotteryMenu[this.getMenuId].list

            // 中國彩-4D彩處理
            if (this.getMenuId < 3) {
                return Object.keys(lotList).reduce((obj, lotName) => {
                    // 只擷取需要的部分(title_key)
                    obj[lotName] = {
                        title_key: lotList[lotName].title_key
                    }

                    // 尋找是否有4D彩
                    if (lotName.includes('HL_')) {
                        const fdKey = ['lottery_name_155', 'lottery_name_156']
                        const fdIndex = lotList[lotName].childs.findIndex((item) => fdKey.includes(item.title_key))
                        // 注意:這裡顯示的KEY跟投注頁不一樣
                        fdIndex > -1 && (obj[lotName.replace('SSC', '4D')] = { title_key: 'home_live_004' })
                    }

                    return obj
                }, {})
            }

            // 越南彩特例
            if (this.getMenuId === 3) {
                let obj = {}

                // 自主彩
                if (this.lotteryListLocalVN) {
                    let isInclude = []
                    Object.values(this.lotteryListLocalVN).forEach((lotData) => {
                        if (isInclude.includes(lotData.name)) {
                            return
                        }
                        obj[lotData.name] = {
                            childs: lotList[lotData.name].childs,
                            title_key: lotData.title_key
                        }
                        isInclude.push(lotData.name)
                    })
                }

                obj['VN_S'] = lotList.VN_S
                obj['VN_N'] = lotList.VN_N
                return obj
            }

            return lotList
        },
        cssPrefix() {
            const cssStyle = `-webkit-transform: translateX(${this.transformPX}px);
                -moz-transform: translateX(${this.transformPX}px);
                -ms-transform: translateX(${this.transformPX}px);
                -o-transform: translateX(${this.transformPX}px);
                transform: translateX(${this.transformPX}px);`
            return cssStyle
        },
        // 取得自訂排序後的lotteryMenu
        getPlayInfoMenu() {
            const menuIdOrder = [1, 2, 5, 3, 6, 7, 9, 10]
            return menuIdOrder.reduce((obj, mid) => {
                if (this.lotteryMenu[mid]) {
                    obj.push({
                        mid,
                        lot: this.lotteryMenu[mid]
                    })
                }
                return obj
            }, [])
        }

    },
    subscriptions() {
        const resize = Observable.fromEvent(window, 'resize')
        return {
            resize$: resize
                .debounceTime(100)
                .do(() => {
                    this.positionIndex = 0
                    this.transformPX = 0
                })
        }
    },
    methods: {
        ...mapActions([
            _M.SET_PLAYINFO_INDEX
        ]),
        toggleMenu(menuId) {
            this.$router.replace(`/PlayInfo/${menuId}`)
            this.$root.$emit('getH2PDeault')

            // reset menu
            this.transformPX = 0
            this.positionIndex = 0
        },
        changeList(key) {
            this[_M.SET_PLAYINFO_INDEX]({
                functionType: key,
                lang: this.lang
            })
        },
        chkMenuActive(menuIndex) {
            return (this.getMenuId === +menuIndex) ? 'active' : ''
        },
        typeClick(type) {
            const divWidth = this.$refs.typeMenu.clientWidth
            const ul = this.$refs.typeMenu.children[0]
            let ulWidth = 0
            for (let loop = this.positionIndex; loop < ul.children.length; loop++) {
                ulWidth += ul.children[loop].clientWidth
            }

            if (type === 'right' && ulWidth >= divWidth) {
                this.transformPX -= ul.children[this.positionIndex].clientWidth
                this.positionIndex += 1
            } else if (type === 'left' && this.positionIndex !== 0) {
                this.positionIndex -= 1
                this.transformPX += ul.children[this.positionIndex].clientWidth
            }
        },
        isDisplayMenu(key) {
            // 同時有SSC & HL_SSC時候, HL_SSC不顯示 || 泰國彩、股票彩整個不顯示
            if ((key.includes('HL_') && this.lotteryList[key.replace('HL_', '')]) || [6, 7, 9, 10].includes(this.getMenuId)) {
                return false
            }
            return !!this.lotteryList[key]
        },
        typeDisplay() {
            const div_Width = this.$refs.typeMenu.clientWidth
            const ul = this.$refs.typeMenu.children[0]
            let ul_Width = 0
            for (let loop = 0; loop < ul.children.length; loop++) {
                ul_Width += ul.children[loop].clientWidth
            }
            this.div_Width = div_Width
            this.ul_Width = ul_Width
            if (this.div_Width > ul_Width) {
                this.is_typeDisplay = false
            } else {
                this.is_typeDisplay = true
            }
        },
        // 取得子選單是否啟用
        subMenuActive(key) {
            // 股票彩API特例
            const formatKey = key === 'STOCK' ? 'STOCK_WEB' : key
            return { 'active': formatKey === this.playListIndex.replace(/@([\w]+)/, '') }
        }
    }
}
</script>
