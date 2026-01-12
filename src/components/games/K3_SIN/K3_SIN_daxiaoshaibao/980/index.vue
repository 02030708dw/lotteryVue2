<template>
    <div class="gr_container  bg_primary  u_p--r10  u_p--l10">
        <div class="c_h-game-grid u_t--center">
            <!-- 三军、大小 -->
            <div class="c_row  c_h-game-grid__header">
                <div class="c_component" :class="isOverStyle(sanjunAnddaxiaoGame)" >{{sanjunAnddaxiaoGame.title_key}}</div>
            </div>
            <div class="c_row  c_h-game-grid__title">
                <ThreeTitle :showTitleThree="!isShowDemo" :loop="langCol" />
            </div>
            <div class="c_row" v-for="i in sanjunAnddaxiaoGame.childs.length / langCol" :key="'0' + i">
                <div class="c_col" v-if="method.title" v-for="method in sanjunAnddaxiaoGame.childs.slice(((i - 1) * langCol), langCol * i)" :key="method.title">
                    <div class="c_row"
                        :class="isInputActive(sanjunAnddaxiaoGame.title, method.title)"
                        :key="method.title"
                        @click="handleClick(sanjunAnddaxiaoGame.title, method)" :disabled="method.isBlocked"
                    >
                        <div class="c_component" :class="isOverStyle(method)"  v-if="isBall(method.title)">
                            <div class="c_dice--xsmall">
                                <div class="c_dot" v-for="n in +method.title" :key="n"/>
                            </div>
                        </div>
                        <div class="c_component" :class="isOverStyle(method)"  v-else>{{$t(method.title_key)}}</div>
                        <div class="c_component" :class="isUpdatePrize(method)">{{prize(method)}}</div>
                        <div :class="isOverStyle(sanjunAnddaxiaoGame)" class="c_component">
                            <div class="c_input--short">
                                <input class="c_input__inner" type="tel" @click.stop @input="setMethodMoney($event, sanjunAnddaxiaoGame.title, method)" @blur="handBlur($event, sanjunAnddaxiaoGame.title, method)"  :value="calcMoney(sanjunAnddaxiaoGame.title, method)" :disabled="method.isBlocked">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="c_col" v-else />
            </div>
            <!-- 围骰、全骰 -->
            <div class="c_row  c_h-game-grid__header">
                <div class="c_component" :class="isOverStyle(weishaiAddquanshaiGame)" >{{$t(weishaiAddquanshaiGame.title_key)}}</div>
            </div>
            <ThreeTitle :showTitleThree="!isShowDemo" :loop="langCol" />
            <div class="c_row" v-for="i in weishaiAddquanshaiGame.childs.length / langCol" :key="'1' + i">
                <div class="c_col" v-if="method.title" v-for="method in weishaiAddquanshaiGame.childs.slice(((i - 1) * langCol), langCol * i)" :key="method.title">
                    <div class="c_row"
                        :class="isInputActive(weishaiAddquanshaiGame.title, method.title)"
                        :key="method.title"
                        @click="handleClick(weishaiAddquanshaiGame.title, method)" :disabled="method.isBlocked"
                    >
                        <div class="c_component" :class="isOverStyle(method)"  v-if="isBall(method.title)">
                            <div class="c_dice--xsmall">
                                <div class="c_dot" v-for="n in +method.title" :key="n"/>
                            </div>
                        </div>
                        <div class="c_component" :class="isOverStyle(method)"  v-else>{{$t(method.title_key)}}</div>
                        <div class="c_component" :class="isUpdatePrize(method)">{{prize(method)}}</div>
                        <div :class="isOverStyle(weishaiAddquanshaiGame)" class="c_component">
                            <div class="c_input--short">
                                <input class="c_input__inner" type="tel" @click.stop @input="setMethodMoney($event, weishaiAddquanshaiGame.title, method)" @blur="handBlur($event, weishaiAddquanshaiGame.title, method)"  :value="calcMoney(weishaiAddquanshaiGame.title, method)" :disabled="method.isBlocked">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="c_col" v-else />
            </div>
            <!-- 短牌 -->
            <div class="c_row  c_h-game-grid__header">
                <div class="c_component" :class="isOverStyle(duanpaiGame)" >{{$t(duanpaiGame.title_key)}}</div>
            </div>
            <ThreeTitle :showTitleThree="!isShowDemo" :loop="langCol" />
            <div class="c_row" v-for="i in duanpaiGame.childs.length / langCol" :key="'2' + i">
                <div class="c_col" v-if="method.title" v-for="method in duanpaiGame.childs.slice(((i - 1) * langCol), langCol * i)" :key="method.title">
                    <div class="c_row"
                        :class="isInputActive(duanpaiGame.title, method.title)"
                        :key="method.title"
                        @click="handleClick(duanpaiGame.title, method)" :disabled="method.isBlocked"
                    >
                        <div class="c_component" :class="isOverStyle(method)">
                            <div class="c_dice--xsmall">
                                <div class="c_dot" v-for="n in +method.title.charAt(0)" :key="n"/>
                            </div>
                            <div class="c_dice--xsmall">
                                <div class="c_dot" v-for="n in +method.title.charAt(1)" :key="n"/>
                            </div>
                        </div>
                        <div class="c_component" :class="isUpdatePrize(method)">{{prize(method)}}</div>
                        <div :class="isOverStyle(duanpaiGame)" class="c_component">
                            <div class="c_input--short">
                                <input class="c_input__inner" type="tel" @click.stop @input="setMethodMoney($event, duanpaiGame.title, method)" @blur="handBlur($event, duanpaiGame.title, method)"  :value="calcMoney(duanpaiGame.title, method)" :disabled="method.isBlocked">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="c_col" v-else />
            </div>
            <!-- 长牌 -->
            <div class="c_row  c_h-game-grid__header">
                <div class="c_component" :class="isOverStyle(changpaiGame)" >{{$t(changpaiGame.title_key)}}</div>
            </div>
            <ThreeTitle :showTitleThree="!isShowDemo" :loop="langCol" />
            <div class="c_row" v-for="i in changpaiGame.childs.length / langCol" :key="'3' + i">
                <div class="c_col" v-if="method.title" v-for="(method, j) in changpaiGame.childs.slice(((i - 1) * langCol), langCol * i)" :key="method.name + j">
                    <div class="c_row"
                        :class="isInputActive(changpaiGame.title, method.title)"
                        :key="method.title"
                        @click="handleClick(changpaiGame.title, method)" :disabled="method.isBlocked"
                    >
                        <div class="c_component" :class="isOverStyle(method)">
                            <div class="c_dice--xsmall">
                                <div class="c_dot" v-for="n in +method.title.charAt(0)" :key="n"/>
                            </div>
                            <div class="c_dice--xsmall">
                                <div class="c_dot" v-for="n in +method.title.charAt(1)" :key="n"/>
                            </div>
                        </div>
                        <div class="c_component" :class="isUpdatePrize(method)">{{prize(method)}}</div>
                        <div :class="isOverStyle(changpaiGame)" class="c_component">
                            <div class="c_input--short">
                                <input class="c_input__inner" type="tel" @click.stop @input="setMethodMoney($event, changpaiGame.title, method)" @blur="handBlur($event, changpaiGame.title, method)"  :value="calcMoney(changpaiGame.title, method)" :disabled="method.isBlocked">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="c_col" v-else />
            </div>
            <!-- 点数 -->
            <div class="c_row  c_h-game-grid__header">
                <div class="c_component" :class="isOverStyle(dianshuGame)" >{{$t(dianshuGame.title_key)}}</div>
            </div>
            <ThreeTitle :showTitleThree="!isShowDemo" :loop="langCol" />
            <div class="c_row" v-for="i in dianshuGame.childs.length / langCol" :key="'4' + i">
                <div class="c_col" v-if="method.title" v-for="method in dianshuGame.childs.slice(((i - 1) * langCol), langCol * i)" :key="method.title">
                    <div class="c_row"
                        :class="isInputActive(dianshuGame.title, method.title)"
                        :key="method.title"
                        @click="handleClick(dianshuGame.title, method)" :disabled="method.isBlocked"
                    >
                        <div class="c_component" :class="isOverStyle(method)" >{{$t(method.title_key)}}</div>
                        <div class="c_component" :class="isUpdatePrize(method)">{{prize(method)}}</div>
                        <div :class="isOverStyle(dianshuGame)" class="c_component">
                            <div class="c_input--short">
                                <input class="c_input__inner" type="tel" @click.stop @input="setMethodMoney($event, dianshuGame.title, method)" @blur="handBlur($event, dianshuGame.title, method)"  :value="calcMoney(dianshuGame.title, method)" :disabled="method.isBlocked">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="c_col" v-else />
            </div>
        </div>
    </div>
