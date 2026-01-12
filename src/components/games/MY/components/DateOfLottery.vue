<template>
    <div class="dateLottery">
        <!-- '开奖日期' -->
        <p>
            <i class="i_dateLottery"></i>
            {{$t('popup_111') + '：' + issue}}
        </p>
    </div>
</template>
<style lang="scss">
@import '~@CSS/main.scss';
$top-color: #333333;
$bottom-color: #484848;
.dateLottery {
    height: 40px;
    p {
        i {
            position: relative;
            top: -2px;
            margin-right: 4px;
        }
        position: relative;
        z-index: 1;
        line-height: 24px;
        text-align: left;
        float: left;
        padding: 2px 12px 2px 6px;
        @include box_shadow(0 -14px 0 $top-color inset, 0 -28px 0 $bottom-color inset);
        color: text_color(default_invert);
        &:before,
        &:after {
            content: '';
            position: absolute;
            bottom: 0;
            right: -5px;
            height: 50%;
            width: 15px;
            transform: skew(30deg, 0deg);
            z-index: -1;
        }
        &:after {
            top: 0;
            background-color: $bottom-color;
            transform: skew(-30deg, 0deg);
        }
        &:before {
            bottom: 0;
            background-color: $top-color;
        }
    }
}
</style>

<script>
    import { mapGetters } from 'vuex'
    export default {
        name: 'DateOfLottery',
        computed: {
            ...mapGetters([
                'VN_allAreaIssue',
                'VN_week'
            ]),
            issue() {
                if (this.VN_allAreaIssue) {
                    const data = this.VN_allAreaIssue.split('-')[0]
                    const date = moment(data)
                    return `${date.format('MM-DD')} (${this.$t(this.VN_week[date.day()])})`
                }
                return ''
            }
        }
    }
</script>
