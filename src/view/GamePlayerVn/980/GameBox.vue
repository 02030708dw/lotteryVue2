<template>
    <div class="gr_container  bg_accent  u_clearfix">
        <div class="header u_clearfix">
            <i class="i_betting--980"></i>
            <span class="header__title">
                <!-- {{$t("投注项")}} -->
                {{$t('common_047')}}
            </span>
            <div class="area_btn">
                <button class="c_button--default" @click="handleEmpty">
                    <i class="c_button__icon  i_clear" />
                    <span class="c_button__text">
                        <!-- {{$t("清空")}} -->
                        {{$t('common_049')}}
                    </span>
                </button>
            </div>
        </div>
        <div class="content bg_secondary_light">
            <div class="content_inner">
                <div class="list u_clearfix"
                    :class="{stop: hasStop(item)}"
                    v-for="(item, index) in showList"
                    :key="index"
                    @click.stop.prevent="handleReSelect(index)">
                    <div>
                        <!-- 日期-城市 ex:04-05 平阳  -->
                        <span v-if="item.issue && VN_menuIndex && !VN_lotteryId" class="text_color_accent">{{transDate(item.issue)}} {{$t(VN_cityData[item.cityId])}}</span>
                        <!-- 玩法組和 ex:[3D-尾] -->
                        <span>[{{item.title.toUpperCase()}}-{{$t(item.title_key)}}]</span>
                        <!-- code ex: 123,456 -->
                        <span ref="order" class="show_order" v-html="parseVNCode(item, { length: 20 })" />
                        <div class="show_detail" v-if="parseVNCode(item, { isHtml: false }).length > 20">
                            <a href="javascript: void(0)" class="text_color_accent_invert" @click.stop.prevent="open(index)">
                                <!-- {{$t("详情")}} -->
                                {{$t('common_125')}}
                            </a>
                            <!-- 詳情框 -->
                            <div class="list_detail shadow_linear" v-if="isOpen === index">
                                <div class="list_detail_title bg_secondary_heavy">
                                    <!-- {{$t("共{0}注", {'0': formatNumber(item.nums)})}} -->
                                    {{$t("common_073", {'0': formatNumber(item.tNums)})}}
                                    <i class="el-icon-close" @click.stop.prevent="close" />
                                </div>
                                <div class="list_detail_inner">
                                    <div class="list_detail_inner_item" v-for="(code, index) in item.codes.split(',')" :key="index">
                                        {{code.replace(/&/g, ' , ')}}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <span>{{$t(showMode(item.mode))}}</span>
                        <span>{{formatNumber(item.tNums)}}
                            <!-- {{$t("注")}} -->
                            {{$t('common_033')}}
                        </span>
                        <span>
                            {{formatNumber(item.times)}}
                            <!-- {{$t("倍")}} -->
                            {{$t('common_034')}}
                        </span>
                        <span v-if="!isShowDemo">
                            <!-- {0} 元 -->
                            {{$t('common_044', {'1': currencySymbol, '0': formatNumber(item.money)})}}
                        </span>
                        <a href="javascript: void(0)" @click.stop.prevent="handleRemove(index)" ><i class="el-icon-close" /></a>
                    </div>
                </div>
            </div>
        </div>

        <div class="controls_total" v-if="ltProjectNum > 0">
            <!-- 共{0}注 -->
            <i18n path="common_073">
                <strong place="0">{{ formatNumber(ltProjectNum) }}</strong>
            </i18n>
            <!-- 总计{0}元 -->
            <i18n v-if="!isShowDemo" path="common_074" tag="span">
                <strong place="0">{{ltMoneyAmout}}</strong>
                <template place="1">{{currencySymbol}}</template>
            </i18n>
            <button class="c_button--primary  c_button--large" @click="handleGameOrder" v-if="true">
                <div class="c_button__text">
                    <!-- {{$t("确认投注")}} -->
                    {{$t('common_076')}}
                </div>
                <ColdTimerButton v-if="VN_isLocal" />
            </button>
            <button class="c_button--disabled  c_button--large" v-else>
                <!-- 本期停售 -->
                <span class="c_button__text">{{$t('common_068')}}</span>
            </button>
        </div>
    </div>
