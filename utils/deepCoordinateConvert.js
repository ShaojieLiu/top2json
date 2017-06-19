/**
 * Created by liushaojie on 2017/6/16.
 */

let deepCoordinateConvert = function(slide, browserSize) {
    // console.log('deepCoordinateConvert begin')

    if (slide && browserSize) {
        let w = browserSize.browserWidth,
            h = browserSize.browserHeight,
            slideW = slide.Width,
            slideH = slide.Height,
            processDict = {
                Width: (val) => Number((val / slideW * w).toFixed(2)),
                Height: (val) => Number((val / slideH * h).toFixed(2)),
                X: (val) => Number((val / slideW * w).toFixed(2)),
                Y: (val) => Number((val / slideH * h).toFixed(2)),
            }
        // console.log(Object.keys(processDict))

        let subConvert = function(object) {


            for (let property in object) {
                if (object.hasOwnProperty(property) && (object[property] !== undefined)) {
                    let sub = object[property],
                        className = sub.__proto__.constructor.saveName
                        // console.log(property)
                    if (property === 'RotateOrigin') {
                        return false
                    } else if (typeof sub === 'object') {
                        // console.log('---------------------oneMoreTime')
                        subConvert(sub)
                    } else if (Object.keys(processDict).includes(property)) {
                        // console.log('***************************debug: \n', sub)
                        object[property] = processDict[property](sub)
                        // console.log('debug: \n', sub)
                    }
                }
            }

            return object
        }

        subConvert(slide)

        return slide
    }


}

module.exports = deepCoordinateConvert