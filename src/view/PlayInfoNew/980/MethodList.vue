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
                :key="`${playListIndex}_${ObjIndex}`"
                :class="{ 'active': !isInCloseArr(ObjIndex), 'no-line': isFantan }">
                <div
                    class="playinfo_rules_tit"
                    :ref="`${playListIndex}${key}`"
                    v-if="!isFantan"
                    @click="toggleMenu(ObjIndex)"
                >
                    <span :class="{'active': !isInCloseArr(ObjIndex)}" />
                    <span>{{$t(method.title_key)}}</span>
                </div>
                <ul class="playinfo_rules_items"
                    :class="{'sin_height': IsSIN, 'active': !isInCloseArr(ObjIndex)}">
                    <!-- 額外的說明卡片 -->
                    <li
                        v-for="(item, itemIndex) in method.childs"
                        :key="`${itemIndex}`"
                        :ref="`${key}_${item.item_title}_${itemIndex}`"
                        :class="{'active': openCardIdObj[`${key}_${item.item_title}_${itemIndex}`]}"
                        @click="activeClick(`${key}_${item.item_title}_${itemIndex}`, $event)"
                    >
                        <!-- @單一玩法, 玩法介紹卡片 -->
                        <div class="playinfo_rules_items--tit">
                            <span>{{$t(item.item_title)}}</span>
                            <span v-if="item.sub_title" class='sub-title'> {{$t(item.sub_title)}}</span>
                        </div>
                        <p v-html="$t(item.content)" />
                        <!-- 單一玩法, 右下角箭頭符號 -->
                        <div class="playinfo_rules_items--more">
                            <i></i>
                            <span @click="activeClick(`${key}_${item.item_title}_${itemIndex}`, $event)">
                                <!-- '关闭' -->
                                {{$t('h_common_014')}}
                            </span>
                        </div>
                        <!-- @單一玩法, 示例部分 -->
                        <div class="playinfo_rules_items--ex" :title="subTitleFormat(item)">
                            <!-- 示例左側區塊-文字 -->
                            <div class="playinfo_rules_items--ex_info">
                                <div class="playinfo_rules_items--ex_tit">
                                    <!-- '示例' -->
                                    {{$t('h_common_016')}}
                                </div>
                                <p v-html="$t(item.example)" />
                            </div>
                            <!-- 示例右側區塊-示例圖 -->
                            <span v-if="!isTable">
                                <ExamplePics
                                    v-if="!isTable && oneLotExample && oneLotExample[key] && oneLotExample[key][itemIndex]"
                                    :cardData="oneLotExample[key][itemIndex]"
                                    :menuName="key"/>
                                <!-- 示例右側區塊-示例圖:沒有資料時預設樣式 -->
                                <div class="playinfo_rules_items--ex_img" v-else>
                                    <div class="playinfo_rules_items--ex_img-2"></div>
                                    <div class="playinfo_rules_items--ex_bet">
                                        <p>
                                            <!-- '投注' -->
                                            {{$t('h_common_017')}}
                                        </p>
                                        <ul>
                                            <li class="order">1</li>
                                            <li>2</li>
                                            <li class="order">3</li>
                                            <li class="order">4</li>
                                            <li>5</li>
                                        </ul>
                                    </div>
                                    <div class="playinfo_rules_items--ex_lottery">
                                        <p>
                                            <!-- '开奖' -->
                                            {{$t('h_common_018')}}
                                        </p>
                                        <ul>
                                            <li>1</li>
                                            <li class="select">2</li>
                                            <li class="select">3</li>
                                            <li class="select">4</li>
                                            <li>5</li>
                                        </ul>
                                    </div>
                                </div>
                            </span>
                        </div>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getExampleData } from '../config/exampleData'
import ExamplePics from './ExamplePics'

export default {
    name: 'MethodList',
    components: {
        ExamplePics
    },
    data() {
        return {
            K3Style: ['K3', 'K3_SIN'],
            // 玩法收合 ex:五星
            isCloseArr: [],
            // 卡片示例展開 ex:五星直選
            openCardIdObj: {}
            // cardHeight: {}
        }
    },
    watch: {
        playListIndex() {
            // 切換彩種後玩法全展開
            this.isCloseArr.splice(0)

            // 切換彩種後全部卡片收合
            this.openCardIdObj = {}
        }
    },
    computed: {
        ...mapGetters([
            'playList',
            'playListIndex',
            'RWDMode',
            'lang',
            'getMenuId',
            'exampleTrans'
        ]),
        IsSIN() {
            return this.playListIndex.includes('SIN')
        },
        exampleOrderList() {
            return getExampleData(+this.getMenuId, this.getPageName, this.lang)
        },
        oneLotExample() {
            return this.exampleOrderList[this.getPageName]
        },
        getPageName() {
            let functionType = this.playListIndex.replace(/@([\w]+)/, '')
            // 越南彩自主彩proxy  VN_* -> VN_S
            if (functionType.includes('VN_') && functionType !== 'VN_N') {
                functionType = 'VN_S'
            }
            return functionType
        },
        list() {
            // 初次進入的資料處理
            return this.playList ? this.playList[this.playListIndex] : {}
        },
        getPlayIndexWithoutLang() {
            // ex:SSC@cn -> SSC
            return this.playListIndex.split('@')[0]
        },
        isFantan() {
            return this.getMenuId === 5
        },
        isVN() {
            return this.getMenuId === 3
        },
        isTable() {
            return this.getMenuId === 4
        }
    },
    methods: {
        activeClick(id, event) {
            event.stopPropagation()
            this.$set(this.openCardIdObj, id, !this.openCardIdObj[id])
            this.setCardHeight(this.$refs[id][0], id)
        },
        setCardHeight(targetLi, id) {
            targetLi.style.height = this.openCardIdObj[id] ? `${targetLi.lastChild.offsetHeight}px` : ''
        },
        toggleMenu(index) {
            const inArrIndex = this.isCloseArr.indexOf(index)
            inArrIndex === -1 ? this.isCloseArr.push(index) : this.isCloseArr.splice(inArrIndex, 1)
        },
        mouseleave(e, methodName) {
            if (this.lang !== 'cn') return
            e.target.children[0].innerText = this.$t(methodName)
        },
        subTitleFormat(item) {
            return this.$t(item.sub_title ? item.item_title + '/' + item.sub_title : item.item_title)
        },
        isInCloseArr(index) {
            return this.isCloseArr.includes(index)
        }
    }
}
</script>
