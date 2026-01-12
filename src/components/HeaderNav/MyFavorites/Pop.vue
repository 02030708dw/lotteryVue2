<template>
    <div>
        <div class="gr_pop__header" @click="bodyScroll">
            <!-- 新增最爱 -->
            {{$t('home_041')}}
            <svg
                class="gr_header__close"
                viewBox="0 0 20.36 20.36"
                @click="$parent.close"
            >
                <line x1="0.36" y1="0.36" x2="20" y2="20" style="" />
                <line x1="0.36" y1="20" x2="20" y2="0.36" />
            </svg>
        </div>
        <div class="gr_pop__content">
            <div class="gr_my-favorites_collapse">
                <template v-if="!isOnlyOneLot">
                    <div
                        :class="['gr_collapse__item', {is_active: isActiveIdx === id}]"
                        v-for="(id, i) in dispalyMenuOrder"
                        v-if="isShow(id)"
                        @click="toggleActive(id)"
                    >
                        <template v-if="id !== 3">
                            <div class="gr_item__header">
                                <!-- '彩種' -->
                                <span>{{id < 3 ? `${$t('home_044')}-`:''}}{{$t(lotteryMenu[id].title_key)}}</span>
                                <i class="gr_item__arrow  el-icon-arrow-right" />
                            </div>
                            <div class="gr_item__content">
                                <!-- 特例:雙層架構 -->
                                <div class="gr_content__inner gr_item__play" v-if="[6, 7].includes(id)">
                                    <div
                                        class="gr_content__link"
                                        v-for="items in getFirstChild(id)"
                                        :key="items.title"
                                        @click.stop="setMyFavorites(items.lottery + '')"
                                        v-if="!getLolli.includes(items.lottery)"
                                    >
                                        {{$t(items.title_key)}}
                                        <div class="gr_my-favorites__tooltip  gr_my-favorites__tooltip--left"
                                            :class="['gr_link__my-favorites', {
                                                is_active: cloneListData.includes(items.lottery + ''),
                                                is_tooltip: isTip === items.lottery + ''
                                            }]"
                                        >
                                            <svg class="gr_my-favorites__icon" viewBox="0 0 17.85 16.11">
                                                <path d="M8.93,3.15C8.17-.47,2.14-.66.77,3.65c-2.18,6.79,6.67,9,8.16,12,1.48-3.07,10.32-5.25,8.15-12C15.71-.66,9.68-.47,8.93,3.15Z" />
                                            </svg>
                                            <span class="gr_tooltip__arrow" />
                                            <!-- '最多30个最爱彩种' -->
                                            <div class="gr_tooltip__popper">{{$t('home_043')}}</div>
                                        </div>
                                    </div>
                                </div>
                                <!-- 3層架構 -->
                                <div class="gr_content__inner" v-else>
                                    <div
                                        :class="['gr_collapse__item', {is_active: activeMenu === j}]"
                                        @click.stop="toggleActiveMenu(j)"
                                        v-for="(menu, j) in lotteryMenu[id].list"
                                        :key="menu.title"
                                    >
                                        <div class="gr_item__header">
                                            {{$t(menu.title_key)}}<i class="gr_item__arrow  el-icon-arrow-right" />
                                        </div>
                                        <div class="gr_item__content">
                                            <div class="gr_content__inner">
                                                <div
                                                    class="gr_content__link"
                                                    v-for="items in menu.childs"
                                                    :key="items.title"
                                                    @click.stop="setMyFavorites(items.lottery + '')"
                                                    v-if="!getLolli.includes(items.lottery)"
                                                >
                                                    {{$t(items.title_key)}}
                                                    <div class="gr_my-favorites__tooltip  gr_my-favorites__tooltip--left"
                                                        :class="['gr_link__my-favorites', {
                                                            is_active: cloneListData.includes(items.lottery + ''),
                                                            is_tooltip: isTip === items.lottery + ''
                                                        }]"
                                                    >
                                                        <svg class="gr_my-favorites__icon" viewBox="0 0 17.85 16.11">
                                                            <path d="M8.93,3.15C8.17-.47,2.14-.66.77,3.65c-2.18,6.79,6.67,9,8.16,12,1.48-3.07,10.32-5.25,8.15-12C15.71-.66,9.68-.47,8.93,3.15Z" />
                                                        </svg>
                                                        <span class="gr_tooltip__arrow" />
                                                        <!-- '最多30个最爱彩种' -->
                                                        <div class="gr_tooltip__popper">{{$t('home_043')}}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </template>
                        <template v-else>
                            <!-- 存在 越南彩(還有其他彩) -->
                            <div
                                v-if="!isOnlyOneLot"
                                :class="['gr_collapse__item', {is_active: isActiveIdx === 3}]"
                                @click.stop="toggleActive(3)"
                            >
                                <div class="gr_item__header">
                                    <!-- '彩種' -->
                                    {{$t(lotteryMenu[3].title_key)}}<i class="gr_item__arrow  el-icon-arrow-right" />
                                </div>
                                <div class="gr_item__content">
                                    <div class="gr_content__inner">
                                        <div
                                            class="gr_content__link"
                                            v-for="(item, lotName) in lotListVN"
                                            :key="lotName"
                                            @click.stop="setMyFavorites(item.lottery + '')"
                                        >
                                            {{$t(item.title_key)}}
                                            <div class="gr_my-favorites__tooltip  gr_my-favorites__tooltip--left"
                                                :class="['gr_link__my-favorites', {
                                                    is_active: cloneListData.includes(item.lottery + ''),
                                                    is_tooltip: isTip === item.lottery + ''
                                                }]"
                                            >
                                                <svg class="gr_my-favorites__icon" viewBox="0 0 17.85 16.11">
                                                    <path d="M8.93,3.15C8.17-.47,2.14-.66.77,3.65c-2.18,6.79,6.67,9,8.16,12,1.48-3.07,10.32-5.25,8.15-12C15.71-.66,9.68-.47,8.93,3.15Z" />
                                                </svg>
                                                <span class="gr_tooltip__arrow" />
                                                <!-- '最多30个最爱彩种' -->
                                                <div class="gr_tooltip__popper">{{$t('home_043')}}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- 只有 越南彩 -->
                            <div
                                v-else
                                class="gr_content__link"
                                v-for="(item, lotName) in lotListVN"
                                :key="lotName"
                                @click.stop="setMyFavorites(item.lottery + '')"
                            >
                                {{$t(item.title_key)}}
                                <div class="gr_my-favorites__tooltip  gr_my-favorites__tooltip--left"
                                    :class="['gr_link__my-favorites', {
                                        is_active: cloneListData.includes(item.lottery + ''),
                                        is_tooltip: isTip === item.lottery + ''
                                    }]"
                                >
                                    <svg class="gr_my-favorites__icon" viewBox="0 0 17.85 16.11">
                                        <path d="M8.93,3.15C8.17-.47,2.14-.66.77,3.65c-2.18,6.79,6.67,9,8.16,12,1.48-3.07,10.32-5.25,8.15-12C15.71-.66,9.68-.47,8.93,3.15Z" />
                                    </svg>
                                    <span class="gr_tooltip__arrow" />
                                    <!-- '最多30个最爱彩种' -->
                                    <div class="gr_tooltip__popper">{{$t('home_043')}}</div>
                                </div>
                            </div>
                        </template>
                    </div>
                </template>
                <template v-else>
                    <div
                        :class="['gr_collapse__item', {is_active: isActiveIdx === i}]"
                        v-for="(menu, i) in lotteryMenu[isOnlyOneLot].list"
                        @click="toggleActive(id)"
                        :key="menu.title"
                    >
                        <div class="gr_item__header">
                            <!-- '彩種' -->
                            {{$t(menu.title_key)}}<i class="gr_item__arrow  el-icon-arrow-right" />
                        </div>
                        <div class="gr_item__content">
                            <div class="gr_content__inner">
                                <div
                                    class="gr_content__link"
                                    v-for="items in menu.childs"
                                    :key="items.title"
                                    @click.stop="setMyFavorites(items.lottery + '')"
                                >
                                    {{$t(items.title_key)}}
                                    <div class="gr_my-favorites__tooltip  gr_my-favorites__tooltip--left"
                                        :class="['gr_link__my-favorites', {
                                            is_active: cloneListData.includes(items.lottery + ''),
                                            is_tooltip: isTip === items.lottery + ''
                                        }]"
                                    >
                                        <svg class="gr_my-favorites__icon" viewBox="0 0 17.85 16.11">
                                            <path d="M8.93,3.15C8.17-.47,2.14-.66.77,3.65c-2.18,6.79,6.67,9,8.16,12,1.48-3.07,10.32-5.25,8.15-12C15.71-.66,9.68-.47,8.93,3.15Z" />
                                        </svg>
                                        <span class="gr_tooltip__arrow" />
                                        <!-- '最多30个最爱彩种' -->
                                        <div class="gr_tooltip__popper">{{$t('home_043')}}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
        </div>
        <!-- '确定' -->
        <button
            class="gr_pop__button  c_flat-button--primary  c_flat-button--large  c_flat-button--full"
            :disabled="isDisabled"
            @click="handleClick"
        >
            {{$t('home_042')}}
        </button>
    </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { warnMessageBox } from '@UTIL'
