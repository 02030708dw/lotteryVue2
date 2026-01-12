<template>
    <div ref="content" class="gr_container gr_page__content bg_primary" >
        <div class="table_default table_stripe table_hover_bg">
            <table>
                <tbody v-if="isShowList">
                    <tr v-for="(item, index) in tempList" :key="index">
                        <td @click="showDetail(index)">
                            <div class="u_p--t10">
                                <!-- API KEY -->
                                <span>{{$t(item.i18n_lottery_name_key)}}</span>
                                <span>[{{$t(keyObj[item.i18n_method_lv1_name])}} - {{$t(item.method_name_key)}}]</span>
                            </div>
                            <div class="u_p--b10">
                                <span>{{$t("popup_032")}}: {{item.issue}}</span>
                                <span class="u_f--right" :class="statusCls(item)">
                                    {{$t(prizeStateText(item))}}
                                </span>
                            </div>
                            <i class="el-icon-arrow-right" />
                        </td>
                    </tr>
                </tbody>
                <tfoot v-else>
                    <tr>
                        <!-- 请选择条件后进行搜索 & 查无资料 -->
                        <td>{{$t($route.params.search ? 'bettingrc_031' : 'bettingrc_030')}}</td>
                    </tr>
                </tfoot>

            </table>
        </div><!-- table_default table_stripe -->
        <div class="u_p--t10 u_p--b10 u_t--center" v-show="gameInfoIsLoading"><i class="el-icon-loading" /></div>
    </div><!-- gr_page__content -->
</template>

<script>
import InfoList from '../980/InfoList'
import PageNation from '../980/PageNation'
import { Observable } from 'rxjs/Observable'
import { mapGetters } from 'vuex'

export default {
    name: 'InfoList_la',
    mixins: [InfoList, PageNation],
    data() {
        return {
            keyObj: {
                '1D': 'thai_011',
                '2D': 'thai_010',
                '3D': 'thai_009'
            }
        }
    },
    subscriptions() {
        const scroll = Observable.fromEvent(window, 'scroll') // mobile
        const scrollBody = Observable.fromEvent(document.body, 'scroll') // 320 window
        return {
            loadMore$: Observable
                .merge(scroll)
                .filter(() => !this.gameInfoIsLoading && this.isShowList)
                .pluck('currentTarget')
                .filter(({ scrollY, innerHeight }) => (scrollY + innerHeight) > (this.$refs.content.offsetHeight - 150))
                .filter(() => this.totalPage >= this.page + 1)
                .do(() => this.search(this.page + 1)),
            loadMorePC$: Observable
                .merge(scrollBody)
                .filter(() => !this.gameInfoIsLoading && this.isShowList)
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
                        .find((vue) => vue.$options._componentTag === 'Controls')
                        .$children.forEach((select) => {
                            select.$options._componentTag === 'el-select' && (select.visible = false)
                        })
                })
        }
    },
    computed: {
        ...mapGetters([
            'gameTempInfo'
        ]),
        tempList() {
            let arr = []
            for (let i = 1; this.page >= i; i++) {
                if (this.gameTempInfo[i]) {
                    arr = [...arr, ...this.gameTempInfo[i].data.list]
                }
            }
            return arr
        }
    }
}
</script>
