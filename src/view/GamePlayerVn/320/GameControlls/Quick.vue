
<template>
    <div class="game_controlls container">
        <ul v-if="!showGameBox">
            <li>
                <button v-if="false" class="c_button--default"  @click.stop="randomShowLotterys">
                    <i class="c_button__icon  i_ramdon" />
                    <span class="c_button__text">
                        <!--{{$t("机选")}}-->
                        {{$t('common_124')}}
                    </span>
                </button>
            </li>
            <li>
                <button class="c_button--default" @click.stop="handleReset">
                    <i class="c_button__icon  i_clear" />
                    <span class="c_button__text">
                        <!-- '清空' (中文以外不顯示文字)  -->
                        {{$t('common_049')}}
                    </span>
                </button>
            </li>
            <li>
                <button class="c_button--secondary" v-show="(nums === 0) && boxLength > 0" @click.stop="setIsFast(false);handleGameBox(VN_gameSubmit.showList)">
                    <i class="c_button__icon i_betting--320"></i>
                    <span class="c_button__text">
                        <!-- {{$t("查看投注项")}} -->
                        {{$t('common_123')}}
                    </span>
                    <div v-show="boxLength > 0"><span>{{boxLength > 9 ? 9 : boxLength}}</span><span v-if="boxLength > 9">+</span></div>
                </button>
            </li>
            <li>
                <button class="c_button--secondary" v-show="money" @click.stop="add(1)">
                    <i class="c_button__icon  el-icon-plus" />
                    <span class="c_button__text">
                        <!-- {{$t("投注项")}} -->
                        {{$t('common_138')}}
                        <!-- {{$t('common_047')}} -->
                    </span>
                    <div v-show="boxLength > 0"><span>{{boxLength > 9 ? 9 : boxLength}}</span><span v-if="boxLength > 9">+</span></div>
                </button>
            </li>
            <li>
                <button
                    :class="['c_button--primary', isFastDisabled]"
                    @click="!isFastDisabled && handleGameOrderFast('gameOrder')"
                >
					<!-- {{$t("直接投注")}} : '本期停售'-->
                    <span class="c_button__text">{{$t('common_046')}}</span>
                </button>
            </li>
        </ul>
        <div class="u_clearfix" v-else>
            <div class="u_f--left game_controlls--text">
                <div>
                    <!-- 共{0}注 -->
                    <i18n path="common_073">
                        <strong place="0">{{ltProjectNum}}</strong>
                    </i18n>
                </div>
                <!-- 总计{0}元 -->
                <i18n path="common_074" tag="div" v-if="!isShowDemo">
                    <strong place="0">{{formatNumber(ltMoneyAmout)}}</strong>
                    <template place="1">{{currencySymbol}}</template>
                </i18n>
            </div>
            <div class="u_f--right game_controlls--btn">
                <button
                    :class="['c_button--primary']"
                    @click="handleGameOrder('gameSubmit')"
                >
					<!-- {{$t("确认投注")}} : '本期停售' -->
                    <span class="c_button__text">{{$t('common_076')}}</span>
                </button>
            </div>
        </div>
    </div>
</template>
<script>
    import GameControllInput from './Input'
    export default {
        name: 'GameControllQuick',
        extends: GameControllInput
    }
</script>
