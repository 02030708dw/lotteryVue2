<template>
<!-- 加载中 -->
  <div class="gr_container gr_page__content bg_primary" v-loading.body="getWalletInfoLoading" :element-loading-text="$t('home_020')">
    <div class="table_default table_stripe table_hover_bg">
      <table>
          <thead>
              <tr>
                  <th>
                        <!-- {{$t("时间")}} -->
                        {{$t('wallet_018')}}
                    </th>
                    <th>
                        <!-- {{$t("类型")}} -->
                        {{$t('wallet_019')}}
                    </th>
                    <th>
                        <!-- {{$t("支出")}} -->
                        {{$t('wallet_020')}}
                    </th>
                    <th>
                        <!-- {{$t("收入")}} -->
                        {{$t('wallet_021')}}
                    </th>
                    <th>
                        <!-- {{$t("可用余额")}} -->
                        {{$t('wallet_022')}}
                    </th>
              </tr>
          </thead>
          <tbody v-if="walletList.length">
              <tr v-for="(item, index) in walletList" :key="index">
                <td>{{item.action_time}}</td>
                <td>{{$t(getOrderKey(item.order_type_id))}}</td>
                <td>{{item.att === 'expense' ? `-${formatNumber(item.amount)}` : ''}}</td>
                <td>{{item.att === 'income' ? `+${formatNumber(item.amount)}` : ''}}</td>
                <td>{{formatNumber(item.available_balance)}}</td>
              </tr>
          </tbody>
          <tfoot v-else>
              <tr>
					<!-- "查无资料" : "请选择条件后进行查询" -->
                    <td colspan="10">{{$t(getWalletData.isSearch ? "wallet_024" : "wallet_023")}}</td>
              </tr>
          </tfoot>
      </table>
    </div>
    <PageNation v-if="isShowPageNation" />
</div>
</template>

<script>
import PageNation from './PageNation'
import { mapGetters, mapActions } from 'vuex'
import { formatNumber } from '@UTIL'
import { getOrderTypeNameKey, getOrderTypeObject } from '@UTIL/orderTypeIds'

export default {
    name: 'walletList',
    components: {
        PageNation
    },
    computed: {
        ...mapGetters([
            'getWalletInfoLoading',
            'getWalletList',
            'getWalletData',
            'getWalletDeltaAmount'
        ]),
        walletList() {
            const {
                data
            } = this.getWalletList
            if (!data) {
                return []
            }
            data.list.filter((item) => getOrderTypeObject(item.order_type_id))
                .map((item) => {
                    const obj = getOrderTypeObject(item.order_type_id)
                    if (obj) {
                        item.att = obj.att
                    }
                    return item
                })
            return data.list
        },
        isShowPageNation() {
            return this.getWalletList.data && this.getWalletList.pagination.totalNumber > 1
        },
        sumData() {
            let subIncome = 0
            let subExpense = 0
            this.walletList.forEach((item, index) => {
                if (item.att === 'income') {
                    subIncome += (parseFloat(item.amount)) * 100
                } else if (item.att === 'expense') {
                    subExpense += (parseFloat(item.amount)) * 100
                }
            })
            // 小計
            let subTotal = (subIncome - subExpense) / 100
            subIncome = (subIncome / 100) > 0 ? `+${formatNumber(subIncome / 100)}` : 0
            subExpense = (subExpense / 100) > 0 ? `-${formatNumber(subExpense / 100)}` : 0
            subTotal = (subTotal > 0 ? '+' : '') + formatNumber(subTotal)
            // 總計
            const deltaObj = {
                income: `${this.getWalletDeltaAmount.user_income_amount ? '+' : ''}${formatNumber(this.getWalletDeltaAmount.user_income_amount)}`,
                expense: `${this.getWalletDeltaAmount.user_outcome_amount ? '-' : ''}${formatNumber(this.getWalletDeltaAmount.user_outcome_amount)}`,
                total: `${this.getWalletDeltaAmount.delta_amount > 0 ? '+' : ''}${formatNumber(this.getWalletDeltaAmount.delta_amount)}`
            }

            return {
                subIncome,
                subExpense,
                subTotal,
                ...deltaObj
            }
        }
    },
    methods: {
        ...mapActions(['clearWalletList']),
        formatNumber(number) {
            return formatNumber(number)
        },
        getOrderKey(id) {
            return getOrderTypeNameKey(id)
        }
    }
}
</script>
