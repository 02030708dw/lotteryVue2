<template>
    <div class="gr_game-menu">
        <div class="gr_game-menu__inner" ref="menuInner">
            <!-- left arrow -->
            <div
                v-show="isShowArrow"
                @click="moveLeft()"
                class="gr_game-menu__controller  gr_game-menu__controller--left"
                :class="{ is_disabled: position === 0 }"
            >
                <div class="gr_controller__arrow" />
            </div>
            <!-- right arrow -->
            <div
                v-show="isShowArrow"
                @click="moveRight()"
                class="gr_game-menu__controller  gr_game-menu__controller--right"
                :class="{ is_disabled: position === maxClick }"
            >
                <div class="gr_controller__arrow" />
            </div>
            <div class="gr_game-menu__bar" ref="menuBar">
                <ul class="gr_game-menu__group" ref="menuGroup" :style="{ left: `${pixels}px` }">
                    <li
                        class="gr_group__item"
                        ref="menuItem"
                        v-for="(item, index) in gameMenu"
                        @click="changeGame(index)"
                        :class="{ is_active: menuIndex === index}"
                        :key="item.name"
                    >
                        <span class="gr_item__text" :style="{width: `${langWidth[lang]}px` }">{{$t(keyObj[item.title])}}</span>
                    </li>
                </ul>
            </div>
        </div><!-- gr_game-menu__inner -->
    </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'

export default {
    name: 'GameMenu980',
    data() {
        return {
            keyObj: {
                '1D': 'thai_011',
                '2D': 'thai_010',
                '3D': 'thai_009'
            },
            /** 第幾次右移 */
            position: 0,
            /** 選單 left */
            pixels: 0,
            /** 選單數量 */
            menuItem: 0,
            /** 位移格數 */
            placeMove: 3,
            /** 可見數量 */
            displayLiNumers: {
                'cn': 9,
                'us': 5,
                'jp': 5,
                'th': 5,
                'vn': 3
            },
            /** 每格寬度 */
            langWidth: {
                'cn': 89.5,
                'us': 150.8,
                'jp': 160.8,
                'th': 150.8,
                'vn': 238
            }
        }
    },
    mounted() {
        this.RWDMode === 1 && this.init()
    },
    watch: {
        lang() {
            this.RWDMode === 1 && this.setMenuPlace()
        }
    },
    methods: {
        ...mapActions([
            _M.SET_MENU_ID
        ]),
        init() {
            this.$nextTick(() => {
                this.menuItem = (this.$refs.menuItem || []).length
                this.setMenuPlace()
            })
        },
        /** 設定選單目前位置 */
        setMenuPlace() {
            //this.curDisplayLiNums > this.menuItem && this.setPixels(this.pixels = 0)
            this.curDisplayLiNums > this.menuIndex && this.setPixels(this.pixels = 0)//active的選單若小於可見的數量就將整體選單left歸0
            const overConut = Math.max(Math.ceil(((this.menuIndex + 1) - (this.curDisplayLiNums)) / this.placeMove), 0)
            this.position = Math.max(overConut - 1, 0)
            overConut && this.moveRight()
        },
        /** 改變玩法時的處理 */
        changeGame(index) {
            const { mode, parent, name } = this.gameMenu[index].childs[0].childs[0]
            const subGameName = `${mode}_${parent}_${name}`.replace(/\./g, '_')
            this.$router.replace(`/GamePlayerStock/${this.lotteryId}?sub=${subGameName}`)
        },
        /** 右移 */
        moveRight() {
            if (this.position !== this.maxClick) {
                const move = Math.min(this.placeMove * (++this.position), this.maxMove)
                this.setPixels(this.pixels = -this.curLangWidth * move)
            }
        },
        /** 左移 */
        moveLeft() {
            if (this.position) {
                this.setPixels(-this.curLangWidth * this.placeMove * --this.position)
            }
        },
        setPixels(px) {
            this.$nextTick(() => (this.pixels = px))
        }
    },
    computed: {
        ...mapGetters([
            'lang',
            'isMobile',
            'RWDMode',
            'currentLottery',
            'gameMenu',
            'menuIndex',
            'lotteryList2'
        ]),
        ...mapGetters({
            lotteryId: 'gameLotteryId',
            isSin: 'gameIsSin'
        }),
        isShowArrow() {
            return this.menuItem > this.curDisplayLiNums
        },
        /** 依照語系每格的寬度 */
        curLangWidth() {
            return this.langWidth[this.lang]
        },
        /** 依照語系顯示可見的數量 */
        curDisplayLiNums() {
            return this.displayLiNumers[this.lang]
        },
        /** 最大可在右移格數 */
        maxMove() {
            return this.menuItem - this.curDisplayLiNums
        },
        /** 最大可在右移次數 */
        maxClick() {
            return Math.ceil(this.maxMove / this.placeMove)
        }
    }

}
</script>
