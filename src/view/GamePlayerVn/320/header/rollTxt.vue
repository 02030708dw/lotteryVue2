<script>
import {defineComponent,reactive} from '@vue/composition-api'
import countTo from 'vue-count-to'
export default defineComponent({
    components:{countTo},
    setup(){
        const numObj=reactive({s:0,e:2026})
        return {
            numObj
        }
    }
})
</script>

<template>
    <div>
        <countTo :startVal='numObj.s' :endVal='numObj.e' :duration='3000'></countTo>
        <div class="aaa">
            ppp
        </div>
    </div>
</template>

<style scoped lang="less">
.aaa{
    .centerFlex();
}
</style>
