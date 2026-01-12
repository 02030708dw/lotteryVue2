import store from '@/store/store'
// expense 支出
// income 收入
// normal
// all
const temp = [
    { id: 9999, cn_title: '全部类型', att: 'all', title_key: 'wallet_033' },
    { id: 3, cn_title: '[-]加入游戏', att: 'expense', title_key: 'wallet_003' },
    // { id: 6, cn_title: '[-]追号扣款', att: 'expense', title_key: 'wallet_005' },
    { id: 5, cn_title: '[+]奖金派送', att: 'income', title_key: 'wallet_004' },
    { id: 4, cn_title: '[+]投注返点', att: 'income', title_key: 'wallet_014' },
    { id: 78, cn_title: '[+]打和返款', att: 'income', title_key: 'wallet_008' },
    { id: 79, cn_title: '[+]打和返款-扣款', att: 'income', title_key: 'wallet_008' }, // 後端使用，前端顯示'[+]打和返款'
    // { id: 7, cn_title: '[+]当期追号返款', att: 'income', title_key: 'wallet_006' },
    { id: 9, cn_title: '[+]玩家撤单返款', att: 'income', title_key: 'wallet_007' },
    { id: 76, cn_title: '[+]系统撤单返款', att: 'income', title_key: 'wallet_009' },
    // { id: 77, cn_title: '[+]撤销追号返款', att: 'income', title_key: 'wallet_010' },
    { id: 12, cn_title: '[-]撤销派奖', att: 'expense', title_key: 'wallet_011' },
    { id: 11, cn_title: '[-]撤销返点', att: 'expense', title_key: 'wallet_015' },
    { id: 80, cn_title: '[-]撤销打和', att: 'expense', title_key: 'wallet_016' },
    // { id: 38, cn_title: '[+]理赔充值', att: 'income' },
    // { id: 39, cn_title: '[-]管理员扣减', att: 'expense' },
    { id: 69, cn_title: '[+]钱包充值', att: 'income', title_key: 'wallet_012' },
    { id: 70, cn_title: '[-]钱包转出', att: 'expense', title_key: 'wallet_013' },
    // { id: 71, cn_title: '钱包整理', att: 'normal' },
    { id: 72, cn_title: '[+]投注返款-系统', att: 'income', title_key: 'wallet_028' },
    { id: 73, cn_title: '[+]派奖返款-系统', att: 'income', title_key: 'wallet_029' },
    { id: 74, cn_title: '[-]投注扣款-系统', att: 'expense', title_key: 'wallet_030' },
    { id: 75, cn_title: '[-]派奖扣款-系统', att: 'expense', title_key: 'wallet_031' },
    { id: 99, cn_title: '[+]撤单返款-系统', att: 'income', title_key: 'wallet_009' } // 後端使用，前端顯示'[+]系统撤单返款'
]

export const getOrderTypeName = (id) => {
    return (temp.find(item => item.id === parseInt(id)) || {}).cn_title
}

export const getOrderTypeNameKey = (id) => {
    return (temp.find(item => item.id === parseInt(id)) || {}).title_key
}

export const getOrderTypeObject = (id) => {
    return temp.find(item => item.id === parseInt(id))
}

// 8,38, 39, 71为不显示列表选项
// room_master_login_type===>
// '0' => 'B2B',
// '1' => 'GPI',
// '2' => 'DIRECT',
// '8' => 'DEMO',
// '9' => 'TEST',
export const orderTypeNameList = () => {
    if (store.getters.JWT.room_master_login_type === 9) {
        return temp.filter(item => [72, 73, 74, 75, 79, 99].indexOf(item.id) < 0)
    }
    return temp.filter(item => [79, 99].indexOf(item.id) < 0)
}
