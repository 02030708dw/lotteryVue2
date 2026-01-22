<script>
import {mapGetters } from 'vuex'
import Teleport from 'vue2-teleport'
import miniInfo from '../../../GameInfo/320/miniInfo.vue'
export default {
    name: 'betRecord',
    props: {
        modelValue: {
            type: Boolean,
            required: true
        },
    },
    model: {
        prop: 'modelValue',
        event: 'update:modelValue',
    },
    components: {
        Teleport,miniInfo
    },
    computed:{
        ...mapGetters(['VN_currentlottery'])
    },
    data() {
        return {
            step: 1
        }
    },
    methods: {
        updateModelValue(v) {
            this.$emit('update:modelValue', v)
        },
        close() {
            this.updateModelValue(false)
        }
    },
    mounted() {

    }
}
</script>

<template>
    <div v-if="modelValue">
        <transition name="fade">
        <Teleport to="body">
            <div class="mask" @click.self="close">
                <div class="content" @click.stop>
                    <div class="tit">
                        <div class="l"></div>
                        <div class="r" @click="close">
                            <i class="el-icon-close"/>
                        </div>
                    </div>
                    <div class="hT">
                        <p>Daily calculation interval: Beijing time</p>
                        <p>00:00:00-23:59:59</p>
                    </div>
                    <div class="betL">
                        <miniInfo :id="VN_currentlottery.lottery"/>
                    </div>
                </div>
            </div>
        </Teleport>
        </transition>
    </div>
</template>

<style scoped lang="less">
.mask {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    position: fixed;
    z-index: 1000;
    top: 0;
    .centerFlex();

    .content {
        overflow: hidden;
        width: 80%;
        height: 80%;
        background: #fff;
        border-radius: 15px;

        .tit {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 10px;
            height: 40px;
            background: linear-gradient(to bottom, #484848 50%, #333 50%);

            .r {
                .centerFlex();
                border-radius: 50%;
                color: rgb(255, 201, 133);;
                padding: 3px;
                border: 1px solid rgb(255, 201, 133);

                i {
                    transform: scale(0.8);
                }
            }
        }

        .hT {
            height: 40px;
            font-size: 13px;
            padding: 8px;
            background-color: #eae7d7;
        }
    }
}
.fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to {
    opacity: 0;
}
</style>
