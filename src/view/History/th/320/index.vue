<template>
    <div class="gr_history  gr_container" ref="container">
        <HeaderNav />
        <Controls />
        <InfoList />
    </div>
</template>
<script>
import RWD_980 from '../980'
import HeaderNav from '@C/HeaderNav/'
import Controls from './Controls'
import InfoList from './InfoList'
export default {
    name: 'RWD_320',
    mixins: [RWD_980],
    components: {
        HeaderNav,
        Controls,
        InfoList
    }
}
</script>