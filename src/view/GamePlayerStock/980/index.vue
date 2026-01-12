<template>
    <div>
        <HeaderNav />
        <div
            v-if="!game.isLoading"
            v-show="!game.isBallsLoading"
            ref="container"
        >
            <GamesHeader/>
            <GameMenu />
            <GameBalls />
        </div>
        <GameRecord v-show="!isShowDemo && !game.isLoading && !game.isBallsLoading" />
        <MessageBox
            :zIndex="1996"
            className="el-detail-message-box"
        >
            <GameInfoDetailBox :lotteryCountry="lotteryCountry"/>
        </MessageBox>
        <MessageBox
            :zIndex="1997"
            className="el-detail-message-box"
        >
            <GameInfoShareBox :lotteryCountry="lotteryCountry"/>
        </MessageBox>
        <!-- 加载中 -->
        <PageLoading
            v-show="game.isBallsLoading"
            :loading="game.isBallsLoading"
            :loadIngText="$t('home_020')"
        />
    </div>
</template>
<script>
import HeaderNav from '@C/HeaderNav/'
import PageLoading from '@C/PageLoading'
import GamesHeader from './GamesHeader/'
import GameMenu from './GameMenu'
import GameBalls from './GameBalls'
import GameRecord from './GameRecord'
import GameInfoDetailBox from './GameRecord/GameInfoDetailBox'
import GameInfoShareBox from './GameRecord/GameInfoShareBox'
import { mapGetters, mapActions } from 'vuex'

export default {
    name: 'RWD_980',
    data() {
        return {
            // 控制底下投注紀錄"投注詳情"的不同模板切換
            lotteryCountry: 'cn'
        }
    },
    components: {
        HeaderNav,
        GamesHeader,
        GameBalls,
        GameMenu,
        GameRecord,
        PageLoading,
        GameInfoDetailBox,
        GameInfoShareBox
    },
    watch: {
        $route() {
            this[_M.SET_POP_ACTIVE]()
        }
    },
    methods: {
        ...mapActions([
            _M.SET_POP_ACTIVE
        ])
    },
    computed: {
        ...mapGetters([
            'game',
            'isShowDemo'
        ]),
        ...mapGetters({
            lotteryId: 'gameLotteryId'
        })
    }
}
</script>
