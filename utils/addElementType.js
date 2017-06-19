/**
 * Created by liushaojie on 2017/6/19.
 */

let addElementType = function(slide) {
    slide.Elements.forEach((ele, key) => Object.assign(ele, {
        ElementType: ele.__proto__.constructor.saveName
    }))
}

module.exports = addElementType
