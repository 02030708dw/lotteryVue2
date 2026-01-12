import { keys } from 'numeric-keyboard'

// 為了蓋掉全域CSS
export default {
    global: {
        color: '#000000',
        // specify a pair of colors for active pseudo class
        backgroundColor: ['#ffffff', '#929ca8']
    },
    key: {
        [keys.ENTER]: {
            color: 'white',
            backgroundColor: ['#fb8032', '#0051a8']
        },
        'clean': {
            color: 'white',
            backgroundColor: ['#ffffff', '#0051a8']
        }
    }
}