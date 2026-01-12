<template>
    <div class="gr_grid-vn-panel">
        <div
            class="gr_grid-vn-panel__list"
            v-for="obj in fn"
            @click.stop="obj.fn"
            @selectstart.prevent
        >
                {{ $t(obj.title) }}
        </div>
    </div>
</template>
<script>
    import { mapGetters } from 'vuex'
    export default {
        name: 'GridPanel',
        props: {
            handlePanel: Function
        },
        methods: {
        },
        computed: {
            ...mapGetters([
                'VN_stake'
            ]),
            fn() {
                const arr = [1, 10, 100, 500, 1000].map((v) => {
                    const num = v * this.VN_stake
                    return {
                        title: `+${num}`,
                        fn: () => this.handlePanel(num)
                    }
                })
                return [
                    {
                        // '清除'
                        title: 'vn_t_023',
                        fn: () => this.handlePanel('')
                    },
                    ...arr
                ]
            }
        }
    }
</script>