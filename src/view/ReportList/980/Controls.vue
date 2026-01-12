<template>
    <div class="gr_container bg_primary gr_page__controls">
        <div
            class="bg_secondary"
            style="padding: 7px; 10px;"
            v-if="RWDMode === 3"
        >
            <!-- '单日计算区间：北京时间00:00:00~23:59:59' -->
            <span>{{ $t("bettingrc_045") }}</span>
        </div>
        <!--// FIXME: GameClientKM : 20170609 Fri 17:09:03 RWD 問題, 會被 user_area 推下來...-->
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
        <template v-if="!isRich">
            <div class="el-input small auto" @click="filterToday">
                <div class="el-input__inner">
                    <!-- {{$t("今日")}} -->
                    {{ $t("bettingrc_005") }}
                </div>
            </div>
            <div class="el-input small auto" @click="filterSevenDay">
                <div class="el-input__inner">
                    <!-- {{$t("近七日")}} -->
                    {{ $t("bettingrc_007") }}
                </div>
            </div>
            <div class="el-input small auto" @click="filterTirthDay">
                <div class="el-input__inner">
                    <!-- {{$t("近30日")}} -->
                    {{ $t("bettingrc_079") }}
                </div>
            </div>
        </template>
        <button class="c_button--secondary c_button--small" @click="search">
            <svg class="c_button__icon" viewBox="0 0 13 14">
                <ellipse
                    transform="matrix(0.8311 -0.5561 0.5561 0.8311 -1.8221 3.9256)"
                    class="st0"
                    cx="5.6"
                    cy="5"
                    rx="3.8"
                    ry="3.8"
                />
                <rect
                    x="7.8"
                    y="7.4"
                    transform="matrix(0.8311 -0.5561 0.5561 0.8311 -4.0778 6.6203)"
                    class="st1"
                    width="2.2"
                    height="5.3"
                />
            </svg>
            <span class="c_button__text">
                <!-- {{ $t("查询") }} -->
                {{ $t("bettingrc_012") }}
            </span>
        </button>

        <div style="margin-top: 10px;padding-left: 5px;" v-if="RWDMode !== 3">
            <!-- '单日计算区间：北京时间00:00:00~23:59:59' -->
            <span>{{ $t("bettingrc_045") }}</span>
        </div>
    </div>
</template>

<script>
import { formatDateToString } from '@UTIL'
import { mapGetters, mapActions } from 'vuex'
import DatePicker from '@E/packages/date-picker/index.js'
export default {
    name: 'Controls',
    data() {
        return {
            className: 'small long',
            pickerOptionsOpen: {
                disabledDate(time) {
                    return (
                        time.getTime() > Date.now() ||
                        (time && time.valueOf() < Date.now() - 86400000 * 365)
                    )
                }
            }
        }
    },
    beforeMount() {
        // 财富宫只能查两天 今日+昨日
        if (this.isRich) {
            this.pickerOptionsOpen.disabledDate = time =>
                time.getTime() > Date.now() ||
                (time && time.valueOf() < Date.now() - 86400000 * 2)
        }
    },
    components: {
        [DatePicker.name]: DatePicker
    },
    methods: {
        ...mapActions([_M.GET_REPORT_LIST, _M.SET_REPORT_DATA]),
        change(params) {
            this[_M.SET_REPORT_DATA](params)
        },
        filterToday() {
            this.change({ startDate: this.today, endDate: this.today })
        },
        filterSevenDay() {
            this.change({
                startDate: this.getDataArray(7),
                endDate: this.today
            })
        },
        filterTirthDay() {
            this.change({
                startDate: this.getDataArray(30),
                endDate: this.today
            })
        },
        dataTurn(data) {
            // 平板需補0
            const M =
                data.getMonth() + 1 > 9
                    ? data.getMonth() + 1
                    : `0${data.getMonth() + 1}`
            const D =
                data.getDate() > 9 ? data.getDate() : `0${data.getDate()}`
            return `${data.getFullYear()}-${M}-${D}`
        },
        getDataArray(data) {
            return this.dataTurn(
                new Date(
                    new Date() - (data - 1) - 3600 * 1000 * 24 * (data - 1)
                )
            )
        }
    },
    subscriptions() {
        return {
            search$: this.$createObservableMethod('search')
                .throttleTime(1000)
                .do(this[_M.GET_REPORT_LIST])
        }
    },
    computed: {
        ...mapGetters(['reportData', 'serverTime', 'RWDMode', 'isRich']),
        isData: {
            set(isData) {
                if (!isData || (!isData[0] && !isData[1])) {
                    this.change({ startDate: '', endDate: '' })
                } else {
                    this.change({
                        startDate: isData[0] && formatDateToString(isData[0]),
                        endDate: isData[1] && formatDateToString(isData[1])
                    })
                }
            },
            get() {
                return [this.reportData.startDate, this.reportData.endDate]
            }
        },
        now() {
            return () => moment(this.serverTime)
        },
        today() {
            return moment(this.serverTime).format('YYYY-MM-DD')
        }
    }
}
</script>
