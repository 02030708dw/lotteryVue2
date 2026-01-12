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
                <div class="el-message-box__game-title">
                    {{$t(lotteryNameKey)}}
                </div>
                <div class="el-message-box__game-period">
                    <!-- 起始期号 -->
                    {{$t('popup_005')}}︰{{ltIssueStart}}
                </div>
                <div class="el-message-box__game-content">
                    <div class="el-game-content__inner">
                        <div v-for='item in ltProject'>
                            <span :class="{text_color_strong: TH_over[item.methodId]}">[{{showMethodName(item.methodId)}}]</span>
                            <strong><span class="betting_detail" />{{item.codes}}</span></strong>
                            <span :class="{text_color_strong: TH_prizeChange[item.methodId]}">@{{item.hprize}}</span>
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
<style lang="scss" scoped>
@import '~@CSS/main.scss';
/deep/ .betting_detail span {
    margin: 0 2px;
    &.sy {
        margin: 0 5px;
    }
}
</style>
<script>
    import { formatNumber } from '@UTIL'
    import MessageBox from '@C/MessageBox/main'
    import { mapGetters } from 'vuex'
    export default {
        name: 'gameSubmitBox',
        mixins: [MessageBox],
        data() {
            return {
                isShowLocalCancelBtn: true,
                isShowLocalCloseIcon: true,
                keyObj: {
                    '1D': 'thai_011',
                    '2D': 'thai_010',
                    '3D': 'thai_009'
                }
            }
        },
        methods: {
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
            showMethodName(methodId) {
                const { title_key, parent } = this.TH_gameSubMenuObj[methodId]
                return `${this.$t(this.keyObj[parent.toUpperCase()])}-${this.$t(title_key)}`
            }
        },
        computed: {
            ...mapGetters([
                'isShowDemo',
                'currencySymbol',
                'TH_gameSelectDataArr',
                'TH_gameSubMenuObj',
                'availableBalance',
                'lotteryList2',
                'TH_lotteryId',
                'TH_ltMoneyAmout',
                'TH_jsDynamicConfig',
                'TH_over',
                'TH_prizeChange'
            ]),
            lotteryNameKey() {
                return (this.lotteryList2[this.TH_lotteryId] || {}).title_key || ''
            },
            isConfirmButton() {
                const money = this.TH_ltMoneyAmout
                return parseFloat(this.availableBalance.toString().replace(/,/g, '')) >= money
            },
            balance() {
                return formatNumber(this.availableBalance) || '0'
            },
            ltProject() {
                return this.TH_gameSelectDataArr
            },
            ltMoneyAmout() {
                return formatNumber(this.TH_ltMoneyAmout)
            },
            ltProjectNum() {
                return this.TH_gameSelectDataArr.length
            },
            ltIssueStart() {
                return this.TH_jsDynamicConfig.number
            },
            isShowCancelBtn() {
                return this.isShowLocalCancelBtn
            },
            isShowCloseIcon() {
                return this.isShowLocalCloseIcon
            }
        }
    }
</script>
