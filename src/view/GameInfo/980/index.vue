<template>
    <div>
        <HeaderNav />
        <div>
            <Navigation :isShowDetail="(isShowDetail || isShowShare) && is320" />
            <components :is="currentControll" v-if="!(isShowDetail || isShowShare) || !is320" :lotteryCountry="lotteryCountry" :changeLotteryCountry="changeLotteryCountry" />
            <component :is="`InfoList_${lotteryCountry}`" v-if="!(isShowDetail || isShowShare) || !is320" :lotteryCountry="lotteryCountry"/>
            <GameInfoDetail v-if="isShowDetail && is320" :lotteryCountry="lotteryCountry"/>
            <GameInfoShare v-if="isShowShare && is320" :lotteryCountry="lotteryCountry"/>
        </div>
    </div>
</template>
:zIndex="1996"
<script>
import HeaderNav from '@C/HeaderNav/'
import Navigation from './Navigation'
import ControlsVN from './Controls/ControlsVN'
import ControlsTH from './Controls/ControlsTH'
import ControlsStock from './Controls/ControlsStock'
import ControlsBJL from './Controls/ControlsBJL'
import ControlsMY from './Controls/ControlsMY'
import ControlsLA from './Controls/ControlsLA'
import InfoList_vn from './InfoList_vn'
import InfoList_th from './InfoList_th'
import InfoList_stock from './InfoList_stock'
import InfoList_bjl from './InfoList_bjl'
import InfoList_my from './InfoList_my'
import InfoList_la from './InfoList_la'

import GameInfoDetail from './GameInfoDetail'
import GameInfoShare from './GameInfoShare'
import { mapGetters } from 'vuex'
export default {
    name: 'RWD_980',
    components: {
        HeaderNav,
        Navigation,
        ControlsVN,
        ControlsTH,
        ControlsStock,
        ControlsBJL,
        ControlsMY,
        ControlsLA,
        InfoList_vn,
        InfoList_th,
        InfoList_stock,
        InfoList_bjl,
        InfoList_my,
        InfoList_la,
        GameInfoDetail,
        GameInfoShare
    },
    props: {
        lotteryCountry: {
            type: String,
            default: 'cn'
        },
        changeLotteryCountry: {
            type: Function,
            default: () => {}
        }
    },
    computed: {
        ...mapGetters([
            'GameInfoShareIndex',
            'GameInfoDetailIndex',
            'RWDMode',
            'gameSum'
        ]),
        isShowDetail() {
            return this.GameInfoDetailIndex > -1
        },
        isShowShare() {
            return this.GameInfoShareIndex > -1
        },
        is320() {
            return this.RWDMode === 3
        },
        currentControll() {
            const lotCountry = {
                vn: 'ControlsVN',
                th: 'ControlsTH',
                stock: 'ControlsStock',
                bjl: 'ControlsBJL',
                la: 'ControlsLA',
                my: 'ControlsMY'
            }
            return lotCountry[this.lotteryCountry] || 'ControlsVN'
        }
    }
}
</script>
