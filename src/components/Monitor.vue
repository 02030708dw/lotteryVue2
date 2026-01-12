<template>
    <div 
        class="main" 
        :style="{
            top: y + 'px',
            left: x + 'px'
        }"
    >
        <div class="header">
            <input v-model="val" class="path" />
            <span class="back" @click="back">Back</span>
        </div>

        <div 
            class="items"
            @mousedown="handleDown"
            @mouseup="handleUp"
        >
            <div 
                class="item"
                v-for="(item, key) in res" :key="key" 
            >
                <span>{{key}}: </span>
                <span v-if="!isObj(item) || item === null" :style="{ color: getTypeColor(item) }">{{ (item !== undefined) ? item : typeof item }}</span>
                <span v-else-if="!item || Object.keys(item).length === 0">{{ (item instanceof Array) ? '[ ]' : '{ }' }}</span>
                <span v-else class="key" @click="handleClick(key)">{ ... }</span>
            </div>
        </div>

    </div>
</template>

<style scoped>
.main {
    position: fixed;
    background-color: black;
    color: white;
    z-index: 9999;
    width: 300px;
    height: 70%;
    overflow-y: auto;
    overflow-x: hidden;
    white-space: nowrap;
    opacity: .9;
    padding: 6px;
}
.main *::selection {
    background-color: unset;
}
.path {
    background-color: white;
    width: 200px;
}
.items {
    height: 95%;
}
.item {
    font-size: small;
    padding-top: 3px;
}
.key {
    cursor: pointer;
    font-weight: bold;
}
.back {
    cursor: pointer;
}
</style>


<script>
export default {
    name: 'Monitor',
    data() {
        return {
            val: '',
            x: 0,
            y: 0,
            offsetX: 0,
            offsetY: 0,
            move: false,
        }
    },
    props: {
        root: Object
    },
    mounted() {
        window.addEventListener('mousemove', this.handleMove)
        const val = localStorage.getItem('monitorVal')
        this.val = val || ''
    },
    destroyed() {
        window.removeEventListener('mousemove', this.handleMove)
    },
    methods: {
        handleDown(e) {
            e.preventDefault()
            this.move = true
            this.offsetX = e.layerX
            this.offsetY = e.layerY
        },
        handleUp(e) {
            this.move = false
        },
        handleMove(e) {
            if (this.move) {
                this.x = e.x - this.offsetX
                this.y = e.y - this.offsetY
            }
        },
        handleClick(key) {
            let val = this.val
            if (val) {
                val += '.' + key
            } else {
                val = key
            }
            this.val = val
        },
        isObj(item) {
            return typeof item === 'object'
        },
        getTypeColor(item) {
            switch(typeof item) {
                case 'string':
                    return 'red'
                    break
                case 'number':
                case 'boolean':
                    return '#5c5cd6'
                    break
                default: 
                    return 'gray'
                    break
            }
        },
        back() {
            const arr = this.val.split('.')
            arr.pop()
            this.val = arr.join('.')
        },
    },
    watch: {
        val(v) {
            localStorage.setItem('monitorVal', v)
        }
    },
    computed: {
        res() {
            const vals = this.val.split('.')
            let res = this.root
            let p = 0
            while (true) {
                if (vals[p] && res[vals[p]]) {
                    res = res[vals[p]]
                    p++
                } else break
            }
            return res
        }
    }
}
</script>
