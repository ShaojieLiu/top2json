/**
 * Created by liushaojie on 2017/6/19.
 */

var slideResponse = function(data) {
    var slideObj = JSON.parse(data)
    log(slideObj)

    var s = new SlideEle(slideObj)
    s.drawBG()
    s.drawAll()
}

// var windowSize = 'w=' + window.screen.width + '&' + 'h=' + window.screen.height
// var windowSize = 'w=' + window.screen.width + '&' + 'h=' + window.screen.width / 1.778
var windowSize = 'w=960&h=540'
log('windowSize', windowSize)
var slidePath = '/db/json_data1/Slide_2.json'
var url = '/slides' + '?' + windowSize +
    '&' + 'slidePath=' + slidePath

getAjax(url, slideResponse)
