// 載入全域directive
import cleanInput from './cleanInput'

const directive = {}

directive.install = Vue => {
    Vue.directive('clean-input', cleanInput)
}

export default directive
