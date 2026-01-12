<template>
    <div class="window">
        <svg class="gr_news-message-box__close" viewBox="0 0 22.04 22.04" @click="closeScoreBoard">
            <line x1="21.69" y1="0.35" x2="0.35" y2="21.69" />
            <line x1="21.69" y1="21.69" x2="0.35" y2="0.35" />
        </svg>
        <div class="gr_board-message-box__content">
            <InfoList />
        </div>
    </div>
</template>

<script>
import '@CSS/View/_v_score-board'
import InfoList from './InfoList'
import { mapActions } from 'vuex'
import ScoreBoard from '@S/modules/ScoreBoard/'

export default {
    name: 'ScoreBoard980',
    components: {
        InfoList
    },
    // 因為980彈窗直接引用 980/index
    created() {
        //lazy load store
        if (!this.$store._modules.root.getChild('ScoreBoard')) {
            this.$store.registerModule('ScoreBoard', ScoreBoard)
        }
        this[_M.GET_SCORE_BOARD_DATA]()
    },
    methods: {
        ...mapActions([
            _M.SET_POP_ACTIVE,
            _M.GET_SCORE_BOARD_DATA,
            'SET_MESSAGE_BOX_DATA'
        ]),
        closeScoreBoard() {
            this[_M.SET_POP_ACTIVE]({scoreBoard: false})
            this['SET_MESSAGE_BOX_DATA']({
                useOldPop: true,
                show: false,
                zIndex: 1992
            })
        }
    }
}
</script>