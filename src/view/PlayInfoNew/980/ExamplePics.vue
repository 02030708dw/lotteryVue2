<template>
    <!-- 示例右側區塊-示例圖 -->
    <div class="playinfo_rules_items--ex_img" v-if="cardData">
        <div class="playinfo_rules_items--ex_img-2"></div>
        <div>
            <!-- 示例圖-投注部分 -->
            <div class="playinfo_rules_items--ex_bet" :class="{ 'padding-none': getSampleCodes.length > 5 }">
                <!-- '投注' -->
                <p>{{$t('h_common_017')}}</p>
                <span v-if='cardData.sampleWords'>
                    {{getSampleWords}}
                </span>
                <ul v-if="!K3Style.includes(getPlayIndexWithoutLang)">
                    <li
                        v-for="(code, i) in getSampleCodes"
                        :key = "i"
                        :class="{
                            'order': cardData.arrow && cardData.arrow[i],
                            'bg-none': code === '',
                            'text-style': getSampleCodes.length === 1 }"
                    >
                        {{code}}
                    </li>
                </ul>
                <!-- 如果是K3 -->
                <div class="group__list" v-else>
                    <div
                        v-for="(code, i) in getSampleCodes"
                        :key = "i"
                        :class="{ 'c_dice--medium': parseInt(code) }">
                        <div class="c_dot" v-for="(num, index) in parseInt(code)" :key="index"></div>
                    </div>
                </div>
            </div>
            <!-- 示例圖-開獎部分 -->
            <div v-if="isMishi" class="playinfo_rules_items--ex_lottery">
                <!-- '开奖' -->
                <table>
                    <tr>
                        <td><p>{{$t('trend_pk10_t_020')}}</p></td>
                        <td><ul><li>5</li></ul></td>
                    </tr>
                    <tr>
                        <td><p>{{$t('trend_pk10_t_021')}}</p></td>
                        <td><ul><li>6</li></ul></td>
                    </tr>
                </table>
            </div>
            <div v-else class="playinfo_rules_items--ex_lottery"
                :class="{ 'padding-none': getBingoCodes.length > 5 }">
                <!-- '开奖' -->
                <p>{{$t(showOpenText)}}</p>
                <ul v-if="getMenuId !== 3 && !isK3 && !isKL">
                    <li
                        v-for="(code, i) in getBingoCodes"
                        :key = "i"
                        :class="{
                        'select': cardData.bingos && cardData.bingos[i],
                        'bg-none': code === '',
                        'text-style': getBingoCodes.length === 1,
                        'newline': i === 5 }">
                        {{code}}
                    </li>
                </ul>
                <!-- 越南彩 -->
                <div v-else-if="getMenuId === 3">
                    <div
                        v-for="(oneBingo, i) in cardData.bingoData"
                        :key = "i">
                        <span>{{getExampleLang[oneBingo.bingoWords] || oneBingo.bingoWords}}:</span>
                        <span
                            v-for="(code, i) in oneBingo.bingoCodes.split('|')"
                            :key="i"
                            :class="{'select--narrow': oneBingo.bingos && oneBingo.bingos[i]}"
                        >{{code}}</span>
                    </div>
                </div>
                <!-- K3 -->
                <div class="group__list" v-else-if="isK3">
                    <div
                        v-for="(code, i) in getBingoCodes"
                        :key = "i"
                        class="c_dice--medium">
                        <div class="c_dot" v-for="(num, index) in parseInt(code)" :key="index"></div>
                    </div>
                </div>
                <!-- KL -->
                <ul v-else>
                    <li
                        v-for="(ball, i) in getKLBingoCodes"
                        :key="i"
                        :class="{
                        'light':  !(cardData.bingos && cardData.bingos.includes(i)),
                        'newline': i === 5 }">
                        {{ball | zeroFormat}}
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    name: 'ExamplePics',
    props: {
        cardData: Object,
        menuName: String
    },
    data() {
        return {
            K3Style: ['K3', 'K3_SIN'],
            KLStyle: ['KL'],
            // 玩法收合 ex:五星
            isCloseArr: [],
            // 卡片示例展開 ex:五星直選
            openCardIdObj: {}
        }
    },
    filters: {
        zeroFormat(input) {
            return +input < 10 ? `0${input}` : input + ''
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
        isKL() {
            return this.KLStyle.includes(this.getPlayIndexWithoutLang)
        },
        isK3 () {
            return this.K3Style.includes(this.getPlayIndexWithoutLang)
        },
        isFanTan() {
            return this.menuName === 'fantan'
        },
        isMishi() {
            return this.menuName === 'mishi'
        },
        showOpenText() {
            if (this.isFanTan) {
                return 'pk10_t_128'
            }
            return 'h_common_018'
        },
        getPlayIndexWithoutLang() {
            // ex:SSC@cn -> SSC
            return this.playListIndex.split('@')[0]
        },
        getExampleLang() {
            return this.exampleTrans[this.lang] || {}
        },
        getSampleWords() {
            // sampleWords 裏頭有key, 也有數字
            return this.getExampleLang[this.cardData.sampleWords] || this.cardData.sampleWords
        },
        getSampleCodes() {
            return this.cardData.sampleCodes ? this.cardData.sampleCodes.split('|') : []
        },
        getKLBingoCodes() {
            return this.cardData.KL_BingoCodes ? this.cardData.KL_BingoCodes : []
        },
        getBingoCodes() {
            return this.cardData.bingoCodes ? this.cardData.bingoCodes.split('|') : []
        }
    }
}
</script>
