<template>
    <div ref="content" class="gr_container gr_score-board">
        <div class="gr_board_title"><img :src="getPicPath"></div>
        <div class="gr_board_list">
            <ul class="gr_board_tab">
                <!-- '投注金额排行' -->
                <li class="gr_board_tab--item gr_board_icon--bet"
                    :class="{active: whichList === 0}"
                    @click="whichList = 0"
                ><div><span>{{$t('celebrity_002')}}</span></div></li>
                <!-- '中奖金额排行' -->
                <li class="gr_board_tab--item gr_board_icon--win"
                    :class="{active: whichList === 1}"
                    @click="whichList = 1"
                ><div><span>{{$t('celebrity_003')}}</span></div></li>
            </ul>
            <div class="gr_board_table--scroll">
                <table :class="`gr_board_table gr_table_style--${whichList === 0?'bet':'win'}`">
                    <thead>
                        <tr>
                            <!-- '名次' -->
                            <th>{{$t('celebrity_004')}}</th>
                            <!-- '玩家' -->
                            <th>{{$t('celebrity_005')}}</th>
                            <!-- '日投注金额' -->
                            <th>{{$t(whichList === 0 ? 'celebrity_006' : 'celebrity_007')}}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="{nickname, amount} in getBoardList">
                            <td class="gr_board_rank--icon"></td>
                            <td>{{nickname}}</td>
                            <td>{{formatNumber(amount)}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div v-if="getBoardList.length < 1" class="gr_board_empty">
                <!-- 查无资料 -->
                <span>{{$t('bettingrc_031')}}</span>
            </div>
            <div class="gr_board_update">
                <!-- '金额以整数计算' -->
                <span>{{$t('celebrity_008')}}</span>
                <!-- '更新时间' -->
                <span>{{$t('celebrity_009')}}：{{getScoreBoardUpdateTime}}</span>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import {formatNumber} from '@UTIL'

export default {
    name: 'InfoList',
    data() {
        return {
            // 0:getOrderScoreBoard, 1:getWinningScoreBoard
            whichList: 0
        }
    },
    computed: {
        ...mapGetters([
            'isScoreBoardLoading',
            'getScoreBoardUpdateTime',
            'getOrderScoreBoard',
            'getWinningScoreBoard',
            'lang'
        ]),
        getBoardList() {
            const listArr = ['getOrderScoreBoard', 'getWinningScoreBoard']
            return this[listArr[this.whichList]] || []
        },
        getPicPath() {
            const staticPath = this.$route.name === 'home' ? 'static' : '../static'
            return `${staticPath}/image/scoreboard/${this.lang}/board_header.png`
        }
    },
    methods: {
        formatNumber(num) {
            return formatNumber(num)
        }
    }
}
</script>