<template>
    <div ref="content" class="gr_container gr_page__content bg_primary">
        <div class="table_default table_stripe table_hover_bg">
            <table>
                <tbody v-if="walletList.length">
                    <tr v-for="(item, index) in tempList" :key="index">
                        <td>
                            <div>{{$t(item.action_time)}}</div>
                            <div>
                                {{$t(item.order_type_name_key)}}
                                <span class="u_f--right" v-if='item.att === "expense"'>-{{formatNumber(item.amount)}}</span>
                                <span class="u_f--right" v-else>+{{formatNumber(item.amount)}}</span>
                            </div>
                            <div>
                                <span class="text_color_weak">
                                    <!-- {{$t("可用余额")}} -->
                                    {{$t('wallet_022')}}
                                </span>
                                <span class="u_f--right">{{formatNumber(item.available_balance)}}</span>
                            </div>
                        </td>
                    </tr>
                </tbody >
                <tfoot v-else>
                    <tr>
                        <!-- "查无资料" : "请选择条件后进行查询" -->
                        <td>{{$t(getWalletData.isSearch ? "wallet_024" : "wallet_023")}}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
        <div class="u_p--t10 u_p--b10 u_t--center" v-show="getWalletInfoLoading"><i class="el-icon-loading" /></div>
    </div>
</template>
<script>
import WalletList from '../980/WalletList'
import { Observable } from 'rxjs/Observable'
import PageNation from '../980/PageNation'
import { mapGetters } from 'vuex'

export default {
    name: 'WalletList',
    mixins: [WalletList, PageNation],
    subscriptions() {
        const scroll = Observable.fromEvent(window, 'scroll') // mobile
        const scrollBody = Observable.fromEvent(document.body, 'scroll') // 320 window
        return {
            loadMore$: Observable
                .merge(scroll)
                .filter(() => !this.getWalletInfoLoading && this.walletList.length)
                .pluck('currentTarget')
                .filter(({ scrollY, innerHeight }) => (scrollY + innerHeight) > (this.$refs.content.offsetHeight - 150))
                .filter(() => this.totalPage >= this.page + 1)
                .do(() => this.search(this.page + 1)),
            loadMorePC$: Observable
                .merge(scrollBody)
                .filter(() => !this.getWalletInfoLoading && this.walletList.length)
                .pluck('currentTarget')
                .filter((body) => body.scrollTop > this.$refs.content.offsetHeight - 949)
                .filter(() => this.totalPage >= this.page + 1)
                .do(() => this.search(this.page + 1)),
            scroll$: Observable
                .merge(scrollBody)
                .merge(scroll)
                .throttleTime(1000)
                .do(() => {
                    // 滾動的時候關閉下拉選單
                    this.$parent.$children
                        .find((vue) => vue.$options._componentTag === 'Controllers')
                        .$children.forEach((select) => {
                            select.$options._componentTag === 'el-select' && (select.visible = false)
                        })
                })
        }
    },
    computed: {
        ...mapGetters([
            'getWalletTempList'
        ]),
        tempList() {
            let arr = []
            for (let i = 1; this.page >= i; i++) {
                if (this.getWalletTempList[i]) {
                    arr = [...arr, ...this.getWalletTempList[i].data.list]
                }
            }
            return arr
        }
    }
}
</script>
