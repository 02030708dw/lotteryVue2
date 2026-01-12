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
                <div class="gr_grid-vn-card">
                    <div class="gr_grid-vn-card__header">{{$t('PL2,PL3')}}</div>
                    <div class="gr_grid-vn-card__content">
                        <div class="c_input--short" :class="{is_strong: methodStatus[0][3]}">
                            <input
                                class="c_input__inner"
                                type="tel"
                                :value="methodValAll[3]"
                                @input="setMethodValAll(3, $event.target.value)"
                                @blur="handleMethodValAllBlur(3, $event.target.value)"
                            />
                            <!--
                                // 暫時關閉自訂keyboard
                                :class="isKeyboardOn && checkActive(3, setMethodValAll.name) ? 'is_active' : ''"
                                @click.stop="focusKB(3, methodValAll, setMethodValAll, $event.target)"
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
                <span class="gr_header__text">{{$t("common_063")}}</span>
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
                <GrRow v-for="(i, j) in rowNum" :key="`g${j}`">
                    <GrCol>
                        <GrCom>{{i}}.</GrCom>
                    </GrCol>
                    <GrCol v-for="(c, k) in code[j]" :key="`c${k}${j}`">
                        <GrCom>
                            <!-- '号码' -->
                            <div class="gr_component__title">{{$t("common_063")}}{{k + 1}}</div>
                            <div class="gr_component__input  c_input--short">
                                <!-- '填入2码' -->
                                <input
                                    class="gr_input__inner  c_input__inner"
                                    type="tel"
                                    :placeholder='$t("vn_t_025")'
                                    :value="code[j][k]"
                                    @input="setCode(j, k, $event.target.value)"
                                />
                                <!--
                                    // 暫時關閉自訂keyboard
                                    :class="isKeyboardOn && checkActive(`${j},${k}`, setCode.name) ? 'is_active' : ''"
                                    @click.stop="focusKB(`${j},${k}`, code, setCode, $event.target)"
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
    import VN_PL2_PL3_980_OLD from '../980/Old'
    import { warnMessageBox } from '@UTIL'
    const defaultRowNum = 1
    export default {
        name: 'VN_PL2_PL3_320_OLD',
        extends: VN_PL2_PL3_980_OLD,
        data() {
            const defaultMethodVal = ['', '', '', '', '']
            const rowArr = [...Array(defaultRowNum)]
            return {
                // 號碼
                code: rowArr.map(() => ['', '', '']),
                // 玩法值
                methodVal: rowArr.map(() => [...defaultMethodVal]),
                // 所有玩法值
                methodValAll: [...defaultMethodVal],
                // 城市資料
                cityList: rowArr.map(() => []),
                // 金額
                rowMoney: rowArr.map(() => 0),
                rowNum: defaultRowNum,
                // 預設幾行
                defaultRowNum
            }
        },
        methods: {
            delRow(rowId) {
                this.code.splice(rowId, 1)
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

                const rowArr = [...Array(num)]
                const insArr = rowArr.map(() => ['', '', ''])
                const insMethodVal = rowArr.map(() => [...this.methodVal[0]])
                const insmethodStatus = rowArr.map(() => [...this.defaultstatus[0]])
                const insRowMoney = rowArr.map(() => 0)
                const insCityList = rowArr.map(() => [...this.cityList[0]])
                this.code = [...this.code, ...insArr]
                this.methodVal = [...this.methodVal, ...insMethodVal]
                this.methodStatus = [...this.methodStatus, ...insmethodStatus]
                this.rowMoney = [...this.rowMoney, ...insRowMoney]
                this.cityList = [...this.cityList, ...insCityList]
                this.$set(this, 'rowNum', this.rowNum + num)
                this.$nextTick(() => {
                    // 320/手機 滑動的卷軸不一樣
                    const scroll = document.documentElement.scrollTop ? document.documentElement : document.body
                    return scroll.scrollTo(0, 9999)
                })
            },
            luckyCode() {
                const hascode = this.code.find(v => v[0]) || this.code.find(v => v[1]) || this.code.find(v => v[2])
                hascode ? this.luckyCodeMessageBox(this.randomCode) : this.randomCode()
            },
            randomCode() {
                this.code.forEach((v, j) => {
                    const notRandom = Math.randomNum(6) % 6
                    const arr = [0, 1, 2].filter(i => i !== notRandom)
                    arr.forEach((i) => this.haneleRandomCode(v, i, j))
                    arr.length === 2 && this.setCode(j, notRandom, '')
                })
            },
            cleanCode() {
                this.code = this.code.map(() => ['', '', ''])
            },
            cleanMoney() {
                this.setMethodValAll(3, '')
            }
        }
    }
</script>

