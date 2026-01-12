<template>
    <div class="gr_container  bg_primary  u_p--r10  u_p--l10">
        <DateOfLottery v-if="isShowArea" />
        <CityTable v-if="VN_menuIndex && !VN_lotteryId" :cityList="cityList" />
        <GridPanel
            :class="{is_active: isPopActive}"
            :style="{
                left: panelLeft,
                top: panelTop
            }"
            :handlePanel="handlePanel"
        />
        <div class="gr_grid-vn">
            <GrRow>
                <GrCol :style="{width: colWidth[1][colWidthIndex]}">
                    <RowHeader :style="{height: setHeaderHeight, 'line-height': setHeaderHeight}">
                        <!-- '号码' -->
                        <GrCom>{{$t('common_063')}}</GrCom>
                    </RowHeader>
                    <RowTitle>
                        <GrCom class="gr_component--number">
                            <span>#</span>
                        </GrCom>
                        <GrCom v-for="(i, j) in 3" :key="j">
                            <span @click="luckyCode(j)" class="gr_component--number__button">
                                <span class="gr_button__text">
                                    <!-- '幸运号码' -->
                                    {{$t('common_147')}}
                                </span>
                            </span>
                        </GrCom>
                    </RowTitle>
                </GrCol>
                <GrCol :style="{width: colWidth[2][colWidthIndex]}">
                    <RowHeader :style="{height: setHeaderHeight, 'line-height': setHeaderHeight}">
                        <!-- '投注金额' -->
                        <GrCom>
                            {{$t('popup_009')}}
                            <br v-if="VN_subMenuIndex === 1 && isShowArea">
                            ({{$t('vn_t_053')}} {{VN_stake}})
                        </GrCom>
                    </RowHeader>
                    <RowTitle>
                        <GrCom>
                            <div class="gr_title__input  c_input--short">
                                <input
                                    class="c_input__inner"
                                    type="tel"
                                    :value="methodValAll[3]"
                                    @input="setMethodValAll(3, $event.target.value)"
                                    @focus="handleFocus($event, setMethodValAllPanel, '3')"
                                    @blur="handleMethodValAllBlur(3, $event.target.value)"
                                    @click.stop
                                />
                            </div>
                        </GrCom>
                    </RowTitle>
                </GrCol>
                <!-- 地区 -->
                <AllCityTitle
                    :style="{width: colWidth[3]}"
                    v-if="isShowArea && !VN_lotteryId"
                    :titleChk="titleChk"
                    :handleChk="handleChk"
                    :setHeaderHeight="setHeaderHeight"
                />
                <!-- 总额 -->
                <GrCol :style="{width: colWidth[4][colWidthIndex]}">
                    <RowHeader :style="{height: setHeaderHeight, 'line-height': setHeaderHeight}">
                        <GrCom></GrCom>
                    </RowHeader>
                    <RowTitle>
                        <GrCom>{{$t('popup_117')}}</GrCom>
                    </RowTitle>
                </GrCol>
            </GrRow>
            <!-- list start -->
            <GrRow
                class="gr_grid-vn__content"
                :class="{'gr_grid-vn__content--large': isShowArea, is_error: rowStatus[j]}"
                v-for="(i, j) in rowNum"
                :key="`r${j}`"
            >
                <!-- 号码 -->
                <GrCol :style="{width: colWidth[1][colWidthIndex]}">
                    <GrRow>
                        <GrCom class="gr_component--number">{{i}}</GrCom>
                        <GrCom v-for="(c, k) in code[j]" :key="`cc${k}`">
                            <div class="c_input--short">
                                <input
                                    class="c_input__inner"
                                    type="tel"
                                    @input="setCode(j, k, $event.target.value)"
                                    :value="code[j][k]"
                                />
                            </div>
                        </GrCom>
                    </GrRow>
                </GrCol>
                <!-- 投注金额 -->
                <GrCol :style="{width: colWidth[2][colWidthIndex]}">
                    <GrRow>
                        <GrCom>
                            <div
                                class="c_input--short"
                                :class="statusClass[methodStatus[j][3]]"
                            >
                                <input
                                    :value="methodVal[j][3]"
                                    @input="setMethodVal(j, 3, $event.target.value)"
                                    @focus="handleFocus($event, setMethodValPanel, `${j}.3`)"
                                    @blur="handleMethodValBlur(j, 3, $event.target.value)"
                                    @click.stop
                                    class="c_input__inner"
                                    type="tel"
                                >
                            </div>
                        </GrCom>
                    </GrRow>
                </GrCol>
                <!-- 地区 -->
                <AllCityBody
                    :style="{width: colWidth[3]}"
                    v-if="isShowArea && !VN_lotteryId"
                    :cityList="cityList"
                    :rowId="j"
                    :chkPosN="NStatus[j]"
                    :chkPosS="SStatus[j]"
                    :chkPosC="CStatus[j]"
                />
                <!-- 总额 -->
                <GrCol :style="{width: colWidth[4][colWidthIndex]}">
                    <GrRow>
                        <GrCom>{{rowMoney[j]}}</GrCom>
                    </GrRow>
                </GrCol>
            </GrRow>
        </div>
    </div>
