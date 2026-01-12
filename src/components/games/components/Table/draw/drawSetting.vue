<script>
import drag from '@C/pixi/drag'
import Container from '@C/pixi/components/Container'
import ButtonMixin from '@C/pixi/components/ButtonMixin'
import Graphics from '@C/pixi/components/Graphics'
import Sprite from '@C/pixi/components/Sprite'
import Button from '@C/pixi/components/Button'
import Text from '@C/pixi/components/Text'
import { Storage } from '@API'
import {setStorage, getStorage} from '@UTIL'
import { mapGetters, mapActions } from 'vuex'

export default {
    name: 'drawSetting',
    beforeMount() {
        this.resourceArr.push(
            { id: 'setting', file: 'sp_v2.json', urlPath: `${CDN}/static/pixi/share/setting/` }
        )
    },
    data() {
        return {
            settingContainer: {},
            userSelectLang: 'cn'
        }
    },
    computed: {
        ...mapGetters([
            'lang',
            'getLangObj'
        ]),
        // 取得有開放的語言
        getOpenLangArr() {
            return this.getLangObj
                ? Object.entries(this.getLangObj).reduce((openLangArr, data) => {
                    const [id, langObj] = [data[0], data[1]]
                    if (langObj.open) openLangArr.push({id, ...langObj})
                    return openLangArr
                }, [])
                : []
        }
    },
    methods: {
        ...mapActions([
            _M.SET_LANG
        ]),
        // 繪製設定彈窗
        drawSetting() {
            // 選取當前語系
            this.userSelectLang = this.lang

            this.mask.show()
            // 設定彈窗整個區塊
            this.settingContainer = new Container(this.front, {name: 'setting'})
            const container = this.settingContainer
            const bg = new Sprite({ id: 'setting', key: 'settingBg', x: 264, y: 45, p: container })
            const closeBtn = new Button({ id: 'setting', key: 'close', y: 25, anchor: {x: 0.5, y: 0.5}, p: bg }, {
                down: { scale: { x: 0.9, y: 0.9 } },
                up: {
                    scale: { x: 1, y: 1 },
                    fn: () => {
                        this.setSoundOptionAndPlay('ui001_click', {volume: 0.5})
                        // reset音效設定
                        // this.userConfig = { ...this.userConfig, ...getStorage(Storage.tableSoundConfig) }

                        this.closeWindow()
                    }
                },
                out: {
                    scale: { x: 1, y: 1 }
                }
            })

            closeBtn.x = bg.width - (closeBtn.width / 2)

            // 彈窗標題
            const style = {
                fontFamily: 'Microsoft Yahei',
                fontSize: 32,
                fontWeight: 'bold',
                fill: '#ffffff'
            }
            // '设置'
            const title = new Text({ name: 'mainTitle', text: this.$t('Glory_0021'), style, x: 0, y: 33, p: bg, anchor: {x: 0, y: 0} })
            title.x = (container.width - title.width) / 2

            // 繪製子項目
            this.drawAudio(bg)
            this.drawLang(bg)
            this.drawFooter(bg)
        },
        // 繪製音效設定區塊
        drawAudio(p) {
            const {sound, BGM} = this.userConfig
            // 區塊標題樣式
            const titleStyle = {
                fontFamily: 'Microsoft Yahei',
                fontSize: 32,
                fill: '#ffffff'
            }
            // 子項目標題(ex: 音樂)
            const style = {
                fontFamily: 'Microsoft Yahei',
                fontSize: this.lang === 'vn' ? 23 : 25,
                fontWeight: 'bold',
                fill: '#ffffff'
            }
            // switch-on 文字樣式
            const onStyle = {
                fontFamily: 'Microsoft Yahei',
                fontSize: 30,
                fontWeight: 'bold',
                fill: '#F1BB03'
            }
            // switch-off 文字樣式
            const offStyle = {
                fontFamily: 'Microsoft Yahei',
                fontSize: 30,
                fontWeight: 'bold',
                fill: '#ffffff'
            }
            const [onTitle, offTitle] = ['ON', 'OFF']
            const [beginX, endX] = [28, 115]

            // 區塊標題 '声音'
            const title = new Text({ text: this.$t('table_006'), style: titleStyle, anchor: {x: 0, y: 0}, x: 85, y: 90, p })

            // 子項目1-音樂
            const audio1 = new Container(p, {name: 'audio1', x: 92, y: 158})
            // '音乐'
            const audioTitle1 = new Text({ name: 'audioTitle1', text: this.$t('table_007'), style, x: 0, y: 9, anchor: {x: 0, y: 0}, p: audio1 })
            const swich1 = new ButtonMixin(audio1, {name: 'swich1', x: this.lang === 'vn' ? audioTitle1.width + 15 : audioTitle1.width + 30, y: 23}, {
                down: {
                    fn: () => {
                        switchBtn1.scale = { x: 0.9, y: 0.9 }
                    }
                },
                up: {
                    fn: () => {
                        switchBtn1.scale = { x: 1, y: 1 }
                        this.setSoundOptionAndPlay('ui001_click', {volume: 0.5})

                        // BGM
                        let isPlay = !this.userConfig.BGM
                        this.setSound('BGM', isPlay)
                        TweenMax.to(switchBtn1.position, 0.2, {
                            x: isPlay ? endX : beginX,
                            onComplete: () => {
                                switchBtn1.setTextureKey(isPlay ? 'onBtn' : 'offBtn')
                            }
                        })
                        switchTitle1.text = isPlay ? onTitle : offTitle
                        switchTitle1.style = isPlay ? onStyle : offStyle
                        switchTitle1.x = isPlay ? 21 : 63
                    }
                },
                out: {
                    fn: () => {
                        switchBtn1.scale = { x: 1, y: 1 }
                    }
                }
            })

            const switchBG1 = new Graphics(swich1, { name: 'switchBG1', x: 0, y: -22 })
            const switchBG1_1 = new Graphics(swich1, { name: 'switchBG1', x: 2, y: -19 })
            const switchMask1 = new Graphics(swich1, { name: 'switchMask1', x: 0, y: -22 })
            switchBG1.beginFill(0x000000, 0.75)
                .drawRoundedRect(0, 0, 140, 43, 23)
            switchBG1_1.beginFill(0x474747)
                .drawRoundedRect(0, 0, 140, 43, 23)
            switchMask1.beginFill() // 遮罩
                .drawRoundedRect(0, 0, 140, 43, 23)
            switchBG1.mask = switchMask1
            const switchTitle1 = new Text({ name: 'switchTitle1', text: BGM ? onTitle : offTitle, style: BGM ? onStyle : offStyle, x: BGM ? 21 : 63, y: -17, anchor: {x: 0, y: 0}, p: swich1 })
            const switchBtn1 = new Button({ name: 'switchBtn1', id: 'setting', key: BGM ? 'onBtn' : 'offBtn', x: BGM ? endX : beginX, y: 0, anchor: {x: 0.5, y: 0.5}, p: swich1 })

            // 子項目2-音效
            const audio2 = new Container(p, {name: 'audio2', x: this.lang === 'vn' ? audio1.width + 120 : audio1.width + 150, y: 158})
            // '音效'
            const audioTitle2 = new Text({ name: 'audioTitle2', text: this.$t('table_008'), style, x: 0, y: 9, anchor: {x: 0, y: 0}, p: audio2 })

            const switch2 = new ButtonMixin(audio2, {name: 'audio2', x: this.lang === 'vn' ? audioTitle2.width + 15 : audioTitle2.width + 30, y: 23}, {
                down: {
                    fn: () => {
                        switchBtn2.scale = { x: 0.9, y: 0.9 }
                    }
                },
                up: {
                    fn: () => {
                        switchBtn2.scale = { x: 1, y: 1 }

                        let isPlay = !this.userConfig.sound
                        this.setSound('sound', isPlay)
                        TweenMax.to(switchBtn2.position, 0.2, {
                            x: isPlay ? endX : beginX,
                            onComplete: () => {
                                switchBtn2.setTextureKey(isPlay ? 'onBtn' : 'offBtn')
                            }
                        })
                        switchTitle2.text = isPlay ? onTitle : offTitle
                        switchTitle2.style = isPlay ? onStyle : offStyle
                        switchTitle2.x = isPlay ? 21 : 63

                        // 設定完成後才撥放音效
                        this.setSoundOptionAndPlay('ui001_click', {volume: 0.5})
                    }
                },
                out: {
                    fn: () => {
                        switchBtn2.scale = { x: 1, y: 1 }
                    }
                }
            })
            const switchBG2 = new Graphics(switch2, { name: 'switchBG2', x: 0, y: -22 })
            const switchBG2_1 = new Graphics(switch2, { name: 'switchBG2', x: 2, y: -19 })
            const switchMask2 = new Graphics(switch2, { name: 'switchMask2', x: 0, y: -22 })
            switchBG2.beginFill(0x000000, 0.75)
                .drawRoundedRect(0, 0, 140, 43, 23)
            switchBG2_1.beginFill(0x474747)
                .drawRoundedRect(0, 0, 140, 43, 23)
            switchMask2.beginFill() // 遮罩
                .drawRoundedRect(0, 0, 140, 43, 23)
            switchBG2.mask = switchMask2

            const switchTitle2 = new Text({ name: 'switchTitle2', text: sound ? onTitle : offTitle, style: sound ? onStyle : offStyle, x: sound ? 21 : 63, y: -17, anchor: {x: 0, y: 0}, p: switch2 })
            const switchBtn2 = new Button({ name: 'switchBtn2', id: 'setting', key: sound ? 'onBtn' : 'offBtn', x: sound ? endX : beginX, y: 0, anchor: {x: 0.5, y: 0.5}, p: switch2 })
        },
        // 繪製多語設定區塊
        drawLang(p) {
            // 區塊標題樣式
            const titleStyle = {
                fontFamily: 'Microsoft Yahei',
                fontSize: 32,
                fill: '#ffffff'
            }
            // radio-on 標題樣式
            const radioOnStyle = {
                fontFamily: 'Microsoft Yahei',
                fontSize: 28,
                fontWeight: 300,
                fill: '#F1BB03'
            }
            // radio-off 標題樣式
            const radioOffStyle = {
                fontFamily: 'Microsoft Yahei',
                fontSize: 28,
                fontWeight: 300,
                fill: '#ffffff'
            }

            // 區塊標題 '语言'
            const title = new Text({ text: this.$t('table_009'), style: titleStyle, anchor: {x: 0, y: 0}, x: 85, y: 271, p })

            // 語言設定區塊
            const allLang = new Container(p, {name: 'langRadioGroup', x: 85, y: 330})

            const lineSpace = 60 // 每行間距
            let allRadioArr = []
            // 語言選項
            this.getOpenLangArr.forEach((langData, langIndex) => {
                const {id, l, s} = langData

                const oneOption = new ButtonMixin(allLang, {name: 'oneOption', x: 0 + 215 * (langIndex % 3), y: ~~(langIndex / 3) * lineSpace}, {
                    down: {
                        fn: () => {
                            radioIcon.scale = { x: 0.9, y: 0.9 }
                        }
                    },
                    up: {
                        fn: () => {
                            // 改變 radio 樣式, 並且暫存使用者選取的語言
                            this.userSelectLang !== id && allRadioArr.forEach(({icon, text}, radioIdnex) => {
                                icon.setTextureKey(langIndex === radioIdnex ? 'radioTrue' : 'radioFalse')
                                // text.style = langIndex === radioIdnex ? radioOnStyle : radioOffStyle
                            })
                            this.userSelectLang = id

                            radioIcon.scale = { x: 1, y: 1 }
                        }
                    },
                    out: {
                        fn: () => {
                            radioIcon.scale = { x: 1, y: 1 }
                        }
                    }
                })
                // 預設勾選語系
                const defaultKey = this.lang === id ? 'radioTrue' : 'radioFalse'
                const radioStyle = this.lang === id ? radioOnStyle : radioOffStyle
                const radioIcon = new Sprite({ id: 'setting', key: defaultKey, anchor: {x: 0.5, y: 0.5}, x: 5, y: 18, p: oneOption })
                const radioText = new Text({ text: l, style: radioStyle, anchor: {x: 0, y: 0}, x: 30, y: 0, p: oneOption })
                allRadioArr.push({
                    icon: radioIcon,
                    text: radioText
                })
            })
        },
        // 繪製底部取消/確認按鈕
        drawFooter(p) {
            const style = {
                fontFamily: 'Microsoft Yahei',
                fontSize: 30,
                fill: '#fff',
                fontWeight: 'bold',
                dropShadow: true,
                dropShadowColor: '#000000',
                dropShadowBlur: 2,
                dropShadowAngle: Math.PI / 6,
                dropShadowDistance: 3
            }

            // 套用設定
            const confirm = new Button({ id: 'pop', key: 'btn_active', x: 373, y: 513, anchor: {x: 0.5, y: 0.5}, p }, {
                down: {
                    scale: {x: 0.9, y: 0.9}

                },
                up: {
                    scale: {x: 1, y: 1},
                    fn: () => {
                        this.setSoundOptionAndPlay('ui001_click', {volume: 0.5})
                        this.closeWindow()

                        // 設定多語&重整
                        if (this.userSelectLang !== this.lang) {
                            this.setLang()
                        }
                    }
                },
                out: { scale: {x: 1, y: 1} }
            })
            // '套用'
            const submit_text = new Text({ text: this.$t('table_010'), style, anchor: {x: 0.5, y: 0}, x: confirm.width / 2 - 108, y: -19.5, p: confirm })
            const icon = new Sprite({ id: 'setting', key: 'checkIcon', anchor: {x: 1, y: 0}, x: (confirm.width - submit_text.width) / 2 - 118, y: -16.5, p: confirm })
            // confirm.x = (p.width - confirm.width) / 2
        },
        // 關閉彈窗
        closeWindow() {
            // 存入音效設定
            setStorage(Storage.tableSoundConfig, this.userConfig)

            this.mask.hide()
            this.settingContainer.destroy({children: true})
        },
        /**
         * 設定 指定的音效選項
         * @param {string} configName BGM/sound ... volumn
         * @param {boolean|any} option 設定值
         */
        setSound(configName, option) {
            // 紀錄設定值
            this.userConfig[configName] = option

            // 暫停或撥放BGM
            if (configName === 'BGM') {
                if (option) {
                    this.playSound(this.currentBGM)
                } else {
                    this.pause(this.currentBGM)
                }
            }
        },
        /**
         * 設定 多語, 並重整頁面
         * @param {boolean} refresh 是否要重整頁面(預設true)
         */
        async setLang(refresh = true) {
            await this[_M.SET_LANG]({
                lang: this.userSelectLang,
                $route: this.$route
            })

            // 重整頁面
            refresh && location.replace(location)
        }
    }
}
</script>