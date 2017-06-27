/**
 * Created by liushaojie on 2017/6/22.
 */

class PixiEle {
    constructor(ele={}) {
        this.id = ele.Id
        this.elementType = ele.ElementType
        this.w = ele.Width || 43
        this.h = ele.Height || 43
        this.backgroundColor = ele.Background.Color.hex
        this.backgroundAlpha = ele.Background.Color.alpha
        // this.foregroundColor = ele.Foreground.Color.hex
        // this.foregroundAlpha = ele.Foreground.Color.alpha
        this.lineStyle = {
            thickness: Number(ele.Thickness),
            color: ele.Foreground.Color.hex,
            alpha: ele.Foreground.Color.alpha
        }
        this.strokeW = Number(ele.Thickness)
        this.positionPara = {
            position: 'absolute',
            left: ele.X - this.strokeW + 'px',
            top: ele.Y - this.strokeW + 'px',
            transform: 'rotate(' + ele.Rotation + 'deg)'
        }
    }
}

class ShapeEle extends PixiEle {
    constructor(ele={}) {
        super(ele)
        this.geometryType = ele.Geometry.GeometryType
        this.renderer = new PIXI.CanvasRenderer(
            this.w + 2 * this.strokeW, this.h + 2 * this.strokeW, {transparent: true})
        this.stage = new PIXI.Container()
    }

