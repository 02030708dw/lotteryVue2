<template>
    <div class="gr_history__controls">
        <!-- '历史奖号' -->
        <span class="gr_controls__title">{{$t('common_007')}}</span>
        <!-- :placeholder="$t('popup_109')" -->
        <el-select
            class="small long u_m--r10"
            v-model="lottery"
            :listObject="country"
            showLabel="title_key"
            showValue="lottery"
        >
            <el-option
                v-for="(item, index) in country"
                :key="index"
                :label="$t(item.title_key)"
                :value="item.lottery"
            />
        </el-select>
        <template v-if="+lottery !== 242">
            <!-- '开奖日期' -->
            {{$t('popup_111') + '：'}}
            <el-date-picker
                class="small long"
                type="date"
                format="yyyy-MM-dd"
                v-model="startDate"
                :editable="false"
                :clearable="false"
                :picker-options="pickerOptionsOpen"
            />
        </template>
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
import { warnMessageBox, utc8, today } from '@UTIL'

export default {
    name: 'HistoryControls',
    components: {
        [DatePicker.name]: DatePicker
    },
    data() {
        return {
            startDate: today(),
            lottery: +this.$route.query.menuCode,
            pickerOptionsOpen: {
                disabledDate(time) {
                    return time.getTime() > Date.now() || (time && time.valueOf() < Date.now() - 86400000 * 7)
                }
            }
        }
    },
    computed: {
        ...mapGetters([
            'lotteryMenu'
        ]),
        // 彩種列表
        country() {
            let list = this.lotteryMenu[6].list
            let arr = []
            Object.keys(list).forEach(e => {
                list[e].childs.map((e) => {
                    arr.push(e)
                })
            })
            return arr
        }
    },
    methods: {
        ...mapActions([
            _M.GET_HB_LIST,
            _M.SET_HB_LIST
        ]),
        @throttle(1000)
        search() {
            if (this.startDate) {
                this.$router.push({query: {menuCode: this.lottery}})
                const dataFormat = 'YYYY-MM-DD'
                if (+this.lottery === 242) {
                    // 泰國彩-1年
                    this.$parent.$parent.startTime = moment().add(-1, 'year').format(`${dataFormat} 00:00:00`)
                    this.$parent.$parent.endTime = moment().format(`${dataFormat} 23:59:59`)
                } else {
                    // 5分彩-當日 (最後一期開獎時間: 隔日00:00:55)
                    this.$parent.$parent.startTime = moment(this.startDate).format(`${dataFormat} 00:00:56`)
                    this.$parent.$parent.endTime = moment(this.startDate).add(1, 'day').format(`${dataFormat} 00:00:55`)
                }
                // 打新資料前清空, 20期
                this[_M.SET_HB_LIST]()
                this[_M.GET_HB_LIST]({
                    periodNums: 20,
                    lotteryId: this.lottery,
                    next: null,
                    startTime: this.$parent.$parent.startTime,
                    endTime: this.$parent.$parent.endTime
                })
            } else {
                this.$msg(warnMessageBox({
                    // 日期不符合格式
                    message: 'trend_055'
                }))
            }
        }
    }
}
</script>
