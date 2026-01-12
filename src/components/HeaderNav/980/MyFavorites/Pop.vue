<template>
    <div>
        <div class="gr_pop__header" @click="bodyScroll">
            <!-- 新增最爱 -->
            {{$t('home_041')}}
            <svg
                class="gr_header__close"
                viewBox="0 0 20.36 20.36"
                @click="close"
            >
                <line x1="0.36" y1="0.36" x2="20" y2="20" style="" />
                <line x1="0.36" y1="20" x2="20" y2="0.36" />
            </svg>
        </div>
        <div class="gr_pop__content">
            <div class="gr_my-favorites_collapse">
                <template v-if="!isOnlyOneLot">
                    <div
                        :class="['gr_collapse__item', {is_active: isActiveIdx === i}]"
                        v-for="(id, i) in dispalyMenuOrder"
                        v-if="isShow(id)"
                    >
                        <template v-if="id !== 3">
                            <div class="gr_item__header gr_item__category" @click="toggleActive(i)">
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
                                        v-for="(menu, j) in lotteryMenu[id].list"
                                        :key="menu.title"
                                    >
                                        <div class="gr_item__header gr_item__lotter" @click.stop="toggleActiveMenu(j)">
                                            {{$t(menu.title_key)}}<i class="gr_item__arrow  el-icon-arrow-right" />
                                        </div>
                                        <div class="gr_item__content gr_item__play">
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
                        <!-- 只要有越南彩 -->
                        <template v-else>
                            <!-- 存在 越南彩(還有其他彩) -->
                            <div
                                v-if="!isOnlyOneLot"
                                :class="['gr_collapse__item', {is_active: isActiveIdx === 4}]"
                            >
                                <div class="gr_item__header gr_item__category" @click="toggleActive(4)">
                                    <!-- '彩種' -->
                                    <span>{{$t(lotteryMenu[3].title_key)}}</span>
                                    <i class="gr_item__arrow  el-icon-arrow-right" />
                                </div>
                                <div class="gr_item__content">
                                    <div class="gr_content__inner gr_item__play">
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
                        :key="menu.title"
                    >
                        <div class="gr_item__header gr_item__category" @click="toggleActive(i)">
                            <!-- '彩種' -->
                            <span>{{$t(menu.title_key)}}</span>
                            <i class="gr_item__arrow  el-icon-arrow-right" />
                        </div>
                        <div class="gr_item__content">
                            <div class="gr_content__inner">
                                <div
                                    class="gr_content__link gr_item__play"
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
        <!-- '取消' / '确定' -->
        <div class="gr_pop__button">
            <button
                class="gr_header__button  el-button el-button--default"
                @click="close"
            >
                {{$t('home_040')}}
            </button>
            <button
                class="gr_header__button  el-button el-button--primary el-button--default"
                :disabled="isDisabled"
                @click="handleClick"
            >
                {{$t('popup_004')}}
            </button>
        </div>
    </div>
</template>
<script>
import { mapActions } from 'vuex'
import { warnMessageBox } from '@UTIL'
import Pop from '../../MyFavorites/Pop'
export default {
    name: 'Pop_980',
    mixins: [Pop],
    data() {
        return {
            isDisabled: false
        }
    },
    methods: {
        ...mapActions([
            _M.SET_MY_FAVORITES,
            _M.SET_POP_ACTIVE
        ]),
        favoriteMenuLen() {
            this[_M.SET_POP_ACTIVE]({gameFavorite: !this.isGameFavoriteMenuActive})
            const listNav = document.querySelectorAll('.gr_my-favorites__list .gr_list__item')
            const listNavWarp = document.querySelector('.gr_my-favorites__warp')
            if (listNav !== undefined) {
                var array = []
                for (var i = 0; i < listNav.length; i++) {
                    listNav[i].childNodes && (array.push(listNav[i].childNodes[2].offsetWidth))
                }
                const listNavMax = Math.max(...array) + 10
                for (var j = 0; j < listNav.length; j++) {
                    listNav[j].style.width = listNavMax + 'px'
                    if (j <= 9) {
                        listNavWarp.style.width = listNavMax + 'px'
                        listNav[j].style.left = '0px'
                    } else if (j >= 10 && j <= 19) {
                        listNavWarp.style.width = listNavMax * 2 + 'px'
                        listNav[j].style.left = listNavMax + 'px'
                    } else if (j >= 20) {
                        listNavWarp.style.width = listNavMax * 3 + 'px'
                        listNav[j].style.left = listNavMax * 2 + 'px'
                    }
                }
            }
        },
        async handleClick() {
            this.isDisabled = true
            const isNotError = await this[_M.SET_MY_FAVORITES](this.cloneListData)
            if (!isNotError) {
                return this.$msg(warnMessageBox({
                    // '系统繁忙中，请再试一次。'
                    message: this.$t('popup_098')
                }))
            }
            this.favoriteMenuLen()
            this.close()
            this.isDisabled = false
        },
        close() {
            this.$msg({
                show: false,
                zIndex: 1990,
                isCustom: false
            })
            this[_M.SET_POP_ACTIVE]({gameFavorite: !this.isGameFavoriteMenuActive})
            const contentNode = document.querySelectorAll('body')[0]
            contentNode.className = ' '
        }
    }
}
</script>