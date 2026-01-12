<template>
    <div class="gr_app">
        <HeaderNav />
        <div class="gr_app__container  gr_container">
            <div class="gr_app__slogan">
                <!-- {{$t("随时随地 一指致富")}} -->
                {{$t('app_001')}}
            </div>
            <div class="gr_app__qrcode">
                <div class="gr_qrcode__image">
                    <!-- put QRcode here -->
                    <img src="/api/v1/login/QrCode" alt="QRCode">
                </div>
                <span class="gr_qrcode__text">for iOS & Android<br>QR Code</span>
                <a class="gr_google-play" :href="storeUrl" target="_blank" />
            </div><!-- gr_app__qrcode -->

            <div class="gr_app__step">
                <div class="gr_step__1">
                    <div class="gr_step__header  u_clearfix">
                        <div class="gr_header__num">01</div>
                        <div class="gr_header__title">
                            <!-- {{$t("下载APP")}} -->
                            {{$t('app_002')}}
                        </div>
                        <div class="gr_header__desc">
                            <!-- {{$t("拿起手机，扫码安装。")}} -->
                            {{$t('app_003')}}
                        </div>
                    </div>
                    <div class="gr_step__content">
                        <button type="button" class="gr_step__button" @click="showInfo(0)">
                            <!-- {{$t("Android安装教程")}} -->
                            {{$t('app_004')}}
                        </button>
                        <button type="button" class="gr_step__button" @click="showInfo(1)">
                            <!-- {{$t("IOS安装教程")}} -->
                            {{$t('app_005')}}
                        </button>
                    </div>
                </div>
                <div class="gr_step__2">
                    <div class="gr_step__header  u_clearfix">
                        <div class="gr_header__num">02</div>
                        <div class="gr_header__title">
                            <!-- {{$t("登入APP")}} -->
                            {{$t('app_006')}}
                        </div>
                        <div class="gr_header__desc">
                            <!-- {{$t("开启APP，再次扫码。")}} -->
                            {{$t('app_007')}}
                        </div>
                    </div>
                    <div class="gr_step__content"></div>
                </div>
                <div class="gr_step__hr">
                    <div class="gr_hr__dot" />
                </div>
                <div class="gr_step__3">
                    <div class="gr_step__header  u_clearfix">
                        <div class="gr_header__num">03</div>
                        <div class="gr_header__title">
                            <!-- {{$t("轻松购彩，一指致富！")}} -->
                            {{$t('app_008')}}
                        </div>
                    </div>
                    <div class="gr_step__content"></div>
                </div>
            </div>
        </div>
        <MessageBox :zIndex="1998" className="gr_app-message-box" >
            <component :is="currentBox" :storeUrl="storeUrl" />
        </MessageBox>
    </div>
</template>
<script>
import '@CSS/View/_v_app'
import { handleAjax } from '@UTIL'
import { API } from '@API'
import { mapActions } from 'vuex'
import HeaderNav from '@C/HeaderNav'
import AppAndroidDetailBox from './AppAndroidDetailBox'
import AppiOSDetailBox from './AppiOSDetailBox'

export default {
    name: 'APPQRCode',
    components: { HeaderNav, AppAndroidDetailBox, AppiOSDetailBox },
    data() {
        return {
            showBoxType: 0,
            storeUrl: 'storeUrlString'
        }
    },
    beforeRouteEnter (to, from, next) {
        next((that) => {
            that[_M.GET_STRING_POOL]({
                // pageList: ['Desktop', 'APPQRCode', 'tools/lottery'],
                pageList: ['all'],
                pageTitle: to.meta.title
            })
        })
    },
    async created() {
        const params = { os: 'android' }
        const data = await handleAjax(API.getAPPUrl, params, this.$store.getters)
        this.storeUrl = data.data.store_url
    },
    methods: {
        ...mapActions([
            _M.SET_MESSAGE_BOX_DATA,
            _M.GET_STRING_POOL
        ]),
        showInfo(i) {
            this.showBoxType = i
            this.$msg({
                show: true,
                zIndex: 1998,
                isCustom: true
            })
        }
    },
    computed: {
        currentBox() {
            return this.showBoxType ? 'AppiOSDetailBox' : 'AppAndroidDetailBox'
        }
    }
}
</script>
