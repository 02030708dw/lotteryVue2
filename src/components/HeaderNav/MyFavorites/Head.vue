<template>
    <div class="gr_my-favorites__header">
        <div class="gr_header__add" @click="popup()">
            <svg class="gr_add__icon" viewBox="0 0 14.67 14.67" v-if="!isEdit">
                <rect x="6.08" width="2.5" height="14.67" />
                <rect x="6.08" width="2.5" height="14.67" transform="translate(14.67 0) rotate(90)" />
            </svg>
            <!-- '立即加入最爱彩种' -->
            <span class="gr_add__text" v-if="!myFavorites.length">{{$t('home_038')}}</span>
        </div>
        <svg
            class="gr_header__edit"
            viewBox="0 0 21.37 21.37"
            v-if="myFavorites.length && !isEdit"
            @click="setIsEdit"
        >
            <path d="M20.89,8.66l-.56,0a1.86,1.86,0,0,1-1.61-1.15l-.06-.16h0a1.87,1.87,0,0,1,.34-2l.37-.4a.5.5,0,0,0,0-.68L17.15,2a.48.48,0,0,0-.68,0l-.42.37a1.83,1.83,0,0,1-2,.32l0,0-.13,0A1.84,1.84,0,0,1,12.77,1l0-.55A.49.49,0,0,0,12.26,0H9.14a.49.49,0,0,0-.48.48l0,.56a1.83,1.83,0,0,1-1.15,1.6l-.16.07h0a1.86,1.86,0,0,1-2-.34L4.93,2a.48.48,0,0,0-.68,0L2,4.22A.48.48,0,0,0,2,4.9l.37.42a1.83,1.83,0,0,1,.32,1.95l0,.05s0,.08,0,.13A1.84,1.84,0,0,1,1,8.6l-.55,0A.49.49,0,0,0,0,9.1v3.12a.49.49,0,0,0,.48.49l.56,0a1.82,1.82,0,0,1,1.6,1.15,1.11,1.11,0,0,1,.07.16h0a1.87,1.87,0,0,1-.34,2l-.37.4a.48.48,0,0,0,0,.68l2.21,2.21a.48.48,0,0,0,.68,0L5.32,19a1.81,1.81,0,0,1,1.95-.32l.05,0,.13.05A1.84,1.84,0,0,1,8.6,20.34l0,.55a.49.49,0,0,0,.48.48h3.12a.49.49,0,0,0,.49-.48l0-.56a1.84,1.84,0,0,1,1.15-1.61l.16-.06h0A1.87,1.87,0,0,1,16,19l.4.37a.5.5,0,0,0,.68,0l2.21-2.21a.48.48,0,0,0,0-.68L19,16.05a1.81,1.81,0,0,1-.32-2l0,0a.69.69,0,0,1,.05-.13,1.84,1.84,0,0,1,1.63-1.15l.55,0a.49.49,0,0,0,.48-.49V9.14A.49.49,0,0,0,20.89,8.66Zm-4.49,2A6,6,0,0,1,16,13a5.76,5.76,0,0,1-1.23,1.85,5.49,5.49,0,0,1-1.81,1.25A5.64,5.64,0,0,1,6.66,14.8,5.73,5.73,0,0,1,5.44,13a5.81,5.81,0,0,1,3-7.62,5.59,5.59,0,0,1,4.44,0,5.62,5.62,0,0,1,1.81,1.24A5.87,5.87,0,0,1,16,8.42,6,6,0,0,1,16.4,10.69Z" />
        </svg>
        <template v-if="isEdit">
            <!-- '完成' / '取消' -->
            <button
                class="gr_header__button  c_flat-button--primary"
                :disabled="isDisabled"
                @click="apply"
            >
                {{$t('home_039')}}
            </button>
            <button
                class="gr_header__button  c_flat-button--secondary"
                @click="setIsEdit"
            >
                {{$t('home_040')}}
            </button>
        </template>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
    name: 'Head',
    props: {
        setIsEdit: Function,
        apply: Function,
        isEdit: Boolean,
        popup: Function,
        isDisabled: Boolean
    },
    computed: {
        ...mapGetters([
            'myFavorites'
        ])
    }
}
</script>