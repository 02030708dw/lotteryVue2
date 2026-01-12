<template>
    <div>
        <!-- 选择类别 -->
        <div class="title">{{$t('timetable_004')}}</div>
        <ul class="u_clearfix">
            <li
                ref="li"
                v-for="data in calcMenuData"
                @click="$parent.setMenuId(+data.menuType)"
                :key="data.menuType"
                :class="{
                    is_active: +data.menuType === +$parent.menuId,
                    arrow: +data.menuType === +$parent.menuId && !notSubmenu
                }"
            >
                <div>
                    {{ $t(data.title_key) }}
                </div>
            </li>
        </ul>
    </div>
</template>

<style lang="scss" scoped>
.title {
    font-size: 16px;
}
ul {
    position: relative;
    background: #333333;
    padding: 0px 0 13px 0;
    border-bottom: 1px solid #666;
}
li {
    float: left;
    display: flex;
    position: relative;
    padding: 0 3px;
    width: 33.33%;
    line-height: 100%;
    text-align: center;
    > div {
        width: 100%;
        border: 1px solid #c4a974;
        height: 36px;
        color: #c4a974;
        border-radius: 5px;
        cursor: pointer;
        margin: 3px 0;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    &.is_active {
        > div {
            color: #fff;
            background-image: linear-gradient(to bottom, #df2741, #8a012d);
            border: none;
        }
    }

}
@media screen and (max-width: 979px) {
    .menu-container {
        width: 100%;
    }
    .menu-slidePrev,
    .menu-slideNext {
        display: none;
    }
}
</style>
<script>
import { mapGetters } from 'vuex'
import { returnState } from '@UTIL'
export default {
    name: 'lotteryMenu',
    data() {
        return {
            // spaceWidth: 200
        }
    },
    props: {
        notSubmenu: Boolean
    },
    beforeMount() {
        const menuId = +this.calcMenuData[0].menuType
        this.$parent.setMenuId(menuId)
    },
    computed: {
        ...mapGetters(['lotteryMenuData', 'lang', 'popularEntries', 'calcMenuData', 'filterFavoriteLen'])
    },
    watch: {
        filterFavoriteLen() {
            this.$nextTick(() => {
                if (!this.filterFavoriteLen) {
                    this.$parent.setMenuId(+this.calcMenuData[0].menuType)
                }
            })
        }
    },
    methods: {}
}
</script>
