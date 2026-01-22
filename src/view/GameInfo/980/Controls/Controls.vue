<script>
import Controls from '@C/Controls'
import DatePicker from '@E/packages/date-picker/index.js'
import { mapGetters, mapActions } from 'vuex'
import { today, returnState } from '@UTIL'
import throttle from '@UTIL/decorator/throttle'

export default {
    name: 'Controls',
    components: {
        [DatePicker.name]: DatePicker
    },
    mixins: [Controls],
    data() {
        // 狀態下拉選單的預設值
        // 預設[未開獎, 中獎, 未中獎]
        const statusDefalut = [0, 1, 2]
        return {
            // 投注期号
            issueName: 'bettingrc_011',
            routerName: 'GameInfo',
            // 今天 + 往前7天 + 往后6天 (越南 开奖日期)
            pickerOptionsOpen: {
                disabledDate(time) {
                    return ((time && time.valueOf() > Date.now()) || (time && time.valueOf() < Date.now() - 86400000 * 8)) &&
                           ((time && time.valueOf() > Date.now() + 86400000 * 6) || (time && time.valueOf() < Date.now() - 86400000))
                }
            },
            // 今天 + 往前29天 + 往后14天 (泰國 开奖日期)
            pickerOptionsOpen2: {
                disabledDate(time) {
                    return ((time && time.valueOf() > Date.now()) || (time && time.valueOf() < Date.now() - 86400000 * 30)) &&
                           ((time && time.valueOf() > Date.now() + 86400000 * 14) || (time && time.valueOf() < Date.now() - 86400000))
                }
            },
            // 今天 + 前7天 = 8天
            pickerOptionsOrder: {
                disabledDate(time) {
                    return (time && time.valueOf() > Date.now()) || (time && time.valueOf() < Date.now() - 86400000 * 8)
                }
            },
            // 今天 + 往前29天 = 30天 (泰國 投注时间、结算时间)
            pickerOptionsOrder2: {
                disabledDate(time) {
                    return (time && time.valueOf() > Date.now()) || (time && time.valueOf() < Date.now() - 86400000 * 30)
                }
            },
            // 全選重置用
            statusDefalut,
            statusArr: statusDefalut.slice()
        }
    },
    created() {
        // const hasSearchQuery = this.$route.params.search
        // console.log('hasSearchQuery', hasSearchQuery)
        // if (this.RWDMode === 3 && !hasSearchQuery) {
        //     this[_M.GET_GAME_INFO_LIST]()
        // }
    },
    beforeMount() {
        // 只能查兩天 今日+昨日
        if (this.isRich) {
            this.pickerOptionsOrder.disabledDate = (time) => (time && time.valueOf() > Date.now()) || (time && time.valueOf() < Date.now() - 86400000 * 2)
        }
    },
    mounted() {
        // 點進詳情再回來要紀錄上一次選的狀態
        this.statusArr = this.gameInfoData.status

        // 初次進入畫面時, 更正CorFilterMode & 980清空(為了清掉投注頁資料)
        this.RWDMode !== 3 && this[_M.CLEAR_GAME_INFO_DATA]()
        if (this.gameInfoData && this.gameInfoData.functionType) {
            this.resetCorFilterMode()
        }

        // 依據(投注頁底下更多按鈕)點進來的彩種類別變更預設狀態
        const localItem = (localStorage.getItem('lotteryType') || '').toLowerCase()
        if (localItem.includes('ft')) {
            this.updateMode('ft')
        } else if (localItem.includes('vn')) {
            this.updateMode('vn')
        } else if (localItem.includes('stock')) {
            this.updateMode('stock')
        } else if (localItem.includes('my')) {
            this.updateMode('my')
        } else if (localItem.includes('la')) {
            this.updateMode('la')
        }

        // 特殊特例: GPI hide sin
        if (this.isW88) {
            this.updateMode('vn')
            this.lotteryId = 212
        } else if (this.isGPI) {
            const key = this.lotteryMenu[3] ? 'vn' : 'cn'
            this.updateMode(key)
        } else if (this.isOneLotGame) {
            this.updateMode('vn')
        }
    },
    watch: {
        isOneLotGame() {
            this.isOneLotGame && this.updateMode('vn')
        },
        correctFilterMode() {
            this.lotteryId = ''
        },
        periodType(v) {
            if (v === 4) {
                switch (this.lotteryCountry) {
                    case 'vn':
                        this.saleDateArray = [this.getDataArray(8), this.getDataArray(-5)]
                        break
                    case 'th':
                        this.saleDateArray = [this.getDataArray(30), this.getDataArray(-13)]
                        break
                    case 'stock':
                    case 'my':
                    case 'la':
                        this.saleDateArray = [this.getDataArray(8), new Date()]
                        break
                }
            }
        }
    },
    props: ['lotteryCountry', 'changeLotteryCountry'],
    methods: {
        ...mapActions([
            _M.GET_GAME_INFO_LIST,
            _M.GET_GAME_INFO_ISSUE,
            _M.SET_GAME_INFO_DATA,
            _M.SET_GAME_INFO_PAGE_NATION_NUM,
            _M.CLEAR_GAME_INFO_DATA,
            'vnList'
        ]),
        change(params) {
            // const key = Object.keys(params)[0]
            // if (key === 'status') {
            //     this.changeAndSearch(params)
            //     return
            // }
            this[_M.SET_GAME_INFO_DATA]({ ...params, canPageNation: false })
        },
        async changeAndSearch(params) {
            await this[_M.SET_GAME_INFO_DATA]({...params, functionType: this.correctFilterMode.replace('offical', 'normal')})
            this[_M.GET_GAME_INFO_LIST]({ countryType: this.lotteryCountry })
            this.changeUrl()
        },
        updateMode(val) {
            this.changeLotteryCountry(val)
            this.controllerToggle = true
            // this.changeUrl({ countryType: val })
            this.resetCorFilterMode(val)
            this.cleanUrl()
            this.lotteryId = ''
            // 重置狀態下拉選單
            this.statusArr = [...this.statusDefalut]

            const param = ['vn', 'th', 'stock', 'my'].includes(val)
                ? { startDate: today(), endDate: today(), saleStartDate: '', saleEndDate: '', code: '', periodType: 1, startIssue: '', endIssue: '', status: this.statusDefalut.slice() }
                : { startDate: today(), endDate: today(), code: '', periodType: 1, startIssue: '', endIssue: '', status: this.statusDefalut.slice() }
            this.change(param)
            localStorage.removeItem('lotteryType')
        },
        isShow(key) {
            return this.getMenuIdArr.includes(key)
        },
        // 將correctFilterMode重置到預設選項(影響搜尋時functionType)
        resetCorFilterMode(contryCode = this.lotteryCountry) {
            const firstOption = {
                cn: 'normalChina',
                ft: 'ft',
                vn: 'all',
                th: 'th',
                stock: 'stock',
                bjl: 'bjl',
                la: 'la',
                my: 'my'
            }
            this.correctFilterMode = firstOption[contryCode] || 'normalChina'
            this[_M.SET_GAME_INFO_DATA]({ functionType: this.correctFilterMode })
        },
        selOne(selVal) {
            const selAllValue = 'allSel'
            if (selVal === selAllValue) {
                // 選到全選
                this.statusArr = this.statusArr.includes(selAllValue)
                    ? [...this.statusAllValue]
                    : []
            } else {
                // 選到其他狀態
                if (this.statusArr.includes(selAllValue)) {
                    // 以全選狀態下,點掉一個->取消全選
                    this.statusArr.splice(this.statusArr.indexOf(selAllValue), 1)
                } else if (this.statusArr.length === (this.statusAllValue.length - 1)) {
                    // 手動點滿全部->自動選全選
                    this.statusArr = [...this.statusAllValue]
                }
            }

            // 存進去store
            this.change({status: this.statusArr})
        },
        getDataArray(data) {
            return new Date((new Date() - (data - 1)) - 3600 * 1000 * 24 * (data - 1))
        }
    },
    subscriptions() {
        return {
            search$: this.$createObservableMethod('search')
                .throttleTime(1000)
                .do(async () => {
                    // 搜尋的時候強制關閉狀態下拉選單
                    this.$refs.statusSel.closeMenu()

                    if (this.statusArr.length === 0) {
                        this.statusArr = this.statusDefalut.slice()
                        this[_M.SET_GAME_INFO_DATA]({status: this.statusDefalut.slice()})
                    }

                    this[_M.SET_GAME_INFO_PAGE_NATION_NUM](1)
                    const data = await this[_M.GET_GAME_INFO_LIST]({
                        calSum: true,
                        functionType: this.lotteryCountry === 'ft'
                            ? 'ft'
                            : this.correctFilterMode.replace('offical', 'normal'),
                        countryType: this.lotteryCountry
                    })
                    if (data) {
                        this.changeUrl()
                        this.controllerToggle = false
                    }
                }),
            $directSearch: this.$createObservableMethod('directSearch')
                .throttleTime(1000)
                .do(async (lotteryId) => {
                    if (this.statusArr.length === 0) {
                        this.statusArr = this.statusDefalut.slice()
                        this[_M.SET_GAME_INFO_DATA]({status: this.statusDefalut.slice()})
                    }

                    this[_M.SET_GAME_INFO_PAGE_NATION_NUM](1)
                    const data2 = await this[_M.GET_GAME_INFO_VNLIST]({
                        calSum: true,
                        functionType: this.lotteryCountry === 'ft'
                            ? 'ft'
                            : this.correctFilterMode.replace('offical', 'normal'),
                        countryType: this.lotteryCountry,
                        lotteryId
                    })
                    return
                    if (data) {
                        this.changeUrl()
                        this.controllerToggle = false
                    }
                })
        }
    },
    computed: {
        ...mapGetters([
            'gameInfoData',
            'isOneLotGame',
            'isW88',
            'isRich',
            'RWDMode',
            'lotteryListChina',
            'lotteryListCnOfficial',
            'lotteryListCnSin',
            'lotteryListTable',
            'userType',
            'lotteryMenu',
            'getMenuIdArr'
        ]),
        statusArray() {
            const result = [
                {title: '全部状态', titleKey: 'bettingrc_013', stateValue: 'allSel'},
                {title: '未开奖', titleKey: 'bettingrc_014', stateValue: 0},
                {title: '中奖', titleKey: 'bettingrc_015', stateValue: 1},
                {title: '未中奖', titleKey: 'bettingrc_016', stateValue: 2},
                {title: '打和', titleKey: 'bettingrc_017', stateValue: 4},
                {title: '已取消', titleKey: 'bettingrc_018', stateValue: 3},
                {title: '已取消(A)', titleKey: `project_status_cancelled_type_a`, stateValue: 8},
                {title: '已取消(B)', titleKey: `project_status_cancelled_type_b`, stateValue: 9}
            ]

            // 越南/泰國/股市彩沒有打和
            return ['vn', 'th', 'stock', 'my', 'la'].includes(this.lotteryCountry)
                ? result.filter(item => item.stateValue !== 4)
                : result
        },
        // 全部的狀態選項value, 供全選按鈕用
        statusAllValue() {
            return this.statusArray.reduce((ansArr, next) => {
                ansArr.push(next.stateValue)
                return ansArr
            }, [])
        },
        // 全部的狀態選項value, 排除掉全選
        statusWithOutAll() {
            return this.statusAllValue.filter((val) => val !== 'allSel')
        },
        info() {
            return this.gameInfoData
        },
        filterLotteryList() {
            switch (this.correctFilterMode) {
                case 'offical':
                    return this.lotteryListCnOfficial
                case 'sin':
                    return this.lotteryListCnSin
                case 'table':
                    return this.lotteryListTable
                case 'all':
                default:
                    const includeMenuId = [1, 2, 4]
                    const data = {}

                    includeMenuId.forEach((mid) => {
                        const lottery = this.lotteryMenu[mid] || {}
                        for (let key in lottery.list) {
                            data[key] = lottery.list[key]
                        }
                    })
                    return data
            }
        },
        lotteryCityList() {
            return [
                // 百家樂
                { langKey: 'home_066', value: 'bjl', isActive: this.isBJL, isEnable: this.isShow('8') },
                // 越南彩
                { langKey: 'home_016', value: 'vn', isActive: this.isVN, isEnable: this.isShow('3') },
                // 泰国彩
                { langKey: 'lottery_name_242', value: 'th', isActive: this.isTH, isEnable: this.isShow('6') },
                // 股票彩
                { langKey: 'lottery_menu_31', value: 'stock', isActive: this.isStock, isEnable: this.isShow('7') },
                // 老挝彩
                { langKey: 'lottery_menu_type_9', value: 'la', isActive: this.isLA, isEnable: this.isShow('9') },
                // 马来西亚彩
                { langKey: 'home_045', value: 'my', isActive: this.isMY, isEnable: this.isShow('10') }
            ].filter((oneLot) => oneLot.isEnable)
        },
        isVN() {
            return this.lotteryCountry === 'vn'
        },
        isTH() {
            return this.lotteryCountry === 'th'
        },
        isStock() {
            return this.lotteryCountry === 'stock'
        },
        isBJL() {
            return this.lotteryCountry === 'bjl'
        },
        isMY() {
            return this.lotteryCountry === 'my'
        },
        isLA() {
            return this.lotteryCountry === 'la'
        },
        isGPI() {
            return this.userType === 'GPI'
        },
        // 越南彩全部彩種下拉選單
        areaList() {
            const temp = returnState(Object.entries((this.lotteryMenu[3] || {}).list || []))
            const result = []
            const resultObj = {}
            const vnFilter = ['VN_5M', 'VN_30S']
            let vnResult = {}
            temp.forEach(([name, obj]) => {
                obj.name = name
                if (vnFilter.includes(name)) {
                    // 高頻
                    if (vnResult.name) {
                        obj.childs.forEach((childs) => {
                            vnResult.childs.push(childs)
                        })
                    } else {
                        obj.title_key = 'vn_t_055'
                        vnResult = obj
                    }
                } else {
                    result.push(obj)
                }
            })
            vnResult.name && result.unshift(vnResult)
            result.forEach((item) => {
                resultObj[item.name] = item
            })
            return resultObj
        },
        // 彩種分類 下拉選單
        modeList() {
            return [
                { titleKey: 'bettingrc_002', titleValue: 'normalChina', isShow: true },
                { titleKey: 'bettingrc_003', titleValue: 'offical', isShow: !!this.lotteryMenu[1] },
                { titleKey: 'bettingrc_004', titleValue: 'sin', isShow: !!this.lotteryMenu[2] },
                { titleKey: 'home_050', titleValue: 'table', isShow: !!this.lotteryMenu[4] }
            ].filter(item => item.isShow)
        },
        // 泰國彩全部彩種下拉選單
        lotlistTH() {
            let result = []
            let groups = {}
            Object.values((this.lotteryMenu[6] || {}).list).forEach((oneGroup) => {
                oneGroup.childs.forEach((oneLot) => {
                    const {lottery, title_key} = oneLot
                    result.push({
                        lottery,
                        title_key
                    })
                })
            })

            // 目前只有一個群組
            groups['TH'] = {
                title_key: 'lottery_functionType_TH',
                childs: result
            }
            return groups
        },
        // 股市彩全部彩種下拉選單
        lotlistStock() {
            return (this.lotteryMenu[7] || {}).list
        },
        // 馬來彩全部彩種下拉選單
        lotlistMY() {
            return (this.lotteryMenu[10] || {}).list
        },
        // 老挝彩全部彩種下拉選單
        lotlistLA() {
            return (this.lotteryMenu[9] || {}).list
        }
    }
}
</script>
