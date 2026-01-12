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
    beforeMount() {
        this.getTrans()
    },
    watch: {
        lang(v) {
            this.updatePlayInfo()
        },
        $route(to, from) {
            this.updatePlayInfo()
        }
    },
    computed: {
        ...mapGetters([
            'subGame',
            'getPopActive',
            'transKeyArr',
            'gameMenuSub',
            'gameMenu',
            'menuIndex',
            'lang'
        ]),
        isPopActive() {
            return this.getPopActive.howToPlay
        },
        tempKey() {
            const methodName = this.gameMenu[this.menuIndex] ? this.gameMenu[this.menuIndex].name : ''
            return `${methodName}@${this.lang}`
        },
        // 從gameMenuSub取出需要翻譯的key
        makeKeysArr() {
            let keyArr = []
            this.gameMenuSub.forEach((row) => {
                row.childs.forEach((subMethod) => {
                    const {methoddesc_key, methodexample_key} = subMethod.faceparamter
                    keyArr.push(methoddesc_key, methodexample_key)
                })
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
            await this[_M.GET_TRANS]({
                lang: this.lang,
                arykey: this.makeKeysArr
            })
            this.cacheKey[this.tempKey] = true
        },
        // 設定玩法說明的顯示文字
        setPlayInfo() {
            const transArr = this.transKeyArr[this.lang]
            if (!transArr) return

            const {methoddesc_key, methodexample_key} = this.subGame.faceparamter
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