<template>
    <div class="game_controlls container">
        <ul v-show="gameShowMode === 0">
            <li>
                <button class="c_button--default"  @click.stop="randomShowLotterys" v-show="showRandomBtn && !isShowClearControl && !isBlocked">
                    <i class="c_button__icon  i_ramdon" />
                    <span class="c_button__text">
                        <!-- {{$t("机选")}} -->
                        {{$t('common_124')}}
                    </span>
                </button>
            </li>
            <li>
                <button class="c_button--default" @click.stop="clearSelectBalls" v-show="isShowClearControl">
                    <i class="c_button__icon  i_clear" />
                    <span class="c_button__text">
                        <!-- {{$t("清空")}} -->
                        {{$t('common_049')}}
                    </span>
                </button>
            </li>
            <li>
                <button class="c_button--secondary" v-show="(gameOrder.nums === 0 || isBlocked) && boxLength > 0" @click.stop="showBox">
                    <i class="c_button__icon i_betting--320"></i>
                    <span class="c_button__text">
                        <!-- {{$t("查看投注项")}} -->
                        {{$t('common_123')}}
                    </span>
                    <div v-show="boxLength > 0"><span>{{boxLength > 9 ? 9 : boxLength}}</span><span v-if="boxLength > 9">+</span></div>
                </button>
            </li>
            <li>
                <button class="c_button--secondary" v-show="gameOrder.nums > 0 && gameOrder.times > 0 && !isBlocked" @click.stop="add">
                    <i class="c_button__icon  el-icon-plus" />
                    <span class="c_button__text">
                        <!-- {{$t("投注项")}} -->
                        {{$t('common_138')}}
                    </span>
                    <div v-show="boxLength > 0"><span>{{boxLength > 9 ? 9 : boxLength}}</span><span v-if="boxLength > 9">+</span></div>
                </button>
            </li>
            <li>
                <button
                    :class="[!isBlocked ? 'c_button--primary' : 'c_button--disabled', isFastDisabled]"
                    @click="(!isFastDisabled && gameOrder.nums > 0) && fast()"
                >
					<!-- {{$t("直接投注")}} : '本期停售'-->
                    <span class="c_button__text">{{$t((!isBlocked) ? "common_046" : "common_068")}}</span>
                </button>
            </li>
        </ul>
        <div class="u_clearfix" v-show="gameShowMode === 2">
            <div class="u_f--left game_controlls--text">
                <div>
                    <!-- 共{0}注 -->
                    <i18n path="common_073">
                        <strong place="0">{{ltProjectNum}}</strong>
                    </i18n>
                </div>
                <!-- 总计{0}元 -->
                <i18n path="common_074" tag="div" v-if="!isShowDemo">
                    <strong place="0">{{ltMoneyAmout}}</strong>
                    <template place="1">{{currencySymbol}}</template>
                </i18n>
            </div>
            <div class="u_f--right game_controlls--btn">
                <button
                    :class="[!allIsBlocked ? 'c_button--primary' : 'c_button--disabled']"
                    @click="handleGameOrder"
                >
					<!-- {{$t("确认投注")}} : '本期停售' -->
                    <span class="c_button__text">{{$t((!allIsBlocked) ? "common_076" : "common_068")}}</span>
                </button>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
@import '~@CSS/main.scss';
.game_controlls {
    width: 100%;
    min-height: 47px;
    background: backgrounds(secondary);
    border-top: 1px solid border_color(primary);
    font-size: 0;
    display: block;
    float: left;
    transition: all 0.3s ease;
    & ul {
        padding: 5.5px 10px 7.5px 10px;
    }
    & li {
        display: inline-block;
        & + li + li {
            float: right;
            margin-left: 10px;
            & button {
                min-width: 55px;
                padding: 7px 9px;
                @include multi-lang {
                    font-size: 13px;
                }
                & .i_betting {
                    width: 19px;
                    height: 19px;
                }
            }
        }
        &:first-child,
        &:nth-child(2) {
            & button {
                min-width: 55px;
                padding: 7px;
            }
        }
        &.disable {
            color: text_color(weak);
        }
        & div {
            @include circle(20px);
            background: $color_strong;
            color: text_color(default_invert);
            font-size: 10px;
            line-height: 20px;
            position: absolute;
            top: -8px;
            right: 0;
            text-align: center;
            transform: translateX(50%);
            z-index: 2;
        }
    }
    & > div {
        font-size: $font_size_small;
        line-height: 16px;
        padding: 5.5px 20px 7.5px 10px;
        position: relative;
        & button {
            padding: 7px
        }
        & .game_controlls--text {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            @include multi-lang {
                    width: calc(100% - 132px);
                & > div,& > div span {
                    display: block;
                    float:left;
                    width: 100%;
                }
            }
        }
        & .game_controlls--btn{
            @include multi-lang {
                height: 47px;
                & button{
                    top: 50%;
                    transform: translateY(-50%)
                }
            }
        }
    }
}
</style>
<script>
import GameControlls from '../980/GameControlls'
import { formatNumber } from '@UTIL'
import { mapGetters, mapActions } from 'vuex'

