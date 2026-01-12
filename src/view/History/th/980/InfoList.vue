<template>
    <div class="gr_history__info" ref="content" v-loading.body="getHBLoading" :element-loading-text="$t('home_020')">
        <div class="gr_info__list gr_th_history">
            <div class="gr_list__content">
                <template v-if="(getHBList || []).length > 0">
                    <div
                        class="gr_list__number"
                        :class="{'is_active': pnIndex === index}"
                        v-for="(item, index) in getHBList"
                        :key="index"
                    >
                        <div class="gr_number__header u_f--bold">
                            {{$t('common_001', { 0: item.issue })}}
                            <i class="el-icon-close" @click="closePrizeNun" />
                        </div>
                        <div class="gr_number__content">
                            <dl class="gr_number__content--item">
                                <!-- 头奖 -->
                                <dt>{{$t('thai_012')}}</dt>
                                <!-- 前三 -->
                                <dt>{{$t('thai_004')}}</dt>
                                <!-- 后三 -->
                                <dt>{{$t('thai_005')}}</dt>
                                <!-- 二星 -->
                                <dt>{{$t('thai_013')}}</dt>
                            </dl>
                            <dl class="gr_number__content--item">
                                <!-- 头奖 -->
                                <dd>{{historyCode(item.code)[0]}}</dd>
                                <dd>
                                    <!-- 前三 -->
                                    <span>{{historyCode(item.code)[1]}}</span>
                                    <span>{{historyCode(item.code)[2]}}</span>
                                </dd>
                                <dd>
                                    <!-- 后三 -->
                                    <span>{{historyCode(item.code)[3]}}</span>
                                    <span>{{historyCode(item.code)[4]}}</span>
                                </dd>
                                <!-- 二星 -->
                                <dd>{{historyCode(item.code)[5]}}</dd>
                            </dl>
                        </div>
                        <div class="gr_number__openBtn" @click="openPrizeNun(index)">
                            <i class="el-icon-arrow-down" />
                        </div>
                        <div class="gr_number__prizeNun" :class="{'is_active': pnIndex === index}">
                            <div class="gr_number__prizeNun--title u_f--bold">
                                <!-- 中奖号码 -->
                                {{$t('thai_014')}}
                            </div>
                            <div class="gr_number__header u_f--bold">
                                <!-- 3D -->
                                {{$t('thai_009')}}
                            </div>
                            <div class="gr_number__content-prizeNun">
                                <dl class="gr_number__content--item">
                                    <!-- 头 -->
                                    <dt>{{$t('thai_001')}}</dt>
                                    <dd>
                                        <span>{{historyCode(item.code)[0].slice(3)}}</span>
                                        <span></span>
                                        <span></span>
                                    </dd>
                                </dl>
                                <dl class="gr_number__content--item">
                                    <!-- 前三 -->
                                    <dt>{{$t('thai_004')}}</dt>
                                    <dd>
                                        <span>{{historyCode(item.code)[1]}}</span>
                                        <span>{{historyCode(item.code)[2]}}</span>
                                        <span></span>
                                    </dd>
                                </dl>
                                <dl class="gr_number__content--item">
                                    <!-- 后三 -->
                                    <dt>{{$t('thai_005')}}</dt>
                                    <dd>
                                        <span>{{historyCode(item.code)[3]}}</span>
                                        <span>{{historyCode(item.code)[4]}}</span>
                                        <span></span>
                                    </dd>
                                </dl>
                                <dl class="gr_number__content--item" style="height: 61px">
                                    <!-- 头奖组选 -->
                                    <dt>{{$t('thai_003')}}</dt>
                                    <dd>
                                        <span
                                            v-for="code in groupSplit(historyCode(item.code)[0].slice(3))"
                                            :class="{bigH: groupSplit(historyCode(item.code)[0].slice(3)).length <= 3}"
                                        >
                                            {{code}}
                                        </span>
                                    </dd>
                                </dl>
                            </div>
                            <div class="gr_number__header u_f--bold">
                                <!-- 2D -->
                                {{$t('thai_010')}}
                            </div>
                            <div class="gr_number__content-prizeNun">
                                <dl class="gr_number__content--item">
                                    <!-- 头 -->
                                    <dt>{{$t('thai_001')}}</dt>
                                    <dd>
                                        <span>{{historyCode(item.code)[0].slice(4)}}</span>
                                        <span></span>
                                        <span></span>
                                    </dd>
                                </dl>
                                <dl class="gr_number__content--item">
                                    <!-- 尾 -->
                                    <dt>{{$t('thai_002')}}</dt>
                                    <dd>
                                        <span>{{historyCode(item.code)[5]}}</span>
                                        <span></span>
                                        <span></span>
                                    </dd>
                                </dl>
                                <dl class="gr_number__content--item">
                                    <!-- 头奖组选 -->
                                    <dt>{{$t('thai_003')}}</dt>
                                    <dd>
                                        <span
                                            v-for="code in groupSplit(historyCode(item.code)[0].slice(3))"
                                            :class="{bigH: groupSplit(historyCode(item.code)[0].slice(3)).length <= 3}"
                                        >
                                            {{code.slice(0, 2)}}
                                        </span>
                                    </dd>
                                </dl>
                            </div>
                            <div class="gr_number__header u_f--bold">
                                <!-- 1D -->
                                {{$t('thai_011')}}
                            </div>
                            <div class="gr_number__content-prizeNun">
                                <dl class="gr_number__content--item">
                                    <!-- 头 -->
                                    <dt>{{$t('thai_001')}}</dt>
                                    <dd>
                                        <span v-for="code in historyCode(item.code)[0].slice(3, 6).split('').unique().join('')">{{code}}</span>
                                        <span v-if="historyCode(item.code)[0].slice(3, 6).split('').unique().join('').length === 1"></span>
                                    </dd>
                                </dl>
                                <dl class="gr_number__content--item">
                                    <!-- 尾 -->
                                    <dt>{{$t('thai_002')}}</dt>
                                    <dd>
                                        <span v-for="code in historyCode(item.code)[5].slice(0, 2).split('').unique().join('')">{{code}}</span>
                                        <span></span>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </template>
                <div v-else>
                    <!-- 当前查询没有任何数据 -->
                    {{$t('trend_054')}}
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
// 關閉開關
.gr_number__openBtn {
    display: none;
}
.gr_th_history .gr_list__content .gr_list__number .gr_number__prizeNun {
    position: relative;
    display: block;
}
//
</style>
<script>
import { mapActions, mapGetters } from 'vuex'
import { Observable } from 'rxjs/Observable'
export default {
    name: 'HistoryInfoList',
    data() {
        return {
            pnIndex: -1,
            isLoading: false
        }
    },
    subscriptions() {
        const scrollBody = Observable.fromEvent(document.body, 'scroll') // 320
        const scroll = Observable.fromEvent(window, 'scroll') // mobile, 980
        return {
            loadMore$: Observable
                .merge(scrollBody)
                .pluck('target')
                .filter(({scrollTop, offsetHeight, scrollHeight}) => {
                    // 載入中不打API, IE 不支援scrollY
                    return !this.isLoading &&
                    (scrollTop + offsetHeight) === scrollHeight &&
                     // 當天第一期為 1
                     this.lastHistoryBall &&
                     this.lastHistoryBallAPI
                })
                .throttleTime(1000)
                .do(this.searchHistory),
            loadMorePC$: Observable
                .merge(scroll)
                .pluck('currentTarget')
                .filter(({innerHeight, scrollY, pageYOffset}) => {
                    // 載入中不打API, IE 不支援scrollY
                    return !this.isLoading &&
                     ((innerHeight + (scrollY || pageYOffset)) >= this.$parent.$refs.container.offsetHeight) &&
                     // 當天第一期為 1
                     this.lastHistoryBall &&
                     this.lastHistoryBallAPI
                })
                .throttleTime(1000)
                .do(this.searchHistory)
        }
    },
    computed: {
        ...mapGetters([
            'getHBList',
            'getHBLoading'
        ]),
        lastHistoryBall() {
            const list = this.getHBList
            return list.length ? list[list.length - 1].issue : null
        },
        lastHistoryBallAPI() {
            // 不繼續打 API
            let lotteryId = +this.$route.query.menuCode
            if (lotteryId === 243) {
                // 5分彩 - 該日的第001筆
                return this.lastHistoryBall.split('-')[1] !== '001'
            } else {
                // 泰國彩 - 一年區間裡的第 1 筆
                const issue = this.lastHistoryBall.split('-')[0]
                // 以起始日算出最舊的獎期
                let startTimeYMD = this.$parent.$parent.startTime.slice(0, 10).split('-')
                let y, m, d
                if (startTimeYMD[1] === '12') {
                    y = startTimeYMD[2] > '16' ? (`${(+startTimeYMD[0] + 1)}` < 10 ? `0${(+startTimeYMD[0] + 1)}` : (+startTimeYMD[0] + 1) + '') : startTimeYMD[0]
                    m = startTimeYMD[2] > '16' ? '01' : startTimeYMD[1]
                } else {
                    y = startTimeYMD[0]
                    m = startTimeYMD[2] > '16' ? (`${(+startTimeYMD[1] + 1)}` < 10 ? `0${(+startTimeYMD[1] + 1)}` : (+startTimeYMD[1] + 1) + '') : startTimeYMD[1]
                }
                d = startTimeYMD[2] > '16' ? '01' : '16'
                let ymd = y + m + d
                return ['20190816', ymd].indexOf(issue) < 0
            }
        }
    },
    methods: {
        ...mapActions([
            _M.GET_HB_LIST
        ]),
        historyCode(codeNum) {
            return codeNum.split(',')
        },
        openPrizeNun(index) {
            this.pnIndex = index
        },
        closePrizeNun() {
            this.pnIndex = -1
        },
        groupSplit(arr) {
            arr = [+arr[0], +arr[1], +arr[2]]
            let l = arr.length
            let result = []
            let str
            for (let i = 0; i < l; i++) {
                if (arr[0] === arr[1] && arr[1] === arr[2]) {
                    // 3位相等
                    result = [`${+arr[0]}${+arr[1]}${+arr[2]}`, '', '']
                } else if (arr[0] === arr[1]) {
                    result = [`${+arr[0]}${+arr[1]}${+arr[2]}`, `${+arr[0]}${+arr[2]}${+arr[1]}`, `${+arr[2]}${+arr[0]}${+arr[1]}`]
                } else if (arr[1] === arr[2]) {
                    result = [`${+arr[0]}${+arr[1]}${+arr[2]}`, `${+arr[1]}${+arr[0]}${+arr[2]}`, `${+arr[1]}${+arr[2]}${+arr[0]}`]
                } else if (arr[0] === arr[2]) {
                    result = [`${+arr[0]}${+arr[1]}${+arr[2]}`, `${+arr[1]}${+arr[0]}${+arr[2]}`, `${+arr[0]}${+arr[2]}${+arr[1]}`]
                } else {
                    for (let j = 0; j < l; j++) {
                        for (let k = 0; k < l; k++) {
                            if (arr[i] !== arr[j] && arr[i] !== arr[k] && arr[j] !== arr[k]) {
                                str = '' + arr[i] + arr[j] + arr[k]
                                result.push(str)
                            }
                        }
                    }
                }
            }
            return result
        },
        searchHistory() {
            this.isLoading = true
            this[_M.GET_HB_LIST]({
                periodNums: 20,
                lotteryId: +this.$route.query.menuCode,
                next: this.lastHistoryBall,
                startTime: this.$parent.$parent.startTime,
                endTime: this.$parent.$parent.endTime
            })
            this.isLoading = false
        }
    }
}
</script>
