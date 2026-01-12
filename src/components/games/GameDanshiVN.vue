<template>
    <div class="gr_container  gr_game-danshi">
        <!-- '请选择一个城市' -->
        <div v-show="RWDMode === 3 && !VN_isLocal" class="gr_grid-vn__header">
            <div class="gr_header__text">{{$t('popup_131')}}</div>
        </div>
        <CityTableSingle v-if="VN_menuIndex && !VN_lotteryId" />
        <div class="gr_game-danshi__inner  u_clearfix">
            <div class="gr_game-vn-selectBar" v-if="VN_subMenuIndex < 3" v-show="RWDMode === 3">
                <ul>
                    <li
                        v-for="({title_key, name}, i) in methodTitle[VN_menuIndex]"
                        :key="title_key"
                        :class="{is_checkbox: !!showList.find(obj => obj.name === name)}"
                        @click="setShowList({title_key, name})"
                        v-if="VN_subMenuIndex !== 2 || VN_subMenuIndex === 2 && [1, 3].includes(i)"
                    >
                        <span>
                            {{$t(title_key)}}
                        </span>
                    </li>
                </ul>
            </div>
            <div class="gr_game-danshi__select-bar" v-if="VN_subMenuIndex < 3" v-show="RWDMode === 1">
                <el-checkbox
                    v-for="({title_key, name}, i) in methodTitle[VN_menuIndex]"
                    :key="title_key"
                    :checked="!!showList.find(obj => obj.name === name)"
                    :value="!!showList.find(obj => obj.name === name)"
                    @input="setShowList({title_key, name})"
                    v-if="VN_subMenuIndex !== 2 || VN_subMenuIndex === 2 && [1, 3].includes(i)"
                >
                    {{$t(title_key)}}
                </el-checkbox>
            </div>
            <div class="gr_game-danshi__button-area">
                <div class="gr_button-area__upload">
                    <input name="file" ref="file" id="file" value="" type="file" @change="uploadText">
                    <button class="c_button--default" @click="handleUploadFile">
                        <i class="c_button__icon  el-icon-upload2" />
                        <span class="c_button__text">
                            <!-- {{$t("上传附件")}} -->
                            {{$t('common_048')}}
                        </span>
                    </button>
                </div>
                <button class="c_button--default" @click="emptyTextArea">
                    <i class="c_button__icon  i_clear" />
                    <span class="c_button__text">
                        <!-- {{$t("清空")}} -->
                        {{$t('common_049')}}
                    </span>
                </button>
            </div>
            <div class="gr_game-danshi__panel bg_secondary_light" @dragover.stop.prevent @drop.stop.prevent="handleDrop">
                <textarea
                    v-if="showCodes.length < 50000"
                    ref="uploadTextarea"
                    :value="showCodes"
                    @input="danshiInput"
                    spellcheck="false" />
                <div v-show="!showCodes">
                    <p>
                        <!-- {{$t("说明")}}： -->
                        {{$t('common_050')}}：
                    </p>
                    <p>
                        <!-- {{$t("每一注号码之间，请用一个逗号[，]，分号[;]，冒号[:]，或者以 Enter 断行隔开。")}} -->
                        <!-- {{$t("每组号码请用&组成，每一注号码之间，请用一个逗号[，]、分号[;]、冒号[:]、空白或者以 Enter 断行隔开")}} -->
                        {{$t(VN_subMenuIndex < 3 ? 'common_051' : 'common_169')}}
                    </p>
                    <p>
                        <!-- {{$t("例如 :")}}： -->
                        {{$t('common_168')}} {{example[VN_subMenuIndex]}}
                    </p>
                    <p>
                        <!-- {{$t("投注内容将会自动为您过滤重复或错误的号码。")}} -->
                        {{$t('common_052')}}
                    </p>
                    <p>
                        <!-- {{$t("文件格式必须是 .txt 格式。")}} -->
                        {{$t('common_053')}}
                    </p>
                    <p>
                        <!-- {{$t("导入文本内容后将覆盖文本框中现有的内容。")}} -->
                        {{$t('common_055')}}
                    </p>
                    <p>
                        <!-- {{$t("文件较大时会导致上传时间较长，请耐心等待！")}} -->
                        {{$t('common_056')}}
                    </p>
                </div>
                <div v-if="showCodes.length >= 50000">
                    <p>
                        <!-- {{$t("文件已汇入成功，可直接投注。")}} -->
                        {{$t('common_113')}}
                    </p>
                    <p>
                        <!-- '因内容庞大无法显示，您可点击' : '查看完整内容' -->
                        {{$t('popup_039')}}：　<span class='text_color_accent_invert u_c--pointer' @click="openWindow">{{$t('popup_040')}}</span>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.gr_game-danshi {
    padding: 9px 10px 0px 10px;
}
@media screen and (max-width: 979px) {
    .gr_game-danshi {
        padding: 0px 10px;
        .gr_game-danshi__inner {
            padding: 0px;
            .gr_game-danshi__button-area {
                padding: 10px 0;
            }
        }
    }
}
</style>

