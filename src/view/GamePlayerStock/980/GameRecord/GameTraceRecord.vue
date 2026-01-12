<template>
    <div class="c_table  c_table--secondary  c_table--hover">
        <table>
            <thead>
                <tr>
                    <th>
                        <!-- {{$t("追号时间")}} -->
                        {{$t('common_106')}}
                    </th>
                    <th>
                        <!-- {{$t("彩种")}} -->
                        {{$t('common_097')}}
                    </th>
                    <th>
                        <!-- {{$t("玩法")}} -->
                        {{$t('popup_031')}}
                    </th>
                    <th>
                        <!-- {{$t("开始期号")}} -->
                        {{$t('common_107')}}
                    </th>
                    <!-- <th>{{$t("已追/总期数")}}</th> -->
                    <th>
                        <!-- {{$t("追号总金额")}} -->
                        {{$t('common_108')}}
                    </th>
                    <th>
                        <!-- {{$t("完成金额")}} -->
                        {{$t('common_109')}}
                    </th>
                    <th>
                        <!-- {{$t("追号内容")}} -->
                        {{$t('common_110')}}
                    </th>
                    <th>
                        <!-- {{$t("中奖即停")}} -->
                        {{$t('common_111')}}
                    </th>
                    <th>
                        <!-- {{$t("状态")}} -->
                        {{$t('common_112')}}
                    </th>
                </tr>
            </thead>
            <tbody v-if="isShowList">
                <tr v-for="(item, index) in recentFive" :key="index"  @click="redirectNew(item.task_id)">
                    <td>{{time(item.begin_time)}}</td>
                    <td>{{$t(item.i18n_lottery_name_key)}}</td>
                    <td>{{$t(methodName(item))}}</td>
                    <td>{{item.begin_issue}}</td>
                    <!-- <td>{{item.finished_count}}/{{item.issue_count}}</td> -->
                    <td>{{formatNumber(item.task_price)}}</td>
                    <td>{{formatNumber(item.finish_price)}}</td>
                    <td>
                        {{updateTransCode(item)}}
                        <div class="text_color_accent_invert" v-if="!updateTransCode(item)">
                            <!-- {{$t("详细号码")}} -->
                            {{$t('common_104')}}
                        </div>
                    </td>
                    <td>
                        <!-- '否' : '是' -->
                        {{$t(item.stop_onwin === "0" ? "common_122" : "common_121")}}
                    </td>
                    <td :class="state(item).cls">
                        {{$t(state(item).txt)}}
                    </td>
                </tr>
                <tr v-if="infoList.length>5">
                    <td colspan="9">
                        <router-link class="c_table__link--more" to="/AddNewGameInfo">
                            <!-- {{$t("更多追号记录")}} -->
                            {{$t('common_115')}}
                        </router-link>
                    </td>
                </tr>
            </tbody>
            <tfoot v-else>
                <tr>
                    <td colspan="9">
                        <!-- 当前没有追号记录 -->
                        {{$t('common_114')}}
                    </td>
                </tr>
            </tfoot>
        </table>
    </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { traceTaskStatus, methodName } from '@UTIL/presenter'

export default {
    name: 'GameTraceRecord',
    created() {
    },
    destroyed() {
        this[_M.SET_HEADER_NAV_IS_BACK](false)
        // this[_M.CLEAR_ADD_NEW_GAME_INFO_DATA]()
    },
    methods: {
        ...mapActions([
            _M.SET_HEADER_NAV_IS_BACK,
            _M.CLEAR_ADD_NEW_GAME_INFO_DATA
        ]),
        state(item) {
            return traceTaskStatus(item)
        },
        redirectNew(taskId) {
            window.open(`/AddNewGameInfoDetails/${taskId}`)
        },
        methodName(method) {
            return methodName(method)
        },
        time(item) {
            return item.substring(11, item.length)
        }
    },
    props: {
        trans: Function,
        formatNumber: Function,
        updateTransCode: Function,
        params: Object
    },
    computed: {
        ...mapGetters([
            'AddNewGameInfoList'
        ]),
        infoList() {
            const { data } = this.AddNewGameInfoList
            if (!data) {
                return []
            }
            return data.list
        },
        recentFive() {
            return this.infoList.slice(0, 5)
        },
        isShowList() {
            return this.AddNewGameInfoList.data && this.AddNewGameInfoList.pagination.totalNumber > 0
        }
    }
}
</script>
