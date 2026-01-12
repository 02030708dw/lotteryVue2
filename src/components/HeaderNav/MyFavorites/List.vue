<template>
    <div>
        <draggable
            class="gr_my-favorites__list"
            v-model="favorites"
            handle=".gr_item__draggable"
            v-bind="getOptions()"
        >
            <Item
                class="gr_list__item"
                :class="{'gr_list__item--draggable': isEdit}"
                v-for="(item, i) in isEdit ? favorites : myFavorites"
                v-if="lotteryList2[item]"
                :key="item"
                :isEdit="isEdit"
                :deleteItem="deleteItem"
                :sort="i"
                :gameId="item"
                @click.native="!isEdit && goGamePage(item);removeBodyScroll()"
            />
        </draggable>
    </div>
</template>
<script>
// :options="{group:'people'}" @start="drag=true" @end="drag=false"
import Item from './Item'
import draggable from 'vuedraggable'
import { mapGetters, mapActions } from 'vuex'
export default {
    name: 'Head',
    components: {
        Item,
        draggable
    },
    props: {
        cloneListData: Array,
        isEdit: Boolean,
        setCloneMyFavorites: Function
    },
    methods: {
        ...mapActions([
            _M.SET_MY_FAVORITES,
            _M.SET_POP_ACTIVE
        ]),
        deleteItem(i) {
            this.cloneListData.splice(i, 1)
        },
        goGamePage(id) {
            this[_M.SET_POP_ACTIVE]()
            const vnMenu = this.lotListVN2[id]
            const {menuId} = (this.lotteryList2[id] || {})
            if (!vnMenu) {
                this.$router.push(`/${this.gameRoutePath[menuId]}/${id}`)
            } else {
                const {lottery, menuId, is_local} = vnMenu
                const query = {
                    p: is_local ? 1 : menuId,
                    l: is_local ? lottery : null
                }
                this.$router.push({name: 'GamePlayerVN', query})
            }
        },
        removeBodyScroll() {
            document.body.classList.remove('bodyNoScroll')
        },
        getOptions() {
            return {
                scroll: false,
                animation: 100
            }
        }
    },
    computed: {
        ...mapGetters([
            'myFavorites',
            'lotteryList2',
            'lotListVN',
            'lotListVN2',
            'gameRoutePath'
        ]),
        favorites: {
            get() {
                return this.cloneListData
            },
            set(v) {
                this.setCloneMyFavorites(v)
            }
        }
        // filterMyFavorites() {
        //     return this.myFavorites.filter((item) => !!this.lotteryList2[item])
        // },
        // filterFavorites() {
        //     return this.favorites.filter((item) => !!this.lotteryList2[item])
        // }
    }
}
</script>