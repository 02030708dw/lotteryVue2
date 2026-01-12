<template>
    <div>
        <div
            class="gr_animation__youtube" 
            ref="iframeBox"
        >
            <iframe
                src="https://www.youtube.com/embed/live_stream?channel=UC0xykk-LCkhdxjFl2gdMkkQ&autoplay=1"
                width="100%"
                height="100%"
                frameborder="no"
                border="0"
                marginwidth="0"
                marginheight="0"
                scrolling="no"
            />
        </div>
    </div>
</template>
<script>
export default {
    created() {
        window.addEventListener('resize', this.handleResize, false)
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.handleResize, false)
    },
    mounted() {
        this.setFrameHeight(this.$refs.iframeBox.clientHeight)
    },
    props: {
        iframeGame: Object,
        setFrameHeight: Function,
        height: [Number, String]
    },
    methods: {
        handleResize() {
            this.setFrameHeight(this.$refs.iframeBox.clientHeight)
        }
    },
    watch: {
        height() {
            this.handleResize()
        }
    },
    computed: {
        src() {
            return 'https://www.youtube.com/embed/live_stream?channel=UC0xykk-LCkhdxjFl2gdMkkQ&autoplay=1'
        }
    }
}
</script>