let tm = require("topmodel4ts");
let data = require("./src/json_data/slide_1_test.json");
let deepColorConvert = require('./utils/deepColorConvert.js')

let log = (...args) => console.log(...args)
//================================================
// 演示如何将 json 字符串转换为 Slide 对象
// 并将 slide 对象里的颜色值替换为 {alpha, hex}
{
    // log('data', data)
    let jsonStr = JSON.stringify(data);
    // log('json', jsonStr)
    // log('tm', tm)
    let slide = tm.Slide.decode(jsonStr);
    // log('debug slide : \n', slide.Elements.map((ele, key) => ele.__proto__.constructor.saveName))
    slide.Elements.forEach((ele, key) => Object.assign(ele, {ElementType: ele.__proto__.constructor.saveName}))
    let prop = slide.Elements[0].Background
    log('debug __proto__ : \n', prop.__proto__.constructor.saveName)
    log('debug color : \n', prop)
    log('debug color : \n', prop.Color)
    deepColorConvert(slide)
    // log('debug color : \n', prop.__proto__)
    // log('debug color : \n', prop)
    // log('debug color : \n', prop.Color)
    // log('debug slide : \n', slide.Elements.map((ele, key) => ele))
    // log('debug slide : \n', slide.Elements)
    // log('debug slide : \n', Object.keys(slide))
    log('debug slide : \n', JSON.stringify(slide, null, 4))
}
