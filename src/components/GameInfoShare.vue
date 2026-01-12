<template>
    <div class="gr_page-detail  gr_page-detail--box">
            <div class="gr_page-detail__container gr_page-detail__title">
                <div>
                    <!-- {{$t("编辑分享注单")}} -->
                    {{$t('home_052')}}
                </div>
                <i class="el-icon-close" aria-label="Close" @click="back" />
            </div>
        <div class="gr_page-detail__container__main">
            <div class="gr_page-detail__container__main2">
                <div class="gr_page-detail__container__main3">
                    <div class="gr_page-detail__container gr_page-detail__top" :class="statusColor[info.status_flag] || 'black'">
                        {{$t(prizeStateText(info))}}
                    </div>
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
                    <div class="gr_page-detail_logo">
                        <img :src="shareLogo" alt="" />
                    </div>
                </div>
                <div class="gr_page-detail__container gr_page-detail__content" ref="text" />
            </div>
            <div class="gr_page-detail__shareBtn" align="center" >
                <!-- {{$t("分享")}} -->
                <el-button type="primary" :loading="isRenderImg" @click="handleShare">{{$t('popup_159')}}</el-button>
                <!-- {{$t("保存")}} -->
                <el-button :loading="isRenderImg" @click="handleScreen">{{$t('popup_160')}}</el-button>
            </div>
        </div>
    </div><!-- gr_page-detail -->
</template>

<style lang="scss" scoped>
.border {
    background: #f4ebde;
    box-shadow: inset 0 0 3px black;
}
</style>

<script>
// <div class="gr_page-detail_water__print">
//     <p v-for="i in 50"><span v-for="j in Math.ceil(100 / shareText.length)">{{shareText}}</span></p>
// </div>
import { formatNumber, getStorage, setStorage } from '@UTIL'
import { Storage } from '@API'
import { betStatusCls, methodName, parseDanto, parseUnit, traceSubTaskStatus, parseVNCode } from '@UTIL/presenter'
import { mapGetters, mapActions } from 'vuex'
import SubDetail_vn from './SubDetail_vn'
import SubDetail_th from './SubDetail_th'
import SubDetail_stock from './SubDetail_stock'
import SubDetail_bjl from './SubDetail_bjl'
import SubDetail_my from './SubDetail_my'
import SubDetail_la from './SubDetail_la'
import html2canvas from 'html2canvas'

export default {
    name: 'GameInfoShare',
    data() {
        return {
            title: this.$t('popup_161'),
            // shareText: this.$t('popup_162'),
            statusColor: {
                prepare: 'black',
                bingo: 'red',
                not_bingo: 'green'
            },
            isRenderImg: false
        }
    },
    components: {
        SubDetail_vn,
        SubDetail_th,
        SubDetail_stock,
        SubDetail_bjl,
        SubDetail_my,
        SubDetail_la
    },
    mounted() {
        const shareText = getStorage(Storage.shareText, false)
        this.$refs.text.innerHTML = shareText || 'https://share.com'
    },
    beforeDestroy() {
        this.back()
    },
    methods: {
        ...mapActions([
            _M.ACTION_PROJECT_CANCEL
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
        async handleHtml2Canvas(fn) {
            if (!this.isRenderImg) {
                this.isRenderImg = true
                const dom = document.querySelector('.gr_page-detail__container__main2')
                window.scrollTo(0, 0)
                const canvas = await html2canvas(dom, {
                    scale: 1.5,
                    logging: false,
                    useCORS: true,
                    ignoreElements: elm => elm.id === 'noScreen'
                })
                fn(canvas)
                setStorage(Storage.shareText, this.$refs.text.innerHTML, false)
                this.isRenderImg = false
            }
        },
        async handleShare() {
            const fn = (canvas) => {
                canvas.toBlob((blob) => {
                    navigator.share({
                        files: [new File([blob], 'share.jpg', {type: 'image/jpeg'})]
                    })
                        .then(() => {})
                        .catch((error) => console.log('Sharing failed', error))
                }, 'image/jpeg', 0.8)
            }
            this.handleHtml2Canvas(fn)
        },
        async handleScreen() {
            const fn = (canvas) => {
                const img = canvas.toDataURL('image/jpeg')
                const a = document.createElement('a')
                a.href = img.replace('image/jpeg', 'image/octet-stream')
                a.download = 'sharefile.jpg'
                a.click()
                this.afterScreen()
            }
            this.handleHtml2Canvas(fn)
        },
        afterScreen() {
        },
        prizeStateText(item) {
            return traceSubTaskStatus(item).txt || 'bettingrc_018'
        },
        // 判斷是否為自主彩
        isOfficial(lotID) {
            return +(this.lotteryList2[lotID] || {}).is_local === 0
        }
    },
    computed: {
        ...mapGetters([
            'lotteryList2',
            'isMobile',
            'RWDMode',
            'lang',
            'isShowBar',
            'shareLogo',
            'shareText'
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
