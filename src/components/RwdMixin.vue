<script>
import { mapGetters } from 'vuex'
export default {
    computed: {
        ...mapGetters([
            'RWDMode'
        ]),
        currentRWD() {
            switch (this.RWDMode) {
                case 1:
                    return 'RWD_980'
                case 2:
                    // return 'RWD_768'
                case 3:
                    return 'RWD_320'
                default:
                    return 'RWD_980'
            }
        }
    }
}
</script>
