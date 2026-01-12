<template>
    <div class="gr_game-vn-submenu2">
        <div class="gr_game-vn-selectBar" v-show="RWDMode === 3">
            <ul>
                <template v-if="methodType[VN_gameType].includes(VN_subMenuIndex)" >
                    <li
                        v-for="({title_key, name}, i) in $parent.methodTitle[VN_menuIndex]"
                        :key="title_key"
                        :class="{is_checkbox: !!showList.find(obj => obj.name === name)}"
                        @click="setShowList({title_key, name})"
                        v-if="VN_subMenuIndex !== 2 || VN_subMenuIndex === 2 && [1, 3].includes(i)"
                    >
                        <span>
                            {{$t(title_key)}}
                        </span>
                    </li>
                </template>
            </ul>
        </div>
        <template v-if="!VN_subMenuIndex && VN_gameType === 'Quick'">
            <div class="gr_fast-game-vn-order"><!--  v-if="poultry" -->
                <div
                    class="gr_fast-game-vn-order__header"
                    :class="toggleMenuClass"
                    @click="toggleMenu"
                >
                    <!-- {{$t("快速选号")}} -->
                    {{$t('mark6_t_022')}}
                    <div class="gr_header__arrow" />
                </div>
                <div class="gr_fast-game-vn-order__content">
                    <div class="gr_quick320 u_clearfix" >
                        <!-- 快选 -->
                        <div class="gr_quick320__text">{{$t('common_167')}}:</div>
                        <div
                            class="gr_field__button"
                            :class="{is_active: $parent.fastSelect[key]}"
                            v-for="({key, title_key}) in fastMap"
                            @click="handleFast(key)"
                            :key="key"
                        >
                            <span class="gr_button__text">{{$t(title_key)}}</span>
                        </div>
                    </div>
                    <div class="gr_quick320 u_clearfix" >
                        <!-- 包胆 -->
                        <div class="gr_quick320__text">{{$t('thai_007')}}:</div>
                        <div
                            class="gr_field__button"
                            :class="{is_active: $parent.fastSelect[index]}"
                            v-for="(item, index) in 10"
                            @click="selectBold(index)"
                            :key="index"
                        >
                            <span class="gr_button__text">{{index}}</span>
                        </div>
                    </div>
                        <span class="gr_bagGroup__button" @click="$parent.isMuti = !$parent.isMuti" :class="{is_active: $parent.isMuti}">
                            <!-- 包组 -->
                            <span class="gr_button__text">{{$t('thai_008')}}</span>
                        </span>
                </div>
            </div>
        </template>
         <template v-else-if="VN_subMenuIndex === 1 && VN_gameType === 'Quick'" >
                <div class="gr_section__bar">
                    <div class="c_input--big" @click="$parent.isMuti = !$parent.isMuti">
                        <span class="gr_bagGroup__button" :class="{is_active: $parent.isMuti}">
                            <!-- 包组 -->
                            <span class="gr_button__text">{{$t('thai_008')}}</span>
                        </span>
                    </div>
                </div>
                <div class="gr_quick" >
                    <!-- 快选 -->
                    <div class="gr_quick__btn">
                        <span class="gr_quick__text">{{$t('common_167')}}:</span>
                        <div
                            class="gr_field__button"
                            :class="{is_active: $parent.fastSelect['Repeat']}"
                            @click="handleFast('Repeat')"
                        >
                            <span class="gr_button__text">{{$t('vn_t_092')}}</span>
                        </div>
                    </div>
                </div>
        </template>
    </div>
</template>
<script>
    import { mapGetters, mapActions } from 'vuex'
    import GameSubmenu from './GameSubmenu'
    export default {
        name: 'GameSubmenu320',
        extends: GameSubmenu,
        data() {
            return {
                isShowMenu: true
            }
        },
        computed: {
            ...mapGetters([
            ]),
            toggleMenuClass() {
                return this.isShowMenu ? 'is_active' : ''
            }
        },
        methods: {
            ...mapActions([
            ]),
            toggleMenu() {
                this.isShowMenu = !this.isShowMenu
            }
        }
    }
</script>