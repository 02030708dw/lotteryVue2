<template>
    <div class="gr_report-list">
        <HeaderNav />
        <div>
            <Navigation />
            <Controls />
            <InfoList />
        </div>
    </div>
</template>

<script>
import HeaderNav from '@C/HeaderNav'
import Navigation from './Navigation'
import Controls from './Controls'
import InfoList from './InfoList'

export default {
    name: 'RWD_980',
    components: {
        HeaderNav,
        Navigation,
        Controls,
        InfoList
    }
}
</script>