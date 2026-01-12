<template>
    <div class="el-message-box__wrapper" :style="{ zIndex }">
        <div class="el-message-box el-game-message-box el-message-box-medium">
            <div class="el-message-box__header" v-if="title !== undefined">
                <div class="el-message-box__title">{{ $t(title) }}</div>
                <i class="el-message-box__close el-icon-close" aria-label="Close" @click="close"/>
                <div
                    @click="close"
                    style="position: absolute; top: 0; right: 0; height: 100%; width: 50px; background: transparent; cursor: pointer;"
                />
            </div>
            <div class="el-message-box__content">
                <div class="el-message-box__game-title">
                    {{$t(lotteryNameKey)}}
                </div>
                <div class="el-message-box__game-content stock">
                    <div class="el-game-content__table el-game-content__table--six">
                        <!-- 標題 -->
                        <div class="el-table__row  el-table__title">
                            <div class="el-table__col">
                                <!-- 期号 -->
                                <div class="el-table__component">{{$t('common_004')}}</div>
                            </div>
                            <div class="el-table__col">
                                <!-- 项目 -->
                                <div class="el-table__component">{{$t('popup_006')}}</div>
                            </div>
                            <div class="el-table__col">
                                <!-- 投注内容 -->
                                <div class="el-table__component">{{$t('popup_007')}}</div>
                            </div>
                            <div class="el-table__col">
                                <!-- 奖金 -->
                                <div class="el-table__component">{{$t('common_038')}}</div>
                            </div>
                            <div class="el-table__col">
                                <!-- 投注金额 -->
                                <div class="el-table__component">{{$t('popup_009')}}</div>
                            </div>
                            <div class="el-table__col">
                                <div class="el-table__component">
                                    <div class="el-icon-circle-close"></div>
                                </div>
                            </div>
                        </div>
                        <!-- 內容 -->
                        <div class="el-game-table__row">
                            <div v-for='(oneOrder, idx) in getProjectList'>
                                <div class="el-table__col">
                                    <!-- 期号 -->
                                    <div class="el-table__component">{{oneOrder.issue}}</div>
                                </div>
                                <div class="el-table__col">
                                    <!-- 项目 -->
                                    <div class="el-table__component">{{$t(keyObj[oneOrder.parentName])}}-{{$t(oneOrder.childNameKey)}}</div>
                                </div>
                                <div class="el-table__col">
                                    <!-- 投注内容 -->
                                    <div class="el-table__component">{{oneOrder.showCodes}}</div>
                                </div>
                                <div class="el-table__col">
                                    <!-- 奖金 -->
                                    <div class="el-table__component">{{oneOrder.hprize}}</div>
                                </div>
                                <div class="el-table__col">
                                    <div class="el-table__component">
                                        <!-- 投注金額 -->
                                        <div class="c_input--medium">
                                            <input
                                                class="c_input__inner  u_t--center"
                                                type="text"
                                                v-model="moneyTempArr[idx]"
                                                @blur="handleBlur($event, idx)"
                                                v-clean-input:int.long="{val: moneyTempArr[idx], setVal: setMoneyTemp(idx), cb: afterCleanInput(idx)}"
                                            >
                                        </div>
                                    </div>
                                </div>
                                <div
                                    class="el-table__col"
                                    @click="handleDelete(idx)"
                                >
                                    <div class="el-table__component">
                                        <div class="el-icon-circle-close  u_c--pointer  u_o--05"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="c_message-box__panel  u_clearfix">
                <div class="el-message-box__game-total">
                    <p class='warning' v-if="warningIssue">{{$t('stock_002',{'0': warningIssue})}}</p>
                    <div>
                        <!-- 共{0}注 -->
                        <i18n path="popup_010">
                            <strong place="0">{{numCalc}}</strong>
                        </i18n>
                        <!-- 总计{0}元 -->
                        <i18n path="common_074" tag="span">
                            <strong place="0">{{getLtMoneyAmout}}</strong>
                            <template place="1">{{currencySymbol}}</template>
                        </i18n>
                    </div>
                    <div class="el-message-box__game-balance">
                        <!-- 可用余额{0}元 -->
                        <i18n path="popup_011">
                            <strong place="0">{{balance}}</strong>
                        </i18n>
                    </div>
                </div>
                <div class="el-message-box__btns">
                    <span v-if="!isConfirmButton">
                        <!-- 余额不足 -->
                        {{$t('popup_067')}}
                    </span>
                    <el-button
                        v-show="isShowLocalCancelBtn"
                        :loading="isCancelLoading"
                        @click.native="cancel">
                        {{ $t(cancelText) }}
                    </el-button>
                    <el-button
                        ref="confirm"
                        v-show="isShowConfirmBtn"
                        v-if="isConfirmButton"
                        class="el-button--primary"
                        :loading="isConfirmLoading"
                        @click.native="checkForm">
                        {{ $t(confirmBtnText) }}
                    </el-button>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
