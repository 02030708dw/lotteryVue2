/**
 * 玩法說明的示例圖資料
 * --- 一般共通 ---
 * item_title: 主標題, 備註用, 程式不使用
 * sub_title: 副標題, 備註用, 程式不使用
 * sampleCodes: 投注球
 * sampleWords: 投注內文字
 * bingoCodes: 開獎球
 * bingos: 開獎方框
 * arrow: 投注/開獎 之間的箭頭
 *
 * --- 越南彩 ---
 * bingoData: [{ 開獎資料組
 *  bingoWords: 開獎內標題
 *  bingoCodes: 開獎內數字
 *  bingos: 開獎內數字方框
 * }...]
 * */

// 越南彩
// 中南部
const VN_S = {
    // 2D
    '2d': [
        // 头
        {
            sampleCodes: '01',
            bingoData: [
                {
                    // 八奖
                    bingoWords: 'h_vn_t_006',
                    bingoCodes: '01'
                }
            ]
        },
        // 尾
        {
            sampleCodes: '01',
            bingoData: [
                {
                    // 特奖
                    bingoWords: 'h_vn_t_012',
                    bingoCodes: '5|4|3|2|0|1',
                    bingos: [false, false, false, false, true, true]
                }
            ]
        },
        // 头尾
        {
            sampleCodes: '01',
            bingoData: [
                {
                    // 特奖
                    bingoWords: 'h_vn_t_012',
                    bingoCodes: '5|4|3|2|0|1',
                    bingos: [false, false, false, false, true, true]
                }
            ]
        },
        // 包组
        {
            sampleCodes: '01',
            bingoData: [
                {
                    // 五奖
                    bingoWords: 'h_vn_t_009',
                    bingoCodes: '3|2|0|1',
                    bingos: [false, false, true, true]
                }
            ]
        },
        // 包组7
        {
            sampleCodes: '01',
            bingoData: [
                {
                    bingoWords: 'h_vn_t_009',
                    bingoCodes: '3|2|0|1',
                    bingos: [false, false, true, true]
                }
            ]
        }
    ],
    // 3D
    '3d': [
        // 头
        {
            sampleCodes: '001',
            bingoData: [
                {
                    // 七奖
                    bingoWords: 'h_vn_t_007',
                    bingoCodes: '0|0|1'
                }
            ]
        },
        // 尾
        {
            sampleCodes: '001',
            bingoData: [
                {
                    // 特奖
                    bingoWords: 'h_vn_t_012',
                    bingoCodes: '1|2|3|0|0|1',
                    bingos: [false, false, false, true, true, true]
                }
            ]
        },
        // 头尾
        {
            sampleCodes: '001',
            bingoData: [
                {
                    // 特奖
                    bingoWords: 'h_vn_t_012',
                    bingoCodes: '1|2|3|0|0|1',
                    bingos: [false, false, false, true, true, true]
                }
            ]
        },
        // 包组
        {
            sampleCodes: '001',
            bingoData: [
                {
                    // 五奖
                    bingoWords: 'h_vn_t_009',
                    bingoCodes: '1|0|0|1',
                    bingos: [false, true, true, true]
                }
            ]
        },
        // 包组7
        {
            sampleCodes: '001',
            bingoData: [
                {
                    // 五奖
                    bingoWords: 'h_vn_t_009',
                    bingoCodes: '1|0|0|1',
                    bingos: [false, true, true, true]
                }
            ]
        }
    ],
    // 4D
    '4d': [
        // 尾
        {
            sampleCodes: '0001',
            bingoData: [
                {
                    // 特奖
                    bingoWords: 'h_vn_t_012',
                    bingoCodes: '1|2|0|0|0|1',
                    bingos: [false, false, true, true, true, true]
                }
            ]
        },
        // 包组
        {
            sampleCodes: '0001',
            bingoData: [
                {
                    // 特奖
                    bingoWords: 'h_vn_t_012',
                    bingoCodes: '1|2|0|0|0|1',
                    bingos: [false, false, true, true, true, true]
                }
            ]
        }
    ],
    // PL2
    pl2: [
        {
            sampleCodes: '01、23',
            bingoData: [
                {
                    // 八奖
                    bingoWords: 'h_vn_t_006',
                    bingoCodes: '0|1',
                    bingos: [true, true]
                },
                {
                    // 五奖
                    bingoWords: 'h_vn_t_009',
                    bingoCodes: '1|0|2|3',
                    bingos: [false, false, true, true]
                }
            ]
        }
    ],
    // PL3
    pl3: [
        {
            sampleCodes: '01、23、45',
            bingoData: [
                {
                    // 八奖
                    bingoWords: 'h_vn_t_006',
                    bingoCodes: '0|1',
                    bingos: [true, true]
                },
                {
                    // 五奖
                    bingoWords: 'h_vn_t_009',
                    bingoCodes: '1|0|2|3',
                    bingos: [false, false, true, true]
                },
                {
                    // 一奖
                    bingoWords: 'h_vn_t_011',
                    bingoCodes: '3|2|1|4|5',
                    bingos: [false, false, false, true, true]
                }
            ]
        }
    ],
    // SP
    teshu: [
        // 头
        {
            // 大

            sampleWords: 'h_vn_t_013',
            bingoData: [
                {
                    // 八奖
                    bingoWords: 'h_vn_t_006',
                    bingoCodes: '5|0'
                }
            ]
        },
        // 尾
        {
            // 双

            sampleWords: 'h_vn_t_014',
            bingoData: [
                {
                    // 特奖
                    bingoWords: 'h_vn_t_012',
                    bingoCodes: '1|2|3|4|0|0',
                    bingos: [false, false, false, false, true, true]
                }
            ]
        },
        // 头尾
        {
            // 单单

            sampleWords: 'h_vn_t_015',
            bingoData: [
                {
                    // 八奖
                    bingoWords: 'h_vn_t_006',
                    bingoCodes: '1|1'
                }
            ]
        },
        // 包组
        {
            // 内

            sampleWords: 'h_vn_t_016',
            bingoData: [
                {
                    // 五奖
                    bingoWords: 'h_vn_t_009',
                    bingoCodes: '3|4|2|5',
                    bingos: [false, false, true, true]
                }
            ]
        }
    ]
}

