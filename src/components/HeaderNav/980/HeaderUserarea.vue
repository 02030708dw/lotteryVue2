<template>
    <div class="gr_user-area" :class="{'isTest' : isTest}">
        <i class="gr_user-area__user-icon i_user"></i>
        <div class="gr_user-area__user-name">
            <span v-if="!isDemo" class="gr_user-name__str" :class="{'gr_user-name__str--italic': isTest}">{{userName}}</span>
            <span v-else class="gr_user-name__play">
                <!-- '试玩' -->
                {{$t('home_017')}}-{{currency}}
            </span>
        </div>
        <div class="gr_user-area__user-balance">
            <template v-if="!isShowDemo">
                <span class="gr_user-balance__num">{{availableBalanceFormat}}</span>
                <!-- '更新余额' -->
                <span @click='getBalance' :title="$t('home_018')">
                    <svg class="gr_user-area__icon" viewBox="0 0 18 18">
                        <path class="gr_icon__stroke" d="M1.6,7.5c0.7-3.4,3.7-6,7.4-6c2.6,0,4.9,1.3,6.3,3.4"/>
                        <polygon class="gr_icon__arrow" points="11.9,5.1 16.5,9 17.6,3.1"/>
                        <path class="gr_icon__stroke" d="M16.4,10.5c-0.7,3.4-3.7,6-7.4,6c-2.6,0-4.9-1.3-6.3-3.4"/>
                        <polygon class="gr_icon__arrow" points="6.1,12.9 1.5,9 0.4,14.9"/>
                    </svg>
                </span>
            </template>
        </div>

        <div class="gr_user-area__temp-empty" />
    </div><!-- user-area -->
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { Observable } from 'rxjs/Observable'
import { Subscription } from 'rxjs/Subscription'
import { formatNumber, isIE } from '@UTIL'
/* <div class="gr_user-area__temp-btn" v-if="isShowClassic || isShowThemeSwitch || isShowWap">
    <!-- 經典 -->
    <div class="gr_user-area__classic" v-if="isShowClassic">{{$t('pk10_t_129')}}</div>
    <!-- 復刻 -->
    <div class="gr_user-area__replica" v-if="isShowThemeSwitch" @click="switchTheme(2)">{{$t('home_058')}}</div>
    <!-- 手机 -->
    <div class="gr_user-area__wap" v-if="isShowWap" @click="switchTheme(3)">{{$t('home_068')}}</div>
</div> */

export default {
    name: 'HeaderUserarea',
    methods: {
        ...mapActions([
            _M.GET_WALLET_BALANCE
        ]),
        switchTheme(themeId) {
            const leftTamp = 24 * 60 * 60 * 1000 * 365 * 10
            const leftTime = new Date()
            leftTime.setTime(leftTamp + +leftTime)
            document.cookie = `theme=${themeId}` + ';path=/;expires=' + leftTime.toGMTString()
            location.reload()
        }
    },
    subscriptions() {
        return {
            getBalance$: this.$createObservableMethod('getBalance')
                .debounceTime(1000)
                .do(() => this[_M.GET_WALLET_BALANCE](true))
        }
    },
    computed: {
        ...mapGetters([
            'currency',
            'isShowThemeSwitch',
            'isShowWap',
            'isShowClassic',
            'availableBalance',
            'RWDMode',
            'isShowDemo',
            'JWT',
            'isTest',
            'isDemo'
        ]),
        userName() {
            const userName = this.JWT && this.JWT.user_nickname
                ? this.JWT.user_nickname
                // '亲爱的用户'
                : this.$t('home_019')
            return userName
        },
        availableBalanceFormat() {
            return formatNumber(this.availableBalance)
        }
    },
    mounted() {
        // rotate refresh icon, css transition doesn't work on IE9
        if (isIE() === 9) {
            let svg = document.getElementsByTagName('svg')[0]

            const hover = function() {
                svg.style.msTransform = 'rotate(90deg)'
            }
            const out = function() {
                svg.style.msTransform = 'rotate(0deg)'
            }

            const rotate = function(i) {
                svg.removeEventListener('mouseenter', hover)
                svg.removeEventListener('mouseenter', out)
                if (i < 36) {
                    svg.style.msTransform = 'rotate(' + i * 15 + 'deg)'
                    setTimeout(function() {
                        rotate(i + 1)
                    }, 10)
                } else {
                    svg.addEventListener('mouseenter', hover)
                    svg.addEventListener('mouseout', out)
                }
            }

            svg.addEventListener('click', function() {
                rotate(0)
            })
        }
    }
}
</script>
