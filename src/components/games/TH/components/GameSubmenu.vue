<template>
    <div class="gr_game-th-submenu">
        <div class="gr_section__bar">
            <label
                class="el-checkbox"
                v-for="({title_key, methodId}, cbI) in TH_gameSubMenu"
                :class="{disable: TH_stop[methodId]}"
            >
                <span
                    class="gr_bar__checkbox c_checkbox"
                    :class="{'is_checked': TH_methodSelect[methodId], is_disabled: TH_stop[methodId]}"
                >
                    <span class="c_checkbox__inner" />
                    <input
                        type="checkbox"
                        :checked="TH_methodSelect[methodId] && !TH_stop[methodId]"
                        @click="selectMethod(!TH_methodSelect[methodId], methodId)"
                        :disabled="TH_stop[methodId]"
                    />
                </span>
                <span>{{$t(title_key)}}</span>
                <!-- 停售 -->
                <span v-if="TH_stop[methodId]">{{$t('popup_096')}}</span>
                <span v-else :class="{is_odds: TH_prizeChange[methodId]}">{{hprize(methodId)}}</span>
            </label>
        </div>
        <div
            class="gr_section__bar"
            :class="{is_disabled: TH_methodIsSelect.length === 0}"
            v-if="$parent.isSearchBar"
        >
            <div class="c_input--medium">
                <!-- 搜寻号码 -->
                <i class="i_funnel" />
                <input
                    class="c_input__inner"
                    type="tel"
                    v-model="$parent.filterNum"
                    :placeholder="$t('thai_036')"
                />
                <i
                    class="el-icon-circle-close"
                    v-if="$parent.filterNum"
                    @click="cleanrSearch"
                />
            </div>
            <div class="c_input--big" @click="$parent.isMuti = !$parent.isMuti">
                <span class="gr_bagGroup__button" :class="{is_active: $parent.isMuti}">
                    <!-- 包组 -->
                    <span class="gr_button__text">{{$t('thai_008')}}</span>
                </span>
            </div>
            <div class="gr_bold" v-if="$parent.isBold">
                <!-- 包胆 -->
                <div class="gr_bold__text">{{$t('thai_007')}}:</div>
                <div class="gr_bold__btn">
                    <div
                        class="gr_field__button"
                        :class="{is_active: false}"
                        v-for="(item, index) in 10"
                        @click="$parent.selectBold(index)"
                    >
                        <span class="gr_button__text">{{index}}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import { mapGetters, mapActions } from 'vuex'
    export default {
        name: 'checkbar',
        props: {
            // // 有勾選的checkboxs
            // activeCheckboxes: Object,
            // // 勾選後執行動作
            // selectCheckbox: Function,
            // // checkboxs是否可啟用(封盤/休市關閉)
            // ableCheckbox: Array
        },
        data() {
            return {
                // 固定只有一條row
                // rowIndex: 0,
            }
        },
        computed: {
            ...mapGetters([
                'TH_gameSubMenu',
                'TH_methodSelect',
                'TH_methodIsSelect',
                'TH_jsPrizePoint',
                'TH_prizeChange',
                'TH_stop'
            ])
        },
        methods: {
            ...mapActions([
                _M.SET_TH_TEMP_DATA
            ]),
            selectMethod(bool, methodId) {
                this[_M.SET_TH_TEMP_DATA]({
                    temp: 'TH_methodSelect',
                    data: {...this.TH_methodSelect, [methodId]: bool}
                })
            },
            hprize(id) {
                if (this.TH_jsPrizePoint) {
                    const { hprize, autoOdds } = this.TH_jsPrizePoint[id][0]
                    return (hprize + autoOdds).strip()
                } else {
                    return ''
                }
            },
            cleanrSearch() {
                this.$parent.filterNum = ''
            }
        }
    }
</script>