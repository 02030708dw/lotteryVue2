<template>
    <div>
        <div class="el-message-box__content">
            <div class="el-message-box__news-content">
                <p>
                    尊敬的用户，您好:<br><br>
                    中国民生银行即将进行维护。<br>
                    5月21日(星期日) 00:00 时 至  5月21日07:00 在此期间，暂停有关中国民生银行的充提服务。<br><br>
                    感谢您的理解和支持，期间造成您的不便，敬请见谅。<br>
                    环彩营运部<br><br>
                    2017/05/17
                </p>
            </div>
        </div>
        <div class="el-message-box__btns">
            <el-button
                v-show="isShowCancelBtn"
                :loading="isCancelLoading"
                @click.native="cancel">
                {{ $t(cancelText) }}
            </el-button>
            <el-button
                ref="confirm"
                v-show="isShowConfirmBtn"
                class="el-button--primary"
                :loading="isConfirmLoading"
                @click.native="confirm">
                {{ $t(confirmBtnText) }}
            </el-button>
        </div>
    </div>
</template>

<script>

export default {
    name: 'InfoMationBox'
}
</script>
