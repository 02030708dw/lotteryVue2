<template>
    <div>
        <div>
            <Navigation :isShowDetail="(isShowDetail || isShowShare) && is320" />
            <component :is="`InfoList_vn`"  :lotteryCountry="lotteryCountry"/>
            <GameInfoDetail v-if="isShowDetail && is320" :lotteryCountry="lotteryCountry"/>
            <GameInfoShare v-if="isShowShare && is320" :lotteryCountry="lotteryCountry"/>
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
export default {
    name: 'miniInfo',
    mixins: [RWD_980,Controls],
    props:{
      id:{
          type:[String,Number]
      }
    },
    components: {
        InfoList_vn,
        GameInfoDetail,
        GameInfoShare
    },
    mounted() {
        this.directSearch(this.id)
    }
}
</script>