@import '~@CSS/main.scss';
/deep/ .betting_detail span {
    margin: 0 2px;
    &.sy {
        margin: 0 5px;
    }
}
.warning {
    color: red;
    margin-bottom: 10px;
}

</style>
<script>
    import { formatNumber, warnMessageBox } from '@UTIL'
    import MessageBox from '@C/MessageBox/main'
    import { mapGetters, mapActions } from 'vuex'
    export default {
        name: 'gameSubmitBox',
        mixins: [MessageBox],
        data() {
            return {
                isShowLocalCancelBtn: true,
                isShowLocalCloseIcon: true,
                moneyTempArr: [],
                // 重新加總金額flag
                reCount: false,
                // 過期之獎期
                warningIssue: null,
                keyObj: {
                    '1D': 'thai_011',
                    '2D': 'thai_010',
                    '3D': 'thai_009'
                }
            }
        },
        beforeMount() {
            // 初始化 moneyTempArr
            this.getProjectList.forEach((oneProject) => {
                this.moneyTempArr.push(oneProject.money)
            })
            this.checkForm()
        },
        updated() {
            !this.ltProjectNum && this.cancel()
        },
        computed: {
            ...mapGetters([
                'game',
                'gameOrder',
                'gameSubmit',
                'gameLtProject',
                'currencySymbol',
                'availableBalance',
                'lotteryName',
                'lotteryNameKey',
                'onePrice',
                'bonusLimit',
                'currentjsDynamicData'
            ]),
            fast() {
                return this.data ? this.data.fast : null
            },
            isConfirmButton() {
                return parseFloat(this.availableBalance) >= this.ltMoneyAmout
            },
            balance() {
                return formatNumber(this.availableBalance) || '0'
            },
            // 取得投注金額總計
            ltMoneyAmout() {
                const getSum = this.getProjectList.reduce((sum, oneProject) => {
                    sum += +oneProject.money
                    return sum
                }, 0)

                // 故意觸發加總用
                if (this.reCount) this.reCount = false
                return getSum
            },
            // 顯示用投注金額
            getLtMoneyAmout() {
                return formatNumber(this.ltMoneyAmout)
            },
            // 暫時注單箱裡注單數
            ltProjectNum() {
                return this.getProjectList.length
            },
            // 格式化後注數
            numCalc() {
                return formatNumber(this.ltProjectNum)
            },
            // 取得注單箱
            getProjectList() {
                return this.fast ? this.gameOrder.ltProjectTemp : this.gameLtProject
            }
        },
        methods: {
            ...mapActions([
                _M.SET_PROJECT_TEMP,
                _M.SET_GAME_ORDER_DATA,
                _M.SET_GAME_LT_PROJECT,
                _M.REMOVE_SUBMIT_ORDER_INDEX
            ]),
            //
            /**
             * 檢查彈窗內的資料(暫存箱or投注項)是否過期與超過上限
             * 開啟彈窗時只檢查是否過期, 送出資料前檢查過期與上限
             * @param {boolean} isBeforeSubmit 是否為送出前檢查
             */
            async checkForm(isBeforeSubmit = false) {
                const {number, issue = []} = this.currentjsDynamicData
                let ISSUE_ARR = []
                // 加入投注項之後, 一直放到停售(沒有獎期)
                if (!number) {
                    // 不在销售期间内
                    this.$msg(warnMessageBox({
                        message: this.$t('Bet_002_0002')
                    }))
                    return
                }

                ISSUE_ARR = issue.length > 0 ? issue.reduce((ans, {number}) => {
                    ans.push(number)
                    return ans
                }, []) : [number]

                const exceeds = this.getProjectList.find((oneProject, projectIdx) => {
                    if (isBeforeSubmit) {
                        const userBouns = oneProject.hprize * +this.moneyTempArr[projectIdx]
                        // 檢查是否超過最大金額
                        if (userBouns > this.bonusLimit) {
                            const title = `${this.$t(this.keyObj[oneProject.parentName])}-${this.$t(oneProject.childNameKey)}`
                            this.$msg(warnMessageBox({
                            // 超过投注限制
                                message: this.$t('popup_035'),
                                // 您于【{0}】的投注金额已超过最高投注上限，请重新选择。
                                content: this.$t('popup_074', { '0': title })
                            }))
                            return true
                        }
                    }

                    // 檢查是否存在過期獎期
                    const thisIssue = oneProject.issue
                    if (!ISSUE_ARR.includes(thisIssue)) {
                        this.deleteInvalidProject(thisIssue)
                        return true
                    }
                })

                if (this.isConfirm) {
                    return
                }

                if (isBeforeSubmit && !exceeds) {
                    // 更新gameOrder nums, money
                    this[_M.SET_GAME_ORDER_DATA]({ nums: this.ltProjectNum })

                    this.isConfirm = true
                    this.isEscClose = false
                    const errorCode = await this.beforeConfirm(this)
                    this.reSetStore()
                    this.handleClose()
                    !errorCode && this.$root.$emit('handleReset')
                }
            },
            /**
             * 刪除過期注單, 並開啟警示訊息
             * @param {String} invalidIssue
             */
            deleteInvalidProject(invalidIssue) {
                // 找出過期注單idx
                const invalidIdxArr = this.getProjectList.reduce((ans, {issue}, rowIdx) => {
                    if (invalidIssue === issue) {
                        ans.push(rowIdx)
                    }
                    return ans
                }, [])

                // 從底端開始刪除注單
                invalidIdxArr.reverse().forEach((idx) => {
                    this.handleDelete(idx)
                })

                // 開啟警示訊息
                this.warningIssue = invalidIssue
            },
            /**
             * 刪除單注
             * @param {Number} idx 該注單在注單箱裏頭的index
             */
            handleDelete(idx) {
                this.moneyTempArr.splice(idx, 1)
                this.fast ? this[_M.SET_PROJECT_TEMP]({type: 3, idx}) : this[_M.REMOVE_SUBMIT_ORDER_INDEX](idx)
            },
            /**
             * 設定moneyTempArr方法, 輸入不合法時觸發
             * @param idx 在注單箱裏頭的index
             * @param newMoney 欲設定的新money
             */
            setMoneyTemp(idx) {
                return (newMoney) => {
                    this.$set(this.moneyTempArr, idx, newMoney)
                }
            },
            // 投注金額設定&觸發重算, 驗證完觸發
            afterCleanInput(idx) {
                return (newMoney) => {
                    if (this.fast) {
                        this[_M.SET_PROJECT_TEMP]({type: 2, idx, data: {money: +newMoney, onePrice: +newMoney}})
                    } else {
                        this[_M.SET_GAME_LT_PROJECT]({type: 5, index: idx, data: {money: +newMoney, onePrice: +newMoney}})
                    }
                    this.reCount = true
                }
            },
            // 投注金額檢查最小金額
            handleBlur(e, idx) {
                let newMoney = +e.target.value
                if (+newMoney < +this.onePrice) {
                    newMoney = +this.onePrice
                    this.$set(this.moneyTempArr, idx, newMoney)
                }

                if (this.fast) {
                    this[_M.SET_PROJECT_TEMP]({type: 2, idx, data: {money: +newMoney, onePrice: +newMoney}})
                } else {
                    this[_M.SET_GAME_LT_PROJECT]({type: 5, index: idx, data: {money: +newMoney, onePrice: +newMoney}})
                    this.$root.$emit('updateMoneyTemp')
                }
            }
        }
    }
</script>
