/**
 * Created by liushaojie on 2017/6/19.
 */
log('hello')

var backGroundColor = (obj) => obj.Background.Color.hex
var backGroundAlpha = (obj) => obj.Background.Color.alpha

var pixiEle = (ele) => {
    var Shape = function(ele) {
        var rect = new PIXI.Graphics(),
            color = backGroundColor(ele),
            alpha = backGroundAlpha(ele),
            w = ele.Width,
            h = ele.Height

        log('\nshape param', color, w, h, typeof color, typeof w)
        rect.x = ele.X
        rect.y = ele.Y
        rect.beginFill(color, alpha)
        rect.drawRect(0, 0, w, h)
        rect.endFill()
        return rect
    }

    var eleTypeDict = {
        'Shape': Shape,
    }

    // log(ele.ElementType)
    var resp = eleTypeDict[ele.ElementType]
    var pixiObj = resp(ele)
    return pixiObj
}

var addEleArr = (stage, eleArr) => {
    eleArr.forEach((ele) => {
        // log(ele)
        stage.addChild(ele)
    })
}

var render = function(slideObj) {
    var h = slideObj.Height,
        w = slideObj.Width,
        elements = slideObj.Elements

    var renderer = new PIXI.CanvasRenderer(w, h, {background: backGroundColor(slideObj)})
    var stage = new PIXI.Container()

    var eleArr = elements.map(pixiEle)

    log('eleArr', eleArr)
    e('.main').appendChild(renderer.view);

    addEleArr(stage, eleArr)

    renderer.render(stage)
    renderer.render(stage)
}

var slideResponse = function(data) {
    var slideObj = JSON.parse(data)
    log(slideObj)
    render(slideObj)
}

getAjax('/slides', slideResponse)
