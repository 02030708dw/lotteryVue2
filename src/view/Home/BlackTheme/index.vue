<template>
    <div class="container">
        <lotteryMenu :notSubmenu="notSubmenu" />
        <lotterySubMenu v-if="!notSubmenu" />
        <lotteryPage :menuId="menuId" :subMenuKey="subMenuKey" />
    </div>
</template>
<style lang="scss" scoped>
.container {
    padding: 0 10px;
}
</style>
<script>
import '@CSS/View/_v_home'
import lotteryMenu from './lotteryMenu'
import lotteryPage from './lotteryPage'
import lotterySubMenu from './lotterySubMenu'

import { mapGetters, mapActions } from 'vuex'

export default {
    name: 'Home',
    components: {
        lotteryMenu,
        lotteryPage,
        lotterySubMenu
    },
    beforeMount() {
        this.$root.$on('forceUpdateLottery', this.forceUpdateLottery)
    },
    destroyed() {
        this.$root.$off('forceUpdateLottery', this.forceUpdateLottery)
    },
    data() {
        return {
            menuId: '1',
            subMenuKey: 'SSC'
        }
    },
    methods: {
        setMenuId(id) {
            this.menuId = id
            this.subMenuKey = ![0, 9999].includes(this.menuId) && Object.keys(this.lotteryMenu[this.menuId].list || {})[0]
        },
        setSubMenuKey(key) {
            this.subMenuKey = key
        },
        gameRouter(router, lottery) {
            return router || `/GamePlayer/${lottery}`
        },
        forceUpdateLottery() {
            const { menuId, function_type } = this.globalLottery
            this.menuId = menuId
            this.subMenuKey = function_type
        }
    },
    computed: {
        ...mapGetters([
            'lotteryMenu',
            'lotteryList',
            'lotteryList2',
            'officialKeyVN',
            'lotteryOfficialVN',
            'lotteryListLocalVN',
            'VN_hasOld',
            'popularEntries',
            'myFavorites',
            'globalLottery'
        ]),
        lotteryKey() {
            return Object.keys(this.lotteryList)
        },
        // 取得有開放的lottery List
        // getLotOpen() {
        //     // 越南彩不列入
        //     const open = [1, 2, 4, 5, 6, 7]
        //     return Object.entries(this.lotteryList).reduce((ans, [lotKey, data]) => {
        //         if (open.includes(data.menuId)) {
        //             ans[lotKey] = data
        //         }
        //         return ans
        //     }, {})
        // },
        subTabData() {
            return (this.menuId !== 0) && Object.entries((this.lotteryMenu[this.menuId] || {}).list || {})
        },
        notSubmenu() {
            return [0, 3, 6, 7, 9, 10, 9999].includes(+this.menuId)
        }
    }
}
</script>