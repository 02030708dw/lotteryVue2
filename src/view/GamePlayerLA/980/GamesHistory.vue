<template>
    <div
        class="gr_games-la-header__history  gr_games-la-header__number  gr_game-info__number is_active"
    >
        <div class="gr_number__header">
            <div
                class="gr_header__close"
                @mousedown.stop="$parent.handleHistoryToggle"
                @touchend.stop="$parent.handleHistoryToggle"
            >
                <svg class="gr_close__icon" viewBox="0 0 22.04 22.04">
                    <line x1="21.69" y1="0.35" x2="0.35" y2="21.69" />
                    <line x1="21.69" y1="21.69" x2="0.35" y2="0.35" />
                </svg>
            </div>
        </div>
        <div class="gr_number__content">
            <dl class="gr_number__content--item">
                <dt class="gr_number__item--title">{{$t('thai_012')}}</dt>
                <dt class="gr_number__item--title">{{$t('thai_004')}}</dt>
                <dt class="gr_number__item--title">{{$t('thai_005')}}</dt>
                <dt class="gr_number__item--title">{{$t('thai_013')}}</dt>
            </dl>
            <dl class="gr_number__content--item">
                <dd class="gr_number__item--content">
                    <span>{{lastNumber[0]}}</span>
                </dd>
                <dd class="gr_number__item--content">
                    <span>{{lastNumber[1]}}</span>
                    <span>{{lastNumber[2]}}</span>
                </dd>
                <dd class="gr_number__item--content">
                    <span>{{lastNumber[3]}}</span>
                    <span>{{lastNumber[4]}}</span>
                </dd>
                <dd class="gr_number__item--content">
                    <span>{{lastNumber[5]}}</span>
                </dd>
            </dl>
        </div>
        <div class="gr_number__prizeNun">
            <div class="gr_number__content--item gr_number__prizeNun--title">
                <!-- {{$t('中奖号码')}} -->
                {{$t('thai_014')}}
            </div>
            <div class="gr_number__content--title">
                <!-- {{$t('3D')}} -->
                {{$t('thai_009')}}
            </div>
            <div class="gr_number__content-prizeNun">
                <dl class="gr_number__content--item">
                    <!-- {{$t('头')}} -->
                    <dt>{{$t('thai_001')}}</dt>
                    <dd>
                        <span>{{lastNumber[0].slice(3)}}</span>
                        <span></span>
                        <span></span>
                    </dd>
                </dl>
                <dl class="gr_number__content--item">
                    <!-- {{$t('前三')}} -->
                    <dt>{{$t('thai_004')}}</dt>
                    <dd>
                        <span>{{lastNumber[1]}}</span>
                        <span>{{lastNumber[2]}}</span>
                        <span></span>
                    </dd>
                </dl>
                <dl class="gr_number__content--item">
                    <!-- {{$t('后三')}} -->
                    <dt>{{$t('thai_005')}}</dt>
                    <dd>
                        <span>{{lastNumber[3]}}</span>
                        <span>{{lastNumber[4]}}</span>
                        <span></span>
                    </dd>
                </dl>
                <dl class="gr_number__content--item">
                    <!-- {{$t('头奖组选')}} -->
                    <dt>{{$t('thai_003')}}</dt>
                    <dd>
                        <span v-for="code in groupSplit(lastNumber[0].slice(3))" >
                            {{code}}
                        </span>
                    </dd>
                </dl>
            </div>

            <div class="gr_number__content--title">
                <!-- {{$t('2D')}} -->
                {{$t('thai_010')}}
            </div>
            <div class="gr_number__content-prizeNun">
                <dl class="gr_number__content--item">
                    <!-- {{$t('头')}} -->
                    <dt>{{$t('thai_001')}}</dt>
                    <dd>
                        <span>{{lastNumber[0].slice(4)}}</span>
                        <span></span>
                        <span></span>
                    </dd>
                </dl>
                <dl class="gr_number__content--item">
                    <!-- {{$t('尾')}} -->
                    <dt>{{$t('thai_002')}}</dt>
                    <dd>
                        <span>{{lastNumber[5]}}</span>
                        <span></span>
                        <span></span>
                    </dd>
                </dl>
                <dl class="gr_number__content--item">
                    <!-- {{$t('头奖组选')}} -->
                    <dt>{{$t('thai_003')}}</dt>
                    <dd>
                        <span v-for="code in groupSplit(lastNumber[0].slice(3))">
                            {{code.slice(0, 2)}}
                        </span>
                    </dd>
                </dl>
            </div>

            <dl class="gr_number__content--title">
                <!-- {{$t('1D')}} -->
                {{$t('thai_011')}}
            </dl>
            <div class="gr_number__content-prizeNun">
                <dl class="gr_number__content--item">
                    <!-- {{$t('头')}} -->
                    <dt>{{$t('thai_001')}}</dt>
                    <dd>
                        <span v-for="code in lastNumber[0].slice(3, 6).split('').unique().join('')">{{code}}</span>
                    </dd>
                </dl>
                <dl class="gr_number__content--item">
                    <!-- {{$t('尾')}} -->
                    <dt>{{$t('thai_002')}}</dt>
                    <dd>
                        <span v-for="code in lastNumber[5].slice(0, 2).split('').unique().join('')">{{code}}</span>
                    </dd>
                </dl>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
    name: 'GamesHistory',
    methods: {
        groupSplit(arr) {
            arr = [+arr[0], +arr[1], +arr[2]]
            let l = arr.length
            let result = []
            let str
            for (let i = 0; i < l; i++) {
                if (arr[0] === arr[1] && arr[1] === arr[2]) {
                    // 3位相等
                    result = [`${+arr[0]}${+arr[1]}${+arr[2]}`, '', '']
                } else if (arr[0] === arr[1]) {
                    result = [`${+arr[0]}${+arr[1]}${+arr[2]}`, `${+arr[0]}${+arr[2]}${+arr[1]}`, `${+arr[2]}${+arr[0]}${+arr[1]}`]
                } else if (arr[1] === arr[2]) {
                    result = [`${+arr[0]}${+arr[1]}${+arr[2]}`, `${+arr[1]}${+arr[0]}${+arr[2]}`, `${+arr[1]}${+arr[2]}${+arr[0]}`]
                } else if (arr[0] === arr[2]) {
                    result = [`${+arr[0]}${+arr[1]}${+arr[2]}`, `${+arr[1]}${+arr[0]}${+arr[2]}`, `${+arr[0]}${+arr[2]}${+arr[1]}`]
                } else {
                    for (let j = 0; j < l; j++) {
                        for (let k = 0; k < l; k++) {
                            if (arr[i] !== arr[j] && arr[i] !== arr[k] && arr[j] !== arr[k]) {
                                str = '' + arr[i] + arr[j] + arr[k]
                                result.push(str)
                            }
                        }
                    }
                }
            }
            return result
        }
    },
    computed: {
        ...mapGetters([
            'LA_lastballs'
        ]),
        lastNumber() {
            return this.LA_lastballs.split(',')
        }
    }
}
</script>
