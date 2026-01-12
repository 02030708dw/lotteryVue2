<template>
<div class="gr_section__bar" style="padding: 0">
    <label
        class="gr_bar__label"
        v-for="(cbText, cbI) in checkboxes"
        :class="{is_active: currentActiveCbx[cbI], disable: !ableCheckbox[cbI]}"
        :key="cbI"
        @click.prevent="ableCheckbox[cbI] && selectCheckbox(rowIndex, cbI)"
    >
        <span class="gr_bar__checkbox  c_checkbox" :class="currentActiveCbx[cbI] ? 'is_checked' : ''">
            <span class="c_checkbox__inner" />
            <input type="checkbox" :checked="currentActiveCbx[cbI]"/>
        </span>
        <span>{{$t(cbText)}}</span>
    </label>
</div>
</template>

<style lang="scss" scoped>
    .disable {
        color: rgb(188,188,188);
        .c_checkbox__inner {
            border-color: rgb(188,188,188);
            cursor: default;
        }
    }
</style>

<script>
    import { mapGetters } from 'vuex'
    export default {
        name: 'checkbar',
        props: {
            // 有勾選的checkboxs
            activeCheckboxes: Object,
            // 勾選後執行動作
            selectCheckbox: Function,
            // checkboxs是否可啟用(封盤/休市關閉)
            ableCheckbox: Array
        },
        data() {
            return {
                // 固定只有一條row
                rowIndex: 0,
                // 上午/下午
                checkboxes: ['home_059', 'home_060']
            }
        },
        computed: {
            ...mapGetters([
                'RWDMode'
            ]),
            currentActiveCbx() {
                return this.activeCheckboxes[this.rowIndex] || {}
            }
        }
    }
</script>