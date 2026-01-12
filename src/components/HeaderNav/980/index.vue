<template>
    <div class="gr_header u_clearfix">
        <HeaderLogo />
        <HeaderNavbar :popup="popup" />
        <HeaderUserarea />
        <HeaderLanguage />
        <MessageBox :zIndex="1990"  className="gr_news-message-box" v-if="popupVal === 'newsPopup'">
        <!-- 最新公告 -->
            <NewsEventsPop class="is_active" />
        </MessageBox>
        <MessageBox :zIndex="1992"  className="gr_news-message-box gr_board-message-box" >
            <ScoreBoard/>
        </MessageBox>
        <MessageBox :zIndex="1990"  className="gr_my-favorites__pop" v-if="popupVal === 'favoritesAddPopup'">
        <!-- 新增最愛 -->
            <Pop
                :cloneListData="cloneListData"
                :setCloneMyFavorites="setCloneMyFavorites"
                :isEdit="isEdit"
            />
        </MessageBox>
        <!-- 編輯最愛 -->
        <!-- <MessageBox :zIndex="1990"  className="gr_my-favorites__pop" v-if="popupVal === 'favoritesSetPopup'">
            <ListaPopup
                :class="{'is_ie9': isIE9}"
                :cloneListData="cloneListData"
                :setCloneMyFavorites="setCloneMyFavorites"
                :isEdit="isEdit"
                @close="close"
                @apply="apply"
            />

        </MessageBox> -->
        <!-- 編輯最愛，拖曳套件在平板上跟 MessageBox 有衝突 -->
        <div class="el-message-box__wrapper" :style="{zIndex: popupVal === 'favoritesSetPopup' ? '1999' : '-1'}">
            <div v-if="popupVal === 'favoritesSetPopup'" class="el-message-box gr_my-favorites__pop">
                <ListaPopup
                    :class="{'is_ie9': isIE9}"
                    :cloneListData="cloneListData"
                    :setCloneMyFavorites="setCloneMyFavorites"
                    :isEdit="isEdit"
                    @close="close"
                    @apply="apply"
                />
            </div>
        </div>
    </div>
</template>
<script>
import HeaderLogo from './HeaderLogo'
import HeaderNavbar from './HeaderNavbar'
import HeaderUserarea from './HeaderUserarea'
import HeaderLanguage from './HeaderLanguage'
import NewsEventsPop from '@V/NewsEvents/980'
import Pop from './MyFavorites/Pop'
import ListaPopup from './MyFavorites/ListaPopup'
import ScoreBoard from '@V/ScoreBoard/980'
import { mapActions, mapGetters } from 'vuex'
import { warnMessageBox } from '@UTIL'
import NewsEvents from '@S/modules/NewsEvents/'
export default {
    name: 'HeaderNavbar_980',
    components: {
        HeaderLogo,
        HeaderNavbar,
        HeaderUserarea,
        HeaderLanguage,
        ScoreBoard,
        NewsEventsPop,
        Pop,
        ListaPopup
    },
    data() {
        return {
            first: true,
            popupVal: '',
            isEdit: false,
            cloneListData: [],
            contentNode: document.querySelectorAll('body')[0],
            isDisabled: false,
            isIE9: false
        }
    },
    props: {
        setStore: Function
    },
    destroyed() {
        this.first === false && this[_M.SET_NEWS_EVENTS_DATA]()
    },
    computed: {
        ...mapGetters([
            // 'lotteryList',
            'myFavorites',
            'RWDMode',
            'getPopActive'
        ]),
        isNewsPopup() {
            return this.getPopActive.newsPopup
        }
    },
    methods: {
        ...mapActions([
            _M.SET_HEADER_NAV_IS_BACK,
            _M.SET_NEWS_EVENTS_DATA,
            _M.GET_NEWS_EVENTS_LIST,
            _M.SET_NEWS_EVENTS_DETAIL_INDEX,
            _M.GET_STRING_POOL,
            _M.SET_MY_FAVORITES,
            _M.SET_POP_ACTIVE
        ]),
        setStoreNews(storeObj) {
            Object.keys(storeObj).forEach((name) => {
                if (!this.$store._modules.root.getChild(name)) {
                    this.$store.registerModule(name, storeObj[name])
                }
            })
        },
        setIsEdit() {
            !this.isEdit && this.setCloneMyFavorites([...this.myFavorites])
            this.$set(this, 'isEdit', !this.isEdit)
            this.close()
        },
        setCloneMyFavorites(data) {
            this.cloneListData = data
        },
        favoriteMenuLen() {
            this[_M.SET_POP_ACTIVE]({gameFavorite: !this.isGameFavoriteMenuActive})
            const listNav = document.querySelectorAll('.gr_my-favorites__list .gr_list__item')
            const listNavWarp = document.querySelector('.gr_my-favorites__warp')
            if (listNav !== undefined) {
                var array = []
                for (var i = 0; i < listNav.length; i++) {
                    listNav[i].childNodes && (array.push(listNav[i].childNodes[2].offsetWidth))
                }
                const listNavMax = Math.max(...array) + 10
                for (var j = 0; j < listNav.length; j++) {
                    listNav[j].style.width = listNavMax + 'px'
                    if (j <= 9) {
                        listNavWarp.style.width = listNavMax + 'px'
                        listNav[j].style.left = '0px'
                    } else if (j >= 10 && j <= 19) {
                        listNavWarp.style.width = listNavMax * 2 + 'px'
                        listNav[j].style.left = listNavMax + 'px'
                    } else if (j >= 20) {
                        listNavWarp.style.width = listNavMax * 3 + 'px'
                        listNav[j].style.left = listNavMax * 2 + 'px'
                    }
                }
            }
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
            this.favoriteMenuLen()
            this.isDisabled = false
        },
        addBodyScroll() {
            this.contentNode.className = 'bodyNoScroll'
        },
        removeBodyScroll() {
            this.contentNode.className = ' '
        },
        popup(val) {
            if (navigator.userAgent.indexOf('MSIE 9.0') > 0) this.isIE9 = true
            this.popupVal = val
            if (val === 'newsPopup') {
                this[_M.SET_POP_ACTIVE]({newsPopup: true})
                //lazy load store
                if (this.first) {
                    this.setStoreNews({ NewsEvents })
                    this.first = false
                }
                this[_M.GET_NEWS_EVENTS_LIST]()

                //reset to list
                this[_M.SET_NEWS_EVENTS_DETAIL_INDEX]('')
            } else if (val === 'favoritesAddPopup') {
                this.setCloneMyFavorites([...this.myFavorites])
            } else if (val === 'favoritesSetPopup') {
                this.setCloneMyFavorites([...this.myFavorites])
                this.$set(this, 'isEdit', true)
            }
            this.addBodyScroll()
            this.$msg({
                show: true,
                zIndex: 1990,
                isCustom: true
            })
        },
        close() {
            this.$msg({
                show: false,
                zIndex: 1990,
                isCustom: false
            })
            this[_M.SET_POP_ACTIVE]({gameFavorite: !this.isGameFavoriteMenuActive})
            this.popupVal = ''
            this.removeBodyScroll()
        }
    }
}
</script>
