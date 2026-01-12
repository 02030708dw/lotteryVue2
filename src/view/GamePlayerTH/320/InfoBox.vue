<template>
    <div v-if="isShowBox" class="el-message-box__wrapper" :style="{ zIndex }">
        <div class="el-message-box  el-scroll-content-message-box">
            <div class="el-message-box__header">
                <div class="el-message-box__title">
                    <span>{{$t(currentBoxTitle[mode])}}</span>
                </div>
                <i
                    class="el-message-box__close el-icon-close"
                    aria-label="Close"
                    @click="close"
                    v-if="isShowCloseIcon"
                />
                <div
                    @click="close"
                    v-if="isShowCloseIcon"
                    style="position: absolute; top: 0; right: 0; height: 100%; width: 50px; background: transparent; cursor: pointer;"
                />
            </div>
            <div class="el-message-box__content">
                <component
                    :is="currentBoxName[mode]"
                    :lotteryName="lotteryName"
                    :lastnumber="lastnumber"
                    :lotteryId="lotteryId"
                    :historyBall="historyBall"
                    :isSin="isSin"
                    :subGame="subGame"
                    :gameMenu="gameMenu"
                    :menuIndex="menuIndex"
                />
            </div>
        </div>
    </div>
</template>

<script>
    // import { mapActions, mapGetters } from 'vuex'
    // import GameHistory from './GameHistory'
    // import PlayInfo from './PlayInfo'
    import MessageBox from '@C/MessageBox/main'
    import GamesHeader from './GamesHeader'
    import { mapGetters } from 'vuex'

    export default {
        name: 'InfoBox',
        mixins: [MessageBox, GamesHeader],
        components: {
            // GameHistory,
            // PlayInfo
        },
        data() {
            return {
                // currentBoxName: {
                //     '1': 'GameHistory',
                //     '2': 'PlayInfo'
                // },
                // currentBoxTitle: {
                //     // '历史奖号'
                //     '1': 'common_007',
                //     // '玩法'
                //     '2': 'common_098'
                // }
            }
        },
        props: {
            mode: Number
        },
        computed: {
            ...mapGetters([
                'historyBall',
                'subGame',
                'gameMenu',
                'menuIndex'
            ]),
            ...mapGetters({
                isSin: 'gameIsSin'
            })
        }
    }
</script>
