const defaultFlipTimer = {
    /** 剩下時間 */
    coldTime: 0,
    hours: '00',
    minutes: '00',
    seconds: '00',
    /** 是否倒數中 */
    isCountDown: false
}
export default {
    flipTimerAll: {
        VN_S: {...defaultFlipTimer}, // VN_S
        VN_C: {...defaultFlipTimer}, // VN_C
        VN_N: {...defaultFlipTimer} // VN_N
    },
    coldDownAll: {},
    areaListAll: [],
    allOpenIssue: {},
    allIssue: {},
    firstLoadFlipTimer: true
}
