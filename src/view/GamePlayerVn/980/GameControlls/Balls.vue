<template>
    <div class="gr_game-controller  gr_container  u_clearfix  bg_primary">
        <div class="gr_game-controller__inner">
            <div class="counter">
                <el-select ref="select" v-model="times">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <el-input-number type="tel" @focus="handleFocus" @blur="handleBlur" ref="InputNumber" v-model="times" :min="1" :max="99999999" size="small" />
            </div>
            <!-- {{$t("倍")}} -->
            {{$t('common_034')}}
            <el-radio-group :value="mode">
                <el-radio-button
                    v-for="(_mode, mi) in VN_modes"
                    :key="mi"
                    :label="_mode"
                    v-if="mi === 0 || !isGPI"
                    @click.native="mode = _mode"
                >
                    {{ (lang === 'cn') ? $t(modesCn[mi]) : _mode }}
                </el-radio-button>
            </el-radio-group>
            <!-- '奖金' -->
            <span class="u_p--l10">{{$t('common_038')}}︰
                <span>
                    {{formatNumber(hprize)}}
                </span>
            </span>
            <div class="gr_game-controller__row">
                <div class="gr_game-controller__total" v-if="!isShowDemo">
                    <!-- {{$t("注")}} path="{0} 元" -->
                    <strong>{{nums}}</strong>{{$t('common_033')}}
                    ，<i18n path="common_044" tag="span">
                        <strong place="0">{{ formatNumber(money) || 0 }}</strong>
                        <template place="1">{{ currencySymbol }}</template>
                    </i18n>
                    <!-- <span>
                    盈利{0} 元
                    ，<i18n path="common_045" tag="span">
                        <strong place="0">{{ bonus }}</strong>
                        <template place="1">{{currencySymbol}}</template>
                    </i18n>
                    </span>-->
                </div>
                <div class="gr_game-controller__button-group">
                    <button
                    class="c_button--default  c_button--large"
                    @click="handleReset">
                        <span class="c_button__text">
                            <!-- '重置' -->
                            {{$t('common_062')}}
                        </span>
                    </button>
                    <button
                        :class="['c_button--large', !isBlocked ? 'c_button--primary' : 'c_button--disabled']"
                        :disabled="isBlocked"
                        @click="add(7)"
                    >
                        <!-- "直接投注" : '本期停售'-->
                        <span class="c_button__text">{{$t((!isBlocked) ? "common_046" : "common_068")}}</span>
                    </button>
                    <button
                        class="c_button--secondary  c_button--large"
                        @click="add(1)"
                        v-if="!isBlocked"
                    >
                        <i class="c_button__icon  el-icon-plus" />
                        <span class="c_button__text">
                            <!-- {{$t("投注项")}} -->
                            {{$t('common_047')}}
                        </span>
                    </button>
                </div>
            </div>
        </div>
        <div class="u_hr" />
    </div>
</template>
<script>
    //2D3D4D
    import GameControllInput from './Input'
    export default {
        name: 'GameControllQuick',
        extends: GameControllInput
    }
</script>
