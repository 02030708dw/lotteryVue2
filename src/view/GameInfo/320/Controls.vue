<template>
    <div>
        <div class='gr_container bg_primary gr_page__controls u_clearfix' :class="{ 'is_active': controllerToggle }">
            <div class="bg_secondary" style="padding: 7px; 10px;">
                <!-- '单日计算区间：北京时间00:00:00~23:59:59' -->
                <span>{{$t('bettingrc_045')}}</span>
            </div>
            <div class="gr_game-info__menu" v-if="!isW88">
                <ul>
                    <!-- 中国彩、越南彩、番攤 -->
                    <li
                        v-for="item in lotteryCityList"
                        :key="item.langKey"
                        v-if="item.isEnable"
                        class="gr_menu__item"
                        :class="{ 'is_active': item.isActive }"
                        @click="updateMode(item.value)"
                    >
                        {{$t(item.langKey)}}
                    </li>
                </ul>
            </div>
            <div class="gr_page__controls__toggle">
                <!--全部/官方/信用-->
                <ul class="gr_page_links u_clearfix" v-show="isCN">
                    <li
                        class="gr_page_links--item"
                        :class="{ 'is_active': item.titleValue === correctFilterMode }"
                        v-for="item in modeList"
                        :key="item.titleKey"
                        @click="correctFilterMode = item.titleValue">{{$t(item.titleKey)}}</li>
                </ul>
                <!--可筛选状态显示：预设全部,未开奖, 中奖, 未中奖-->
                <!--
                <el-select :class='className' v-model='status' :listObject='statusArray' showLabel='titleKey' showValue='stateValue'>
                    <el-option v-for='itemStatus in statusArray' :label='$t(itemStatus.titleKey)' :key='itemStatus.title' :value='itemStatus.stateValue' />
                </el-select>
                -->
                <el-select
                    multiple
                    ref="statusSel"
                    :class='className'
                    v-model='statusArr'
                    :listObject="statusArray"
                    showLabel='titleKey'
                    showValue='stateValue'>
                    <el-option @click.native="selOne(itemStatus.stateValue)" v-for='itemStatus in statusArray' :label='$t(itemStatus.titleKey)' :key='itemStatus.title' :value='itemStatus.stateValue' />
                </el-select>

                <!-- 中國彩 -->
                <template v-if="isCN">
                    <!-- 分類 -->
                    <!-- <el-select v-show="isCN" :class="className" :className="className" v-model='correctFilterMode' showLabel='label' showValue='value'>
                        <el-option v-for="item in modeList" :label='$t(item.titleKey)' :key='item.titleKey' :value='item.titleValue'></el-option>
                    </el-select> -->
                    <!-- 所有彩种 -->
                    <el-select :class='className' :className='className' :placeholder="$t(games)" clearable v-model='lotteryId' :listGroup='filterLotteryList'>
                        <el-option-group v-for='menu in filterLotteryList' :key='menu.lottery' :label="$t(menu.title_key)" :value='menu.lottery' >
                            <el-option v-for='itemChild in menu.childs' :key='itemChild.title' :label='$t(itemChild.title_key)' :value='itemChild.lottery' v-if="!itemChild.isNotOpen"/>
                        </el-option-group>
                    </el-select>
                    <!-- 所有玩法 -->
                    <el-select :class='className' :className='className' :placeholder="$t(methods)" clearable filterable v-model='methodId' :listObject='getMethod' showLabel='showTitle' showValue='methodId'>
                        <el-option v-for='itemMethod in getMethod' :key='itemMethod.methodId' :label='tans(itemMethod.showTitle)' :value='itemMethod.methodId' />
                    </el-select>
                    <!-- 搜尋類型 -->
                    <el-select :class='className' :className='className' v-model='periodType' :listObject="orderTypeArr" showLabel='title_key' showValue='value'>
                        <el-option v-for='(type, index) in orderTypeArr' :label='$t(type.title_key)' :key='type.title_key' :value='type.value' />
                    </el-select>
                    <!-- 投注期号 -->
                    <template v-if="+periodType === 3">
                        <div class="gr_page__draw">
                            <el-input type="tel" ref='startIssueInput' :class="className" :placeholder='$t(issueName)' v-model='startIssue' :icon="showIconStartIssue" :on-icon-click="() => clearable('startIssue')" />
                            <span>~</span>
                            <el-input type="tel" ref='endIssueInput' :class="className" :placeholder='$t(issueName)' v-model='endIssue' :icon="showIconEndIssue" :on-icon-click="() => clearable('endIssue')" />
                        </div>
                    </template>
                    <!-- 搜尋日期 -->
                    <el-date-picker v-else class="small el-select" popper-class="el-date-editor--calendar" type="daterange" format="yyyy-MM-dd" v-model="openDateArray" :pickerOptions="pickerOptionsOrder" :placeholder="$t( +periodType === 1 ? 'popup_028' : 'bettingrc_081')" :editable="false" :clearable="false" />
                </template>

                <!-- 番攤 -->
                <template v-else-if="isFT">
                    <!-- 所有彩种 -->
                    <el-select :class='className' :className='className' :placeholder="$t(games)" clearable v-model='lotteryId' :listGroup='FTlotList'>
                        <el-option-group v-for='menu in FTlotList' :key='menu.lottery' :label="$t(menu.title_key)" :value='menu.lottery' >
                            <el-option v-for='itemChild in menu.childs' :key='itemChild.title' :label='$t(itemChild.title_key)' :value='itemChild.lottery' v-if="!itemChild.isNotOpen"/>
                        </el-option-group>
                    </el-select>
                    <!-- 所有玩法 -->
                    <el-select :class='className' :className='className' :placeholder="$t(methods)" clearable filterable v-model='methodId' :listObject='getMethod' showLabel='showTitle' showValue='methodId'>
                        <el-option v-for='itemMethod in getMethod' :key='itemMethod.methodId' :label='tans(itemMethod.showTitle)' :value='itemMethod.methodId' />
                    </el-select>
                    <!-- 搜尋類型 -->
                    <el-select :class='className' :className='className' v-model='periodType' :listObject="orderTypeArr" showLabel='title_key' showValue='value'>
                        <el-option v-for='(type, index) in orderTypeArr' :label='$t(type.title_key)' :key='type.title_key' :value='type.value' />
                    </el-select>
                    <!-- 投注期号 -->
                    <template v-if="+periodType === 3">
                        <div class="gr_page__draw">
                            <el-input type="tel" ref='startIssueInput' :class="className" :placeholder='$t(issueName)' v-model='startIssue' :icon="showIconStartIssue" :on-icon-click="() => clearable('startIssue')" />
                            <span>~</span>
                            <el-input type="tel" ref='endIssueInput' :class="className" :placeholder='$t(issueName)' v-model='endIssue' :icon="showIconEndIssue" :on-icon-click="() => clearable('endIssue')" />
                        </div>
                    </template>
                    <!-- 搜尋日期 -->
                    <el-date-picker v-else class="small el-select" popper-class="el-date-editor--calendar" type="daterange" format="yyyy-MM-dd" v-model="openDateArray" :pickerOptions="pickerOptionsOrder" :placeholder="$t( +periodType === 1 ? 'popup_028' : 'bettingrc_081')" :editable="false" :clearable="false" />
                </template>

                <!-- 越南彩 -->
                <div class="gr_page__vn__toggle" v-else-if="isVN">
                    <!-- '所有彩种' -->
                    <el-select v-if="!isW88" :class='className' :className='className' v-model="lotteryId" clearable :placeholder="$t(games)" :listGroup="areaList">
                        <el-option-group v-for="child in areaList" :key="child.title_key" :label="$t(child.title_key)">
                            <el-option v-for="item in child.childs" :key="item.title_key" :label="$t(item.title_key)" :value="item.lottery"></el-option>
                        </el-option-group>
                    </el-select>
                    <!-- 全部玩法 -->
                    <el-select :class='className' :className='className' :placeholder="$t(methods)" clearable v-model='methodId' :listObject='getMethod' showLabel='showTitle' showValue='methodId'>
                        <el-option v-for='itemMethod in getMethod' :key='itemMethod.methodId' :label='tans(itemMethod.showTitle)' :value='itemMethod.methodId' />
                    </el-select>
                    <!-- '投注号码' -->
                    <!-- <el-input type="tel" :class="className" v-model="code" :icon="showIconCode" :on-icon-click="clearableCode"  :placeholder="$t('popup_109')" /> -->
                    <!-- 搜尋類型 -->
                    <el-select :class='className' :className='className' v-model='periodType' :listObject="orderTypeVNArr" showLabel='title_key' showValue='value'>
                        <el-option v-for='(type, index) in orderTypeVNArr' :label='$t(type.title_key)' :key='type.title_key' :value='type.value' />
                    </el-select>
                    <!-- 搜尋日期 -->
                    <el-date-picker v-if="+periodType === 4" type="daterange" class="small el-select" popper-class="el-date-editor--calendar" format="yyyy-MM-dd" v-model="saleDateArray" :pickerOptions="pickerOptionsOpen" :placeholder="$t('popup_111')" :editable="false" :clearable="false" />
                    <el-date-picker v-else type="daterange" class="small el-select" popper-class="el-date-editor--calendar" format="yyyy-MM-dd" v-model="openDateArray" :pickerOptions="pickerOptionsOrder" :placeholder="$t( +periodType === 1 ? 'popup_028' : 'bettingrc_081')" :editable="false" :clearable="false" />
                </div>

                <!-- 泰國彩 -->
                <div class="gr_page__vn__toggle" v-else-if="isTH">
                    <!-- '所有彩种' -->
                    <el-select v-if="!isW88" :class='className' :className='className' v-model="lotteryId" clearable :placeholder="$t(games)"  :listGroup='lotlistTH'>
                        <el-option-group v-for="item in lotlistTH" :key="item.title_key" :label="$t(item.title_key)">
                            <el-option v-for="itemChild in item.childs" :key="itemChild.title_key" :value="itemChild.lottery" :label="$t(itemChild.title_key)"/>
                        </el-option-group>
                    </el-select>
                    <!-- 全部玩法 -->
                    <el-select :class='className' :className='className' :placeholder="$t(methods)" clearable v-model='methodId' :listObject='getMethod' showLabel='showTitle' showValue='methodId'>
                        <el-option v-for='itemMethod in getMethod' :key='itemMethod.methodId' :label='tansMetod(itemMethod)' :value='itemMethod.methodId' />
                    </el-select>
                    <!-- 搜尋類型 -->
                    <el-select :class='className' :className='className' v-model='periodType' :listObject="orderTypeVNArr" showLabel='title_key' showValue='value'>
                        <el-option v-for='(type, index) in orderTypeVNArr' :label='$t(type.title_key)' :key='type.title_key' :value='type.value' />
                    </el-select>
                    <!-- 搜尋日期 -->
                    <el-date-picker v-if="+periodType === 4" type="daterange" class="small el-select" popper-class="el-date-editor--calendar" format="yyyy-MM-dd" v-model="saleDateArray" :pickerOptions="pickerOptionsOpen2" :placeholder="$t('popup_111')" :editable="false" :clearable="false" />
                    <el-date-picker v-else type="daterange" class="small el-select" popper-class="el-date-editor--calendar" format="yyyy-MM-dd" v-model="openDateArray" :pickerOptions="pickerOptionsOrder2" :placeholder="$t( +periodType === 1 ? 'popup_028' : 'bettingrc_081')" :editable="false" :clearable="false" />
                </div>

                <!-- 股票彩 -->
                <div class="gr_page__vn__toggle" v-else-if="isStock">
                    <!-- '所有彩种' -->
                    <el-select :class='className' :className='className' :placeholder="$t(games)" clearable v-model='lotteryId' :listGroup='lotlistStock'>
                        <el-option-group v-for='menu in lotlistStock' :key='menu.lottery' :label="$t(menu.title_key)" :value='menu.lottery' >
                            <el-option v-for='itemChild in menu.childs' :key='itemChild.title' :label='$t(itemChild.title_key)' :value='itemChild.lottery' v-if="!itemChild.isNotOpen"/>
                        </el-option-group>
                    </el-select>
                    <!-- 全部玩法 -->
                    <el-select :class='className' :className='className' :placeholder="$t(methods)" clearable filterable v-model='methodId' :listObject='getMethod' showLabel='showTitle' showValue='methodId'>
                        <el-option v-for='itemMethod in getMethod' :key='itemMethod.methodId' :label='tansMetod(itemMethod)' :value='itemMethod.methodId' />
                    </el-select>
                    <!-- 搜尋類型 -->
                    <el-select :class='className' :className='className' v-model='periodType' :listObject="orderTypeVNArr" showLabel='title_key' showValue='value'>
                        <el-option v-for='(type, index) in orderTypeVNArr' :label='$t(type.title_key)' :key='type.title_key' :value='type.value' />
                    </el-select>
                    <!-- 搜尋日期 -->
                    <el-date-picker v-if="+periodType === 4" type="daterange" class="small el-select" popper-class="el-date-editor--calendar" format="yyyy-MM-dd" v-model="saleDateArray" :pickerOptions="pickerOptionsOrder" :placeholder="$t('popup_111')" :editable="false" :clearable="false" />
                    <el-date-picker v-else type="daterange" class="small el-select" popper-class="el-date-editor--calendar" format="yyyy-MM-dd" v-model="openDateArray" :pickerOptions="pickerOptionsOrder" :placeholder="$t( +periodType === 1 ? 'popup_028' : 'bettingrc_081')" :editable="false" :clearable="false" />
                </div>
                <!-- 老挝彩  -->
                <div class="gr_page__vn__toggle" v-else-if="isLA">
                    <!-- '所有彩种' -->
                    <el-select :class='className' :className='className' :placeholder="$t(games)" clearable v-model='lotteryId' :listGroup='lotlistLA'>
                        <el-option-group v-for='menu in lotlistLA' :key='menu.lottery' :label="$t(menu.title_key)" :value='menu.lottery' >
                            <el-option v-for='itemChild in menu.childs' :key='itemChild.title' :label='$t(itemChild.title_key)' :value='itemChild.lottery' v-if="!itemChild.isNotOpen"/>
                        </el-option-group>
                    </el-select>
                    <!-- 全部玩法 -->
                    <el-select :class='className' :className='className' :placeholder="$t(methods)" clearable filterable v-model='methodId' :listObject='getMethod' showLabel='showTitle' showValue='methodId'>
                        <el-option v-for='itemMethod in getMethod' :key='itemMethod.methodId' :label='tansMetod(itemMethod)' :value='itemMethod.methodId' />
                    </el-select>
                    <!-- 搜尋類型 -->
                    <el-select :class='className' :className='className' v-model='periodType' :listObject="orderTypeVNArr" showLabel='title_key' showValue='value'>
                        <el-option v-for='(type, index) in orderTypeVNArr' :label='$t(type.title_key)' :key='type.title_key' :value='type.value' />
                    </el-select>
                    <!-- 搜尋日期 -->
                    <el-date-picker v-if="+periodType === 4" type="daterange" class="small el-select" popper-class="el-date-editor--calendar" format="yyyy-MM-dd" v-model="saleDateArray" :pickerOptions="pickerOptionsOpen2" :placeholder="$t('popup_111')" :editable="false" :clearable="false" />
                    <el-date-picker v-else type="daterange" class="small el-select" popper-class="el-date-editor--calendar" format="yyyy-MM-dd" v-model="openDateArray" :pickerOptions="pickerOptionsOrder2" :placeholder="$t( +periodType === 1 ? 'popup_028' : 'bettingrc_081')" :editable="false" :clearable="false" />
                </div>
                <!-- 馬來彩  -->
                <div class="gr_page__vn__toggle" v-else-if="isMY">
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
                    <el-select :class='className' :className='className' v-model='periodType' :listObject="orderTypeVNArr" showLabel='title_key' showValue='value'>
                        <el-option v-for='(type, index) in orderTypeVNArr' :label='$t(type.title_key)' :key='type.title_key' :value='type.value' />
                    </el-select>
                    <!-- 搜尋日期 -->
                    <el-date-picker v-if="+periodType === 4" type="daterange" class="small el-select" popper-class="el-date-editor--calendar" format="yyyy-MM-dd" v-model="saleDateArray" :pickerOptions="pickerOptionsOpen2" :placeholder="$t('popup_111')" :editable="false" :clearable="false" />
                    <el-date-picker v-else type="daterange" class="small el-select" popper-class="el-date-editor--calendar" format="yyyy-MM-dd" v-model="openDateArray" :pickerOptions="pickerOptionsOrder2" :placeholder="$t( +periodType === 1 ? 'popup_028' : 'bettingrc_081')" :editable="false" :clearable="false" />
                </div>

                <!-- 百家樂 -->
                <div class="gr_page__vn__toggle" v-else-if="isBJL">
                    <!-- '所有彩种' -->
                    <el-select :class='className' :className='className' :placeholder="$t(games)" clearable v-model='lotteryId' :listGroup='lotlist'>
                        <el-option-group v-for='menu in lotlist' :key='menu.lottery' :label="$t(menu.title_key)" :value='menu.lottery' >
                            <el-option v-for='itemChild in menu.childs' :key='itemChild.title' :label='$t(itemChild.title_key)' :value='itemChild.lottery' v-if="!itemChild.isNotOpen"/>
                        </el-option-group>
                    </el-select>
                    <!-- 全部玩法 -->
                    <el-select :class='className' :className='className' :placeholder="$t(methods)" clearable filterable v-model='methodId' :listObject='getMethod' showLabel='showTitle' showValue='methodId'>
                        <el-option v-for='itemMethod in getMethod' :key='itemMethod.methodId' :label='tans(itemMethod.showTitle)' :value='itemMethod.methodId' />
                    </el-select>
                    <!-- 搜尋類型 -->
                    <el-select :class='className' :className='className' v-model='periodType' :listObject="orderTypeVNArr" showLabel='title_key' showValue='value'>
                        <el-option v-for='(type, index) in orderTypeVNArr' :label='$t(type.title_key)' :key='type.title_key' :value='type.value' />
                    </el-select>
                    <!-- 搜尋日期 -->
                    <el-date-picker v-if="+periodType === 4" type="daterange" class="small el-select" popper-class="el-date-editor--calendar" format="yyyy-MM-dd" v-model="saleDateArray" :pickerOptions="pickerOptionsOrder" :placeholder="$t('popup_111')" :editable="false" :clearable="false" />
                    <el-date-picker v-else type="daterange" class="small el-select" popper-class="el-date-editor--calendar" format="yyyy-MM-dd" v-model="openDateArray" :pickerOptions="pickerOptionsOrder" :placeholder="$t( +periodType === 1 ? 'popup_028' : 'bettingrc_081')" :editable="false" :clearable="false" />
                </div>

                <div class="gr_page__controls__search--submit">
                    <button class='c_button--secondary' @click='search' ref='searchBtn'>
                        <span class="c_button__text">
                            <!-- {{$t("查询")}} -->
                            {{$t('bettingrc_012')}}
                        </span>
                    </button>
                </div>
            </div>
            <div v-if="false" class="text_color_accent u_p--t10">
                <!-- 返点金额将于开奖后派发。 -->
            {{$t('bettingrc_042')}}
            </div>
            <div class="gr_page__controls__toggle--submit" @click="controllerToggle = !controllerToggle">
                <i class="gr_toggle__icon"></i>
            </div>
        </div>
    </div>
