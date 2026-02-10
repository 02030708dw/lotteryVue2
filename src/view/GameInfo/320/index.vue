<template>
    <div>
        <HeaderNav />
        <div>
            <Navigation :isShowDetail="(isShowDetail || isShowShare) && is320" />
            <Controls v-if="!(isShowDetail || isShowShare ) || !is320" :lotteryCountry="lotteryCountry" :changeLotteryCountry="changeLotteryCountry"/>
            <InfoList v-if="!isShowDetail || !is320" :lotteryCountry="lotteryCountry" />
            <component :is="`InfoList_${lotteryCountry}`" v-if="!(isShowDetail || isShowShare ) || !is320" :lotteryCountry="lotteryCountry"/>
            <GameInfoDetail v-if="isShowDetail && is320" :lotteryCountry="lotteryCountry"/>
            <GameInfoShare v-if="isShowShare && is320" :lotteryCountry="lotteryCountry"/>
        </div>
        <footer v-show="GameInfoDetailIndex === -1 && GameInfoShareIndex === -1 && gameSum.sum_total_price > 0">
            <span>{{$t('bettingrc_073')}} {{formatNumber(gameSum.sum_total_price)}}</span>
            <span>{{$t('bettingrc_015')}} {{formatNumber(gameSum.sum_bonus)}}</span>
            <p v-if="gameSum.sum_income_only">{{$t('bettingrc_083')}}</p>
        </footer>
    </div>
</template>
<style lang="scss" scoped>
footer {
    position: fixed;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    width: 100%;
    line-height: 20px;
    color: white;
    text-align: right;
    padding:10px 0px;
    span {
        margin-right: 20px;
    }
}
</style>
<script>
import RWD_980 from '../980'
import HeaderNav from '@C/HeaderNav/'
import Navigation from './Navigation'
import Controls from './Controls'
import InfoList_vn from './InfoList_vn'
import InfoList_th from './InfoList_th'
import InfoList_stock from './InfoList_stock'
import InfoList_my from './InfoList_my'
import InfoList_la from './InfoList_la'
import InfoList_bjl from './InfoList_bjl'
import GameInfoDetail from './GameInfoDetail'
import GameInfoShare from './GameInfoShare'
import { formatNumber } from '@UTIL'

export default {
    name: 'RWD_320',
    mixins: [RWD_980],
    components: {
        HeaderNav,
        Navigation,
        Controls,
        InfoList_vn,
        InfoList_th,
        InfoList_stock,
        InfoList_bjl,
        InfoList_my,
        InfoList_la,
        GameInfoDetail,
        GameInfoShare
    },
    methods: {
        formatNumber(val) {
            return formatNumber(val)
        }
    }
}
</script>