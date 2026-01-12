<template>
    <section class="gr_games-lotteryStatus">
        <div class="gr_games-lotteryStatus__sold">
            <span class="gr_games-lotteryStatus__sold--title">
                <!-- {{$t('贩售:')}} -->
                {{$t('timetable_001')}}
            </span>
            <span class="gr_games-lotteryStatus__sold--txt">
                {{$t(getSellTime.selling[0])}}
            </span>
        </div>，
        <div class="gr_games-lotteryStatus__time">
            <span class="gr_games-lotteryStatus__time--title">
                <!-- {{$t('开奖:')}} -->
                {{$t('timetable_002')}}
            </span>
            <span class="gr_games-lotteryStatus__time--txt">
                {{$t(getSellTime.winning[0])}}
            </span>
        </div>
    </section>
</template>
<script>
    import { getData } from '@V/SalesTime/config/data'
    export default {
        name: 'LotteryStatus',
        computed: {
            getDataArr() {
                return getData()
            },
            // 取得販售時間資料
            getSellTime() {
                return this.getDataArr['MY'][this.$route.params.lottery]
            }
        }
    }
</script>