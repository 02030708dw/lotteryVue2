<template>
    <div class="gr_container">
        <HeaderNav />
        <InfoList />
    </div>
</template>
<script>
import RWD_980 from '../980'
import HeaderNav from '@C/HeaderNav/'
import InfoList from './InfoList'
export default {
    name: 'RWD_320',
    mixins: [RWD_980],
    components: {
        HeaderNav,
        InfoList
    }
}
</script>