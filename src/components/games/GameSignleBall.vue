<script>
    import GameBalls from '@C/games/GameBalls'

    export default {
        name: 'GameSignleBall',
        mixins: [GameBalls],
        methods: {
            randomNum(num) {
                let tempGameBallData = this.config.balls.map(() => false)
                let gameBallData = []
                let original = []
                const randomNom = Math.randomNum(num)
                const randomNom2 = Math.randomNum(this.config.balls.length)
                while (num > 0) {
                    gameBallData[num - 1] = [...tempGameBallData]
                    if (num - 1 === randomNom) {
                        gameBallData[randomNom][randomNom2] = true
                    }
                    original[num - 1] = gameBallData[num - 1]
                        .map((items, index) => items ? this.config.balls[index] : false)
                        .filter(items => items !== false)
                    num--
                }
                return { original, nums: 1, gameBallData }
            },
            //生成指定数目的随机投注号码
            randomShowLotterys(num) {
                while (num--) {
                    const { original, nums, gameBallData } = this.randomNum(this.config.row.length)
                    num = this.checkRandom({
                        gameBallData,
                        num,
                        nums,
                        fn: this[_M.SET_GAME_ORDER_DATA],
                        ...this.makeCodes(original)
                    })
                }
            },
            randomLotterys(num) {
                while (num--) {
                    const { original, nums, gameBallData } = this.randomNum(this.config.row.length)
                    num = this.checkRandom({
                        gameBallData,
                        num,
                        nums,
                        fn: this[_M.SET_RANDOM_LOTTERYS],
                        ...this.makeCodes(original)
                    })
                }
                this[_M.SET_CHANGE_ORDER_FUTURE]()
            },
            checkBallData() {
                const data = this.gameBallData
                let original = []
                //总注数
                let nums = 0
                //检测球是否完整
                for (let i = 0; i < data.length; i++) {
                    let row = data[i]
                    let rowNum = 0
                    original[i] = []
                    for (let j = 0; j < row.length; j++) {
                        if (row[j]) {
                            original[i].push(this.config.balls[j])
                            rowNum++
                        }
                        //计算注数
                    }
                    nums += rowNum
                }
                return { nums, original }
            },
            makeCodes(original) {
                let codes = []
                let showCodes = []
                let scode_key = []
                original.forEach((items) => {
                    codes.push(items.join('&'))
                    const ballsArr = items.map(oneBall => { return this.getBallsKey(oneBall) || 0 })
                    const ballsKeyArr = items.map(oneBall => this.getBallsKey(oneBall))
                    showCodes.push(ballsArr.join(','))
                    scode_key.push(ballsKeyArr.join('&'))
                })
                showCodes = showCodes.map(items => items || '-').join('|')
                scode_key = scode_key.join('|')
                codes = codes.join('|')
                return { codes, showCodes, scode_key }
            }
        }
    }
</script>