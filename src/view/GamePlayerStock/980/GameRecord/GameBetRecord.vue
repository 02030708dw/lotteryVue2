<template>
    <div class="c_table  c_table--secondary  c_table--hover">
        <table>
            <thead>
                <tr>
                    <th>
                        <!-- {{$t("投注时间")}} -->
                        {{$t('common_096')}}
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
                        <!-- {{$t("奖期")}} -->
                        {{$t('common_099')}}
                    </th>
                    <th>
                        <!-- {{$t("投注内容_")}} -->
                        {{$t('common_100')}}
                    </th>
                    <th>
                        <!-- {{$t("投注金额_")}} -->
                        {{$t('common_061')}}
                    </th>
                    <th>
                        <!-- {{$t("中奖金额_")}} -->
                        {{$t('common_101')}}
                    </th>
                </tr>
            </thead>
            <tbody v-if="isShowList">
                <tr v-for="(item, index) in recentFive" :key="index" @click="showDetail(index, item)">
                    <td>{{time(item.created_at)}}</td>
                    <td>{{$t(item.i18n_lottery_name_key)}}</td>
                    <td>{{$t(methodName(item))}}</td>
                    <td>{{item.issue}}</td>
                    <td>
                        {{updateTransCode(item)}}
                        <div class="text_color_accent_invert" v-if="!updateTransCode(item)">
                            <!-- {{$t("详细号码")}} -->
                            {{$t('common_104')}}
                        </div>
                    </td>
                    <td>{{formatNumber(item.total_price)}}</td>
                    <td>{{formatNumber(item.bonus)}}</td>
                </tr>
                <tr v-if="infoList.length>5">
                    <td colspan="7">
                        <p class="c_table__link--more" @click="toGameInfo">
                            <!-- '更多投注记录' -->
                            {{$t('common_103')}}
                        </p>
                    </td>
                </tr>

            </tbody>
            <tfoot v-else>
                <tr>
                    <td colspan="7">
                        <!-- {{$t("当前没有投注记录")}} -->
                        {{$t('common_102')}}
                    </td>
                </tr>

            </tfoot>
        </table>
    </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { componentBox } from '@UTIL'
import { betStatusCls, methodName } from '@UTIL/presenter'

export default {
    name: 'GameBetRecord',
    destroyed() {
        this[_M.SET_HEADER_NAV_IS_BACK](false)
    },
    props: {
        trans: Function,
        formatNumber: Function,
        updateTransCode: Function
    },
    computed: {
        ...mapGetters([
            'gameInfoList',
            'lotteryList2',
            'jsDynamicConfig'
        ]),
        infoList() {
            const { data } = this.gameInfoList
            if (!data) {
                return []
            }
            return data.list
        },
        recentFive() {
            return this.infoList.slice(0, 5)
        },
        isShowList() {
            if (!this.gameInfoList) {
                return false
            }
            return this.gameInfoList.data && this.gameInfoList.pagination.totalNumber > 0
        }
    },
    methods: {
        ...mapActions([
            _M.SET_GAME_INFO_DETAIL_INDEX,
            _M.SET_HEADER_NAV_IS_BACK,
            _M.CLEAR_GAME_INFO_DATA
        ]),
        showDetail(index, {lottery_id}) {
            // 根據不同彩種設定lotteryCountry, 去變更投注詳情的模板
            const menuId = this.lotteryList2[lottery_id].menuId
            let country = 'cn'
            switch (menuId) {
                case 3:
                    country = 'vn'
                    break
                case 5:
                    country = 'ft'
                    break
                case 1:
                case 2:
                case 4:
                default:
                    country = 'cn'
                    break
            }
            this.$root.$emit('setLotCountry', country)

            this[_M.SET_GAME_INFO_DETAIL_INDEX](index)
            this.$msg(componentBox({
                beforeConfirm: () => this[_M.SET_GAME_INFO_DETAIL_INDEX](-1)
            }))
        },
        toGameInfo() {
            localStorage.setItem('lotteryType', 'STOCK')
            this.$router.push('/GameInfo')
        },
        statusCls(item) {
            return betStatusCls(item)
        },
        methodName(method) {
            return methodName(method)
        },
        time(item) {
            return item.substring(11, item.length)
        }
    }

}
</script>
