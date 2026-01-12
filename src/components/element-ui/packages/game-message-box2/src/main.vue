<script type="text/babel">
  import MessageBox from '@E/packages/game-message-box3/src/main.vue'
  import { Observable } from 'rxjs/Observable'
  import 'rxjs/add/observable/from';
  export default {
    mixins: [MessageBox],
    data() {
      return {
        timer: null,
      }
    },
    updated() {
      if (this.issueEnd) {
        this.issueEnd = false
        let num = 3
        this.timer = Observable
          .interval(1000)
          .take(3)
          .subscribe(() => {
              this.confirmButtonText = `确定 ${--num}`
              num === 0 && this.doClose()
          })
      }
    },
    subscriptions() {
        return {
            visible$: this.$watchAsObservable('visible')
                .pluck('newValue')
                .filter(value => !value && this.timer)
                .do(() => this.timer.unsubscribe())
        }
    }
  }
</script>
