<template>
    <div class="gr_container playinfo_content bg_primary" v-html="playInfoContent" />
</template>
<style lang="scss">
@import '~@CSS/main.scss';
	.playinfo_content {
		border: 1px solid border_color(default);
		padding: 12px 10px;
		& table {
			background: backgrounds(secondary_light);
			& tr {
				&:first-of-type td {	// 標題
					background: darken($color_accent, 7.5%);
					border-color: darken($color_accent, 7.5%);
					border-right-color: border_color(default);
					box-shadow: 0 3px 0 border_color(accent_dark);
					color: text_color(default_invert);
					padding: 5px 0;
					text-align: center;
					& + td {
						border-left-color: border_color(default);
					}
					&:last-of-type {
						border-right-color: darken($color_accent, 7.5%);
					}
				}
				& + tr td {				// 內文
					padding: 8px 10px;
					width: 35%;
					&:first-child:nth-last-child(5),	// 第一二欄
					&:first-child:nth-last-child(4),
					&:nth-child(2):nth-last-child(4) {
						text-align: center;
						width: 8%;
					}
					&:first-child:nth-last-child(3),	// 第三欄
					&:nth-child(2):nth-last-child(3),
					&:nth-child(3):nth-last-child(3) {
						text-align: center;
						width: 14%;
					}
				}
			}
			& td {
				@include border(border_color(default));
				line-height: 18px;
				vertical-align: middle;
			}
		}
	}

// @media screen and (max-width: 979px) {
// 	.playinfo_content {
// 		& table tr td {
// 			&:first-child:nth-last-child(5),	//767 以下隱藏第一欄及最後一欄
// 			&:last-child {
// 				display: none;
// 			}
// 			&:first-child:nth-last-child(4),
// 			&:nth-child(2):nth-last-child(4) {
// 				width: 10%;
// 			}
// 		}
// 	}
// }
</style>
<script>
import { mapGetters } from 'vuex'

export default {
    name: 'playInfoList',
    computed: {
        ...mapGetters([
            'playList',
            'playListIndex'
        ]),
        playInfoContent() {
            return this.playList[this.playListIndex].content
        }
    }
}
</script>