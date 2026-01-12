<template>
  <div class="el-message-box__wrapper" v-show="visible" @click.self="handleWrapperClick">
    <div class="el-message-box el-game-message-box" :class="customClass">
      <div class="el-message-box__header" v-if="title !== undefined">
        <div class="el-message-box__title">{{ t(title) }}</div>
        <i class="el-message-box__close el-icon-close" aria-label="Close" @click="handleAction('cancel')" v-if="showClose"></i>
      </div>
      <div class="el-message-box__content">
        <div class="el-message-box__game-title">{{t(gameTypeName)}}</div>
        <div class="el-message-box__game-period">
          <!-- 起始期号 -->
          {{t("popup_005")}}︰{{ltIssueStart}}</div>
        <div class="el-message-box__game-content">
          <div v-for='gameOrder in ltProject' v-show='codeStringLength < 55000'>
            [{{t(gameOrder.parentName)}}{{t(gameOrder.childName)}}]{{gameOrder.showCodes}}
          </div>
          <div v-show='codeStringLength >= 55000'>
            <!-- 因内容庞大无法显示，您可点击:查看完整内容 -->
            <p>
              {{t("popup_039")}}：　<span class='text_color_accent_invert u_c--pointer' @click="openWindow">
              {{t("popup_040")}}
              </span></p>
          </div>
        </div>
        <div class="el-message-box__input" v-show="showInput">
          <el-input v-model="inputValue" @keyup.enter.native="handleAction('confirm')" :placeholder="inputPlaceholder" ref="input"></el-input>
          <div class="el-message-box__errormsg" :style="{ visibility: !!editorErrorMessage ? 'visible' : 'hidden' }">{{ t(editorErrorMessage) }}</div>
        </div>
      </div>
      <div class="u_clearfix">
        <div class="el-message-box__game-total u_f--left">
          <div v-if="orderFuture" >
            {{t("共追号")}}<strong>{{orderFutureLength}}</strong>{{t("期")}}
          </div>
          <div>{{t("共")}}<strong>{{numCalc}}</strong>{{t("注")}}</div>
          <div>{{t("总计")}}<strong>{{orderFuture ? orderFutureMoneyAmount : ltMoneyAmout}}</strong>{{t("元")}}</div>
          <div class="el-message-box__game-balance">{{t("可用余额")}}<strong>{{balance}}</strong>{{t("元")}}</div>
        </div>
        <div class="el-message-box__btns u_f--right">
          <span v-if="!isConfirmButton">{{t("余额不足")}}</span>
          <el-button
            :loading="confirmButtonLoading"
            ref="confirm"
            :class="[ confirmButtonClasses ]"
            v-show="showConfirmButton"
            v-if="isConfirmButton"
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
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MessageBox from '@E/packages/game-message-box3/src/main.vue'
import { formatNumber } from '@UTIL'
import { mapGetters } from '@UTIL/vue'
import { i18n } from '@UTIL/vue'

export default {
    mixins: [MessageBox],
    data() {
      return {
        fast: false
      }
    },
    methods:{
      openWindow() {
          // const newWindow = window.open('', '_blank')
          // const newWindowBody = newWindow.document.body
          // newWindow.document.title = '環彩 Intl. Lottery'
          // this.ltProject.forEach((items) => {
          //   const div = document.createElement('div')
          //   const p1 = document.createElement('p')
          //   const p2 = document.createElement('p')
          //   p1.innerHTML = `[${items.methodName}]`
          //   p2.innerHTML = items.showCodes
          //   div.style.wordWrap = 'break-word'
          //   div.appendChild(p1)
          //   div.appendChild(p2)
          //   newWindowBody.appendChild(div)
            try {
                var newWindow = window.open('', '_blank')
                newWindow.document.title = document.title
                this.ltProject.forEach((items) => {
                newWindow.document.body.appendChild(newWindow.document.createElement('p'));
                newWindow.document.querySelector('p').innerHTML= `[${items.methodName}]`
                newWindow.document.body.appendChild(newWindow.document.createElement('div'));
                newWindow.document.querySelector('div').innerHTML= items.showCodes
                newWindow.document.querySelector('div').style.wordWrap= 'break-word'
                })
            }
            catch(err) {
                console.log('err', err)
            }
          // })
      },
      t(key) {
          return i18n().t(key)
      }
    },
    computed: {
      ...mapGetters([
        'availableBalance',
        'gameOrder',
        'gameSubmit',
        'gameLtProject',
        'orderFutureLength'
      ]),
      isConfirmButton() {
        const money = this.orderFuture ? this.gameSubmit.orderFutureMoneyAmount : this.gameSubmit.ltMoneyAmout
        return parseFloat(this.availableBalance.toString().replace(/,/g,'')) >= (this.fast ? this.gameOrder.money : money)
      },
      balance() {
          return formatNumber(this.availableBalance) || '0'
      },
      ltProject() {
          return this.fast ? [this.gameOrder] : this.gameLtProject
      },
      codeStringLength() {
        let length = 0
        this.gameLtProject.forEach((items) => {
          length += `[${items.methodName}]${items.showCodes}`.length
        })
        return length
      },
      ltMoneyAmout() {
        return this.fast ? formatNumber(this.gameOrder.money) : formatNumber(this.gameSubmit.ltMoneyAmout)
      },
      ltProjectNum() {
        return this.fast ? this.gameOrder.nums : this.gameSubmit.ltProjectNum
      },
      numCalc() {
        return this.orderFuture ? formatNumber(this.ltProjectNum * this.orderFutureLength) : formatNumber(this.ltProjectNum)
      },
      ltIssueStart() {
        return this.gameSubmit.ltIssueStart
      },
      gameTypeName() {
        return this.gameSubmit.gameTypeName
      },
      orderFuture() {
        return this.fast ? false : this.gameSubmit.orderFuture
      },
      orderFutureIssue() {
        return this.gameSubmit.orderFutureIssue
      },
      orderFutureMoneyAmount() {
        return formatNumber(this.gameSubmit.orderFutureMoneyAmount)
      }
    }
}

</script>