// 北部
const VN_N = {
    // 2D
    '2d': [
        // 头
        {
            sampleCodes: '01',
            bingoData: [
                {
                    // 七奖
                    bingoWords: 'h_vn_t_007',
                    bingoCodes: '0|1|,|0|2|,|0|3|,|0|4',
                    bingos: [true, true]
                }
            ]
        },
        // 尾
        {
            sampleCodes: '01',
            bingoData: [
                {
                    // 特奖
                    bingoWords: 'h_vn_t_012',
                    bingoCodes: '4|3|2|0|1',
                    bingos: [false, false, false, true, true]
                }
            ]
        },
        // 头尾
        {
            sampleCodes: '01',
            bingoData: [
                {
                    // 特奖
                    bingoWords: 'h_vn_t_012',
                    bingoCodes: '4|3|2|0|1',
                    bingos: [false, false, false, true, true]
                }
            ]
        },
        // 包组
        {
            sampleCodes: '01',
            bingoData: [
                {
                    // 二奖
                    bingoWords: 'h_vn_t_010',
                    bingoCodes: '4|3|2|0|1|,|6|5|4|3|2',
                    bingos: [false, false, false, true, true]
                }
            ]
        }
    ],
    // 3D
    '3d': [
        // 头
        {
            sampleCodes: '001',
            bingoData: [
                {
                    // 六奖
                    bingoWords: 'h_vn_t_008',
                    bingoCodes: '0|0|1|,|2|3|4|,|4|5|6',
                    bingos: [true, true, true]
                }
            ]
        },
        // 尾
        {
            sampleCodes: '001',
            bingoData: [
                {
                    // 特奖
                    bingoWords: 'h_vn_t_012',
                    bingoCodes: '1|2|3|0|0|1',
                    bingos: [false, false, false, true, true, true]
                }
            ]
        },
        // 头尾
        {
            sampleCodes: '001',
            bingoData: [
                {
                    // 特奖
                    bingoWords: 'h_vn_t_012',
                    bingoCodes: '1|2|3|0|0|1',
                    bingos: [false, false, false, true, true, true]
                }
            ]
        },
        // 包组
        {
            sampleCodes: '001',
            bingoData: [
                {
                    // 六奖
                    bingoWords: 'h_vn_t_008',
                    bingoCodes: '0|0|1|,|2|3|4|,|4|5|6',
                    bingos: [true, true, true]
                }
            ]
        }
    ],
    // 4D
    '4d': [
        // 尾
        {
            sampleCodes: '0001',
            bingoData: [
                {
                    // 特奖
                    bingoWords: 'h_vn_t_012',
                    bingoCodes: '2|0|0|0|1',
                    bingos: [false, true, true, true, true]
                }
            ]
        },
        // 包组
        {
            sampleCodes: '0001',
            bingoData: [
                {
                    // 特奖
                    bingoWords: 'h_vn_t_012',
                    bingoCodes: '2|0|0|0|1',
                    bingos: [false, true, true, true, true]
                }
            ]
        }
    ],
    // PL2
    pl2: [
        {
            sampleCodes: '01、23',
            bingoData: [
                {
                    // 七奖
                    bingoWords: 'h_vn_t_007',
                    bingoCodes: '0|1|,|0|2|,|2|4|,|3|5',
                    bingos: [true, true]
                },
                {
                    // 一奖
                    bingoWords: 'h_vn_t_011',
                    bingoCodes: '0|1|0|2|3',
                    bingos: [false, false, false, true, true]
                }
            ]
        }
    ],
    // PL3
    pl3: [
        {
            sampleCodes: '01、23、45',
            bingoData: [
                {
                    // 七奖
                    bingoWords: 'h_vn_t_007',
                    bingoCodes: '0|1|,|4|5|,|6|7',
                    bingos: [true, true, false, true, true]
                },
                {
                    // 一奖
                    bingoWords: 'h_vn_t_011',
                    bingoCodes: '0|1|0|2|3',
                    bingos: [false, false, false, true, true]
                }
            ]
        }
    ],
    // SP
    teshu: [
        // 头
        {
            // 大

            sampleWords: 'h_vn_t_013',
            bingoData: [
                {
                    // 七奖
                    bingoWords: 'h_vn_t_007',
                    bingoCodes: '0|1|,|2|3|,|3|4|,|5|0',
                    bingos: [
                        false,
                        false,
                        false,
                        false,
                        false,
                        false,
                        false,
                        false,
                        false,
                        true,
                        true
                    ]
                }
            ]
        },
        // 尾
        {
            // 双

            sampleWords: 'h_vn_t_014',
            bingoData: [
                {
                    // 特奖
                    bingoWords: 'h_vn_t_012',
                    bingoCodes: '2|3|4|0|0',
                    bingos: [false, false, false, true, true]
                }
            ]
        },
        // 头尾
        {
            // 单单

            sampleWords: 'h_vn_t_015',
            bingoData: [
                {
                    // 七奖
                    bingoWords: 'h_vn_t_007',
                    bingoCodes: '1|1|,|2|3|,|3|4|,|5|0',
                    bingos: [true, true]
                }
            ]
        },
        // 包组
        {
            // 内

            sampleWords: 'h_vn_t_016',
            bingoData: [
                {
                    // 特奖
                    bingoWords: 'h_vn_t_012',
                    bingoCodes: '1|3|4|2|5',
                    bingos: [false, false, false, true, true]
                }
            ]
        }
    ]
}

export const getExampleData = (menuId, lotteryName) => {
    let map

    return {
        [lotteryName]: map[lotteryName]
    }
}
