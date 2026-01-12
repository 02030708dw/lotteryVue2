const TH_ALL = {
    242: {
        selling: {
            0: 'timetable_020',
            th: 'เปิดให้วางเดิมพันตั้งแต่ 07:00 น. ล่วงหน้า 5 วันก่อนหวยออกของทุกเดือน'
        },
        winning: {
            0: 'timetable_021',
            th: 'ออกรางวัลในวันที่ 1 และ 16 ของทุกเดือน (หากมีการเลื่อนวันและเวลาในการออกรางวัล จะขึ้นอยู่กับประกาศของสำนักงานสลากกินแบ่งรัฐบาลไทยเท่านั้น)'
        }
    }, // 泰国彩
    243: {
        selling: {
            0: 'timetable_010',
            1: '07:00',
            2: '05:00',
            th: 'เปิดให้วางเดิมพันตั้งแต่ 07:00 น. จนถึง 05.00 น. ในวันถัดไป'
        },
        winning: {
            0: 'timetable_008',
            1: '07:05',
            2: '05:00',
            3: '5',
            th: 'ออกรางวัลทุกๆ 5 นาที'
        }
    } // 泰国5分彩 (原 泰国30秒彩)
}
const STOCK = {
    245: {
        selling: {
            0: 'timetable_015',
            1: '00:00-12:55'
        },
        winning: {
            0: 'timetable_012',
            1: '11:00、14:30'
        }
    }, // 日经股票
    246: {
        selling: {
            0: 'timetable_015',
            1: '00:00-12:10'
        },
        winning: {
            0: 'timetable_012',
            1: '14:00'
        }
    }, // 台湾股票
    247: {
        selling: {
            0: 'timetable_015',
            1: '00:00-13:00'
        },
        winning: {
            0: 'timetable_012',
            1: '15:00'
        }
    }, // 韩国股票
    248: {
        selling: {
            0: 'timetable_015',
            1: '00:00-14:30'
        },
        winning: {
            0: 'timetable_012',
            1: '12:00、15:30'
        }
    }, // 中国深圳股票
    249: {
        selling: {
            0: 'timetable_015',
            1: '00:00-14:50'
        },
        winning: {
            0: 'timetable_012',
            1: '12:30、16:30'
        }
    }, // 香港恒生股票
    285: {
        selling: {
            0: 'timetable_015',
            1: '00:00-17:20'
        },
        winning: {
            0: 'timetable_012',
            1: '13:30、17:30'
        }
    } // 泰证SET指数
    // 以下尚未補 id
    // 0: {
    //     selling: {
    //         0: 'timetable_015',
    //         1: '00:00-16:05'
    //     },
    //     winning: {
    //         0: 'timetable_012',
    //         1: '17:30'
    //     }
    // }, // 新加坡股票
    // 0: {
    //     selling: {
    //         0: 'timetable_015',
    //         1: '00:00-16:40'
    //     },
    //     winning: {
    //         0: 'timetable_012',
    //         1: '18:30'
    //     }
    // }, // 印度股票
    // 0: {
    //     selling: {
    //         0: 'timetable_016',
    //         1: '00:00-18:10'
    //     },
    //     winning: {
    //         0: 'timetable_012',
    //         1: '21:00'
    //     }
    // }, // 埃及股票
    // 0: {
    //     selling: {
    //         0: 'timetable_015',
    //         1: '00:00-22:00'
    //     },
    //     winning: {
    //         0: 'timetable_012',
    //         1: '00:20'
    //     }
    // }, // 俄罗斯股票
    // 0: {
    //     selling: {
    //         0: 'timetable_015',
    //         1: '00:00-22:30'
    //     },
    //     winning: {
    //         0: 'timetable_012',
    //         1: '23:55'
    //     }
    // }, // 英国股票
}
const K3 = {
    130: {
        selling: {
            0: 'timetable_010',
            1: '07:00',
            2: '05:00'
        },
        winning: {
            0: 'timetable_007',
            1: '07:00',
            2: '05:00',
            3: '30'
        }
    }, // 亚洲30秒快3
    132: {
        selling: {
            0: 'timetable_010',
            1: '07:00',
            2: '05:00'
        },
        winning: {
            0: 'timetable_008',
            1: '07:01',
            2: '05:00',
            3: '1'
        }
    }, // 亚洲1分快3
    281: {
        selling: {
            0: 'timetable_010',
            1: '07:00',
            2: '05:00'
        },
        winning: {
            0: 'timetable_008',
            1: '07:05',
            2: '05:00',
            3: '5'
        }
    } // 澳洲5分快3
}
const K3_SB = {
    205: K3[130], // 世彩30秒骰宝
    206: K3[132], // 世彩1分骰宝
    240: K3[130], // 世彩30秒魚蝦蟹
    280: K3[132], // 亚洲1分鱼虾蟹
    282: K3[281], // 澳洲5分骰宝
    284: K3[281] // 澳洲5分鱼虾蟹
}

const VN_ALL = {
    212: {
        selling: {
            0: 'timetable_010',
            1: '07:00',
            2: '05:00'
        },
        winning: {
            0: 'timetable_008',
            1: '07:05',
            2: '05:00',
            3: '5'
        }
    }, // 越南5分彩
    223: {
        selling: {
            0: 'timetable_010',
            1: '07:00',
            2: '05:00'
        },
        winning: {
            0: 'timetable_007',
            1: '07:00',
            2: '05:00',
            3: '30'
        }
    }, // 越南30秒彩
    256: {
        selling: {
            0: 'timetable_010',
            1: '07:00',
            2: '05:00'
        },
        winning: {
            0: 'timetable_008',
            1: '07:05',
            2: '05:00',
            3: '5'
        }
    }, // 愛國彩
    0: {
        selling: {
            0: 'timetable_006'
        },
        winning: {
            0: 'timetable_019'
        }
    }, // 全区
    1: {
        selling: {
            0: 'timetable_006'
        },
        winning: {
            0: 'timetable_014',
            1: '17:15'
        }
    }, // 南部
    2: {
        selling: {
            0: 'timetable_006'
        },
        winning: {
            0: 'timetable_014',
            1: '18:15'
        }
    }, // 中部
    3: {
        selling: {
            0: 'timetable_006'
        },
        winning: {
            0: '19:15'
        }
    } // 北部
}

const PK10_BJL = {
    270: {
        selling: {
            0: 'timetable_010',
            1: '07:00',
            2: '04:03'
        },
        winning: {
            0: 'timetable_008',
            1: '13:09',
            2: '04:04',
            3: '5'
        }
    } // 幸运飞艇I百家乐
}

const MY = {
    289: {
        selling: {
            0: 'timetable_017'
        },
        winning: {
            0: 'timetable_025'
        }
    } // 幸运飞艇I百家乐
}
const LA = {
    288: {
        selling: {
            0: 'timetable_017'
        },
        winning: {
            0: 'timetable_026'
        }
    } // 幸运飞艇I百家乐
}
export const getData = () => {
    const chinaMap = {
        TH_ALL,
        STOCK,
        K3_SB,
        VN_ALL,
        PK10_BJL,
        MY,
        LA
    }
    return chinaMap
}