</template>
<style lang="scss" scoped>
@import '~@CSS/main.scss';
.gr_container {
    padding: 27px 20px 20px;
    position: relative;
    & .header {
        line-height: 29px;
        margin-bottom: 10px;
        & .header__title {
            display: inline-block;
            font-size: $font_size_large;
            font-weight: bold;
            vertical-align: middle;
        }
    }
    & .area_btn {
        float: right;
    }
    & .content {
        @extend %shadow_linear_gradient_default;
        border: 1px solid border_color(dark);
        font-size: $font_size_small;
        padding: 5px;
        & .content_inner {
            height: 170px;
            overflow-y: scroll;
            & .list {
                border-bottom: 1px solid border_color(light);
                padding-left: 15px;
                & > div {
                    float: left;
                    line-height: 23px;
                    padding: 5px 0;
                    & + div {
                        float: right;
                        & span {
                            border-left: 1px solid border_color(light);
                            padding: 0 10px;
                        }
                        & .hprize {
                            border: none;
                            padding: 0;
                        }
                        & i {
                            color: lighten($color_default, 70%);
                            padding-right: 15px;
                        }
                    }
                }

                &.active,
                &.active:hover {
                    background: backgrounds(secondary_heavy);
                    & i {
                        color: lighten($color_secondary, 7.5%);
                    }
                }
                &:hover {
                    background: backgrounds(secondary);
                }
                & .show_order {
                    display: inline-block;
                    height: 14px;
                    white-space: nowrap;
                    line-height: 14px;
                    vertical-align: text-bottom;
                }
                &.stop {
                    background: #fecacb;
                }
                & .show_detail {
                    display: inline;
                    position: relative;
                    & .list_detail {
                        background: backgrounds(primary);
                        border: 1px solid border_color(primary_dark);
                        min-width: 140px;
                        position: absolute;
                        top: 0;
                        left: 120%;
                        z-index: 1;
                        & .list_detail_title {
                            padding: 0 35px 0 10px;
                            position: relative;
                            white-space: nowrap;
                        }
                        & .list_detail_inner {
                            line-height: 20px;
                            margin: 5px;
                            max-height: 120px;
                            max-width: 320px;
                            overflow: auto;
                        }
                        & i {
                            cursor: pointer;
                            position: absolute;
                            top: 50%;
                            right: 10px;
                            transform: translateY(-50%);
                        }
                    }
                }
            }
        }
    }
    & .controls_trace {
        float: left;
        line-height: 47px;
        padding-top: 15px;
    }
    & .controls_trace--narrow {
        line-height: 20px;
    }
    & .controls_total {
        float: right;
        line-height: 47px;
        padding: 15px 0 0 15px;
        text-align: right;
        & button {
            font-size: 0;
            float: right;
            margin-left: 15px;
            & div {
                display: inline-block;
                font-size: $font_size_xlarge;
                vertical-align: middle;
                & + div {
                    border-left: 1px solid $color_default_invert;
                    font-size: $font_size_small;
                    margin-left: 8px;
                    padding-left: 8px;
                }
                & span {
                    display: block;
                    line-height: 14px;
                }
            }
            & > span {
                font-size: $font_size_large;
            }
        }
        span + span {
            padding: 0 0 0 15px;
        }
    }
    & .controls_total--narrow {
        padding: 0;
    }
}
</style>
<script>
import { mapGetters, mapActions } from 'vuex'
import { formatNumber } from '@UTIL'
import { parseVNCode } from '@UTIL/presenter'
import ColdTimerButton from './ColdTimerButton'

