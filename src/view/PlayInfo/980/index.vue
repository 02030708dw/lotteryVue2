<template>
    <div>
        <HeaderNav v-if="JWT !== false && is320" />
        <div class="gr_container">
        <!-- '玩法说明' -->
            <div class="title bg_secondary">{{$t('home_013'))}}</div>
            <template v-if="playInfoIsLoading || playList">
                <Tabs />
                <List />
            </template>
        </div>
    </div>
</template>
<style lang="scss" scoped>
@import '~@CSS/main.scss';
.title {
    @extend %shadow_linear_gradient_default_inset;
    line-height: 20px;
    padding: 10px 15px;
}
@media screen and (max-width: 979px) {
    .title {
        height: 36px;
        line-height: 22px;
        padding: 7px 10px;
    }
}
</style>
<script>
import HeaderNav from '@C/HeaderNav'
import Tabs from './Tabs'
import List from './List'
import { mapGetters } from 'vuex'

export default {
    name: 'RWD_980',
    components: {
        Tabs,
        List,
        HeaderNav
    },
    computed: {
        ...mapGetters([
            'playInfoIsLoading',
            'JWT',
            'playList',
            'RWDMode'
        ]),
        is320() {
            return this.RWDMode === 3
        }
    }
}
</script>
