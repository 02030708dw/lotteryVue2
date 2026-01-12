<style>
    @media screen and (max-width: 979px) {
        .el-select-dropdown {
            /* position: fixed !important; */
            z-index: 900 !important;
        }
    }
    .el-select-dropdown__item {
        /*IE9上玩法寬度修正*/
        min-width: 130px \9;
    }
    .el-select-dropdown__wrap {
        /*IE9 el scrollbar無法顯示*/
        overflow-y: hidden \9;
        width: 130px \9;
        scrollbar-base-color: #e6e6e6 \9;
        scrollbar-arrow-color: #e6e6e6 \9;
        border-color: #e6e6e6 \9;
    }
    .el-select-dropdown__wrap:hover {
        overflow-y: auto \9;
    }
    .el-scrollbar__thumb {
        display: none \9;
    }
</style>

<script>
// load all game method json....

import { mapGetters, mapActions } from 'vuex'
import { controlDate, b64DecodeUnicode, handleJson, b64EncodeUnicode, isIE, formatDateToString, returnState } from '@UTIL'
import OptionGroup from '@E/packages/option-group/index.js'

export default {
    data() {
        return {
            // 全部彩种
            games: 'bettingrc_008',
            // 全部玩法
            methods: 'bettingrc_009',
            className: 'small long',
            classNameStatus: 'small medium',
            // 信用玩法-玩法翻譯cache
            sinMethodTrans: {},
            // 彩種分類 下拉選單預設值
            correctFilterMode: 'all',
            keyObj: {
                '1D': 'thai_011',
                '2D': 'thai_010',
                '3D': 'thai_009'
            }
        }
    },
    components: {
        [OptionGroup.name]: OptionGroup
    },
    name: 'Controls',
    watch: {
        lotteryList2() {
            if (Object.keys(this.lotteryList2).length) {
                const search = this.$route.params.search
                if (search) {
                    try {
                        const code = b64DecodeUnicode(search)
                        const params = handleJson(code)
                        if (params) {
                            // 取彩種模式
                            this.changeLotteryCountry(params.countryType)
                            delete params.countryType
                            this.RWDMode === 3
                                ? this.changeAndSearch(params)
                                : this.changeAndSearch({...params, calSum: true})
                            const lotteryId = this.info.lotteryId
                            lotteryId && this[_M.GET_GAME_INFO_CONTROL](lotteryId)
                            return
                        }
                    } catch (err) {
                        console.log(err)
                    }
                }
            }
        }
    },
    methods: {
        ...mapActions([
            _M.GET_GAME_INFO_CONTROL,
            _M.SET_GAME_INFO_LIST
        ]),
        changeMethodId(methodId = null) {
            this.change({ methodId })
        },
        changeIssue(issue) {
            this.change({ issue })
        },
        clearable(target = 'issue') {
            this.change({ [target]: '' })
        },
        clearableCode() {
            this.change({ code: '' })
        },
        changeUrl(params = {}) {
            if (this.isShowDemo) {
                return
            }
            let search = {}
            Object.keys(this.info).forEach(key => {
                search[key] = this.info[key]
            })
            // 增加切換模式資料 countryType
            const { countryType } = params
            search.countryType = countryType || this.lotteryCountry
            const urlCode = b64EncodeUnicode(JSON.stringify(search))
            this.$router.replace(`/${this.routerName}/${urlCode}`)
        },
        cleanUrl() {
            this.$router.replace(`/${this.routerName}`)
        },
        tans(keyStr) {
            // 信用玩法用的
            if (keyStr.indexOf('@') > -1) {
                const tempKey = `${this.lang}@${keyStr}`
                if (!this.sinMethodTrans[tempKey]) {
                    this.sinMethodTrans[tempKey] = keyStr.split('@').map(key => this.$t(key)).join('-')
                }
                return this.sinMethodTrans[tempKey]
            }
            return keyStr
        },
        isVNLottery(lottery_id) {
            const VNLottery = this.lotteryMenu['3']
            const allLottery = Object.values(VNLottery.list).reduce((accumulator, currentValue, currentIndex, index) => {
                accumulator = accumulator.concat(currentValue.childs)
                return accumulator
            }, [])
            return allLottery.some(item => item.lottery === lottery_id)
        }
    },
    // GameClientKM : 20170621 Wed 10:54:52 初始化被計算 會 獲得的值
    computed: {
        ...mapGetters([
            'lotteryList',
            'lotteryList2',
            'gameInfoControl',
            'RWDMode',
            'isShowDemo',
            'serverTime',
            'lotteryMenu',
            'lang'
        ]),
        getDateObject() {
            return controlDate(7, this.today).map((date) => {
                date.label = this.$t(date.label)
                return date
            })
        },
        /** FIXME: 三連動 選單
        // 这两个选单会依据前面选择的彩种而定, 选择彩种前,这两个选单不可选(disable)
        // GameClientKM : 20170621 Wed 13:49:27
        // 這邊實作的方式 : ( 目前是取 gamePlayData )
        // 動態獲得資料 => 寫到 localStorage...然後檢查 hash 跟 server 端比對 => 不同則 觸發更新程序
        // TODO: 另外 還可加 socket-io 監聽 主動由 server 端 push 資料的變動 驅動 client 端的更新, 跟上面觸發原則只多了一次檢查, 然後一個是主動一個是被動
        // 這邊應該是要拉到 store 內的模組去獲得...然後存到 localStorage...
        */
        // 這邊是會"再次"觸發的 方法, 所以必須寫在這 , computed 是全部計算過後 再 "整個 VUE" 一次回傳的 所有變數計算過後的結果...無論任何 變數 scope
        // 所有玩法 GameClientKM : 20170622 Thu 14:30:32 label 增加的範例程式碼...for 連單選單
        getMethod() {
            const lotteryId = this.info.lotteryId
            if (!this.lotteryList2[lotteryId]) return []

            let subMethods = []
            const menuId = this.lotteryList2[lotteryId].menuId

            switch (true) {
                // 官方
                case +menuId === 1:
                    let index = 0
                    const $t = this.$t
                    const lotteryName = this.lotteryList2[lotteryId].name
                    const data = (this.gameInfoControl[menuId] || {})[lotteryId]

                    data && data.gameConfigData.gameMethods.forEach(key => key.childs
                        .forEach(item => item.childs
                            .forEach(({methodId, title, mode, title_key}) => {
                                methodId = +(methodId.split('-')[0])
                                //第一筆不需做判斷
                                //其他如果 methodId 跟上一筆沒重複則直接套入 第一層 title + 第三層 title
                                //會做第一層跟第三層會做疊字過濾，如果有疊字則直接顯示第三層 title
                                if (index === 0 || subMethods[index - 1].methodId !== methodId) {
                                    let [tansTitle, tansKeyTitle] = [$t(title_key), $t(key.title_key)]
                                    let showTitle = tansTitle.indexOf(tansKeyTitle) > -1 ? tansTitle : `${tansKeyTitle}-${tansTitle}`

                                    subMethods[index++] = {
                                        methodId,
                                        showTitle,
                                        title: tansTitle,
                                        parentTitle: $t(item.title_key)
                                    }
                                // 二星組成較特別需另外處理
                                // 多國語系時需再想辦法修改
                                } else if (mode === 'erxing') {
                                    const method = subMethods[index - 1]
                                    let { showTitle } = method
                                    subMethods[index - 1].showTitle = showTitle.replace('复式', '')
                                }
                            })
                        )
                    )
                    break
                // 越南, 桌面, 泰國, 股票
                case [3, 4, 8].includes(+menuId):
                    subMethods = returnState((this.gameInfoControl[menuId] || {})[lotteryId] || [])
                    subMethods = subMethods.map((item) => {
                        console.log(item)
                        item.showTitle = this.tans(item.showTitle)
                        return item
                    })
                    break
                //  越南, 桌面, 泰國, 股票
                case [6, 7, 9, 10].includes(+menuId):
                    subMethods = returnState((this.gameInfoControl[menuId] || {})[lotteryId] || [])
                    subMethods = subMethods.map((item) => {
                        item.showTitle = `${this.$t(this.keyObj[item.parent])} - ${this.$t([item.method_key])}`
                        return item
                    })
                    break
                default:
                    break
            }

            return subMethods
        },
        canSearchIssue() {
            return !this.info.startDate || !this.info.lotteryId
        },
        methodId: {
            set(methodId = null) {
                this.change({ methodId })
            },
            get() {
                return this.info.methodId
            }
        },
        lotteryId: {
            set(lotteryId = null) {
                // 同步觸發旁邊兩個方法 清除資料用 , 不確定這種作法在 VUE 的資料流方式下 是否正確, but it works fine..
                this.change({ lotteryId, methodId: null })
                if (!lotteryId) {
                    this.changeMethodId()
                    this.changeIssue()
                    var event = document.createEvent('HTMLEvents')
                    event.initEvent('click', true, false)
                    document.body.dispatchEvent(event)
                } else {
                    //reset methodId
                    this.methodId = null
                    this.changeIssue('')
                    this[_M.GET_GAME_INFO_CONTROL](lotteryId)
                }
            },
            get() {
                return this.info.lotteryId
            }
        },
        issue: {
            set(issue = null) {
                let format = ''
                this.$nextTick(() => {
                    format = issue.replace(/[^0-9-]/ig, '')
                    this.change({ issue: format })
                    // 強制更新頁面上的文字
                    this.$refs.issueInput.currentValue = format
                })
            },
            get() {
                return this.info.issue
            }
        },
        startIssue: {
            set(startIssue = null) {
                let format = ''
                this.$nextTick(() => {
                    format = startIssue.replace(/[^0-9-]/ig, '')
                    this.change({ startIssue: format })
                    // 強制更新頁面上的文字
                    this.$refs.startIssueInput.currentValue = format
                })
            },
            get() {
                return this.info.startIssue
            }
        },
        endIssue: {
            set(endIssue = null) {
                let format = ''
                this.$nextTick(() => {
                    format = endIssue.replace(/[^0-9-]/ig, '')
                    this.change({ endIssue: format })
                    // 強制更新頁面上的文字
                    this.$refs.endIssueInput.currentValue = format
                })
            },
            get() {
                return this.info.endIssue
            }
        },
        periodType: {
            set(periodType) {
                if (this.info.periodType !== periodType) {
                    this[_M.SET_GAME_INFO_LIST]({})
                    this.change({ periodType })
                }
            },
            get() {
                return this.info.periodType
            }
        },
        date: {
            set(startDate) {
                if (parseInt(startDate) === 2 || parseInt(startDate) === 3) {
                    this.change({ startDate: parseInt(startDate), endDate: this.today.format('YYYY-MM-DD') })
                    return
                }
                this.change({ startDate, endDate: startDate })
            },
            get() {
                return this.info.startDate
            }
        },
        startDate: {
            set(date) {
                this.change({ startDate: !date ? '' : formatDateToString(date) })
            },
            get() {
                return this.info.startDate
            }
        },
        endDate: {
            set(date) {
                this.change({ endDate: !date ? '' : formatDateToString(date) })
            },
            get() {
                return this.info.endDate
            }
        },
        saleDateArray: {
            set(date) {
                if (!date || (!date[0] && !date[1])) {
                    this.change({ saleStartDate: '', saleEndDate: '' })
                } else {
                    this.change({ saleStartDate: formatDateToString(date[0]), saleEndDate: formatDateToString(date[1]) })
                }
            },
            get() {
                if (!this.info.saleStartDate && !this.info.saleEndDate) return []
                return [new Date(this.info.saleStartDate), new Date(this.info.saleEndDate)]
            }
        },
        openDateArray: {
            set(date) {
                if (!date || (!date[0] && !date[1])) {
                    this.change({ startDate: '', endDate: '' })
                } else {
                    this.change({ startDate: formatDateToString(date[0]), endDate: formatDateToString(date[1]) })
                }
            },
            get() {
                if (!this.info.startDate && !this.info.endDate) return []
                return [new Date(this.info.startDate), new Date(this.info.endDate)]
            }
        },
        saleStartDate: {
            set(date) {
                this.change({ saleStartDate: !date ? '' : formatDateToString(date) })
            },
            get() {
                return this.info.saleStartDate
            }
        },
        saleEndDate: {
            set(date) {
                this.change({ saleEndDate: !date ? '' : formatDateToString(date) })
            },
            get() {
                return this.info.saleEndDate
            }
        },
        code: {
            set(val) {
                this.change({ code: val })
            },
            get() {
                return this.info.code
            }
        },
        status: {
            set(status = null) {
                this.change({ status })
            },
            get() {
                return this.info.status
            }
        },
        showIcon() {
            return this.showIconIssue
        },
        showIconIssue() {
            return this.issue ? 'circle-close' : null
        },
        showIconStartIssue() {
            return this.startIssue ? 'circle-close' : null
        },
        showIconEndIssue() {
            return this.endIssue ? 'circle-close' : null
        },
        showIconCode() {
            return this.code ? 'circle-close' : null
        },
        today() {
            return moment(this.serverTime)
        },
        isIE9() {
            return isIE() === 9
        }
    }
}
</script>
