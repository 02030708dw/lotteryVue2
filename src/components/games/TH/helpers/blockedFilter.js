const subMethodKeys = {
    '2D,3D,4D': '234d',
    'PL2,PL3': 'pl23',
    vn_t_007: 'teshu'
}
export default {
    checkIsBlocked(area, store) {
        try {
            const blockeds = store.VN_gameConfig.blockedPrizeSetKey // VN_S.PL2,PL3
            const title_key = store.VN_gameMenuSub[store.VN_subMenuIndex].title_key

            return (
                blockeds
                    //eliminate other VN_x
                    .filter(key => key.split('.')[0] === area)
                    //check if sub-method is in blocked list
                    .some(key => key.split('.')[1] === subMethodKeys[title_key])
            )
        } catch (err) {
            return false
        }
    },
    checkIsAllAreaBlocked(title_key, store) {
        try {
            const blockeds = store.VN_gameConfig.blockedPrizeSetKey // VN_S.PL2,PL3
            const currentArea = store.VN_gameMenu[store.VN_menuIndex].key //VN_S
            const currentMethod = subMethodKeys[title_key]

            return (
                blockeds
                    //eliminate other VN_x
                    .filter(key => key.split('.')[0] === currentArea)
                    //check if method is in blocked list
                    .some(key => key.split('.')[1] === currentMethod)
            )
        } catch (err) {
            // console.log('err: ', err.message);
            return false
        }
    }
}
