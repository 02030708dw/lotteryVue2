<script>
    import { mapGetters, mapActions } from 'vuex'
    import { warnMessageBox, formatNumber } from '@UTIL'
    import CityTable from './VN/components/CityTable'
    import GrRow from './VN/components/GrRow'
    import RowHeader from './VN/components/RowHeader'
    import RowTitle from './VN/components/RowTitle'
    import GrCol from './VN/components/GrCol'
    import GrCom from './VN/components/GrCom'
    import GridPanel from './VN/components/GridPanel'
    import GridTooltip from './VN/components/GridTooltip'
    import Keyboard from './VN/components/Keyboard'
    import DateOfLottery from './VN/components/DateOfLottery'
    import AllCityBody from './VN/components/AllCityBody'
    import AllCityTitle from './VN/components/AllCityTitle'
    import Area from './VN/components/Area'
    import AreaTable from './VN/components/AreaTable'
    import GamePrompt from './VN/components/GamePrompt'
    import GameInfoIcon from './VN/components/GameInfoIcon'
    import blockedFilter from '@C/games/VN/helpers/blockedFilter'
    const defaultRowNum = 10
    const defaultKbInput = {
        id: '',
        getter: [],
        setter: () => null,
        el: '',
        selStart: 0
    }
    export default {
        name: 'GameVN',
        components: {
            CityTable,
            GrRow,
            RowTitle,
            RowHeader,
            GrCol,
            GrCom,
            GridPanel,
            GridTooltip,
            Keyboard,
            DateOfLottery,
            AllCityBody,
            AllCityTitle,
            Area,
            AreaTable,
            GamePrompt,
            GameInfoIcon
        },
        data() {
            const defaultMethodVal = ['', '', '', '', '']
            const defaultStatus = [0, 0, 0, 0, 0]
            const rowArr = [...Array(defaultRowNum)]
            const methodName = ['tou', 'wei', 'touwei', 'baozu', 'baozu7']
            const methodNameKey = [
                'vn_t_018', //头
                'vn_t_019', //尾
                'vn_t_020', //头尾
                'vn_t_021', //包组
                'vn_t_022' //包组7
            ]
            return {
                watchCount: 0,
                SStatus: rowArr.map(() => false),
                NStatus: rowArr.map(() => false),
                CStatus: rowArr.map(() => false),
                panelLeft: 0,
                panelTop: 0,
                panelFn: () => null,
                panelKey: '',
                order: {},
                // 預設玩法值
                defaultMethodVal,
                defaultStatus,
                rowStatus: rowArr.map(() => false),
                methodStatus: rowArr.map(() => [...defaultStatus]),
                // 玩法值
                methodVal: rowArr.map(() => [...defaultMethodVal]),
                // 所有玩法值
                methodValAll: [...defaultMethodVal],
                // 城市資料
                cityList: rowArr.map(() => []),
                // 金額
                rowMoney: rowArr.map(() => 0),
                // 導入 methodId 用
                methodName,
                // method Name key
                methodNameKey,
                statusClass: [
                    '',
                    'text_color_strong',
                    'is_strong'
                ],
                // keyboard
                kbInput: {...defaultKbInput},
                is_focusPosition: 0
            }
        },
        created() {
            this.$root.$on('insRow', this.insRow)
            this.$root.$on('beforeCheck', this.beforeCheck)
            this.$root.$on('setRowMoney', this.setRowMoney)
            this.$root.$on('filterOverIssueCity', this.filterOverIssueCity)
            this.$root.$on('reset', this.reset)
            // gameorder 回到預設
            this[_M.GAME_ORDER_VN_SUBMIT]({type: 5})
            this[_M.GAME_ORDER_VN_SUBMIT]({type: 8})
        },
        destroyed() {
            this[_M.SET_GAME_AREA_VN_MONEY](0)
            this.$root.$off('insRow', this.insRow)
            this.$root.$off('beforeCheck', this.beforeCheck)
            this.$root.$off('setRowMoney', this.setRowMoney)
            this.$root.$off('filterOverIssueCity', this.filterOverIssueCity)
            this.$root.$off('reset', this.reset)
        },
        watch: {
            $route() {
                this.$nextTick(() => {
                    this.$root.$emit('reset')
                    this[_M.GAME_ORDER_VN_SUBMIT]({type: 5})
                    this[_M.GAME_ORDER_VN_SUBMIT]({type: 8})
                })
            }
        },
        methods: {
            ...mapActions([
                _M.GAME_ORDER_VN_SUBMIT,
                _M.GAME_ORDER_VN_SUBMIT_BOX,
                _M.SET_GAME_AREA_VN_MONEY,
                _M.SET_POP_ACTIVE
            ]),
            insRow() {

            },
            beforeCalcMoney() {
                if (this.VN_isLocal && !this.cityList[0].length) {
                    this.cityList = this.cityList.map(() => [this.VN_localCity])
                }
            },
            reset(num = this.defaultRowNum) {
                const rowArr = [...Array(num)]
                this.kbInput = { ...defaultKbInput }
                this.rowNum = num
                this.order = {}
                this.methodVal = rowArr.map(() => [...this.defaultMethodVal])
                this.methodStatus = rowArr.map(() => [...this.defaultStatus])
                this.rowStatus = rowArr.map(() => false)
                this.methodValAll = [...this.defaultMethodVal]
                this.rowMoney = rowArr.map(() => 0)
                this.cityList = rowArr.map(() => [])
                this[_M.SET_GAME_AREA_VN_MONEY](0)
                this.handleReset()
            },
            beforeCheck({ fn = this[_M.GAME_ORDER_VN_SUBMIT_BOX], type = 1, fast = false, firstExecFn = false }, isFilter = false) {
                const isPass = this.checkLowAndLimitBonus()
                if (isPass) {
                    const { ltMoneyAmout, showList, orderRowNum } = this.calcSubmitOrder()
                    if (ltMoneyAmout) {
                        const isStop = showList.find(({methodId, issue}) => this.VN_nowStopId[methodId + (this.VN_localIssue || issue)])
                        const isBlocked = showList.find(({methodId, cityId}) => this.VN_nowblockedId[methodId] || this.VN_nowblockedId[cityId])
                        const fn2 = () => {
                            // this.methodStatus = [...Array(this.rowNum)].map(() => [...this.defaultStatus])
                            const { isCurrent } = this.checkOrder()
                            this[_M.GAME_ORDER_VN_SUBMIT]({
                                type,
                                ltMoneyAmout: ltMoneyAmout.strip(),
                                showList,
                                order: this.order,
                                orderRowNum,
                                isCurrent
                            })
                            fn()
                        }
                        if (firstExecFn) {
                            fn2()
                        }
                        if (!isFilter && type !== 3) {
                            if (isBlocked) {
                                return this.$root.$emit('blocked', { fn: fn2, fast, isFilter: true })
                            } else if (isStop) {
                                return this.$root.$emit('stopBet', { fn: fn2, fast, isFilter: true })
                            }
                        }
                        fn2()
                    } else {
                        if (isFilter) {
                            this.rowStatus = [...Array(this.rowNum)].map(() => false)
                            this[_M.GAME_ORDER_VN_SUBMIT]({ type, showList: [], ltMoneyAmout })
                            fn()
                        } else {
                            const { isCity, hasInfo } = this.checkOrder()
                            if (!isCity && hasInfo && this.VN_menuIndex) {
                                // 城市未勾选
                                this.$msg(warnMessageBox({ message: 'popup_131' }))
                            } else {
                                this.$msg(warnMessageBox({
                                    // 下注内容不完整
                                    message: 'popup_121',
                                    // 下注内容不完整，请重新检查。 : 城市未勾选
                                    content: 'popup_122'
                                }))
                            }
                        }
                    }
                } else {
                    // 超出限額才彈窗
                    isPass === false && this.$msg(warnMessageBox({
                        // 超过投注限额
                        message: 'popup_081',
                        // 您有部份投注金额已超过最高投注上限，系统将自动修改为最大可输入金额，请重新确认。
                        content: 'popup_120'
                    }))
                }
            },
            setMethodVal(i, j, v) {
                const setVal = val => this.$set(this.methodVal[i], j, val)
                setVal(v.replace(/\s/g, ''))
                this.$set(this.methodStatus[i], j, 0)
                this.$nextTick(() => {
                    if (isNaN(v)) {
                        setVal(v.replace(/\D/g, ''))
                    } else if (+v > 999999) {
                        setVal(999999)
                    }
                    this.$root.$emit('setRowMoney', i)
                })
            },
            handleMethodValBlur(i, j, v) {
                let v2 = v
                if (+v < this.VN_stake && v && +v !== 0) {
                    v2 = this.VN_stake
                } else if (v) {
                    // 無條件捨去到 this.VN_minUtil 位數
                    const rate = 10 ** this.VN_minUtil
                    v2 = (~~(+v * rate).strip()) / rate
                }
                if (v2 !== v) {
                    this.$set(this.methodVal[i], j, v2)
                    this.$root.$emit('setRowMoney', i)
                }
            },
            setMethodValAll(j, v) {
                const setVal = val => this.$set(this.methodValAll, j, val)
                setVal(v.replace(/\s/g, ''))
                this.$nextTick(() => {
                    if (isNaN(v)) {
                        setVal(v.replace(/\D/g, ''))
                    } else if (+v > 999999) {
                        setVal(999999)
                    }
                    this.methodVal.forEach((methodVal, i) => {
                        this.$set(methodVal, j, this.methodValAll[j])
                        this.$set(this.methodStatus[i], j, 0)
                        this.$root.$emit('setRowMoney', i)
                    })
                })
            },
            handleMethodValAllBlur(j, v) {
                let v2 = v
                if (+v < this.VN_stake && v && +v !== 0) {
                    v2 = this.VN_stake
                } else if (v) {
                    // 無條件捨去到 this.VN_minUtil 位數
                    const rate = 10 ** this.VN_minUtil
                    v2 = (~~(+v * rate).strip()) / rate
                }
                if (v2 !== v) {
                    this.$set(this.methodValAll, j, v2)
                    this.methodVal.forEach((methodVal, i) => {
                        this.$set(methodVal, j, v2)
                        this.$set(this.methodStatus[i], j, 0)
                        this.$root.$emit('setRowMoney', i)
                    })
                }
            },
            checkLowAndLimitBonus() {
                let isPass = true
                const minUtil = 10 ** this.VN_minUtil
                if (this.RWDMode === 1) {
                    this.methodVal.forEach((arr, i) => {
                        const code = this.code[i]
                        this.rowMoney[i] && arr.forEach((v, j) => {
                            const moneyLimit = this.getMoneyLimit(code, this.cityList[i])
                            const money = +v
                            if (money) {
                                // 低於最小值
                                // if (money < this.VN_stake) {
                                //     this.methodStatus[i][j] = 1
                                //     isPass = isPass ? 0 : isPass
                                // } else
                                // 超出最大值 需再調整
                                if (money > moneyLimit) {
                                    this.methodStatus[i][j] = 2
                                    this.methodVal[i][j] = ((~~(moneyLimit * minUtil).strip()) / minUtil)
                                    this.$root.$emit('setRowMoney', i)
                                    isPass = false
                                }
                            }
                        })
                    })
                } else {
                    isPass = this.check320LowAndLimitBonus()
                }
                return isPass
            },
            check320LowAndLimitBonus() {
                let isPass = true
                let temp = [...Array(5)]
                const minUtil = 10 ** this.VN_minUtil
                this.methodVal.forEach((method, k) => {
                    this.rowMoney[k] && method.forEach((v, j) => {
                        const moneyLimit = this.getMoneyLimit(this.code[k], this.cityList[k])
                        const money = +v
                        if (money && (!this.methodDisable || !this.methodDisable[k][j])) {
                            // 超出最大值
                            if (money > moneyLimit) {
                                const v2 = ((~~(moneyLimit * minUtil).strip()) / minUtil)
                                temp[j] = (temp[j] === undefined || temp[j] > v2)
                                    ? v2
                                    : temp[j]
                            }
                        }
                    })
                })
                temp.forEach((v, i) => {
                    if (v !== undefined) {
                        this.setMethodValAll(i, v + '')
                        this.$nextTick(() => this.$set(this.methodStatus[0], i, 2))
                        isPass = false
                    }
                })
                return isPass
            },
            getMoneyLimit(code, cityList) {
                const method = this.getMethod(code)
                if (this.VN_pos === 'all') {
                    const posArr = cityList.map(({pos}) => pos).unique()
                    const bonusLimit = Math.min.apply(this, posArr.map(pos => this.VN_limitBonus[pos] || 500000))
                    const jsPrize = Math.max.apply(this, posArr.map(pos => this.VN_jsPrize[pos][method]))
                    return bonusLimit / jsPrize
                } else {
                    const key = this.VN_isLocal || this.functionType
                    const bonusLimit = this.VN_limitBonus[key] || 500000
                    // const betMult = this.getMethodMult(method, i, j, area)
                    const jsPrize = this.VN_jsPrize[this.VN_pos][method]
                    // const bonus = betMult * jsPrize
                    return bonusLimit / jsPrize
                }
            },
            // 由號碼推得是2d, 3d or pl2...
            getMethod() {
                throw 'override this for each game'
            },
            //從config中取出對應注數
            // getMethodMult(method, i, j, area) {
            //     if (area === 'all') area = 'VN_N'
            //     return this.areaNumData[method][j][area]
            // },
            handleChk(area, bool) {
                const emit = area === 'all' ? 'setChkAll' : 'setChkArea'
                this.$root.$emit(emit, {area, bool})
            },
            mobileBlur() {
                return this.isMobile && document.activeElement.blur()
            },
            inputCheckKB() {
                const el = this.kbInput.el
                if (el) {
                    el.focus()
                    el.blur()
                }
            },
            focusKB(id, getter, setter, el) {
                // 如果不關閉鍵盤時(點選其他的input),把舊的blur & 新的focus
                if (this.kbInput.el && el !== this.kbInput.el) {
                    this.inputCheckKB()
                    el.focus()
                }

                this.kbInput = {
                    id,
                    getter,
                    setter,
                    el,
                    selStart: 0
                }
                this[_M.SET_POP_ACTIVE]({keyboard: true})

                const kbHeight = this.$refs.keyboard.$el.offsetHeight
                const focusPosition = el.offsetTop - kbHeight
                this.$el.style.paddingBottom = kbHeight + 'px'

                if (this.isMobile) {
                    document.documentElement.scrollTop = focusPosition
                } else {
                    document.body.scrollTop = focusPosition
                }
            },
            handleKB(key) {
                // 不處理的key
                switch (key) {
                    case '':
                        return
                    case 'esc':
                        this[_M.SET_POP_ACTIVE]({keyboard: false})
                        return
                }

                const {id, getter, setter, el} = this.kbInput
                // 處理二維inputbox
                const dimension2 = (id + '').split(',')
                let newWord = (dimension2.length > 1 ? getter[dimension2[0]][dimension2[1]] : getter[id]) + ''

                // 記錄光標位置
                const selStart = this.isMobile ? newWord.length : el.selectionStart
                this.kbInput.selStart = selStart

                // key值輸入處理
                const ans = newWord.substring(0, selStart) + key + newWord.substring(selStart)
                switch (key) {
                    case 'clean':
                        newWord = ''
                        break
                    case 'del':
                        newWord = newWord.length > 1 ? newWord.substr(0, newWord.length - 1) : ''
                        break
                    case '.':
                        if (ans.split('.').length > 2) {
                            return
                        }
                        newWord = ans
                        break
                    default:
                        newWord = ans
                        // 處理 '00', '0.01'
                        // newWord = (+newWord === 0 && newWord.indexOf('.') === -1) ? `${key}` : ans
                        break
                }
                return dimension2.length > 1 ? setter(dimension2[0], dimension2[1], newWord) : setter(id, newWord)
            },
            checkActive(idTest, nameTest) {
                const {id, setter} = this.kbInput
                return id === idTest && (setter.name || '') === nameTest
            },
            handleFocus(e, fn, key) {
                const rect = e.target.getBoundingClientRect()
                const { left, bottom } = rect
                const scrollTop = +document.documentElement.scrollTop || +document.body.scrollTop
                this.panelLeft = `${left + 62}px`
                this.panelTop = `${bottom + scrollTop - 5}px`
                this.panelFn = fn
                this.panelKey = key
                this[_M.SET_POP_ACTIVE]({InputFocus: true})
            },
            handlePanel(v) {
                const index = this.panelKey.split('.')
                this.panelFn(...index, v)
            },
            setMethodValPanel(i, j, v) {
                v = v ? (+this.methodVal[i][j] + v).strip() : ''
                v = v > 999999 ? 999999 : v
                this.$set(this.methodVal[i], j, v)
                this.$root.$emit('setRowMoney', i)
            },
            setMethodValAllPanel(j, v) {
                v = v ? (+this.methodValAll[j] + v).strip() : ''
                v = v > 999999 ? 999999 : v
                this.$set(this.methodValAll, j, v)
                this.methodVal.forEach((methodVal, i) => {
                    this.$set(methodVal, j, v)
                    this.$set(this.methodStatus[i], j, 0)
                    this.$root.$emit('setRowMoney', i)
                })
            },
            luckyCodeMessageBox(beforeConfirm) {
                this.$msg(warnMessageBox({
                    // '幸运号码将取代您的号码'
                    message: 'popup_118',
                    // // '幸运号码将覆盖您原有的号码，请确认是否取代。'
                    // content: 'popup_119',
                    // '取消'
                    cancelText: 'popup_013',
                    isShowCancelBtn: true,
                    beforeConfirm
                }))
            },
            getIssueCityList() {
                return [...Array(this.rowNum)]
                    .map((v, i) => {
                        let obj = {}
                        this.cityList[i].forEach((city) => {
                            if (obj[city.issue]) {
                                obj[city.issue].push(city)
                            } else {
                                obj[city.issue] = [city]
                            }
                        })
                        return obj
                    })
            },
            setGameAreaSumMoney() {
                const money = this.rowMoney.reduce((a, b) => a + b)
                this[_M.SET_GAME_AREA_VN_MONEY](money.strip())
            },
            /** 檢查是否選號完整及是否列表顯示紅底 */
            checkOrder() {
                let isCurrent = false
                const isCity = this.cityList[0].length
                let hasInfo = 0
                this.code.forEach((v, i) => {
                    const vAndVal = v || this.methodVal[i].find(v2 => v2)
                    const bool = !!(
                        (vAndVal || (this.cityList[i].length && !this.VN_menuIndex)) &&
                        !this.rowMoney[i]
                    )
                    this.rowStatus[i] = bool
                    isCurrent = isCurrent || bool
                    vAndVal && hasInfo++
                })
                return {isCurrent, isCity, hasInfo}
            },
            filterOverIssueCity() {
                if (!this.VN_isLocal) {
                    let arr = []
                    this.cityList.forEach((cityList, rowId) => {
                        this.cityList[rowId] = cityList.filter(({issue, pos, key}) => {
                            const bool = issue.replace('-', '') >= this.issueAreaDate[pos]
                            !bool && arr.push({pos, key})
                            return bool
                        })
                        this.$root.$emit('setRowMoney', rowId)
                    })
                    arr.length && this.$root.$emit('removeChkKey', arr)
                    this.beforeCheck({
                        fn: () => this[_M.GAME_ORDER_VN_SUBMIT]({
                            type: 6,
                            issueAreaDate: this.issueAreaDate
                        })
                    }, true)
                }
            },
            checkIsBlocked(area) {
                return blockedFilter.checkIsBlocked(area, this)
            }
        },
        computed: {
            ...mapGetters([
                'VN_menuIndex',
                'VN_subMenuIndex',
                'getPopActive',
                'VN_gameMenuSub',
                'VN_lotteryId',
                'VN_isLocal',
                'lotteryList2',
                'VN_gameOrder',
                'VN_gameConfig',
                'VN_methodData',
                'VN_cityArea',
                'VN_pos',
                'VN_area',
                'VN_limitBonus',
                'VN_jsPrize',
                'VN_stake',
                'VN_minUtil',
                'VN_isOpenIssue',
                'VN_Issue',
                'VN_allAreaIssue',
                'VN_currentArea',
                'VN_nowAreaCity',
                'VN_localIssue',
                'RWDMode',
                'lang',
                'VN_localCity',
                'lotteryOfficialVN',
                'isMobile',
                'VN_nowStopData',
                'VN_nowStopId',
                'VN_nowblockedId'
            ]),
            functionType() {
                return this.VN_isLocal
                    ? this.lotteryList2[this.VN_isLocal].name
                    : Object.keys(this.lotteryOfficialVN)[0]
            },
            isPopActive() {
                return this.getPopActive.InputFocus
            },
            // isKeyboardOn() {
            //     return this.getPopActive.keyboard
            // },
            isShowArea() {
                return this.VN_area && !this.VN_menuIndex
            },
            isShowAreaTable() {
                return this.VN_area && this.VN_menuIndex
            },
            colWidthIndex() {
                return this.isShowArea ? 1 : 2
            },
            issueAreaDate() {
                let obj = {}
                Object.entries(this.VN_Issue).forEach(([key, val]) => {
                    obj[key] = val ? val.replace('-', '') : 0
                })
                return obj
            },
            titleChk() {
                const S = this.SStatus.filter(b => b).length === this.rowNum || this.checkIsBlocked('VN_S')
                const C = this.CStatus.filter(b => b).length === this.rowNum || this.checkIsBlocked('VN_C')
                const N = this.NStatus.filter(b => b).length === this.rowNum || this.checkIsBlocked('VN_N')
                let {VN_S, VN_C, VN_N} = this.VN_nowAreaCity || {}
                if (this.VN_nowAreaCity) {
                    VN_S = S && VN_S
                    VN_C = C && VN_C
                    VN_N = N && VN_N
                }
                return {
                    all: S && C && N,
                    VN_S,
                    VN_C,
                    VN_N
                }
            }
        }
    }
</script>
