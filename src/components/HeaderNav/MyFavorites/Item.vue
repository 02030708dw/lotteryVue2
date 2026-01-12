<template>
    <div>
        <svg
            class="gr_item__delete"
            viewBox="0 0 13.5 13.5"
            v-if="isEdit"
            @click="deleteItem(sort)"
        >
            <circle cx="6.75" cy="6.75" r="6.75" />
            <rect x="2.85" y="6.17" width="7.81" height="1.17" />
        </svg>
        <span class="gr_item__text" v-if="!isVN && !getLolli.includes(lotteryList2[gameId].lottery)">
            {{$t((lotteryList2[gameId] || {}).title_key)}}
        </span>
        <span class="gr_item__text" v-else>
            {{(lotListVN2[gameId].prefix ? $t(lotListVN2[gameId].prefix) + '-' : '' ) + $t(lotListVN2[gameId].title_key) }}
        </span>
        <span class="gr_item__draggable">
            <svg
                class="gr_draggable__icon"
                viewBox="0 0 13.42 7.73"
                v-if="isEdit"
            >
                <rect width="13.42" height="1.17" />
                <rect y="3.28" width="13.42" height="1.17" />
                <rect y="6.56" width="13.42" height="1.17" />
            </svg>
        </span>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
    name: 'Item',
    props: {
        gameId: [String, Number],
        deleteItem: Function,
        isEdit: Boolean,
        sort: Number
    },
    computed: {
        ...mapGetters([
            'lotteryList2',
            'lotListVN2',
            'getLolli'
        ]),
        isVN() {
            return Object.keys(this.lotListVN2).includes(this.gameId)
        }
    }
}
</script>