<script>
    // import GameBalls from '@C/games/GameBalls'
    import { mapActions, mapGetters } from 'vuex'
    import { isIE, warnMessageBox } from '@UTIL'
    import { parseDigitstr } from '@UTIL/presenter'
    import CityTableSingle from './VN/components/CityTableSingle'
    import areaNumData1 from '@S/modules/GamePlayerVN/config/2d3d4d'
    import areaNumData2 from '@S/modules/GamePlayerVN/config/pl2pl3'

export default {
        name: 'Danshi',
        components: {
            CityTableSingle
        },
        beforeMount() {
            // 980 <-> 320 切換時候清空textarea(反選球時不處理)
            this.emptyTextArea({mode: 1})
            this.$root.$on('beforeCheck', this.beforeCheck)
            this.$root.$on('reset', this.emptyTextArea)
        },
        beforeDestroy() {
            this.$root.$off('beforeCheck', this.beforeCheck)
            this.$root.$off('reset', this.emptyTextArea)
        },
        data() {
            return {
                type: 'input',
                /** 中文 全角符号  中文 */
                checkFont: /[\u4E00-\u9FA5]|[/\n]|[/W]/g,
                /** 分隔符號 */
                filtration: /[,;<br>\n，；:：\s]+/,
                /** 验证是否纯数字 */
                checkNum: /^[0-9]*$/,
                areaNumData: {
                    ...areaNumData1,
                    ...areaNumData2
                },
                keyMap: {
                    tou: 0,
                    wei: 1,
                    touwei: 2,
                    baozu: 3,
                    baozu7: 4
                },
                example: [
                    '12,23,45',
                    '123,232,456',
                    '1234,2323,4567',
                    '12&23,45&67',
                    '12&23&34,45&67&89'
                ],
                // 是否到達最大注數警告
                bigCodeWarning: false
            }
        },
        subscriptions() {
            return {
                route$: this.$watchAsObservable('$route')
                    .do(this.emptyTextArea)
            }
        },
        methods: {
            ...mapActions([
                _M.GAME_ORDER_VN_SUBMIT
            ]),
            beforeCheck(fn) {
                fn(this.emptyTextArea)
            },
            danshiInput(e) {
                // 如果沒超過 或是 減少注數 -> 可以輸入
                if (!this.bigCodeWarning || this.showCodes > e.target.value) {
                    this[_M.GAME_ORDER_VN_SUBMIT]({type: 7, showDanshiCodes: e.target.value})
                    this.setDanshiData()
                } else {
                    this[_M.GAME_ORDER_VN_SUBMIT]({type: 7, showDanshiCodes: this.showCodes})
                }
            },
            setDanshiData() {
                if (!this.showCodes) {
                    this[_M.GAME_ORDER_VN_SUBMIT]({ type: 7, nums: 0, codes: '', showCodes: '' })
                    return
                }
                const original = this.mathResult()
                const { codes, showCodes } = this.makeCodes(original)
                const scode_key = showCodes
                const nums = original.length
                this[_M.GAME_ORDER_VN_SUBMIT]({ type: 7, nums, codes, showCodes, scode_key })

                // 顯示超過最大限組數彈窗
                if (nums > this.VN_maxbet) {
                    this.bigCodeWarning = true
                    this.$msg(warnMessageBox({
                        // '请勿超过5000组号码'
                        message: 'popup_140'
                    }))
                } else {
                    this.bigCodeWarning = false
                }
            },
            getShowList({title_key, name}) {
                const title = this.VN_currentMethod.toLowerCase()
                const nums = this.areaNumData[title][this.keyMap[name]][this.VN_pos]
                return {
                    type: 'input',
                    title_key,
                    name,
                    title,
                    nums
                }
            },
            setShowList({title_key, name}) {
                const length = this.showList.length
                let showList = this.showList.filter(n => n.name !== name)
                showList.length === length && showList.push(this.getShowList({title_key, name}))
                this[_M.GAME_ORDER_VN_SUBMIT]({
                    type: 7,
                    showList
                })
            },
            emptyTextArea(options = {}) {
                let obj = {
                    type: 7,
                    showList: [],
                    ltMoneyAmout: 0,
                    cityId: '',
                    key: '',
                    nums: 0,
                    codes: '',
                    showCodes: '',
                    scode_key: '',
                    showDanshiCodes: '',
                    issue: '',
                    ...options
                }
                // pl2 pl3 只有包組
                if (this.VN_subMenuIndex > 2) {
                    obj.showList = [this.getShowList({
                        title_key: 'vn_t_021',
                        name: 'baozu'
                    })]
                }
                // 自主彩直接加入城市
                if (this.VN_isLocal) {
                    obj.cityId = this.VN_isLocal
                }
                this[_M.GAME_ORDER_VN_SUBMIT](obj)

                // 重置最大投注項設定
                this.bigCodeWarning = false
            },
            uploadText(e) {
                if (isIE() === false || isIE() >= 10) {
                    const key = e.dataTransfer ? 'dataTransfer' : 'target'
                    const file = e[key].files ? e[key].files[0] : false
                    if (file && file.type.match(/text.*/)) {
                        const reader = new FileReader()
                        reader.onload = (e) => {
                            this.$refs.file.value = ''
                            this[_M.GAME_ORDER_VN_SUBMIT]({ type: 7, showDanshiCodes: reader.result })
                            this.setDanshiData()
                        }
                        reader.readAsText(file)
                    } else {
                        // fileDisplayArea.innerText = "File not supported!";
                    }
                } else {
                    const file = e.target.value
                    var FSO = new ActiveXObject('Scripting.TextStream')
                    const result = FSO.OpenTextfile(file)
                    this.$refs.file.value = ''
                    this.showCodes = result
                    this.setDanshiData()
                }
            },
            // setDigitstr(checked, key) {
            //     // this[_M.SET_GAME_ORDER_DIGITSTR]({checked, key})
            //     this.setDanshiData()
            // },
            handleUploadFile() {
                this.$refs.file.click()
            },
            handleDrop(e) {
                this.uploadText(e)
            },
            openWindow() {
                const digitstr = this.digitstr ? parseDigitstr(this.digitstr, this.game.gameType) : ''

                try {
                    var newWindow = window.open('', '_blank')
                    newWindow.document.title = this.$t('common_100')
                    newWindow.document.body.appendChild(newWindow.document.createElement('div'))
                    newWindow.document.querySelector('div').innerHTML = digitstr + '<br/>' + this.showCodes
                    newWindow.document.querySelector('div').style.wordWrap = 'break-word'
                    // var div = document.createElement('div')
                    // div.innerHTML = this.showCodes
                    // newWindow.document.body.appendChild(div)
                } catch (err) {
                    console.log('err', err)
                }
            }
        },
        computed: {
            ...mapGetters([
                'VN_menuIndex',
                'VN_lotteryId',
                'VN_subMenuIndex',
                'VN_gameOrder',
                'VN_currentMethod',
                'VN_pos',
                'VN_isLocal',
                'RWDMode',
                'VN_maxbet'
            ]),
            showCodes() {
                return this.VN_gameOrder.showDanshiCodes || ''
            },
            codes() {
                return this.VN_gameOrder.codes || ''
            },
            showList() {
                return this.VN_gameOrder.showList || []
            }
        }
    }
</script>
