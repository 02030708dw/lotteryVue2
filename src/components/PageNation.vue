<template>
    <div class="gr_pagination">
        <!-- <span>总计 {{totalNumber}} 条记录，共 {{totalPage}} 页</span> -->
        <span class="gr_pagination__info">{{$t(pageStr, {'0': totalNumber, '1': totalPage})}}</span>
        <div class="gr_pagination__controller  u_clearfix">
            <a class="gr_controller__link" href="javascript:void(0);" @click="before" :class="firstClass"><i class="el-icon-arrow-left" /></a>
            <a class="gr_controller__link" href="javascript:void(0);" v-show="showFirst" @click="first" :class="isActive(1)">1</a>
            <a class="gr_controller__link  gr_controller__link--more-link" href="javascript:void(0);" v-show="showLeftMore" @click="handleLeftMore"><i class="el-icon-more" /><i class="el-icon-d-arrow-left" /></a>
            <a class="gr_controller__link" href="javascript:void(0);" @click="jumpPage(pages)"  v-for='pages in showList' :class="isActive(pages)" :key='pages'>{{pages}}</a>
            <a class="gr_controller__link  gr_controller__link--more-link" href="javascript:void(0);" v-show="showRightMore" @click="handleRightMore"><i class="el-icon-more" /><i class="el-icon-d-arrow-right" /></a>
            <a class="gr_controller__link" href="javascript:void(0);" v-show="showLast" @click="last" :class="isActive(totalPage)">{{totalPage}}</a>
            <a class="gr_controller__link" href="javascript:void(0);" @click="next" :class="lastClass"><i class="el-icon-arrow-right" /></a>
        </div>
    </div>
</template>
<script>
export default {
    name: 'PageNation',
    data() {
        return {
            showPage: 5,
            changePageNationCount: 3,
            // 总计{0}条记录，共{1}页
            pageStr: 'home_021'
        }
    },
    methods: {
        first() {
            this.search(1)
            this.setPageNationNum(1)
        },
        before() {
            if (+this.page === 1) return

            this.jumpPage(this.page - 1)
        },
        next() {
            if (+this.page === +this.totalPage) return

            this.jumpPage(this.page + 1)
        },
        last() {
            const half = this.showPage - 1
            this.search(this.totalPage)
            this.setPageNationNum((this.totalPage - half < 1) ? 1 : this.totalPage - half)
        },
        changeState(value) {
            const state = value
            this.change({ state })
        },
        isShowList(page) {
            return this.showList.indexOf(page) > -1
        },
        isActive(pages) {
            return this.page === pages ? 'is_active' : ''
        },
        handleLeftMore(param) {
            let num
            const half = parseInt(this.showPage / 2) + 2

            //press <<
            num = this.pageNationNum - this.changePageNationCount

            num = num > 1 ? num : 1

            this.setPageNationNum(num)
        },
        handleRightMore(param) {
            let num
            const half = parseInt(this.showPage / 2) + 2

            //press >>
            const jumpTo = this.pageNationNum + this.changePageNationCount

            if (jumpTo + this.showPage > this.totalPage) {
                num = this.totalPage - this.showPage
            } else {
                num = jumpTo
            }

            this.setPageNationNum(num)
        },
        jumpPage(page) {
            const half = parseInt(this.showPage / 2)
            let num

            if (page > this.totalPage - this.showPage + 1) {
                //last pages
                num = this.totalPage - this.showPage + 1
            } else if (page < this.showPage - half + 2) {
                //first pages
                num = 1
            } else {
                num = (page - half < 1) ? 1 : page - half
            }
            this.setPageNationNum(num)
            this.search(page)
        }
    },
    computed: {
        pagination() {
            return this.infoList.pagination
        },
        page: {
            set(page) {
                this.search(page)
            },
            get() {
                return this.infoList.pagination.page
            }
        },
        totalPage() {
            return this.infoList.pagination ? this.infoList.pagination.totalPage : 0
        },
        totalNumber() {
            return this.infoList.pagination ? this.infoList.pagination.totalNumber : 0
        },
        firstClass() {
            return this.page === 1 ? 'is_disabled' : ''
        },
        lastClass() {
            return this.page === this.totalPage ? 'is_disabled' : ''
        },
        showFirst() {
            return this.totalPage > this.showPage && this.pageNationNum > 1
        },
        showLast() {
            return this.totalPage > this.showPage && this.totalPage - this.pageNationNum >= this.showPage
        },
        showLeftMore() {
            return this.pageNationNum > 2
        },
        showRightMore() {
            const pn = (this.pageNationNum < 0) ? 1 : this.pageNationNum
            return this.totalPage - pn > this.showPage
        },
        showList() {
            let array = []
            if (this.showPage >= this.totalPage) {
                //show all
                for (let i = 0; this.totalPage > i; i++) {
                    array[array.length] = i + 1
                }
            } else {
                if (this.pageNationNum !== 1) {
                    //from pn to pn+showPage
                    for (let i = 0; this.showPage > i; i++) {
                        array[array.length] = i + this.pageNationNum
                    }
                } else {
                    //from 1 to showPage
                    for (let i = 0; this.showPage > i; i++) {
                        array[array.length] = i + 1
                    }
                }
            }
            return array
        }
    }
}
</script>
