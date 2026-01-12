<template>
  <div class='gr_container bg_primary gr_page__controls'>
    <div class="bg_secondary" style="padding: 7px; 10px;" v-if="RWDMode === 3">
        <!-- '单日计算区间：北京时间00:00:00~23:59:59' -->
        <span>{{$t('bettingrc_045')}}</span>
    </div>
    <!-- 选择日期范围 -->
    <el-date-picker
        type="daterange"
        class="small el-select"
        popper-class="el-date-editor--calendar"
        format="yyyy-MM-dd"
        v-model="isData"
        :picker-options="pickerOptionsOpen"
        placeholder=""
        :editable="false"
        :clearable="false"
    />
    <!-- 帐变类型 -->
    <div class="el-accountsBalance">
        <el-select
            :class="[multiClassName, {'el-accountsBalance-input': RWDMode !== 1}]"
            :className='multiClassName'
            :placeholder="$t('wallet_032')"
            v-model='orderType'
            multiple
            :type="RWDMode !== 1 ? 'hidden' : ''"
        >
            <el-option
                :class="{'is_cancel': isCancel && itemChild.id === 9999}"
                v-for='itemChild in orderTypeNameListCopy'
                :key='itemChild.id'
                :label='$t(itemChild.title_key)'
                :value='itemChild.id'
            />

        </el-select>
        <div v-if="RWDMode !== 1" class="el-accountsBalance-text">{{$t('wallet_032')}}</div>
    </div>
    <button class="c_button--secondary c_button--small" @click='search'>
        <svg class="c_button__icon" viewBox="0 0 13 14">
            <ellipse transform="matrix(0.8311 -0.5561 0.5561 0.8311 -1.8221 3.9256)" class="st0" cx="5.6" cy="5" rx="3.8" ry="3.8"/>
            <rect x="7.8" y="7.4" transform="matrix(0.8311 -0.5561 0.5561 0.8311 -4.0778 6.6203)" class="st1" width="2.2" height="5.3"/>
        </svg>
        <!-- 查询 -->
        <span class="c_button__text">{{ $t("wallet_017") }}</span>
    </button>

    <div style="margin-top: 10px;padding-left: 5px;" v-if="RWDMode !== 3">
        <!-- '单日计算区间：北京时间00:00:00~23:59:59' -->
        <span>{{$t('bettingrc_045')}}</span>
    </div>
  </div>
</template>
<script>
import DatePicker from '@E/packages/date-picker/index.js'
import { formatDateToString, returnState } from '@UTIL'
import { mapActions, mapGetters } from 'vuex'
import throttle from '@UTIL/decorator/throttle'
import { orderTypeNameList } from '@UTIL/orderTypeIds'

export default {
    name: 'Controls',
    data() {
        return {
            className: 'small long',
            isCancel: false,
            pickerOptionsOpen: {
                disabledDate(time) {
                    return time.getTime() > Date.now() || (time && time.valueOf() < Date.now() - 86400000 * 8)
                }
            }
        }
    },
    components: {
        [DatePicker.name]: DatePicker
    },
    beforeMount() {
        if (this.isRich) {
            this.pickerOptionsOpen.disabledDate = (time) => time.getTime() > Date.now() || (time && time.valueOf() < Date.now() - 86400000 * 2)
        }
    },
    created() {
        this.$root.$on('checkOrderTypes', this.checkOrderTypes)
    },
    destroyed() {
        this.$root.$off('checkOrderTypes', this.checkOrderTypes)
    },
    computed: {
        ...mapGetters([
            'serverTime',
            'getWalletData',
            'isRich',
            'JWT',
            'isShowBar',
            'lang',
            'RWDMode'
        ]),
        isData: {
            set(isData) {
                if (!isData || (!isData[0] && !isData[1])) {
                    this[_M.SET_WALLET_DATA]({ startDate: '', endDate: '' })
                } else {
                    this[_M.SET_WALLET_DATA]({
                        startDate: isData[0] && formatDateToString(isData[0]),
                        endDate: isData[1] && formatDateToString(isData[1])
                    })
                }
            },
            get() {
                return [this.getWalletData.startDate, this.getWalletData.endDate]
            }
        },
        now() {
            return () => moment(this.serverTime)
        },
        orderType: {
            set(newOrder) {
                const oldOrder = this.getWalletData.orderTypeIds
                let orderTypeIds = []
                this.isCancel = false
                if (oldOrder.includes(9999) && !newOrder.includes(9999)) {
                    // list = []
                } else if ((!oldOrder.includes(9999) && newOrder.includes(9999)) || newOrder.length === 15) {
                    orderTypeIds = this.orderTypeNameListCopyId
                } else {
                    this.isCancel = true
                    orderTypeIds = newOrder
                }
                this[_M.SET_WALLET_DATA]({
                    orderTypeIds
                })
            },
            get() {
                return this.getWalletData.orderTypeIds
            }
        },
        no9999Id() {
            return this.orderTypeNameListCopyId.filter(ids => ids !== 9999).length
        },
        multiClassName() {
            return this.lang === 'cn' ? 'small long' : 'small longest'
        },
        orderTypeNameListCopy() {
            return orderTypeNameList()
        },
        orderTypeNameListCopyId() {
            return returnState(this.orderTypeNameListCopy).map(item => +item.id)
        }
    },
    methods: {
        ...mapActions([
            _M.GET_WALLET_LIST,
            _M.SET_WALLET_DATA
        ]),
        dataTurn(data) {
            return `${data.getFullYear()}-${(data.getMonth() + 1)}-${data.getDate()}`
        },
        @throttle(1000)
        search() {
            this.checkOrderTypes()
            this[_M.GET_WALLET_LIST]()
        },
        checkOrderTypes() {
            let orderTypeIds = []
            if (this.orderType.toString()) {
                orderTypeIds = this.orderType.map(itemId => +itemId)
                if (this.orderType.includes(76)) {
                    orderTypeIds.push(99)
                }
                if (this.orderType.includes(78)) {
                    orderTypeIds.push(79)
                }
            } else {
                orderTypeIds = this.orderTypeNameListCopyId
                // orderTypeIds.push(79, 99)
            }
            this[_M.SET_WALLET_DATA]({ orderTypeIds })
        }
    }
}
</script>
