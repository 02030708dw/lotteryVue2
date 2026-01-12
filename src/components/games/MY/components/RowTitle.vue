<template>
    <GrRow class="gr_grid-vn__title">
        <slot></slot>
    </GrRow>
</template>
<script>
    import GrRow from './GrRow'
    export default {
        name: 'RowTitle',
        components: {
            GrRow
        }
    }
</script>