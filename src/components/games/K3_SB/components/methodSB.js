
import Method from '@C/games/components/Table/Method'
import Text from '@C/pixi/components/Text'

export default class MethodSB extends Method {
    coins = []
    constructor(objectData, textData, titleData, playFn, prizeFn) {
        super(objectData, textData, titleData, playFn, prizeFn)
    }
    // 文字賠率
    initPrize() {
        const textData = this.textData
        // 有給prizeName者, 塞入賠率資料
        const filterData = textData
            .filter((data) => {
                const {prizeName} = data
                !prizeName && new Text({ ...data, zIndex: 1, p: this })
                return prizeName
            })
        this.method.prizeNameArr = filterData.map(({prizeName}) => prizeName)
        this.prize = this.getPrize()
        try {
            this.prize = this.prize.map((text, i) => {
                const data = filterData[i]
                const p = new Text({ ...data, zIndex: 1, p: this, text: isNaN(text) ? text : (text - 1).strip() })
                p.color = data.style.fill
                return p
            })
        } catch (err) {
            console.error('get prize yima error')
        }
    }
    /**
     * 取得賠率的數值
     * @param {boolean} isDisplay 是否為顯示用賠率(扣除本金1)
     * @returns {array} 賠率陣列
     */
    getPrize(isDisplay = false) {
        const { methodId } = this.method
        const pzArr = this.prizeFn(methodId, this.method.prizeNameArr)
        const stop = pzArr.find(p => isNaN(p))
        if (stop) {
            return pzArr.map(() => stop)
        }
        return isDisplay ? pzArr.map(pz => (pz - 1).strip()) : pzArr
    }
    handleAutoOdds () {
        const p = this.prize
        const prize = this.getPrize(true)
        prize.forEach((prizeText, i) => {
            if (prize[i] !== +p[i].text) {
                p[i].style.fill = this.color.autoOdds
                p[i].text = prizeText
            }
        })
    }
    /**
     * 設定顯示賠率
     * @param {string|number} prize 停售/賠率數字
     * @param {boolean} isDisplay 是否為"顯示用賠率" (扣除本金1)
     */
    setPrize (prize, isDisplay = false) {
        const stop = Array.isArray(prize) ? prize.find(p => isNaN(p)) : prize
        if (stop) {
            this.prize.forEach(p => (p.text = stop))
        } else {
            this.prize.forEach((p, i) => (p.text = (isDisplay ? prize[i] - 1 : prize[i]).strip()))
        }
    }
    setPrizeColor (fill) {
        this.prize.forEach(p => (p.style.fill = fill))
    }
}