</template>
<script>
    //PL2PL3
    import GameVN from '@C/games/GameVN'
    import { warnMessageBox } from '@UTIL'
    import areaNumData from '@S/modules/GamePlayerVN/config/pl2pl3'
    const defaultRowNum = 10
    export default {
        name: 'VN_PL2_PL3_980_OLD',
        mixins: [GameVN],
        data() {
            // '包组'
            const t1 = ['vn_t_021']
            return {
                headerHeight: {
                    1: '46px',
                    2: '23px'
                },
                colWidth: {
                    1: {
                        1: '37%',
                        2: '67%'
                    },
                    2: {
                        1: '11.5%',
                        2: '21.5%'
                    },
                    3: '40%',
                    4: {
                        1: '11.5%',
                        2: '11.5%'
                    }
                },
                // 號碼
                code: [...Array(defaultRowNum)].map(() => ['', '', '']),
                //各區的玩法
                methodTitle: [t1],
                // 預設幾行
                rowNum: defaultRowNum,
                defaultRowNum,
                defaultstatus: [0, 0, 0, 0],
                // 各區域注單
                areaNumData,
                methodKey: {
                    2: 'PL2',
                    3: 'PL3'
                },
                sortKey: {
                    'PL2': 2,
                    'PL3': 3
                }
            }
        },
        methods: {
            calcSubmitOrder() {
                let showList = []
                let ltMoneyAmout = 0
                let orderRowNum = 0
                const issueCityList = this.getIssueCityList()
                this.rowMoney.forEach((money, i) => {
                    ltMoneyAmout += money
                    if (money) {
                        orderRowNum++
                        const codes = [...this.code[i].unique().filter(v => v.length === 2)]
                        const method_key = this.methodKey[codes.filter(v => v.length === 2).length]
                        Object.keys(issueCityList[i]).forEach((issue) => {
                            const cityList = issueCityList[i][issue]
                            cityList.forEach(({ cityId, key }) => {
                                const j = 3
                                const onePrice = this.methodVal[i][j]
                                if (!(isNaN(onePrice) || !+onePrice)) {
                                    const orderId = `${key}${j}`
                                    showList.push({
                                        id: i,
                                        orderId,
                                        ...this.order[i][orderId],
                                        codes,
                                        scode_key: codes,
                                        onePrice,
                                        cityId,
                                        method_key,
                                        methodNameKey: this.methodNameKey[j]
                                    })
                                }
                            })
                        })
                    }
                })
                showList = showList.sort((a, b) => this.sortKey[a.method_key] - this.sortKey[b.method_key] + a.date - b.date)
                return { showList, ltMoneyAmout, orderRowNum }
            },
            handleReset(num = this.defaultRowNum) {
                this.code = [...Array(num)].map(() => ['', '', ''])
            },
            setCode(i, j, v) {
                this.$set(this.code[i], j, v.replace(/\s/g, ''))
                this.$nextTick(() => {
                    if (isNaN(v) || /[.+-]/g.test(v)) {
                        this.$set(this.code[i], j, v.replace(/[\D.+-]/g, ''))
                    } else if (v.length > 2) {
                        this.$set(this.code[i], j, v.substr(0, 2))
                    }
                    //設定 disabled
                    this.$root.$emit('setRowMoney', i)
                })
            },
            insRow(num) {
                const sum = this.rowNum + num
                if (sum > 20) {
                    return this.$msg(warnMessageBox({
                        // '最多只能增加20组号码'
                        message: this.$t('popup_106', {'0': 20})
                    }))
                }
                const rowArr = [...Array(num)]
                const insArr = rowArr.map(() => ['', '', ''])
                const insMethodVal = rowArr.map(() => [...this.defaultMethodVal])
                const insmethodStatus = rowArr.map(() => [...this.defaultstatus])
                const insRowMoney = rowArr.map(() => 0)
                const cityList = this.VN_menuIndex ? [...this.cityList[0]] : []
                const insCityList = rowArr.map(() => cityList)
                this.code = [...this.code, ...insArr]
                this.methodVal = [...this.methodVal, ...insMethodVal]
                this.methodStatus = [...this.methodStatus, ...insmethodStatus]
                this.rowMoney = [...this.rowMoney, ...insRowMoney]
                this.cityList = [...this.cityList, ...insCityList]
                this.$set(this, 'rowNum', this.rowNum + num)
            },
            setRowMoney(rowId) {
                this.beforeCalcMoney(rowId, true)
                const codeLen = this.code[rowId].unique().filter(code => code.length === 2).length
                switch (codeLen) {
                    case 2:
                        this.calcMoney(rowId, 'pl2')
                        break
                    case 3:
                        this.calcMoney(rowId, 'pl3')
                        break
                    default:
                        this.$set(this.rowMoney, rowId, 0)
                        this.setGameAreaSumMoney()
                }
            },
            calcMoney(rowId, method, i = 3) {
                let money = 0
                this.order[rowId] = {}
                this.cityList[rowId].forEach(({key, cityId, issue}) => {
                    const area = this.VN_cityArea[cityId]
                    const nums = (this.areaNumData[method][i][area] || 0)
                    const calcMoney = (nums * this.methodVal[rowId][i]).strip()
                    this.order[rowId][`count${issue}`] = (this.order[rowId][`count${issue}`] || 0) + nums
                    this.order[rowId][`money${issue}`] = (this.order[rowId][`money${issue}`] || 0) + calcMoney
                    this.order[rowId][`${key}${i}`] = {
                        key,
                        nums,
                        issue,
                        money: calcMoney,
                        methodId: this.VN_methodData[method][method][cityId] || -1
                    }
                    money += calcMoney
                })
                money = money.strip()
                money && (this.rowStatus[rowId] = false)
                this.$set(this.rowMoney, rowId, money)
                this.setGameAreaSumMoney()
            },
            getMethod(code) {
                return 'pl' + code.unique().filter(code => code.length === 2).length
            },
            getMethodMult(method, i, j, area) {
                return this.areaNumData[method][3][area]
            },
            luckyCode(i) {
                const hascode = this.code.find(v => v[i])
                hascode ? this.luckyCodeMessageBox(this.randomCode.bind(this, i)) : this.randomCode(i)
            },
            haneleRandomCode(v, i, j) {
                const code = [...Array(2)]
                    .map(() => Math.randomNum(10) % 10)
                    .join('')
                const isSame = v.includes(code)
                isSame ? this.haneleRandomCode(v, i, j) : this.setCode(j, i, code)
            },
            randomCode(i) {
                this.code.forEach((v, j) => this.haneleRandomCode(v, i, j))
            },
            /** 檢查是否選號完整及是否列表顯示紅底 */
            checkOrder() {
                let isCurrent = false
                const isCity = this.cityList[0].length
                let hasInfo = 0
                this.code.forEach((codes, i) => {
                    const vAndVal = codes.find(v2 => v2) || this.methodVal[i].find(v2 => v2)
                    const bool = !!(
                        (vAndVal || (this.cityList[i].length && !this.VN_menuIndex)) &&
                        !this.rowMoney[i]
                    )
                    this.rowStatus[i] = bool
                    isCurrent = isCurrent || bool
                    vAndVal && hasInfo++
                })
                return {isCurrent, isCity, hasInfo}
            }
        },
        computed: {
            setHeaderHeight () {
                return this.VN_subMenuIndex === 1 && this.isShowArea ? this.headerHeight[1] : this.headerHeight[2]
            }
        }
    }
</script>
