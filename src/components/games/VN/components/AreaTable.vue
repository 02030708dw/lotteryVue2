<template>
    <div class="gr_grid-vn" v-if="VN_Issue[VN_pos]">
        <div class="gr_grid-vn__header">
            <!-- '地区' -->
            <span class="gr_header__text">{{$t('vn_t_008')}}</span>
        </div>
        <div class="gr_grid-vn__controller">
            <div class="gr_controller__item" @click="controll(true)">
                <!-- '全' -->
                <div class="gr_item__text">{{$t('common_019')}}</div>
            </div>
            <div class="gr_controller__item" @click="controll(false)">
                <!-- '清' -->
                <div class="gr_item__text">{{$t('common_031')}}</div>
            </div>
        </div>
        <div class="gr_grid-vn__content">
            <div class="gr_area-table">
                <div class="gr_area-table__wrap">
                    <div class="gr_area-table__list"
                        v-for="(cities, issue, i) in area"
                        :key="issue"
                    >
                        <div
                            class="gr_area-list__item"
                            :class="{is_active: status[issue] === (cities && cities.length) && cities}"
                            @click="setChkAll(issue, !(status[issue] === (cities && cities.length)))"
                            :id="issue"
                        >
                            <span class="gr_area_item__text">{{transDate(issue)}}</span>
                        </div>
                        <div
                            class="gr_area-list__item"
                            :class="{is_active: id && chk[id + issue]}"
                            v-for="id in pad(cities)"
                            @click="id && setChk(id, issue, !chk[id + issue])"
                        >
                            <span
                                class="gr_area_item__text"
                                v-if="id"
                                :id="id + issue"
                            >
                                {{$t(VN_cityData[id])}}
                            </span>
                        </div>
                    </div>
                    <div class="gr_area-table__list"
                        v-for="i in fillArea"
                        :key="i"
                    >
                        <div class="gr_area-list__item">
                            <label>
                                <span class="gr_area_item__text">-</span>
                            </label>
                        </div>
                        <div class="gr_area-list__item" v-for="j in maxLength" :key="j">
                            <label><span class="gr_area_item__text" /></label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import CityTable from './CityTable'
    export default {
        name: 'AreaTable',
        mixins: [CityTable],
        methods: {
            controll(bool) {
                Object.keys(this.area).forEach(issus => this.setChkAll(issus, bool))
            }
        }
    }
</script>