export default {
    name: 'Pop',
    data() {
        // console.log(this.cloneListData)
        return {
            isActiveIdx: null,
            activeMenu: null,
            isTip: false,
            tipTimer: null,
            isDisabled: false
        }
    },
    props: {
        cloneListData: Array,
        setCloneMyFavorites: Function,
        isEdit: Boolean
    },
    methods: {
        ...mapActions([
            _M.SET_MY_FAVORITES
        ]),
        setMyFavorites(currentClickId) {
            if (this.cloneListData.includes(currentClickId)) {
                this.setCloneMyFavorites(this.cloneListData.filter(id => id !== currentClickId))
            } else if (this.cloneListData.length >= 30) {
                this.isTip = currentClickId
                clearTimeout(this.tipTimer)
                this.tipTimer = setTimeout(() => (this.isTip = false), 3000)
                //彈窗寫在這
            } else {
                this.setCloneMyFavorites([...this.cloneListData, currentClickId])
            }
        },
        async handleClick() {
            this.isDisabled = true
            if (!this.isEdit) {
                const isNotError = await this[_M.SET_MY_FAVORITES](this.cloneListData)
                if (!isNotError) {
                    return this.$msg(warnMessageBox({
                        // '系统繁忙中，请再试一次。'
                        message: this.$t('popup_098')
                    }))
                }
            }
            this.$parent.close()
            this.bodyScroll()
            this.isDisabled = false
        },
        bodyScroll() {
            const contentNode = document.querySelectorAll('body')[0]
            contentNode.removeAttribute('style')
        },
        toggleActive(i) {
            this.isActiveIdx = this.isActiveIdx !== i ? i : null
            this.activeMenu = null
            console.log(i)
        },
        toggleActiveMenu(j) {
            this.activeMenu = this.activeMenu !== j ? j : null
        },
        // 雙層結構使用-取得子層
        getFirstChild(i) {
            try {
                let list = this.lotteryMenu[i].list
                let arr = []
                Object.keys(list).forEach(item => {
                    list[item].childs.map((item) => {
                        arr.push(item)
                    })
                })
                return arr
            } catch (e) {
                console.warn(e)
                return []
            }
        },
        isShow(menuId) {
            return !!this.lotteryMenu[menuId]
        }
    },
    computed: {
        ...mapGetters([
            'lotteryMenu',
            'getMenuIdArr',
            'lotListVN',
            'getLolli',
            'dispalyMenuOrder'
        ]),
        // 判斷是否只有一個彩種, true回傳ID or false
        isOnlyOneLot() {
            return this.getMenuIdArr.length === 1 ? this.getMenuIdArr[0] : false
        }
    }
}
</script>