export default {
    name: 'GameBox',
    components: {
        ColdTimerButton
    },
    data() {
        return {
            checked: true,
            isOpen: -1
        }
    },
    methods: {
        ...mapActions([
            // _M.RE_SELECT_BALL,
            _M.FILTER_NUMBER_VN,
            _M.GAME_ORDER_VN_SUBMIT,
            _M.GAME_ORDER_VN_SUBMIT_BOX
        ]),
        showMode(mode) {
            if (this.lang !== 'cn') {
                return mode
            } else {
                switch (+mode) {
                    case 1:
                        return 'common_035' // '元'
                    case 2:
                        return 'common_036' // '角'
                    case 3:
                        return 'common_037' // '分'
                    case 4:
                        return '厘'
                }
            }
        },
        transDate(issue) {
            const data = issue.split('-')[0]
            const date = moment(data)
            return date.format('MM-DD')
        },
        async handleReSelect(index) {
            // await this[_M.RE_SELECT_BALL](index)
            // this.$router.replace(`/GamePlayer/${this.lotteryId}?sub=${this.gameOrder.typeName}`)
            // // 透過refs去觸發該元件(InputRange)的方法
            // const inputRangeVM = this.$parent.$children.find(vm => vm.$vnode.componentOptions.tag === 'GameControlls')
            // inputRangeVM && inputRangeVM.$refs.inputRange && inputRangeVM.$refs.inputRange.handleInputValue()
        },
        handleEmpty() {
            this[_M.GAME_ORDER_VN_SUBMIT]({ type: 8 })
        },
        handleRemove(index) {
            this[_M.GAME_ORDER_VN_SUBMIT]({ type: 2, index })
        },
        handleGameOrder() {
            if (this.VN_StopNumberFilter.length) {
                return this[_M.FILTER_NUMBER_VN]()
            }
            // 插入停售彈窗
            const isStop = this.showList.find(({methodId, issue}) => this.VN_nowStopId[methodId + (this.VN_localIssue || issue)])
            const isBlocked = this.showList.find(({methodId, cityId}) => this.VN_nowblockedId[methodId] || this.VN_nowblockedId[cityId])
            const fn2 = () => this[_M.GAME_ORDER_VN_SUBMIT_BOX]()
            if (isBlocked) {
                return this.$root.$emit('blocked', { fn: fn2, isFilter: true })
            } else if (isStop) {
                return this.$root.$emit('stopBet', { fn: fn2, isFilter: true })
            }
            fn2()
        },
        isActive(index) {
            // return this.game.isEditIndex === index ? 'active' : ''
        },
        close() {
            this.isOpen = -1
        },
        open(index, e = {}) {
            // const showCodes = this.ltProject[index].showCodes
            const showCodes = ''
            if (showCodes.length >= 50000) {
                this.openWindow(showCodes)
                return
            }
            this.isOpen = index
            // this[_M.GAME_DETAIL_TOGGLE](index)

            // 判斷詳細框要靠左還是靠右
            this.isBreakLine = window.innerWidth / 2 < e.x
        },
        formatNumber(number) {
            return formatNumber(number)
        },
        openWindow(showCodes) {
            // const newWindow = window.open('', '_blank')
            // newWindow.document.title = '環彩 Intl. Lottery'
            // const div = document.createElement('div')
            // div.innerHTML = showCodes
            // div.style.wordWrap = 'break-word'
            // newWindow.document.body.appendChild(div)
            try {
                var newWindow = window.open('', '_blank')
                // '世彩国际(GW)'
                newWindow.document.title = this.$t('home_022')
                newWindow.document.body.appendChild(newWindow.document.createElement('div'))
                newWindow.document.querySelector('div').innerHTML = showCodes
                newWindow.document.querySelector('div').style.wordWrap = 'break-word'
            } catch (err) {
                console.log('err', err)
            }
        },
        closeDetailWindow() {
            this.close()
        },
        parseVNCode(item, { isHtml, length }) {
            // 如果有開'特殊'才需要scode
            return parseVNCode({
                code: item.codes,
                // scode: item.scodes,
                methodName: item.title.toUpperCase(),
                isHtml,
                length
            })
        },
        isStopClass(methodId, cityId, issue) {
            let obj = {}
            if (this.VN_nowblockedId[methodId] || this.VN_nowblockedId[cityId]) {
                obj.stop = true
            } else if (this.VN_nowStopId[methodId + (this.VN_localIssue || issue)] || this.VN_nowStopAndOverId[methodId + (this.VN_localIssue || issue)]) {
                obj.stop = true
            }
            return obj
        },
        hasStop({cityId, issue, methodId, codes}) {
            if (this.VN_stopNumberCalc[`${cityId}_${issue}_${methodId}`]) {
                let bool = false
                this.VN_stopNumberCalc[`${cityId}_${issue}_${methodId}`].forEach((code) => {
                    if (codes.includes(code)) {
                        bool = true
                    }
                })
                return bool
            } else {
                return false
            }
        }
    },
    mounted() {
        document.addEventListener('click', this.closeDetailWindow)
    },
    beforeDestroy() {
        document.removeEventListener('click', this.closeDetailWindow)
    },
    props: {
        // isBlocked: Boolean
    },
    computed: {
        ...mapGetters([
            'lang',
            'isShowDemo',
            'userType',
            'VN_gameSubmit',
            'VN_cityData',
            'VN_week',
            'VN_isLocal',
            'VN_menuIndex',
            'VN_lotteryId',
            'VN_nowStopId',
            'VN_nowStopAndOverId',
            'VN_nowblockedId',
            'currencySymbol',
            'VN_localIssue',
            'VN_StopNumberFilter',
            'VN_stopNumberCalc'
        ]),
        showList() {
            return this.VN_gameSubmit.showList
        },
        ltMoneyAmout() {
            return formatNumber(this.VN_gameSubmit.ltMoneyAmout)
        },
        ltProjectNum() {
            return this.VN_gameSubmit.ltProjectNum
        },
        multiLimit() {
            return this.game.betMultiLimit
        },
        isStop() {
            return this.showList.find(({methodId, issue}) => this.VN_nowStopId[methodId + (this.VN_localIssue || issue)] || this.VN_nowStopAndOverId[methodId + (this.VN_localIssue || issue)])
        },
        isBlocked() {
            return this.showList.find(({methodId, cityId}) => this.VN_nowblockedId[methodId] || this.VN_nowblockedId[cityId])
        }
    }
}
</script>
