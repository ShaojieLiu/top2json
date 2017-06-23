/**
 * Created by liushaojie on 2017/6/19.
 */

var render = function(slideObj) {
    var h = slideObj.Height,
        w = slideObj.Width,
        elements = slideObj.Elements

    var renderer = new PIXI.CanvasRenderer(w, h, {backgroundColor: backgroundColor(slideObj)})
    var stage = new PIXI.Container()
    renderer.render(stage)
// log('slideObj', slideObj)
    // log('eleGeometryType', elements.map((ele) => ele.Geometry.GeometryType))
    var eleArr = elements.map(pixiEle)

    // log('eleArr', eleArr)
    e('.main').appendChild(renderer.view)
    eleArr.forEach(function(ele, index) {
        var div = document.createElement('div')
        div.appendChild(ele.view)
        e('.main').appendChild(div)
    })
    // addEleArr(stage, eleArr)

}

var slideResponse = function(data) {
    var slideObj = JSON.parse(data)
    log(slideObj)
    render(slideObj)
}

// var windowSize = 'w=' + window.screen.width + '&' + 'h=' + window.screen.height
// var windowSize = 'w=' + window.screen.width + '&' + 'h=' + window.screen.width / 1.778
var windowSize = 'w=960&h=540'
log('windowSize', windowSize)
var slidePath = '/db/json_data1/Slide_0.json'
var url = '/slides' + '?' + windowSize +
    '&' + 'slidePath=' + slidePath

getAjax(url, slideResponse)
