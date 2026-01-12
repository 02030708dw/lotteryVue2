import store from '@/store/store'
const getModuleByNamespace = (store, helper, namespace) => {
    const module = store._modulesNamespaceMap[namespace]
    if (process.env.NODE_ENV !== 'production' && !module) {
        console.error(`[vuex] module namespace not found in ${helper}(): ${namespace}`)
    }
    return module
}

const normalizeNamespace = (fn) => {
    return (namespace, map) => {
        if (typeof namespace !== 'string') {
            map = namespace
            namespace = ''
        } else if (namespace.charAt(namespace.length - 1) !== '/') {
            namespace += '/'
        }
        return fn(namespace, map)
    }
}

const normalizeMap = (map) => {
    return Array.isArray(map)
      ? map.map(key => ({ key, val: key }))
      : Object.keys(map).map(key => ({ key, val: map[key] }))
}

export const mapActions = normalizeNamespace((namespace, actions) => {
    const res = {}
    normalizeMap(actions).forEach(({ key, val }) => {
        res[key] = function mappedAction (...args) {
            let dispatch = store.dispatch
            if (namespace) {
                const module = getModuleByNamespace(store, 'mapActions', namespace)
                if (!module) {
                    return
                }
                dispatch = module.context.dispatch
            }
            return dispatch.apply(store, [val].concat(args))
        }
    })
    return res
})

export const mapGetters = (arr) => {
    let res = {}
    arr.forEach(function (key) {
        res[key] = function mappedGetter () {
        // 如果在getters中不存在，报错
            if (!(key in store.getters)) {
                console.error(('[vuex] unknown getter: ' + key))
            }
        // 根据 val 在 getters 对象里找对应的属性值
            return store.getters[key]
        }
    })
    return res
}

/**
 * 把 Object 內的 value 列出
 * @param {Object} obj 物件
 */
export const mapObjectGetters = (name, arr = []) => {
    let res = {}
    Object.keys(store.getters[name])
        .filter(key => arr.length === 0 || arr.indexOf(key) > -1)
        .forEach((key) => {
            res[key] = () => store.getters[name][key]
            res[key].vuex = true
        })
    return res
}

/**
 * 把 Array內的Object 內的 value 列出
 * @param {Object} obj 物件
 */
export const mapArrayObjectGetters = (name, index, arr = []) => {
    let res = {}
    Object.keys(store.getters[name][index])
        .filter(key => arr.length === 0 || arr.indexOf(key) > -1)
        .forEach((key) => {
            res[key] = () => store.getters[name][index][key]
            res[key].vuex = true
        })
    return res
}
// export const i18n = () => vue$.$i18n