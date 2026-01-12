<template>
    <component :is="currentRWD" />
</template>

<script>
import RWD_980 from './980'
import RWD_320 from './320'
import RwdMixin from '@C/RwdMixin'

export default {
    name: 'HeaderNav',
    mixins: [RwdMixin],
    components: {
        RWD_980,
        RWD_320
    }
}
</script>
