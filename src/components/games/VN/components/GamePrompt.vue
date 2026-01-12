<template>
    <div class="gr_game-vn-prompt">
        <div :class="['gr_game-vn-prompt__tooltip', {is_active: isPopActive}]">
            <div
                class="gr_tooltip__item"
                @click.stop="handleIsActive()"
            >
                <i class="gr_item__icon  i_game-vn-prompt" />
                <!-- '奖金说明' -->
                <span class="gr_item__text">{{$t('vn_t_051')}}</span>
            </div>
            <div class="gr_tooltip__popper" @click.stop>
                <template v-if="isAllArea">
                    <template v-if="VN_subMenuIndex !== 1">
                        <div class="gr_popper__list">
                            <!-- 玩法 || '項目' -->
                            <div class="gr_list__item">{{$t((VN_subMenuIndex !== 2) ? 'popup_031' : 'common_066')}}</div>
                            <div class="gr_list__item" v-for="title in Object.keys(prizeTable || {})" :key="title">{{$t(title)}}</div>
                        </div>
                        <div class="gr_popper__list" v-if="VN_jsPrize.VN_S">
                            <!-- '獎金' -->
                            <div class="gr_list__item">{{$t('common_038')}}</div>
                            <div class="gr_list__item" v-for="method in allPrizeTable[VN_subMenuIndex]" :key="method">{{VN_jsPrize.VN_S[method]}}</div>
                        </div>
                    </template>
                    <template v-else>
                        <div class="gr_popper__all">
                            <div class="gr_popper__list">
                                <div class="gr_list__item">{{$t('vn_t_008')}}</div>
                                <div class="gr_list__area">{{$t(VN_areaTitle.VN_S)}}<br>{{$t(VN_areaTitle.VN_C)}}</div>
                                <div class="gr_list__area" :style="{ lineHeight }">{{$t(VN_areaTitle.VN_N)}}</div>
                            </div>
                            <div class="gr_popper__list">
                                <!-- 玩法 || '項目' -->
                                <div class="gr_list__item">{{$t((VN_subMenuIndex !== 2) ? 'popup_031' : 'common_066')}}</div>
                                <div class="gr_list__item" v-for="title in Object.keys(prizeTable || {})" :key="title + 0">{{$t(title)}}</div>
                                <div class="gr_list__item" v-for="title in Object.keys(prizeTable || {})" :key="title + 1">{{$t(title)}}</div>
                            </div>
                            <div class="gr_popper__list" v-if="VN_jsPrize.VN_S">
                                <!-- '獎金' -->
                                <div class="gr_list__item">{{$t('common_038')}}</div>
                                <div class="gr_list__item" v-for="method in allPrizeTable[VN_subMenuIndex]" :key="method + 0">{{VN_jsPrize.VN_S[method]}}</div>
                                <div class="gr_list__item" v-for="method in allPrizeTable[VN_subMenuIndex]" :key="method + 1">{{VN_jsPrize.VN_N[method]}}</div>

                            </div>
                        </div>
                    </template>
                </template>
                <template v-else>
                    <div class="gr_popper__list">
                        <!-- 玩法 || '項目' -->
                        <div class="gr_list__item">{{$t((VN_subMenuIndex !== 2) ? 'popup_031' : 'common_066')}}</div>
                        <div class="gr_list__item" v-for="title in Object.keys(prizeTable || {})" :key="title">{{$t(title)}}</div>
                    </div>
                    <div class="gr_popper__list">
                        <!-- '獎金' -->
                        <div class="gr_list__item">{{$t('common_038')}}</div>
                        <div class="gr_list__item" v-for="prize in prizeTable" :key="prize">{{prize}}</div>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
    name: 'GamePrompt',
    data() {
        return {
            allPrizeTable: [
                ['2d', '3d', '4d'],
                ['pl2', 'pl3'],
                ['teshu']
            ]

        }
    },
    methods: {
        ...mapActions([
            _M.SET_POP_ACTIVE
        ]),
        handleIsActive() {
            this[_M.SET_POP_ACTIVE]({PlayPrize: !this.isPopActive})
        }
    },
    computed: {
        ...mapGetters([
            'getPopActive',
            'VN_jsPrize',
            'VN_pos',
            'VN_subMenuIndex',
            'VN_areaTitle'
        ]),
        isPopActive() {
            return this.getPopActive.PlayPrize
        },
        isAllArea() {
            return this.VN_pos === 'all'
        },
        prizeTable() {
            const jsPrize = this.VN_jsPrize[this.VN_pos] || {}
            switch (this.VN_subMenuIndex) {
                case 0:
                    return {
                        '2D': jsPrize['2d'],
                        '3D': jsPrize['3d'],
                        '4D': jsPrize['4d']
                    }
                case 1:
                    return {
                        'PL2': jsPrize['pl2'],
                        'PL3': jsPrize['pl3']
                    }
                case 2:
                    return {
                        'vn_t_052': jsPrize['teshu']
                    }
                default:
                    return {}
            }
        },
        lineHeight() {
            return 26 * this.allPrizeTable[this.VN_subMenuIndex].length + 'px'
        }
    }
}
</script>