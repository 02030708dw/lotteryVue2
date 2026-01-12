<template>
    <div>
        <svg class="gr_news-message-box__close" viewBox="0 0 22.04 22.04" @click="close">
            <line x1="21.69" y1="0.35" x2="0.35" y2="21.69" />
            <line x1="21.69" y1="21.69" x2="0.35" y2="0.35" />
        </svg>
        <div class="gr_news-message-box__header">
            <i class="i_news" />
            <!-- {{ $t("最新公告") }} -->
            <span class="gr_header__text">{{$t('news_001')}}</span>
        </div>
        <div class="gr_news-message-box__content">
            <InfoList />
        </div>
    </div>
</template>
<script>
import '@CSS/View/_v_news-events'
import InfoList from './InfoList'

export default {
    name: 'NewsEvents',
    components: {
        InfoList
    },
    methods: {
        close() {
            this.$msg({
                show: false,
                zIndex: 1990,
                isCustom: false
            })
            const contentNode = document.querySelectorAll('body')[0]
            contentNode.className = ' '
        }
    }
}
</script>