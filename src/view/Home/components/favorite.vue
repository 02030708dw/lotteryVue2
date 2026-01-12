<template>
    <div class="gr_lottery-favorite" :class="{is_favorite: isInFavorites, is_tooltip: isTip}" @click.stop.prevent="setMyFavorites">
        <svg width="25" viewBox="0 0 17.85 16.11">
            <defs>
                <linearGradient id="favoritesRed"
                    x1="0%" y1="0%"
                    x2="100%" y2="100%"
                    spreadMethod="pad">
                <stop offset="0%"   stop-color="#FF6473" stop-opacity="1"/>
                <stop offset="100%" stop-color="#DD1C24" stop-opacity="0.78"/>
                </linearGradient>
            </defs>
            <path d="M8.93,3.15C8.17-.47,2.14-.66.77,3.65c-2.18,6.79,6.67,9,8.16,12,1.48-3.07,10.32-5.25,8.15-12C15.71-.66,9.68-.47,8.93,3.15Z"></path>
            <g stroke="none" stroke-width="1" mask="url(#gr_icon__mask)">
                </g> <path d="M8.93,3.15C8.17-.47,2.14-.66.77,3.65c-2.18,6.79,6.67,9,8.16,12,1.48-3.07,10.32-5.25,8.15-12C15.71-.66,9.68-.47,8.93,3.15Z" class="gr_my-favorites__shape"></path></svg>
            <span class="gr_tooltip__arrow" />
            <div class="gr_tooltip__popper">{{$t(tipTxt)}}</div>
    </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import { warnMessageBox } from '@UTIL'
export default {
    name: 'Mixin',
    data() {
        return {
            isSetFavoriting: false,
            tipTimer: null,
            isTip: false,
            tipTxt: ''
        }
    },
    props: {
        lotteryId: [Number, String]
    },
    computed: {
        ...mapGetters([
            'myFavorites',
            'myFavoritesKey'
        ]),
        isInFavorites() {
            return this.myFavoritesKey[this.lotteryId]
        }
    },
    methods: {
        ...mapActions([
            _M.SET_MY_FAVORITES
        ]),
        async setMyFavorites() {
            if (!this.isSetFavoriting) {
                this.isSetFavoriting = true
                let data
                if (this.isInFavorites) {
                    data = this.myFavorites.filter(id => +id !== +this.lotteryId)
                    // '已取消最爱'
                    this.tipTxt = 'common_135'
                } else if (this.myFavorites.length >= 30) {
                    //return this.isSetFavoriting = false 超過30 tip
                    // '最多30个最爱彩种'
                    this.tipTxt = 'home_043'
                } else {
                    data = [...this.myFavorites, this.lotteryId]
                    // '已加入最爱'
                    this.tipTxt = 'common_136'
                }
                const isNotError = data ? await this[_M.SET_MY_FAVORITES](data) : true
                this.setFavoritingTimer = setTimeout(() => (this.isSetFavoriting = false), 500)
                if (isNotError) {
                    this.isTip = true
                    clearTimeout(this.tipTimer)
                    this.tipTimer = setTimeout(() => (this.isTip = false), 1000)
                } else {
                    this.$msg(warnMessageBox({
                        // '系统繁忙中，请再试一次。'
                        message: this.$t('popup_098')
                    }))
                }
            }
        }
    }
}
</script>