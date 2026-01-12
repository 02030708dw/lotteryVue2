<template>
    <div class="gr_games-la-header__my-favorites  gr_my-favorites__tooltip"
        :class="{is_active: isInFavorites, is_tooltip: isTip}"
        @click="setMyFavorites"
    >
        <svg class="gr_my-favorites__icon" viewBox="0 0 17.85 16.11">
            <path d="M8.93,3.15C8.17-.47,2.14-.66.77,3.65c-2.18,6.79,6.67,9,8.16,12,1.48-3.07,10.32-5.25,8.15-12C15.71-.66,9.68-.47,8.93,3.15Z" />
        </svg>
        <span class="gr_tooltip__arrow" />
        <div class="gr_tooltip__popper">{{$t(tipTxt)}}</div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex'
    import { warnMessageBox } from '@UTIL'
    export default {
        name: 'LotteryLogo',
        data() {
            return {
                isSetFavoriting: false,
                isTip: false,
                tipTimer: null,
                tipTxt: '',
                setFavoritingTimer: null
            }
        },
        beforeDestroy() {
            clearTimeout(this.tipTimer)
            clearTimeout(this.setFavoritingTimer)
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
                        data = this.myFavorites.filter(id => id !== this.LA_lotteryId)
                        // '已取消最爱'
                        this.tipTxt = 'common_135'
                    } else if (this.myFavorites.length >= 30) {
                        // '最多30个最爱彩种'
                        this.tipTxt = 'home_043'
                    } else {
                        data = [...this.myFavorites, this.LA_lotteryId]
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
            }
        },
        computed: {
            ...mapGetters([
                'myFavorites',
                'LA_lotteryId'
            ]),
            isInFavorites() {
                return this.myFavorites.includes(this.LA_lotteryId)
            }
        }
    }
</script>