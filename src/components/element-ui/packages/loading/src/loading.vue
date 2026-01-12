<template>
  <transition name="el-loading-fade" @after-leave="handleAfterLeave">
    <div
      v-show="visible"
      class="el-loading-mask"
      :class="[customClass, { 'is-fullscreen': fullscreen }]">
      <div class="el-loading-spinner">
        <svg class="circular" viewBox="25 25 50 50">
          <circle class="border" cx="50" cy="50" r="20" fill="none"/>
          <circle class="path_base" cx="50" cy="50" r="20" fill="none"/>
          <circle class="path" cx="50" cy="50" r="20" fill="none"/>
        </svg>
        <p v-if="text" class="el-loading-text">{{ text }}</p>
      </div>
    </div>
  </transition>
</template>

<script>
import { isIE } from '@UTIL'
  export default {
    data() {
      return {
        text: null,
        fullscreen: true,
        visible: false,
        customClass: ''
      };
    },

    methods: {
      handleAfterLeave() {
        this.$emit('after-leave');
      },
      setText(text) {
        this.text = text;
      }
    },
    beforeUpdate() {
      // rotate loading icon, css transition doesn't work on IE9
      if (isIE() === 9){
          let svg = document.getElementsByClassName('circular')[0]
          const rotate = function(i) {
              if (!svg) return
              if (i < 36){
                  svg.style.msTransform = 'rotate(' + i * 25 + 'deg)'
                  setTimeout(function() {
                      rotate(i + 1)
                  }, 60);
              }
          }
          rotate(0)
      }
    }
  };
</script>
