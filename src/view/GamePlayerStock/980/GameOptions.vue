<template>
    <div class="gr_container u_clearfix  bg_primary stock_option-group">
        <!-- 包組/包膽 -->
        <div class="option-group"
            v-for="(option, idx) in getOptions"
            :key="idx"
        >
            <span
                :class="{active: getGameOption[option]}"
                @click="optionClick(option)">
                {{$t(option)}}
            </span>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.option-group {
    float: right;
    span {
        padding: 5px 10px;
        color: #c1272d;
        border: 1px #c1272d solid;
        border-radius: 3px;

        &.active {
            color: #ffffff;
            background-color: #c1272d;
            border: 1px solid #c1272d;
        }
    }
}

</style>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
    name: 'GameOption',
    methods: {
        ...mapActions([
            _M.SET_GAME_OPTION
        ]),
        // 點選選項(單選)
        optionClick(optionKey) {
            const optionExist = this.getGameOption[optionKey]
            this[_M.SET_GAME_OPTION](optionExist ? {} : {
                [optionKey]: true
            })
        }
    },
    computed: {
        ...mapGetters([
            'config',
            'getGameOption'
        ]),
        // 取得選項陣列
        getOptions() {
            if (!this.config) return []
            return this.config.option
        }
    }
}
</script>
