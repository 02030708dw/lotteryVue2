<script>
import InfoList from '../980/InfoList'
import { Observable } from 'rxjs/Observable'

export default {
    name: 'InfoList',
    mixins: [InfoList],
    subscriptions() {
        const scroll = Observable.fromEvent(window, 'scroll') // mobile
        const scrollBody = Observable.fromEvent(document.body, 'scroll') // 320 window
        return {
            loadMore$: Observable
                .merge(scroll)
                .filter(() => !this.newsEventsIsLoading && this.tempList.length)
                .pluck('currentTarget')
                .filter(({ scrollY, innerHeight }) => (scrollY + innerHeight) > (this.$refs.content.offsetHeight - 150))
                .filter(() => this.totalPage >= this.page + 1)
                .do(() => this.search(this.page + 1)),
            loadMorePC$: Observable
                .merge(scrollBody)
                .filter(() => !this.newsEventsIsLoading && this.tempList.length)
                .pluck('currentTarget')
                .filter((body) => body.scrollTop > this.$refs.content.offsetHeight - 949)
                .filter(() => this.totalPage >= this.page + 1)
                .do(() => this.search(this.page + 1))
        }
    },}
</script>
