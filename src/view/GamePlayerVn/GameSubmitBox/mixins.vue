<style lang="scss" scoped>
@import '~@CSS/main.scss';

$gr_header-height: 44px;
$gr_games-header-height: 67px;
$gr_game-statistics-height: 48px;
$gr_game-controlls: 47px;

.gr_container {
    padding: #{$gr_games-header-height + 10px} 15px 77px;
    & .header {
        line-height: 29px;
        margin-bottom: 10px;
        & button {
            width: calc(100% / 3 - 8px);
        }
    }
    & .content {
        border: 1px solid border_color(dark);
        font-size: $font_size_small;
        margin: 0 0 15px;
        padding: 5px 0;
        & .content_inner {
            height: calc(100vh - #{ $gr_header-height + $gr_games-header-height + $gr_game-statistics-height + $gr_game-controlls + 74px});
            overflow-y: scroll;
            & .list {
                border-color: border_color(light);
                border-bottom-style: solid;
                border-bottom-width: 1px;
                padding: 5px 35px 5px 15px;
                position: relative;
                & .reSelectClick{
                    position: absolute;
                    top: 0;
                    left: 0;
                    height: 100%;
                    width: 100px;
                    background: transparent;
                    cursor: pointer;
                }
                & .play_text {
                    width: 100%;
                    display: inline-block;
                }
                & strong {
                    padding-left: 0px;
                }
                & > div {
                    line-height: 22px;
                    & a i {
                        color: lighten($color_default, 70%);
                        height: 77px;
                        line-height: 77px;
                        text-align: center;
                        position: absolute;
                        top: 0;
                        right: 0;
                        width: 35px;
                    }
                }
                &.active {
                    background: backgrounds(secondary_heavy);
                    & i {
                        color: lighten($color_secondary, 7.5%);
                    }
                }
                & .show_order {
                    color: #fb8032;
                    display: inline-block;
                    height: 14px;
                    white-space: nowrap;
                    line-height: 14px;
                    vertical-align: text-bottom;
                }
                & .show_detail {
                    display: inline;
                    position: relative;
                    & a {
                      white-space: nowrap;
                    }
                    & .list_detail {
                        @include size(180px, 100px);
                        border: 1px solid border_color(primary_dark);
                        background: backgrounds(primary);
                        position: absolute;
                        top: 110%;
                        z-index: 1;
                        & div {
                            padding: 0 35px 0 10px;
                            position: relative;
                            white-space: nowrap;
                            & + div {
                                height: 70px;
                                overflow: auto;
                                padding: 0 10px;
                                word-wrap: break-word;
                            }
                        }
                        & i {
                            cursor: pointer;
                            position: absolute;
                            top: 50%;
                            right: 10px;
                            transform: translateY(-50%);
                        }

                        &.right {
                            right: 0;
                        }

                        &.left {
                            left: 0;
                        }
                    }
                }
            }
            & .stop {
                background: #fecacb;
            }
            @include multi-lang {
                $gr_game-statistics-height: 80px;
                $gr_game-controlls: 60px;
                height: calc(100vh - #{ $gr_header-height + $gr_games-header-height + $gr_game-statistics-height + $gr_game-controlls + 74px});
            }
        }
    }
}
</style>
<script>
import { formatNumber } from '@UTIL'
import MessageBox from '@C/MessageBox/main'
import { mapGetters, mapActions } from 'vuex'
import TbCom from '../components/TbCom'
import TbTd from '../components/TbTd'
export default {
    name: 'mixins',
    mixins: [MessageBox],
    components: {
        TbCom,
        TbTd
    },
    props: {
        zIndex: {
            type: Number,
            default: 1998
        }
    },
    data() {
        return {
            tableTitle: [
                '#',
                'popup_109', // 投注号码
                'vn_t_008', //地区
                'popup_031', //玩法
                'popup_111', //开奖日期
                'popup_007', //投注內容
                'popup_009', //投注金额
                'popup_117' //总额
            ],
            localTableTitle: [
                '#',
                'popup_109', // 投注号码
                'popup_031', //玩法
                'popup_032', //獎期
                'popup_007', //投注內容
                'popup_009', //投注金额
                'popup_117' //总额
            ],
            isShowLocalCancelBtn: true,
            isShowLocalCloseIcon: true
        }
    },
    watch: {
        RWDMode() {
            this.RWDMode !== 1 && this.reSetStore()
        }
    },
    methods: {
        ...mapActions([_M.GAME_ORDER_VN_SUBMIT_REMOVE, _M.GAME_ORDER_VN_SUBMIT, _M.FILTER_NUMBER_VN]),
        async confirm() {
            if (this.VN_StopNumberFastFilter.length) {
                return this[_M.FILTER_NUMBER_VN]()
            }

            if (this.isConfirm) {
                return
            }
            this.isConfirm = true
            this.isEscClose = false
            const errorCode = await this.beforeConfirm(this)
            // errorCode === 0 && this.$root.$emit('reset320Times')
            this.reSetStore()
            this.handleClose()
        },
        // mapCity(city) {
        //     return city
        //         .map(({cityId}) => this.$t(this.VN_cityData[cityId]))
        //         .join(',')
        // },
        handleRemove(i, money) {
            this[_M.GAME_ORDER_VN_SUBMIT_REMOVE]({ index: i, money })
        },
        transIssue(issue) {
            const data = issue.split('-')[0]
            const date = moment(data)
            return `${date.format('MM-DD')} (${this.$t(this.VN_week[date.day()])})`
        },
        isStopClass(methodId, cityId, issue) {
            let obj = {}
            if (this.VN_nowblockedId[methodId] || this.VN_nowblockedId[cityId]) {
                obj.stop = true
            } else if (this.VN_nowStopId[methodId + (this.VN_localIssue || issue)] || this.VN_nowStopAndOverId[methodId + (this.VN_localIssue || issue)]) {
                obj.stop = true
            }
            return obj
        },
        hasStop({cityId, issue, methodId, codes}) {
            if (this.VN_stopNumberCalc[`${cityId}_${issue}_${methodId}`]) {
                let bool = false
                this.VN_stopNumberCalc[`${cityId}_${issue}_${methodId}`].forEach((code) => {
                    if (codes.includes(code)) {
                        bool = true
                    }
                })
                return bool
            } else {
                return false
            }
        }
    },
    computed: {
        ...mapGetters([
            'RWDMode',
            'isShowDemo',
            'lotteryMenu',
            'availableBalance',
            'VN_week',
            'VN_isLocal',
            'VN_cityData',
            'VN_localIssue',
            'VN_nowStopId',
            'VN_nowStopAndOverId',
            'VN_nowblockedId',
            'VN_gameSubmit',
            'VN_currentArea',
            'VN_currentMethod',
            'VN_currentlottery',
            'currencySymbol',
            'VN_StopNumberFilter',
            'VN_StopNumberFastFilter',
            'VN_stopNumberCalc'
        ]),
        isConfirmButton() {
            // return 0
            return (
                parseFloat(this.availableBalance.toString().replace(/,/g, '')) >=
        (+this.VN_gameSubmit.ltMoneyAmout).strip()
            )
        },
        balance() {
            return formatNumber(this.availableBalance) || '0'
        },
        ltMoneyAmout() {
            return formatNumber((+this.VN_gameSubmit.ltMoneyAmout).strip())
        },
        showList() {
            return this.VN_gameSubmit.showList
        },
        order() {
            return this.VN_gameSubmit.order
        },
        isCurrent() {
            return this.VN_gameSubmit.isCurrent
        },
        totalNum() {
            let num = 0
            this.VN_gameSubmit.showList.forEach(
                ({ id, orderId }) => (num += this.order[id][orderId].nums)
            )
            return num
        },
        currentTitle() {
            return this.VN_isLocal ? this.localTableTitle : this.tableTitle
        },
        isShowCancelBtn() {
            return this.isShowLocalCancelBtn
        },
        isShowCloseIcon() {
            return this.isShowLocalCloseIcon
        },
        isStop() {
            return this.showList.find(({methodId, issue}) => this.VN_nowStopId[methodId + (this.VN_localIssue || issue)] || this.VN_nowStopAndOverId[methodId + (this.VN_localIssue || issue)])
        },
        isBlocked() {
            return this.showList.find(({methodId, cityId}) => this.VN_nowblockedId[methodId] || this.VN_nowblockedId[cityId])
        }
    // ltIssueStart() {
    //     return this.gameSubmit.ltIssueStart
    // },
    }
}
</script>
