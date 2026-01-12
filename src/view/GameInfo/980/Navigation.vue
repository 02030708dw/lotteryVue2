<template>
    <div class="gr_container bg_secondary gr_page__nav">
        <div class="u_clearfix">
            <!-- {{$t("投注记录")}} -->
            {{$t('bettingrc_001')}}
            <span v-if="isShowDetail">
                <i class="el-icon-arrow-right u_fz--small u_p--r5 u_p--l5" />
                <!-- {{$t("投注详情")}} -->
                {{$t('bettingrc_078')}}
            </span>
        </div>
    </div>
</template>

<script>

export default {
    name: 'Navigation',
    props: {
        isShowDetail: Boolean
    }
}
</script>