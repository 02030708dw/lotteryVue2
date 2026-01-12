<template>
    <div class="gr_container gr_page__content bg_primary">
        <div class="table_default table_stripe">
            <table>
                <tbody v-if="!isShowList">
                    <tr v-for="item in isDateArray" :id="item.functionType" >
                        <td>
                            <div 
	                            v-for="itemChild in item.childs"
	                            class="gr_sales-time__warp"
	                            :class="{'is_active': (+itemChild.lottery === +isLotList) && isActiveNone}"
	                        >
                                <div
                                    class="gr_sales-time__title"
                                    :id="+itemChild.lottery"
                                    ref="salesTitle"
                                >
                                    {{$t(itemChild.title_key)}}
                                </div>
                                <template v-if="getDataArr[item.functionType] && getDataArr[item.functionType][itemChild.lottery]">
                                    <div class="gr_sales-time__selling" >
                                        <div class="gr_sales-time__selling--title">{{$t('timetable_001')}}</div>
                                        <div class="gr_sales-time__selling--txt">
                                            {{$t(getDataArr[item.functionType][itemChild.lottery].selling[0], {
                                                '0':getDataArr[item.functionType][itemChild.lottery].selling[1], 
                                                '1': getDataArr[item.functionType][itemChild.lottery].selling[2]}
                                            )}}
                                        </div>
                                    </div>
                                    <div class="gr_sales-time__winning">
                                        <div class="gr_sales-time__winning--title">{{$t('timetable_002')}}</div>
                                        <div class="gr_sales-time__winning--txt">
                                            {{$t(getDataArr[item.functionType][itemChild.lottery].winning[0], {
                                                '0':getDataArr[item.functionType][itemChild.lottery].winning[1], 
                                                '1': getDataArr[item.functionType][itemChild.lottery].winning[2],
                                                '2': getDataArr[item.functionType][itemChild.lottery].winning[3]}
                                            )}}
                                        </div>
                                    </div>
                                </template>

                                <!-- <template v-else>
                                    <div class="gr_sales-time__selling" >
                                        <div class="gr_sales-time__selling--title">{{$t('timetable_001')}}</div>
                                        <div class="gr_sales-time__selling--txt">
                                            {{'selling...'}}
                                        </div>
                                    </div>
                                    <div class="gr_sales-time__winning">
                                        <div class="gr_sales-time__winning--title">{{$t('timetable_002')}}</div>
                                        <div class="gr_sales-time__winning--txt">
                                            {{'winning...'}}
                                        </div>
                                    </div>
                                </template> -->
                            </div>
                        </td>
                    </tr>
                </tbody>
                <tfoot v-else>
                    <tr>
                        <!-- "请选择条件后进行搜索" -->
                        <td colspan="7">{{$t("bettingrc_030")}}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getData } from '../config/data'
import { Observable } from 'rxjs/Observable'
export default {
    name: 'InfoList',
    data() {
        return {
            isDateArray: {},
            isLotList: '',
            isLotMenu: '',
            isActiveNone: false,
            tipTimer: null,
            lotListWatch: false,
            isScroll: {
                t1: 0,
                t2: 0,
                timer: null
            }
        }
    },
    subscriptions() {
        const scroll = Observable.fromEvent(window, 'scroll') // mobile
        const scrollBody = Observable.fromEvent(document.body, 'scroll') // 320 window
        return {
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
    watch: {
        isLotList(v) {
            const salesArr = this.$refs.salesTitle.filter(e => {
                return +e.id === +v
            })
            // 彩種位置
            let lotteryY = salesArr[0] && (salesArr[0].offsetParent.offsetParent.offsetTop + salesArr[0].offsetParent.offsetTop - 82)
            // 目前卷軸位置
            let distance = document.documentElement.scrollTop || document.body.scrollTop
            let el = this.isMobile ? window : document.body
            // 近距離滾動速度 (裝置高距離)
            let ms = 15
            // 遠距離滾動速度
            let msFar = 20
            let step = lotteryY / ms
            let screenHeight = window.screen.availHeight
            if (lotteryY > distance) {
                let newTotal = lotteryY - distance
                ms = newTotal < screenHeight ? ms : msFar
                step = newTotal / ms
                smoothDown()
            } else {
                let newTotal = distance - lotteryY
                ms = newTotal < screenHeight ? ms : msFar
                step = newTotal / ms
                smoothUp()
            }
            function smoothDown () {
                if (distance < lotteryY) {
                    distance += step
                    el.scrollTo(0, distance)
                    setTimeout(smoothDown, msFar)
                } else {
                    el.scrollTo(0, lotteryY)
                }
            }
            function smoothUp () {
                if (distance > lotteryY) {
                    distance -= step
                    el.scrollTo(0, distance)
                    setTimeout(smoothUp, msFar)
                } else {
                    el.scrollTo(0, lotteryY)
                }
            }
            this.lotListWatch = true
            // 桌面模式沒有卷軸
            !this.isMobile && (this.isActiveNone = true)
        }
    },
    beforeMount() {
        this.$root.$on('lotList', this.lotList)
        this.$root.$on('lotMenu', this.lotMenu)
        this.$root.$on('dateArray', this.dateArray)
        window.addEventListener('scroll', this.handleScroll)
        document.body.addEventListener('scroll', this.handleScroll)
    },
    beforeDestroy() {
        this.$root.$off('lotList', this.lotList)
        this.$root.$off('lotMenu', this.lotMenu)
        this.$root.$off('dateArray', this.dateArray)
        window.removeEventListener('scroll', this.handleScroll)
        document.body.removeEventListener('scroll', this.handleScroll)
        clearTimeout(this.tipTimer)
        clearTimeout(this.isScroll.timer)
    },
    methods: {
        dateArray(val) {
            this.isDateArray = val
        },
        lotList(val) {
            this.isLotList = val
        },
        lotMenu(val) {
            this.isLotMenu = val
        },
        handleScroll() {
            // 偵測滾動
            clearTimeout(this.isScroll.timer)
            this.isScroll.timer = setTimeout(this.isScrollEnd, 100)
            this.isScroll.t1 = document.documentElement.scrollTop || document.body.scrollTop
            this.isActiveNone = false
        },
        isScrollEnd() {
            this.isScroll.t2 = document.documentElement.scrollTop || document.body.scrollTop
            // 偵測選單有變化 && 滾動結束再加動畫
            if (!this.isScroll.t2) {
                // 沒有捲軸
                if (this.lotListWatch) {
                    this.isActiveNone = true
                }
            } else {
                if (this.lotListWatch && (this.isScroll.t2 === this.isScroll.t1)) {
                    this.isActiveNone = true
                    this.lotListWatch = false
                }
            }
        }
    },
    computed: {
        ...mapGetters([
            'isMobile'
        ]),
        getDataArr() {
            return getData()
        },
        isShowList() {
            return Object.keys(this.isDateArray).length === 0
        }
    }
}
</script>
