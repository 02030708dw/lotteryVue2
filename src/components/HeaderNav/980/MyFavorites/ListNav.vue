<template>
    <div>
        <div
            class="gr_my-favorites__list"
            v-model="favorites"
        >
            <Item
                class="gr_list__item"
                v-for="(item, i) in myFavorites"
                v-if="lotteryList2[item]"
                :key="item"
                :sort="i"
                :gameId="item"
                :index="i"
                @click.native="goGamePage(item)"
                :style="{
                    'width': `${favoritesWidth}px`, 
                    'left': i >= 10 && i <= 19 ? `${favoritesWidth}px` : i >= 20 && i <= 29 ? `${favoritesWidth * 2}px` : null,
                }"
            />
        </div>
    </div>
</template>
<script>
import ListNav_980 from '../../MyFavorites/List'
export default {
    name: 'ListNav_980',
    mixins: [ListNav_980],
    props: {
        favoritesWidth: Number
    }
}
</script>