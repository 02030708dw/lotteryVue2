/**
 * GameBall config
 * @param {Array} rowTitle row標題
 * @param {Array} balls 彩球value,投注送出值
 * @param {Array} randomSP 隨機一注需要特別處理
 */
export default {
    // 1d頭
    STOCK_1d_1d_1d_tou: {
        rowTitle: [''],
        balls: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    },
    // 1d尾
    STOCK_1d_1d_1d_wei: {
        rowTitle: [''],
        balls: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    },
    // 2d頭
    STOCK_2d_2d_2d_tou: {
        // 十位,個位
        rowTitle: ['3d_o_002', '3d_o_003'],
        balls: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        // '包胆', '包组'
        option: ['4d_o_025', 'vn_t_021']
    },
    // 2d尾
    STOCK_2d_2d_2d_wei: {
        // 十位,個位
        rowTitle: ['stock_019', 'stock_020'],
        balls: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        // '包胆', '包组'
        option: ['4d_o_025', 'vn_t_021']
    },
    // 3d頭
    STOCK_3d_3d_3d_tou: {
        // 百位,十位,個位
        rowTitle: ['3d_o_001', '3d_o_002', '3d_o_003'],
        balls: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        // '包组'
        option: ['vn_t_021']
    },
    // 3d头奖组选
    STOCK_3d_3d_3d_toujiangzuxuan: {
        rowTitle: [''],
        balls: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        // '包组'
        option: ['vn_t_021'],
        randomSP: true
    }
}
