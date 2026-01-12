<style lang="scss" scoped>
.show_detail {
  display: inline;
  position: relative;
  & a {
    white-space: nowrap;
  }
}
</style>
<style lang="scss">
  .customCode {
    word-break: break-all;
    width: 500px;
    & .el-message-box__message {
      max-height: 450px;
      overflow: auto;
    }
  }
</style>
<template>
  <div class="el-message-box__wrapper" :style="{ zIndex: 1998 }">
    <div class="el-message-box el-game-vn-message-box">
      <div class="el-message-box__header" v-if="title !== undefined">
        <!-- '投注确认' -->
        <div class="el-message-box__title">{{ $t('popup_108') }}</div>
        <i
          class="el-message-box__close el-icon-close"
          aria-label="Close"
          @click="close"
          v-if="isShowCloseIcon"
        ></i>
        <div
          @click="close"
          v-if="isShowCloseIcon"
          style="position: absolute; top: 0; right: 0; height: 100%; width: 50px; background: transparent; cursor: pointer;"
        />
      </div>
      <div class="el-message-box__content">
        <div class="el-message-box__game-vn-title">
          <p
            class="u_f--left"
            v-if="VN_isLocal"
          >{{$t(VN_currentlottery.title_key)}}-{{$t(VN_currentMethod)}}</p>
          <!-- 越南彩'全区'2D,3D,4D -->
          <p
            class="u_f--left"
            v-else
          >{{$t(lotteryMenu[3].title_key)}}-{{$t(VN_currentArea)}}{{$t(VN_currentMethod)}}</p>
          <!-- 注意：您有未完整填写的注单，按下取消即可检视。 -->
          <p class="u_f--right" v-show="isCurrent">{{$t('vn_t_054')}}</p>
        </div>
        <div class="el-message-box__game-vn-content">
          <div class="el-game-vn-content__inner">
            <table class="el-game-vn-content__table">
              <thead class="el-table__row el-table__title">
                <tr>
                  <th class="el-table__col" v-for="(title) in currentTitle" :key="title">
                    <!-- # -->
                    <TbCom>{{$t(title)}}</TbCom>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  class="el-table__row"
                  :class="[{stop: hasStop({codes, methodId, cityId, issue})},isStopClass(methodId, cityId, issue)]"
                  v-for="({codes, cityId, methodId, title, issue, money, tNums, onePrice, title_key}, i) in showList"
                  :key="methodId + i"
                >
                  <TbTd @click.native="handleRemove(i)">
                    <TbCom>{{i + 1}}</TbCom>
                    <div class="el-icon-close"></div>
                  </TbTd>
                  <TbTd>
                    <TbCom>
                        <span>{{codes.substr(0, 20)}}</span>
                        <div class="show_detail" v-if="codes.length > 20">
                            <a href="javascript: void(0)" class="text_color_accent_invert" @click.stop.prevent="open({codes, tNums})">
                                <!-- '详情' -->
                                {{$t('common_125')}}
                            </a>
                        </div>
                      </TbCom>
                  </TbTd>
                  <TbTd v-if="!VN_isLocal">
                    <TbCom>{{$t(VN_cityData[cityId])}}</TbCom>
                  </TbTd>
                  <TbTd>
                    <TbCom>{{title.toUpperCase()}}</TbCom>
                  </TbTd>
                  <TbTd v-if="VN_isLocal">
                    <TbCom>{{(VN_localIssue)}}</TbCom>
                  </TbTd>
                  <TbTd v-else>
                    <TbCom>{{transIssue(issue)}}</TbCom>
                  </TbTd>
                  <TbTd>
                    <TbCom>{{$t(title_key)}}</TbCom>
                  </TbTd>
                  <TbTd>
                    <TbCom>{{onePrice}}</TbCom>
                  </TbTd>
                  <TbTd>
                    <TbCom>{{money}}</TbCom>
                  </TbTd>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="u_clearfix">
            <!-- 注意：您有投注到已停售或超过投注限额的玩法，请协助移除。 -->
          <p class="u_f--right u_clearfix" v-show="isStop">{{$t('popup_154')}}</p>
            <!-- 注意：您有投注到已关闭的彩种或玩法，请协助移除。 -->
          <p class="u_f--right u_clearfix" v-show="isBlocked">{{$t('popup_153')}}</p>
        </div>
      </div>
      <div class="c_message-box__panel u_clearfix">
        <div class="el-message-box__game-vn-total">
          <div>
            <!-- 共{0}注 -->
            <i18n path="popup_010">
              <strong place="0">{{ltProjectNum}}</strong>
            </i18n>,
            <!-- 总计{0}元 -->
            <i18n path="common_074" v-if="!isShowDemo" tag="span">
              <strong>{{ltMoneyAmout}}</strong>
              <template place="1">{{currencySymbol}}</template>
            </i18n>
          </div>
          <div v-if="!isShowDemo" class="el-message-box__game-vn-balance">
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
            @click.native="cancel"
          >{{ $t(cancelText) }}</el-button>
          <el-button
            ref="confirm"
            v-show="isShowConfirmBtn"
            v-if="isConfirmButton"
            class="el-button--primary"
            :loading="isConfirmLoading"
            @click.native="confirm"
          >{{ $t(confirmBtnText) }}</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { formatNumber } from '@UTIL'
import mixins from './mixins'
import { parseVNCode } from '@UTIL/presenter'
import { mapGetters } from 'vuex'
export default {
    name: 'gameSubmitBoxInput',
    mixins: [mixins],
    updated() {
        !this.ltProjectNum && this.cancel()
    },
    methods: {
        open({codes, tNums}) {
            // 11,22,33,44,55,66,77,88,99,00,12,23,45,67,89,01,98,76,65,54
            this.$alert(codes, this.$t('common_073', {'0': formatNumber(tNums)}), {
                customClass: 'customCode',
                confirmButtonText: this.$t('el.messagebox.confirm')
            })
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
        transDate(issue) {
            const data = issue.split('-')[0]
            const date = moment(data)
            return date.format('MM-DD')
        },
        parseVNCode(item, isHtml = true) {
            // 如果有開'特殊'才需要scode
            return parseVNCode({
                code: item.codes,
                // scode: item.scode,
                methodName: item.title.toUpperCase(),
                isHtml
            })
        },
        handleRemove(index) {
            let obj = this.fast ? { type: 4, index } : { type: 2, index }
            this[_M.GAME_ORDER_VN_SUBMIT](obj)
        },
        formatNumber(num) {
            return formatNumber(num)
        }
    },
    computed: {
        ...mapGetters([
            'VN_gameOrder',
            'VN_menuIndex',
            'VN_lotteryId',
            'VN_stopNumberCalc'
        ]),
        fast() {
            return this.data ? this.data.fast : null
        },
        order() {
            return this.fast ? this.VN_gameOrder : this.VN_gameSubmit
        },
        isConfirmButton() {
            return (
                parseFloat(
                    this.availableBalance.toString().replace(/,/g, '')
                ) >= (+this.order.ltMoneyAmout).strip()
            )
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
            this.gameLtProject.forEach(({ bonus }) => (sum += bonus))
            return sum
        },
        codeStringLength() {
            return this.showList.reduce((codeSum, item) => {
                return codeSum + this.parseVNCode(item, false).length
            }, 0)
        }
    }
}
</script>