    domify(ele) {
        var w = this.w,
            h = this.h

        var getBasicGraph = (ele) => {
            var graph = new PIXI.Graphics(),
                fillColor = this.backgroundColor,
                lineStyle = this.lineStyle,
                alpha = this.backgroundAlpha,
                strokeW = this.strokeW

            graph.beginFill(fillColor, alpha)
            graph.lineStyle(lineStyle.thickness, lineStyle.color, lineStyle.alpha)
            graph.interactive = true
            graph.cursor = 'pointer'
            graph.position = new PIXI.Point(strokeW, strokeW)
            return graph
        }

        var graph = getBasicGraph(ele),
            adjPoint = function(pointNum, axis) {
                var axisDict = {
                    x: 'ScaleX',
                    y: 'ScaleY'
                }
                var lengthDict = {
                    x: w,
                    y: h
                }
                return Number(ele.Geometry.Adjusts[pointNum][axisDict[axis]]) * lengthDict[axis]
            }

        var line = function() {
            var path = [
                adjPoint(0, 'x'), adjPoint(0, 'y'),
                adjPoint(1, 'x'), adjPoint(1, 'y')
            ]
            graph.drawPolygon(path)
            graph.endFill()
            return graph
        }

        var lineArrowEnd = function(ele) {
            var len = Number(ele.Thickness) * 5,
                theta = Math.atan2((adjPoint(1, 'y') - adjPoint(0, 'y')) , (adjPoint(1, 'x') - adjPoint(0, 'x')))

            var path = [
                adjPoint(0, 'x'), adjPoint(0, 'y'),
                adjPoint(1, 'x'), adjPoint(1, 'y'),
                adjPoint(1, 'x') - len * Math.cos(0.5 - theta), adjPoint(1, 'y') - len * Math.sin(0.5 - theta),
                adjPoint(1, 'x'), adjPoint(1, 'y'),
                adjPoint(1, 'x') - len * Math.cos(0.5 + theta), adjPoint(1, 'y') - len * Math.sin(0.5 + theta),
                adjPoint(1, 'x'), adjPoint(1, 'y')
            ]
            log('path', theta, path)
            graph.drawPolygon(path)
            graph.endFill()
            return graph
        }

        var rectangle = function() {
            graph.drawRect(0, 0, w, h)
            graph.endFill()
            return graph
        }

        var roundRectangle = function() {
            var adjP = Number(ele.Geometry.Adjusts[0].ScaleX)
            graph.drawRoundedRect(0, 0, w, h, w > h ? adjP * h : adjP * w)
            graph.endFill()
            return graph
        }

        var ellipse = function() {
            graph.drawEllipse(w/2, h/2, w/2, h/2)
            graph.endFill()
            return graph
        }

        var triangle = function() {
            var path = [
                0   ,   h,
                w   ,   h,
                w/2 ,   0
            ]
            graph.drawPolygon(path)
            graph.endFill()
            return graph
        }

        var rightTriangle = function() {
            var path = [
                0   ,   h,
                w   ,   h,
                0   ,   0
            ]
            graph.drawPolygon(path)
            graph.endFill()
            return graph
        }

        var rhomboid = function() {
            var path = [
                0       ,   h,
                w*3/4   ,   h,
                w       ,   0,
                w/4     ,   0
            ]
            graph.drawPolygon(path)
            graph.endFill()
            return graph
        }

        var rhombus = function() {
            var path = [
                0       ,   h/2,
                w/2     ,   h,
                w       ,   h/2,
                w/2     ,   0
            ]
            graph.drawPolygon(path)
            graph.endFill()
            return graph
        }

        var trapezoid = function() {
            var path = [
                0       ,   h,
                w       ,   h,
                w*3/4   ,   0,
                w*1/4   ,   0
            ]
            graph.drawPolygon(path)
            graph.endFill()
            return graph
        }

        var polygon = function() {
            // 名字叫多边形, 其实就是个五边形而已
            var path = [
                w/2         ,   0,
                0           ,   h*0.382,
                w*0.191     ,   h,
                w*(1-0.191) ,   h,
                w           ,   h*0.382
            ]
            graph.drawPolygon(path)
            graph.endFill()
            return graph
        }

        var arrowEnd = function() {
            var path = [
                0               , h - adjPoint(0, 'y'),
                adjPoint(1, 'x'), h - adjPoint(0, 'y'),
                adjPoint(1, 'x'), h,

                w               , h / 2,

                adjPoint(1, 'x'), 0,
                adjPoint(1, 'x'), adjPoint(0, 'y'),
                0               , adjPoint(0, 'y'),
            ]
            graph.drawPolygon(path)
            graph.endFill()
            return graph
        }

        var arrowStartEnd = function() {
            var point0x = adjPoint(0, 'x') / 2
            var point1y = adjPoint(1, 'y')
            var path = [
                0               , h/2,
                point0x         , 0,
                point0x         , point1y,
                w - point0x     , point1y,
                w - point0x     , 0,

                w               , h/2,
                w - point0x     , h,
                w - point0x     , h - point1y,
                point0x         , h - point1y,
                point0x         , h
            ]
            graph.drawPolygon(path)
            graph.endFill()
            return graph
        }

        var arrowSwallow = function() {
            var point0y = adjPoint(0, 'y')
            var point1x = adjPoint(1, 'x')
            var path = [
                w/20            , h/2,
                0               , h/20,
                w/10            , h/20,
                w*3/20          , point0y,
                point1x         , point0y,
                point1x         , 0,

                w               , h/2,
                point1x         , h,
                point1x         , h - point0y,
                w*3/20          , h - point0y,
                w/10            , h - h/20,
                0               , h - h/20,
            ]
            graph.drawPolygon(path)
            graph.endFill()
            return graph
        }

        var circleBubble = function() {
            var point0y = adjPoint(0, 'y') / 2 + h / 2,
                point0x = adjPoint(0, 'x'),
                para = 0.55

            var p0 = [w * (0.5 - 0.3535), h * (0.5 + 0.3535)],
                p101 = [w * 0.05, h * (0.5 + 0.25)],
                p102 = [0, h * (0.5 + 0.15)]
            p2 = [0, h / 2],

                p3 = [0, h / 2 * (1 - para)],
                p4 = [w * (1 - para) / 2, 0],
                p5 = [w / 2, 0],

                p6 = [w * (1 + para) / 2, 0],
                p7 = [w, h * (1 - para) / 2],
                p8 = [w, h /2],

                p9 = [w, h * (1 + para) / 2],
                p10 = [w * (1 + para) / 2, h],
                p11 = [w / 2, h]

            p12 = [w * 0.35, h]
            p13 = [w * 0.35, h * 0.95]
            p14 = [w * 0.3, h * 0.97]

            // graph.lineTo(...p0)
            graph.moveTo(...p0)
            graph.bezierCurveTo(...p101, ...p102, ...p2)
            graph.bezierCurveTo(...p3, ...p4, ...p5)
            graph.bezierCurveTo(...p6, ...p7, ...p8)
            graph.bezierCurveTo(...p9, ...p10, ...p11)
            graph.bezierCurveTo(...p12, ...p13, ...p14)
            graph.lineTo(point0x, point0y)
            return graph
        }

        var star = function() {
            var p = [
                    [0.342 * w, 0.328 * h],
                    [0, 0.385 * h],
                    [0.246 * w, 0.642 * h],
                    [0.1895 * w, h]
                ],
                startP = [[w / 2, 0]],
                midP = [[w / 2, 0.835 * h]]
            var pMirror = p.map(function(ele) {
                var eleM = []
                eleM[0] = w - ele[0]
                eleM[1] = ele[1]
                return eleM
            }).reverse()
            var points = startP.concat(p, midP, pMirror)
            var path = []
            points.forEach(function(ele) {
                path.push(...ele)
            })
            graph.drawPolygon(path)
            graph.endFill()
            return graph
        }

        var bracket = function() {
            var point0y = adjPoint(0, 'y')

            graph.bezierCurveTo(0,0,    w,0,    w,point0y/2)
            graph.lineTo(w,h - point0y/2)
            graph.bezierCurveTo(w,h,    0,h,    0,h)

            graph.bezierCurveTo(0,h,    w,h,    w,h - point0y/2)
            graph.lineTo(w,point0y/2)
            graph.bezierCurveTo(w,0,    0,0,    0,0)

            return graph
        }

        var brace = function() {
            var point0y = adjPoint(0, 'y')/2,
                p0 = [w/2, point0y],
                p1 = [w/2, h/2 - point0y],
                p2 = [w/2, h/2 + point0y],
                p3 = [w/2, h - point0y]
            graph.moveTo(w,0)
            graph.bezierCurveTo(w,0,      w/2,0,        ...p0)
            graph.lineTo(       ...p1)
            graph.bezierCurveTo(...p1,    w/2,h/2,      0,h/2)

            graph.bezierCurveTo(0,h/2,    w/2,h/2,      ...p2)
            graph.lineTo(       ...p3)
            graph.bezierCurveTo(...p3,    w/2,h,        w,h)

            graph.bezierCurveTo(w,h,      w/2,h,        ...p3)
            graph.lineTo(       ...p2)
            graph.bezierCurveTo(...p2,    w/2,h/2,      0,h/2)

            graph.bezierCurveTo(0,h/2,    w/2,h/2,      ...p1)
            graph.lineTo(       ...p0)
            graph.bezierCurveTo(...p0,    w/2,0,        w,0)

            return graph
        }

        var flag = function() {
            var point0y = adjPoint(0, 'y') / h,
                p0 = [0.1 * w, h * (point0y - 0.15)],
                p1 = [w      , h * (point0y)],
                p2 = [0.1 * w, h * (point0y + 0.15)]
            var path = [
                0           , 0,
                0.1 * w     , 0,
                ...p0,
                ...p1,
                ...p2,
                0.1 * w     , h,
                0           , h,
            ]
            graph.drawPolygon(path)
            graph.endFill()
            return graph
        }

        var geometryTypeDict = {
            "Line": line,
            "LineArrowEnd": lineArrowEnd,
            "LineArrowStartEnd": line,
            "Rectangle": rectangle,
            "RoundRectangle": roundRectangle,
            "Circle": ellipse,
            "Triangle": triangle,
            "RightTriangle": rightTriangle,
            "Rhomboid": rhomboid,
            "Rhombus": rhombus,
            "Trapezoid": trapezoid,
            "Polygon": polygon,
            "ArrowEnd": arrowEnd,
            "ArrowStartEnd": arrowStartEnd,
            "ArrowSwallow": arrowSwallow,
            "CircleBubble": ellipse,
            "RectangleBubble": roundRectangle,
            "Star": star,
            "Bracket": bracket,
            "Brace": brace,
            "Flag": flag,
            // "FreeShape": rectangle
        }

        var resp = geometryTypeDict[this.geometryType] || rectangle
        var pixiObj = resp(ele)
        this.stage.addChild(pixiObj)
        this.renderer.render(this.stage)

        return this.renderer.view
    }
}

var htmlEle = function(ele) {
    var eleTypeDict = {
        'Shape': ShapeEle,
    }
    var instance = new eleTypeDict[ele.ElementType](ele)
    dom = instance.domify(ele)
    Object.assign(dom.style, instance.positionPara)
    dom.id = this.id

    var div = document.createElement('div')
    div.appendChild(dom)

    return div
}

class SlideEle {
    constructor(slideObj={}) {
        this.h = slideObj.Height
        this.w = slideObj.Width
        this.backgroundColor = slideObj.Background.Color.hex
        this.elements = slideObj.Elements

        this.renderer = new PIXI.CanvasRenderer(this.w, this.h, {backgroundColor: this.backgroundColor})
        this.stage = new PIXI.Container()
    }

    drawBG(slideObj={}) {
        this.renderer.render(this.stage)
        e('.main').appendChild(this.renderer.view)
    }

    drawAll(slideObj={}) {
        var eleArr = this.elements.map(htmlEle)
        eleArr.forEach(function(div, index) {
            e('.main').appendChild(div)
        })
    }

    stepNext(slideObj={}) {

    }

    stepPrev(slideObj={}) {

    }
}