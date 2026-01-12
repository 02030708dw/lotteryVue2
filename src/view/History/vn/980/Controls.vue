<template>
    <div class="gr_history__controls">
        <!-- '历史奖号' -->
        <span class="gr_controls__title">{{$t('common_007')}}</span>
        <!-- :placeholder="$t('popup_109')" -->
        <el-select
            class="small  long  u_m--r10"
            v-model="menuCode"
            v-if="!isW88"
            :listObject="country"
            showLabel="title_key"
            showValue="menuCode"
        >
            <el-option
                v-for="(item, index) in country"
                v-if="isShow(item.menuCode)"
                :key="index"
                :label="item.title_key"
                :value="item.menuCode"
            />
        </el-select>
        <!-- '开奖日期' -->
        {{$t('popup_111') + '：'}}
        <el-date-picker
            class="small  long"
            type="date"
            format="yyyy-MM-dd"
            v-model="startDate"
            :editable="false"
            :clearable="false"
            :picker-options="pickerOptionsOpen"
        />
        <button class="el-button  el-button--primary  u_m--l5" @click="search">
            <!-- '查询' -->
            {{$t('bettingrc_012')}}
        </button>
    </div>
</template>
<script>
import DatePicker from '@E/packages/date-picker/index.js'
import throttle from '@UTIL/decorator/throttle'
import { mapGetters, mapActions } from 'vuex'
import { warnMessageBox } from '@UTIL'

export default {
    name: 'HistoryControls',
    components: {
        [DatePicker.name]: DatePicker
    },
    data() {
        return {
            pickerOptionsOpen: {
                disabledDate(time) {
                    return time.getTime() > Date.now() || (time && time.valueOf() < Date.now() - 86400000 * 7)
                }
            }
        }
    },
    methods: {
        ...mapActions([
            _M.GET_HISTORYBALLVN_LIST,
            _M.SET_HISTORYBALLVN_DATA,
            _M.CLEAR_HISTORYBALLVN_LIST
        ]),
        @throttle(1000)
        search() {
            if (this.startDate) {
                const stime = moment(this.startDate).format('YYYY-MM-DD')
                this.$router.replace({ name: 'History', query: { menuCode: this.menuCode } })

                // 清空資料前先回頂,避免觸發卷軸多打一次API
                // document.body : 320
                // document.documentElement : 980, mobile
                if (document.body) document.body.scrollTop = 0
                if (document.documentElement) document.documentElement.scrollTop = 0
                this[_M.CLEAR_HISTORYBALLVN_LIST]()
                this[_M.GET_HISTORYBALLVN_LIST]({
                    cancelDeadline: stime,
                    menuCode: this.menuCode,
                    next: null
                })
            } else {
                this.$msg(warnMessageBox({
                    // 日期不符合格式
                    message: 'trend_055'
                }))
            }
        },
        isShow(menuCode) {
            const [key] = menuCode.split('-')
            return this.lotteryMenu[3].list[key]
        }
    },
    computed: {
        ...mapGetters([
            'getHistoryBallVNData',
            'lotteryListLocalVN',
            'lotteryOfficialVN',
            'getMenuId',
            'lotteryMenu',
            'isW88'
        ]),
        startDate: {
            set(cancelDeadline) {
                this[_M.SET_HISTORYBALLVN_DATA]({cancelDeadline})
            },
            get() {
                return this.getHistoryBallVNData.cancelDeadline
            }
        },
        menuCode: {
            set(menuCode) {
                this[_M.SET_HISTORYBALLVN_DATA]({menuCode})
            },
            get() {
                return this.getHistoryBallVNData.menuCode
            }
        },
        // 越南彩
        country() {
            let arr = []
            Object
                .values(this.lotteryListLocalVN)
                .forEach(({name, lottery, title_key}) => arr.push({ menuCode: `${name}-${lottery}`, title_key: this.$t(title_key) }))
            Object
                .entries(this.lotteryOfficialVN)
                .forEach(([name, obj]) => arr.push({ menuCode: `${name}-`, title_key: `${this.$t('home_016')} - ${this.$t(obj.title_key)}` }))
            return arr
        }
    }
}
</script>
