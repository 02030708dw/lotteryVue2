<script>
import PageNation from '@C/PageNation'
import { mapGetters, mapActions } from 'vuex'
import { b64EncodeUnicode } from '@UTIL'

export default {
    name: 'PageNation',
    mixins: [PageNation],
    props: {
        lotteryCountry: String
    },
    methods: {
        ...mapActions([
            _M.GET_GAME_INFO_LIST,
            _M.SET_GAME_INFO_PAGE_NATION_NUM
        ]),
        search(page) {
            if (page === this.page) {
                return
            }
            this[_M.GET_GAME_INFO_LIST]({page, calSum: true, countryType: this.lotteryCountry})
            this.changeUrl()
        },
        setPageNationNum(page) {
            if (page === this.gameInfoPageNationNum) {
                return
            }
            this[_M.SET_GAME_INFO_PAGE_NATION_NUM](page)
        },
        changeUrl() {
            let search = {}
            Object.keys(this.gameInfoData).forEach(key => {
                if(this.gameInfoData[key]) {
                    search[key] = this.gameInfoData[key]
                }
            })
            const urlCode = b64EncodeUnicode(JSON.stringify(search))
            this.$router.replace(`/GameInfo/${urlCode}`)
        }
    },
    computed: {
        ...mapGetters([
            'gameInfoList',
            'gameInfoData',
            'gameInfoPageNationNum'
        ]),
        infoList() {
            return this.gameInfoList
        },
        pageNationNum() {
            return this.gameInfoPageNationNum
        }
    }
}
</script>
