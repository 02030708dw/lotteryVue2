
<template>
    <div class="gr_container  bg_primary  u_p--r10  u_p--l10">
        <div class="c_h-game-grid u_t--center">
            <!-- 三军、大小 -->
            <div class="c_row  c_h-game-grid__header">
                <div class="c_component" :class="isOverStyle(sanjunAnddaxiaoGame)" >{{$(sanjunAnddaxiaoGame.title)}}</div>
            </div>
            <ThreeTitle :showTitleThree="!isShowDemo" :loop="4" />
            <div class="c_row" v-for="i in 3" :key="i">
                <div class="c_col" v-if="method.title !== undefined" v-for="(method, j) in sanjunAnddaxiaoGame.childs.slice(((i - 1) * 4), 4 * i)">
                    <div class="c_row"
                        :class="isInputActive(sanjunAnddaxiaoGame.title, method.title)"
                        :key="method.title"
                        @click="handleClick(sanjunAnddaxiaoGame.title, method)" :disabled="method.isBlocked"
                    >
                        <div class="c_component" :class="isOverStyle(method)"  v-if="isBall(method.title)">
                            <div class="c_dice--xsmall">
                                <div class="c_dot" v-for="n in +method.title" :key="n" />
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
                <!-- 給最後一行兩個 col , 不然會跑版 -->
                <template v-if="i===3">
                    <div class="c_col"></div>
                    <div class="c_col"></div>
                </template>
            </div>
            <!-- 围骰、全骰 -->
            <div class="c_row  c_h-game-grid__header">
                <div class="c_component" :class="isOverStyle(weishaiAddquanshaiGame)" >{{$(weishaiAddquanshaiGame.title)}}</div>
            </div>
            <ThreeTitle :showTitleThree="!isShowDemo" :loop="4" />
            <div class="c_row" v-for="i in 2" :key="i">
                <div class="c_col" v-if="method.title !== undefined" v-for="method in weishaiAddquanshaiGame.childs.slice(((i - 1) * 4), 4 * i)">
                    <div class="c_row"
                        :class="isInputActive(weishaiAddquanshaiGame.title, method.title)"
                        :key="method.title"
                        @click="handleClick(weishaiAddquanshaiGame.title, method)" :disabled="method.isBlocked"
                    >
                        <div class="c_component" :class="isOverStyle(method)"  v-if="isBall(method.title)">
                            <div class="c_dice--xsmall">
                                <div class="c_dot" v-for="n in +method.title" :key="n" />
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
                <div class="c_component" :class="isOverStyle(duanpaiGame)" >{{$(duanpaiGame.title)}}</div>
            </div>
            <ThreeTitle :showTitleThree="!isShowDemo" :loop="4" />
            <div class="c_row" v-for="i in 2" :key="i">
                <div class="c_col" v-if="method.title !== undefined" v-for="method in duanpaiGame.childs.slice(((i - 1) * 4), 4 * i)">
                    <div class="c_row"
                        :class="isInputActive(duanpaiGame.title, method.title)"
                        :key="method.title"
                        @click="handleClick(duanpaiGame.title, method)" :disabled="method.isBlocked"
                    >
                        <div class="c_component">
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
                <div class="c_component" :class="isOverStyle(changpaiGame)" >{{$(changpaiGame.title)}}</div>
            </div>
            <ThreeTitle :showTitleThree="!isShowDemo" :loop="4" />
            <div class="c_row" v-for="i in 4" :key="i">
                <div class="c_col" v-if="method.title !== undefined" v-for="method in changpaiGame.childs.slice(((i - 1) * 4), 4 * i)">
                    <div class="c_row"
                        :class="isInputActive(changpaiGame.title, method.title)"
                        :key="method.title"
                        @click="handleClick(changpaiGame.title, method)" :disabled="method.isBlocked"
                    >
                        <div class="c_component">
                            <div class="c_dice--xsmall" >
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
                <div class="c_component" :class="isOverStyle(dianshuGame)" >{{$(dianshuGame.title)}}</div>
            </div>
            <ThreeTitle :showTitleThree="!isShowDemo" :loop="4" />
            <div class="c_row" v-for="i in 4" :key="i">
                <div class="c_col" v-if="method.title !== undefined" v-for="method in dianshuGame.childs.slice(((i - 1) * 4), 4 * i)">
                    <div class="c_row"
                        :class="isInputActive(dianshuGame.title, method.title)"
                        :key="method.title"
                        @click="handleClick(dianshuGame.title, method)" :disabled="method.isBlocked"
                    >
                        <div class="c_component" :class="isOverStyle(method)" >{{$t(method.title_key)}} </div>
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
import K3_SIN_daxiaoshaibao from '../980'

export default {
    name: 'K3_SIN_daxiaoshaibao',
    mixins: [K3_SIN_daxiaoshaibao],
    computed: {
        sanjunAnddaxiaoGame() {
            return {
                title: `${this.gameMenu.childs[0].title}、${this.gameMenu.childs[1].title}、${this.gameMenu.childs[2].title}`,
                childs: [...this.gameMenu.childs[0].childs, ...this.gameMenu.childs[1].childs, ...this.gameMenu.childs[2].childs, "", ""]
            }
        }
    }
}
</script>