<template>
    <div>
        <ul class="bg_primary">
            <li v-for="(list, index) in playList" @click="changeList(index)" :class="isActive(index)" >
                {{$t(list.tagname)}}
            </li>
        </ul>
    </div>
</template>
<style lang="scss" scoped>
@import '~@CSS/main.scss';
    ul {
        border: 1px solid border_color(default);
        color: text_color(weak);
        font-size: $font_size_large;
        margin-bottom: 5px;
        & li {
            cursor: pointer;
            display: inline-block;
            height: 38px;
            line-height: 38px;
            margin: 0 10px;
            padding: 0 20px;
            position: relative;
            &::after {
                @include pseudo;
                @include size(0, 3px);
                @extend %transition_ease;
                background: text_color(primary);
                bottom: 5px;
                right: 0;
            }
            &:hover {
                color: text_color(secondary);
            }
            &.active {
                &,
                &:hover {
                    color: text_color(primary);
                }
                &::after {
                    right: auto;
                    left: 0;
                    width: 100%;
                }
            }
        }
    }
</style>
<script>
import { mapGetters, mapActions } from 'vuex'

export default {
    name: 'playInfoTab',
    computed: {
        ...mapGetters([
            'playList',
            'playListIndex'
        ])
    },
    methods: {
        ...mapActions([
            _M.SET_PLAYINFO_INDEX
        ]),
        changeList(index) {
            this[_M.SET_PLAYINFO_INDEX](index)
        },
        isActive(index) {
            return this.playListIndex === index ? 'active' : ''
        }
    }
}
</script>