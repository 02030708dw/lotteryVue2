<template>
    <div>
        <HeaderNav v-show="is320" />
        <div class="gr_container playinfo_bg" ref="container" v-show="getMenuId > 0">
            <Menu v-if="!isW88"/>
            <!-- <SellingTime /> -->
            <!-- <MethodList /> -->
            <component :is="whichList" />
            <MethodMenu v-if="!isFantan"/>
        </div>
    </div>
</template>
<script>
import HeaderNav from '@C/HeaderNav'
import Menu from './Menu'
// import SellingTime from './SellingTime'
import MethodList from './MethodList'
import MethodListVN from './MethodListVN'
import MethodListStock from './MethodListStock'
import MethodListMY from './MethodListMY'
import MethodListLA from './MethodListLA'
import MethodListTH from './MethodListTH'
import MethodMenu from './MethodMenu'
import { mapGetters } from 'vuex'

export default {
    name: 'RWD_980',
    components: {
        Menu,
        // SellingTime,
        MethodList,
        MethodListVN,
        MethodListMY,
        MethodListLA,
        MethodListStock,
        MethodListTH,
        MethodMenu,
        HeaderNav
    },
    computed: {
        ...mapGetters([
            'RWDMode',
            'getMenuId',
            'isW88'
        ]),
        is320() {
            return this.RWDMode === 3
        },
        isFantan() {
            return this.getMenuId === 5
        },
        whichList() {
            const list = {
                3: 'MethodListVN',
                6: 'MethodListTH',
                7: 'MethodListStock',
                9: 'MethodListLA',
                10: 'MethodListMY'
            }
            return list[this.getMenuId] || 'MethodList'
        }
    }
}
</script>
