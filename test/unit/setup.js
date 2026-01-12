import Vue from 'vue'
import '@/util/prototype'
import moment from 'moment'
import * as _M from '@/store/modules/mutations.js'
const localStorageMock = {
    removeItem: jest.fn(),
    getItem: jest.fn(),
    setItem: jest.fn(),
    clear: jest.fn()
}
Vue.config.productionTip = false
global.moment = moment
global._M = _M
global.localStorage = localStorageMock
// global._M = _M
global.externalLibrary = {
    logError: err => {
        console.log(err) // will output errors during Jest run
    }
}
