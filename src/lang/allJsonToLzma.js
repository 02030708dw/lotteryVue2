/**
 * 把 public\language 底下的所有 [lang].json 打包變成 [lagn]_all.json
 * ex: cd gameclient/vue  && yarn alljson
 * 新增語系的時候記得加入 data 裏頭
 */
const fs = require('fs')
const lzma = require('lzma')

//load files
const folder = '..\\public\\language\\'
const dirFn = (err, files) => {
    if (err) throw err
    files
        .filter(f => /_all\.json$/.test(f))
        .forEach(f => {
            fs.readFile(folder + f, (err, data) => {
                if (err) throw err
                data = lzma.compress(data)
                fs.writeFileSync(folder + f.replace('json', 'text'), data)
                console.log(f, 'LZMA壓縮完成')
            })
        })
}
fs.readdir(folder, dirFn)
