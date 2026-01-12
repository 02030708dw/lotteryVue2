<template>
    <div :class="{ 'active': isActiveMobile }">
        <div class="playinfo_nav_btn" @click="openMenu()"><span /></div>
        <div class="playinfo_nav" :class="{ 'playinfo_nav--short': downMax >= 0 }">
            <a class="playinfo_nav_prev" v-if="downMax < 0 && navNum < 0" @click="navMove('up', 5)"></a>
            <a class="playinfo_nav_next" v-if="downMax < 0 && navNum > downMax" @click="navMove('down', 5)"></a>
            <div ref="navMenu">
                <ul :style="cssPrefix">
                    <!-- <li :class="{ 'active': activeKey === '' }" @click="handleMenuClick()">{{$t('销售时间')}}</li> -->
                    <li
                        v-for="(method, key) in list"
                        :key="key"
                        :class="{ 'active': menuActive(key) }"
                        @click="handleMenuClick(key)"
                    >
                        {{$t(method.title_key)}}
                    </li>
                </ul>
            </div>
        </div>
        <div class="playinfo_mask" v-show="isActiveMobile" @click="isActiveMobile = false"></div>
        <transition name='playinfo_gotop-'>
            <div class="playinfo_gotop" :class="{ 'playinfo_gotop--rocket' : rocketFireOn }" @click="scrollToTop(true)" v-if="showTopButton">TOP</div>
        </transition>
    </div>
</template>
<style lang="scss" scoped>
</style>
<script>
import MethodMenu from '../980/MethodMenu'

export default {
    mixins: [MethodMenu],
    name: 'MethodMenu',
    data() {
        return {
            isActiveMobile: false
        }
    },
    methods: {
        addScrollListener() {
            if (this.isMobile) {
                window.addEventListener('scroll', this.handleScroll)
            } else {
                document.body.addEventListener('scroll', this.handleScroll)
            }
        },
        removeScrollListener() {
            if (this.isMobile) {
                window.removeEventListener('scroll', this.handleScroll)
            } else {
                document.body.removeEventListener('scroll', this.handleScroll)
            }
        },
        scrollToTop(rocketFireOn = false) {
            let nowScrollY = document.documentElement.scrollTop || document.body.scrollTop
            if (nowScrollY !== 0) {
                const sinMenu = this.$parent.$children[1].$el

                if (this.isMobile) {
                    // 320 蘋果不能滑到最頂element
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    })
                } else if (this.isW88) {
                    document.body.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    })
                } else {
                    sinMenu.scrollIntoView({
                        behavior: 'smooth',
                        block: 'end'
                    })
                }

                this.isActiveMobile = false
                rocketFireOn && (this.rocketFireOn = true)
            }
        },
        scrollToElement(el) {
            el.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            })
            this.isActiveMobile = false
        },
        openMenu() {
            this.isActiveMobile = !this.isActiveMobile
            this.updateDownMax()
        }
    }

}
</script>