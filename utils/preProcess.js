let tm = require("topmodel4ts");
let addElementType = require('./addElementType.js')
let deepColorConvert = require('./deepColorConvert.js')
let deepCoordinateConvert = require('./deepCoordinateConvert.js')
let { log } = require('./utils.js')

//================================================
// 演示如何将 json 字符串转换为 Slide 对象
// 并将 slide 对象里的颜色值替换为 {alpha, hex}
let preProcess = (path, windowSize) => {
    // log('debug size', windowSize)
    // log(process.cwd())
    let data = require(process.cwd()+path);
    let jsonStr = JSON.stringify(data);

    // log('\n data', typeof data, data)
    // log('json', typeof jsonStr, jsonStr)

// 去掉最外一层{}: 因为json的格式和tm转换要求的格式不一致
    jsonStr = jsonStr.split('{"Slide":').join('').slice(0, -1)
    let slide = tm.Slide.decode(jsonStr);
    // log('json', typeof jsonStr, jsonStr)
    // log('debug slide : \n', slide.Elements.map((ele, key) => ele.__proto__.constructor.saveName))
    addElementType(slide)
    log('\ndebug ElementType : \n', slide.Elements.map((ele, key) => ele.ElementType))

    deepColorConvert(slide)
    deepCoordinateConvert(slide, windowSize)

    // log('\n debug slide : \n', JSON.stringify(slide, null, 4))
    return slide
}

// preProcess()

module.exports = preProcess
