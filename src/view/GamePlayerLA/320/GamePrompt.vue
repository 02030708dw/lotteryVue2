
<template>
    <div>
        <div class="gr_game-prompt" @click="open()">
            <i class="gr_game-prompt__icon  i_question" />
            <!-- '玩法说明' -->
            <span class="gr_game-prompt__text">{{$t('common_017')}}</span>
        </div>
    </div>
</template>
<script>
import { componentBox } from '@UTIL'
export default {
    name: 'GamePrompt',
    methods: {
        open() {
            this.$msg(componentBox())
        }
    }
}
</script>