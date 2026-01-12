<script>

export default {
    name: 'horizontalMenu',
    data() {
        return {
            ulWidth: 2000,
            translate: 0,
            spaceWidth: 200,
            isPress: false, // 是否滑鼠點下或是行動裝置觸碰螢幕
            moveCount: 0, // 拖拉時不執行 fn 靈敏度參數計算用
            noClickCount: 5, // 拖拉時不執行 fn 靈敏度參數計算用
            tempX: 0,
            menuContainerWidth: 932,
            diff: 30 // 計算誤差值寬度
        }
    },
    computed: {
        maxWidth() {
            return -this.ulWidth + this.menuContainerWidth
        }
    },
    mounted() {
        this.calcUlWidth()
        window.addEventListener('mouseup', this.handleMoveUP, false)
        window.addEventListener('touchend', this.handleMoveUP, false)
        window.addEventListener('mousemove', this.handleMove, false)
        window.addEventListener('touchmove', this.handleMove, false)
        window.addEventListener('resize', this.calcUlWidth, false)
    },
    beforeDestroy() {
        window.removeEventListener('mouseup', this.handleMoveUP, false)
        window.removeEventListener('touchend', this.handleMoveUP, false)
        window.removeEventListener('mousemove', this.handleMove, false)
        window.removeEventListener('touchmove', this.handleMove, false)
        window.removeEventListener('resize', this.calcUlWidth, false)
    },
    methods: {
        calcUlWidth() {
            if (!this.$refs.li) {
                return
            }
            // 我的最愛
            // 所有 li 加總的總寬度
            this.$nextTick(() => {
                this.ulWidth = this.$refs.li.reduce((a, b) => a + b.offsetWidth, this.diff)
                this.menuContainerWidth = this.$refs.menuContainer.offsetWidth
                this.move(0)
            })
        },
        calcPageX(e) {
            return e.pageX || e.touches[0].pageX
        },
        move(width) {
            const maxWidth = -this.ulWidth + this.$refs.menuContainer.offsetWidth
            this.translate = Math.min(0, Math.max(maxWidth, this.translate + width))
        },
        handleMoveDown(e) {
            this.isPress = true
            this.tempX = this.calcPageX(e)
        },
        handleMoveUP() {
            this.isPress = false
            setTimeout(() => (this.moveCount = 0), 50)
        },
        handleMove(e) {
            if (this.isPress) {
                const x = this.calcPageX(e)
                const diff = x - this.tempX
                this.tempX = x
                this.move(diff)
                this.moveCount++
            }
        },
        handleFn(fn = () => {}) {
            this.moveCount < this.noClickCount && fn()
        }
    }
}
</script>