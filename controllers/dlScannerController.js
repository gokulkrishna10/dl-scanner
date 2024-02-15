const extractImageDataDa0 = require('../dao/dlScannerDAO')

exports.extractImageData = async function (req, callback) {
    await extractImageDataDa0.extractImageData(req, (err, result) => {
        if (err) {
            callback(err, null)
        } else {
            callback(null, result)
        }
    })
}