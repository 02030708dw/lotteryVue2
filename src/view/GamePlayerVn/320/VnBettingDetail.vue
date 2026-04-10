<template>
    <div class="vn-detail">
        <div class="gr_page-detail gr_page-detail--box">
            <div class="gr_page-detail__container gr_page-detail__title">
                <div>{{ $t('popup_026') }}</div>
            </div>
            <div class="gr_page-detail__container__main">
                <div class="gr_page-detail__container gr_page-detail__head">
                    <p>{{ $t('popup_027') }}︰{{ info.project_display_id }}</p>
                    <p>{{ $t('popup_028') }}︰{{ info.write_time }}</p>
                    <span :class="statusCls">{{ $t(prizeStateText(info)) }}</span>
                </div>
                <SubDetail_vn v-if="hasInfo" :parent="this" />
                <div class="gr_page-detail__cancelBtn" v-if="isShowButton">
                    <div>
                        <el-button @click="userProjectCancel(info.project_id)">
                            {{ $t('popup_041') }}
                        </el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { formatNumber } from '@UTIL'
import { betStatusCls, traceSubTaskStatus, parseVNCode } from '@UTIL/presenter'
import { mapGetters, mapActions } from 'vuex'
import SubDetail_vn from '@C/SubDetail_vn'

export default {
    name: 'VnBettingDetail',
    components: { SubDetail_vn },
    computed: {
        ...mapGetters([
            'GameInfoDetailIndex',
            'gameInfoList',
            'gameTempInfo',
            'lotteryList2',
            'lang',
            'hasShare',
            'RWDMode',
            'currencySymbol'
        ]),
        hasInfo() {
            return this.info && this.info.project_id
        },
        info() {
            const formula = (this.gameInfoList && this.gameInfoList.pagination)
                ? this.gameInfoList.pagination.pageLimit
                : 1
            const page = Math.ceil((this.GameInfoDetailIndex + 1) / formula)
            const index = this.GameInfoDetailIndex % formula
            try {
                return this.gameTempInfo[page].data.list[index] || {}
            } catch (e) {
                return {}
            }
        },
        isShowButton() {
            return this.info.status_flag === 'prepare'
        },
        statusCls() {
            return betStatusCls(this.info)
        },
        transCode() {
            return parseVNCode({
                code: this.info.code,
                scode: this.info.scode,
                methodName: this.info.i18n_method_lv1_name,
                isHtml: false
            })
        },
        updateTransCode() {
            return parseVNCode({
                code: this.info.code,
                scode: this.info.scode,
                methodName: this.info.i18n_method_lv1_name
            })
        },
        getMode() {
            switch (Number(this.info.modes)) {
                case 1: return 'common_035'
                case 2: return 'common_036'
                case 3: return 'common_037'
                default: return ''
            }
        },
        bingoCode() {
            const code = this.info.bingo_code
            if (!code) return []
            if (code.indexOf(',') !== -1) return code.split(',')
            if (code.indexOf(' ') !== -1) return code.split(' ')
            return code.split('')
        },
        gameType() {
            return (this.lotteryList2[this.info.lottery_id] || {}).name
        }
    },
    methods: {
        ...mapActions([
            _M.SET_GAME_INFO_DETAIL_INDEX,
            _M.ACTION_PROJECT_CANCEL
        ]),
        back() {
            this[_M.SET_GAME_INFO_DETAIL_INDEX](-1)
        },
        formatNumber(number) {
            return formatNumber(number)
        },
        prizeStateText(item) {
            return traceSubTaskStatus(item).txt || 'bettingrc_018'
        },
        openWindow(showCodes) {
            try {
                const newWindow = window.open('', '_blank')
                newWindow.document.title = this.$t('home_022')
                newWindow.document.body.appendChild(newWindow.document.createElement('div'))
                newWindow.document.querySelector('div').innerHTML = showCodes
                newWindow.document.querySelector('div').style.wordWrap = 'break-word'
            } catch (err) {}
        },
        async userProjectCancel(projectId) {
            await this[_M.ACTION_PROJECT_CANCEL]({
                projectId,
                $this: this,
                fn: () => this.back(),
                countryType: 'vn'
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.vn-detail {
    .gr_page-detail--box {
        overflow-y: visible;
    }

    // 覆盖全局 fixed 定位，让撤销按钮留在弹窗内
    ::v-deep .gr_page-detail__cancelBtn {
        position: static !important;
        bottom: auto !important;
        width: 100%;
        padding: 10px;
        float: none;
    }
}
</style>