export default {
    name: 'GameControlls',
    mixins: [GameControlls],
    created() {
        if (window.DeviceMotionEvent && this.isMobile) {
            window.addEventListener('devicemotion', this.handleDeviceMotion, false)
        }
        this.$root.$on('back', this.back)
    },
    beforeDestroy() {
        window.removeEventListener('devicemotion', this.handleDeviceMotion, false)
        this.$root.$off('back', this.back)
    },
    data() {
        return {
            lastTime: 0,
            last: {
                x: 0,
                y: 0,
                z: 0
            },
            shakeSpeed: 800
        }
    },
    props: {
        isBlocked: Boolean
    },
    methods: {
        ...mapActions([
            _M.SET_GAME_SHOW_MODE,
            _M.GAME_ORDER_SUBMIT,
            _M.SET_HEADER_NAV_IS_BACK,
            _M.CLEAR_ALL_BALLS,
            _M.ORDER_FUTURE_MULTIPLE_ALL,
            _M.SET_SUBMIT_ORDER,
            _M.REMOVE_SUBMIT_ORDER_INDEX
        ]),
        showBox() {
            this[_M.SET_HEADER_NAV_IS_BACK](true)
            this[_M.SET_GAME_SHOW_MODE](2)
        },
        randomShowLotterys() {
            if (this.isBlocked) return
            this.$root.$emit('setRandonBall320')
        },
        // 確認投注
        handleGameOrder() {
            // 投注前檢查
            this.$root.$emit('beforeCheck', this[_M.GAME_ORDER_SUBMIT].bind(null, this), ['checkBoxAndDel'])
        },
        formatNumber(number) {
            return formatNumber(parseFloat(number))
        },
        clearSelectBalls() {
            this[_M.CLEAR_ALL_BALLS]()
        },
        handleDeviceMotion(e) {
            const nowTime = +new Date()
            //如果这次摇的时间距离上次摇的时间有一定间隔 才执行
            if (nowTime - this.lastTime > 100) {
                const { x, y, z } = e.accelerationIncludingGravity
                const diffTime = nowTime - this.lastTime//记录时间段
                this.lastTime = nowTime//记录本次摇动时间，为下次计算摇动时间做准备
                //计算 公式的意思是 单位时间内运动的路程，即为我们想要的速度
                const speed = Math.abs(x + y + z - this.last[x] - this.last[y] - this.last[z]) / diffTime * 10000
                if (speed > this.shakeSpeed) {
                    //成功摇一摇
                    this.clearSelectBalls()
                    this.randomShowLotterys()
                }
                this.last = { x, y, z }
            }
        },
        back() {
            this[_M.SET_HEADER_NAV_IS_BACK](false)
            this[_M.SET_GAME_SHOW_MODE]()
        }
    },
    computed: {
        ...mapGetters([
            'gameShowMode',
            'currencySymbol',
            'isMobile',
            'gameIndex',
            'allIsBlocked',
            'gameSubmit',
            'gameLtProject',
            'getGameOption',
            'gameOrder',
            'currentjsDynamicData',
            'bonusLimit'
        ]),
        boxLength() {
            return (this.gameLtProject || []).length
        },
        isFastDisabled() {
            return this.gameOrder.nums > 0 && this.gameOrder.times > 0 ? null : 'c_button--disabled'
        },
        ltMoneyAmout() {
            return formatNumber(this.gameSubmit.ltMoneyAmout)
        },
        ltProjectNum() {
            return this.gameSubmit.ltProjectNum
        },
        isShowClearControl() {
            let isShow = false
            let i = this.gameOrder.gameBallData.length - 1
            while (i >= 0) {
                const arr = this.gameOrder.gameBallData[i].filter(items => items)
                if (arr.length > 0) {
                    i = 0
                    isShow = true
                }
                i--
            }
            return isShow
        },
        getGameName() {
            return this.gameMenuSub[this.gameIndex].title
        },
        // 有選包膽/包組的時候, 不能隨機選球
        showRandomBtn() {
            return Object.keys(this.getGameOption).length === 0
        }
    }
}
</script>