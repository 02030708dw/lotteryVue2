<template>
  <div class="el-message-box__wrapper" v-show="visible" @click.self="handleWrapperClick">
    <div class="el-message-box el-news-message-box" :class="customClass">
      <div class="el-message-box__header" v-if="title !== undefined">
        <div class="el-message-box__title">{{ title || t('el.messagebox.title') }}</div>
        <i class="el-message-box__close el-icon-close" aria-label="Close" @click="handleAction('cancel')" v-if="showClose"></i>
      </div>
      <div class="el-message-box__content">
        <div class="el-message-box__news-content">
          <slot><p>
            尊敬的用户，您好:<br><br>
            中国民生银行即将进行维护。<br>
            5月21日(星期日) 00:00 时 至  5月21日07:00 在此期间，暂停有关中国民生银行的充提服务。<br><br>
            感谢您的理解和支持，期间造成您的不便，敬请见谅。<br>
            环彩营运部<br><br>
            2017/05/17
          </p></slot>
        </div>
      </div>
      <div class="el-message-box__btns">
        <el-button
          :loading="confirmButtonLoading"
          ref="confirm"
          :class="[ confirmButtonClasses ]"
          v-show="showConfirmButton"
          v-if="isConfirmButton"
          @click.native="handleAction('confirm')">
          详情
        </el-button>
        <el-button
          :loading="cancelButtonLoading"
          :class="[ cancelButtonClasses ]"
          v-show="showCancelButton"
          @click.native="handleAction('cancel')">
          {{ cancelButtonText || t('el.messagebox.cancel') }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import MessageBox from '@E/packages/game-message-box3/src/main.vue'
import { formatNumber } from '@UTIL'
import { getters } from '@UTIL/vue'

export default {
    mixins: [MessageBox],
    data() {
      return {
        fast: false
      }
    },
    computed: {
        isConfirmButton() {
          return parseFloat(this.availableBalance.toString().replace(/,/g,'')) > (this.fast ? getters.gameOrder.money : getters.gameSubmit.ltMoneyAmout)
        },
        availableBalance() {
            return formatNumber(getters.availableBalance) || '0'
        },
        ltProject() {
            return this.fast ? [getters.gameOrder] : getters.gameLtProject
        },
        ltMoneyAmout() {
            return this.fast ? formatNumber(getters.gameOrder.money) : formatNumber(getters.gameSubmit.ltMoneyAmout)
        },
        ltProjectNum() {
            return this.fast ? getters.gameOrder.nums : getters.gameSubmit.ltProjectNum
        },
        ltIssueStart() {
            return getters.gameSubmit.ltIssueStart
        },
        gameTypeName() {
            return getters.gameSubmit.gameTypeName
        },
        orderFuture() {
            return this.fast ? false : getters.gameSubmit.orderFuture
        },
        orderFutureIssue() {
            return getters.gameSubmit.orderFutureIssue
        },
        orderFutureMoneyAmount() {
            return getters.gameSubmit.orderFutureMoneyAmount
        }
    }
}

</script>
