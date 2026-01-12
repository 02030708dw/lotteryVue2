<template>
    <div class="el-message-box__wrapper" :style="{ zIndex }">
        <div class="el-message-box el-game-message-box">
            <div class="el-message-box__header" v-if="title !== undefined">
                <div class="el-message-box__title">{{ $t(title) }}</div>
                <i class="el-message-box__close el-icon-close" aria-label="Close" @click="close" v-if="isShowCloseIcon"></i>
                <div
                    @click="close"
                    v-if="isShowCloseIcon"
                    style="position: absolute; top: 0; right: 0; height: 100%; width: 50px; background: transparent; cursor: pointer;"
                />
            </div>
            <div class="el-message-box__content">

                <div class="el-message-box__game-title" v-if="VN_isLocal">
                    <div>{{$t(VN_currentlottery.title_key)}}</div>
                    <!-- 起始期号 -->
                    <div>{{$t('popup_005')}}︰{{VN_localIssue}}</div>
                </div>
                    <!-- 越南彩'全区'2D,3D,4D -->
                <div class="el-message-box__game-title" v-else>{{$t(lotteryMenu[3].title_key)}}-{{$t(VN_currentArea)}}{{$t(VN_currentMethod)}}</div>
                <div class="el-message-box__game-content">
                    <div class="el-game-content__inner">
                        <div v-for='(item, itemIndex) in showList' :key="itemIndex" v-show='codeStringLength < 50000'>
                            <!-- 日期-城市 ex:04-05 平阳  -->
                            <span v-if="item.issue && VN_menuIndex && !VN_lotteryId" class="text_color_accent">{{transDate(item.issue)}} {{$t(VN_cityData[item.cityId])}}</span>
                            <!-- 玩法組和 ex:[3D-尾] -->
                            <span>[{{item.title.toUpperCase()}}-{{$t(item.title_key)}}]</span>
                            <!-- code ex: 123,456 -->
                            <span v-html="parseVNCode(item)"/>
                        </div>
                        <div v-show='codeStringLength >= 50000'>
                            <!-- '因内容庞大无法显示，您可点击 , 查看完整内容' -->
                            <p>{{$t('popup_039')}}：　<span class='text_color_accent_invert u_c--pointer' @click="openWindow">{{$t('popup_040')}}</span></p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="c_message-box__panel  u_clearfix">
                <div class="el-message-box__game-total">
                    <div>
                        <!-- 共{0}注 -->
                        <i18n path="popup_010">
                            <strong place="0">{{ltProjectNum}}</strong>
                        </i18n>
                        <!-- 总计{0}元 -->
                        <i18n path="common_074" v-if="!isShowDemo" tag="span">
                            <strong place="0">{{ltMoneyAmout}}</strong>
                            <template place="1">{{currencySymbol}}</template>
                        </i18n>
                        <!--<span>盈利<strong>{{bonus}}</strong>元</span
                        <i18n path="盈利{0}元" v-if="!isShowDemo">
                            <strong place="0">{{bonus}}</strong>
                        </i18n>-->
                    </div>
                    <div v-if="!isShowDemo" class="el-message-box__game-balance">
                        <!-- 可用余额{0}元 -->
                        <i18n path="popup_011">
                            <strong place="0">{{balance}}</strong>
                        </i18n>
                    </div>
                </div>
                <div class="el-message-box__btns">
                    <span v-if="!isConfirmButton">
                        <!-- 余额不足 -->
                        {{$t('popup_067')}}
                    </span>
                    <el-button
                        v-show="isShowCancelBtn"
                        :loading="isCancelLoading"
                        @click.native="cancel">
                        {{ $t(cancelText) }}
                    </el-button>
                    <el-button
                        ref="confirm"
                        v-show="isShowConfirmBtn"
                        v-if="isConfirmButton"
                        class="el-button--primary"
                        :loading="isConfirmLoading"
                        @click.native="confirm">
                        {{ $t(confirmBtnText) }}
                    </el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { formatNumber } from '@UTIL'
    import MessageBox from '@C/MessageBox/main'
    import { parseVNCode } from '@UTIL/presenter'
    import { mapGetters } from 'vuex'
    export default {
        name: 'gameSubmitBoxInput',
        mixins: [MessageBox],
        data() {
            return {
                isShowLocalCancelBtn: true,
                isShowLocalCloseIcon: true
            }
        },
        updated() {
            !this.ltProjectNum && this.cancel()
        },
        props: {
            zIndex: {
                type: Number,
                default: 1998
            }
        },
        methods: {
            openWindow() {
                const newWindow = window.open('', '_blank')
                let html = ''
                // 如果有開'特殊'才需要scode
                this.order.showList.forEach((items) => {
                    const content = parseVNCode({
                        code: items.codes,
                        // scode: this.VN_gameOrder.scode,
                        methodName: items.title.toUpperCase(),
                        isHtml: false
                    })
                    const title = items.issue
                        ? `
                                <span>${this.transDate(items.issue)} ${this.$t(this.VN_cityData[items.cityId])}</span>
                                <span>[${items.title.toUpperCase()}-${this.$t(items.title_key)}]</span>
                            `
                        : `
                                <span>${this.$t(this.VN_cityData[items.cityId])}</span>
                                <span>[${items.title.toUpperCase()}-${this.$t(items.title_key)}]</span>
                            `

                    html += `<div style="word-wrap:break-word; word-break:normal;">
                            <p>${title}</p>
                            <p>${content}</p>
                        </div>`
                })
                newWindow.document.write(html)
                newWindow.document.title = this.$t('common_100')
            },
            transDate(issue) {
                const data = issue.split('-')[0]
                const date = moment(data)
                return date.format('MM-DD')
            },
            async confirm() {
                if (this.isConfirm) {
                    return
                }
                this.isConfirm = true
                this.isEscClose = false
                const errorCode = await this.beforeConfirm(this)
                // errorCode === 0 && this.$root.$emit('reset320Times')
                this.reSetStore()
                this.handleClose()
            },
            parseVNCode(item, isHtml = true) {
                // 如果有開'特殊'才需要scode
                return parseVNCode({
                    code: item.codes,
                    // scode: item.scode,
                    methodName: item.title.toUpperCase(),
                    isHtml
                })
            }
        },
        computed: {
            ...mapGetters([
                'RWDMode',
                'isShowDemo',
                'lotteryMenu',
                'availableBalance',
                'currencySymbol',
                'VN_week',
                'VN_isLocal',
                'VN_cityData',
                'VN_localIssue',
                'VN_gameOrder',
                'VN_gameSubmit',
                'VN_currentArea',
                'VN_currentMethod',
                'VN_currentlottery',
                'VN_menuIndex',
                'VN_lotteryId'
            ]),
            fast() {
                return this.data ? this.data.fast : null
            },
            order() {
                return this.fast ? this.VN_gameOrder : this.VN_gameSubmit
            },
            isConfirmButton() {
                return parseFloat(this.availableBalance.toString().replace(/,/g, '')) >= (+this.order.ltMoneyAmout).strip()
            },
            balance() {
                return formatNumber(this.availableBalance) || '0'
            },
            showList() {
                return this.order.showList
            },
            ltMoneyAmout() {
                return formatNumber(this.order.ltMoneyAmout)
            },
            ltProjectNum() {
                return this.order.ltProjectNum
            },
            bonus() {
                let sum = 0
                this.gameLtProject.forEach(({bonus}) => (sum += bonus))
                return sum
            },
            isShowCancelBtn() {
                return this.isShowLocalCancelBtn
            },
            isShowCloseIcon() {
                return this.isShowLocalCloseIcon
            },
            codeStringLength() {
                return this.showList.reduce((codeSum, item) => {
                    return (codeSum + this.parseVNCode(item, false).length)
                }, 0)
            }
        }
    }
</script>
