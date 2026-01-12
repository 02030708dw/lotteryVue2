<template>
    <div class="numeric-keyboard">
        <table>
            <tr v-for="(r, i) in ks.layout" :key="i">
                <td v-for="c in r"
                    :key="c.key"
                    :rowspan="c.rowspan"
                    :colspan="c.colspan"
                    :data-icon="ks.keys[c.key].icon"
                    :style="ks.keys[c.key].style"
                    @click.stop="onClick(ks.keys[c.key], $event)">
                </td>
            </tr>
        </table>
    </div>
</template>

<script>
import {NumericKeyboard} from 'numeric-keyboard/dist/numeric_keyboard.vue'
export default {
    mixins: [NumericKeyboard],
    methods: {
        dispatch(event, ...args) {
            this.$emit(event, ...args)
        },
        onClick(key, event) {
            key.active(event.target)
            setTimeout((key, event) => {
                key.deactive(event.target)
                this.dispatch('click', key.code)
            }, 100, key, event)
        }
    }
}
</script>