</template>
<script>
    //特碼
    import GameCredit from '@C/games/GameCredit'
    import { mapGetters } from 'vuex'
    export default {
        name: 'K3_SIN_daxiaoshaibao',
        mixins: [GameCredit],
        data() {
            return {
                col: {
                    'cn': 5,
                    'us': 4
                }
            }
        },
        computed: {
            ...mapGetters([
                'lang'
            ]),
            sanjunAnddaxiaoGame() {
                let children = []
                this.lang === 'cn'
                    ? children = [...this.gameMenu.childs[0].childs, ...this.gameMenu.childs[1].childs, ...this.gameMenu.childs[2].childs]
                    : children = [...this.gameMenu.childs[0].childs, ...this.gameMenu.childs[1].childs, ...this.gameMenu.childs[2].childs, '', '']
                return {
                    title_key: `${this.$t(this.gameMenu.childs[0].title_key)}、${this.$t(this.gameMenu.childs[1].title_key)}、${this.$t(this.gameMenu.childs[2].title_key)}`,
                    title: `${this.gameMenu.childs[0].title}、${this.gameMenu.childs[1].title}、${this.gameMenu.childs[2].title}`,
                    childs: children
                }
            },
            weishaiAddquanshaiGame() {
                let children = []
                this.lang === 'cn'
                    ? children = [...this.gameMenu.childs[3].childs, ...this.gameMenu.childs[4].childs, '', '', '']
                    : children = [...this.gameMenu.childs[3].childs, ...this.gameMenu.childs[4].childs, '']
                return {
                    title_key: `${this.$t(this.gameMenu.childs[3].title_key)}、${this.$t(this.gameMenu.childs[4].title_key)}`,
                    title: `${this.gameMenu.childs[3].title}、${this.gameMenu.childs[4].title}`,
                    childs: children
                }
            },
            duanpaiGame() {
                let children = []
                this.lang === 'cn'
                    ? children = [...this.gameMenu.childs[5].childs, '', '', '', '']
                    : children = [...this.gameMenu.childs[5].childs, '', '']
                return {
                    title_key: `${this.$t(this.gameMenu.childs[5].title_key)}`,
                    title: `${this.gameMenu.childs[5].title}`,
                    childs: children
                }
            },
            changpaiGame() {
                let children = []
                this.lang === 'cn'
                    ? children = [...this.gameMenu.childs[6].childs]
                    : children = [...this.gameMenu.childs[6].childs, '']
                return {
                    title_key: `${this.$t(this.gameMenu.childs[6].title_key)}`,
                    title: `${this.gameMenu.childs[6].title}`,
                    childs: children
                }
            },
            dianshuGame() {
                let children = []
                this.lang === 'cn'
                    ? children = [...this.gameMenu.childs[7].childs, '']
                    : children = [...this.gameMenu.childs[7].childs, '', '']
                return {
                    title_key: `${this.$t(this.gameMenu.childs[7].title_key)}`,
                    title: `${this.gameMenu.childs[7].title}`,
                    childs: children
                }
            },
            langCol() {
                return this.col[this.lang] ? this.col[this.lang] : this.col['us']
            }
        }
    }
</script>
