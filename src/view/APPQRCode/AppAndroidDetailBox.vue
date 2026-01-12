<template>
    <div class="gr_app-message-box--android">
        <!-- <i class="gr_app-message-box__close  el-icon-close" @click="$parent.close" /> -->
        <svg class="gr_app-message-box__close" viewBox="0 0 22.04 22.04" @click="$parent.close">
            <line x1="21.69" y1="0.35" x2="0.35" y2="21.69" />
            <line x1="21.69" y1="21.69" x2="0.35" y2="0.35" />
        </svg>
        <div class="gr_app-message-box__prompt">
            <!-- {{$t('商店下载可省去以下步骤')}} -->
            {{$t('app_013')}}
            <a class="gr_google-play" :href="storeUrl" target="_blank" />
        </div>
        <div class="gr_app-message-box__content">
            <div class="gr_app-message-box__header">
                <!-- {{$t('扫码后您可以按照以下步骤進行APP安装。')}} -->
                {{$t('app_012')}}
                <br>
                <!-- {{$t('Android 安装步骤')}} -->
                {{$t('app_014')}}
            </div>
            <div class="gr_pop__1">
                <div class="gr_pop__num">1</div>
                <div class="gr_pop__text">
                    <!-- {{$t('1.扫描后点击【开启】')}} -->
                    {{$t('app_022')}}
                </div>
            </div>
            <div class="gr_pop__2">
                <div class="gr_pop__num">2</div>
                <div class="gr_pop__text">
                    <!-- {{$t('2.选择以【浏览器】开启')}} -->
                    {{$t('app_023')}}
                </div>
            </div>
            <div class="gr_pop__3">
                <div class="gr_pop__num">3</div>
                <div class="gr_pop__text">
                    <!-- {{$t('3.下载储存档案')}} -->
                    {{$t('app_024')}}
                </div>
            </div>
            <div class="gr_pop__4">
                <div class="gr_pop__num">4</div>
                <div class="gr_pop__text">
                    <!-- {{$t('4.【开启档案】安装')}} -->
                    {{$t('app_025')}}
                </div>
            </div>
            <div class="gr_pop__5">
                <div class="gr_pop__num">5</div>
                <div class="gr_pop__text">
                    <!-- {{$t('5.【继续安装】')}} -->
                    {{$t('app_016')}}
                </div>
            </div>
            <div class="gr_pop__6">
                <div class="gr_pop__num">6</div>
                <div class="gr_pop__text">
                    <!-- {{$t('6.【开启】世彩彩票APP游戏')}} -->
                    {{$t('app_027')}}
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            storeUrl: String
        }
    }
</script>