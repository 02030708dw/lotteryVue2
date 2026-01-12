<template>
    <div @click="menuClick(menu)">
        <!-- 桌面玩法的圖示處理 -->
        <!-- 背景圖 -->
        <img
            class="gr_lottery-category__background table"
            src="static/image/lotteryBg/table-bg.jpg"
            alt=""
        />
        <favorite :lotteryId="lotteryId" />
        <svgl
            ref="tableSvg"
            :lotteryId="menu.lottery"
            :menuId="menu.menuId"
            :menuClass="menu.class"
            :title="menu.title_key"
        />
        <div class="gr_lottery__issue">
            <div>
                <svg width="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 15.11"><path class="cls-1" d="M3.56,3.56a.88.88,0,0,0,.88-.89V.89a.89.89,0,1,0-1.77,0V2.67A.89.89,0,0,0,3.56,3.56Z"/><path class="cls-1" d="M12.44,3.56a.89.89,0,0,0,.89-.89V.89a.89.89,0,1,0-1.77,0V2.67A.88.88,0,0,0,12.44,3.56Z"/><path class="cls-1" d="M15.11.89h-.89V2.67a1.78,1.78,0,0,1-3.55,0V.89H5.33V2.67a1.78,1.78,0,0,1-3.55,0V.89H.89A.89.89,0,0,0,0,1.78V14.22a.89.89,0,0,0,.89.89H15.11a.89.89,0,0,0,.89-.89V1.78A.89.89,0,0,0,15.11.89Zm0,12.44a.89.89,0,0,1-.89.89H1.78a.89.89,0,0,1-.89-.89V6.22a.89.89,0,0,1,.89-.89H14.22a.89.89,0,0,1,.89.89Z"/><rect class="cls-1" x="4.64" y="7.49" width="6.71" height="1.3"/><rect class="cls-1" x="4.64" y="10.23" width="6.71" height="1.3"/></svg>
                <i18n path="common_001" tag="span" v-if="hasIssue">
                    <strong place="0">{{flipTimer.issue}}</strong>
                </i18n>
                <span v-else-if="!notClose">CLOSED</span>
                <span v-else>
                    <!-- {{$t("目前尚未开放奖期")}} -->
                    {{$t('common_003')}}
                </span>
            </div>
            <div>
                <svg width="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path class="cls-1" d="M8,0a8,8,0,1,0,8,8A8,8,0,0,0,8,0ZM8,14.67A6.67,6.67,0,1,1,14.67,8,6.67,6.67,0,0,1,8,14.67Z"/><path class="cls-1" d="M12.89,7.11h-4v-4a.89.89,0,0,0-1.78,0V8A.89.89,0,0,0,8,8.89h4.89a.89.89,0,0,0,0-1.78Z"/></svg>
                <span v-if="!notClose">CLOSED</span>
                <span class="gr_lottery__coldtime" v-else>{{time}}</span>
            </div>
        </div>
        <Issue :menu="menu" />
        <a class="gr_lottery-category__link" v-if="menu.isNotOpen">
            <span>
                <!-- {{$t("暂时关闭")}} -->
                {{$t('home_003')}}
            </span>
        </a>
        <router-link class="gr_lottery-category__link" :to="gameRouter(menu.router, menu.lottery)" v-else>
            <span class="gr_lottery-category__title">
                <span class="gr_title__text">{{$t(menu.title_key)}}</span>
                <i class="gr_title__icon" :class="getIcon(menu)" />
            </span>
        </router-link>
    </div>
</template>
<script>
import svgl from '../../svgl'
import Mixin from './Mixin'
export default {
    name: 'TableMixin',
    components: {
        svgl
    },
    extends: Mixin
}
</script>