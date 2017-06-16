/**
 * Created by liushaojie on 2017/6/16.
 */
let rgba2HexNum = require('./rgba2HexNum.js')

let deepColorConvert = function(object) {
    if (object) {
        for (let property in object) {
            if (object.hasOwnProperty(property) && (object[property] !== undefined)) {
                let sub = object[property],
                    className = sub.__proto__.constructor.saveName

                if (typeof sub === 'object' && className !== 'ColorBrush') {
                    deepColorConvert(sub)
                } else if (sub.__proto__.constructor.saveName === 'ColorBrush') {
                    // console.log('***************************debug: \n', sub.Color)
                    sub.Color = rgba2HexNum(sub.Color)
                }
            }
        }
    }
    return object
}

module.exports = deepColorConvert
