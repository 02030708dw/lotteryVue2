<template>
    <div class="gr_container  gr_game-record">
        <el-tabs type="card">
            <!-- $t('投注记录') -->
            <el-tab-pane :label="$t('common_095')" name="0">
                <GameBetRecord
                    :trans="trans"
                    :formatNumber="formatNumber"
                    :updateTransCode="updateTransCode"
                />
            </el-tab-pane>
            <!-- $t('追号记录') -->
            <!-- <el-tab-pane :label="$t('common_105')" name="1" v-if="isShowTaskButton">
                <GameTraceRecord
                    :trans="trans"
                    :formatNumber="formatNumber"
                    :updateTransCode="updateTransCode"
                />
            </el-tab-pane> -->
        </el-tabs>
    </div>
</template>
<script>
import GameBetRecord from './GameBetRecord'
import GameTraceRecord from './GameTraceRecord'
import { formatNumber } from '@UTIL'
import { parseDanto, parseUnit } from '@UTIL/presenter'
import { mapGetters } from 'vuex'
export default {
    name: 'GameRecord',
    components: {
        GameBetRecord,
        GameTraceRecord
    },
    methods: {
        formatNumber(number) {
            return formatNumber(number)
        },
        updateTransCode(item) {
            return parseDanto(item, 5, this.lotteryList2[item.lottery_id].name)
        },
        trans(code, lottetyId) {
            return parseUnit(code, 5, this.lotteryList2[lottetyId].name)
        }
    },
    computed: {
        ...mapGetters([
            'userType',
            'lotteryList2',
            'isShowTaskButton'
        ])
    }
}
</script>