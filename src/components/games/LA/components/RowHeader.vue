<template>
    <GrRow class="gr_grid-vn__header">
        <slot></slot>
    </GrRow>
</template>
<script>
    import GrRow from './GrRow'
    export default {
        name: 'RowHeader',
        components: {
            GrRow
        }
    }
</script>