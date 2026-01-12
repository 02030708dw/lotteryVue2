<template>
    <div class="gr_lottery__opencode">
        <i18n path="common_001" tag="span">
            <strong place="0">{{issueInfo.issue}}</strong>
        </i18n>
        <div class="balls-container" :class="menu.function_type">
            <router-link class="link" :target="RWDMode === 1 && '_blank'" :to="`/History/thail?menuCode=${menu.lottery}`">
                <!--开奖号码-->
                {{$t('bettingrc_028')}}
            </router-link>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.balls-container {
    text-align: center;
    .link {
        position: relative;
        border-radius: 15px;
        color: #0071BC;
        border: 1px solid #0071BC;
        font-size: 18px;
        top: 26px;
        padding: 5px 20px;
        z-index: 9;
        transition: all .3s ease;
        &:hover {
            background: #0071BC;
            color: #fff;
        }
    }

}
</style>
<script>
import Mixin from './Mixin'
export default {
    name: 'TH',
    extends: Mixin
}
</script>