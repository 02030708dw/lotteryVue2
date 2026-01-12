<template>
    <div class="gr_container  gr_my-favorites" @click.stop>
        <div class="gr_my-favorites__inner">
            <Head
                :isEdit="isEdit"
                :setIsEdit="setIsEdit"
                :apply="apply"
                :popup="popup"
                :isDisabled="isDisabled"
            />
            <List
                :isEdit="isEdit"
                :cloneListData="cloneListData"
                :setCloneMyFavorites="setCloneMyFavorites"
            />
        </div>
        <MessageBox :zIndex="1990"  className="gr_my-favorites__pop">
            <Pop
                :cloneListData="cloneListData"
                :setCloneMyFavorites="setCloneMyFavorites"
                :isEdit="isEdit"
            />
        </MessageBox>
    </div>
</template>
<script>
import '@CSS/View/_v_my-favorites'
import Head from './Head'
import List from './List'
import Pop from './Pop'
import { mapGetters, mapActions } from 'vuex'
import { warnMessageBox } from '@UTIL'

export default {
    name: 'MyFavorites',
    components: {
        Head,
        List,
        Pop
    },
    data() {
        return {
            isEdit: false,
            cloneListData: [],
            isDisabled: false
        }
    },
    beforeRouteEnter (to, from, next) {
        next((that) => {
            that[_M.GET_STRING_POOL]({
                // pageList: ['Desktop', 'Message'],
                pageList: ['all'],
                pageTitle: to.meta.title
            })
        })
    },
    props: {
        setStore: Function
    },
    watch: {
        RWDMode() {
            this.RWDMode !== 3 && this.$router.replace('/')
        }
    },
    methods: {
        ...mapActions([
            _M.SET_MY_FAVORITES,
            _M.GET_STRING_POOL
        ]),
        setIsEdit() {
            !this.isEdit && this.setCloneMyFavorites([...this.myFavorites])
            this.$set(this, 'isEdit', !this.isEdit)
        },
        setCloneMyFavorites(data) {
            this.cloneListData = data
        },
        async apply() {
            this.isDisabled = true
            const isNotError = await this[_M.SET_MY_FAVORITES](this.cloneListData)
            if (!isNotError) {
                return this.$msg(warnMessageBox({
                    // '系统繁忙中，请再试一次。'
                    message: this.$t('popup_098')
                }))
            }
            this.setIsEdit()
            this.isDisabled = false
        },
        popup() {
            this.setCloneMyFavorites([...this.myFavorites])
            this.$msg({
                show: true,
                zIndex: 1990,
                isCustom: true
            })
            const contentNode = document.querySelectorAll("body")[0];
            contentNode.setAttribute("style","overflow-y:hidden;position:fixed;width:100%");

            var ta = document.querySelectorAll("body")[0];
            if (!ta.classList.contains('active')) {
                ta.className += ' ' + 'active';
            }

        }
    },
    computed: {
        ...mapGetters([
            // 'lotteryList',
            'myFavorites',
            'RWDMode'
        ])
    }
}
</script>