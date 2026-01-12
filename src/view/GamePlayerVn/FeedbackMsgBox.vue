<template>
    <div
        v-if="isShowBox"
        class="el-message-box__wrapper"
        :style="{ zIndex }"
        @click="isOutSideClickClose && close()"
    >
        <div class="el-message-box  el-feedback-message-box" :class="className" @click.stop >
            <template  v-if="!$slots.default">
                <div class="el-message-box__header" v-if="title !== undefined">
                    <!-- 游戏回馈 -->
                    <div class="el-message-box__title">{{ $t('popup_124') }}</div>
                    <i class="el-message-box__close el-icon-close" aria-label="Close" @click="close" v-if="isShowCloseIcon"></i>
                    <div
                        @click="close"
                        v-if="isShowCloseIcon"
                        style="position: absolute; top: 0; right: 0; height: 100%; width: 50px; background: transparent; cursor: pointer;"
                    />
                </div>
                <div class="el-message-box__content">
                    <p class="el-message-box__content__title">
                        <!-- 彩种/功能 -->
                        {{ $t('popup_143') }}
                    </p>
                    <p class="el-message-box__content__text">
                        <!-- 欲建议的彩种功能页，如时时彩二星投注页、六合彩开奖数据、投注记录等。 -->
                        {{ $t('popup_125') }}
                    </p>
                    <input
                        class="el-message-box__content__input"
                        type="text"
                        v-model="formTitle"
                        maxLength="50"
                    >
                    <p class="el-message-box__content__title">
                        <!-- 描述 -->
                        {{ $t('popup_144') }}
                    </p>
                    <!-- '请写下您对上述画面/功能的建议与回馈。\n如：在时时彩的手机端投注画面，可显示五期开奖号码。' -->
                    <textarea
                        class="el-message-box__content__textarea"
                        v-model="formContent"
                        maxLength="300"
                        :placeholder="$t('popup_126')"
                    />
                </div>
                <div class="el-message-box__btns">
                    <el-button
                        @click.native="cancelClick">
                        {{ $t(cancelText) }}
                    </el-button>
                    <!-- '送出' -->
                    <el-button
                        ref="confirm"
                        class="el-button--primary"
                        :class="{'is-disabled': !isValid}"
                        :loading="isConfirmLoading"
                        @click.native="isValid && confirm()">
                        {{ $t('popup_127') }}
                    </el-button>
                </div>
            </template>
            <slot></slot>
        </div>
    </div>
</template>

<script>
    import MessageBox from '@C/MessageBox/main'
    export default {
        name: 'FeedbackMsgBox',
        mixins: [MessageBox],
        data() {
            return {
                formTitle: '',
                formContent: ''
            }
        },
        methods: {
            reset() {
                this.formTitle = ''
                this.formContent = ''
            },
            cancelClick() {
                this.reset()
                this.cancel()
            }
        },
        computed: {
            isValid() {
                return this.formTitle.length > 0 && this.formContent.length > 0
            }
        }
    }
</script>
