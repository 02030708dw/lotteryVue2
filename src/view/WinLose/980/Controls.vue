<template>
    <div class="gr_container bg_primary gr_page__controls">
        <div class="bg_secondary" style="padding: 7px; 10px;" v-if="RWDMode === 3">
            <!-- '单日计算区间：北京时间00:00:00~23:59:59' -->
            <span>{{$t('bettingrc_045')}}</span>
        </div>
        <el-select :class='className' :className='className' v-model='periodType' :listObject="periodTypeArr" showLabel='title_key' showValue='value'>
            <el-option v-for='(type, index) in periodTypeArr' :label='$t(type.title_key)' :key='type.title_key' :value='type.value' />
        </el-select>
        <!-- 选择日期范围 -->
        <el-date-picker
            type="daterange"
            class="small el-select"
            popper-class="el-date-editor--calendar"
            format="yyyy-MM-dd"
            v-model="isData"
            :pickerOptions="pickerOptionsOpen"
            :placeholder="$t( periodType === 'created_at' ? 'bettingrc_037' : 'bettingrc_082')"
            :editable="false"
            :clearable="false"
        />
        <template v-if="!isRich">
            <div class="el-input small auto" @click="filterToday" >
                <div class="el-input__inner">
                    <!-- {{$t("今日")}} -->
                    {{$t('bettingrc_005')}}
                </div>
            </div>
            <div class="el-input small auto" @click="filterSevenDay">
                <div class="el-input__inner">
                    <!-- {{$t("近七日")}} -->
                    {{$t('bettingrc_007')}}
                </div>
            </div>
            <div class="el-input small auto" @click="filterTirthDay">
                <div class="el-input__inner">
                    <!-- {{$t("近30日")}} -->
                    {{$t('bettingrc_079')}}
                </div>
            </div>
        </template>
        <button class="c_button--secondary c_button--small" @click='search'>
            <svg class="c_button__icon" viewBox="0 0 13 14">
                <ellipse transform="matrix(0.8311 -0.5561 0.5561 0.8311 -1.8221 3.9256)" class="st0" cx="5.6" cy="5" rx="3.8" ry="3.8"/>
                <rect x="7.8" y="7.4" transform="matrix(0.8311 -0.5561 0.5561 0.8311 -4.0778 6.6203)" class="st1" width="2.2" height="5.3"/>
            </svg>
            <span class="c_button__text">
                <!-- {{ $t("查询") }} -->
                {{$t('bettingrc_012')}}
            </span>
        </button>

        <div style="margin-top: 10px;padding-left: 5px;" v-if="RWDMode !== 3">
            <!-- '单日计算区间：北京时间00:00:00~23:59:59' -->
            <span>{{$t('bettingrc_045')}}</span>
        </div>
    </div>
</template>

<script>

import { mapGetters, mapActions } from 'vuex'
import DatePicker from '@E/packages/date-picker/index.js'
import { today } from '@UTIL'
export default {
    name: 'Controls',
    data() {
        return {
            className: 'small long',
            isData: [null, null],
            startDate: '',
            endDate: '',
            statusToday: [],
            periodType: 'created_at',
            periodTypeArr: [
                {title_key: 'bettingrc_037', value: 'created_at'},
                {title_key: 'bettingrc_082', value: 'deduct_time'}
            ],
            pickerOptionsOpen: {
                disabledDate(time) {
                    return time.getTime() > Date.now() || (time && time.valueOf() < Date.now() - 86400000 * 365)
                }
            }
        }
    },
    subscriptions() {
        return {
            search$: this.$createObservableMethod('search')
                .throttleTime(1000)
                .do(() => {
                    this.userProfitList()
                    // 日曆欄位若被清空
                    this.$root.$emit('dateSearch', this.startDate)
                })
        }
    },
    watch: {
        isData(v) {
            // 日曆欄位若被清空處理
            if (v && (v[0] !== null && v[0] !== today())) {
                this.startDate = this.dataTurn(this.isData[0])
                this.endDate = this.dataTurn(this.isData[1])
            } else if (v && v[0] === today()) {
                this.startDate = today()
                this.endDate = today()
            } else {
                this.startDate = ''
                this.endDate = ''
            }
        },
        periodType(v) {
            this.$root.$emit('periodType', v)
        }
    },
    beforeMount() {
        this.isData = [today(), today()]
        this.startDate = today()
        this.endDate = today()
        // 财富宫只能查两天 今日+昨日
        if (this.isRich) {
            this.pickerOptionsOpen.disabledDate = (time) => time.getTime() > Date.now() || (time && time.valueOf() < Date.now() - 86400000 * 2)
        }
    },
    methods: {
        ...mapActions([
            _M.USERPROFIT_LIST
        ]),
        userProfitList() {
            this[_M.USERPROFIT_LIST]({
                startDate: this.startDate,
                endDate: this.endDate,
                periodType: this.periodType
            }).then(() => {
                // console.log(this.winLoseData)
            })
        },
        dataTurn(data) {
            return `${data.getFullYear()}-${(data.getMonth() + 1)}-${data.getDate()}`
        },
        filterToday() {
            this.isData = [new Date(), new Date()]
        },
        filterSevenDay() {
            this.isData = [this.getDataArray(7), new Date()]
        },
        filterTirthDay() {
            this.isData = [this.getDataArray(30), new Date()]
        },
        getDataArray(data) {
            return new Date((new Date() - (data - 1)) - 3600 * 1000 * 24 * (data - 1))
        }
    },
    computed: {
        ...mapGetters([
            'isRich',
            'RWDMode',
            'winLoseList',
            'winLoseData'
        ])
    },
    components: {
        [DatePicker.name]: DatePicker
    }
}
</script>
