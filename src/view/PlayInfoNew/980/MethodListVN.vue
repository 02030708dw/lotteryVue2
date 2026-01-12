<template>
    <div class="u_t--center playinfo_container">
        <div class="playinfo_title">
            <!-- '玩法说明' -->
            {{$t('h_common_013')}}
        </div>
        <ul class="playinfo_rules">
            <!-- @單一玩法組, ex: 五星 (key跟隨分頁名稱避免卡片展開殘留問題) -->
            <li
                v-for="(method, key, ObjIndex) in list"
                :key="ObjIndex"
                :class="{ 'active': !isInCloseArr(ObjIndex)}">
                <div
                    class="playinfo_rules_tit"
                    :ref="`${playListIndex}${key}`"
                    @click="toggleMenu(ObjIndex)"
                >
                    <span :class="{'active': !isInCloseArr(ObjIndex)}" />
                    <span>{{$t(method.title_key)}}</span>
                </div>
                <ul class="playinfo_rules_items"
                    :class="{'sin_height': IsSIN, 'active': !isInCloseArr(ObjIndex)}">
                    <!-- 額外的說明卡片 -->
                    <li class="playinfo_rules_infocard">
                        <!--(2D,3D,PL2...特殊)'投注说明' -->
                        <div v-if="lang === 'vn' && ['PL2', 'PL3'].includes(method.title_show)" class="playinfo_rules_items--tit">{{`${$t(method.title_key)} (${method.childs[0].item_title}) - ${$t('vn_t_077')}`}}</div>
                        <div v-else class="playinfo_rules_items--tit">{{`${$t(method.title_key)} - ${$t('vn_t_077')}`}}</div>
                        <div class="playinfo_rules_items--info">
                            <div v-for="(stepKey, keyIndex) in getInfoKey[key]" :key="keyIndex">
                                <!-- '步骤' -->
                                <span>{{$t('vn_t_076')}}{{keyIndex + 1}}：</span>
                                <div class="playinfo_rules_infocard--stepinfo">{{$t(stepKey)}}</div>
                            </div>
                        </div>
                    </li>

                    <!-- 特殊: 项目说明 -->
                    <template v-if="key === 'teshu'">
                    <li class="playinfo_rules_infocard">
                            <!-- '项目说明' -->
                            <div class="playinfo_rules_items--tit">{{$t('vn_t_078')}}</div>
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
                    </template>
                    <!-- @單一玩法組內的項目, ex:直選複式 -->
                    <li
                        v-for="(item, itemIndex) in method.childs"
                        :key="`${itemIndex}`"
                    >
                        <!-- @單一玩法, 玩法介紹卡片 -->
                        <div class="playinfo_rules_items--tit">
                            <span v-if="lang === 'vn' && ['PL2', 'PL3'].includes(item.item_title_show)">{{ `${item.item_title_show} (${item.item_title})`}}</span>
                            <span v-else>{{$t(item.item_title)}}</span>
                            <span v-if="item.sub_title" class='sub-title'> {{$t(item.sub_title)}}</span>
                        </div>
                        <p v-html="$t(item.content)" />
                        <p class="playinfo_rules_items--footer">
                            <!-- 示例 -->
                            <label>【{{$t('h_common_016')}}】</label>
                            <label v-html="$t(item.example)"></label>
                        </p>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
</template>

<style lang="scss">
.playinfo_rules_items > li {
    cursor: initial;
}

.playinfo_rules_items--footer {
    margin-top: 1.5em;
}
</style>

<script>
import { mapGetters } from 'vuex'
import MethodList from './MethodList'

