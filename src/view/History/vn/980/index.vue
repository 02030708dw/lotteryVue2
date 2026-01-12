<template>
    <div class="gr_history  gr_container" ref="container">
        <Controls />
        <InfoList />
    </div>
</template>
<script>
import '@CSS/View/_v_history'
import Controls from './Controls'
import InfoList from './InfoList'
export default {
    name: 'RWD_980',
    components: {
        Controls,
        InfoList
    }
}
</script>
