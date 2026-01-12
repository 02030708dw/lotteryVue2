<template>
    <div class="game_controlls container">
        <ul v-if="!showGameBox">
            <li>
                <button v-if="false" class="c_button--default"  @click.stop="randomShowLotterys">
                    <i class="c_button__icon  i_ramdon" />
                    <span class="c_button__text">
                        <!--{{$t("机选")}}-->
                        {{$t('common_124')}}
                    </span>
                </button>
            </li>
            <li>

            </li>
            <li>
                <button class="c_button--secondary" v-show="(nums === 0) && boxLength > 0" @click.stop="handleGameBox">
                    <i class="c_button__icon i_betting--320"></i>
                    <span class="c_button__text">
                        <!-- {{$t("查看投注项")}} -->
                        {{$t('common_123')}}
                    </span>
                    <div v-show="boxLength > 0"><span>{{boxLength > 9 ? 9 : boxLength}}</span><span v-if="boxLength > 9">+</span></div>
                </button>
            </li>
            <li>
                <button class="c_button--secondary" v-show="money" @click.stop="add(1)">
                    <i class="c_button__icon  el-icon-plus" />
                    <span class="c_button__text">
                        <!-- {{$t("投注项")}} -->
                        {{$t('common_138')}}
                        <!-- {{$t('common_047')}} -->
                    </span>
                    <div v-show="boxLength > 0"><span>{{boxLength > 9 ? 9 : boxLength}}</span><span v-if="boxLength > 9">+</span></div>
                </button>
            </li>
            <li>
                <button
                    :class="['c_button--primary', isFastDisabled]"
                    @click="!isFastDisabled && handleGameOrderFast('gameOrder')"
                >
					<!-- {{$t("直接投注")}} : '本期停售'-->
                    <span class="c_button__text">{{$t('common_046')}}</span>
                </button>
            </li>
        </ul>
        <div class="u_clearfix" v-else>
            <div class="u_f--left game_controlls--text">
                <div>
                    <!-- 共{0}注 -->
                    <i18n path="common_073">
                        <strong place="0">{{ltProjectNum}}</strong>
                    </i18n>
                </div>
                <!-- 总计{0}元 -->
                <i18n path="common_074" tag="div" v-if="!isShowDemo">
                    <strong place="0">{{formatNumber(ltMoneyAmout)}}</strong>
                    <template place="1">{{currencySymbol}}</template>
                </i18n>
            </div>
            <div class="u_f--right game_controlls--btn">
                <button
                    :class="['c_button--primary']"
                    @click="handleGameOrder('gameSubmit')"
                >
					<!-- {{$t("确认投注")}} : '本期停售' -->
                    <span class="c_button__text">{{$t('common_076')}}</span>
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
    // position: fixed;
    // bottom: 0;
    // left: 0;
    // z-index: 50;
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
                //     & .i_clear {
                //         width: 12px;
                //     }
            }
            @include multi-lang {
                & button {
                // min-width: 35px;
                // padding: 7px 5px;
                //     & span {
                //         display: none;
                //     }
                }
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
import GameControlls from '../../980/GameControlls/Input'
import { mapGetters, mapActions } from 'vuex'

export default {
    name: 'GameControlls',
    mixins: [GameControlls],
    created() {
        // if (window.DeviceMotionEvent && this.isMobile) {
        //     window.addEventListener('devicemotion', this.handleDeviceMotion, false)
        // }
    },
    beforeDestroy() {
        // window.removeEventListener('devicemotion', this.handleDeviceMotion, false)
    },
    data() {
        return {
            lastTime: 0,
            last: {
                x: 0,
                y: 0,
                z: 0
            },
            shakeSpeed: 800,
            isFetching: false
        }
    },
    props: {
        handleGameBox: Function,
        showGameBox: Boolean,
        setIsFast: Function,
        isFast: Boolean
    },
    methods: {
        ...mapActions([
            _M.MOBILE_GAME_ORDER_VN_SUBMIT_BOX,
            _M.GAME_ORDER_VN_SUBMIT
        ]),
        async handleGameOrder() {
            if (!this.isFetching) {
                this.isFetching = true
                const errorCode = await this[_M.MOBILE_GAME_ORDER_VN_SUBMIT_BOX]('gameSubmit')
                this.isFetching = false
                if (errorCode === 0) {
                    // 一般投注
                    this.$root.$emit('back')
                    this[_M.GAME_ORDER_VN_SUBMIT]({type: 1, showList: [], ltMoneyAmout: 0})
                }
            }
        },
        async handleGameOrderFast() {
            if (!this.isFetching) {
                this.isFetching = true
                const isCheck = this.add(7, false)
                if (isCheck) {
                    const errorCode = await this[_M.MOBILE_GAME_ORDER_VN_SUBMIT_BOX]('gameOrder')
                    this.isFetching = false
                    if (errorCode === 0) {
                        // 快速投注
                        this.$root.$emit('reset', {times: ''})
                    }
                } else {
                    this.isFetching = false
                }
            }
        }
        // handleDeviceMotion(e) {
        //     const nowTime = +new Date()
        //     //如果这次摇的时间距离上次摇的时间有一定间隔 才执行
        //     if (nowTime - this.lastTime > 100) {
        //         const { x, y, z } = e.accelerationIncludingGravity
        //         const diffTime = nowTime - this.lastTime//记录时间段
        //         this.lastTime = nowTime//记录本次摇动时间，为下次计算摇动时间做准备
        //         //计算 公式的意思是 单位时间内运动的路程，即为我们想要的速度
        //         const speed = Math.abs(x + y + z - this.last[x] - this.last[y] - this.last[z]) / diffTime * 10000
        //         if (speed > this.shakeSpeed) {
        //             //成功摇一摇
        //             this.clearSelectBalls()
        //             this.randomShowLotterys()
        //         }
        //         this.last = { x, y, z }
        //     }
        // },
    },
    computed: {
        ...mapGetters([
            'isMobile',
            'VN_gameOrder',
            'VN_gameSubmit',
            'VN_jsPrize',
            'VN_stake',
            'VN_pos',
            'VN_currentMethod',
            'currencySymbol'
        ]),
        boxLength() {
            return this.VN_gameSubmit.showList.length
        },
        isFastDisabled() {
            return !this.money && 'c_button--disabled'
        },
        ltMoneyAmout() {
            return this.VN_gameSubmit.ltMoneyAmout
        },
        ltProjectNum() {
            return this.VN_gameSubmit.ltProjectNum || 0
        },
        isShowClearControl() {
            // let isShow = false
            // let i = this.VN_gameOrder.gameBallData.length - 1
            // while (i >= 0) {
            //     const arr = this.VN_gameOrder.gameBallData[i].filter(items => items)
            //     if (arr.length > 0) {
            //         i = 0
            //         isShow = true
            //     }
            //     i--
            // }
            // return isShow
            return false
        },
        getGameName() {
            // return this.gameMenuSub[this.gameIndex].title
        }
    }
}
</script>