<template>
    <div class='gr_container bg_primary gr_page__controls u_clearfix'>
        <div v-if="!isOneLotGame">
            <!-- 中國彩、越南彩、番攤 -->
            <button
                v-for="item in lotteryCityList"
                :key="item.langKey"
                class="el-button gr-gameInfo--button"
                :class="{ 'el-button--primary': item.isActive }"
                @click="updateMode(item.value)">
                {{$t(item.langKey)}}
            </button>
        </div>
        <!-- 中國彩 -->

        <!-- 分類 -->
        <el-select :class="className" :className="className" v-model='correctFilterMode' :listObject='modeList' showLabel='titleKey' showValue='titleValue' style="width: 100px">
            <el-option v-for="item in modeList" :label='$t(item.titleKey)' :key='item.titleKey' :value='item.titleValue'></el-option>
        </el-select>
        <!-- 全部彩种 -->
        <el-select :class='className' :className='className' :placeholder="$t(games)" clearable v-model='lotteryId' :listGroup='filterLotteryList'>
            <el-option-group v-for='menu in filterLotteryList' :key='menu.lottery' :label="$t(menu.title_key)" :value='menu.lottery' >
                <el-option v-for='itemChild in menu.childs' :key='itemChild.title' :label='$t(itemChild.title_key)' :value='itemChild.lottery' v-if="!itemChild.isNotOpen"/>
            </el-option-group>
        </el-select>
        <!-- 全部玩法 -->
        <el-select :class='className' :className='className' :placeholder="$t(methods)" clearable filterable v-model='methodId' :listObject='getMethod' showLabel='showTitle' showValue='methodId'>
            <el-option v-for='itemMethod in getMethod' :key='itemMethod.methodId' :label='tans(itemMethod.showTitle)' :value='itemMethod.methodId' />
        </el-select>
        <!-- 搜尋類型 -->
        <el-select :class='className' :className='className' v-model='periodType' :listObject="orderTypeArr" showLabel='title_key' showValue='value'>
            <el-option v-for='(type, index) in orderTypeArr' :label='$t(type.title_key)' :key='type.title_key' :value='type.value' />
        </el-select>
        <!-- 投注期号 -->
        <template v-if="+periodType === 3">
            <el-input type="tel" ref='startIssueInput' :class="className" :placeholder='$t(issueName)' v-model='startIssue' :icon="showIconStartIssue" :on-icon-click="() => clearable('startIssue')" />
            <span>~</span>
            <el-input type="tel" ref='endIssueInput' :class="className" :placeholder='$t(issueName)' v-model='endIssue' :icon="showIconEndIssue" :on-icon-click="() => clearable('endIssue')" />
        </template>
        <!-- 搜尋日期 -->
        <!-- '投注时间 || 结算时间' -->
        <!-- <span>{{$t('popup_028')}}：</span> -->
        <el-date-picker
            v-else
            type="daterange"
            class="small el-select"
            popper-class="el-date-editor--calendar"
            format="yyyy-MM-dd"
            v-model="openDateArray"
            :pickerOptions="pickerOptionsOrder"
            :placeholder="$t( +periodType === 1 ? 'popup_028' : 'bettingrc_081')"
            :editable="false"
            :clearable="false"
        />
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
            <!--可筛选状态显示：预设全部,未开奖, 中奖, 未中奖-->
            <el-select
                ref="statusSel"
                multiple
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
    name: 'ControlsCN',
    extends: Controls,
    data() {
        return {
            orderTypeArr: [
                { value: 1, title: '投注时间', title_key: 'popup_028' },
                { value: 2, title: '结算时间', title_key: 'bettingrc_081' },
                { value: 3, title: '投注期号', title_key: 'bettingrc_011' }
            ]
        }
    }
}
</script>
