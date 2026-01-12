<template>
    <div class="u_t--center playinfo_container">
        <div class="playinfo_title">
            <!-- {{$t('销售时间')}} -->
            {{$t('销售时间')}}
        </div>
        <div class="playinfo_saletime">
            <ul>
                <li v-for="item in saleTimeList[playListIndex]" :key="item.title" >
                    <div class="playinfo_saletime--tit">
                        <span class="item_logo">
                            <img :src="`static/image/${getLangFolder}/c_lottery-category/c_lottery-class--${playListIndex}/c_lottery--${item.lotteryId}.svg`">
                        </span>
                        <br v-if="is980"/>
                        <p class="item_title">{{item.lotteryName}}</p>
                        <div class="playinfo_saletime--data">
                            <p class="item_text" v-for="(content, index) in (item.saleDate).split('\n')" :key="`${item.lotteryId}_${index}`">{{content}}</p>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
    name: 'SellingTime',
    computed: {
        ...mapGetters([
            'playListIndex',
            'saleTimeList',
            'lang',
            'RWDMode'
        ]),
        getLangFolder() {
            let folder = 'lang_cn'

            switch (this.lang) {
                case 'us':
                    folder = 'lang_us'
                    break
                case 'cn':
                    break
                default:
                    break
            }

            return folder
        },
        is980() {
            return this.RWDMode === 1
        }
    }
}
</script>
