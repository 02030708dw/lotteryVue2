<template>
    <div class="gr_game-statistics  gr_container">
        <div class="gr_game-statistics__total">
            <span>
				<!-- '总额' '{0}元' -->
                {{$t('popup_117')}}<i18n path="common_044">
                    <strong place="0">{{VN_gameAreaMoney}}</strong>
                    <span place="1">{{` ${currencySymbol}`}}</span>
                </i18n>
            </span>
        </div>
    </div>
</template>
<style lang="scss" scoped>
@import '~@CSS/main.scss';

$gr_game-statistics-height: 48px;

.gr_game-statistics {
    @extend %shadow_linear_gradient_dark_invert;
    background: rgba(backgrounds(primary), 0.8);
    font-size: $font_size_small;
    line-height: $gr_game-statistics-height;
    // position: fixed;
    // bottom: 47px;
    // left: 0;
    // z-index: 50;
    width: 100%;
    display: block;
    float: left;
    &::before {
        height: 5px;
        opacity: 0.5;
    }
    & [class*="el"].short {
        width: 60px;

        /deep/ .el-input__inner {
            text-align: center;
        }
    }
}
.gr_game-statistics__inner {
    padding: 0 10px;
}
.gr_game-statistics__inner p {
    padding: 0 0 0 5px;
}

.el-input {
    vertical-align: middle;
}

.gr_game-statistics__total {
    background: #e6e6e6;
    float: right;
    font-size: $font_size_small;
    line-height: 30px;
    text-align: right;
    padding: 0 10px;
    width: 100%;
}
.gr_game-statistics__mode {
    float: left;
    margin: 0 0 0 3px;
}
.gr_game-statistics__trace-stop {
    @include multi-lang {
        line-height: 32px;
        width: 100%;
    }
}
.c_slider {
    line-height: 20px;
}
.c_slider /deep/ .c_slider-point {
    display: block;
    margin: 0;
    text-align: left;
}
.c_slider /deep/ .c_slider-bar__tooltip {
    min-width: 120px;
}
</style>
<script>
import { mapGetters, mapActions } from 'vuex'
import { formatNumber } from '@UTIL'

export default {
    name: 'GameStatistics',
    computed: {
        ...mapGetters([
            'VN_gameAreaMoney',
            'currencySymbol'
        ])
    }

}
</script>
