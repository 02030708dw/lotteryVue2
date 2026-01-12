<template>
    <div class="gr_lottery__opencode">
        <i18n path="common_001" tag="span" v-if="issueInfo.issue">
            <strong place="0">{{issueInfo.issue}}</strong>
        </i18n>
        <div class="balls-container" :class="menu.function_type">
            <div class="ball" v-for="(ball, i) in splitCode" :key="i">
                <div class="ball-item">
                    {{ball}}
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.balls-container {
    text-align: center;
    .ball {
        width: 45px;
        height: 45px;
        background: #9f997d;
        border-radius: 50%;
        cursor: default;
        display: inline-block;
        padding: 1px;
        position: relative;
        text-align: center;
        margin: 15px 5px 0 0;
    }
    .ball-item {
        position: relative;
        height: 100%;
        width: 100%;
        font-size: 32px;
        background-color: #666666;
        background-image: linear-gradient(135deg, #ffffff, #dddddd);
        filter: none;
        border-radius: inherit;
        display: inline-block;
        color: #666666;
        text-align: center;
        line-height: 45px;
    }
    // pk10
    &.PK10, &.PK10_SIN {
        .ball {
            width: 37px;
            height: 37px;
        }
        .ball-item {
            font-size: 24px;
            line-height: 37px;
        }
    }
    // pk10
    &.KL {
        .ball {
            width: 33px;
            height: 33px;
            margin: 1px 7px 0 0;
        }
        .ball-item {
            font-size: 16px;
            line-height: 33px;
        }
    }
}
</style>
<script>
import { mapActions, mapGetters } from 'vuex'
export default {
    name: 'Mixin',
    props: {
        menu: Object
    },
    data() {
        return {
            splitSymbol: /[,\s]/
        }
    },
    computed: {
        ...mapGetters([
            'lang',
            'allOpenIssue',
            'RWDMode'
        ]),
        issueInfo() {
            return this.allOpenIssue[this.menu.lottery] || {}
        },
        code() {
            return this.issueInfo.code || ''
        },
        splitCode() {
            return this.code.split(this.splitSymbol)
        }
    },
    methods: {
        ...mapActions([
            // _M.SET_MENU_ID
        ])
    }
}
</script>