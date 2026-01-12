<template>
    <div class="gr_container  bg_primary">
        <div class="gr_official">
            <checkBar
                v-if="is2Timer"
                :activeCheckboxes="activeCheckboxes"
                :selectCheckbox='selectCheckbox'
                :ableCheckbox="ableCheckbox"
            />
            <div class="gr_official__section  u_clearfix" v-for="(item, index) in config.rowTitle" :key="index">
                <!-- 位數標題(ex:萬位) -->
                <div class="gr_section__title">{{$t(item)}}</div>
                <div class="gr_section__body">
                    <!-- ball -->
                    <ul class="gr_body__group">
                        <li class="gr_group__item" v-for="(ballText, ballIndex) in config.balls" :key="ballIndex">
                            <div class="gr_item__ball" :class="isBallActive(index, ballIndex)" @click="selectBall(index, ballIndex)">
                                <span class="gr_ball__inner">{{ballText}}</span>
                            </div>
                        </li>
                    </ul>
                </div><!-- gr_section__body -->
                <div class="gr_section__controller">
                    <ul class="gr_controller__group">
                        <li class="gr_group__item" @click="selectAllBall(index)" :class="optionsClass(index, 0)">
							<!-- {{$t("全")}} -->
                            <span class="gr_item__text">{{$t('common_019')}}</span>
                        </li>
                        <li class="gr_group__item" @click="selectBigBall(index)" :class="optionsClass(index, 1)">
                            <!-- {{$t("大")}} -->
                            <span class="gr_item__text">{{$t('common_020')}}</span>
                        </li>
                        <li class="gr_group__item" @click="selectSmallBall(index)" :class="optionsClass(index, 2)">
                            <!-- {{$t("小")}} -->
                            <span class="gr_item__text">{{$t('common_021')}}</span>
                        </li>
                        <li class="gr_group__item" @click="selectOddBall(index)" :class="optionsClass(index, 3)">
                            <!-- {{$t("奇")}} -->
                            <span class="gr_item__text">{{$t('common_022')}}</span>
                        </li>
                        <li class="gr_group__item" @click="selectEvenBall(index)" :class="optionsClass(index, 4)">
                            <!-- {{$t("偶")}} -->
                            <span class="gr_item__text">{{$t('common_023')}}</span>
                        </li>
                        <li class="gr_group__item" @click="selectClearAllBall(index)">
							<!-- {{$t("清")}} -->
                            <span class="gr_item__text">{{$t('common_031')}}</span>
                        </li>
                    </ul>
                </div><!-- gr_section__controller -->
            </div><!-- gr_official__section -->
        </div><!-- gr_official -->
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex'
    import { warnMessageBox, formatNumber } from '@UTIL'
    import checkBar from './STOCK/components/checkBar'

    export default {
        name: 'GameBalls',
        components: {
            checkBar
        },
        beforeMount() {
            const data = {
                x: this.config.rowTitle,
                y: this.config.balls,
                // digitstr: 固定送空值, 官彩任選使用
                digitstr: '',
                // type: 球版,單式
                type: 'digital'
            }
            // 把預設的一注'兩'元覆蓋掉, 待投注金額修改時去變動 onePrice
            if (+this.gameOrder.onePrice === 2 || !this.gameOrder.onePrice) {
                data.onePrice = +this.onePrice
            }
            this[_M.SET_INIT_BALLS_DATA](data)
            this[_M.SET_GAME_ORDER_DATA]({mode: 1})
            this.$root.$on('updateBonus', this.updateBonus)
            this.$root.$on('beforeCheck', this.beforeCheck)
            this.$root.$on('beforeRandomLotterys', this.beforeRandomLotterys)
            // 320 機選
            this.$root.$on('setRandonBall320', this.setRandonBall320)

            // 預設勾選可投注獎期
            this.setCheckBox()
        },
        beforeDestroy() {
            this.$root.$off('updateBonus', this.updateBonus)
            this.$root.$off('beforeCheck', this.beforeCheck)
            this.$root.$off('beforeRandomLotterys', this.beforeRandomLotterys)
            this.$root.$off('setRandonBall320', this.setRandonBall320)

            // 離開時清空
            this[_M.SET_BALLS_COMBINE]()
            this[_M.SET_PROJECT_TEMP]()
        },
        data() {
            return {
                factorialCache: {},
                keyObj: {
                    '1D': 'thai_011',
                    '2D': 'thai_010',
                    '3D': 'thai_009'
                }
            }
        },
        watch: {
            // 獎期變動時, 更新時段勾選
            currentjsDynamicData() {
                this.setCheckBox()
            }
        },
        computed: {
            ...mapGetters([
                'config',
                'game',
                'onePrice',
                'gameBallData',
                'gameOrder',
                'gameSubmit',
                'get2Timer',
                'gameLotteryId',
                // '最大獎金'
                'bonusLimit',
                // 獎金組資料 floatPrize.jsPrizePoint
                'jsPrizePoint',
                // 獎金組資料 API: floatPrize
                'floatPrize',
                // 前台顯示用keepPoint
                'kp',
                // 獎期資料
                'currentjsDynamicData',
                // 投注箱
                'gameLtProject'
            ]),
            // 取得 有勾選 的checkbox
            activeCheckboxes() {
                return this.gameOrder.activeCheckboxes || {}
            },
            // 取得checkbox該開啟或關閉
            ableCheckbox() {
                // 無獎期
                let ans = [false, false]

                if (this.currentjsDynamicData.number) {
                    if (this.currentjsDynamicData.issue.length > 0) {
                        // 雙獎期
                        return [true, true]
                    }
                    // 單獎期
                    let issue = {
                        '001': false,
                        '002': false
                    }

                    issue[this.currentjsDynamicData.number.split('-')[1]] = true
                    return Object.values(issue)
                }
                return ans
            },
            is2Timer() {
                return this.get2Timer.includes(+this.gameLotteryId)
            },
            // 多獎金資料判斷目前顯示哪筆獎金組
            hprizeIndex() {
                const { hprizeIndex } = this.config || {}
                return hprizeIndex ? this.prizeIndex : 0
            },
            // 計算投注最大倍數限制
            betMultiLimit() {
                return ~~(this.bonusLimit / this.calcHprize(this.hprizeIndex)).strip()
            },
            // 盈利
            bonus() {
                return (this.calcBonusVal.bonus || 0).strip()
            },
            // 理論可贏獎金
            hprize() {
                return this.calcHprize(this.hprizeIndex)
            },
            // 理論可贏獎金
            hprizes() {
                return this.calcBonusVal.hprizes || [0]
            },
            // 賠率
            shprizes() {
                return this.calcBonusVal.shprizes || [0]
            },
            // 計算盈利, 取得bonus/hprizes/shprizes
            calcBonusVal() {
                return this.gameOrder.nums ? this.calcBonus() : {}
            },
            // 多獎金-所有獎金名稱 (ex: 總大小->取得[總大,總小])
            hprizeKey() {
                return Object.keys(this.jsPrizePoint[this.gameOrder.methodId])
            },
            // 多獎金-理論可得獎金陣列
            hprizeString() {
                return this.hprizeKey.map((key) => this.calcHprize(key)).join(',')
            },
            // 多獎金-賠率陣列
            hprizeSourceArr() {
                return this.hprizeKey.map((key) => this.getHprize(key).hprize)
            },
            // 取得當前玩法標題
            getGameNameKey() {
                return this.gameMenuSub[this.gameIndex].title_key
            }
        },
        methods: {
            ...mapActions([
                _M.SET_INIT_BALLS_DATA,
                // 選球
                _M.SELECT_ALL_BALL,
                _M.SELECT_BIG_BALL,
                _M.SELECT_SMALL_BALL,
                _M.SELECT_ODD_BALL,
                _M.SELECT_EVEN_BALL,
                _M.SELECT_CLEAR_ALL_BALL,
                _M.SELECT_BALL,
                // -----------------------
                _M.TOGGLE_CHECKBOX,
                _M.SET_GAME_ORDER_DATA,
                _M.SET_GAME_LT_PROJECT,
                _M.SET_BALLS_COMBINE,
                _M.SET_PROJECT_TEMP,
                _M.SET_RANDOM_LOTTERYS_MUTI,
                _M.REMOVE_SUBMIT_ORDER_INDEX
            ]),
            // 快選按鈕是否被點選
            optionsClass(index, option) {
                return this.game.ballControlData[index][option] ? 'is_active' : ''
            },
            // 彩票球是否被點選
            isBallActive(x, y) {
                return this.gameBallData[x][y] ? 'is_active' : ''
            },
            selectAllBall(index) {
                this[_M.SELECT_ALL_BALL](index)
                this.setBallData()
            },
            selectBigBall(index) {
                this[_M.SELECT_BIG_BALL](index)
                this.setBallData()
            },
            selectSmallBall(index) {
                this[_M.SELECT_SMALL_BALL](index)
                this.setBallData()
            },
            selectOddBall(index) {
                this[_M.SELECT_ODD_BALL](index)
                this.setBallData()
            },
            selectEvenBall(index) {
                this[_M.SELECT_EVEN_BALL](index)
                this.setBallData()
            },
            selectClearAllBall(index) {
                this[_M.SELECT_CLEAR_ALL_BALL](index)
                this.setBallData()
            },
            selectBall(x, y) {
                this[_M.SELECT_BALL]({x, y})
                this.setBallData()
            },
            // 點選 上下/下午 checkbox
            selectCheckbox(x, y) {
                this[_M.TOGGLE_CHECKBOX]({x, y})
                this.setBallData()
            },
            // 彩票球點選後動作
            setBallData() {
                const result = this.checkBallData()
                const { nums, original } = result
                if (!nums && nums !== 0) {
                    this[_M.SET_GAME_ORDER_DATA]({ nums: 0 })
                    return
                }

                // 拆單
                const ballOrderArr = this.getSplitOrder(original)
                this[_M.SET_BALLS_COMBINE](ballOrderArr)
                this[_M.SET_GAME_ORDER_DATA]({
                    nums,
                    hprize: +this.hprize
                })
                // this.updateBonus()
            },
            // 計算注數與取得投注球標題
            checkBallData(data = this.gameBallData) {
                let original = []
                //总注数
                let nums = 1

                //检测球是否完整
                for (let i = 0; i < data.length; i++) {
                    let row = data[i]
                    let rowNum = 0
                    let isEmptySelect = true
                    original[i] = []
                    for (let j = 0; j < row.length; j++) {
                        if (row[j]) {
                            isEmptySelect = false
                            original[i].push(this.config.balls[j])
                            rowNum++
                        }
                    }
                    if (isEmptySelect) {
                        return false
                    }
                    //计算注数
                    nums *= rowNum
                }

                //组合结果
                return {nums, original}
            },
            // 更新盈利
            updateBonus() {
                this[_M.SET_GAME_ORDER_DATA]({
                    // bonus: this.bonus,
                    // betMultiLimit: this.betMultiLimit,
                    // hprizes: this.hprizes,
                    // shprizes: this.shprizes,
                    hprize: this.hprize,
                    // shprize: this.hprizeSourceArr
                    times: 1 // 為了不觸發重算金額
                })
            },
            /**
             * 計算理論可贏獎金(未扣投注金額)
             * @param index 多獎金 config.hprizeIndex
             */
            calcHprize(index) {
                try {
                    const { hprize, autoOdds } = this.getHprize(index)
                    return (+hprize + autoOdds).strip()
                } catch (error) {
                    console.warn(error)
                    return ''
                }
            },
            /**
             * 取得獎金組資料
             * @param index 多獎金 config.hprizeIndex
             */
            getHprize(index) {
                return this.jsPrizePoint[this.gameOrder.methodId][index]
            },
            /**
             * 計算盈利
             * @param codes
             * @param nums
             * @return shprizes: 賠率, hprizes: 理論可贏獎金, bonus:盈利
             */
            calcBonus(codes, nums) {
                const money = codes ? this.onePrice * nums : this.gameOrder.money
                const bonus = this.reward - money
                return {
                    shprizes: [this.getHprize(this.hprizeIndex).hprize],
                    hprizes: [this.calcHprize(this.hprizeIndex)],
                    bonus
                }
            },
            /**
             * 投注前檢查
             * 980 立即投注/加投注項: beforeCheck -> 320 立即投注/加投注項: beforeCheck
             * 980 隨機一注: beforeRandomLotterys -> 320 機選: setRandonBall320
             * 980 確認投注: beforeCheck['checkBox'] -> 320 確認投注: beforeCheck['checkBoxAndDel']
             * 980 投注彈窗-確定: confirm()
             * @param {Function} fn 成功後執行
             * @param {Array} checkList 檢查方法名稱,預設checkSingle ex:['checkSingle', 'checkBox']
             */
            beforeCheck(fn, checkList = ['checkSingle']) {
                const result = checkList.reduce((ans, checkName) => ans && this[checkName](), true)
                result && fn()
            },
            // 隨機投注前檢查
            beforeRandomLotterys(num) {
                this.checkSingle() && this.setRandonBallData(num)
            },
            /**
             * 立即投注/加入投注項/隨機注: 單注上限檢查
             * @return {boolean} 是否通過檢查
             */
            checkSingle() {
                const onePrice = Math.max(+this.onePrice, this.gameOrder.onePrice)
                // 隨機注/手動選球 加到投注項內的檢查
                const userBouns = this.hprize * onePrice
                // 檢查是否超過最大金額
                if (userBouns > this.bonusLimit) {
                    this.showLimitAlert()
                    return false
                }
                return true
            },
            /**
             * 整批投注項送出的檢查 (980'確認投注'開啟彈窗)
             * @return {boolean} 是否通過檢查
             */
            checkBox() {
                const exceeds = this.gameLtProject.findIndex((oneProject) => {
                    const userBouns = oneProject.hprize * +oneProject.onePrice
                    // 檢查是否超過最大金額
                    if (userBouns > this.bonusLimit) {
                        this.showLimitAlert()
                        return true
                    }
                }) > -1
                return !exceeds
            },
            /**
             * 整批投注項送出的檢查 (320'確認投注'送出 )
             * @return {boolean} 是否通過檢查
             */
            checkBoxAndDel() {
                const {number, issue = []} = this.currentjsDynamicData
                // 加入投注項之後, 一直放到停售
                if (!number) {
                    // 不在销售期间内
                    this.$msg(warnMessageBox({
                        message: this.$t('Bet_002_0002')
                    }))
                    return false
                }
                let ISSUE_ARR = issue.length > 0 ? issue.reduce((ans, {number}) => {
                    ans.push(number)
                    return ans
                }, []) : [number]

                const exceeds = this.gameLtProject.findIndex((oneProject) => {
                    const userBouns = oneProject.hprize * +oneProject.onePrice
                    // 檢查是否超過最大金額
                    if (userBouns > this.bonusLimit) {
                        this.showLimitAlert()
                        return true
                    }

                    // 檢查是否存在過期獎期
                    const thisIssue = oneProject.issue
                    if (!ISSUE_ARR.includes(thisIssue)) {
                        this.deleteInvalidProject(thisIssue)
                        return true
                    }
                }) > -1
                return !exceeds
            },
            // 超過最大金額彈窗
            showLimitAlert() {
                const getHprize = (id) => {
                    if (this.jsPrizePoint) {
                        const { hprize, autoOdds } = this.jsPrizePoint[id][0]
                        return (hprize + autoOdds).strip()
                    } else {
                        return ''
                    }
                }
                const overLimit = this.gameLtProject.find(({money, methodId}) => money * getHprize(methodId) > this.bonusLimit)
                const {parentName, childNameKey} = overLimit || this.gameOrder
                const title = `${this.$t(this.keyObj[parentName])}-${this.$t(childNameKey)}`
                this.$msg(warnMessageBox({
                    // 超过投注限制
                    message: this.$t('popup_035'),
                    // 您于【{0}】的投注金额已超过最高投注上限，请重新选择。
                    content: this.$t('popup_074', { '0': title })
                }))
            },
            /**
             * 刪除過期注單, 並開啟警示訊息
             * (320:跳警告彈窗)
             * @param {String} invalidIssue
             */
            deleteInvalidProject(invalidIssue) {
                // 找出過期注單idx
                const invalidIdxArr = this.gameLtProject.reduce((ans, {issue}, rowIdx) => {
                    if (invalidIssue === issue) {
                        ans.push(rowIdx)
                    }
                    return ans
                }, [])

                // 從底端開始刪除注單
                invalidIdxArr.reverse().forEach((idx) => {
                    this[_M.REMOVE_SUBMIT_ORDER_INDEX](idx)
                })

                // 開啟警示訊息(320:跳警告彈窗)
                this.$msg(warnMessageBox({
                    // 第{0}期已封盘，系统已为您过滤注单。
                    message: this.$t('stock_002', {'0': invalidIssue})
                }))
            },
            // 設定隨機一注選球資料
            setRandonBallData(num) {
                while (num--) {
                    const { ballOrderArr } = this.randomNum()
                    const { randomIssue } = this.getRandomIssue()
                    const {methodId, onePrice, parentNameKey, parentName, childNameKey} = this.gameOrder
                    const codes = ballOrderArr.join('')

                    // 980:直接加入注單箱
                    this[_M.SET_RANDOM_LOTTERYS_MUTI]({
                        digitstr: '',
                        methodId,
                        codes,
                        showCodes: codes,
                        nums: 1,
                        type: 'digital',
                        money: (+onePrice).strip(),
                        mode: 1,
                        times: 1,
                        onePrice,
                        hprize: this.hprize,
                        keepPoint: this.kp,
                        parentName,
                        parentNameKey,
                        childNameKey,
                        issue: randomIssue
                    })
                }
            },
            // [320] 設定隨機一注選球資料
            setRandonBall320(num = 1) {
                while (num--) {
                    const { ballOrderArr } = this.randomNum()
                    // const { randomChIdx } = this.getRandomIssue()
                    const {methodId, onePrice, parentNameKey, childNameKey} = this.gameOrder
                    const codes = ballOrderArr.join('')

                    // 產生預覽球結果
                    const gameBallData = this.get320BallPreview(ballOrderArr)
                    // 產生隨機選取上下午效果
                    // this.selectCheckbox(0, randomChIdx)

                    // 320: 加入拆單結果
                    this[_M.SET_BALLS_COMBINE]([ballOrderArr])
                    this[_M.SET_GAME_ORDER_DATA]({
                        digitstr: '',
                        methodId,
                        codes,
                        showCodes: codes,
                        nums: 1,
                        type: 'digital',
                        money: (+onePrice).strip(),
                        gameBallData,
                        mode: 1,
                        times: 1,
                        onePrice,
                        hprize: this.hprize,
                        hprizes: this.hprize,
                        keepPoint: this.kp,
                        parentNameKey,
                        childNameKey
                    })
                }
            },
            /**
             * 取得隨機資訊
             * @returns {Array} Obj.ballOrderArr 隨機單注資料(ex: [2,3])
             */
            randomNum() {
                const {balls, rowTitle, randomSP} = this.config
                if (randomSP) return this.randomNumSP()
                const ballOrderArr = rowTitle.map((i) => {
                    const randomIdx = ~~(Math.random() * balls.length)
                    return balls[randomIdx]
                })

                return { ballOrderArr }
            },
            /**
             * 取得隨機資訊(特別處理, ex: 3D頭獎組選包組)
             * @returns {Array} Obj.ballOrderArr 隨機單注資料(ex: [2,3])
             */
            randomNumSP() {},
            /**
             * 320: 取得隨機之後的選球結果
             * @param {Array} ballOrder 注單選球結果
             * @return {Array} ex: [Array(10), Array(10), Array(10)]
             */
            get320BallPreview(ballOrder) {
                return ballOrder.map((ball) => {
                    return this.config.balls.map((ballVal) => ballVal === ball)
                })
            },
            // 取得隨機上下午
            getRandomIssue() {
                const issueArr = this.currentjsDynamicData.issue
                // 只可投一種(只能是下午)
                let randomChIdx = 1
                let randomIssue = this.gameSubmit.ltIssueStart

                if (issueArr && issueArr.length > 1) {
                    // 可投上下午
                    randomChIdx = ~~(Math.random() * issueArr.length)
                    randomIssue = issueArr[randomChIdx].number
                }
                return { randomIssue, randomChIdx }
            },
            /**
             * 產生拆完單的球號碼陣列
             * @param {Array} original 切割好的彩球標題陣列 ex: [[0,2], [4]]
             * @return {Array} 所選號碼球的所有組合
             */
            getSplitOrder(original) {},
            /**
             * 從 N 個不同事物中，任取 M 個排成一列的排列數的組合數
             */
            combine(n, m) {
                if (n < m) {
                    console.warn('combine: n must bigger than M!')
                    return 0
                }
                return (this.factorial(n) / (this.factorial(n - m) * this.factorial(m))).strip()
            },
            /**
             * 計算 N 階乘
             */
            factorial(n) {
                if (n <= 1) {
                    return 1
                } else if (this.factorialCache[n]) {
                    return this.factorialCache[n]
                }
                this.factorialCache[n] = n * this.factorial(n - 1)
                return this.factorialCache[n]
            },
            // 根據獎期勾選當前可以投注的時段
            setCheckBox() {
                const userSel = this.gameOrder.activeCheckboxes[0] || {}
                this.ableCheckbox.forEach((val, idx) => {
                    if (val !== !!userSel[idx]) {
                        this[_M.TOGGLE_CHECKBOX]({x: 0, y: idx})
                    }
                })
            }
        }
    }
</script>
