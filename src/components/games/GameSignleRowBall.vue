<script>
    import GameSignleBall from '@C/games/GameSignleBall'

    export default {
        name: 'GameSignleRowBall',
        mixins: [GameSignleBall],
        methods: {
            randomNum() {
                let tempGameBallData = this.config.balls.map(() => false)
                let gameBallData = []
                const randomNom = Math.randomNum(this.config.balls.length)
                gameBallData[0] = [...tempGameBallData]
                gameBallData[0][randomNom] = true
                return { gameBallData, nums: 1 }
            },
            //生成指定数目的随机投注号码
            randomShowLotterys(num) {
                while (num--) {
                    const { gameBallData, nums } = this.randomNum()
                    num = this.checkRandom({
                        gameBallData,
                        num,
                        nums,
                        fn: this[_M.SET_GAME_ORDER_DATA],
                        ...this.makeCodes(gameBallData)
                    })
                }
            },
            randomLotterys(num) {
                while (num--) {
                    const { gameBallData, nums } = this.randomNum()
                    num = this.checkRandom({
                        gameBallData,
                        num,
                        nums,
                        fn: this[_M.SET_RANDOM_LOTTERYS],
                        ...this.makeCodes(gameBallData)
                    })
                }
                this[_M.SET_CHANGE_ORDER_FUTURE]()
            },
            checkBallData(data = this.gameBallData[0]) {
                const nums = data.filter((items) => items === true).length
                return { nums }
            },
            makeCodes(gameBallData = this.gameBallData) {
                const data = gameBallData[0]
                let codes = []
                let showCodes = []
                data.forEach((items, index) => {
                    if (items === true) {
                        codes.push(this.config.balls[index])
                        showCodes.push(this.config.balls[index])
                        return items
                    }
                })
                codes = codes.join('&')
                showCodes = showCodes.join(',')
                return { codes, showCodes }
            }
        }
    }
</script>