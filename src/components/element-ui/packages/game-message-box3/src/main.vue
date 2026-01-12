<template>
    <div class="el-message-box__wrapper" tabindex="-1" v-show="visible" @click.self="handleWrapperClick">
      <div v-if="!isVNode" class="el-message-box" :class="customClass">
        <div class="el-message-box__header" v-if="title !== undefined">
          <div class="el-message-box__title">{{ t(title) }}</div>
          <i class="el-message-box__close el-icon-close" aria-label="Close" @click="handleAction('cancel')" v-if="showClose"></i>
        </div>
        <div class="el-message-box__content" v-if="message !== ''">
          <div class="el-message-box__status" :class="[ typeClass ]"></div>
          <div class="el-message-box__message" :style="{ 'margin-left': typeClass ? '50px' : '0' }">
            <slot><p>{{ t(message) }}</p></slot>
          </div>
          <div class="el-message-box__input" v-show="showInput">
            <el-input v-model="inputValue" @keyup.enter.native="handleAction('confirm')" :placeholder="inputPlaceholder" ref="input"></el-input>
            <div class="el-message-box__errormsg" :style="{ visibility: !!editorErrorMessage ? 'visible' : 'hidden' }">{{ t(editorErrorMessage) }}</div>
          </div>
          <div class="el-message-box__message" :style="{ 'margin-left': typeClass ? '50px' : '0' }">
            <slot><p>{{ t(content) }}</p></slot>
          </div>
        </div>
        <div class="el-message-box__btns">
          <el-button
            :loading="confirmButtonLoading"
            ref="confirm"
            :class="[ confirmButtonClasses ]"
            v-show="showConfirmButton"
            @click.native="handleAction('confirm')">
            {{ t(confirmButtonText) }}
          </el-button>
          <el-button
            :loading="cancelButtonLoading"
            :class="[ cancelButtonClasses ]"
            v-show="showCancelButton"
            @click.native="handleAction('cancel')">
            {{ t(cancelButtonText) }}
          </el-button>
          <el-button
            :class="[ cancelButtonClasses ]"
            v-show="showLinkButton"
            @click.native="handleAction('link', routerUrl)">
            {{ t(LinkButtonText) }}
          </el-button>
        </div>
      </div>
      <div v-if="isVNode" class="el-message-box el-detail-message-box" :class="customClass">
        <slot>{{ message }}</slot>
      </div>
    </div>
</template>
<script type="text/babel">
  import MessageBox from '@E/packages/message-box/src/main.vue'
  import { i18n } from '@UTIL/vue'
  export default {
    mixins: [MessageBox],
    data() {
      return {
        uid: 1,
        title: undefined,
        message: '',
        content: '',
        type: '',
        isVNode: false,
        customClass: '',
        showInput: false,
        inputValue: null,
        inputPlaceholder: '',
        inputPattern: null,
        inputValidator: null,
        inputErrorMessage: '',
        showConfirmButton: true,
        showCancelButton: false,
        showLinkButton: false,
        action: '',
        confirmButtonText: '',
        cancelButtonText: '',
        confirmButtonLoading: false,
        cancelButtonLoading: false,
        confirmButtonClass: '',
        confirmButtonDisabled: false,
        cancelButtonClass: '',
        editorErrorMessage: null,
        callback: null,
        routerUrl: '',
        LinkButtonText: '连结'
      }
    },
    methods: {
      t(key) {
          return i18n().t(key)
      }
    }
  }
</script>
