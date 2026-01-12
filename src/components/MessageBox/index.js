import MessageBox from './main'
import vuexModule from './store'

const install = (Vue, { store, moduleName = 'messageBoxData' }) => {
    if (install.installed) {
        return
    }
    if (!store) {
        throw new Error('Please provide vuex store.')
    }
    vuexModule.getters.msg = data => store.dispatch('SET_MESSAGE_BOX_DATA', data)
    vuexModule.getters.dispatch = () => store.dispatch
    store.registerModule(moduleName, vuexModule)
    Vue.component(MessageBox.name, MessageBox)
    Vue.prototype.$msg = vuexModule.getters.msg
}

export default {
    install,
    MessageBox
}