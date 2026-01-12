<template>
    <section class="gr_games-vn-lotteryStatus">
        <template v-if="!VN_isLocal || lang !== 'vn'">
            <div class="gr_games-vn-lotteryStatus__sold">
                <span class="gr_games-lotteryStatus__sold--title">
                    <!-- {{$t('贩售:')}} -->
                    {{$t('timetable_001')}}
                </span>
                <span class="gr_games-lotteryStatus__sold--txt">
                    {{$t(getSellTime.selling[0], {
                        '0': getSellTime.selling[1],
                        '1': getSellTime.selling[2]}
                    )}}
                </span>
            </div>，
            <div class="gr_games-vn-lotteryStatus__time">
                <span class="gr_games-lotteryStatus__time--title">
                    <!-- {{$t('开奖:')}} -->
                    {{$t('timetable_002')}}
                </span>
                <span class="gr_games-lotteryStatus__time--txt">
                    {{$t(getSellTime.winning[0], {
                        '0': getSellTime.winning[1],
                        '1': getSellTime.winning[2],
                        '2': getSellTime.winning[3]}
                    )}}
                </span>
            </div>
        </template>
        <template v-else>
            <div class="gr_games-vn-lotteryStatus__sold">
                <span class="gr_games-lotteryStatus__sold--txt">
                    Nhận cược và mở thưởng từ 05:00 hôm nay đến 07:00 ngày mai
                </span>
            </div>，
            <div class="gr_games-vn-lotteryStatus__time">
                <span class="gr_games-lotteryStatus__time--txt">
                    30 giây 01 kỳ mở thưởng
                </span>
            </div>
        </template>
    </section>
</template>
<script>
    import { mapGetters } from 'vuex'
    import { getData } from '@V/SalesTime/config/data'
    export default {
        name: 'LotteryStatus',
        computed: {
            ...mapGetters([
                'VN_isLocal',
                'VN_lotteryId',
                'lang'
            ]),
            getDataArr() {
                return getData()
            },
            // 取得販售時間資料
            getSellTime() {
                return this.getDataArr['VN_ALL'][this.VN_lotteryId]
            }
        }
    }
</script>