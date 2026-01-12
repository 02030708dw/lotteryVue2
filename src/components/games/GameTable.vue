<script>
import { mapGetters, mapActions } from 'vuex'
import { Storage } from '@API'
import { formatNumber, warnMessageBox, getStorage, setStorage } from '@UTIL'
import throttle from '@UTIL/decorator/throttle'
import debounce from '@UTIL/decorator/debounce'
import Mask from '@C/pixi/components/Mask'
import Container from '@C/pixi/components/Container'
// import Viewport from '@C/pixi/components/Viewport'
// import Text from '@C/pixi/components/Text'
// import Graphics from '@C/pixi/components/Graphics'
// import Sprite from '@C/pixi/components/Sprite'

// import * as PIXI from 'pixi.js'
const cache = {}
export default {
    name: 'GamePlayerTable',
    components: {
        // HeaderNav,
    },
    data() {
        return {
            isLand: false,
            initVal: {},
            drawFnFlow: [],
            resourceArr: [],
            preResourceArr: [],
            spritesTemp: {},
            spritesNameTemp: [],
            balls: [],
            app: null,
            balance: null,
            coldDown: null,
            issue: null,
            openIssue: null,
            historyTable: null,
            trendPlace: null,
            moneyPlace: null,
            moneyArea: null,
            tip: null,
            fastBtn: null,
            removeBtn: null,
            clearBtn: null,
            orderBtn: null,
            dobuleBtn: null,
            moneyIndex: -1,
            coins: [],
            loadedCount: 0,
            coinArr: [1, 2, 5, 10, 20, 50, 100, 500, 1000, 5000],
            coinIndex: [0, 1, 2, 3, 4],
            isEraser: false,
            isShowHistory: false,
            timer: null,
            preLoad: null,
            orderFeatureNum: 0,
            resizeName: 'resizePreLoad',
            // 音效預設值暫存
            userConfig: {
                // 是否撥放音效
                sound: true,
                // 是否撥放背景音樂
                BGM: true
            },
            autoPlayFail: false,
            // 紀錄當前的背影音樂id
            currentBGM: '',
            // requestAnimationFrame 計時器陣列
            timerQueue: {},
            timerId: 0,
            devicePixelRatio: window.devicePixelRatio || 1,
            // devicePixelRatio: 2,
            inputMethod: () => null,
            // 最大連投期數
            MAX_ORDER_FUTURE_NUM: 120,
            lotterySKey: {
                'lottery_name_205': 'lottery_name_s_020', //亚洲30秒骰宝    > 亚洲30秒
                'lottery_name_206': 'lottery_name_s_021', //亚洲1分骰宝     > 亚洲1分
                'lottery_name_207': 'lottery_name_s_009', //广西骰宝        > 世彩1分
                'lottery_name_208': 'lottery_name_s_014', //北京骰寶        > 北京
                'lottery_name_209': 'lottery_name_s_010', //江苏骰宝        > 江苏
                'lottery_name_210': 'lottery_name_s_011', //安徽骰宝        > 安徽
                'lottery_name_211': 'lottery_name_s_012', //湖北骰宝        > 湖北
                'lottery_name_240': 'lottery_name_s_020', //亚洲30秒鱼虾蟹  > 亚洲30秒
                'lottery_name_241': 'lottery_name_s_010', //江苏鱼虾蟹      > 江苏
                'lottery_name_270': 'lottery_name_114', // 幸运飞艇I
                'lottery_name_282': 'lottery_name_s_023', // 澳洲5分骰宝
                'lottery_name_280': 'lottery_name_s_024', // 亚洲1分鱼虾蟹
                'lottery_name_284': 'lottery_name_s_023' // 澳洲5分鱼虾蟹
            }
        }
    },
    beforeMount() {
        TweenMax.ticker.useRAF(false)
        TweenMax.lagSmoothing(0)
        this.$root.$on('handleReset', this.handleReset)
        this.$root.$on('updateTip', this.updateTip)
        this.$root.$on('updateBonus', this.updateBonus)
        this.$root.$on('handleAutoPlayFail', this.handleAutoPlayFail)
        window.addEventListener('resize', this.resize, false)
        // 初次進入清空creditGameLtProject
        this[_M.SET_CREDIT_GAME_LT_PROJECT]()
        // 自localStorage讀取音效設定
        this.userConfig = { ...this.userConfig, ...getStorage(Storage.tableSoundConfig) }
        // 讀取硬幣種類
        this.coinIndex = [ ...(getStorage(Storage.coinIndex) || this.coinIndex) ]

        // 頁面共用音效
        this.resourceArr.push(
            { id: 'ui001_click', file: 'ui001_click.mp3', isSound: true },
            { id: 'ui002_openui', file: 'ui002_openui.mp3', isSound: true },
            { id: 'ui003_slide', file: 'ui003_slide.mp3', isSound: true },
            { id: 'ba_chipput', file: 'ba_chipput.mp3', isSound: true },
            { id: 'ba_chipselect', file: 'ba_chipselect.mp3', isSound: true },
            { id: 'closebell', file: 'closebell.mp3', isSound: true },
            { id: 'Click17', file: 'Click17.mp3', isSound: true },
            { id: 'gold_move', file: 'gold_move.mp3', isSound: true }
        )
    },
    mounted() {
        //lazy load store
        // PIXI.cacheKey = this.getCacheKey
        const {width, height} = this.getScreenSize()
        this.isLand = width > height
        this.init()
        if (cache[this.getCacheKey]) {
            PIXI.loadCache = cache[this.getCacheKey]
            this.drawPreLoadBg()
            this.onAssetsLoaded()
        } else {
            this.preLoader()
        }
    },
    beforeDestroy() {
        // 紀錄硬幣種類
        setStorage(Storage.coinIndex, this.coinIndex)

        // 關閉音樂
        this.stop(this.currentBGM)

        // 離開前清空投注箱
        this.handleReset()
        clearTimeout(this.timer)
        this.$root.$off('handleReset', this.handleReset)
        this.$root.$off('updateTip', this.updateTip)
        this.$root.$off('updateBonus', this.updateBonus)
        this.$root.$off('handleAutoPlayFail', this.handleAutoPlayFail)
        window.removeEventListener('resize', this.resize, false)
        PIXI.utils.clearTextureCache()
        this.app.stage.destroy()
        this.app.destroy(true)
        this.app = null
        PIXI.isPlayIng = false
        // 清除所有計時器
        Object.values(this.timerQueue).forEach(id => clearTimeout(id))
        clearInterval(this.getConfigIntervalId)
    },
    methods: {
        ...mapActions([
            _M.GET_GAME_PLAY_DATA,
            _M.GET_GAME_JS_DYNAMIC_CONFIG_FOR_OFFICAL,
            _M.TABLE_GAME_ORDER_SUBMIT,
            _M.GET_WALLET_BALANCE,
            _M.SET_CREDIT_GAME_LT_PROJECT,
            _M.CREDIT_GAME_ORDER_SUBMIT,
            _M.ORDER_FUTURE_NUMBERS,
            _M.SET_TABLE_ORDER_FUTURE,
            _M.CHANGE_ORDER_FUTURE_BINGOSTOP
        ]),
        getDynamic() {
            const diff = this.number[this.number.length - 1] - this.lastnumber[this.lastnumber.length - 1]
            const notYetUpdated = diff !== 1 && diff !== -9
            notYetUpdated && this[_M.GET_GAME_JS_DYNAMIC_CONFIG_FOR_OFFICAL]()
        },
        getScreenSize() {
            return {
                width: window.innerWidth,
                height: window.innerHeight
            }
        },
        onComplete(data) {
            // console.log(data)
        },
        preLoader() {
            const loader = PIXI.loadCache = cache[this.getCacheKey] = new PIXI.Loader()
            // isSound 是否為音訊檔
            this.preResourceArr.forEach(({
                id, file, urlPath = this.urlPath, fn = this.onComplete, isSound = false, soundPath = this.soundPath
            }) => {
                const url = (!isSound ? urlPath : soundPath) + file
                loader.add(id, url, fn)
            })
            loader.onError.add((err, loader, resource) => {
                console.warn(`Error: [${resource.url}] ${err.message}`)
                loader.destroy()
                cache[this.getCacheKey] = undefined
                // const urlSplit = resource.url.split('/')
                // const file = urlSplit[urlSplit.length - 1]
                // console.log(err, file)
                this.$msg(warnMessageBox({
                    // 您的网络连接异常，请检查连接并按下[ 确定] 重整页面。
                    message: this.$t('popup_129'),
                    beforeConfirm: () => location.reload()
                }))
            })
            loader
                .load(this.drawPreLoad)
                // .on('progress', (loader, resource) => {
                //     // this.preLoad.percent.text = Math.round(loader.progress) + '%'
                //     // this.preLoad.progress.width = 300 * loader.progress / 100
                //     // // console.log(Math.round(loader.progress) + '% ', 'loading ' + resource.name + ' sprite')
                // })
        },
        loader() {
            const loader = PIXI.loadCache
            let itemCount = 0
            this.loadedCount = 0
            // isSound 是否為音訊檔
            this.resourceArr.forEach(({
                id, file, urlPath = this.urlPath, fn = this.onComplete, isSound = false, soundPath = this.soundPath, timeout = 30000
            }) => {
                const url = (!isSound ? urlPath : soundPath) + file
                itemCount++
                file.includes('.json') && itemCount++
                // loader.add(id, url, fn)
                loader.add(id, url, {timeout}, fn)
            })

            loader
                .load(() => itemCount === this.loadedCount && this.onAssetsLoaded())
                // .on('progress', (loader, resource) => {
                .onProgress.add((loader, resource) => {
                    const urlSplit = resource.url.split('/pixi')
                    const fileUrl = urlSplit[1]
                    if (resource.error) {
                        console.error(resource.error.toString())
                    } else {
                        this.loadedCount++
                        // console.log(this.loadedCount, itemCount, fileUrl, Math.round(this.loadedCount / itemCount * 100))
                        this.preLoad.percentVal = Math.round(this.loadedCount / itemCount * 100)
                        this.preLoad.percent.text = this.preLoad.percentVal + '%'
                    }
                    // this.preLoad.fileName.text = fileUrl
                    this.preLoad.bar.draw()
                    // console.log(Math.round(loader.progress) + '% ', 'loading ' + resource.name + ' sprite')
                })
        },
        drawPreLoad() {
            this.drawPreLoadBg()
            this.loader()
        },
        draw() {
            this.preLoad && this.preLoad.destroy({chirdren: true})
            this.preLoad = null
            // 需轉正重新計算
            this.app.stage.rotation = 0
            this.app.stage.x = 0
            this.resizeName = 'resizeGame'
            this.drawFnFlow.forEach(fn => fn.call(this))
        },
        async onAssetsLoaded() {
            // PIXI.loadCache.resources.s1.sound.play()
            this.preLoad.percentVal = 100
            this.preLoad.percent.text = '100%'
            this.preLoad.bar.draw()
            this.getConfigIntervalId = setInterval(this.getDynamic, 15000)
            await this[_M.GET_GAME_PLAY_DATA]({
                lotteryId: this.lotteryId
            })
            PIXI.isPlayIng = true
            this.draw()
            // 需記住初始化的值才能resize
            this.initVal = this.container.getBounds()
            this.resize()
            // this.app.ticker.add((delta) => {
            //     // rotate the container!
            //     // use delta to create frame-independent transform
            //     // container.rotation -= 0.01 * delta
            // })
        },
        // 初始化canvas 及配置
        init() {
            const { width, height } = this.getScreenSize()
            PIXI.utils.skipHello()
            this.app = new PIXI.Application({
                width,
                height,
                antialias: true,
                resolution: this.devicePixelRatio
            })
            this.$refs.gameContainer.appendChild(this.app.view)
            this.root = new Container(this.app.stage, {bg: {}})
            this.container = new Container(this.app.stage, {
                name: 'main',
                sortableChildren: true
            })
            this.mask = new Mask({
                p: this.app.stage,
                alpha: 0.8,
                visible: false,
                tint: 0x000000,
                texture: PIXI.Texture.WHITE,
                width,
                height
            })
            this.front = new Container(this.app.stage)

            this.mask.container = this.container
            this.mask.front = this.front
        },
        // 獎期結束Tip
        updateTip() {
            const stop = [9501, 9503]
            this.showTip('popup_025')
            this.spritesNameTemp.forEach((key) => {
                const sp = this.spritesTemp[key]
                const status = sp.statusCode
                const isReset = !stop.includes(status)
                if (this.isEraser && this.creditGameLtProject[key]) {
                    isReset && sp.setStatus(0)
                } else {
                    isReset && sp.setStatusAndUpdate(0)
                }
            })
        },
        // 每次新獎期會觸發一次更新遊戲狀態
        updateBonus() {
            this.resetSpriteStatus(true)
            if (this.isEraser) {
                this.showTipPermanent('Glory_3001')
            }
        },
        // 更新遊戲狀態
        resetSpriteStatus(isFocus = false) {
            const stop = [9501, 9503]
            this.spritesNameTemp.forEach((key) => {
                const sp = this.spritesTemp[key]
                const status = sp.statusCode
                // isFocus 除了停售的玩法一律回歸初始狀態
                // 其餘則是指判斷封鎖值用戶獎金限額
                const isReset = !stop.includes(status) &&
                    (isFocus || this.overLimitMethods[key] || this.bonusOverLimitMethods[key])
                if (this.isEraser && this.creditGameLtProject[key]) {
                    isReset && sp.setStatus(0)
                } else {
                    isReset && sp.setStatusAndUpdate(0)
                }
                sp.setPrize(sp.getPrize(), true)
                sp.prize.forEach(prize => sp.setPrizeColor(prize.color))
            })
            // 有彈窗的話重繪
            if (this.gameSubmitPop) {
                this.gameSubmitPop.children[0].destroy({children: true})
                this.gameSubmitPop.draw(false)
            }
        },
        handleSubmit() {
            const getOverKeyArr = this.getOverOnePrice()
            if (getOverKeyArr.length) {
                // 檢查所有注單是否小於'多幣'最小金額
                Object.keys(this.creditGameLtProject).forEach((key) => {
                    const sp = this.spritesTemp[key]
                    if (getOverKeyArr.includes(key)) {
                        sp.setStatusAndUpdate('8003')
                    } else {
                        sp.setStatusAndUpdate('0')
                    }
                })

                // '投注低于最小投注金额 {0} 元'
                this.showTip(this.$t('popup_145', { '0': +this.onePrice }))
            } else if (!this.checkLimit()) {
                // 檢查所有注單有否超过投注限制
                this.drawGameSubmitPop()
                // this[_M.CREDIT_GAME_ORDER_SUBMIT]()
            }
        },
        // 點擊桌面單一方格時行為
        handleClick({ title, title_key, methodId, name, upperName, upperName_key, sortId, prizeNameArr, key }) {
            const sp = this.spritesTemp[key]
            const status = sp.statusCode
            const stop = [9501, 9503]
            if (stop.includes(status)) return
            const key2 = `${this.$t(upperName_key)}-${this.$t(title_key)}`
            // 如果是橡皮擦模式,則取消舊的&不增加新的
            if (this.isEraser) {
                const cornNums = (sp.coins || []).length
                if (cornNums === 0) {
                    // '此区块无筹码'
                    this.showTipChange('Glory_3002', 'Glory_3001')
                    return
                }
                // '请选择撤销投注的区块'
                this.showTipPermanent('Glory_3001')
                // 可以移除籌碼, 則撥放音效
                this.setSoundOptionAndPlay('ba_chipput', {volume: 0.5})
                sp.clearCoins()
                sp.setStatusAndUpdate(0)
                this[_M.SET_CREDIT_GAME_LT_PROJECT]({type: 2, key})
                this.orderFuture && this[_M.SET_TABLE_ORDER_FUTURE]()
                return
            }
            // app.renderer.plugins.extract.image
            let money = this.money
            if (!money) {
                // '未选择筹码'
                return this.showTip('Glory_3000')
            } else if (+this.availableBalance < money || +this.availableBalance < (+this.ltMoneyAmout + money)) {
                // '餘額不足'
                return this.showTip('Bet_004_0002')
            }

            // 已有資料則相加
            if (this.creditGameLtProject[key]) {
                let {money: oldMoney, hprize, title_key, upperName_key} = this.creditGameLtProject[key]
                const newMoney = oldMoney + money
                // 判斷是否超過最高獎金
                if (this.checkSimpleLimit({ money: newMoney, hprize })) {
                    return this.$msg({
                        // '超过投注限额'
                        message: 'popup_081',
                        content: this.$t('popup_074', { '0': key2 })}
                    )
                }
                this[_M.SET_CREDIT_GAME_LT_PROJECT]({
                    type: 1,
                    ...this.creditGameLtProject[key],
                    money: newMoney
                })
            } else {
                let hprize
                let isUpdated
                if (prizeNameArr) {
                    hprize = this.getPrizeMulti(methodId, prizeNameArr).join(',')
                    isUpdated = prizeNameArr.map(title => !!this.diffPrizeData[methodId + title])
                } else {
                    hprize = this.prize({methodId, title})
                    isUpdated = this.diffPrizeData[methodId + title]
                }

                // 判斷是否超過最高獎金
                if (this.checkSimpleLimit({ money, hprize })) {
                    return this.$msg({
                        // '超过投注限额'
                        message: 'popup_081',
                        content: this.$t('popup_074', { '0': key2 })}
                    )
                }
                // 初次新增
                this[_M.SET_CREDIT_GAME_LT_PROJECT]({
                    key,
                    type: 1,
                    codes: title,
                    title,
                    title_key,
                    scode_key: title_key,
                    hprize,
                    keepPoint: this.kp,
                    money,
                    methodId,
                    upperName,
                    upperName_key,
                    typeName: name,
                    sortId,
                    prizeNameArr,
                    isUpdated
                })
            }
            // 可以放上籌碼, 則撥放音效
            this.setSoundOptionAndPlay('ba_chipput', {volume: 0.5})
            this.spritesTemp[key].add({
                id: 'coin',
                key: `c$${money}`,
                p: this.container,
                x: this.coinPosArr2[this.moneyIndex].x,
                y: this.coinPosArr2[this.moneyIndex].y,
                scale: {x: 0.5, y: 0.5}
            })
            // this.orderFuture && this[_M.SET_TABLE_ORDER_FUTURE]()
        },
        // 翻倍處理
        handleDobule() {
            if (!this.isEraser) {
                const overMethod = this.creditGameLtProjectVal.find((project) => {
                    const { money: oldMoney, key, hprize } = project
                    const method = this.spritesTemp[key]
                    let money = oldMoney * 2
                    return this.checkSimpleLimit({money, hprize})
                })
                // 超出限額的玩法
                if (overMethod) {
                    const { upperName_key, title_key } = overMethod
                    const key2 = `${this.$t(upperName_key)}-${this.$t(title_key)}`
                    return this.$msg({
                        // '超过投注限额'
                        message: 'popup_081',
                        content: this.$t('popup_074', { '0': key2 })}
                    )
                }
                let arr = []
                let sumMoney = 0
                this.creditGameLtProjectVal.forEach((project) => {
                    const { key, money: oldMoney } = project
                    const method = this.spritesTemp[key]
                    let money = oldMoney * 2

                    arr.push({
                        ...project,
                        money
                    })
                    sumMoney += money
                })
                // 餘額不足
                if (+this.availableBalance < sumMoney) {
                    return this.showTip('Bet_004_0002')
                }
                // 翻倍動畫
                this.creditGameLtProjectVal.forEach(({ key }) => this.spritesTemp[key].double())
                this[_M.SET_CREDIT_GAME_LT_PROJECT](arr)
                this.orderFuture && this[_M.SET_TABLE_ORDER_FUTURE]()
            }
        },
        // 橡皮擦模式處理
        handleEraser() {
            this.isEraser = !this.isEraser
            if (this.isEraser) {
                if (this.moneyIndex > -1) {
                    this.tempMoneyIndex = this.moneyIndex
                    const coin = this.coins[this.moneyIndex]
                    coin.fnData.up.fn()
                }
                this.creditGameLtProjectVal
                    .forEach(({key}) => {
                        const method = this.spritesTemp[key]
                        method.drawEraserTexture()
                    })
                this.removeBtn.setTextureKey('removec')
                this.buttonSwitch({order: false, double: false, clear: false})
            } else {
                if (this.tempMoneyIndex > -1) {
                    const coin = this.coins[this.tempMoneyIndex]
                    coin.fnData.up.fn()
                }
                this.creditGameLtProjectVal
                    .forEach(({key}) => {
                        const method = this.spritesTemp[key]
                        method.updateStaus()
                    })
                this.hideTip('Glory_3001')
                this.removeBtn.setTextureKey('remove')
                if (this.ltProjectNum) {
                    this.buttonSwitch({order: true, double: true, clear: true})
                }
            }
        },
        // 停售
        handleBlocked() {
            const stop = [9501, 9503]
            this.spritesNameTemp.forEach((key) => {
                const sp = this.spritesTemp[key]
                const isStop = stop.includes(sp.statusCode)
                if (this.stopBet[key]) {
                    if (!isStop) {
                        this[_M.SET_CREDIT_GAME_LT_PROJECT]({type: 2, key})
                        sp.setStatusAndUpdate(9501)
                        sp.setPrize(this.$t('popup_096'))
                    }
                } else if (isStop) {
                    sp.setStatusAndUpdate(0)
                    sp.setPrize(sp.getPrize(), true)
                }
            })
        },
        // 封鎖停押 // 用戶限額
        handleOverLimit() {
            this.spritesNameTemp.forEach((key) => {
                if (this.overLimitMethods[key] || this.bonusOverLimitMethods[key]) {
                    this.spritesTemp[key].setStatusAndUpdate(9502)
                }
            })
        },
        // 封鎖停押 // 用戶限額
        handleAutoOdds() {
            this.spritesNameTemp.forEach(key => this.spritesTemp[key].handleAutoOdds())
        },
        // 重置注單狀態及撤回籌碼
        handleReset() {
            this.creditGameLtProjectVal.forEach(({key}) => {
                const sp = this.spritesTemp[key]
                sp.clearCoins()
                sp.setStatusAndUpdate(0)
            })
            this[_M.SET_CREDIT_GAME_LT_PROJECT]()
            // 有追號的時候, 清空注數
            this.orderFuture && this[_M.SET_TABLE_ORDER_FUTURE]()
        },
        // 取得該玩法哦獎金組
        getPrizeData({methodId, title}) {
            return this.floatPrize.jsPrizePoint[methodId][title]
        },
        /**
         * 取得多獎金, 並且組成陣列
         * @param {String} methodId method ID ex: 205003
         * @param {Array} prizeNameArr 欲查詢的玩法陣列 ex: [单1,双1,全1]
         * @returns {Array} 獎金資料陣列 ex: [{},{},{}]
         */
        getPrizeMulti(methodId, prizeNameArr = []) {
            return prizeNameArr.map((prizeName) => this.prize({methodId, title: prizeName}))
        },
        /** 計算浮動獎金組 */
        prize({methodId, title}) {
            // '停售'
            const key = `${methodId}_${title}`
            if (this.stopBet[key]) return this.$t('popup_096')
            try {
                const { hprize, autoOdds } = this.getPrizeData({methodId, title})
                return (hprize + autoOdds).strip()
            } catch (err) {
                const floatPrize = (this.floatPrize) ? {
                    [`floatPrize[${methodId}]`]: this.floatPrize.jsPrizePoint[methodId]
                } : {}
                console.error('取浮動獎金組失敗，gameCredit.prize', {
                    methodId,
                    title,
                    ...floatPrize,
                    err
                })
                return null
            }
        },
        @throttle(1000)
        async fetchBlance (sfn = () => {}, efn = () => {}) {
            sfn()
            await this[_M.GET_WALLET_BALANCE](true)
            efn()
        },
        resizeGame() {
            this.handleMoveMask()
            const c = this.container
            const f = this.front
            const stage = this.app.stage
            const { width, height } = this.getScreenSize()
            const { x: offsetX, y: offsetY, width: widthR, height: heightR } = this.initVal
            const wratio = width / height
            const ratio = widthR / heightR
            const vatio = height / width
            let x, y, cx, cy, cw, ch
            if (width >= height) {
                // PIXI.isTest = false
                stage.rotation = 0
                stage.x = 0
                if (wratio < ratio) {
                    x = width / widthR
                    y = width / ratio / heightR
                } else {
                    x = height * ratio / widthR
                    y = height / heightR
                }
                cw = width
                ch = height
            } else {
                // PIXI.isTest = true
                stage.rotation = Math.PI / 2
                stage.x = width
                if (vatio < ratio) {
                    x = height / widthR
                    y = height / ratio / heightR
                } else {
                    x = width * ratio / widthR
                    y = width / heightR
                }
                cw = height
                ch = width
            }
            cx = cw / 2
            cy = ch / 2
            c.scale = f.scale = {x, y}
            this.root.bg.width = this.mask.width = cw
            this.root.bg.height = this.mask.height = ch
            c.x = f.x = cx - (c.width / 2) - offsetX
            c.y = f.y = cy - (c.height / 2) - offsetY
            this.app.view.style.width = width + 'px'
            this.app.view.style.height = height + 'px'
            this.app.renderer.resize(width, height)
        },
        handleMoveMask() {
            const device = PIXI.utils.isMobile
            const isIOS = device.apple.device
            if (device.any) {
                const firefox = device.other.firefox
                const chrome = device.other.chrome
                const { width, height } = this.getScreenSize()
                const height2 = document.documentElement.clientHeight
                const isLand = width > height
                const style = this.$parent.$refs.mask.style
                if (this.isLand !== isLand) {
                    this.isLand = isLand
                    style.visibility = 'visible'
                    window.scrollTo(0, 0)
                    return
                }
                if (isIOS) {
                    // 橫向
                    if (isLand) {
                        if (height > height2 || (!(firefox || chrome) && height === height2)) {
                            style.visibility = 'hidden'
                        } else {
                            style.visibility = 'visible'
                        }
                    // 直向
                    } else {
                        if (height === height2) {
                            style.visibility = 'visible'
                        } else {
                            style.visibility = 'hidden'
                        }
                    }
                } else {
                    if (height > height2) {
                        style.visibility = 'hidden'
                    } else {
                        style.visibility = 'visible'
                    }
                }
                window.scrollTo(0, 0)
            }
        },
        @debounce(150)
        resize() {
            this[this.resizeName]()
        },
        updateLtMoneyAmout() {
            if (this.moneyArea) {
                // '下注'
                const moneyText = `${this.$t('table_004')}: ${formatNumber(this.ltMoneyAmout) || '0'}`
                this.moneyArea.text.updateBG(moneyText)
            }
        },
        /**
         * 取得所有注單超過'多幣'最小金額之玩法key
         * @returns {Array} 超過之玩法key, ex: ['2020013_龙',...]
         */
        getOverOnePrice() {
            return Object.entries(this.creditGameLtProject).reduce((ans, [key, oneProject]) => {
                const {money} = oneProject
                if (money < +this.onePrice) {
                    ans.push(key)
                }
                return ans
            }, [])
        },
        // 檢查所有注單有否超过投注限制
        checkLimit() {
            const isPass = this.creditGameLtProjectVal.find(this.checkSimpleLimit)
            if (isPass) {
                const {title_key, upperName_key} = isPass
                const key = `${this.$t(upperName_key)}-${this.$t(title_key)}`
                this.$msg({
                    // '超过投注限额'
                    message: 'popup_081',
                    content: this.$t('popup_074', { '0': key })}
                )
            }
            return isPass
        },
        // 檢查玩法超过投注限制
        checkSimpleLimit({money, hprize}) {
            const hprizeWord = `${hprize}`
            const calcHprize = hprizeWord.split(/[/,]/).max()
            const bonusLimit = this.bonusLimit
            return (money * calcHprize > bonusLimit)
        },
        // 取得玩法最大可投注金額
        getSimpleLimit({hprize}) {
            const calcHprize = `${hprize}`.split('/').max()
            const bonusLimit = this.bonusLimit
            return Math.floor(bonusLimit / calcHprize)
        },
        showTip(text) {
            this.front.addChild(this.tip)
            this.tip.text.show(this.$t(text))
            clearTimeout(this.timer)
            this.timer = setTimeout(this.hideTip.bind(this), 3000)
        },
        showTipChange(text, text2) {
            this.front.addChild(this.tip)
            this.tip.text.show(this.$t(text))
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                this.hideTip()
                this.tip.text.show(this.$t(text2))
            }, 3000)
        },
        showTipPermanent(text) {
            this.front.addChild(this.tip)
            this.tip.text.show(this.$t(text))
            clearTimeout(this.timer)
            this.timer = this.tip.text.show(this.$t(text))
        },
        hideTip() {
            const fn = () => this.container.addChild(this.tip)
            this.tip.text.hide(fn)
        },
        // 線性漸層
        linearGradient(stepPoint = [], options = {}) {
            const { x1 = 0, y1 = 0, x2 = 200, y2 = 200, width = 200, height = 200 } = options
            const c = document.createElement('canvas')
            const ctx = c.getContext('2d')
            const grd = ctx.createLinearGradient(x1, y1, x2, y2)
            stepPoint.forEach(({point, color}) => grd.addColorStop(point, color))
            ctx.fillStyle = grd
            ctx.fillRect(0, 0, width, height)
            return new PIXI.Texture.from(c)
        },
        // 放射型漸層
        radialGradient(stepPoint = [], options = {}) {
            const { x1 = 0, y1 = 0, x2 = 200, y2 = 200, width = 200, height = 200, r1 = 0, r2 = 200 } = options
            const c = document.createElement('canvas')
            const ctx = c.getContext('2d')
            const grd = ctx.createRadialGradient(x1, y1, r1, x2, y2, r2)
            stepPoint.forEach(({point, color}) => grd.addColorStop(point, color))
            ctx.fillStyle = grd
            ctx.fillRect(0, 0, width, height)
            return new PIXI.Texture.from(c)
        },
        // 自動撥放失效處理
        handleAutoPlayFail() {
            if (this.autoPlayFail) {
                // 打開BGM開關, 並嘗試再次撥放
                this.userConfig.BGM = true
                this.setSoundOptionAndPlay(this.currentBGM)
            }
        },
        /**
         * 音效操作-設定播放選項
         * @param {string} id Pixi resource ID
         * @param {object} options 設定值
         * @param {number} options.volume 音量大小
         * @param {boolean} options.loop 循環撥放
         * @param {boolean} options.muted 靜音
         * @param {boolean} playNow 是否立即播放
         */
        setSoundOptionAndPlay(id, options = {}, playNow = true) {
            const {BGM: isPlayBGM, sound: isPlaySound} = this.userConfig

            // 紀錄當前的背影音樂id, 如果設定開關關閉, 則不撥
            if (id.includes('bg')) {
                this.currentBGM = id
                if (!isPlayBGM) {
                    playNow = false
                }
            } else if (!isPlaySound) {
                playNow = false
            }

            // 設定撥放參數
            const audioObj = this.getSoundObj(id)
            Object.keys(options).forEach((configName) => {
                audioObj[configName] = options[configName]
            })

            // 如果正在撥放就停止(為了達成可以連按音效)
            if (audioObj.currentTime > 0) {
                this.stop(id)
            }
            // 立即撥放
            if (playNow) {
                const playPromise = audioObj.play()

                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        this.autoPlayFail = false
                    }).catch(err => {
                        // 撥放失效時, 關閉背景音樂開關
                        console.warn('error:', err.message)
                        this.userConfig.BGM = false
                        this.autoPlayFail = true
                    })
                }
            }
        },
        /**
         * 音效操作-播放
         * @param {string} id Pixi resource ID
         */
        playSound(id) {
            const sound = this.getSoundObj(id)
            return sound.play()
        },
        /**
         * 音效操作-暫停播放
         * @param {string} id Pixi resource ID
         */
        pause(id) {
            const sound = this.getSoundObj(id)
            sound.pause()
        },
        /**
         * 音效操作-停止播放
         * @param {string} id Pixi resource ID
         */
        stop(id) {
            const sound = this.getSoundObj(id)
            sound.pause()
            sound.currentTime = 0
        },
        /**
         * 取得音效控制物件(dom)
         * @param {string} id Pixi resource ID
         * @returns {obj} 音效控制物件
         */
        getSoundObj(id) {
            try {
                return PIXI.loadCache.resources[id].data
            } catch (e) {
                console.warn(`音效錯誤 id:${id}`, e)
            }
        },
        // fullScreen() {
        //     const fn = ['requestFullscreen', 'msRequestFullscreen', 'mozRequestFullScreen', 'webkitRequestFullscreen'].find(s => s in document.body)
        //     try {
        //         document.body.removeEventListener('touchend', this.fullScreen, false)
        //         document.body[fn]()
        //     } catch (err) {
        //         // alert('not support full screen')
        //     }
        // },
        toDataUrl(p, ext = 'image/png') {
            const canvas = this.app.renderer.extract.canvas(p)
            return canvas.toDataURL(ext)
        },
        //取得彩種短名稱
        getLotterySName(name) {
            return this.lotterySKey[name]
        },
        /**
         * 控制按鈕組開關
         * @param {boolean} options.order 開啟/關閉 投注按鈕
         * @param {boolean} options.double 開啟/關閉 翻倍按鈕
         * @param {boolean} options.clear 開啟/關閉 清空按鈕
         */
        buttonSwitch(options = {}) {
            const action = {
                order: {
                    on: () => {
                        this.orderBtn.setTextureKey('order')
                        this.orderBtn.eventOn()
                    },
                    off: () => {
                        this.orderBtn.setTextureKey('orderd')
                        this.orderBtn.eventOff()
                    }
                },
                double: {
                    on: () => {
                        this.dobuleBtn.setTextureKey('double')
                        this.dobuleBtn.eventOn()
                    },
                    off: () => {
                        this.dobuleBtn.setTextureKey('doubled')
                        this.dobuleBtn.eventOff()
                    }
                },
                clear: {
                    on: () => {
                        this.clearBtn.setTextureKey('clear')
                        this.clearBtn.eventOn()
                    },
                    off: () => {
                        this.clearBtn.setTextureKey('cleard')
                        this.clearBtn.eventOff()
                    }
                }
            }

            Object.keys(options).forEach((btnName) => {
                const isOn = options[btnName]
                isOn ? action[btnName].on() : action[btnName].off()
            })
        },
        // 一秒鐘執行60次
        waitTime(coldTime) {
            const timerId = this.timerId--
            // return new Promise((resolve) => {
            //     const loop = () => {
            //         if (coldTime-- > 0) {
            //             this.timerQueue[timerId] = requestAnimationFrame(loop)
            //         } else {
            //             cancelAnimationFrame(this.timerQueue[timerId])
            //             delete this.timerQueue[timerId]
            //             resolve()
            //         }
            //     }
            //     loop()
            // })
            return new Promise((resolve) => (this.timerQueue[timerId] = setTimeout(() => resolve(), coldTime)))
        }

    },
    props: {
        setStore: Function
    },
    computed: {
        ...mapGetters([
            'game',
            'kp',
            'lang',
            'lastnumber',
            'number',
            'gameMenu',
            'floatPrize',
            'availableBalance',
            'diffPrizeData',
            'historyBall',
            'lastballs',
            'codeTime',
            'creditGameLtProject',
            'gameSubmit',
            'gameHistoryList',
            'isMobile',
            'bonusLimit',
            'lotteryNameKey',
            'jsPrizePoint',
            'overLimitMethods',
            'stopBet',
            'bonusOverLimitMethods',
            'lotteryList2',
            'lotteryListTable',
            'isShowTaskButton',
            'currentjsDynamicData',
            'onePrice',
            'currencySymbol'
        ]),
        lotteryId() {
            return this.$route.params.lottery
        },
        getBalance() {
            return formatNumber(this.availableBalance)
        },
        money() {
            return this.coinArr[this.coinIndex[this.moneyIndex]]
        },
        ltProjectNum() {
            return this.gameSubmit.ltProjectNum
        },
        ltMoneyAmout() {
            return this.orderFuture ? this.gameSubmit.orderFutureMoneyAmount : this.gameSubmit.ltMoneyAmout
        },
        formatNumber(number) {
            return formatNumber(number)
        },
        creditGameLtProjectVal() {
            return Object.values(this.creditGameLtProject)
        },
        isHL() {
            return this.lotteryList2[this.lotteryId].name.indexOf('HL_') > -1
        },
        gamenumbersLength() {
            return ((this.currentjsDynamicData || {}).gamenumbers || []).length
        },
        isShowOrderFutureButton() {
            return this.isShowTaskButton && this.gamenumbersLength
        },
        orderFutureNum: {
            set(number) {
                this[_M.ORDER_FUTURE_NUMBERS](number)
                this[_M.SET_TABLE_ORDER_FUTURE]()
            },
            get() {
                return this.game.orderFutureNum || 0
            }
        },
        orderFuture () {
            return this.gameSubmit.orderFuture
        },
        // 取得當前PIXI快取的key
        getCacheKey() {
            return `${this.gameType}@${this.lang}`
        }
    },
    watch: {
        getBalance() {
            (this.balance || {}).text = this.getBalance
        },
        lastnumber() {
            (this.openIssue || {}).text = this.$t('common_001', {'0': this.lastnumber})
        },
        number() {
            (this.issue || {}).text = this.$t('common_001', {'0': this.number})
            // 追號判斷修改可最大投注
            if (this.orderFuture && this.gamenumbersLength < this.orderFutureNum) {
                this.moneyPlace.setNum(this.gamenumbersLength)
            }
        },
        codeTime() {
            (this.coldDown || {}).text = this.codeTime
        },
        ltMoneyAmout() {
            if (this.orderBtn) {
                if (+this.ltMoneyAmout) {
                    if (this.isEraser) {
                        this.updateLtMoneyAmout()
                        return
                    }
                    this.buttonSwitch({order: true, clear: true, double: true})
                } else {
                    this.buttonSwitch({order: false, clear: false, double: false})
                }
            }
            this.updateLtMoneyAmout()
        },
        stopBet() {
            this.handleBlocked()
        },
        async $route() {
            // 離開前清空投注箱
            this[_M.SET_CREDIT_GAME_LT_PROJECT]()
            this.trendBalls = []
            this.moneyIndex = -1
            // 有追號的時候, 清空注數
            this.orderFuture && this[_M.SET_TABLE_ORDER_FUTURE]()
            clearTimeout(this.timer)
            PIXI.utils.clearTextureCache()
            this.app.stage.destroy()
            this.app.destroy(true)
            this.app = null
            PIXI.isPlayIng = false
            // 清除所有計時器
            Object.values(this.timerQueue).forEach(id => clearTimeout(id))
            clearInterval(this.getConfigIntervalId)

            this.init()
            this.drawPreLoadBg()
            this.onAssetsLoaded()
        }
    }
}
</script>