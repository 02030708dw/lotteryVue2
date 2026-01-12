<template>
    <div class="el-date-infobox">
        <div class="el-message-box__header">
            <div class="el-message-box__title u_t--center">
                <span>开彩日</span>
            </div>
            <div class="el-date-infobox__daterange">
                <span class="el_daterange__item is_active">2018-08-18</span>
                <span>~</span>
                <span class="el_daterange__item">2018-08-18</span>
            </div>
        </div>
        <div class="el-message-box__content">
            55555
        </div>
        <div class="el-date-infobox__submit">
            <span class="el_submit__item" @click="cancel">取消</span>
            <span class="el_submit__item is_active">确定</span>
        </div>
    </div>
</template>
<script>
import { componentBox } from '@UTIL'

export default {
  name: "",
  data: () => ({

  }),
  methods: {
      cancel() {
          this.$msg(componentBox({ show: false }))
      }
  }
}
</script>
<style lang="scss" scoped>
</style>
