<template>
    <div class="gr_lottery-category__lotteryBg">
        <img
            class="gr_lottery-category__table_img"
            :src="getBackgroundImage"
        />
        <div class="circular">
            <svg>
                <path d="M0.5,19.2c7.9-3.6,16.1-6.6,24.5-9c15.9-4.6,32.7-7,50.1-7c16.4,0,32.3,2.2,47.4,6.3c9.4,2.5,18.5,5.8,27.3,9.8" id="circle" />
                <text v-show="isX" :x="isX" class="circleText" :ref="'lotteryText'">
                    <textPath xlink:href="#circle">{{$t(getLotterySName)}}</textPath>
                </text>
            </svg>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
    name: 'svgl',
    props: {
        title: String,
        lotteryId: Number,
        menuId: Number,
        menuClass: String
    },
    data() {
        return {
            isX: 0,
            timer: null
        }
    },
    mounted() {
        this.interval()
    },
    beforeDestroy() {
        clearInterval(this.timer)
    },
    computed: {
        ...mapGetters([
            'lotteryList2'
        ]),
        getLotterySName() {
            const lotterySKey = {
                'lottery_name_205': 'lottery_name_s_020', //亚洲30秒骰宝    > 亚洲30秒
                'lottery_name_206': 'lottery_name_s_021', //亚洲1分骰宝     > 亚洲1分
                'lottery_name_207': 'lottery_name_s_009', //广西骰宝        > 世彩1分
                'lottery_name_208': 'lottery_name_s_014', //北京骰寶        > 北京
                'lottery_name_209': 'lottery_name_s_010', //江苏骰宝        > 江苏
                'lottery_name_210': 'lottery_name_s_011', //安徽骰宝        > 安徽
                'lottery_name_211': 'lottery_name_s_012', //湖北骰宝        > 湖北
                'lottery_name_240': 'lottery_name_s_020', //亚洲30秒鱼虾蟹  > 亚洲30秒
                'lottery_name_241': 'lottery_name_s_010', //江苏鱼虾蟹      > 江苏
                'lottery_name_270': 'lottery_name_114', // 幸运飞艇I
                'lottery_name_282': 'lottery_name_s_023', // 澳洲5分骰宝
                'lottery_name_280': 'lottery_name_s_024', // 亚洲1分鱼虾蟹
                'lottery_name_284': 'lottery_name_s_023' // 澳洲5分鱼虾蟹
            }
            return lotterySKey[this.title] || this.title
        },
        getBackgroundImage() {
            const pngName = this.lotteryList2[this.lotteryId].function_type
            return `/static/image/lottery/c_lottery-class--${pngName}.png`
        }
    },
    methods: {
        // 設定定時檢查
        interval(time = 500) {
            this.timer = setInterval(() => {
                this.isX = 0
                this.circleX()
            }, time)
        },
        // 計算isX
        circleX() {
            let stop = false
            const svgText = this.$refs.lotteryText
            const width = svgText.getBoundingClientRect().width
            this.isX = ((155 - width) / 2)
            stop = !!width

            stop && clearInterval(this.timer)
        },
        // 重新設定定時檢查
        handleResize() {
            clearInterval(this.timer)
            this.interval()
        }
    }
}
</script>