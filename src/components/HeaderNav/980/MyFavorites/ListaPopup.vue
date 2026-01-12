<template>
    <div>
        <div class="gr_pop__header">
            <!-- 编辑最爱 -->
            {{$t('home_057')}}
            <svg
                class="gr_header__close"
                viewBox="0 0 20.36 20.36"
                @click="close"
            >
                <line x1="0.36" y1="0.36" x2="20" y2="20" style="" />
                <line x1="0.36" y1="20" x2="20" y2="0.36" />
            </svg>
        </div>
        <draggable
            class="gr_my-favorites__draggable"
            v-model="favorites"
            handle=".gr_item__draggable"
            v-bind="getOptions()"
        >
            <Item
                class="gr_list__item gr_list__item--draggable"
                v-for="(item, i) in favorites"
                v-if="lotteryList2[item]"
                :key="item"
                :isEdit="isEdit"
                :deleteItem="deleteItem"
                :sort="i"
                :gameId="item"
            />
        </draggable>
        <!-- '确定' / '取消' -->
        <div class="gr_pop__button--draggable">
            <button
                class="gr_header__button  el-button el-button--primary el-button--default"
                :disabled="$parent.isDisabled"
                @click="apply"
            >
                {{$t('popup_004')}}
            </button>
            <button
                class="gr_header__button  el-button el-button--default"
                @click="close"
            >
                {{$t('home_040')}}
            </button>
        </div>
    </div>
</template>
<script>
import ListaPopup_980 from '../../MyFavorites/List'
export default {
    name: 'ListaPopup_980',
    mixins: [ListaPopup_980],
    methods: {
        apply() {
            this.$emit('apply')
        },
        close() {
            this.$emit('close')
        }
    }
}
</script>