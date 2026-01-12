<template>
    <div
        v-if="isShowBox"
        class="el-message-box__wrapper"
        :style="{ zIndex }"
        @click="isOutSideClickClose && close()"
        @touchmove.stop
        @mousewheel.stop
    >
        <div class="el-message-box" :class="className" @click.stop >
            <template  v-if="!$slots.default">
                <div class="el-message-box__header" v-if="title !== undefined">
                    <div class="el-message-box__title">{{ $t(title) }}</div>
                    <i class="el-message-box__close el-icon-close" aria-label="Close" @click="close" v-if="isShowCloseIcon"></i>
                    <div
                        @click="close"
                        v-if="isShowCloseIcon"
                        style="position: absolute; top: 0; right: 0; height: 100%; width: 50px; background: transparent; cursor: pointer;"
                    />
                </div>
                <div class="el-message-box__content">
                    <div class="el-message-box__status" :class="typeClass"></div>
                    <div class="el-message-box__message">
                        <!-- 彩种或玩法已关闭 -->
                        {{$t('GameConfig_019_0001')}}
                    </div>
                    <div class="el-message-box__message content">
                        <!-- 下列彩种或玩法已关闭 -->
                        {{$t('popup_152')}}
                    </div>
                    <ul class="el-message-box__infoBox">
                        <li v-for="(item) in list" :key="item.str">
                            <span class="orange">{{$t(lotteryList2[item.lotteryId].title_key)}}</span>
                            {{item.method ? `[${$t(methodName[item.method])}${item.subMethod ? ('-' + $t(methodName[item.subMethod])) : ''}]` : ''}}

                        </li>
                    </ul>
                </div>
                <div class="el-message-box__btns">
                    <el-button
                        ref="confirm"
                        v-show="isShowConfirmBtn"
                        class="el-button--primary"
                        :loading="isConfirmLoading"
                        @click.native="confirm">
                        {{ $t(confirmBtnText) }}
                    </el-button>
                </div>
            </template>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.content {
    font-size: 14px;
    font-weight: bold;
    margin-top: 10px;
}
.orange {
    color: #fb8032;
}
.el-message-box__infoBox {
    margin-top: 5px;
    margin-left: 40px;
    height: 100px;
    background: #f8f7f2;
    border: 1px solid gray;
    padding: 5px 10px;
    overflow-y: scroll;
}

</style>
<script>
    import MessageBox from '@C/MessageBox/main'
import { mapGetters, mapActions } from 'vuex'
    export default {
        name: 'StopMsgBox',
        mixins: [MessageBox],
        data() {
            return {
                methodName: {
                    '2d': '2D',
                    '3d': '3D',
                    '4d': '4D',
                    pl2: 'PL2',
                    pl3: 'PL3',
                    teshu: 'vn_t_007', //特殊
                    tou: 'vn_t_018', //头,
                    wei: 'vn_t_019', //尾
                    touwei: 'vn_t_020', //头尾
                    baozu: 'vn_t_021', //包组
                    baozu7: 'vn_t_022' //包组7
                }
            }
        },
        methods: {

            // reset() {
            // },
            // cancelClick() {
            //     this.reset()
            //     this.cancel()
            // }
        },
        computed: {
            ...mapGetters([
                // 'VN_week',
                'VN_nowblockedData',
                'lotteryList2',
                'VN_gameOrder',
                'VN_gameSubmit'
            ]),
            fast() {
                return this.data ? this.data.fast : null
            },
            isFilter() {
                return this.data ? this.data.isFilter : null
            },
            order() {
                return this.fast ? this.VN_gameOrder : this.VN_gameSubmit
            },
            list() {
                if (this.isFilter) {
                    const list = this.fast ? this.VN_gameOrder.showList : this.VN_gameSubmit.showList
                    return this.VN_nowblockedData.filter(({lotteryId, methodId}) => list.find(({cityId, methodId: mId}) => methodId ? +methodId === +mId : +lotteryId === +cityId))
                } else {
                    return this.VN_nowblockedData
                }
            }
        }
    }
</script>
