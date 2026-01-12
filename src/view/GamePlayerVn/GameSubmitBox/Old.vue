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
                  :class="[{stop: hasStop({codes: scode_key, methodId, cityId, issue})},isStopClass(methodId, cityId, issue)]"
                  v-for="({scode_key, cityId, methodId, methodNameKey, method_key, issue, money, onePrice}, i) in showList"
                  :key="methodId + i + scode_key"
                >
                  <TbTd @click.native="handleRemove(i)">
                    <TbCom>{{i + 1}}</TbCom>
                    <div class="el-icon-close"></div>
                  </TbTd>
                  <TbTd>
                    <TbCom>{{scode_key.filter ? scode_key.filter(c => c).join(',') : $t(scode_key)}}</TbCom>
                  </TbTd>
                  <TbTd v-if="!VN_isLocal">
                    <TbCom>{{$t(VN_cityData[cityId])}}</TbCom>
                  </TbTd>
                  <TbTd>
                    <TbCom>{{$t(method_key)}}</TbCom>
                  </TbTd>
                  <TbTd v-if="VN_isLocal">
                    <TbCom>{{(VN_localIssue)}}</TbCom>
                  </TbTd>
                  <TbTd v-else>
                    <TbCom>{{transIssue(issue)}}</TbCom>
                  </TbTd>
                  <TbTd>
                    <TbCom>{{$t(methodNameKey)}}</TbCom>
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
              <strong place="0">{{totalNum}}</strong>
            </i18n>,
            <!-- 总计{0}元 -->
            <i18n path="common_074" v-if="!isShowDemo" tag="span">
              <strong place="0">{{ltMoneyAmout}}</strong>
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
import mixins from './mixins'
export default {
    name: 'GameSubmitBoxOld',
    mixins: [mixins],
    updated() {
        !this.VN_gameSubmit.showList.length && this.cancel()
    },
    methods: {
        async confirm() {
            if (this.VN_StopNumberFilter.length) {
                return this[_M.FILTER_NUMBER_VN]()
            }

            if (this.isConfirm) {
                return
            }
            this.isConfirm = true
            this.isEscClose = false
            const errorCode = await this.beforeConfirm(this)
            // errorCode === 0 && this.$root.$emit('reset320Times')
            this.reSetStore()
            this.handleClose()
        }
    }

}
</script>
