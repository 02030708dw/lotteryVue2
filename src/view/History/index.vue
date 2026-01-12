<template>
    <component :is="which" :setStore="setStore"/>
</template>
<script>
import vn from './vn'
import stock from './stock'
import my from './my'
import la from './la'
import thail from './th'

export default {
    name: 'History',
    components: {
        vn,
        stock,
        my,
        la,
        thail
    },
    beforeMount() {
        const bodyScroll = document.body.classList
        bodyScroll.remove('scrollDown')
    },
    props: {
        setStore: Function
    },
    computed: {
        which() {
            const { type } = this.$route.params
            const typeList = ['vn', 'stock', 'thail', 'la', 'my']
            // 如果路徑不正確,導回首頁
            if (!typeList.includes(type)) {
                this.$router.push('/')
                return false
            }
            return type
        }
    }
}
</script>
