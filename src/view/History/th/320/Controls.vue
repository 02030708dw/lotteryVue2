<template>
    <div class="gr_history__controls  u_clearfix">
        <el-select
            class="gr_controls__select"
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
        <el-date-picker
            v-if="+lottery !== 242"
            class="gr_controls__date-picker"
            type="date"
            format="yyyy-MM-dd"
            v-model="startDate"
            :editable="false"
            :clearable="false"
            :picker-options="pickerOptionsOpen"
        />
        <button class="gr_controls__button" @click="search">
            <svg class="gr_button__icon" viewBox="0 0 13 14">
                <ellipse transform="matrix(0.8311 -0.5561 0.5561 0.8311 -1.8221 3.9256)" class="st0" cx="5.6" cy="5" rx="3.8" ry="3.8"/>
                <rect x="7.8" y="7.4" transform="matrix(0.8311 -0.5561 0.5561 0.8311 -4.0778 6.6203)" class="st1" width="2.2" height="5.3"/>
            </svg>
        </button>
    </div>
</template>
<style lang="scss" scoped>
.gr_history__controls {
    /deep/ .el-date-editor .el-input__inner {
        border-right-width: 0px;
    }
    .gr_controls__button {
        float: right;
        position: relative;
        &.gr_controls__button::before {
            left: 0;
            content: '';
            height: 32px;
            width: 1px;
            top: 50%;
            transform: translateY(-50%);
            display: block;
            float: left;
            position: absolute;
            border-left: 1px solid #6f6f6f;
        }
    }   
}
</style>
<script>
import Controls from '../980/Controls'
export default {
    name: 'HistoryControls',
    mixins: [Controls]
}
</script>
