<template>
    <div class="gr_page-detail  gr_page-detail--box">
            <div class="gr_page-detail__container gr_page-detail__title">
                <div>
                    <!-- {{$t("投注详情")}} -->
                    {{$t('popup_026')}}
                </div>
                <i class="el-icon-close" aria-label="Close" @click="back" />
            </div>
        <div class="gr_page-detail__container__main">
            <div class="gr_page-detail__container gr_page-detail__head">
                <p>
                    <!-- {{$t("注单编号")}} -->
                    {{$t('popup_027')}}︰{{info.project_display_id}}</p>
                <p>
                    <!-- {{$t("投注时间")}} -->
                    {{$t('popup_028')}}︰{{info.write_time}}</p>

                <span :class="statusCls">
                    <!-- 已取消 -->
                    <!-- {{$t(info.i18n_status_flag || "popup_029")}} -->
                    {{$t(prizeStateText(info))}}
                </span>
            </div><!-- gr_page-detail__container gr_page-detail__head -->

            <!-- lottery country -->
            <component :is="`SubDetail_${lotteryCountry}`" :parent="this" />
            <div class="gr_page-detail__cancelBtn">
                <div v-if="isShowButton">
                    <el-button @click="userProjectCancel(info.project_id)">
                        <!-- 撤销注单 -->
                        {{$t('popup_041')}}
                    </el-button>
                </div>
                <div>
                    <el-button v-if="hasShare" @click="handleShare">
                        <!-- 分享注单 -->
                        {{$t('popup_158')}}
                    </el-button>
                </div>
            </div>
        </div>
    </div><!-- gr_page-detail -->
</template>


<script>
import { formatNumber, componentBox } from '@UTIL'
import { betStatusCls, methodName, parseDanto, parseUnit, traceSubTaskStatus, parseVNCode } from '@UTIL/presenter'
import { mapGetters, mapActions } from 'vuex'
import SubDetail_vn from './SubDetail_vn'
import SubDetail_th from './SubDetail_th'
import SubDetail_stock from './SubDetail_stock'
import SubDetail_bjl from './SubDetail_bjl'
import SubDetail_my from './SubDetail_my'
import SubDetail_la from './SubDetail_la'

export default {
    name: 'GameInfoDetail',
    components: {
        SubDetail_vn,
        SubDetail_th,
        SubDetail_stock,
        SubDetail_bjl,
        SubDetail_my,
        SubDetail_la
    },
    beforeDestroy() {
        this.back()
    },
    methods: {
        ...mapActions([
            _M.ACTION_PROJECT_CANCEL,
            _M.SET_GAME_INFO_DETAIL_INDEX,
            _M.SET_GAME_INFO_SHARE_INDEX,
            _M.SET_HEADER_NAV_IS_BACK,
            _M.SET_MESSAGE_BOX_DATA
        ]),
        formatNumber(number) {
            return formatNumber(number)
        },
        methodName(method) {
            return methodName(method)
        },
        async userProjectCancel(projectId) {
            await this[_M.ACTION_PROJECT_CANCEL]({projectId, $this: this, fn: this.$root.handleAction, countryType: this.lotteryCountry})
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
        prizeStateText(item) {
            return traceSubTaskStatus(item).txt || 'bettingrc_018'
        },
        // 判斷是否為自主彩
        isOfficial(lotID) {
            return +(this.lotteryList2[lotID] || {}).is_local === 0
        },
        handleShare() {
            this[_M.SET_GAME_INFO_SHARE_INDEX](this.GameInfoDetailIndex)
            this[_M.SET_GAME_INFO_DETAIL_INDEX](-1)
            this[_M.SET_MESSAGE_BOX_DATA]({ zIndex: 1996 })
            this.$nextTick(() => {
                this[_M.SET_HEADER_NAV_IS_BACK](true)
            })
            if (this.RWDMode !== 3) {
                this.$msg(componentBox({
                    zIndex: 1997,
                    beforeConfirm: () => {
                        this[_M.SET_HEADER_NAV_IS_BACK](false)
                        this[_M.SET_GAME_INFO_SHARE_INDEX](-1)
                    }
                }))
            }
        }
    },
    computed: {
        ...mapGetters([
            'lotteryList2',
            'GameInfoDetailIndex',
            'RWDMode',
            'lang',
            'hasShare',
            'isShowBar'
        ]),
        isShowButton() {
            // prepare 才有撤单按钮可操作
            return this.info.status_flag === 'prepare'
            // return Number(this.info.is_getprize) === 0 && Number(this.info.is_cancel) === 0 && moment(this.info.sale_end).valueOf() > now(false)
        },
        message() {
            return this.isActions ? this.btnActionsMessage : this.btnMessage
        },
        statusCls() {
            return betStatusCls(this.info)
        },
        transCode() {
            return this.lotteryCountry === 'vn'
                ? parseVNCode({
                    code: this.info.code,
                    scode: this.info.scode,
                    methodName: this.info.i18n_method_lv1_name,
                    isHtml: false
                })
                : parseUnit(this.info.scode, Infinity, this.gameType)
        },
        getMode() {
            switch (Number(this.info.modes)) {
                case 1:
                    // '元'
                    return 'common_035'
                case 2:
                    // '角'
                    return 'common_036'
                case 3:
                    // '分'
                    return 'common_037'
                default:
                    return ''
            }
        },
        bingoCode() {
            const code = this.info.bingo_code
            if (!code) {
                return []
            }
            if (code.indexOf(',') !== -1) return code.split(',')
            if (code.indexOf(' ') !== -1) return code.split(' ')
            return code.split('')
        },
        updateTransCode() {
            return this.lotteryCountry === 'vn'
                ? parseVNCode({
                    code: this.info.code,
                    scode: this.info.scode,
                    methodName: this.info.i18n_method_lv1_name
                })
                : parseDanto(this.info, Infinity, this.gameType)
        },
        gameType() {
            return (this.lotteryList2[this.info.lottery_id] || {}).name
        }
    }
}
</script>
