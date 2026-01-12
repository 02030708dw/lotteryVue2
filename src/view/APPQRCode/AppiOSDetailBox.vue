<template>
    <div class="gr_app-message-box--ios">
        <!-- <i class="gr_app-message-box__close  el-icon-close" @click="$parent.close" /> -->
        <svg class="gr_app-message-box__close" viewBox="0 0 22.04 22.04" @click="$parent.close">
            <line x1="21.69" y1="0.35" x2="0.35" y2="21.69" />
            <line x1="21.69" y1="21.69" x2="0.35" y2="0.35" />
        </svg>
        <div class="gr_app-message-box__content">
            <div class="gr_app-message-box__header">
                <!-- {{$t('扫码后您可以按照以下步骤進行APP安装。')}} -->
                {{$t('app_012')}}
                <br>
                <!-- {{$t('IOS安装步骤')}} -->
                {{$t('app_015')}}
            </div>
            <div class="gr_pop__1">
                <div class="gr_pop__num">1</div>
                <div class="gr_pop__text">
                    <!-- {{$t('1. 点击取消，关闭弹窗')}} -->
                    {{$t('app_016')}}
                </div>
            </div>
            <div class="gr_pop__2">
                <div class="gr_pop__num">2</div>
                <div class="gr_pop__text">
                    <!-- {{$t('2. 打开【设置】，选择【通用】')}} -->
                    {{$t('app_017')}}
                </div>
            </div>
            <div class="gr_pop__3">
                <div class="gr_pop__num">3</div>
                <div class="gr_pop__text">
                    <!-- {{$t('3. 选择【设备管理】  （部份系统显示为描述文件）')}} -->
                    {{$t('app_018')}}
                </div>
            </div>
            <div class="gr_pop__4">
                <div class="gr_pop__num">4</div>
                <div class="gr_pop__text">
                    <!-- {{$t('4. 选择【Agmar ...】')}} -->
                    {{$t('app_019')}}
                </div>
            </div>
            <div class="gr_pop__5">
                <div class="gr_pop__num">5</div>
                <div class="gr_pop__text">
                    <!-- {{$t('5. 选择信任【Agmar ...】')}} -->
                    {{$t('app_020')}}
                </div>
            </div>
            <div class="gr_pop__6">
                <div class="gr_pop__num">6</div>
                <div class="gr_pop__text">
                    <!-- {{$t('6. 选择【信任】即可完成设置')}} -->
                    {{$t('app_021')}}
                </div>
            </div>
        </div>
    </div>
</template>
