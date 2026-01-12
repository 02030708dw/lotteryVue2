<template>
    <div
        class="container"
        @touchstart="handleMoveDown"
        @mousedown="handleMoveDown"
    >
        <div class="menu-container" ref="menuContainer">
            <ul
                :class="{is_press: isPress}"
                :style="{
                    width: `${ulWidth}px`,
                    msTransform: `translateX(${ translate }px)`,
                    webkitTransform: `translateX(${ translate }px)`,
                    transform: `translateX(${ translate }px)`
                }"
            >
                <li
                    ref="li"
                    v-for="([key, data]) in $parent.subTabData"
                    @click="handleFn($parent.setSubMenuKey.bind($parent, key))"
                    :key="key"
                    :class="{is_active: key === $parent.subMenuKey}"
                >
                    <div>{{$t(data.title_key)}}</div>
                </li>
            </ul>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.container {
    background-color: #4D4D4D;
    user-select: none;
}
.menu-container {
    overflow: hidden;
    padding-left: 30px;
}
ul {
    width: 2000px;
}
li {
    position: relative;
    display: inline-block;
    padding: 0 25px;
    > div {
        color: #fff;
        padding: 17px 0;
        cursor: pointer;
        text-align: center;
    }
    &.is_active {
        > div {
            color: #FFCB85;
            &::after {
                content: "";
                position: absolute;
                left: 0;
                right: 0;
                bottom: 8px;
                margin: auto;
                width: 5px;
                height: 5px;
                border-radius: 50%;
                border: 1px solid #FFCB85;
            }
        }
    }

}
</style>
<script>
import horizontalMenu from '@C/horizontalMenu'
import { mapGetters } from 'vuex'
export default {
    name: 'lotterySubMenu',
    extends: horizontalMenu,
    // data() {
    //     return {
    //         diff: 40
    //     }
    // },
    beforeMount() {
        this.$root.$on('updateUlWidth', this.calcUlWidth)
    },
    beforeDestroy() {
        this.$root.$off('updateUlWidth', this.calcUlWidth)
    },
    computed: {
        ...mapGetters([
            'lang'
        ])
    },
    watch: {
        lang() {
            this.calcUlWidth()
        }
    },
    methods: {
    }
}
</script>