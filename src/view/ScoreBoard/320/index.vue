<template>
    <div class="gr_container">
        <HeaderNav />
        <InfoList />
    </div>
</template>
<script>
import RWD_980 from '../980'
import HeaderNav from '@C/HeaderNav'
import InfoList from './InfoList'
export default {
    name: 'ScoreBoard320',
    extends: RWD_980,
    components: {
        HeaderNav,
        InfoList
    }
}
</script>