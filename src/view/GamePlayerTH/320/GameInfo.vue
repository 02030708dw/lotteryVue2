<template>
    <div :class="['gr_game-vn-info', {is_active: isPopActive}]" @click="removeBodyScroll">
        <div class="gr_game-vn-info__popper" @click.stop>
            <div class="gr_popper__header">
                <div class="gr_header__title">
                    <!-- '项目' -->
                    {{$t('common_066')}}
                </div>
                <div class="gr_header__body">
                    <!-- '包含号码' -->
                    {{$t('vn_t_032')}}
                </div>
            </div>
            <div class="gr_popper__list" v-for="(title, j) in listTitle" :key="title">
                <div class="gr_list__title">{{$t(title)}}</div>
                <div class="gr_list__body">{{$t(listBody[j])}}</div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'

// ['大', '小', '单', '双',
// '大单', '大双', '小单', '小双',
// '单单', '双双', '单双', '双单',
// '内', '外']
const listTitle = [
    'common_020', 'common_021', 'common_024', 'common_025',
    'mark6_t_027', 'mark6_t_028', 'mark6_t_029', 'mark6_t_030',
    'vn_t_028', 'vn_t_029', 'vn_t_030', 'vn_t_031',
    'vn_t_026', 'vn_t_027']

const listBody = [
    'vn_t_033', 'vn_t_034', // 50~99 (共50个号码)', '00~49 (共50个号码)
    'vn_t_035', 'vn_t_036', //'01~99中的单数 (共50个号码)', '00~98中的双数 (共50个号码)',
    'vn_t_037', 'vn_t_038', //'50~99中的单数 (共25个号码)', '50~99中的双数 (共25个号码)',
    'vn_t_039', 'vn_t_040', // '00~49中的单数(共25个号码)', '00~49中的双数(共25个号码)',
    'vn_t_041', 'vn_t_042', // '00~99中十位与个位各取一个单数 (共25个号码)', '00~99中十位与个位各取一个单数 (共25个号码)',
    'vn_t_043', 'vn_t_044', // '00~99中十位取一个单数、个位取一个双数 (共25个号码)', '00~99中十位取一个双数、个位取一个单数 (共25个号码)',
    'vn_t_045', 'vn_t_046' // '25~74 (共50个号码)', '00~24,75~99 (共50个号码)'
]
export default {
    name: 'GameInfo',
    data() {
        return {
            listTitle,
            listBody
        }
    },
    methods: {
        removeBodyScroll() {
            document.body.classList.remove('bodyNoScroll')
        }
    },
    computed: {
        ...mapGetters([
            'getPopActive'
        ]),
        isPopActive() {
            return this.getPopActive.GameInfo
        }
    }
}
</script>