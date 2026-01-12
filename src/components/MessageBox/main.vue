<template>
    <div
        v-if="isShowBox"
        class="el-message-box__wrapper"
        :style="{ zIndex }"
        @click="isOutSideClickClose && close()"
        @touchmove.stop
        @mousewheel.stop
    >
        <div class="el-message-box" :class="className" @click.stop >
            <template  v-if="!$slots.default">
                <div class="el-message-box__header" v-if="title !== undefined">
                    <div class="el-message-box__title">{{ $t(title) }}</div>
                    <i class="el-message-box__close el-icon-close" aria-label="Close" @click="close" v-if="isShowCloseIcon"></i>
                    <div
                        @click="close"
                        v-if="isShowCloseIcon"
                        style="position: absolute; top: 0; right: 0; height: 100%; width: 50px; background: transparent; cursor: pointer;"
                    />
                </div>
                <div class="el-message-box__content" v-if="message !== ''">
                    <div class="el-message-box__status" :class="typeClass"></div>
                    <div class="el-message-box__message" :style="{ 'margin-left': type ? '50px' : '0' }">
                        <slot>
                            <p v-html="data.messageParam ? $t(message, this.data.messageParam) : $t(message)" />
                        </slot>
                    </div>
                    <div class="el-message-box__message" :style="{ 'margin-left': type ? '50px' : '0' }">
                        <slot>
                            <p v-html="$t(content) || ''" />
                        </slot>
                    </div>
                </div>
                <div class="el-message-box__btns">
                    <el-button
                        v-show="isShowCancelBtn"
                        :loading="isCancelLoading"
                        @click.native="cancel">
                        {{ $t(cancelText) }}
                    </el-button>
                    <el-button
                        ref="confirm"
                        v-show="isShowConfirmBtn"
                        class="el-button--primary"
                        :loading="isConfirmLoading"
                        @click.native="confirm">
                        {{ $t(confirmBtnText) }}
                    </el-button>
                </div>
            </template>
            <slot></slot>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'
    export default {
        name: 'MessageBox',
        destroyed() {
            this.close()
        },
        data() {
            return {
                time: 0,
                setTimeout: null,
                confirmDataText: '',
                cancelDataText: '',
                isCancel: false,
                isClose: false,
                isConfirm: false,
                isEscClose: true
            }
        },
        props: {
            zIndex: Number,
            className: {
                default: '',
                type: String
            }
        },
        updated() {
            if (this.show) {
                this.beforeMount(this)
            }
            if (this.isEscClose && !this.show) {
                this.handleClose()
                return
            }
            if (this.coldTime > 0 && !this.time) {
                clearTimeout(this.setTimeout)
                this.timer(this.time = this.coldTime)
            }
        },
        methods: {
            async cancel() {
                if (this.isCancel) {
                    return
                }
                this.isCancel = true
                this.isEscClose = false
                const afterCancel = this.afterCancel
                await this.beforeCancel(this)
                this.reSetStore()
                this.handleClose()
                afterCancel()
            },
            async close() {
                if (this.isClose) {
                    return
                }
                this.isClose = true
                this.isEscClose = false
                const afterClose = this.afterClose
                await this.beforeClose(this)
                this.reSetStore()
                this.handleClose()
                afterClose(this)
            },
            async confirm() {
                if (this.isConfirm) {
                    return
                }
                this.isConfirm = true
                this.isEscClose = false
                const afterConfirm = this.afterConfirm
                await this.beforeConfirm(this)
                this.reSetStore()
                this.handleClose()
                afterConfirm(this)
            },
            reSetStore() {
                this.$msg(this.zIndex)
            },
            timer() {
                if (this.time > 0) {
                    this.setTimeout = setTimeout(() => this.timer(--this.time), 1000)
                } else {
                    this.coldTime !== 0 && this.cancel()
                }
            },
            handleClose() {
                clearTimeout(this.setTimeout)
                this.time = 0
                this.confirmDataText = ''
                this.cancelDataText = ''
                this.isCancel = false
                this.isClose = false
                this.isConfirm = false
                this.isEscClose = true
            }
        },
        computed: {
            ...mapGetters([
                'messageBoxData'
            ]),
            data() {
                return this.messageBoxData[this.zIndex]
            },
            isShowBox() {
                return this.data && this.data.show
            },
            type() {
                return this.data ? this.data.type : null
            },
            title() {
                return this.data ? this.data.title : null
            },
            message() {
                return this.data ? this.data.message : null
            },
            content() {
                return this.data ? this.data.content : null
            },
            confirmText() {
                return this.data ? this.data.confirmText : null
            },
            cancelText() {
                return this.data ? this.data.cancelText : null
            },
            isShowConfirmBtn() {
                return this.data ? this.data.isShowConfirmBtn : null
            },
            isShowCancelBtn() {
                return this.data ? this.data.isShowCancelBtn : null
            },
            isShowCloseIcon() {
                return this.data ? this.data.isShowCloseIcon : null
            },
            isPressEscClose() {
                return this.data ? this.data.isPressEscClose : true
            },
            isOutSideClickClose() {
                return this.data ? this.data.isOutSideClickClose : false
            },
            show() {
                return this.data ? this.data.show : null
            },
            coldTime() {
                return this.data ? this.data.coldTime : null
            },
            beforeMount() {
                return this.data ? this.data.beforeMount : () => null
            },
            beforeConfirm() {
                return this.data ? this.data.beforeConfirm : () => null
            },
            beforeClose() {
                return this.data ? this.data.beforeClose : () => null
            },
            beforeCancel() {
                return this.data ? this.data.beforeCancel : () => null
            },
            afterConfirm() {
                return this.data ? this.data.afterConfirm : () => null
            },
            afterClose() {
                return this.data ? this.data.afterClose : () => null
            },
            afterCancel() {
                return this.data ? this.data.afterCancel : () => null
            },
            confirmBtnText() {
                return this.confirmDataText ? this.confirmDataText : this.confirmText
            },
            cancelBtnText() {
                return this.cancelDataText ? this.cancelDataText : this.cancelText
            },
            typeClass() {
                if (this.type === 'success') {
                    return 'el-icon-circle-check'
                } else if (this.type === 'warning') {
                    return 'el-icon-warning'
                }
                return ''
            },
            isConfirmLoading() {
                return this.isConfirm
            },
            isCancelLoading() {
                return this.isCancel
            }
        }
    }
</script>
