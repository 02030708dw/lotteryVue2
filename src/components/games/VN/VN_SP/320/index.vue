<template>
    <div class="gr_container bg_primary">
        <Area
            v-if="isShowArea && !VN_lotteryId"
            :cityList="cityList"
            :handleChk="handleChk"
            :titleChk="titleChk"
        />
        <AreaTable
            v-if="isShowAreaTable && !VN_lotteryId"
            :cityList="cityList"
        />
        <div class="gr_grid-vn">
            <div class="gr_grid-vn__header">
                <!-- '投注金额' -->
                <span class="gr_header__text">
                    {{$t('popup_009')}} ({{$t('vn_t_053')}} {{VN_stake}})
                </span>
                <GamePrompt />
            </div>
            <div class="gr_grid-vn__controller">
                <div class="gr_controller__item" @click="cleanMoney">
                    <!-- '清' -->
                    <div class="gr_item__text">{{$t('common_031')}}</div>
                </div>
            </div>
            <div class="gr_grid-vn__content">
                <div class="gr_grid-vn-card" v-for="(title, i) in methodTitle[VN_menuIndex]">
                    <div class="gr_grid-vn-card__header">{{$t(title)}}</div>
                    <div class="gr_grid-vn-card__content">
                        <div class="c_input--short" :class="{is_strong: methodStatus[0][i]}">
                            <input
                                class="c_input__inner"
                                type="tel"
                                :value="methodValAll[i]"
                                @input="setMethodValAll(i, $event.target.value)"
                                @blur="handleMethodValAllBlur(i, $event.target.value)"
                            />
                            <!--
                                // 暫時關閉自訂keyboard
                                :class="isKeyboardOn && checkActive(i, setMethodValAll.name) ? 'is_active' : ''"
                                @click.stop="focusKB(i, methodValAll, setMethodValAll, $event.target)"
                                :readonly="isMobile"
                                :unselectable="isMobile ? 'on': null"
                                @focus="mobileBlur"
                             -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="gr_grid-vn">
            <div class="gr_grid-vn__header">
                <!-- '项目' -->
                <span class="gr_header__text">{{$t("common_066")}}</span>
                <GameInfoIcon />
            </div>
            <div class="gr_grid-vn__controller">
                <div class="gr_controller__item" @click="setCodeAll">
                    <!-- '全' -->
                    <div class="gr_item__text">{{$t('common_019')}}</div>
                </div>
                <div class="gr_controller__item" @click="cleanCode">
                    <!-- '清' -->
                    <div class="gr_item__text">{{$t('common_031')}}</div>
                </div>
            </div>
            <div class="gr_grid-vn__content">
                <span
                    class="gr_grid-vn__button"
                    :class="{is_active: code[j]}"
                    v-for="(title, j) in rowTitleKey"
                    :key="title"
                    @click="setCode(j)"
                >
                    <span class="gr_button__text">{{$t(title)}}</span>
                </span>
            </div>
        </div>

        <!-- <Keyboard ref="keyboard" :class="{is_active: isKeyboardOn}" :handleKB="handleKB"/> -->
    </div>
</template>
<script>
    import VN_SP from '../980'

    export default {
        name: 'VN_SP',
        mixins: [VN_SP],
        methods: {
            cleanCode() {
                this.rowTitle.forEach((v, i) => {
                    this.$set(this.code, i, '')
                    this.$root.$emit('setRowMoney', i)
                })
            },
            cleanMoney() {
                this.defaultMethodVal.forEach((v, i) => this.setMethodValAll(i, ''))
            }
        }
    }
</script>
