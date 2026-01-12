//函數
const getBig = n => +n > 24
const getSmall = n => +n < 25
const getOdd = n => +n % 2 === 1
const getEven = n => +n % 2 === 0
const getSum = str => ((+str[0]) + (+str[1]))
//資料
export const red = ['01', '02', '07', '08', '12', '13', '18', '19', '23', '24', '29', '30', '34', '35', '40', '45', '46']
export const blue = ['03', '04', '09', '10', '14', '15', '20', '25', '26', '31', '36', '37', '41', '42', '47', '48']
export const green = ['05', '06', '11', '16', '17', '21', '22', '27', '28', '32', '33', '38', '39', '43', '44', '49']
export const all = [...red, ...blue, ...green].sort()
export const animal = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪']
// export const animal = ['mark6_t_035', 'mark6_t_036', 'mark6_t_037', 'mark6_t_038', 'mark6_t_039', 'mark6_t_040', 'mark6_t_041', 'mark6_t_042', 'mark6_t_043', 'mark6_t_044', 'mark6_t_045', 'mark6_t_046']
export const frontAnimal = animal.slice(0, 6)
export const backAnimal = animal.slice(6, 12)
export const skyAnimal = ['牛', '兔', '龙', '马', '猴', '猪']
// export const skyAnimal = ['mark6_t_036', 'mark6_t_038', 'mark6_t_039', 'mark6_t_041', 'mark6_t_043', 'mark6_t_046']
export const earthAnimal = ['鼠', '虎', '蛇', '羊', '鸡', '狗']
// export const earthAnimal = ['mark6_t_035', 'mark6_t_037', 'mark6_t_040', 'mark6_t_042', 'mark6_t_044', 'mark6_t_045']
export const poultryName = ['牛', '马', '羊', '鸡', '狗', '猪']
// export const poultryName = ['mark6_t_036', 'mark6_t_041', 'mark6_t_042', 'mark6_t_044', 'mark6_t_045', 'mark6_t_046']
export const beastName = ['鼠', '虎', '龙', '蛇', '兔', '猴']
// export const beastName = ['mark6_t_035', 'mark6_t_037', 'mark6_t_039', 'mark6_t_040', 'mark6_t_038', 'mark6_t_043']
export const oddAnimal = animal.filter((n, i) => i % 2 === 0)
export const evenAnimal = animal.filter((n, i) => i % 2 === 1)
export const big = all.filter(getBig)
export const small = all.filter(getSmall)
export const odd = all.filter(getOdd)
export const even = all.filter(getEven)
export const bigOdd = big.filter(getOdd)
export const bigEven = big.filter(getEven)
export const smallOdd = small.filter(getOdd)
export const smallEven = small.filter(getEven)
export const sumOdd = all.filter(str => getOdd(getSum(str)))
export const sumEven = all.filter(str => getEven(getSum(str)))
export const sumBig = all.filter(str => getSum(str) > 6 && getSum(str) < 13)
export const sumSmall = all.filter(str => getSum(str) < 7)
export const redBig = red.filter(getBig)
export const redSmall = red.filter(getSmall)
export const redOdd = red.filter(getOdd)
export const redEven = red.filter(getEven)
export const blueBig = blue.filter(getBig)
export const blueSmall = blue.filter(getSmall)
export const blueOdd = blue.filter(getOdd)
export const blueEven = blue.filter(getEven)
export const greenBig = green.filter(getBig)
export const greenSmall = green.filter(getSmall)
export const greenOdd = green.filter(getOdd)
export const greenEven = green.filter(getEven)
export const fastGameOrderTitle = [
    // '大', '小', '单', '双', '大单', '大双', '小单', '小双', '合单', '合双', '合大', '合小',
    'mark6_t_023', 'mark6_t_024', 'mark6_t_025', 'mark6_t_026', 'mark6_t_027',
    'mark6_t_028', 'mark6_t_029', 'mark6_t_030', 'mark6_t_031', 'mark6_t_032',
    'mark6_t_064', 'mark6_t_065',
    // '鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪',
    'mark6_t_035', 'mark6_t_036', 'mark6_t_037', 'mark6_t_038', 'mark6_t_039',
    'mark6_t_040', 'mark6_t_041', 'mark6_t_042', 'mark6_t_043', 'mark6_t_044',
    'mark6_t_045', 'mark6_t_046',
    // '红大', '红小', '红单', '红双', '蓝大', '蓝小', '蓝单', '蓝双', '绿大', '绿小', '绿单', '绿双',
    'mark6_t_047', 'mark6_t_048', 'mark6_t_049', 'mark6_t_050', 'mark6_t_051',
    'mark6_t_052', 'mark6_t_053', 'mark6_t_054', 'mark6_t_055', 'mark6_t_056',
    'mark6_t_057', 'mark6_t_058',
    // '红波', '蓝波', '绿波', '家禽', '野兽'
    'mark6_t_017', 'mark6_t_018', 'mark6_t_019',
    'mark6_t_033', 'mark6_t_034'
]
export const fastGameOrderXiaoTitle = [
    // '前肖', '后肖', '天肖', '地肖', '野兽', '家禽', '单', '双'
    'mark6_t_101', 'mark6_t_102', 'mark6_t_103', 'mark6_t_104', 'mark6_t_034',
    'mark6_t_033', 'mark6_t_025', 'mark6_t_026'
]
let data = {}
all.forEach((n) => {
    const r = red.find(i => i === n) ? 'red' : null
    const b = blue.find(i => i === n) ? 'blue' : null
    const g = green.find(i => i === n) ? 'green' : null
    data[n] = r || b || g
})
export const colorData = data
