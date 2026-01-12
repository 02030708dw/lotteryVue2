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
                <ul
                    class="playinfo_rules_items"
                    :class="{'sin_height': IsSIN, 'active': !isInCloseArr(ObjIndex)}"
                >
                    <!-- @單一玩法組內的項目, ex:直選複式 -->
                    <li
                        v-for="(item, itemIndex) in method.childs"
                        :key="`${itemIndex}`"
                    >
                        <!-- @單一玩法, 玩法介紹卡片 -->
                        <div class="playinfo_rules_items--tit">
                            <span>{{$t(item.item_title)}}</span>
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
import MethodList from './MethodList'
export default {
    name: 'MethodListLA',
    extends: MethodList,
    computed: {
        sp2D() {
            return [
                // 包組
                {
                    item_title: 'thai_008',
                    content: 'stock_021',
                    example: 'stock_022'
                },
                // 包胆
                {
                    item_title: 'thai_007',
                    content: 'stock_023',
                    example: 'stock_024'
                }
            ]
        },
        sp3D() {
            return [
                // 包組
                {
                    item_title: 'thai_008',
                    content: 'stock_025',
                    example: 'stock_026'
                }
            ]
        }
    }
}
</script>
