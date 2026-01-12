<template>
    <div
        class="container"
        @touchstart="handleMoveDown"
        @mousedown="handleMoveDown"
    >
        <div
            class="menu-slidePrev"
            :class="{ is_hidden: !translate }"
            @click="move(spaceWidth)"
        >
            <i class="el-icon-arrow-left" />
        </div>
        <div class="menu-container" ref="menuContainer">
            <ul
                :class="{ is_press: isPress }"
                :style="{
                    width: `${ulWidth}px`,
                    msTransform: `translateX(${translate}px)`,
                    webkitTransform: `translateX(${translate}px)`,
                    transform: `translateX(${translate}px)`
                }"
            >
                <li
                    ref="li"
                    v-for="data in calcMenuData"
                    @click="handleFn($parent.setMenuId.bind($parent, +data.menuType))"
                    :key="data.menuType"
                    :class="{
                        is_active: +data.menuType === +$parent.menuId,
                        arrow: +data.menuType === +$parent.menuId && !notSubmenu
                    }"
                >
                    <div>
                        {{ $t(data.title_key) }}
                    </div>
                </li>
            </ul>
        </div>
        <div
            class="menu-slideNext"
            :class="{
                is_hidden:
                    translate === maxWidth || ulWidth < menuContainerWidth
            }"
            @click="move(-spaceWidth)"
        >
            <i class="el-icon-arrow-right" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.container {
    background-color: #333333;
    user-select: none;
    height: 58px;
}
.menu-slidePrev,
.menu-slideNext {
    float: left;
    width: 36px;
    text-align: center;
    line-height: 58px;
    color: #fff;
    cursor: pointer;
    opacity: 1;
    transition: opacity 0.3s ease;
    &.is_hidden {
        opacity: 0;
    }
}
.menu-container {
    float: left;
    height: 100%;
    width: calc(100% - 72px);
    overflow: hidden;
}
ul {
    position: relative;
    width: 2000px;
    background: #333333;
    transition: transform 0.3s ease;
    padding: 13px 0 13px 0;
    &.is_press {
        transition: initial;
    }
}
li {
    display: inline-block;
    position: relative;
    padding: 0 5px;
    min-width: 100px;
    > div {
        padding: 6px;
        border: 1px solid #c4a974;
        color: #c4a974;
        border-radius: 5px;
        cursor: pointer;
        text-align: center;
    }
    &.is_active {
        > div {
            color: #fff;
            background-image: linear-gradient(to bottom, #df2741, #8a012d);
            border: none;
            padding: 7px;
        }

        &.arrow:before,
        &.arrow:after {
            position: absolute;
            content: "";
            border-top: 10px transparent dashed;
            border-left: 10px transparent dashed;
            border-right: 10px transparent dashed;
            bottom: -15px;
            left: 40px;
        }
        &.arrow:before {
            border-bottom: 10px #0099cc solid;
        }
        &.arrow:after {
            top: 1px; /*覆蓋並錯開1px*/
            border-bottom: 10px #4D4D4D solid;
        }
    }

}
// @media screen and (max-width: 979px) {
    // .menu-container {
        // width: calc(90% - 5vw);
    // }
    // .menu-slidePrev,
    // .menu-slideNext {
    //     display: none;
    // }
// }
</style>
<script>
import horizontalMenu from '@C/horizontalMenu'
import { mapGetters } from 'vuex'
import { returnState } from '@UTIL'
export default {
    name: 'lotteryMenu',
    extends: horizontalMenu,
    data() {
        return {
            spaceWidth: 200,
            diff: 10
        }
    },
    props: {
        notSubmenu: Boolean
    },
    beforeMount() {
        const { t } = this.$route.query
        let menuId = t ? +t : +this.calcMenuData[0].menuType
        if (+t === 9999 && !this.popularEntries.length) {
            menuId = +this.calcMenuData[0].menuType
        }
        this.$parent.setMenuId(menuId)
    },
    computed: {
        ...mapGetters(['lotteryMenuData', 'lang', 'popularEntries', 'calcMenuData', 'filterFavoriteLen'])
    },
    watch: {
        lang() {
            this.calcUlWidth()
        },
        filterFavoriteLen() {
            this.$nextTick(() => {
                if (!this.filterFavoriteLen) {
                    this.$parent.setMenuId(+this.calcMenuData[0].menuType)
                }
                this.calcUlWidth()
            })
        }
    },
    methods: {}
}
</script>
