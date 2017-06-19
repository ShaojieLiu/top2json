/**
 * Created by liushaojie on 2017/6/16.
 */

let rgba2HexNum = function(rgbaStr) {
    let str = rgbaStr,
        head = 'rgba(',
        result = {},
        str2hex = function(str) {
            let hex = Number(str).toString(16)
            hex = hex.length === 2 ? hex : '0' + hex
            return hex
        }

    if (str.startsWith(head)) {
        let colorArr = str.split(head)[1].split(')')[0].split(',').map((ele) => ele.trim())
        result.alpha = Number(colorArr.pop())
        let hex = '0x' + colorArr.map((value) => str2hex(value)).join('')
        result.hex = Number(hex)
    } else {
        console.log('Wrong Color Type Inputted !')
    }

    return result
    // console.log(result)
    // console.log(str2hex('12'))
}
// rgbaToHex('rgba(92,129,204,1)')
module.exports = rgba2HexNum
