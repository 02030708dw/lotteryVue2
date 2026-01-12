<template>
    <div class="c_keyboard">
        <NumericKeyboard  :layout="custom" :theme="theme" @click="press"></NumericKeyboard>
    </div>
</template>


<script>
import { NumericKeyboard } from '@C/keyboard/'
import custom from '@C/keyboard/layouts/custom.js'
import theme from '@C/keyboard/style/custom.js'

export default {
    name: 'keyboard',
    components: {
        NumericKeyboard
    },
    props: {
        handleKB: Function
    },
    methods: {
        press(key) {
            this.handleKB(key)
        }
    },
    computed: {
        custom() {
            return custom
        },
        theme() {
            return theme
        }
    }
}
</script>

