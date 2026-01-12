<script>
    import MessageBox from '@C/MessageBox/main'
    export default {
        name: 'GameIssueBox',
        mixins: [ MessageBox ],
        methods: {
            timer() {
                if (this.time > 0) {
                    this.setTimeout = setTimeout(() => {
                        this.timer(--this.time)
                        // 确定
                        this.confirmDataText = `${this.$t('popup_004')} ${this.time}`
                    }, 1000)
                } else {
                    this.coldTime !== 0 && this.cancel()
                }
            }
        }
    }
</script>
