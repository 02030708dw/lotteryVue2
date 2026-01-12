<template>
    <div class="gr_prizePeriod_end" :class="{is_active: is_prizePeriod}">
        <div class="gr_prizePeriod_warp">
            <!-- '当期奖期已结束，请注意奖期变化' -->
            <p class="gr_prizePeriod_end--text">{{$t('popup_025')}}</p>
            <i class="el-icon-close gr_prizePeriod_end--close" @click="close()"></i>
        </div>
    </div>
</template>
<style lang="scss" scoped>
@import '~@CSS/main.scss';
.gr_prizePeriod_end {
    position: fixed;
    bottom: 10px;
    right: calc((100% - 980px) / 2 + 10px);
    z-index: 3000;
    opacity: 0;
    visibility: hidden;
    transition: 1s;
    &.is_active {
        opacity: 1;
        visibility: visible;
    }
}
.gr_prizePeriod_warp {
    padding: 0px 0px 0px 15px;
    background-color: rgba(73, 74, 84, 0.8);
    color: #ffffff;
    border-radius: 3px;
    .gr_prizePeriod_end--text {
        display: inline-block;
        margin-right: -5px;
    }
    .gr_prizePeriod_end--close {
        transform: scale(0.7);
        font-weight: bold;
        padding: 10px;
        padding: 13px 15px;
        &:hover {
            cursor: pointer;
            opacity: 0.5;
        }
    }
}
@media screen and (max-width: 979px) {
    .gr_prizePeriod_end {
        bottom: 60px;
        right: 0;
        width: 100%;
        text-align: center;
        .gr_prizePeriod_warp {
            display: inline-block;
            .gr_prizePeriod_end--text {
              font-size: 12px;
            }
            .gr_prizePeriod_end--close {
                &:hover {
                    opacity: 1;
                }
            }
        }
    }
}
</style>
<script>
    export default {
        name: 'PrizePeriodEnd',
        data() {
            return {
                is_prizePeriod: false
            }
        },
        beforeMount() {
            this.$root.$on('updateTipGamePlay', this.updateTipGamePlay)
        },
        beforeDestroy() {
            this.$root.$off('updateTipGamePlay', this.updateTipGamePlay)
        },
        methods: {
            updateTipGamePlay() {
                this.is_prizePeriod = true
                setTimeout(() => {
                    this.is_prizePeriod = false
                    this.close()
                }, 3000)
            },
            close() {
                this.is_prizePeriod = false
                this.$root.$emit('updateBonus')
            }
        }
    }
</script>
