<template>
    <div class="gr_lottery__opencode">
        <i18n path="common_001" tag="span">
            <strong place="0">{{ issueInfo.issue }}</strong>
        </i18n>
        <div class="balls-container" :class="menu.function_type">
            <div class="stock">
                {{ splitCode.join(", ") }}
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.balls-container {
    text-align: center;
    .stock {
        font-size: 28px;
        margin-top: 18px;
    }
}
</style>
<script>
import Mixin from './Mixin'
export default {
    name: 'MY',
    extends: Mixin
}
</script>
