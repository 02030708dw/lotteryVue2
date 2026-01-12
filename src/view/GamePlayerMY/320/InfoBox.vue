<template>
    <div v-if="isShowBox" class="el-message-box__wrapper" :style="{ zIndex }">
        <div class="el-message-box  el-scroll-content-message-box">
            <div class="el-message-box__header">
                <div class="el-message-box__title">
                    <!-- '玩法' -->
                    <span>{{$t('common_017')}}</span>
                </div>
                <i
                    class="el-message-box__close el-icon-close"
                    aria-label="Close"
                    @click="close"
                    v-if="isShowCloseIcon"
                />
                <div
                    @click="close"
                    v-if="isShowCloseIcon"
                    style="position: absolute; top: 0; right: 0; height: 100%; width: 50px; background: transparent; cursor: pointer;"
                />
            </div>
            <div class="el-message-box__content">
                <div class="gr_game-history__scroll-area">
                    <p class="methodDesc">
                        <span v-html="desc"/>
                    </p>
                    <p class="methodExample">
                        <!-- 示例︰ -->
                        <span>{{$t('common_018')}}</span>
                        <br/>
                        <span ref="example" v-html="example" />
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.gr_game-history__scroll-area {
    height: 180px;
    overflow-y: scroll;
    padding: 0 10px;
    & .methodExample {
        margin-top: 20px
    }
}
</style>
<script>
    import MessageBox from '@C/MessageBox/main'
    import GamePrompt from '../980/GamePrompt'

    export default {
        name: 'InfoBox',
        mixins: [MessageBox, GamePrompt],
        watch: {
            isShowBox(v) {
                v && this.setPlayInfo()
            }
        }
    }
</script>