</template>

<script>
import Controls from '../980/Controls/Controls'

export default {
    name: 'Controls',
    mixins: [Controls],
    data() {
        // 狀態下拉選單的預設值
        // 預設[未開獎, 中獎, 未中獎]
        const statusDefalut = [0, 1, 2]

        return {
            controllerToggle: true,
            pickerOptionsSaleStartFrom: {
                disabledDate(time) {
                    return (time && time.valueOf() > Date.now() + 86400000 * 6) || (time && time.valueOf() < Date.now() - 86400000)
                }
            },
            pickerOptionsSaleStartTo: {
                disabledDate: time => {
                    let saleStartDate = 0
                    let lastDays = 7
                    if (this.saleStartDate) {
                        saleStartDate = new Date(this.saleStartDate).getTime()
                        lastDays = parseInt((Date.now() - saleStartDate) / 86400000) + 1
                    }
                    // 如果開始時間Time大於結束時間 結束時間需重新設定
                    if (new Date(this.saleStartDate).getTime() > new Date(this.saleEndDate).getTime()) {
                        this.change({ saleEndDate: '' })
                    }
                    return (time && time.valueOf() > Date.now() + 86400000 * 6) || (time && time.valueOf() < Date.now() - 86400000 * lastDays)
                }
            },
            pickerOptionsStartFrom: {
                disabledDate(time) {
                    return (time && time.valueOf() > Date.now()) || (time && time.valueOf() < Date.now() - 86400000 * 7)
                }
            },
            pickerOptionsStartTo: {
                disabledDate: time => {
                    let startDate = 0
                    let lastDays = 7
                    if (this.startDate) {
                        startDate = new Date(this.startDate).getTime()
                        lastDays = parseInt((Date.now() - startDate) / 86400000) + 1
                    }
                    // 如果開始時間Time大於結束時間 結束時間需重新設定
                    if (new Date(this.startDate).getTime() > new Date(this.endDate).getTime()) {
                        this.change({ endDate: '' })
                    }
                    return (time && time.valueOf() > Date.now()) || (time && time.valueOf() < Date.now() - 86400000 * lastDays)
                }
            },
            orderTypeArr: [
                { value: 1, title: '投注时间', title_key: 'popup_028' },
                { value: 2, title: '结算时间', title_key: 'bettingrc_081' },
                { value: 3, title: '投注期号', title_key: 'bettingrc_011' }
            ],
            orderTypeVNArr: [
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
    },
    computed: {
        // 百家樂全部彩種下拉選單
        lotlist() {
            return (this.lotteryMenu[8] || {}).list
        }
    }
}
</script>
