import state from './state'
import actions from './actions'
import mutations from './mutations'

const getters = {
    coldDownAll: state => state.coldDownAll,
    flipTimerAll: state => state.flipTimerAll,
    // 所有開獎球號
    allOpenIssue: state => state.allOpenIssue,
    allIssue: state => state.allIssue,
    areaListAll: state => Object.entries(state.allIssue),
    firstLoadFlipTimer: state => state.firstLoadFlipTimer
}

export default {
    state,
    actions,
    mutations,
    getters
}
