<template>
    <GrCol>
        <RowHeader :style="{height: setHeaderHeight, 'line-height': setHeaderHeight}">
            <!-- '地区' -->
            <GrCom>{{$t('vn_t_008')}}</GrCom>
        </RowHeader>
        <RowTitle>
            <GrRow>
                <GrCom>
                    <!-- <span class="gr_grid-vn__group-title">{{$t('开奖日期') + '：' + issue}}</span> -->
                    <ul class="gr_grid-vn__group">
                        <li class="gr_group__list"
                            v-for="(title, area) in chkTitleKey" :key="area"
                        >
                            <label class="gr_list__item" v-if="VN_lotteryOfficialSwitch[area] && !checkIsBlocked(area)">
                                <span
                                    class="gr_item__input  c_checkbox"
                                    :class="{'is_checked': titleChk[area], 'is_disabled': !VN_isOpenIssue[area] || (VN_Issue[area] !== VN_allAreaIssue)}"
                                >
                                    <span class="c_checkbox__inner" />
                                    <input
                                        type="checkbox"
                                        :checked="titleChk[area]"
                                        :disabled="!VN_isOpenIssue[area] || (VN_Issue[area] !== VN_allAreaIssue)"
                                        @change="handleChk(area, $event.target.checked)"
                                    />
                                </span>
                                <span class="gr_item__text">
                                    {{$t(title)}}
                                    <!-- '封盘' -->
                                    <span
                                        v-show="!VN_isOpenIssue[area] || (VN_Issue[area] !== VN_allAreaIssue)"
                                        class="is_close  text_color_strong"
                                    >
                                        ({{$t('home_046')}})
                                    </span>
                                </span>
                            </label>
                        </li>
                    </ul>
                </GrCom>
            </GrRow>
        </RowTitle>
    </GrCol>
</template>
<script>
    import RowHeader from './RowHeader'
    import RowTitle from './RowTitle'
    import GrRow from './GrRow'
    import GrCol from './GrCol'
    import GrCom from './GrCom'
    import { mapGetters } from 'vuex'
    import blockedFilter from '@C/games/VN/helpers/blockedFilter'
    export default {
        name: 'AllCityTitle',
        components: {
            RowHeader,
            RowTitle,
            GrRow,
            GrCol,
            GrCom
        },
        data() {
            return {
                chkTitleKey: {
                    // '全部'
                    all: 'bettingrc_002',
                    VN_S: 'vn_t_002',
                    VN_C: 'vn_t_003',
                    VN_N: 'vn_t_004'
                }
            }
        },
        props: {
            titleChk: Object,
            handleChk: Function,
            setHeaderHeight: String
        },
        methods: {
            checkIsBlocked(area) {
                return blockedFilter.checkIsBlocked(area, this)
            }
        },
        computed: {
            ...mapGetters([
                'VN_allAreaIssue',
                'VN_isOpenIssue',
                'VN_Issue',
                'VN_week',
                'VN_pos',
                'VN_area',
                'VN_gameConfig',
                'VN_subMenuIndex',
                'VN_gameMenuSub',
                'VN_lotteryOfficialSwitch'
            ])
        }
    }
</script>