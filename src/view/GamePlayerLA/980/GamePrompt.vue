<template>
    <div class="gr_container bg_primary u_fz--small">
        <div class="gr_game-prompt">
            <div :class="['gr_game-prompt__tooltip', {is_active: isPopActive}]">
                <a
                    class="gr_tooltip__item"
                    ref="tipButton"
                    href="javascript: void(0)"
                    @click.stop="handleIsActive()"
                >
                    <i class="gr_item__icon  i_question" />
                    <!-- '玩法说明' -->
                    <span class="gr_item__text">{{$t('common_017')}}</span>
                </a>
                <div class="gr_tooltip__popper" ref="tips" @click.stop>
                    <span v-html="desc"></span>
                    <div class="u_p--t10">
                        <!-- {{$t("示例︰")}} -->
                        {{$t('common_018')}}
                    </div>
                    <span ref="example" v-html="example" />
                </div>
            </div>
        </div><!-- gr_game-prompt -->
    </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
    name: 'GamePrompt',
    data() {
        return {
            // 紀錄哪個key已經打過翻譯API
            cacheKey: {},
            // 示例
            desc: '',
            example: ''
        }
    },
    watch: {
        lang(v) {
            this.updatePlayInfo()
        }
    },
    computed: {
        ...mapGetters([
            'getPopActive',
            'transKeyArr',
            'LA_gameMenu',
            'LA_gameSubMenuObj',
            'LA_methodIsSelect',
            'LA_menuIndex',
            'lang'
        ]),
        isPopActive() {
            return this.getPopActive.howToPlay
        },
        tempKey() {
            const methodName = this.LA_gameMenu[this.LA_menuIndex] ? this.LA_gameMenu[this.LA_menuIndex].name : ''
            return `${methodName}@${this.lang}`
        },
        // 從LA_gameSubMenu取出需要翻譯的key
        makeKeysArr() {
            let keyArr = []
            Object.values(this.LA_gameSubMenuObj).forEach((subMethod) => {
                const {methoddesc_key, methodexample_key} = subMethod.faceparamter
                keyArr.push(methoddesc_key, methodexample_key)
            })
            return keyArr
        }
    },
    methods: {
        ...mapActions([
            _M.SET_POP_ACTIVE,
            _M.GET_TRANS
        ]),
        handleIsActive() {
            this.setPlayInfo()
            this[_M.SET_POP_ACTIVE]({howToPlay: !this.isPopActive})
        },
        async getTrans() {
            const res = await this[_M.GET_TRANS]({
                lang: this.lang,
                arykey: this.makeKeysArr
            })
            if (res.length) {
                this.cacheKey[this.tempKey] = true
            }
        },
        // 設定玩法說明的顯示文字
        setPlayInfo() {
            const transArr = this.transKeyArr[this.lang]
            if (!transArr) return
            const methodId = this.LA_methodIsSelect[0]
            const {methoddesc_key, methodexample_key} = this.LA_gameSubMenuObj[methodId].faceparamter
            this.desc = transArr[methoddesc_key]
            this.example = transArr[methodexample_key]
        },
        // 如果沒被快取,則更新文字
        updatePlayInfo() {
            if (!this.cacheKey[this.tempKey]) this.getTrans()
        }
    }
}
</script>