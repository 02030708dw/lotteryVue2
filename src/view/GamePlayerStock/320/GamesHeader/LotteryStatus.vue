<template>
    <div
        class="gr_games-lotteryStatus-warp"
        @click.stop="toggleStatus"
        :class="{is_active: isStatusActive}"
        v-if="getDataArr[bigGameType] && getDataArr[bigGameType][lotteryId]"
    >
        <div class="gr_games-lotteryStatus-toggle">{{$t('timetable_003')}}</div>
        <div class="gr_games-lotteryStatus" :style="{'max-width': maxWStatus}" ref="lotteryStatus">
            <div class="gr_games-lotteryStatus__sold">
                <span class="gr_games-lotteryStatus__sold--title">
                    <!-- {{$t('贩售:')}} -->
                    {{$t('timetable_001')}}
                </span>
                <span class="gr_games-lotteryStatus__sold--txt">
                    {{$t(getDataArr[bigGameType][lotteryId].selling[0], {
                        '0': getDataArr[bigGameType][lotteryId].selling[1], 
                        '1': getDataArr[bigGameType][lotteryId].selling[2]}
                    )}}
                </span>
                <span>;</span>
            </div>
            <div class="gr_games-lotteryStatus__time">
                <span class="gr_games-lotteryStatus__time--title">
                    <!-- {{$t('开奖:')}} -->
                    {{$t('timetable_002')}}
                </span>
                <span class="gr_games-lotteryStatus__time--txt">
                    {{$t(getDataArr[bigGameType][lotteryId].winning[0], {
                        '0': getDataArr[bigGameType][lotteryId].winning[1], 
                        '1': getDataArr[bigGameType][lotteryId].winning[2],
                        '2': getDataArr[bigGameType][lotteryId].winning[3]}
                    )}}
                </span>
            </div>
        </div>
    </div>
</template>
<script>
    import { mapActions, mapGetters } from 'vuex'
    import { getData } from '@V/SalesTime/config/data'
    export default {
        name: 'LotteryStatus',
        data() {
            return {
                maxWStatus: ''
            }
        },
        methods: {
            ...mapActions([
                _M.SET_POP_ACTIVE
            ]),
            toggleStatus() {
                this[_M.SET_POP_ACTIVE]({gameStatus: !this.isStatusActive})
                const lot = this.$refs.lotteryStatus
                lot.offsetWidth >= lot.offsetParent.offsetWidth &&
                    (this.maxWStatus = `${lot.offsetParent.offsetWidth - 10}px`)
            }
        },
        computed: {
            ...mapGetters([
                'gameType',
                'gameLotteryId',
                'getPopActive'
            ]),
            ...mapGetters({
                lotteryId: 'gameLotteryId'
            }),
            getDataArr() {
                return getData()
            },
            bigGameType() {
                return this.gameType.toUpperCase()
            },
            isStatusActive() {
                return this.getPopActive.gameStatus
            }
        }
    }
</script>