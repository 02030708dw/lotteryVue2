<template>
    <div :class="this.full ? 'containerFullLoading' : 'containerLoading'" v-loading.body="loading" :element-loading-text="loadIngText" />
</template>

<style lang="scss" scoped>
    .containerLoading {
        max-width: 980px;
        min-width: 320px;
        width: 100vw;
        height: calc(100vh - 44px);
        margin: auto;
    }
    .containerFullLoading {
        min-width: 320px;
        width: 100vw;
        height: calc(100vh - 44px);
        margin: auto;
    }
</style>

<script>
export default {
    name: 'PageLoading',
    props: {
        loadIngText: String,
        loading: Boolean,
        full: Boolean
    }
}
</script>