export default {
    name: 'MethodListVN',
    extends: MethodList,
    computed: {
        ...mapGetters([
        ]),
        // 新越南改版'投注說明'卡片內用的KEY
        getInfoKey() {
            // 自主彩
            const self = {
                // '2d': ['从00~99中选出1组2位数号码，填入投注号码中。', '选择在玩法［头］、［尾］、［头尾］、［包组］、［包组7］中，填入投注金额完成投注。输入版则是勾选玩法后即可投注。'],
                '2d': ['vn_t_079', 'vn_t_080'],
                // '3d': ['从000~999中选出1组3位数号码，填入投注号码中。', '选择在玩法［头］、［尾］、［头尾］、［包组］、［包组7］中，填入投注金额完成投注。输入版则是勾选玩法后即可投注。'],
                '3d': ['vn_t_081', 'vn_t_080'],
                // '4d': ['从000~9999中选出1组4位数号码，填入投注号码中。', '选择在玩法［尾］、［包组］中，填入投注金额完成投注。输入版则是勾选玩法后即可投注。'],
                '4d': ['vn_t_082', 'vn_t_083'],
                // 'pl2': ['从00~99中选出2组2位数号码（两组号码不可重复）组成一注。', '填入投注金额完成投注。输入版则是勾选玩法后即可投注。'],
                'pl2': ['vn_t_084', 'vn_t_085'],
                // 'pl3': ['从00~99中选出3组2位数号码（两组号码不可重复）组成一注。', '填入投注金额完成投注。输入版则是勾选玩法后即可投注。'],
                'pl3': ['vn_t_086', 'vn_t_085'],
                // 'teshu': ['选择号码的属性项目。', '选择在玩法［头］、［尾］、［头尾］、［包组］中，填入投注金额完成投注。']
                'teshu': ['vn_t_087', 'vn_t_088']
            }
            const key = {
                VN_5M: self,
                VN_30S: self,
                VN_S: {
                    // '2d': ['从城市选单中，至少选择一个城市。', '从00~99中选出1组2位数号码，填入投注号码中。', '选择在玩法［头］、［尾］、［头尾］、［包组］、［包组7］中，填入投注金额完成投注。输入版则是勾选玩法后即可投注。'],
                    '2d': ['vn_t_089', 'vn_t_079', 'vn_t_080'],
                    // '3d': ['从城市选单中，至少选择一个城市。', '从000~999中选出1组3位数号码，填入投注号码中。', '选择在玩法［头］、［尾］、［头尾］、［包组］、［包组7］中，填入投注金额完成投注。输入版则是勾选玩法后即可投注。'],
                    '3d': ['vn_t_089', 'vn_t_081', 'vn_t_080'],
                    // '4d': ['从城市选单中，至少选择一个城市。', '从000~9999中选出1组4位数号码，填入投注号码中。', '选择在玩法［尾］、［包组］中，填入投注金额完成投注。输入版则是勾选玩法后即可投注。'],
                    '4d': ['vn_t_089', 'vn_t_082', 'vn_t_083'],
                    // 'pl2': ['从城市选单中，至少选择一个城市。', '从00~99中选出2组2位数号码（两组号码不可重复）组成一注。', '填入投注金额完成投注。输入版则是勾选玩法后即可投注。'],
                    'pl2': ['vn_t_089', 'vn_t_084', 'vn_t_085'],
                    // 'pl3': ['从城市选单中，至少选择一个城市。', '从00~99中选出3组2位数号码（两组号码不可重复）组成一注。', '填入投注金额完成投注。输入版则是勾选玩法后即可投注。'],
                    'pl3': ['vn_t_089', 'vn_t_086', 'vn_t_085'],
                    // 'teshu': ['从城市选单中，至少选择一个城市。', '选择号码的属性项目。', '选择在玩法［头］、［尾］、［头尾］、［包组］中，填入投注金额完成投注。']
                    'teshu': ['vn_t_089', 'vn_t_087', 'vn_t_088']
                },
                VN_N: {
                    // '2d': ['从城市选单中，至少选择一天。', '从00~99中选出1组2位数号码，填入投注号码中。', '选择在玩法［头］、［尾］、［头尾］、［包组］中，填入投注金额完成投注。输入版则是勾选玩法后即可投注。'],
                    '2d': ['vn_t_090', 'vn_t_079', 'vn_t_091'],
                    // '3d': ['从城市选单中，至少选择一天。', '从000~999中选出1组3位数号码，填入投注号码中。', '选择在玩法［头］、［尾］、［头尾］、［包组］中，填入投注金额完成投注。输入版则是勾选玩法后即可投注。'],
                    '3d': ['vn_t_090', 'vn_t_081', 'vn_t_091'],
                    // '4d': ['从城市选单中，至少选择一天。', '从000~9999中选出1组4位数号码，填入投注号码中。', '选择在玩法［尾］、［包组］中，填入投注金额完成投注。输入版则是勾选玩法后即可投注。'],
                    '4d': ['vn_t_090', 'vn_t_082', 'vn_t_083'],
                    // 'pl2': ['从城市选单中，至少选择一天。', '从00~99中选出2组2位数号码（两组号码不可重复）组成一注。', '填入投注金额完成投注。输入版则是勾选玩法后即可投注。'],
                    'pl2': ['vn_t_090', 'vn_t_084', 'vn_t_085'],
                    // 'pl3': ['从城市选单中，至少选择一天。', '从00~99中选出3组2位数号码（两组号码不可重复）组成一注。', '填入投注金额完成投注。输入版则是勾选玩法后即可投注。'],
                    'pl3': ['vn_t_090', 'vn_t_086', 'vn_t_085'],
                    // 'teshu': ['从城市选单中，至少选择一天。', '选择号码的属性项目。', '选择在玩法［头］、［尾］、［头尾］、［包组］中，填入投注金额完成投注。']
                    'teshu': ['vn_t_090', 'vn_t_087', 'vn_t_088']
                }
            }
            return key[this.getPlayIndexWithoutLang] || self
        }

    }
}
</script>
