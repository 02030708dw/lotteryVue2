export const formatVNBingoCode = (string = '') => {
    let control = null
    // 南、中(18)
    const controlSouthCenter = {
        8: { index: 0, limit: 1 },
        7: { index: 1, limit: 1 },
        6: { index: 2, limit: 3 },
        5: { index: 5, limit: 1 },
        4: { index: 6, limit: 7 },
        3: { index: 13, limit: 2 },
        2: { index: 15, limit: 1 },
        1: { index: 16, limit: 1 },
        0: { index: 17, limit: 1 },
    }
    // 北部(27)
    const controlNorth = {
        7: { index: 0, limit: 4 },
        6: { index: 4, limit: 3 },
        5: { index: 7, limit: 6 },
        4: { index: 13, limit: 4 },
        3: { index: 17, limit: 6 },
        2: { index: 23, limit: 2 },
        1: { index: 25, limit: 1 },
        0: { index: 26, limit: 1 },
    }
    const splitString = string.split(',')
    if (splitString.length <= 1) return string
    control = splitString.length === 18 ? controlSouthCenter : controlNorth
    const result = []
    for (let i = Object.values(control).length - 1; i >= 0; i--) {
        const child = []
        for (let j = control[i].index; j < control[i].index + control[i].limit; j++) {
            child.push(splitString[j])
        }
        result.push(child)
    }
    return result
}
