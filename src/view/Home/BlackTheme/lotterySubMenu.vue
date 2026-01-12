<template>
    <div>
        <!-- 选择彩种 -->
        <div class="title">{{$t('timetable_005')}}</div>
        <div class="menu-container" ref="menuContainer">
            <ul class="u_clearfix">
                <li
                    ref="li"
                    v-for="([key, data]) in $parent.subTabData"
                    @click="$parent.setSubMenuKey(key)"
                    :key="key"
                    :class="{is_active: key === $parent.subMenuKey}"
                >
                    <div>{{$t(data.title_key)}}</div>
                </li>
            </ul>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.title {
    font-size: 16px;
    line-height: 44px;
    color: white;
}
ul {
    position: relative;
    background: #333333;
    padding: 0 0 13px 0;
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
        border: 1px solid #fff;
        height: 36px;
        color: #fff;
        border-radius: 5px;
        cursor: pointer;
        text-align: center;
        margin: 3px 0;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    &.is_active {
        > div {
            color: #333;
            background-image: linear-gradient(to bottom, #FCC883, #BC8B5D);
            border: none;
        }
    }

}
</style>
<script>
import { mapGetters } from 'vuex'
export default {
    name: 'lotterySubMenu',
    // data() {
    //     return {
    //         diff: 40
    //     }
    // },

    computed: {
        ...mapGetters([
            'lang'
        ])
    },
    methods: {
    }
}
</script>