/**
 * 把 public\language 底下的所有 [lang].json 打包變成 [lagn]_all.json
 * ex: cd gameclient/vue  && yarn alljson
 * 新增語系的時候記得加入 data 裏頭
 */
const fs = require('fs')

//load files
const folder = '..\\public\\language'
let data = {
    cn: '',
    en: '',
    jp: ''
}

loopFolder(folder, (filePath, fileName) => {
    let file = fs.readFileSync(filePath + '\\' + fileName, 'utf8')
    // 去除頭尾大括號,加逗點
    file = file.replace(/^{/, '')
    file = file.substr(0, file.length - 1) + ','
    let lang = fileName.split('.')[0]
    try {
        if (Object.keys(data).indexOf(lang) >= 0) {
            console.log('add:', filePath + '/' + fileName)
            data[lang] = data[lang] + file
        }
    } catch (e) {
        console.log('Zip json error:', e)
    }
})

function loopFolder(folder, readFile) {
    fs.readdirSync(folder).forEach(item => {
        let isDir = fs.lstatSync(folder + '\\' + item).isDirectory()
        if (isDir) {
            loopFolder(folder + '\\' + item, readFile)
        } else {
            readFile(folder, item)
        }
    })
}

//output json
for (let lang in data) {
    // 去除尾巴逗點
    data[lang] = '{' + data[lang].substr(0, data[lang].length - 1) + '}'
    fs.writeFileSync('..\\public\\language' + '/' + lang + '_all.json', data[lang])
}