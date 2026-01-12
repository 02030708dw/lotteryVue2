import Vue from 'vue'
import Vuex from 'vuex'
import App from './modules/App/'
// import PlayInfo from './modules/PlayInfo/'
// import GameInfo from './modules/GameInfo/'
// import AddNewGameInfo from './modules/AddNewGameInfo/'
// import NewsEvents from './modules/NewsEvents/'
// import ReportList from './modules/ReportList/'
// import GamePlayer from './modules/GamePlayer/'
// import GameTrend from './modules/GameTrend/'
import Lang from './modules/Lang/'
/** Component */
import MaskScreen from './modules/MaskScreen/'

Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        App,
        // PlayInfo,
        // GameInfo,
        // AddNewGameInfo,
        // NewsEvents,
        // ReportList,
        // GamePlayer,
        // GameTrend,
        Lang,
        MaskScreen
    },
    strict: process.env.NODE_ENV !== 'production' //是否开启严格模式
})

export default store