<template>
    <div class="out_gamemask">
        <span>返回首頁中...</span>
    </div>
</template>
<style lang="scss" scoped>
.out_gamemask {
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    position: fixed;
    z-index: 100000;
    background-color: rgba(0, 0, 0, 0.7);
    color: #ffffff;
    span {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
}
</style>
<script>
export default {
    name: 'OutGameMask'
}
</script>
