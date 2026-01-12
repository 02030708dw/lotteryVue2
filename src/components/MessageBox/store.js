const messageBoxData = {
    /** 訊息類型 */
    type: '',
    /** 彈窗標題:温馨提示 */
    title: 'popup_001',
    /** 彈窗訊息 */
    message: '',
    /** 彈窗內文 */
    content: '',
    /** 確認按鈕文字:确定 */
    confirmText: 'popup_004',
    /** 取消按鈕文字:取消 */
    cancelText: 'popup_013',
    /** 是否顯示確認按鈕 */
    isShowConfirmBtn: true,
    /** 是否顯示取消按鈕 */
    isShowCancelBtn: false,
    /** 是否顯示關閉按鈕 */
    isShowCloseIcon: true,
    /** 按下 ESC 可否關閉彈窗 */
    isPressEscClose: true,
    /** 外部點下去是否 可關閉彈窗 */
    isOutSideClickClose: false,
    /** 是否彈窗 */
    show: false,
    /** 自動關閉時間 */
    coldTime: 0,
    /** 彈窗出現時執行 */
    beforeMount: () => null,
    /** 確認前執行 */
    beforeConfirm: () => null,
    /** 關閉前執行 */
    beforeClose: () => null,
    /** 取消前執行 */
    beforeCancel: () => null,
    /** 確認後執行 */
    afterConfirm: () => null,
    /** 關閉後執行 */
    afterClose: () => null,
    /** 取消後執行 */
    afterCancel: () => null
}

const state = {
    messageBoxData: {}
}
const actions = {
    /**
     * 設定主要彈窗資料
     * @param {boolean} payload true: 展開, false: 縮回
     */
    'SET_MESSAGE_BOX_DATA' ({ state, commit, dispatch, rootGetters }, payload) {
        const isNumber = !isNaN(payload)
        if (isNumber) {
            payload = {
                zIndex: payload,
                ...messageBoxData
            }
        } else {
            payload = {
                ...messageBoxData,
                ...payload
            }
        }

        const {useOldPop = false} = payload
        if (('PIXI' in window) && !useOldPop && PIXI.isPlayIng && !isNumber) {
            const vue = rootGetters.getVue()
            vue.$root.$emit('drawPop', payload)
            return
        }
        const { zIndex, isPressEscClose } = payload
        if (payload.show) {
            dispatch(_M.SET_MASK_QUEUE, { zIndex, action: 'SET_MESSAGE_BOX_DATA', isPressEscClose })
        } else {
            dispatch(_M.DELETE_MASK, zIndex)
        }
        commit('SET_MESSAGE_BOX_DATA', { ...state.messageBoxData[zIndex], ...payload })
    }
}
const mutations = {
    /**
     * 設定主要 MessageBox 資料
     * @param {boolean} payload true: 顯示, false: 不顯示
     */
    'SET_MESSAGE_BOX_DATA' (state, payload) {
        state.messageBoxData = { ...state.messageBoxData, [payload.zIndex]: payload }
    }
}
const getters = {
    messageBoxData: state => state.messageBoxData
}

export default {
    state,
    actions,
    mutations,
    getters
}