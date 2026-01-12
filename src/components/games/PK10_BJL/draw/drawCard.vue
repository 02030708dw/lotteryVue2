<script>
import drag from '@C/pixi/drag'
import Card from '../components/Card'
import Camera3d from '@C/pixi/components/Camera3d'

// import * as PIXI from 'pixi.js'

export default {
    name: 'drawCoin',
    data() {
        return {
            cardPos: [
                // -480 -499
                // {x: -236, y: -256},
                // -244 -243
                {x: 0, y: -710},
                {x: 63, y: -710},
                {x: 139, y: -710, rotation: Math.PI / 180 * 90},
                {x: 330, y: -710},
                {x: 395, y: -710},
                {x: 471, y: -710, rotation: Math.PI / 180 * 90}
            ],
            cards: [],
            cardContainer: null,
            isAnimation: false,
            cardSetp: 1
        }
    },
    beforeMount() {
        this.drawFnFlow.push(
            this.drawCardCamera,
            this.handleCardAnimation.bind(this, false)
        )
        this.resourceArr.push(
            { id: 'card', file: 'card/sp.json' }
        )
    },
    methods: {
        calcCards() {
            const balls = this.lastballs
            const lastNumber = +((this.lastnumber || '-').split('-')[1] || 0)
            const cardNums = [
                (+balls[0] + +balls[1]) % 10,
                (+balls[2] + +balls[3]) % 10,
                +balls[8],
                (+balls[4] + +balls[5]) % 10,
                (+balls[6] + +balls[7]) % 10,
                +balls[9]
            ]
            if (this.calcPlayer(balls) === ((cardNums[0] + cardNums[1]) % 10)) {
                cardNums[2] = -1
            }
            if (this.calcBookmaker(balls) === ((cardNums[3] + cardNums[4]) % 10)) {
                cardNums[5] = -1
            }
            // 花色規則
            return cardNums.map((num, i) => num === -1 ? 0 : (((num + lastNumber + i) % 4) * 13 + num) || 10)
        },
        // 牌的 3d 攝影機
        drawCardCamera() {
            const p = this.cardCamera = new Camera3d(this.container, {name: '', zIndex: 2, anchor: {x: 0.5, y: 0.5}, x: 450, y: 750})
            // drag(p)
            p.setPlanes(1920, 30, 10000)
            p.euler.x = Math.PI / 180 * 30
        },
        drawCards() {
            if (this.trendBalls.length) {
                const balls = this.historyBall
                const { issue } = balls[0]
                const { issue: issue2 } = this.trendBalls[0]
                //如果獎期一樣則不更新
                if (issue === issue2) {
                    return
                }
                this.handleCardAnimation()
            }
        },
        setCardSetp(index, isNext = true) {
            this.isAnimation = false
            this.cardSetp = index
            isNext && this.handleCardAnimation()
        },
        // 發牌
        async cardSetp1(isAnimation) {
            const cardData = {x: 250, y: -810, anchor: {x: 0.5, y: 0.5}, p: this.cardCamera}
            this.cards[0] = new Card({ id: 'card', key: 'card0', ...cardData, pos: this.cardPos[0] })
            this.setSoundOptionAndPlay('PK10_Poker', {volume: 1})
            await this.cards[0].cardAnimation(isAnimation)
            this.cards[3] = new Card({ id: 'card', key: 'card0', ...cardData, pos: this.cardPos[3] })
            this.setSoundOptionAndPlay('PK10_Poker', {volume: 1})
            await this.cards[3].cardAnimation(isAnimation)
            this.cards[1] = new Card({ id: 'card', key: 'card0', ...cardData, pos: this.cardPos[1] })
            this.setSoundOptionAndPlay('PK10_Poker', {volume: 1})
            await this.cards[1].cardAnimation(isAnimation)
            this.cards[4] = new Card({ id: 'card', key: 'card0', ...cardData, pos: this.cardPos[4] })
            this.setSoundOptionAndPlay('PK10_Poker', {volume: 1})
            await this.cards[4].cardAnimation(isAnimation)
            this.setCardSetp(2, false)
        },
        // 開牌&補牌
        async cardSetp2() {
            const cardNums = this.calcCards()
            const cardData = {x: 250, y: -810, anchor: {x: 0.5, y: 0.5}, p: this.cardCamera}
            this.cards[0].turnCardAnimation(`card${cardNums[0]}`)
            this.cards[3].turnCardAnimation(`card${cardNums[3]}`)
            this.cards[1].turnCardAnimation(`card${cardNums[1]}`)
            this.cards[4].turnCardAnimation(`card${cardNums[4]}`)
            this.setSoundOptionAndPlay('PK10_Poker', {volume: 1})
            await this.waitTime(1000)
            if (cardNums[2]) {
                this.cards[2] = new Card({ id: 'card', key: 'card0', ...cardData, pos: this.cardPos[2] })
                this.setSoundOptionAndPlay('PK10_Poker', {volume: 1})
                await this.cards[2].cardAnimation()
                this.setSoundOptionAndPlay('PK10_Poker', {volume: 1})
            }
            if (cardNums[5]) {
                this.cards[5] = new Card({ id: 'card', key: 'card0', ...cardData, pos: this.cardPos[5] })
                this.setSoundOptionAndPlay('PK10_Poker', {volume: 1})
                await this.cards[5].cardAnimation()
                this.setSoundOptionAndPlay('PK10_Poker', {volume: 1})
            }
            // await this.waitTime(1000)
            cardNums[2] && this.cards[2].turnCardAnimation(`card${cardNums[2]}`)
            cardNums[5] && this.cards[5].turnCardAnimation(`card${cardNums[5]}`)
            ;(cardNums[2] || cardNums[5]) && await this.waitTime(1000)
            this.drawTrendBalls()
            this.drawGameScore(true)
            this.drawMethodOpenIssueAnimation()
            this.drawOpenIssue()
            await this.waitTime(3000)
            this.setCardSetp(3)
        },
        // 收牌
        async cardSetp3() {
            this.cards.forEach(card => card.destroyAnimation())
            this.setSoundOptionAndPlay('PK10_Poker_R', {volume: 1})
            await this.waitTime(1000)
            this.cards = []
            this.setCardSetp(1)
        },
        // 發牌動畫建置
        async handleCardAnimation(payload) {
            if (!this.isAnimation) {
                this.isAnimation = true
                await this[`cardSetp${this.cardSetp}`](payload)
            }
        }
    }
}
</script>