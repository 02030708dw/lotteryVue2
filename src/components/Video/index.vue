<template>
    <div class="video-player" v-if="reseted">
        <video
            playsinline="true"
            webkit-playsinline="true"
            class="video-js"
            ref="video"
        />
    </div>
</template>
<script>
import { videoPlayer } from 'vue-video-player'

export default {
    mixins: [videoPlayer]
}
</script>
