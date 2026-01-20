<script>
import {defineComponent, reactive, ref} from '@vue/composition-api'

export default defineComponent({
    setup() {
        const showEmptyBtn = ref(false)
        const sp = ref(false)
        return {
            showEmptyBtn, sp
        }
    }
})
</script>

<template>
    <div class="gameTime">
        <div class="t">
            <slot name="top"/>
        </div>
        <div class="bott">
            <div class="btn" @click="$emit('onExtra','his')">{{ $t('history') }}</div>
            <div class="btn" @click="$emit('onExtra','betRecord')">{{ $t('投注记录') }}</div>
            <div class="empty btn" v-if="showEmptyBtn" @click="$emit('openAwardHis')">
                {{ $t('recentOpen') }}
                <slot name="btnnr"/>
            </div>
            <div class="btn" :class="sp?'act':''" @click="$emit('onExtra','per')">{{ $t('periodC') }}&nbsp;&nbsp;
                <p class="perIcon" :style="{transform:sp?'rotate(0deg)':'rotate(180deg)'}">
                    <svg data-v-80a21654="" t="1715154575055" style="transform: rotate(180deg);"
                         viewBox="0 0 1024 1024"
                         version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4352" width="12" height="12">
                        <path data-v-80a21654="" d="M0 170.666667 1024 170.666667 512 853.333333Z" p-id="4353"
                              fill="#ffffff"></path>
                    </svg>
                </p>
            </div>
        </div>
    </div>
</template>

<style scoped lang="less">
@fg: #bc6f16;
.gameTime {
    //min-height:1rem;
    //min-height: 1.2rem;
    width: 100%;
    // border: 1px solid;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    /*display: grid;
    grid-template-rows: 0.15rem 0.9rem;*/
    background: #e6e5d9;
    //overflow: hidden;

    .t {
        font-size: 18px;
        font-weight: 600;
        color: @fg;
        display: flex;
        justify-content: space-between;

        .l {
            .centerFlex(@row: @f_start);
            font-size: 13px;
            color: #5d5e6c;
            gap: 5px;

            > span {
                color: @fg;
                font-weight: normal;
            }
        }

        .r {
            .l();
            color: @fg;
            overflow: hidden;

            strong {
                font-weight: normal;
                margin-left: 10px;
                font-size: 18px;
                color: #f7931e;
            }
        }
    }

    .bott {
        //height: 0.9rem;
        display: flex;
        justify-content: space-between;
        gap: 5px;

        > div {
            flex: 1
        }

        .btn {
            border: none;
            text-align: center;
            font-size: 13px;
            .centerFlex();

            padding: 5px 0;
            background: #5d5e6c;
            color: #fff;
            border-radius: 5px;
            position: relative;

            .perIcon {
                position: absolute;
                right: 10px;
                top: 8px;
                transform-origin: center center;
            }

            &.act {
                background: #5d5e6c;
                color: #fff;
            }
        }
    }
}

.reliant {
    padding: 0 20px;
    transition: all 0.3s;
    position: absolute;
    left: 0;
    top: 280px;
    width: 100%;
    height: 0;
    opacity: 0;
    overflow: hidden;
    z-index: 99;
    background-color: #f2f2f2;

    &.open {
        opacity: 1;
        height: calc(100vh - 280px);
    }

    .button-group {
        height: 196px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 30px 24px;

        button {
            border-radius: 6px;
            color: #fff;
            border: none;
            background-color: #c69c6d;
            height: 60px;
        }
    }

    .praise {
        line-height: 50px;
        font-size: 28px;
        color: #c69c6d;
        border-bottom: 1px solid #c69c6d;
    }

    .nums {
        font-size: 24px;
        height: 56px;
        border-bottom: 1px dotted gray;
        display: flex;
        align-items: center;
        gap: 4px;

        .award {
            width: 190px;
            margin-right: 5px;
        }

        > ul {
            .centerFlex(@f_start);

            > li {
                width: 100px;
                height: 50px;
                .centerFlex();
                font-size: 25px;
                color: #fff;
                margin: 2px;
                background: #3b3e44;
                position: relative;

                &::before {
                    content: attr(s-able)+"st";
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 28px;
                    font-size: 18px;
                    height: 23px;
                    background: #a42a2a;
                    border-radius: 5px;
                }
            }
        }
    }

    .noData {
        font-size: 30px;
        margin-top: 50px;
        .centerFlex()
    }

    .close {
        position: absolute;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%);
    }

    .open {
        opacity: 1;
        height: calc(100vh - 280px);
    }
}

/*@media screen and (max-width: 375px) {
  .gameTime {
    background-color: lightblue;
  }
}

@media screen and (min-width: 376px) {
  .gameTime {
    background-color: lightgreen;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
}*/
.information {
    position: absolute;
    top: 200px;
    left: 0;
    width: 100%;
    height: 1220px;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
}
</style>
