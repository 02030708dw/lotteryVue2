var obj = require('./files')
var fs = require('fs')
const objKeyArr = Object.keys(obj)
objKeyArr.forEach(key => {
    const path = `./e2e/flow/games/ssc/methods/${key}.js`
    const data = `//${obj[key].title}
export default [
    {
        key: '切換${obj[key].title}',
        fn: async () => {
            const dom = '.game_submenu > div > span:nth-child(2)'
            await page.waitFor(dom, { visible: true })
            await page.click(dom)
        }
    },
    {
        key: '${obj[key].title}全投',
        fn: async () => {
            const dom =
                'div.ball_section:nth-child($1) > div.ball_control > ul > li:nth-child(1)'
            await page.waitFor(250)
            ;[...Array(5).keys()].forEach(
                async i => await page.click(dom.replace('$1', i + 1))
            )
            await page.click('.controls_area_btn .c_button--secondary')
        }
    },
    {
        key: '${obj[key].title}隨機一注',
        fn: async () => {
            await page.click('.header.u_clearfix button:nth-child(2)')
        }
    },
    {
        key: '${obj[key].title}隨機五注',
        fn: async () => {
            await page.click('.header.u_clearfix button:nth-child(3)')
        }
    },
    {
        key: '注單金額正確',
        fn: async () => {
            const obj = await page.evaluate(() => ({
                num: document.querySelector(
                    '.controls_total.u_clearfix > span:nth-child(2) > strong'
                ).innerHTML,
                total: document.querySelector(
                    '.controls_total.u_clearfix > span:nth-child(3) > strong'
                ).innerHTML
            }))
            expect(obj.num).toBe('100,006')
            expect(obj.total).toBe('200,012')
            //清除
            await page.click('.header.u_clearfix > div > button:nth-child(1)')
        }
    }
]
`
    fs.writeFile(path, data, err => {
        if (err) {
            console.log(err)
        }
    })
})
