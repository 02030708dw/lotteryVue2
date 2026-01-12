<template>
    <div class="gr_my-favorites" @click.stop>
        <!-- <div class="gr_my-favorites__inner">
            <List
                :isEdit="isEdit"
                :cloneListData="cloneListData"
                :setCloneMyFavorites="setCloneMyFavorites"
            />
            <Head
                :isEdit="isEdit"
                :setIsEdit="setIsEdit"
                :apply="apply"
                :popup="popup"
            />
        </div> -->
        <MessageBox :zIndex="1990"  className="gr_my-favorites__pop">
            <Pop
                :cloneListData="cloneListData"
                :setCloneMyFavorites="setCloneMyFavorites"
                :isEdit="isEdit"
            />
        </MessageBox>
    </div>
</template>
<script>
import Index_980 from '../../MyFavorites/index'
export default {
    name: 'MyFavorites_980',
    mixins: [Index_980]
}
</script>