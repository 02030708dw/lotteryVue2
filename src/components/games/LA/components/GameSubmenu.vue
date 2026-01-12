<template>
    <div class="gr_game-la-submenu gr_game-submenu  gr_container  bg_primary  u_fz--small">
        <div class="gr_game-selectBar  u_clearfix"  >
            <template v-if="RWDMode === 1">
                <ul>
                    <li
                        v-for="({upperName_key, methodId}, cbI) in LA_gameSubMenu"
                        @click="selectMethod(!LA_methodSelect[methodId], methodId)"
                        :class="{'is_checkbox': LA_methodSelect[methodId], is_disabled: LA_stop[methodId]}"
                        :key="cbI"
                    >
                        <span class="gr_button__text">{{$t(upperName_key)}}</span>
                    </li>
                </ul>
                <GamePrompt class="game_prompt" />
            </template>
        </div>
        <div
            class="gr_section__bar"
            :class="{is_disabled: LA_methodIsSelect.length === 0}"
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
                        :class="{is_active: $parent.fastSelect[index]}"
                        v-for="(item, index) in 10"
                        :key="'0'+index"
                        @click="$parent.selectBold(index)"
                    >
                        <span class="gr_button__text">{{index}}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.gr_game-selectBar {
        line-height: 31px;
        ul {
            list-style: none;
            margin: 10px auto 15px auto;
            display: inline-block;

            li {
                min-width: calc(300px / 3);
                display: inline-block;
                text-align: center;
                padding: 5px;
                span {
                    border: 1px solid #d0d0d0;
                    border-radius: 5px;
                    width: 100%;
                    height: 100%;
                    display: inline-block;
                    position: relative;
                    &::before, &::after {
                        content: "";
                        border: 3px solid #666666;
                        border-left: 0;
                        border-top: 0;
                        height: 13px;
                        width: 8px;
                        position: absolute;
                        top: -4px;
                        right: -1px;
                        transform: rotate(45deg);
                        z-index: 2;
                        visibility: hidden;
                        opacity: 0;
                        transition: 0.4s all;
                    }
                    &::after {
                        border: 7px solid #f2f2f2;
                        z-index: 1;
                    }
                }
                &.is_checkbox {
                    span {
                       border-color: #666666;
                       &::before, &::after {
                            content: "";
                            visibility: visible;
                            opacity: 1;
                        }
                    }
                }
            }
        }
        .game_prompt {
            display: inline-block;
            /deep/ .gr_game-prompt {
                margin-left: 20px;
            }
        }
    }
</style>
<script>
    import GamePrompt from '@V/GamePlayerLA/980/GamePrompt'
    import { mapGetters, mapActions } from 'vuex'
    export default {
        name: 'checkbar',
        components: {GamePrompt},
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
                'RWDMode',
                'LA_gameSubMenu',
                'LA_methodSelect',
                'LA_methodIsSelect',
                'LA_jsPrizePoint',
                'LA_prizeChange',
                'LA_stop'
            ])
        },
        methods: {
            ...mapActions([
                _M.SET_LA_TEMP_DATA
            ]),
            selectMethod(bool, methodId) {
                if (!bool && this.LA_methodIsSelect[0] === methodId) {
                    return
                }
                this[_M.SET_LA_TEMP_DATA]({
                    temp: 'LA_methodSelect',
                    data: {[methodId]: bool}
                })
                // 清空選擇區
                this[_M.SET_LA_TEMP_DATA]({
                    temp: 'LA_gameSelectData',
                    data: {}
                })
            },
            hprize(id) {
                if (this.LA_jsPrizePoint) {
                    const { hprize, autoOdds } = this.LA_jsPrizePoint[id][0]
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