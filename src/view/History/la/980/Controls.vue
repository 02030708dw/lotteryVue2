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
        <!-- '开奖日期' -->
        {{$t('popup_111') + '：'}}
        <el-date-picker
            class="small long"
            type="month"
            format="yyyy-MM"
            v-model="startDate"
            :editable="false"
            :clearable="false"

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
import { warnMessageBox, today } from '@UTIL'

export default {
    name: 'HistoryControls',
    components: {
        [DatePicker.name]: DatePicker
    },
    data() {
        return {
            startDate: today(),
            lottery: +this.$route.query.menuCode
        }
    },
    computed: {
        ...mapGetters([
            'lotteryMenu'
        ]),
        // 彩種列表
        country() {
            return this.lotteryMenu[9].list['LA'].childs
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
                const startTime = moment(this.startDate).format('YYYY-MM-01 00:00:00')
                const endTime = moment(this.startDate).endOf('month').format('YYYY-MM-DD 23:59:59')
                // 打新資料前清空, 即使一日兩期,單月不超過50期
                this[_M.SET_HB_LIST]()
                this[_M.GET_HB_LIST]({
                    periodNums: 50,
                    lotteryId: this.lottery,
                    startTime,
                    endTime
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
