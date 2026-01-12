<template>
    <div class="gr_games-th-header--video  gr_container">
        <div class="gr_games-header__inner">
            <MyFavoritesIcon />
            <LotteryLogo />
            <div class="gr_games-th-header__square gr_games-th-header__square--medium">
                <div v-if="isOpen">
                    <!-- 第{0}期 -->
                    <i18n path="common_001" tag="span">
                        <strong place="0">{{ numberFormat }}</strong>
                    </i18n>
                    <span>
                        <!-- {{$t("投注截止时间")}} -->
                        {{$t('common_002')}}
                    </span>
                </div>
                <div v-else>
                    <!-- {{$t("目前尚未开放奖期")}} -->
                    {{$t('common_003')}}
                </div>
                <FlipTimer />
            </div>
            <div class="gr_games-th-header__square gr_games-th-header__square--long">
                <div class="gr_games-th-header__warp">
                    <!-- 第{0}期 -->
                    <i18n path="common_001" tag="span">
                        <strong class="u_f--bold" place="0">{{TH_lastnumber}}</strong>
                    </i18n>
                    <span>
                        <!-- {{$t("开奖号")}} -->
                        {{$t('common_005')}}
                    </span>
                    <div
                        class="gr_games-th-header__number  gr_game-info__number"
                        :class="{is_active: !$parent.$parent.historyToggle}"
                        ref="initPos"
                        @click.stop="$parent.$parent.handleHistoryToggle($event)"
                    >
                        <div class="gr_number__content">
                            <dl class="gr_number__content--item">
                                <dt class="gr_number__item--title">{{$t('thai_012')}}</dt>
                                <dt class="gr_number__item--title">{{$t('thai_004')}}</dt>
                                <dt class="gr_number__item--title">{{$t('thai_005')}}</dt>
                                <dt class="gr_number__item--title">{{$t('thai_013')}}</dt>
                            </dl>
                            <dl class="gr_number__content--item">
                                <dd class="gr_number__item--content">
                                    <span>{{lastNumber[0]}}</span>
                                </dd>
                                <dd class="gr_number__item--content">
                                    <span>{{lastNumber[1]}}</span>
                                    <span>{{lastNumber[2]}}</span>
                                </dd>
                                <dd class="gr_number__item--content">
                                    <span>{{lastNumber[3]}}</span>
                                    <span>{{lastNumber[4]}}</span>
                                </dd>
                                <dd class="gr_number__item--content">
                                    <span>{{lastNumber[5]}}</span>
                                </dd>
                            </dl>
                        </div>
                        <div class="gr_number__footer">
                            <i class="el-icon-arrow-down"/>
                        </div>
                    </div>
                </div>

                <LotteryPeriod />
                <div class="gr_square__video-player" @click="videoToggle">
                    <div
                        class="gr_video-player__tip"
                        v-if="isShowTip"
                    >
                        <!-- 下次预设为开启视频 : 下次预设为关闭视频  -->
                        {{isShowVideo ? $t("common_012") : $t("common_013")}}
                    </div>
                    <div
                        class="gr_video-player__icon"
                        :class="{is_active: isShowVideo}"
                    />
                    <div class="gr_video-player__text">{{$t(isShowVideoText)}}</div>
                </div>
            </div>
            <LotteryStatus />
        </div>
        <div class="gr_animation__youtube" v-if="isShowVideo">
            <iframe
                src="https://www.youtube.com/embed/live_stream?channel=UC0xykk-LCkhdxjFl2gdMkkQ&autoplay=1"
                frameborder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
            />
            <div
                class="gr_animation__prompt"
                @click="hiddenPrompt"
                v-show="isShowPrompt"
            >
                ★{{$t('popup_052')}}
                <i class="gr_prompt__close  el-icon-close" />
            </div>
        </div>

    </div>
</template>

<script>
import LotteryLogo from './LotteryLogo'
import LotteryPeriod from './LotteryPeriod'
import LotteryStatus from './LotteryStatus'
import MyFavoritesIcon from './MyFavoritesIcon'
import FlipTimer from './FlipTimer'
import { Storage } from '@API'
import { setStorage, getStorage } from '@UTIL'
import { mapGetters, mapActions } from 'vuex'
export default {
    name: 'GamesHeaderVideo',
    data() {
        // 真人視頻
        return {
            isShowVideo: false,
            isShowTip: false,
            iframeIsShow: {},
            isShowPrompt: true
        }
    },
    components: {
        LotteryLogo,
        FlipTimer,
        LotteryPeriod,
        LotteryStatus,
        MyFavoritesIcon
    },
    beforeMount() {
        // 有遊戲視頻的話
        if (+this.lotteryId === 242) {
            this.iframeIsShow = getStorage(Storage.iframeIsShow) || {}
            this.isShowVideo = !!this.iframeIsShow[this.lotteryId]
        }
    },
    subscriptions() {
        return {
            search$: this.$createObservableMethod('videoToggle')
                .throttleTime(1000)
                .do(() => {
                    this.isShowVideo = !this.isShowVideo
                    //如果是小遊戲視頻則記憶是否預設開啟
                    this.iframeIsShow[this.lotteryId] = this.isShowVideo
                    setStorage(Storage.iframeIsShow, this.iframeIsShow)
                    this.isShowTip = true
                    setTimeout(() => {
                        this.isShowTip = false
                    }, 1000)
                })
        }
    },
    methods: {
        ...mapActions([
        ]),
        hiddenPrompt() {
            this.isShowPrompt = false
        }
    },
    computed: {
        ...mapGetters([
            'TH_lastnumber',
            'TH_lastballs',
            'TH_number',
            'TH_lotteryId'
        ]),
        isOpen() {
            return !!this.TH_number && this.TH_number !== 'null'
        },
        lotteryId() {
            return this.$route.params.lottery
        },
        lastNumber() {
            return this.TH_lastballs.split(',')
        },
        isShowVideoText() {
            // console.log(this.iframeGame)
            // '关闭视频' : '视频开号'
            return this.isShowVideo ? this.$t('common_010') : this.$t('common_009')
        },
        // 回傳格式化後的期號 ex: 20191120-002 -> 11-20 (三)
        numberFormat() {
            const rawDate = `${this.TH_number}`.split('-')[0]
            const date = moment(rawDate).format('MM-DD')
            const DAY_NAME_KEY = {
                1: 'vn_t_010',
                2: 'vn_t_011',
                3: 'vn_t_012',
                4: 'vn_t_013',
                5: 'vn_t_014',
                6: 'vn_t_015',
                7: 'vn_t_016'
            }
            // 從1開始到7
            const dayName = this.$t(DAY_NAME_KEY[moment(rawDate).format('E')])
            return (+this.TH_lotteryId === 242) ? `${date} (${dayName})` : this.TH_number
        }
    }
}
</script>
