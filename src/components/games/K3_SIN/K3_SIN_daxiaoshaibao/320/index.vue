
<template>
    <div class="gr_container  bg_primary">
        <div class="c_h-game-grid">
            <!-- 三军、大小 -->
            <div class="c_row">
                <div class="c_row  c_h-game-grid__header" :class="{is_active: activeArr[0]}" @click="toggleInputMenu(0)">
                    <div :class="isOverStyle(sanjunAnddaxiaoGame)" class="c_component">
                        {{$t(sanjunAnddaxiaoGame.title_key)}}
                    </div>
                    <div class="c_header__arrow" />
                </div>
                <div class="c_row  c_h-game-grid__content">
                    <div class="c_col"
                        v-if="method.title"
                        v-for="method in sanjunAnddaxiaoGame.childs.slice(0,10)"
                        :class="isInputActive(sanjunAnddaxiaoGame.title, method.title)"
                        :key="method.title"
                    >
                        <div :class="isOverStyle(method)" class="c_component">
                            <div class="c_h-game-grid__item" @click="handleClick(sanjunAnddaxiaoGame.title, method)" :disabled="method.isBlocked">
                                <div class="c_dice--medium" v-if="isBall(method.title)">
                                    <div class="c_dot" v-for="n in +method.title" />
                                </div>
                                <div class="c_dice--medium" v-else>{{$t(method.title_key)}}</div>
                            </div>
                        </div>
                        <div class="c_component" :class="isUpdatePrize(method)">{{prize(method)}}</div>
                    </div>
                </div>

            </div>
            <!-- 围骰、全骰 -->
            <div class="c_row">
                <div class="c_row  c_h-game-grid__header" :class="{is_active: activeArr[1]}" @click="toggleInputMenu(1)">
                    <div :class="isOverStyle(weishaiAddquanshaiGame)" class="c_component">
                        {{$t(weishaiAddquanshaiGame.title_key)}}
                    </div>
                    <div class="c_header__arrow" />
                </div>
                <div class="c_row  c_h-game-grid__content">
                    <div class="c_col"
                        v-if="method.title"
                        v-for="method in weishaiAddquanshaiGame.childs"
                        :class="isInputActive(weishaiAddquanshaiGame.title, method.title)"
                        :key="method.title"
                    >
                        <div :class="isOverStyle(method)" class="c_component">
                            <div class="c_h-game-grid__item" @click="handleClick(weishaiAddquanshaiGame.title, method)" :disabled="method.isBlocked">
                                <div class="c_dice--medium" v-if="isBall(method.title)">
                                    <div class="c_dot" v-for="n in +method.title" />
                                </div>
                                <div :class="['c_dice--medium', {'c_dice--long': lang !== 'cn'}]" v-else>{{$t(method.title_key)}}</div>
                            </div>
                        </div>
                        <div class="c_component" :class="isUpdatePrize(method)">{{prize(method)}}</div>
                    </div>
                </div>
            </div>
            <!-- 短牌 -->
            <div class="c_row">
                <div class="c_row  c_h-game-grid__header" :class="{is_active: activeArr[2]}" @click="toggleInputMenu(2)">
                    <div :class="isOverStyle(duanpaiGame)" class="c_component">
                        {{$t(duanpaiGame.title_key)}}
                    </div>
                    <div class="c_header__arrow" />
                </div>
                <div class="c_row  c_h-game-grid__content">
                    <div class="c_col"
                        v-if="method.title"
                        v-for="method in duanpaiGame.childs"
                        :class="isInputActive(duanpaiGame.title, method.title)"
                        :key="method.title"
                    >
                        <div :class="isOverStyle(method)" class="c_component">
                            <div class="c_h-game-grid__item" @click="handleClick(duanpaiGame.title, method)" :disabled="method.isBlocked">
                                <div class="c_dice--small">
                                    <div class="c_dot" v-for="n in +method.title.charAt(0)" />
                                </div>
                                <div class="c_dice--small">
                                    <div class="c_dot" v-for="n in +method.title.charAt(1)" />
                                </div>
                            </div>
                        </div>
                        <div class="c_component" :class="isUpdatePrize(method)">{{prize(method)}}</div>
                    </div>
                </div>
            </div>
            <!-- 长牌 -->
            <div class="c_row">
                <div class="c_row  c_h-game-grid__header" :class="{is_active: activeArr[3]}" @click="toggleInputMenu(3)">
                    <div :class="isOverStyle(changpaiGame)" class="c_component">
                        {{$t(changpaiGame.title_key)}}
                    </div>
                    <div class="c_header__arrow" />
                </div>
                <div class="c_row  c_h-game-grid__content">
                    <div class="c_col"
                        v-if="method.title"
                        v-for="method in changpaiGame.childs"
                        :class="isInputActive(changpaiGame.title, method.title)"
                        :key="method.title"
                    >
                        <div :class="isOverStyle(method)" class="c_component">
                            <div class="c_h-game-grid__item" @click="handleClick(changpaiGame.title, method)" :disabled="method.isBlocked">
                                <div class="c_dice--small">
                                    <div class="c_dot" v-for="n in +method.title.charAt(0)" />
                                </div>
                                <div class="c_dice--small">
                                    <div class="c_dot" v-for="n in +method.title.charAt(1)" />
                                </div>
                            </div>
                        </div>
                        <div class="c_component" :class="isUpdatePrize(method)">{{prize(method)}}</div>
                    </div>
                </div>
            </div>
            <!-- 点数 -->
            <div class="c_row">
                <div class="c_row  c_h-game-grid__header" :class="{is_active: activeArr[4]}" @click="toggleInputMenu(4)">
                    <div :class="isOverStyle(dianshuGame)" class="c_component">
                        {{$t(dianshuGame.title_key)}}
                    </div>
                    <div class="c_header__arrow" />
                </div>
                <div class="c_row  c_h-game-grid__content">
                    <div class="c_col"
                        v-if="method.title"
                        v-for="method in dianshuGame.childs"
                        :class="isInputActive(dianshuGame.title, method.title)"
                        :key="method.title"
                    >
                        <div :class="isOverStyle(method)" class="c_component">
                            <div class="c_h-game-grid__item" @click="handleClick(dianshuGame.title, method)" :disabled="method.isBlocked">
                                <div class="c_dice--medium">{{$t(method.title_key)}}</div>
                            </div>
                        </div>
                        <div class="c_component" :class="isUpdatePrize(method)">{{prize(method)}}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import { mapGetters } from 'vuex'
    import K3_SIN_daxiaoshaibao from '../980'
    export default {
        name: 'K3_SIN_daxiaoshaibao',
        mixins: [K3_SIN_daxiaoshaibao],
        data() {
            return {
                activeArr: [...Array(5).keys()].map(() => true)
            }
        },
        computed: {
            ...mapGetters([
                'lang'
            ])
        }
    }
</script>
