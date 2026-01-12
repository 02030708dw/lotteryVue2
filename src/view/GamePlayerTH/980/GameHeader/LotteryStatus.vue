<template>
    <section class="gr_games-th-lotteryStatus">
        <template v-if="lang !== 'th'">
            <div class="gr_games-th-lotteryStatus__sold">
                <span class="gr_games-th-lotteryStatus__sold--title">
                    <!-- {{$t('贩售:')}} -->
                    {{ $t("timetable_001") }}
                </span>
                <span class="gr_games-th-lotteryStatus__sold--txt">
                    {{
                        $t(getSellTime.selling[0], {
                            "0": getSellTime.selling[1],
                            "1": getSellTime.selling[2]
                        })
                    }}
                </span>
                <span>;</span>
            </div>
            <div class="gr_games-th-lotteryStatus__time">
                <span class="gr_games-th-lotteryStatus__time--title">
                    <!-- {{$t('开奖:')}} -->
                    {{ $t("timetable_002") }}
                </span>
                <span class="gr_games-th-lotteryStatus__time--txt">
                    {{
                        $t(getSellTime.winning[0], {
                            "0": getSellTime.winning[1],
                            "1": getSellTime.winning[2],
                            "2": getSellTime.winning[3]
                        })
                    }}
                </span>
            </div>
        </template>
        <template v-else>
            <div class="gr_games-th-lotteryStatus__sold">
                <span class="gr_games-th-lotteryStatus__sold--txt">
                    {{
                        getSellTime.selling.th
                    }}
                </span>
                <span>;</span>
            </div>
            <div class="gr_games-th-lotteryStatus__time">
                <span class="gr_games-th-lotteryStatus__time--txt">
                    {{
                        getSellTime.winning.th
                    }}
                </span>
            </div>
        </template>
    </section>
</template>
<script>
    import { getData } from '@V/SalesTime/config/data'
    import { mapGetters } from 'vuex'
    export default {
        name: 'LotteryStatus',
        computed: {
            ...mapGetters([
                'lang'
            ]),
            getDataArr() {
                return getData()
            },
            // 取得販售時間資料
            getSellTime() {
                return this.getDataArr['TH_ALL'][this.$route.params.lottery]
            }
        }
    }
</script>