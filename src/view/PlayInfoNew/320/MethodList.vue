<template>
    <div class="u_t--center playinfo_container">
        <div class="playinfo_title">
            <!-- {{$t('玩法说明')}} -->
            {{$t('h_common_013')}}
        </div>
        <ul class="playinfo_rules">
            <!-- @單一玩法組, ex: 五星 -->
            <li
                v-for="(method, key, ObjIndex) in list"
                :key="`A_${ObjIndex}`"
                :class="{ 'active': !isInCloseArr(ObjIndex), 'no-line': isFantan }" >
                <div
                    class="playinfo_rules_tit"
                    :ref="`${playListIndex}${key}`"
                    v-if="!isFantan"
                    @click="toggleMenu(ObjIndex)"
                >
                    <span :class="{'active': !isInCloseArr(ObjIndex)}"></span>
                    <span>{{$t(method.title_key)}}</span>
                </div>
                <ul class="playinfo_rules_items" :class="{'sin_height': IsSIN, 'active': !isInCloseArr(ObjIndex)}">
                    <!-- 額外的說明卡片 -->
                    <!-- 越南彩-特殊 -->
                    <li v-if="isVN && key === 'teshu'" class="playinfo_rules_infocard">
                        <!-- '号码项目' -->
                        <div class="playinfo_rules_items--tit">{{$t('common_063')+' '+$t('common_066')}}</div>
                        <div class="playinfo_rules_items--info">
                            <!-- '大' '50~99' -->
                            <div>{{`${$t('common_020')}：${$t('vn_t_033')}`}}</div>
                            <!-- '小' '00~49' -->
                            <div>{{`${$t('common_021')}：${$t('vn_t_034')}`}}</div>
                            <!-- '单' '00 ~ 99 中的单数号码' -->
                            <div>{{`${$t('common_024')}：${$t('vn_t_035')}`}}</div>
                            <!-- '双' '00 ~ 99 中的双数号码' -->
                            <div>{{`${$t('common_025')}：${$t('vn_t_036')}`}}</div>
                            <!-- '大单' '50 ~ 99 中的单数号码' -->
                            <div>{{`${$t('mark6_t_027')}：${$t('vn_t_037')}`}}</div>
                            <!-- '大双' '50 ~ 99 中的双数号码' -->
                            <div>{{`${$t('mark6_t_028')}：${$t('vn_t_038')}`}}</div>
                            <!-- '小单' '00 ~ 49 中的单数号码' -->
                            <div>{{`${$t('mark6_t_029')}：${$t('vn_t_039')}`}}</div>
                            <!-- '小双' '00 ~ 49 中的双数号码' -->
                            <div>{{`${$t('mark6_t_030')}：${$t('vn_t_040')}`}}</div>
                            <!-- '单单' '00 ~ 99 中，十位数与个位数皆为单数的号码。例如11、35' -->
                            <div>{{`${$t('vn_t_028')}：${$t('vn_t_041')}`}}</div>
                            <!-- '双双' '00 ~ 99 中，十位数与个位数皆为双数的号码。例如22、46' -->
                            <div>{{`${$t('vn_t_029')}：${$t('vn_t_042')}`}}</div>
                            <!-- '单双' '00 ~ 99 中，十位数为单数，个位数为双数的号码。例如12、38' -->
                            <div>{{`${$t('vn_t_030')}：${$t('vn_t_043')}`}}</div>
                            <!-- '双单' '00 ~ 99 中，十位数为双数，个位数为单数的号码。例如21、83' -->
                            <div>{{`${$t('vn_t_031')}：${$t('vn_t_044')}`}}</div>
                            <!-- '内' '25 ~ 74' -->
                            <div>{{`${$t('vn_t_026')}：${$t('vn_t_045')}`}}</div>
                            <!-- '外' '00 ~ 24，75 ~ 99' -->
                            <div>{{`${$t('vn_t_027')}：${$t('vn_t_046')}`}}</div>
                        </div>
                    </li>
                    <!-- @單一玩法組內的項目, ex:直選複式 -->
                    <li
                        v-for="(item, itemIndex) in method.childs"
                        :key="`B_${itemIndex}`"
                        :ref="`${method.title}_${itemIndex}`"
                        :class="{ 'active': openCardIdObj[`${method.title}_${itemIndex}`] }"
                        @click="activeClick(`${method.title}_${itemIndex}`, $event)"
                    >
                        <!-- @單一玩法, 玩法介紹卡片 -->
                        <div class="playinfo_rules_items--tit">
                            <span>{{item.item_title}}</span>
                            <span v-if="item.sub_title !== ''" class='sub-title'> {{$t(item.sub_title)}}</span>
                        </div>
                        <p v-html="$t(item.content)" />
                        <!-- 單一玩法, 下方收合按鈕 -->
                        <div class="playinfo_rules_items--more">
                            <!-- '关闭' : '点我' -->
                            <span>{{ openCardIdObj[`${method.title}_${itemIndex}`] ? $t("h_common_014"): $t("h_common_019") }}</span>
                        </div>
                        <!-- @單一玩法, 示例部分 -->
                        <div class="playinfo_rules_items--ex" :title = "subTitleFormat(item)">
                            <div class="playinfo_rules_items--ex_info">
                                <div class="playinfo_rules_items--ex_tit">
                                    <!-- 示例 -->
                                    {{$t('h_common_016')}}
                                </div>
                                <p v-html="$t(item.example)" />
                            </div>
                        </div>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
</template>

<script>
import MethodList from '../980/MethodList'

export default {
    mixins: [MethodList],
    name: 'MethodList',
    methods: {
        setCardHeight(targetLi, id) {
            // 10 是"點我"那個div的button值
            targetLi.style.height = this.openCardIdObj[id] ? `${targetLi.lastChild.offsetHeight + 10}px` : ''
        }
    }
}
</script>
