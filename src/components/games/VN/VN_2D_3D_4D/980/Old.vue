<template>
  <div class="gr_container bg_primary u_p--r10 u_p--l10">
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
        <!-- 号码 -->
        <GrCol :style="{width: colWidth[1][colWidthIndex]}">
          <RowHeader :style="{height: setHeaderHeight, 'line-height': setHeaderHeight}">
            <GrCom>{{$t('common_063')}}</GrCom>
          </RowHeader>
          <RowTitle>
            <GrCom>
              <span @click="luckyCode" class="gr_component--number__button">
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
            <GrCom>{{$t('popup_009')}} ({{$t('vn_t_053')}} {{VN_stake}})</GrCom>
          </RowHeader>
          <RowTitle>
            <GrCom v-for="(title, i) in methodTitle[VN_menuIndex]" :key="title">
              <span class="gr_title__text">{{$t(title)}}</span>
              <div class="gr_title__input c_input--short">
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
        <!-- 总额 -->
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
        v-for="(i, j) in rowNum"
        :key="`r${j}`"
      >
        <!-- 号码 -->
        <GrCol :style="{width: colWidth[1][colWidthIndex]}">
          <GrRow>
            <GrCom class="gr_component--number">{{i}}</GrCom>
            <GrCom>
              <div :class="isShowArea ? 'c_input--shortest' : 'c_input--short'">
                <input
                  class="c_input__inner"
                  type="tel"
                  @input="setCode(j, $event.target.value)"
                  :value="code[j]"
                />
              </div>
            </GrCom>
          </GrRow>
        </GrCol>
        <!-- 投注金额 -->
        <GrCol :style="{width: colWidth[2][colWidthIndex]}">
          <GrRow>
            <GrCom v-for="(k, l) in methodTitle[VN_menuIndex]" :key="k + VN_menuIndex">
              <div class="c_input--short" :class="statusClass[methodStatus[j][l]]">
                <input
                  :disabled="methodDisable[j][l]"
                  :value="methodVal[j][l]"
                  @input="setMethodVal(j, l, $event.target.value)"
                  @focus="handleFocus($event, setMethodValPanel, `${j}.${l}`)"
                  @blur="handleMethodValBlur(j, l, $event.target.value)"
                  @click.stop
                  class="c_input__inner"
                  type="tel"
                />
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
//2D3D4D
import GameVN from '@C/games/GameVN'
import { warnMessageBox } from '@UTIL'
import areaNumData from '@S/modules/GamePlayerVN/config/2d3d4d'
const defaultRowNum = 10
export default {
    name: 'VN_2D_3D_4D_980_OLD',
    mixins: [GameVN],
    data() {
    // ['头', '尾', '头尾', '包组', '包組7']
        const t1 = ['vn_t_018', 'vn_t_019', 'vn_t_020', 'vn_t_021', 'vn_t_022']
        const t2 = t1.filter((t, i) => i !== 4)
        const defaultDisable = [false, false, false, false, false]
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
            methodTitle: [t2, t1, t1, t2],
            // 預設玩法狀態
            defaultDisable,
            // 玩法狀態
            methodDisable: rowArr.map(() => [...defaultDisable]),
            // 預設幾行
            rowNum: defaultRowNum,
            defaultRowNum,
            defaultstatus: [0, 0, 0, 0],
            // 各區域注單
            areaNumData,
            methodKey: {
                '2': '2D',
                '3': '3D',
                '4': '4D'
            },
            sortKey: {
                '2D': 2,
                '3D': 3,
                '4D': 4
            }
        }
    },
    methods: {
        handleReset(num = this.defaultRowNum) {
            const rowArr = [...Array(num)]
            this.code = rowArr.map(() => '')
            this.methodDisable = rowArr.map(() => [...this.defaultDisable])
        },
        calcSubmitOrder() {
            let showList = []
            let ltMoneyAmout = 0
            let orderRowNum = 0
            const issueCityList = this.getIssueCityList()
            this.rowMoney.forEach((money, i) => {
                ltMoneyAmout += money
                if (money) {
                    orderRowNum++
                    const codes = this.code[i]
                    const method_key = this.methodKey[codes.length]
                    Object.keys(issueCityList[i]).forEach((issue) => {
                        const cityList = issueCityList[i][issue]
                        cityList.forEach(({ cityId, key }) => {
                            this.methodVal[i].forEach((onePrice, j) => {
                                if (!(isNaN(onePrice) || !+onePrice || this.methodDisable[i][j])) {
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
                    })
                }
            })
            showList = showList.sort(
                (a, b) =>
                    this.sortKey[a.method_key] -
          this.sortKey[b.method_key] +
          a.date -
          b.date
            )
            return { showList, ltMoneyAmout, orderRowNum }
        },
        setCode(i, v) {
            this.$set(this.code, i, v.replace(/\s/g, ''))
            this.$nextTick(() => {
                if (isNaN(v) || /[.+-]/g.test(v)) {
                    this.$set(this.code, i, v.replace(/[\D.+-]/g, ''))
                } else if (v.length > 4) {
                    this.$set(this.code, i, v.substr(0, 4))
                }
                //設定 disabled
                const bool = this.code[i].length > 3;
                [0, 2, 4].forEach((index) =>
                    this.$set(this.methodDisable[i], index, bool)
                )
                this.$root.$emit('setRowMoney', i)
            })
        },
        // setMethodValAll(j, v) {
        //     const setVal = val => this.$set(this.methodValAll, j, val)
        //     setVal(v.replace(/\s/g, ''))
        //     this.$nextTick(() => {
        //         if (isNaN(v)) {
        //             setVal(v.replace(/\D/g, ''))
        //         } else if (+v > 999999) {
        //             setVal(999999)
        //         }
        //         this.methodVal.forEach((methodVal, i) => {
        //             if (!this.methodDisable[i][j]) {
        //                 this.$set(this.methodVal[i], j, this.methodValAll[j])
        //                 this.$set(this.methodStatus[i], j, 0)
        //                 this.$root.$emit('setRowMoney', i)
        //             }
        //         })
        //     })
        // },
        setMethodValAllPanel(j, v) {
            v = v ? (+this.methodValAll[j] + v).strip() : ''
            v = v > 999999 ? 999999 : v
            this.$set(this.methodValAll, j, v)
            this.methodVal.forEach((methodVal, i) => {
                if (!this.methodDisable[i][j]) {
                    this.$set(methodVal, j, v)
                    this.$set(this.methodStatus[i], j, 0)
                    this.$root.$emit('setRowMoney', i)
                }
            })
        },
        // handleMethodValAllBlur(j, v) {
        //     let v2 = v
        //     if (+v < this.VN_stake && v && +v !== 0) {
        //         v2 = this.VN_stake
        //     } else if (v) {
        //         v2 = (+(+v).toFixed(this.VN_minUtil)).strip()
        //     }
        //     if (v2 !== v) {
        //         this.$set(this.methodValAll, j, v2)
        //         this.methodVal.forEach((methodVal, i) => {
        //             if (!this.methodDisable[i][j]) {
        //                 this.$set(this.methodVal[i], j, this.methodValAll[j])
        //                 this.$set(this.methodStatus[i], j, 0)
        //                 this.$root.$emit('setRowMoney', i)
        //             }
        //         })
        //     }
        // },
        insRow(num) {
            const sum = this.rowNum + num
            if (sum > 20) {
                return this.$msg(
                    warnMessageBox({
                        // '最多只能增加20组号码'
                        message: this.$t('popup_106', { '0': 20 })
                    })
                )
            }
            const rowArr = [...Array(num)]
            const insArr = rowArr.map(() => '')
            const insmethodDisable = rowArr.map(() => [...this.defaultDisable])
            const insmethodStatus = rowArr.map(() => [...this.defaultstatus])
            const insMethodVal = rowArr.map(() => [...this.defaultMethodVal])
            const insRowMoney = rowArr.map(() => 0)
            const cityList = this.VN_menuIndex ? [...this.cityList[0]] : []
            const insCityList = rowArr.map(() => cityList)
            this.code = [...this.code, ...insArr]
            this.methodDisable = [...this.methodDisable, ...insmethodDisable]
            this.methodStatus = [...this.methodStatus, ...insmethodStatus]
            this.methodVal = [...this.methodVal, ...insMethodVal]
            this.rowMoney = [...this.rowMoney, ...insRowMoney]
            this.cityList = [...this.cityList, ...insCityList]
            this.$set(this, 'rowNum', this.rowNum + num)
        },
        setRowMoney(rowId) {
            this.beforeCalcMoney(rowId, true)
            const codeLen = this.code[rowId].length
            switch (codeLen) {
                case 2:
                    this.calcMoney(rowId, '2d')
                    break
                case 3:
                    this.calcMoney(rowId, '3d')
                    break
                case 4:
                    this.calcMoney(rowId, '4d')
                    break
                default:
                    this.rowMoney[rowId] = 0
                    this.setGameAreaSumMoney()
            }
        },
        calcMoney(rowId, method) {
            let money = 0
            this.order[rowId] = {}
            this.methodVal[rowId].forEach((v, i) => {
                if (v) {
                    const check4d = method === '4d' && [0, 2, 4].includes(i)
                    !check4d &&
            this.cityList[rowId].forEach(({ key, cityId, issue }) => {
                const methodName = this.methodName[i]
                const area = this.VN_cityArea[cityId]
                const nums = this.areaNumData[method][i][area] || 0
                const calcMoney = (nums * v).strip()
                this.order[rowId][`count${issue}`] =
                (this.order[rowId][`count${issue}`] || 0) + nums
                this.order[rowId][`money${issue}`] =
                (this.order[rowId][`money${issue}`] || 0) + calcMoney
                this.order[rowId][`${key}${i}`] = {
                    key,
                    nums,
                    issue,
                    money: calcMoney,
                    methodId: this.VN_methodData[method][methodName][cityId] || -1
                }
                money += calcMoney
            })
                }
            })
            money = money.strip()
            money && (this.rowStatus[rowId] = false)
            this.$set(this.rowMoney, rowId, money)
            this.setGameAreaSumMoney()
        },
        getMethod(code) {
            return code.length + 'd'
        },
        luckyCode() {
            const hascode = this.code.find((v) => v)
            hascode ? this.luckyCodeMessageBox(this.randomCode) : this.randomCode()
        },
        randomCode() {
            const codeCate = [2, 3, 4]
            this.code.forEach((v, i) => {
                const randomIndex = Math.randomNum(3) % 3
                const code = [...Array(codeCate[randomIndex])]
                    .map(() => Math.randomNum(10) % 10)
                    .join('')
                this.setCode(i, code)
            })
        }
    },
    computed: {
        setHeaderHeight() {
            return this.VN_subMenuIndex === 1 && this.isShowArea
                ? this.headerHeight[1]
                : this.headerHeight[2]
        },
        colWidth() {
            return this.lang === 'cn' ? this.defaultColWidth : this.langColWidth
        }
    }
}
</script>
