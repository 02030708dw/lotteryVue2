<template>
    <div class='gr_container bg_primary gr_page__controls u_clearfix'>
        <div v-if="!isOneLotGame">
            <!-- 國家彩分類 -->
            <button
                v-for="item in lotteryCityList"
                :key="item.langKey"
                class="el-button gr-gameInfo--button"
                :class="{ 'el-button--primary': item.isActive }"
                @click="updateMode(item.value)">
                {{$t(item.langKey)}}
            </button>
        </div>
        <!-- 馬來西亞彩 -->
        <div class="u_d--inline-block">
            <!-- '所有彩种' -->
            <el-select :class='className' :className='className' :placeholder="$t(games)" clearable v-model='lotteryId' :listGroup='lotlistMY'>
                <el-option-group v-for='menu in lotlistMY' :key='menu.lottery' :label="$t(menu.title_key)" :value='menu.lottery' >
                    <el-option v-for='itemChild in menu.childs' :key='itemChild.title' :label='$t(itemChild.title_key)' :value='itemChild.lottery' v-if="!itemChild.isNotOpen"/>
                </el-option-group>
            </el-select>
            <!-- 全部玩法 -->
            <el-select :class='className' :className='className' :placeholder="$t(methods)" clearable filterable v-model='methodId' :listObject='getMethod' showLabel='showTitle' showValue='methodId'>
                <el-option v-for='itemMethod in getMethod' :key='itemMethod.methodId' :label='tansMetod(itemMethod)' :value='itemMethod.methodId' />
            </el-select>
            <!-- 搜尋類型 -->
            <el-select :class='className' :className='className' v-model='periodType' :listObject="orderTypeArr" showLabel='title_key' showValue='value'>
                <el-option v-for='(type, index) in orderTypeArr' :label='$t(type.title_key)' :key='type.title_key' :value='type.value' />
            </el-select>
            <!-- '开奖日期' -->
            <el-date-picker v-if="+periodType === 4" type="daterange" class="small el-select" popper-class="el-date-editor--calendar" format="yyyy-MM-dd" v-model="saleDateArray" :pickerOptions="pickerOptionsOpen2" :placeholder="$t('popup_111')" :editable="false" :clearable="false" />
            <!-- '投注时间 || 结算时间' -->
            <el-date-picker v-else type="daterange" class="small el-select" popper-class="el-date-editor--calendar" format="yyyy-MM-dd" v-model="openDateArray" :pickerOptions="pickerOptionsOrder2" :placeholder="$t( +periodType === 1 ? 'popup_028' : 'bettingrc_081')" :editable="false" :clearable="false" />
        </div>
        <button class='c_button--secondary  c_button--small' @click='search' ref='searchBtn'>
            <svg class="c_button__icon" viewBox="0 0 13 14">
                <ellipse transform="matrix(0.8311 -0.5561 0.5561 0.8311 -1.8221 3.9256)" class="st0" cx="5.6" cy="5" rx="3.8" ry="3.8"/>
                <rect x="7.8" y="7.4" transform="matrix(0.8311 -0.5561 0.5561 0.8311 -4.0778 6.6203)" class="st1" width="2.2" height="5.3"/>
            </svg>
            <span class="c_button__text">
                <!-- {{$t("查询")}} -->
                {{$t('bettingrc_012')}}
            </span>
        </button>
        <div class="u_f--right">
            <el-select
                multiple
                ref="statusSel"
                :class='classNameStatus'
                :className='classNameStatus'
                v-model='statusArr'
                :listObject="statusArray"
                showLabel='titleKey'
                showValue='stateValue'>
                <el-option
                    @click.native="selOne(itemStatus.stateValue)"
                    v-for='itemStatus in statusArray'
                    :label='$t(itemStatus.titleKey)'
                    :key='itemStatus.title'
                    :value='itemStatus.stateValue' />
            </el-select>
        </div>
        <div v-if="false" class="text_color_accent u_p--t10">
            <!-- 返点金额将于开奖后派发。 -->
          {{$t('bettingrc_042')}}
        </div>
        <div style="margin-top: 10px;padding-left: 5px;">
            <!-- '单日计算区间：北京时间00:00:00~23:59:59' -->
            <span>{{$t('bettingrc_045')}}</span>
        </div>
    </div>
</template>
<script>
import Controls from './Controls'

export default {
    name: 'ControlsMY',
    extends: Controls,
    data() {
        return {
            orderTypeArr: [
                { value: 1, title: '投注时间', title_key: 'popup_028' },
                { value: 2, title: '结算时间', title_key: 'bettingrc_081' },
                { value: 4, title: '开奖日期', title_key: 'popup_111' }
            ],
            keyObj: {
                '1D': 'thai_011',
                '2D': 'thai_010',
                '3D': 'thai_009'
            }
        }
    },
    methods: {
        tansMetod({parent, method_key}) {
            // 信用玩法用的
            return `${this.$t(this.keyObj[parent])} - ${this.$t(method_key)}`
        }
    }
}
</script>