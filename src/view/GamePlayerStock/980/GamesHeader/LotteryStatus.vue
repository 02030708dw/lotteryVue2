<template>
    <section class="gr_games-lotteryStatus" v-if="getDataArr[bigGameType] && getDataArr[bigGameType][gameLotteryId]">
        <div class="gr_games-lotteryStatus__sold">
            <span class="gr_games-lotteryStatus__sold--title">
                <!-- {{$t('贩售:')}} -->
                {{$t('timetable_001')}}
            </span>
            <span class="gr_games-lotteryStatus__sold--txt">
                {{$t(getDataArr[bigGameType][gameLotteryId].selling[0], {
                    '0': getDataArr[bigGameType][gameLotteryId].selling[1], 
                    '1': getDataArr[bigGameType][gameLotteryId].selling[2]}
                )}}
            </span>
        </div>，
        <div class="gr_games-lotteryStatus__time">
            <span class="gr_games-lotteryStatus__time--title">
                <!-- {{$t('开奖:')}} -->
                {{$t('timetable_002')}}
            </span>
            <span class="gr_games-lotteryStatus__time--txt">
                {{$t(getDataArr[bigGameType][gameLotteryId].winning[0], {
                    '0': getDataArr[bigGameType][gameLotteryId].winning[1], 
                    '1': getDataArr[bigGameType][gameLotteryId].winning[2],
                    '2': getDataArr[bigGameType][gameLotteryId].winning[3]}
                )}}
            </span>
        </div>
    </section>
</template>
<script>
    import { mapGetters } from 'vuex'
    import { getData } from '@V/SalesTime/config/data'
    export default {
        name: 'LotteryStatus',
        computed: {
            ...mapGetters([
                'gameType',
                'gameLotteryId'
            ]),
            getDataArr() {
                return getData()
            },
            bigGameType() {
                return this.gameType.toUpperCase()
            }
        }
    }
</script>