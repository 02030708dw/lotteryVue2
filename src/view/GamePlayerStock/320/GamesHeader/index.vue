<template>
    <component :is="currentComponent"/>
</template>
<script>
import GamesHeaderNormal from './GamesHeaderNormal'
import GamesHeader2Timer from './GamesHeader2Timer'
import header980 from '../../980/GamesHeader'

export default {
    name: 'GamesHeader',
    extends: header980,
    components: {
        GamesHeaderNormal,
        GamesHeader2Timer
    }
}
</script>