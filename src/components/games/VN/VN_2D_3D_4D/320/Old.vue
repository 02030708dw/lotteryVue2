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
                <div class="gr_grid-vn-card" v-for="(title, i) in methodTitle[VN_menuIndex]" :key="title">
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
                <!-- '号码' -->
                <span class="gr_header__text">{{$t('common_063')}}</span>
            </div>
            <div class="gr_grid-vn__controller">
                <div class="gr_controller__item" @click="luckyCode">
                    <!-- '幸运号码' -->
                    <div class="gr_item__text">{{$t('common_147')}}</div>
                </div>
                <div class="gr_controller__item" @click="cleanCode">
                    <!-- '清' -->
                    <div class="gr_item__text">{{$t('common_031')}}</div>
                </div>
            </div>
            <div class="gr_grid-vn__content">
                <GrRow  v-for="(i, j) in rowNum" :key="`g${j}`">
                    <GrCol>
                        <GrCom>{{i}}.</GrCom>
                    </GrCol>
                    <GrCol>
                        <GrCom>
                            <div class="gr_component__input  gr_component__input--long  c_input--short">
                                <!-- '填入2~4码' -->
                                <input
                                    class="gr_input__inner  c_input__inner"
                                    type="tel"
                                    :placeholder="$t('vn_t_024')"
                                    :value="code[j]"
                                    @input="setCode(j, $event.target.value)"
                                />
                                    <!--
                                        // 暫時關閉自訂keyboard
                                    :class="isKeyboardOn && checkActive(j, setCode.name) ? 'is_active' : ''"
                                    @click.stop="focusKB(j, code, setCode, $event.target)"
                                    :readonly="isMobile"
                                    :unselectable="isMobile ? 'on': null"
                                    @focus="mobileBlur"
                                    -->
                            </div>
                        </GrCom>
                    </GrCol>
                    <GrCol>
                        <GrCom class="gr_component--icon">
                            <span
                                class="gr_component__icon  gr_component__icon--delete"
                                v-if="rowNum !== 1"
                                @click="delRow(j)"
                            >
                                <i class="el-icon-close" />
                            </span>
                            <span
                                class="gr_component__icon  gr_component__icon--plus"
                                v-if="i === rowNum && (rowNum + VN_gameOrder.orderRowNum) < 20"
                                @click="insRow(1)"
                            >
                                <i class="i_plus"/>
                            </span>
                        </GrCom>
                    </GrCol>
                </GrRow>
            </div>
        </div>

        <!-- <Keyboard ref="keyboard" :class="{is_active: isKeyboardOn}" :handleKB="handleKB"/> -->
    </div>
</template>

<script>
    import VN_2D_3D_4D from '../980/Old'
    import { warnMessageBox } from '@UTIL'

    const defaultRowNum = 1
    export default {
        name: 'VN_2D_3D_4D_320_OLD',
        mixins: [VN_2D_3D_4D],
        data() {
            const defaultMethodVal = ['', '', '', '', '']
            return {
                // 號碼
                code: [...Array(defaultRowNum)].map(() => ''),
                // 玩法值
                methodVal: [...Array(defaultRowNum)].map(() => [...defaultMethodVal]),
                // 所有玩法值
                methodValAll: [...defaultMethodVal],
                // 城市資料
                cityList: [...Array(defaultRowNum)].map(() => []),
                // 金額
                rowMoney: [...Array(defaultRowNum)].map(() => 0),
                rowNum: defaultRowNum,
                // 預設幾行
                defaultRowNum
            }
        },
        methods: {
            delRow(rowId) {
                this.code.splice(rowId, 1)
                this.methodDisable.splice(rowId, 1)
                this.methodVal.splice(rowId, 1)
                this.rowMoney.splice(rowId, 1)
                this.cityList.splice(rowId, 1)
                this.$set(this, 'rowNum', this.rowNum - 1)
                this.code.forEach((v, i) => this.$root.$emit('setRowMoney', i))
            },
            insRow(num) {
                const sum = this.rowNum + num + this.VN_gameOrder.orderRowNum
                // '最多只能增至20组号码' : '只能再加入{0}组号码'
                // if (sum > 20) {
                //     const numCanAdd = 20 - this.VN_gameOrder.orderRowNum
                //     const message = this.$t(numCanAdd === 20 ? 'popup_106' : 'popup_107', {'0': numCanAdd})
                //     return this.$msg(warnMessageBox({
                //         message
                //     }))
                // }
                const insArr = [...Array(num)].map(() => '')
                const insmethodDisable = [...Array(num)].map(() => [...this.methodDisable[0]])
                const insmethodStatus = [...Array(num)].map(() => [...this.defaultstatus[0]])
                const insMethodVal = [...Array(num)].map(() => [...this.methodVal[0]])
                const insRowMoney = [...Array(num)].map(() => 0)
                const insCityList = [...Array(num)].map(() => [...this.cityList[0]])
                this.code = [...this.code, ...insArr]
                this.methodDisable = [...this.methodDisable, ...insmethodDisable]
                this.methodStatus = [...this.methodStatus, ...insmethodStatus]
                this.methodVal = [...this.methodVal, ...insMethodVal]
                this.rowMoney = [...this.rowMoney, ...insRowMoney]
                this.cityList = [...this.cityList, ...insCityList]
                this.$set(this, 'rowNum', this.rowNum + num)
                this.$nextTick(() => {
                    // 320/手機 滑動的卷軸不一樣
                    const scroll = document.documentElement.scrollTop ? document.documentElement : document.body
                    return scroll.scrollTo(0, 9999)
                })
            },
            cleanCode() {
                this.code = this.code.map(() => '')
            },
            cleanMoney() {
                this.defaultMethodVal.forEach((v, i) => this.setMethodValAll(i, ''))
            }
        }
    }
</script>
