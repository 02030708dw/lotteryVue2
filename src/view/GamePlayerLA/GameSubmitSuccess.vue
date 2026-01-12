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
                    <el-button
                        class="el-message-box__rebet"
                        type="pramary"
                        v-show="isShowCancelBtn"
                        :loading="isCancelLoading"
                        @click.native="cancel">
                        {{ $t(cancelText) }}
                    </el-button>
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
    import MessageBox from '@C/MessageBox/main'
    import { mapGetters } from 'vuex'
    export default {
        name: 'GameIssueBox',
        mixins: [ MessageBox ],
        computed: {
            ...mapGetters([
                'isRect'
            ])
        }
    }
</script>
