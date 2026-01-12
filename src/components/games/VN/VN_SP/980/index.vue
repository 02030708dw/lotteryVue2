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
        <GridTooltip
            v-show="tipIsActive"
            :tipIndex = tipIndex
            :style="{
                left: tipLeft,
                top: tipTop
            }"
        />
        <div class="gr_grid-vn">
            <GrRow>
                <GrCol :style="{width: colWidth[1][colWidthIndex]}">
                    <RowHeader :style="{height: setHeaderHeight, 'line-height': setHeaderHeight}">
                        <!-- '号码' -->
                        <GrCom>{{$t('common_063')}}</GrCom>
                    </RowHeader>
                    <RowTitle>
                        <GrCom>
                            <div>
                                <!-- '項目' -->
                                <span class="gr_game-vn-info-text">{{$t('common_066')}}</span>
                                <i class="gr_game-vn-info-icon  i_question"
                                @mouseover="showTip($event, 0)"
                                @mouseout="() => tipIsActive = false"></i>
                            </div>
                        </GrCom>
                    </RowTitle>
                </GrCol>
                <GrCol :style="{width: colWidth[2][colWidthIndex]}">
                    <RowHeader :style="{height: setHeaderHeight, 'line-height': setHeaderHeight}">
                        <!-- '投注金额' -->
                        <GrCom>{{$t('popup_009')}} ({{$t('vn_t_053')}} {{VN_stake}})</GrCom>
                    </RowHeader>
                    <RowTitle>
                        <GrCom
                            v-for="(title, i) in methodTitle[VN_menuIndex]"
                            :key="title"
                        >
                            <span class="gr_title__text">{{$t(title)}}</span>
                            <div class="gr_title__input  c_input--short">
                                <input
                                    class="c_input__inner"
                                    type="tel"
                                    :value="methodValAll[i]"
                                    @input="setMethodValAll(i, $event.target.value)"
                                    @focus="handleFocus($event, setMethodValAllPanel, i + '')"
                                    @blur="handleMethodValAllBlur(i, $event.target.value)"
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
                <GrCol :style="{width: colWidth[4][colWidthIndex]}">
                    <RowHeader :style="{height: setHeaderHeight, 'line-height': setHeaderHeight}">
                        <GrCom></GrCom>
                    </RowHeader>
                    <RowTitle>
                        <!-- '总额' -->
                        <GrCom>{{$t('popup_117')}}</GrCom>
                    </RowTitle>
                </GrCol>
            </GrRow>
            <!-- list start -->
            <GrRow
                class="gr_grid-vn__content"
                :class="{'gr_grid-vn__content--large': isShowArea, is_error: rowStatus[j]}"
                v-for="(title, j) in rowTitleKey"
                :key="title"
            >
                <!-- 号码 -->
                <GrCol :style="{width: colWidth[1][colWidthIndex]}">
                    <GrRow>
                        <GrCom>
                            <label
                                @mouseover="showTip($event, j+1)"
                                @mouseout="() => tipIsActive = false"
                            >
                                <span
                                    class="gr_component--number__input  c_checkbox"
                                    :class="{'is_checked': code[j]}"
                                >
                                    <span class="c_checkbox__inner" />
                                    <input
                                        type="checkbox"
                                        :checked="code[j]"
                                        @change="setCode(j)"
                                    >
                                </span>
                                <span class="gr_component--number__text">{{$t(title)}}</span>
                            </label>
                        </GrCom>
                    </GrRow>
                </GrCol>
                <!-- 投注金额 -->
                <GrCol :style="{width: colWidth[2][colWidthIndex]}">
                    <GrRow>
                        <GrCom v-for="(k, l) in methodTitle[VN_menuIndex]" :key="k + VN_menuIndex">
                            <div
                                class="c_input--short"
                                :class="statusClass[methodStatus[j][l]]"
                            >
                                <input
                                    :value="methodVal[j][l]"
                                    @input="setMethodVal(j, l, $event.target.value)"
                                    @focus="handleFocus($event, setMethodValPanel, `${j}.${l}`)"
                                    @blur="handleMethodValBlur(j, l, $event.target.value)"
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
    //特殊
    import GameVN from '@C/games/GameVN'
    // import { warnMessageBox } from '@UTIL'
    import areaNumData from '@S/modules/GamePlayerVN/config/teshu'
    const rowTitle = ['大', '小', '单', '双', '大单', '大双', '小单', '小双', '单单', '双双', '单双', '双单', '内', '外']

    // ['大', '小', '单', '双',
    // '大单', '大双', '小单', '小双',
    // '单单', '双双', '单双', '双单',
    // '内', '外']
    const rowTitleKey = [
        'common_020', 'common_021', 'common_024', 'common_025',
        'mark6_t_027', 'mark6_t_028', 'mark6_t_029', 'mark6_t_030',
        'vn_t_028', 'vn_t_029', 'vn_t_030', 'vn_t_031',
        'vn_t_026', 'vn_t_027']

    const defaultRowNum = rowTitle.length
    export default {
        name: 'VN_SP',
        mixins: [GameVN],
        created() {
        },
        data() {
            // ['头', '尾', '头尾', '包组']
            const t1 = ['vn_t_018', 'vn_t_019', 'vn_t_020', 'vn_t_021']
            const defaultMethodVal = ['', '', '', '', '']
            const defaultStatus = [0, 0, 0, 0, 0]
            const rowArr = [...Array(defaultRowNum)]
            return {
                headerHeight: {
                    1: '46px',
                    2: '23px'
                },
                defaultColWidth: {
                    1: {
                        1: '10.5%',
                        2: '14%'
                    },
                    2: {
                        1: '42%',
                        2: '72%'
                    },
                    3: '37.5%',
                    4: {
                        1: '10%',
                        2: '14%'
                    }
                },
                langColWidth: {
                    1: {
                        1: '10%',
                        2: '14%'
                    },
                    2: {
                        1: '40%',
                        2: '72%'
                    },
                    3: '40%',
                    4: {
                        1: '10%',
                        2: '14%'
                    }
                },
                // 號碼
                code: rowArr.map(() => ''),
                //各區的玩法
                methodTitle: [t1, t1, t1, t1],
                // 玩法值
                methodVal: rowArr.map(() => [...defaultMethodVal]),
                methodStatus: rowArr.map(() => [...defaultStatus]),
                // 城市資料
                cityList: rowArr.map(() => []),
                // 金額
                rowMoney: rowArr.map(() => 0),
                rowNum: defaultRowNum,
                // 預設幾行
                defaultRowNum,
                rowTitle,
                rowTitleKey,
                // 各區域注單
                areaNumData,
                tipLeft: 0,
                tipTop: 0,
                tipIndex: 0,
                tipIsActive: false
            }
        },
        methods: {
            calcSubmitOrder() {
                let showList = []
                let ltMoneyAmout = 0
                // '特殊'
                const method_key = 'vn_t_007'
                const issueCityList = this.getIssueCityList()
                let orderRowNum = 0
                this.rowMoney.forEach((money, i) => {
                    orderRowNum++
                    ltMoneyAmout += money
                    if (money) {
                        Object.keys(issueCityList[i]).forEach((issue) => {
                            const cityList = issueCityList[i][issue]
                            cityList.forEach(({ cityId, key }) => {
                                this.methodVal[i].forEach((onePrice, j) => {
                                    if (!(isNaN(onePrice) || !+onePrice)) {
                                        const orderId = `${key}${j}`
                                        showList.push({
                                            id: i,
                                            orderId,
                                            codes: this.code[i],
                                            scode_key: this.rowTitleKey[i],
                                            ...this.order[i][orderId],
                                            cityId,
                                            onePrice,
                                            method_key,
                                            methodNameKey: this.methodNameKey[j]
                                        })
                                    }
                                })
                            })
                        })
                    }
                })
                showList = showList.sort((a, b) => a.id - b.id + a.date - b.date)
                return { showList, ltMoneyAmout, orderRowNum }
            },
            handleReset(num = this.defaultRowNum) {
                const rowArr = [...Array(num)]
                this.code = rowArr.map(() => '')
                this.methodVal = rowArr.map(() => [...this.defaultMethodVal])
                this.cityList = rowArr.map(() => [])
                this.rowMoney = rowArr.map(() => 0)
            },
            setCode(i) {
                const v = this.code[i] ? '' : this.rowTitle[i]
                this.$set(this.code, i, v)
                this.$root.$emit('setRowMoney', i)
            },
            setCodeAll() {
                this.rowTitle.forEach((v, i) => {
                    this.$set(this.code, i, v)
                    this.$root.$emit('setRowMoney', i)
                })
            },
            setRowMoney(rowId) {
                this.beforeCalcMoney()
                this.calcMoney(rowId)
            },
            getMethod() {
                return 'teshu'
            },
            getMethodMult(method, i, j, area) {
                return this.areaNumData[i][j][area]
            },
            calcMoney(rowId, method = 'teshu') {
                let money = 0
                if (this.code[rowId]) {
                    this.order[rowId] = {}
                    this.methodVal[rowId].forEach((v, i) => {
                        v && this.cityList[rowId].forEach(({key, cityId, issue}) => {
                            const methodName = this.methodName[i]
                            const area = this.VN_cityArea[cityId]
                            const nums = (this.areaNumData[rowId][i][area] || 0)
                            const calcMoney = (nums * v).strip()
                            this.order[rowId][`count${issue}`] = (this.order[rowId][`count${issue}`] || 0) + nums
                            this.order[rowId][`money${issue}`] = (this.order[rowId][`money${issue}`] || 0) + calcMoney
                            this.order[rowId][`${key}${i}`] = {
                                key,
                                nums,
                                issue,
                                money: calcMoney,
                                methodId: this.VN_methodData[method][methodName][cityId] || -1
                            }
                            money += calcMoney
                        })
                    })
                }
                money = money.strip()
                money && (this.rowStatus[rowId] = false)
                this.$set(this.rowMoney, rowId, money)
                this.setGameAreaSumMoney()
            },
            showTip(e, tipIndex) {
                const rect = e.target.getBoundingClientRect()
                const { right, top } = rect
                const scrollTop = +document.documentElement.scrollTop || +document.body.scrollTop
                this.tipLeft = `${right + 15}px`
                this.tipTop = +tipIndex === 0 ? `${top + scrollTop - 33}px` : `${top + scrollTop - 5}px`
                this.tipIsActive = true
                this.tipIndex = tipIndex
            }
        },
        computed: {
            setHeaderHeight () {
                return this.VN_subMenuIndex === 1 && this.isShowArea ? this.headerHeight[1] : this.headerHeight[2]
            },
            colWidth() {
                return this.lang === 'cn' ? this.defaultColWidth : this.langColWidth
            }
        }
    }
</script>
