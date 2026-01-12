<template>
    <component
        :is="currentRWD"
    />
</template>

<script>
import RwdMixin from '@C/RwdMixin'
export default {
    name: 'currentRWDGame',
    extends: RwdMixin
}
</script>
