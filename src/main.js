// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import '@UTIL/prototype'
import '@UTIL/placeholder'

import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/store'
import i18n from './lang/lang'
import { sync } from 'vuex-router-sync'

// 彈窗
import MessageBox from '@C/MessageBox'
// Vue-Lazyload(懶加載)
import VueLazyload from 'vue-lazyload'

// vue rxjs
import { Observable } from 'rxjs/Observable'
import { Subscription } from 'rxjs/Subscription'
import 'rxjs/add/observable/empty'
import 'rxjs/add/observable/fromEvent'
import 'rxjs/add/observable/interval'
import 'rxjs/add/operator/publish'
import 'rxjs/add/operator/bufferTime'
import 'rxjs/add/operator/filter'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/do'
import 'rxjs/add/operator/pluck'
import 'rxjs/add/operator/take'
import 'rxjs/add/operator/delay'
import 'rxjs/add/operator/throttleTime'
import 'rxjs/add/operator/distinctUntilChanged'
import 'rxjs/add/operator/debounceTime'
import 'rxjs/add/operator/concatMap'
import 'rxjs/add/operator/takeUntil'
import 'rxjs/add/operator/withLatestFrom'
import 'rxjs/add/operator/merge'
import 'rxjs/add/observable/merge'
import 'rxjs/add/operator/share'
import 'rxjs/add/operator/startWith'
import VueRx from 'vue-rx'

import '@CSS/reset'
import '@CSS/flipTimer.min'
import '@CSS/element-ui/base'
import '@CSS/element-ui/date-picker'
import '@CSS/element-ui/loading'
import '@CSS/element-ui/message-box'
import '@CSS/element-ui/input-number'
import '@CSS/element-ui/input'
import '@CSS/element-ui/checkbox'
import '@CSS/element-ui/radio-button'
import '@CSS/element-ui/select'
import '@CSS/element-ui/select-dropdown'
import '@CSS/element-ui/collapse'
import '@CSS/element-ui/collapse-item'
import '@CSS/element-ui/option-group'
import '@CSS/element-ui/popover'
import 'hooper/dist/hooper.css'

import '@CSS/style'
import ElementUI from '@E/src'
import directive from './directive'

Vue.use(ElementUI)
ElementUI.i18n((key, value) => i18n.t(key, value))

Vue.use(directive)
Vue.use(MessageBox, { store, moduleName: 'messageBoxData' })
Vue.use(VueRx, { Observable, Subscription })
Vue.config.productionTip = false
Vue.use(VueLazyload)

sync(store, router)

// const d = +new Date()
// Vue.mixin({
//     created: function () {
//         // console.log(this.$options._componentTag)
//         console.log(+new Date() - d, this.$options._componentTag, this)
//     }
// })

Vue.prototype.$tu = i18n.$tu

const queue = [
    store.dispatch(_M.GET_STRING_POOL, { pageList: ['all'] }),
    store.dispatch(_M.GET_LOTTERY_MENU),
    store.dispatch(_M.GET_MY_FAVORITES),
    store.dispatch(_M.GET_POPULAR_ENTRIES)
]
const isGamePlayerTable = location.pathname.includes('GamePlayerTable')
// 優化加載 桌面玩法時處理
if (isGamePlayerTable) {
    ['pixi', 'TweenMax', 'PixiPlugin'].forEach(js => {
        queue.push(
            new Promise(resolve => {
                const script = document.createElement('script')
                script.src = `${CDN}/static/pixi/js/${js}.js?v=3`
                document.head.appendChild(script)
                script.onload = () => resolve()
            })
        )
    })
}
Promise.all(queue).then(() => {
    isGamePlayerTable && require('pixi-projection')
    const $vue = new Vue({
        el: '#app',
        router,
        store,
        i18n,
        watch: {
            $route: (to, from) => {
                if (parent && parent.postMessage) {
                    const urlTo = {
                        fullPath: to.fullPath,
                        meta: to.fullPath
                    }
                    const urlFrom = {
                        fullPath: from.fullPath,
                        meta: from.fullPath
                    }
                    parent.postMessage({ urlTo, urlFrom }, '*')
                }
            }
        },
        render: createElement => createElement(App)
    })
    store.registerModule('$vue', {
        getters: {
            getVue: () => () => $vue
        }
    })
})