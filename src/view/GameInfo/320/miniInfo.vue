<template>
    <div>
        <div>
<!--            <component :is="`InfoList_vn`" v-if="!(isShowDetail || isShowShare ) || !is320" :lotteryCountry="lotteryCountry"/>-->
<!--            <GameInfoDetail v-if="isShowDetail && is320" :lotteryCountry="lotteryCountry"/>-->
<!--            <GameInfoShare v-if="isShowShare && is320" :lotteryCountry="lotteryCountry"/>-->
        </div>
    </div>
</template>
<style lang="scss" scoped>
</style>
<script>
import RWD_980 from '../980'
import InfoList_vn from './InfoList_vn'
import GameInfoDetail from './GameInfoDetail'
import GameInfoShare from './GameInfoShare'
import Controls from '../980/Controls/Controls.vue'
import {mapActions} from 'vuex'
export default {
    name: 'RWD_320',
    mixins: [RWD_980,Controls],
    props:{
      id:{
          type:String
      }
    },
    ...mapActions([
        _M.GET_GAME_INFO_VNLIST
    ]),
    components: {
        InfoList_vn,
        GameInfoDetail,
        GameInfoShare
    },
    mounted() {
        this[_M.GET_GAME_INFO_VNLIST]('11111')
        // this.directSearch(this.id)
    }
}
</script>
